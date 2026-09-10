import React from 'react';
import { HelpCircle, ArrowRight, Shield } from 'lucide-react';

export function InterviewTopics({ topics = [] }) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Target Interview Preparation</h3>
          <p className="text-xs text-slate-400">
            Tailored technical questions expected based on JD requirements & resume gaps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {topics.map((topic, idx) => (
          <div key={idx} className="glass-card p-4 rounded-xl flex items-start space-x-3 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {topic}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
