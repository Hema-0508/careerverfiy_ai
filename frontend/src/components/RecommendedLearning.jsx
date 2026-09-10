import React from 'react';
import { BookOpen, CheckSquare, Sparkles } from 'lucide-react';

export function RecommendedLearning({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Recommended Learning & Action Plan</h3>
          <p className="text-xs text-slate-400">
            Targeted topics to bridge unverified skills before applying
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((item, idx) => (
          <div key={idx} className="glass-card p-5 rounded-xl space-y-4 border border-slate-800 hover:border-purple-500/30">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {item.skill}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Priority Learn
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
              <span className="font-semibold text-purple-300">Why needed: </span>
              {item.why}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Topics to Study:</p>
              <ul className="space-y-1.5">
                {item.learn && item.learn.map((topic, tIdx) => (
                  <li key={tIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
