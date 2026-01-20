
import React, { useState } from 'react';
import { ArrowRight, Brain } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface AccountEntryProps {
  onAccountCreated: (name: string) => void;
  existingUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}

const AccountEntry: React.FC<AccountEntryProps> = ({ onAccountCreated, existingUsers, onSelectUser }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onAccountCreated(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 text-white bg-[#0f172a]">
      <div className="mb-12 text-center">
        <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 animate-float">
          <Brain size={48} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter block">
          MATH<span className="text-yellow-400">FLASH</span>
        </h1>
        <p className="text-indigo-200/40 text-[10px] font-black tracking-[0.4em] uppercase mt-2">
          Identity System
        </p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Nickname"
              maxLength={12}
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all font-bold text-lg placeholder:text-white/20 text-white"
            />
            <button
              type="submit"
              disabled={name.length < 2}
              className="absolute right-2 top-2 bottom-2 bg-yellow-400 disabled:bg-white/10 disabled:text-white/20 text-indigo-950 px-4 rounded-xl transition-all font-black flex items-center justify-center"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        {existingUsers.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Quick Switch</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {existingUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-lg ${user.avatarColor} flex items-center justify-center font-black text-xs shrink-0 text-white`}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold truncate text-white/80">{user.name}</span>
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
