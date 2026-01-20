
import React, { useState } from 'react';
import { Play, Trophy, Brain, Settings, ShieldCheck, LogOut, Download } from 'lucide-react';
import { Difficulty, UserProfile } from '../types';
import AdBanner from './AdBanner';

interface MenuProps {
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  activeUser: UserProfile;
  onViewProfile: () => void;
  onViewPrivacy: () => void;
  onLogout: () => void;
  onInstall?: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart, difficulty, setDifficulty, activeUser, onViewProfile, onViewPrivacy, onLogout, onInstall }) => {
  const [showSettings, setShowSettings] = useState(false);

  const diffConfigs = [
    { id: 'EASY' as Difficulty, label: 'EASY', color: 'bg-emerald-500', time: '8s' },
    { id: 'MEDIUM' as Difficulty, label: 'MEDIUM', color: 'bg-amber-500', time: '4s' },
    { id: 'HARD' as Difficulty, label: 'HARD', color: 'bg-rose-500', time: '2.5s' },
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen text-white text-center animate-in fade-in duration-700">
      <div className="w-full flex justify-between items-center p-8 pt-safe z-30">
        <button 
          onClick={onViewProfile}
          className="flex items-center gap-3 p-2 pr-4 bg-white/5 rounded-full border border-white/5 active:scale-95 transition-all"
        >
          <div className={`w-8 h-8 rounded-full ${activeUser.avatarColor} flex items-center justify-center font-black text-xs italic shadow-lg`}>
            {activeUser.name[0].toUpperCase()}
          </div>
          <span className="text-xs font-black tracking-widest italic">{activeUser.name}</span>
        </button>

        <div className="flex gap-2">
          {onInstall && (
            <button 
              onClick={onInstall}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-indigo-950 rounded-full font-black text-[10px] tracking-tighter animate-pulse shadow-lg"
            >
              <Download size={14} /> INSTALAR PRO
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-full border border-white/5 active:scale-95 transition-all ${showSettings ? 'bg-white text-indigo-950' : 'bg-white/5'}`}
            >
              <Settings size={18} />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 top-12 w-48 bg-indigo-900 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in zoom-in-95 duration-200 z-50">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors text-rose-400 font-bold text-sm"
                >
                  <LogOut size={16} /> Trocar Perfil
                </button>
                <button 
                  onClick={onViewPrivacy}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors text-white/60 font-bold text-sm"
                >
                  <ShieldCheck size={16} /> Privacidade
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-8">
        <div className="relative mb-6">
           <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-10 animate-pulse"></div>
           <div className="relative bg-white/5 p-5 rounded-[2.5rem] backdrop-blur-md border border-white/10 animate-float">
             <Brain size={64} className="text-yellow-400" />
           </div>
        </div>
        <h1 className="text-5xl font-black mb-1 tracking-tighter italic uppercase">MATH<span className="text-yellow-400">FLASH</span></h1>
        <p className="text-indigo-200/40 text-[10px] font-black tracking-[0.3em] uppercase">Hyper-Casual Pro</p>
      </div>

      <div className="w-full max-w-sm space-y-8 px-8">
        <div className="flex flex-col gap-3">
          <div className="flex p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
            {diffConfigs.map((cfg) => (
              <button
                key={cfg.id}
                onClick={() => setDifficulty(cfg.id)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 flex flex-col items-center gap-1 ${
                  difficulty === cfg.id 
                    ? `${cfg.color} text-indigo-950 shadow-lg scale-105` 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span>{cfg.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 opacity-40">
              <Trophy size={14} className="text-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Melhor: {activeUser.highScores[difficulty]}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="group w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black text-2xl py-6 rounded-[2rem] shadow-[0_12px_0_0_#ca8a04] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Play fill="currentColor" size={28} />
          JOGAR AGORA
        </button>
      </div>

      <div className="w-full mt-auto">
        <AdBanner />
      </div>
    </div>
  );
};

export default Menu;
