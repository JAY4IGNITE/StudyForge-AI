import re
from typing import Dict, Any

class VoiceVisionAnalyzer:
    FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "sort of", "kind of"]

    @staticmethod
    def analyze_audio_transcript(transcript: str, duration_seconds: float) -> Dict[str, Any]:
        """
        Calculates speaking speed (WPM), filler word count, pause estimation, and speech clarity.
        """
        if not transcript or duration_seconds <= 0:
            return {
                "speaking_speed_wpm": 0.0,
                "pause_count": 0,
                "filler_word_count": 0,
                "speech_clarity_score": 100.0,
                "recommendation": "Optimal pacing."
            }

        words = re.findall(r'\b\w+\b', transcript.lower())
        word_count = len(words)
        minutes = duration_seconds / 60.0
        wpm = round(word_count / minutes, 1) if minutes > 0 else 0.0

        filler_count = 0
        transcript_lower = transcript.lower()
        for filler in VoiceVisionAnalyzer.FILLER_WORDS:
            filler_count += len(re.findall(r'\b' + re.escape(filler) + r'\b', transcript_lower))

        # Estimate clarity score based on filler word density & WPM
        clarity = 100.0 - min(30.0, (filler_count * 5.0))
        if wpm > 180:
            clarity -= 10.0
            recommendation = "Pacing is slightly fast. Try pausing between technical concepts."
        elif wpm < 90 and word_count > 5:
            clarity -= 10.0
            recommendation = "Pacing is a bit slow. Try to maintain a steady flow."
        elif filler_count > 3:
            recommendation = "Noticeable filler words detected. Practice deliberate pausing instead of filler words."
        else:
            recommendation = "Excellent pacing, clarity, and articulation."

        return {
            "speaking_speed_wpm": wpm,
            "pause_count": max(1, int(duration_seconds // 8)),
            "filler_word_count": filler_count,
            "speech_clarity_score": max(50.0, clarity),
            "recommendation": recommendation
        }

voice_vision_analyzer = VoiceVisionAnalyzer()
