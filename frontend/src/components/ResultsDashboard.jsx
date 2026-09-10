import React from 'react';
import { 
  CheckCircle, AlertTriangle, HelpCircle, Briefcase, GraduationCap, 
  Award, TrendingUp, ShieldCheck, Flame, Info 
} from 'lucide-react';

export function ResultsDashboard({ data }) {
  if (!data) return null;

  const {
    job_role = "Candidate Role",
    match_score = 0,
    verification_status = "Analyzed",
    summary = "",
    matching_skills = [],
    missing_skills = [],
    partial_match_skills = [],
    education_match = "",
    experience_match = "",
    strengths = [],
    weaknesses = [],
  } = data;

  // Score status colors
  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500/10', stroke: '#10b981' };
    if (score >= 65) return { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10', stroke: '#f59e0b' };
    return { text: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-500/10', stroke: '#f43f5e' };
  };

  const scoreTheme = getScoreColor(match_score);
  const strokeDashoffset = 283 - (283 * match_score) / 100;

  return (
    <div className="space-y-8">
      
      {/* Top Banner Card: Target Role + Match Score */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Role & Verification Status */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Target Job Role
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${scoreTheme.bg} ${scoreTheme.text} ${scoreTheme.border} border`}>
                {verification_status}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {job_role}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {summary}
            </p>
          </div>

          {/* Right: Score Ring Visualization */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="8"
                  stroke={scoreTheme.stroke}
                  fill="transparent"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold ${scoreTheme.text}`}>
                  {match_score}%
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  Resume Match
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3 text-center">
              Calculated by Gemini AI based on verified resume evidence
            </p>
          </div>

        </div>

      </div>

      {/* Skills Badges Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Verified Matching Skills */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Matching Skills ({matching_skills.length})</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {matching_skills.length > 0 ? (
              matching_skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No matching skills identified.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Missing Skills ({missing_skills.length})</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {missing_skills.length > 0 ? (
              missing_skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  <span className="text-amber-400 font-bold">⚠</span>
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No critical missing skills!</p>
            )}
          </div>
        </div>

        {/* Partial Match Skills */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Partial Skills ({partial_match_skills.length})</h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {partial_match_skills.length > 0 ? (
              partial_match_skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                >
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No partial match skills.</p>
            )}
          </div>
        </div>

      </div>

      {/* Strengths & Weaknesses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800 pb-3">
            <Flame className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Candidate Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 border-b border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 transform rotate-180" />
            <h3 className="font-bold text-white text-base">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2.5">
            {weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Education & Experience Match */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 border-b border-slate-800 pb-3">
            <GraduationCap className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Education Alignment</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{education_match}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Experience Alignment</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{experience_match}</p>
        </div>

      </div>

    </div>
  );
}
