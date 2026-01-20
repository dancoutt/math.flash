
import React from 'react';
import { ChevronLeft, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full text-white bg-indigo-950/90 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-6 pt-safe border-b border-white/5 bg-indigo-950/50 backdrop-blur-md z-20">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-black tracking-widest uppercase italic text-white/60">Privacy Note</h2>
        <div className="w-12"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="p-5 bg-emerald-500/20 rounded-3xl border border-emerald-500/20 mb-6 shadow-xl shadow-emerald-500/10">
            <ShieldCheck size={48} className="text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Safe & Private</h3>
          <p className="text-indigo-200/50 text-xs font-bold leading-relaxed max-w-[280px]">
            Math Flash Pro is designed with a "Local-First" philosophy. Your data stays in your hands.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-start gap-5">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 shrink-0">
              <Database size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1 italic">Local Storage</h4>
              <p className="text-[11px] text-white/40 font-bold leading-relaxed">
                All scores, names, and performance history are stored strictly on your device's local memory (localStorage). We do not use external servers to track your progress.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-start gap-5">
            <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1 italic">No Tracking</h4>
              <p className="text-[11px] text-white/40 font-bold leading-relaxed">
                We do not collect personal identifiers, email addresses, or location data. Your chosen nickname is only used for local personalization.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-start gap-5">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 shrink-0">
              <EyeOff size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-1 italic">Zero Ads Logic</h4>
              <p className="text-[11px] text-white/40 font-bold leading-relaxed">
                While the app includes monetization placeholders, your performance statistics and math results are never shared with advertising networks.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-6">
          <button 
            onClick={onBack}
            className="w-full bg-white text-indigo-950 py-5 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            Understood
          </button>
          <div className="text-center">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
              Math Flash Pro v1.1.0
            </p>
            <p className="text-[8px] font-bold text-white/10 uppercase mt-2">
              Privacy First Design • 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
