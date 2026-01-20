import React from 'react';
import { ChevronLeft, Trophy, Activity, Target, Star, Award } from 'lucide-react';
import { UserProfile, Difficulty } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {
  const avgScore = user.history.length > 0 
    ? (user.history.reduce((acc, curr) => acc + curr.score, 0) / user.history.length).toFixed(1)
    : 0;

  const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

  return (
    <div className="flex flex-col min-h-screen p-6 text-white bg-indigo-950/50 animate-in slide-in-from-bottom-8 duration-500 overflow-y-auto">
      <div className="flex items-center justify-between pt-safe mb-8 shrink-0">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-black tracking-widest uppercase italic text-white/60">Performance</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex items-center gap-6 mb-10 shrink-0">
        <div className={`w-24 h-24 rounded-[2rem] ${user.avatarColor} shadow-2xl flex items-center justify-center text-4xl font-black italic`}>
          {user.name[0].toUpperCase()}
        </div>
        <div className="flex flex-col">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">{user.name}</h3>
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest mt-1">
            <Star size={12} fill="currentColor" /> Veteran Scholar
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10 shrink-0">
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
          <Activity className="text-rose-400 mb-2" size={20} />
          <div className="text-2xl font-black italic leading-none">{avgScore}</div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Avg Score</div>
        </div>
        <div className="bg-white/5 border border-white/5 p-5 rounded-3xl">
          <Target className="text-emerald-400 mb-2" size={20} />
          <div className="text-2xl font-black italic leading-none">{user.totalSolved}</div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Total Solve</div>
        </div>
      </div>

      <div className="space-y-4 mb-10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Personal Bests</span>
          <div className="h-px flex-1 bg-white/5 mx-4"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((diff) => (
            <div key={diff} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
              <Award className={`mb-2 ${
                diff === 'HARD' ? 'text-rose-400' :
                diff === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
              }`} size={20} />
              <div className="text-xl font-black italic leading-none">{user.highScores[diff]}</div>
              <div className="text-[8px] font-bold text-white/20 uppercase tracking-tighter mt-1">{diff}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Recent History</span>
          <div className="h-px flex-1 bg-white/5 mx-4"></div>
        </div>
        
        <div className="space-y-3 pb-8">
          {user.history.length === 0 ? (
            <div className="text-center py-10 text-white/20 italic font-medium">No matches played yet</div>
          ) : (
            user.history.slice().reverse().map((res, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                    res.difficulty === 'HARD' ? 'bg-rose-500/20 text-rose-400' :
                    res.difficulty === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {res.difficulty}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/40">
                      {new Date(res.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-xl font-black italic">+{res.score}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;