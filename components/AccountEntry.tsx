import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Brain, UserCircle2 } from 'lucide-react';
import { UserProfile } from '../types.ts';
import { soundEngine } from '../services/soundEngine.ts';

interface AccountEntryProps {
  onAccountCreated: (name: string) => void;
  existingUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}

const AccountEntry: React.FC<AccountEntryProps> = ({ onAccountCreated, existingUsers, onSelectUser }) => {
  const [name, setName] = useState('');
  const [showExisting, setShowExisting] = useState(false);
  const isAudioInit = useRef(false);

  useEffect(() => {
    if (typeof (window as any).signalAppReady === 'function') {
      (window as any).signalAppReady();
    }
  }, []);

  const handleInteraction = () => {
    if (!isAudioInit.current) {
      soundEngine.init();
      isAudioInit.current = true;
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleInteraction();
    const trimmedName = name.trim();
    if (trimmedName.length >= 2) {
      onAccountCreated(trimmedName);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen w-full p-8 text-white bg-[#0f172a] select-none"
      onClick={handleInteraction}
    >
      <div className="mb-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 animate-bounce">
          <Brain size={48} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter block uppercase">
          Math<span className="text-yellow-400">Flash</span>
        </h1>
        <p className="text-indigo-200/40 text-[10px] font-black tracking-[0.4em] uppercase mt-2">
          Global Identity System
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        {!showExisting ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={handleInteraction}
                placeholder="Enter Nickname"
                maxLength={12}
                autoFocus
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-6 px-6 outline-none focus:ring-4 focus:ring-yellow-400/20 transition-all font-bold text-lg placeholder:text-white/20 text-white"
                data-focus="primary"
              />
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="absolute right-2 top-2 bottom-2 bg-yellow-400 disabled:bg-white/10 disabled:text-white/20 text-indigo-950 px-5 rounded-xl active:scale-95 transition-all font-black flex items-center justify-center"
              >
                <ArrowRight size={24} />
              </button>
            </div>
            
            {existingUsers.length > 0 && (
              <button
                type="button"
                onClick={() => setShowExisting(true)}
                className="w-full py-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserCircle2 size={14} /> Switch to existing profile
              </button>
            )}
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Select Profile</span>
              <button onClick={() => setShowExisting(false)} className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Back</button>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-[45vh] overflow-y-auto pr-1">
              {existingUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => { handleInteraction(); onSelectUser(user); }}
                  className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all text-left group"
                >
                  <div className={`w-14 h-14 rounded-xl ${user.avatarColor || 'bg-indigo-500'} flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-110 transition-transform text-white`}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-yellow-400 transition-colors">{user.name}</span>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{user.totalSolved} solved</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountEntry;