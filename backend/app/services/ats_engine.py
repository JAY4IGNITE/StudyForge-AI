import re
import json
import numpy as np
from typing import Dict, List, Any, Tuple
from collections import defaultdict
from app.schemas.resume import ParsedResume
from app.schemas.ats import JobDescriptionSchema, AtsAnalysisResponse, AtsScoreBreakdown
from app.services.ai_interview_engine import ai_interview_engine
from app.core.logging import logger

try:
    from sentence_transformers import SentenceTransformer
    # We load a small model for fast CPU inference
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
except ImportError:
    embedder = None
    logger.warning("SentenceTransformer not installed. Semantic matching will fallback to basic exact matching.")

class AtsEngineService:
    def __init__(self):
        # Keyword Normalization dictionary
        self.aliases = {
            "react.js": "react",
            "reactjs": "react",
            "react js": "react",
            "node.js": "node.js",
            "nodejs": "node.js",
            "node js": "node.js",
            "node": "node.js",
            "vue.js": "vue",
            "vuejs": "vue",
            "postgresql": "postgres",
            "golang": "go",
            "k8s": "kubernetes",
            "aws": "amazon web services"
        }
        
    def _normalize_keyword(self, keyword: str) -> str:
        k = keyword.lower().strip()
        return self.aliases.get(k, k)

    def _extract_all_resume_text(self, resume: ParsedResume) -> str:
        text = resume.summary + " " + " ".join(resume.skills)
        for exp in resume.experience:
            text += f" {exp.title} {exp.description} " + " ".join(exp.bullets)
        for proj in resume.projects:
            text += f" {proj.name} {proj.description} " + " ".join(proj.technologies) + " ".join(proj.bullets)
        return text.lower()
        
    def calculate_keyword_score(self, resume: ParsedResume, jd: JobDescriptionSchema) -> Tuple[float, List[str], List[str]]:
        resume_text = self._extract_all_resume_text(resume)
        
        # We also extract a normalized set of single/double words from the resume for fast lookup
        resume_words = set(re.findall(r'\b\w+\b', resume_text))
        # Adding some bi-grams manually or just rely on regex search
        
        matched = []
        missing = []
        
        total_weight = 0
        earned_weight = 0
        
        # High weight for required skills
        for skill in set(jd.required_skills):
            total_weight += 2.0
            norm_skill = self._normalize_keyword(skill)
            
            # Simple word boundary regex search in the full lowercase resume text
            # Escaping the skill just in case it has + or .
            pattern = r'\b' + re.escape(norm_skill) + r'\b'
            if re.search(pattern, resume_text):
                earned_weight += 2.0
                matched.append(skill)
            else:
                missing.append(skill)

        # Medium weight for preferred skills
        for skill in set(jd.preferred_skills):
            total_weight += 1.0
            norm_skill = self._normalize_keyword(skill)
            pattern = r'\b' + re.escape(norm_skill) + r'\b'
            if re.search(pattern, resume_text):
                earned_weight += 1.0
                matched.append(skill)
            else:
                missing.append(skill)
                
        # Also include technologies
        for tech in set(jd.technologies):
            if tech not in matched and tech not in missing:
                total_weight += 1.0
                norm_tech = self._normalize_keyword(tech)
                pattern = r'\b' + re.escape(norm_tech) + r'\b'
                if re.search(pattern, resume_text):
                    earned_weight += 1.0
                    matched.append(tech)
                else:
                    missing.append(tech)

        if total_weight == 0:
            return 100.0, matched, missing
            
        score = (earned_weight / total_weight) * 100.0
        return min(score, 100.0), matched, missing

    def _cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
            return 0.0
        return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2)))

    def calculate_semantic_score(self, resume: ParsedResume, jd: JobDescriptionSchema) -> float:
        if not embedder:
            return 0.0
            
        jd_responsibilities_text = " ".join(jd.responsibilities)
        jd_reqs_text = " ".join(jd.required_skills + jd.technologies)
        
        resume_exp_text = " ".join([e.description or "" + " ".join(e.bullets) for e in resume.experience])
        resume_proj_text = " ".join([p.description or "" + " ".join(p.bullets) for p in resume.projects])
        resume_skills_text = " ".join(resume.skills)
        resume_summary_text = resume.summary
        
        if not jd_responsibilities_text.strip() and not jd_reqs_text.strip():
            return 100.0
            
        # Section level comparisons
        scores = []
        if jd_responsibilities_text.strip():
            jd_resp_emb = embedder.encode(jd_responsibilities_text)
            if resume_exp_text.strip():
                exp_emb = embedder.encode(resume_exp_text)
                scores.append(self._cosine_similarity(jd_resp_emb, exp_emb))
            if resume_proj_text.strip():
                proj_emb = embedder.encode(resume_proj_text)
                scores.append(self._cosine_similarity(jd_resp_emb, proj_emb))
                
        if jd_reqs_text.strip():
            jd_req_emb = embedder.encode(jd_reqs_text)
            if resume_skills_text.strip():
                skills_emb = embedder.encode(resume_skills_text)
                scores.append(self._cosine_similarity(jd_req_emb, skills_emb))
                
        if jd.title.strip() and resume_summary_text.strip():
            jd_title_emb = embedder.encode(jd.title)
            summary_emb = embedder.encode(resume_summary_text)
            scores.append(self._cosine_similarity(jd_title_emb, summary_emb))
            
        if not scores:
            return 50.0 # Baseline if not enough text to compare
            
        # Average cosine similarity shifted to 0-100 scale. Cosine sim is usually 0 to 1 for text embeddings.
        avg_sim = sum(scores) / len(scores)
        
        # Scaling trick: similarity of 0.4+ is often quite related in these models.
        # We map 0.3 -> 50, 0.6 -> 100
        score = max(0, min(100, (avg_sim - 0.2) * (100 / 0.5))) 
        return score

    def calculate_formatting_score(self, resume: ParsedResume) -> Tuple[float, List[str]]:
        warnings = []
        score = 100.0
        
        if resume.ocr_used:
            score -= 15.0
            warnings.append("OCR was required. Formatting may not be ATS-friendly.")
            
        if resume.parse_quality < 0.8:
            score -= 10.0
            warnings.append("Text extraction problems detected. Resume might have complex layouts or columns.")
            
        if len(resume.raw_text.strip()) < 200:
            score -= 30.0
            warnings.append("Resume contains very little extractable text.")
            
        # Check standard sections
        has_summary = bool(resume.summary)
        has_exp = len(resume.experience) > 0 or "experience" in resume.raw_text.lower()
        has_edu = len(resume.education) > 0 or "education" in resume.raw_text.lower()
        
        if not has_exp:
            score -= 10.0
            warnings.append("Missing Experience section heading.")
        if not has_edu:
            score -= 10.0
            warnings.append("Missing Education section heading.")
            
        return max(score, 0.0), warnings

    def calculate_completeness_score(self, resume: ParsedResume) -> float:
        score = 100.0
        
        if not resume.contact.get("raw"):
            score -= 20.0
            
        if not resume.summary:
            score -= 10.0
            
        if not resume.experience and not resume.projects:
            score -= 30.0
            
        if not resume.education:
            score -= 15.0
            
        if not resume.skills:
            score -= 15.0
            
        return max(score, 0.0)

    def calculate_impact_score(self, resume: ParsedResume) -> float:
        # Analyze bullets for action verbs and metrics
        all_bullets = []
        for exp in resume.experience:
            all_bullets.extend(exp.bullets)
            if exp.description:
                all_bullets.append(exp.description)
        for proj in resume.projects:
            all_bullets.extend(proj.bullets)
            if proj.description:
                all_bullets.append(proj.description)
                
        if not all_bullets:
            # Maybe they didn't use bullet points. We'll search raw text for % and $ and numbers
            metrics = re.findall(r'(\d+%|\$\d+|\d+[kKmM]|increased|reduced|achieved)', resume.raw_text.lower())
            if len(metrics) > 3:
                return 80.0
            return 50.0
            
        action_verbs = {"developed", "created", "led", "managed", "designed", "built", "implemented", "increased", "reduced", "achieved", "improved", "architected"}
        
        strong_bullets = 0
        for bullet in all_bullets:
            b_lower = bullet.lower()
            has_verb = any(verb in b_lower for verb in action_verbs)
            has_metric = bool(re.search(r'(\d+%|\$\d+|\d+[kKmM])', b_lower))
            
            if has_verb and has_metric:
                strong_bullets += 2
            elif has_verb:
                strong_bullets += 1
                
        # 10 strong bullets or equivalent gives 100%
        score = (strong_bullets / 10.0) * 100.0
        return min(score, 100.0)

    def calculate_confidence(self, resume: ParsedResume, jd: JobDescriptionSchema, breakdown: AtsScoreBreakdown) -> float:
        confidence = 1.0
        
        if resume.ocr_used:
            confidence -= 0.15
            
        if resume.parse_quality < 0.8:
            confidence -= 0.10
            
        if len(jd.required_skills) == 0 and len(jd.responsibilities) == 0:
            confidence -= 0.20 # JD is too short
            
        if len(resume.raw_text.strip()) < 500:
            confidence -= 0.15 # Resume is very short
            
        return max(confidence, 0.1)

    async def _generate_nim_recommendations(self, resume: ParsedResume, jd: JobDescriptionSchema, breakdown: AtsScoreBreakdown, matched: List[str], missing: List[str]) -> List[str]:
        prompt = f"""
You are an expert Career Coach and ATS optimizer.
Review the following ATS scoring breakdown for a candidate applying to: {jd.title}

Scores:
- Keyword Match: {breakdown.keyword_score:.1f}/100
- Semantic Relevance: {breakdown.semantic_score:.1f}/100
- Format/ATS Friendliness: {breakdown.formatting_score:.1f}/100
- Resume Completeness: {breakdown.completeness_score:.1f}/100
- Impact/Metrics: {breakdown.impact_score:.1f}/100

Matched Skills: {", ".join(matched[:20])}
Missing Skills: {", ".join(missing[:20])}

Generate EXACTLY 5 clear, actionable recommendations (1 sentence each) for the candidate to improve their resume for this specific job.
Focus on missing keywords, weak impact statements, and formatting issues if their scores are low.
Respond ONLY with a JSON array of strings (no markdown blocks). Example:
["Add Docker to your skills section.", "Quantify your impact in the backend developer role with percentages."]
"""
        raw = await ai_interview_engine._call_nvidia_nim([{"role": "user", "content": prompt}], temperature=0.3)
        try:
            cleaned = raw.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            
            recs = json.loads(cleaned.strip())
            if isinstance(recs, list) and len(recs) > 0:
                return recs[:5]
            return ["Review the job description closely and incorporate missing keywords."]
        except Exception as e:
            logger.error(f"Failed to generate NIM recommendations: {e}")
            return [
                f"Consider adding missing required skills like: {', '.join(missing[:3])}.",
                "Quantify your achievements with numbers and percentages.",
                "Ensure your job titles clearly align with the job description."
            ]

    async def analyze(self, resume: ParsedResume, jd: JobDescriptionSchema) -> AtsAnalysisResponse:
        # Phase 11 - Keyword
        keyword_score, matched, missing = self.calculate_keyword_score(resume, jd)
        
        # Phase 12 - Semantic
        semantic_score = self.calculate_semantic_score(resume, jd)
        
        # Phase 13 - Formatting
        formatting_score, format_warnings = self.calculate_formatting_score(resume)
        
        # Phase 14 - Completeness
        completeness_score = self.calculate_completeness_score(resume)
        
        # Phase 15 - Impact
        impact_score = self.calculate_impact_score(resume)
        
        breakdown = AtsScoreBreakdown(
            keyword_score=keyword_score,
            semantic_score=semantic_score,
            formatting_score=formatting_score,
            completeness_score=completeness_score,
            impact_score=impact_score
        )
        
        # Phase 10 - Overall ATS Score
        overall_score = (
            keyword_score * 0.35 +
            semantic_score * 0.25 +
            formatting_score * 0.20 +
            completeness_score * 0.10 +
            impact_score * 0.10
        )
        
        # Phase 16 - Confidence
        confidence = self.calculate_confidence(resume, jd, breakdown)
        
        warnings = list(set(resume.warnings + format_warnings))
        
        # Phase 17 - NIM Explanations/Recommendations
        recommendations = await self._generate_nim_recommendations(resume, jd, breakdown, matched, missing)
        
        return AtsAnalysisResponse(
            overall_score=overall_score,
            confidence=confidence,
            parse_quality=resume.parse_quality,
            breakdown=breakdown,
            matched_keywords=matched,
            missing_keywords=missing,
            warnings=warnings,
            recommendations=recommendations
        )

ats_engine_service = AtsEngineService()
