import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { LandingSection } from './components/LandingSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SkillEvidenceTable } from './components/SkillEvidenceTable';
import { RecommendedLearning } from './components/RecommendedLearning';
import { InterviewTopics } from './components/InterviewTopics';
import { Chatbot } from './components/Chatbot';
import { analyzeResume, checkHealth } from './services/api';
import { ShieldCheck, Sparkles, BrainCircuit } from 'lucide-react';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  useEffect(() => {
    // Initial health check
    checkHealth().then(res => {
      setIsBackendOnline(res && res.status === 'ok');
    });
  }, []);

  const handleAnalyze = async ({ file, resumeText, jobDescription }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeResume({ file, resumeText, jobDescription });
      setAnalysisData(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      const errMsg = err.response?.data?.error || err.message || "Failed to analyze resume. Please check server connection.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        onReset={handleReset} 
        hasResults={!!analysisData} 
        isBackendOnline={isBackendOnline} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {!analysisData && !isLoading && (
          <LandingSection 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            error={error} 
          />
        )}

        {/* Loading Animated State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Extracting & Verifying Resume Data...</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Google Gemini API is analyzing skills against the Job Description and extracting evidence.
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Checking skill evidence, experience relevance & missing requirements</span>
            </div>
          </div>
        )}

        {/* Results Dashboard View */}
        {analysisData && !isLoading && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* 1. Results Header & Score */}
            <ResultsDashboard data={analysisData} />

            {/* 2. Skill Evidence Matrix Table */}
            <SkillEvidenceTable evidenceList={analysisData.skill_evidence} />

            {/* 3. Recommended Learning Path */}
            <RecommendedLearning recommendations={analysisData.recommended_courses} />

            {/* 4. Interview Preparation Topics */}
            <InterviewTopics topics={analysisData.interview_topics} />

            {/* 5. AI Career Chatbot */}
            <div className="pt-4">
              <Chatbot analysisData={analysisData} />
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CareerVerify AI • Evidence-Based Job Fit Verification Hackathon MVP</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>React + Vite</span>
            <span>•</span>
            <span>Django REST</span>
            <span>•</span>
            <span>Google Gemini AI</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
