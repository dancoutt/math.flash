import React, { useState } from 'react';
import { Play, Trophy, Brain, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Difficulty, UserProfile } from '../types.ts';

interface MenuProps {
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  activeUser: UserProfile;
  onViewProfile: () => void;
  onViewPrivacy: () => void;
  onLogout: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart, difficulty, setDifficulty, activeUser, onViewProfile, onViewPrivacy, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  const diffConfigs = [
    { id: 'EASY' as Difficulty, label: 'EASY', color: 'bg-emerald-500' },
    { id: 'MEDIUM' as Difficulty, label: 'MEDIUM', color: 'bg-amber-500' },
    { id: 'HARD' as Difficulty, label: 'HARD', color: 'bg-rose-500' },
  ];

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen w-full text-white text-center bg-[#0f172a] opacity-100 transition-opacity duration-500"
      role="region"
      aria-label="Main Menu"
    >
      <div className="w-full flex justify-between items-center p-8 pt-safe z-30">
        <button 
          onClick={onViewProfile}
          className="flex items-center gap-3 p-2 pr-4 bg-white/5 rounded-full border border-white/5 active:scale-95 transition-transform"
          aria-label="View Profile"
        >
          <div className={`w-8 h-8 rounded-full ${activeUser.avatarColor} flex items-center justify-center font-black text-xs shadow-lg text-white`}>
            {activeUser.name[0].toUpperCase()}
          </div>
          <span className="text-xs font-black tracking-widest italic">{activeUser.name}</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-full border border-white/5 bg-white/5 active:rotate-45 transition-transform"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 top-12 w-48 bg-indigo-950 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={onLogout} 
                className="w-full flex items-center gap-3 p-3 text-rose-400 font-bold text-sm hover:bg-white/5 rounded-xl transition-colors"
              >
                <LogOut size={16} /> Switch Profile
              </button>
              <button 
                onClick={onViewPrivacy} 
                className="w-full flex items-center gap-3 p-3 text-white/60 font-bold text-sm hover:bg-white/5 rounded-xl transition-colors"
              >
                <ShieldCheck size={16} /> Privacy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center px-8">
        <div className="relative mb-6">
           <div className="relative bg-white/5 p-5 rounded-[2.5rem] border border-white/10 animate-float" aria-hidden="true">
             <Brain size={64} className="text-yellow-400" />
           </div>
        </div>
        <h1 className="text-5xl font-black mb-1 tracking-tighter italic uppercase">Math<span className="text-yellow-400">Flash</span></h1>
        <p className="text-indigo-200/40 text-[10px] font-black tracking-[0.3em] uppercase">Hyper-Casual Pro</p>
      </div>

      <div className="w-full max-w-sm space-y-8 px-8 mb-12">
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5" role="radiogroup" aria-label="Difficulty Selection">
          {diffConfigs.map((cfg) => (
            <button
              key={cfg.id}
              onClick={() => setDifficulty(cfg.id)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                difficulty === cfg.id ? `${cfg.color} text-indigo-950 shadow-lg` : 'text-white/40'
              }`}
              role="radio"
              aria-checked={difficulty === cfg.id}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full bg-yellow-400 text-indigo-950 font-black text-2xl py-6 rounded-[2rem] shadow-[0_12px_0_0_#ca8a04] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3"
          data-focus="primary"
          aria-label="Start Game"
        >
          <Play fill="currentColor" size={28} />
          PLAY NOW
        </button>
      </div>
    </div>
  );
};

export default Menu;