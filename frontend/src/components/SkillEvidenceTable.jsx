import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, HelpCircle, FileSearch } from 'lucide-react';

export function SkillEvidenceTable({ evidenceList = [] }) {
  if (!evidenceList || evidenceList.length === 0) return null;

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'VERIFIED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>VERIFIED</span>
        </span>
      );
    }
    if (s === 'PARTIAL') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PARTIAL</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>NOT VERIFIED</span>
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Skill Evidence Matrix</h3>
            <p className="text-xs text-slate-400">
              Evidence-based proof extracted directly from candidate resume text
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          {evidenceList.length} Total Evaluated Skills
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Target Skill</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Resume Evidence & Supporting Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {evidenceList.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">
                  {item.skill}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3.5 px-4 text-slate-300 leading-relaxed max-w-md">
                  {item.evidence || "Not clearly verified from the provided resume."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
