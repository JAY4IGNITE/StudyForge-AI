import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ChevronRight, BarChart3, TrendingUp, History, X } from 'lucide-react';
import { atsService, Resume, AtsReport } from '../services/atsService';
import { Button } from '../components/ui/button';


export default function AtsDashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [jobText, setJobText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'analyzing' | 'completed' | 'error'>('idle');
  const [report, setReport] = useState<AtsReport | null>(null);
  const [history, setHistory] = useState<AtsReport[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const data = await atsService.getHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) {
      setErrorMsg('Please select a resume file.');
      return;
    }
    if (!jobText.trim()) {
      setErrorMsg('Please paste a job description.');
      return;
    }

    try {
      setErrorMsg('');
      setStatus('uploading');
      
      // Upload & Parse
      const resume = await atsService.uploadResume(file);
      
      setStatus('analyzing');
      const analysis = await atsService.analyzeResume(resume.id, jobText);
      
      setReport(analysis);
      setStatus('completed');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.response?.data?.detail || 'An error occurred during scanning.');
      setStatus('error');
    }
  };

  const renderProgress = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
    >
      <div className="relative w-24 h-24 mb-6">
        <svg className="animate-spin w-full h-full text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">
        {status === 'uploading' && 'Uploading Document...'}
        {status === 'parsing' && 'Extracting Text & Entities...'}
        {status === 'analyzing' && 'Running ATS AI Analysis...'}
      </h3>
      <p className="text-gray-400 max-w-sm text-center">
        Our deterministic engine is comparing your resume against the job description using natural language processing.
      </p>
    </motion.div>
  );

  const renderResults = () => {
    if (!report) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl mx-auto space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">ATS Analysis Report</h2>
          <Button variant="outline" onClick={() => setStatus('idle')} className="text-white border-white/20 hover:bg-white/10">
            Scan Another
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 rounded-3xl border border-indigo-500/30 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BarChart3 size={100} />
            </div>
            <p className="text-indigo-200 text-sm font-semibold tracking-wider uppercase mb-4 z-10">Overall Match</p>
            <div className="relative flex items-center justify-center z-10">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="96" cy="96" r="88" 
                  stroke="url(#gradient)" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="553"
                  strokeDashoffset={553 - (553 * report.overall_score) / 100}
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * report.overall_score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-white">
                <span className="text-5xl font-black">{Math.round(report.overall_score)}</span>
                <span className="text-sm text-indigo-200">/ 100</span>
              </div>
            </div>
            {report.confidence < 0.8 && (
              <p className="mt-4 text-xs text-yellow-400 flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-full z-10">
                <AlertTriangle size={12} /> Low confidence reading
              </p>
            )}
          </div>

          {/* Breakdown */}
          <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-6">Score Breakdown</h3>
            <div className="space-y-5">
              <ScoreBar label="Keyword Match" score={report.keyword_score} color="bg-blue-500" />
              <ScoreBar label="Semantic Relevance" score={report.semantic_score} color="bg-purple-500" />
              <ScoreBar label="ATS Formatting" score={report.formatting_score} color="bg-green-500" />
              <ScoreBar label="Resume Completeness" score={report.completeness_score} color="bg-orange-500" />
              <ScoreBar label="Impact & Metrics" score={report.impact_score} color="bg-rose-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" /> Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.matched_keywords.length > 0 ? report.matched_keywords.map((k, i) => (
                <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-500/30">
                  {k}
                </span>
              )) : <span className="text-gray-400 text-sm">No specific skills matched.</span>}
            </div>
            
            <h3 className="text-lg font-semibold text-white mt-8 mb-4 flex items-center gap-2">
              <X size={20} className="text-rose-400" /> Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.missing_keywords.length > 0 ? report.missing_keywords.map((k, i) => (
                <span key={i} className="px-3 py-1 bg-rose-500/20 text-rose-300 text-sm rounded-full border border-rose-500/30">
                  {k}
                </span>
              )) : <span className="text-gray-400 text-sm">No missing skills detected!</span>}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400" /> Top Improvements
            </h3>
            <ul className="space-y-4">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 items-start bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            {report.warnings.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} /> Warnings
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {report.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-yellow-200/70">{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderUpload = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8"
    >
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col justify-center relative group overflow-hidden hover:border-indigo-500/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <UploadCloud size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upload Resume</h3>
              <p className="text-sm text-gray-400 mt-1">Drag & Drop PDF or DOCX</p>
            </div>
            <label className="cursor-pointer bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Choose File
              <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
            </label>
            {file && (
              <div className="flex items-center gap-2 text-sm text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20 w-full justify-center">
                <FileText size={16} /> <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Target Job Description</h3>
          <textarea 
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none min-h-[200px]"
          />
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} /> {errorMsg}
            </div>
          )}
          <Button 
            onClick={handleScan}
            disabled={!file || !jobText.trim()}
            className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Run ATS Scan <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderHistory = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400 tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Resume ID / Date</th>
              <th className="px-6 py-4 font-semibold text-center">Score</th>
              <th className="px-6 py-4 font-semibold">Job Reference</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {history.map((h, i) => (
              <tr key={h.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">{h.resume_id.substring(0,14)}...</div>
                  <div className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${h.overall_score > 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : h.overall_score > 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {Math.round(h.overall_score)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-400 line-clamp-2 max-w-xs">{h.job_description_text.substring(0, 60)}...</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="ghost" 
                    className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 text-xs"
                    onClick={() => {
                      setReport(h);
                      setStatus('completed');
                    }}
                  >
                    View Report
                  </Button>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No scan history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12 px-4 selection:bg-indigo-500/30">
      {status === 'idle' || status === 'error' ? (
        <>
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4 tracking-tight">
              AI Resume ATS Scanner
            </h1>
            <p className="text-gray-400 text-lg">
              Check your resume against ATS algorithms before applying. Discover missing keywords and boost your score.
            </p>
            
            <div className="flex gap-4 mt-8 border-b border-white/10 pb-4">
              <button 
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-all ${activeTab === 'upload' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <UploadCloud size={18} /> New Scan
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <History size={18} /> History
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'upload' ? renderUpload() : renderHistory()}
          </AnimatePresence>
        </>
      ) : status === 'completed' ? (
        renderResults()
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          {renderProgress()}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="text-white font-bold">{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
