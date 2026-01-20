import React, { useState, useEffect } from 'react';
import { RotateCcw, Home, PlayCircle, Loader2, Share2, Award } from 'lucide-react';
import { showRewardedAd } from '../services/adService';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
  onRevive: () => void;
  canRevive: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart, onMenu, onRevive, canRevive }) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [reviveTimer, setReviveTimer] = useState(5);

  useEffect(() => {
    if (!canRevive || isWatchingAd) return;
    
    const interval = setInterval(() => {
      setReviveTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canRevive, isWatchingAd]);

  const handleShare = async () => {
    const shareData = {
      title: 'Math Flash Pro',
      text: `I just scored ${score} on Math Flash Pro! Can you beat my high score of ${highScore}?`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Score copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  const handleReviveWithAd = async () => {
    setIsWatchingAd(true);
    const success = await showRewardedAd();
    setIsWatchingAd(false);
    
    if (success) {
      onRevive();
    }
  };

  if (isWatchingAd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white text-center bg-black animate-in fade-in duration-500">
        <Loader2 className="animate-spin mb-6 text-yellow-400" size={60} />
        <h2 className="text-3xl font-black italic tracking-tighter">SPONSOR BREAK</h2>
        <p className="text-white/40 mt-2 font-medium">WATCHING FOR REWARD...</p>
      </div>
    );
  }

  const isNewHighScore = score > 0 && score === highScore;
  
  // Fake rank logic that scales with score to feel rewarding
  const calculatedRank = score > 0 
    ? Math.max(1, Math.floor(1000000 / (score * score + 1))).toLocaleString()
    : '---';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white text-center animate-in zoom-in-95 duration-500">
      <div className="mb-4 relative">
        <div className="text-[10px] font-black text-white bg-red-600 px-5 py-1.5 rounded-full uppercase tracking-[0.3em] mb-8 inline-block shadow-lg shadow-red-600/20">Session Ended</div>
        
        {isNewHighScore ? (
          <div className="flex flex-col items-center gap-2 mb-4 animate-bounce">
            <Award className="text-yellow-400" size={40} />
            <div className="text-yellow-400 text-2xl font-black italic tracking-tighter">NEW PERSONAL BEST!</div>
          </div>
        ) : null}
        
        <div className="relative inline-block">
          <h2 className="text-9xl font-black mb-8 italic tracking-tighter leading-none">{score}</h2>
          <button 
            onClick={handleShare}
            className="absolute -top-4 -right-4 bg-white/10 p-3 rounded-full backdrop-blur-md active:scale-90 transition-all border border-white/10"
          >
            <Share2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] w-full max-w-sm mb-10 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Personal Best</span>
          <span className="text-2xl font-black">{highScore}</span>
        </div>
        <div className="h-10 w-px bg-white/5"></div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Rank</span>
          <span className={`text-2xl font-black ${isNewHighScore ? 'text-yellow-400' : 'text-white'}`}>#{calculatedRank}</span>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        {canRevive && reviveTimer > 0 && (
          <button
            onClick={handleReviveWithAd}
            className="group relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl py-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_8px_0_0_#3730a3] active:shadow-none active:translate-y-2 transition-all overflow-hidden"
          >
             <div 
              className="absolute left-0 bottom-0 top-0 bg-white/10 transition-all duration-1000 ease-linear"
              style={{ width: `${(reviveTimer / 5) * 100}%` }}
             />
             <div className="relative flex items-center gap-3">
               <PlayCircle size={28} />
               SECOND CHANCE ({reviveTimer}S)
             </div>
          </button>
        )}

        <button
          onClick={onRestart}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black text-xl py-6 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_8px_0_0_#ca8a04] active:shadow-none active:translate-y-2 transition-all"
        >
          <RotateCcw size={28} />
          PLAY AGAIN
        </button>

        <button
          onClick={onMenu}
          className="w-full bg-white/5 hover:bg-white/10 text-white/60 font-bold text-lg py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all mt-4 border border-white/5"
        >
          <Home size={22} />
          HOME
        </button>
      </div>
    </div>
  );
};

export default GameOver;