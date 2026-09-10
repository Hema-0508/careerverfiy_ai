import React from 'react';
import { ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

export default function Navbar({ onReset, hasResults, isBackendOnline }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Title */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white tracking-tight">
                Career<span className="text-indigo-400">Verify</span> AI
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                Hackathon MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Evidence-Based Resume Verification System</p>
          </div>
        </div>

        {/* Right Actions & Health status */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isBackendOnline ? 'API Connected (Gemini AI)' : 'Demo Mode Ready'}</span>
          </div>

          {hasResults && (
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg text-sm font-medium border border-slate-700 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
