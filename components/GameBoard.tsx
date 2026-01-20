
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Check, X, Zap, AlertTriangle, Star, Award } from 'lucide-react';
import { Equation, Difficulty } from '../types.ts';
import { generateEquation, getBaseTime } from '../services/mathEngine.ts';
import { soundEngine } from '../services/soundEngine.ts';

interface GameBoardProps {
  difficulty: Difficulty;
  onGameOver: (score: number) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onGameOver, score, setScore, highScore }) => {
  const baseTime = getBaseTime(difficulty);
  const [equation, setEquation] = useState<Equation>(generateEquation(0, difficulty));
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [combo, setCombo] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [hasBrokenRecord, setHasBrokenRecord] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const lastSoundTickRef = useRef<number>(0);

  const handleAnswer = useCallback((answer: boolean) => {
    if (answer === equation.isCorrect) {
      soundEngine.playSuccess();
      
      const nextCombo = combo + 1;
      const bonus = Math.floor(nextCombo / 5);
      const increment = 1 + bonus;
      
      const newScore = score + increment;
      
      if (newScore > highScore && !hasBrokenRecord && highScore > 0) {
        setHasBrokenRecord(true);
        soundEngine.playRecord();
      }
      
      setScore(newScore);
      setEquation(generateEquation(newScore, difficulty));
      
      if (bonus > 0) {
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 500);
      }
      
      const isFast = timeLeft > (baseTime * 0.6);
      const timeBonus = isFast ? baseTime * 0.15 : 300;
      setTimeLeft(Math.min(baseTime, timeLeft + timeBonus));
      
      setCombo(nextCombo);
      setFeedback('correct');
      
      if (navigator.vibrate) navigator.vibrate(10);
      
      setTimeout(() => setFeedback(null), 300);
    } else {
      soundEngine.playError();
      setCombo(0);
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      setFeedback('wrong');
      setTimeout(() => onGameOver(score), 300);
    }
  }, [equation, score, timeLeft, difficulty, baseTime, onGameOver, setScore, combo, highScore, hasBrokenRecord]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setTimeLeft(prev => {
        const next = prev - delta;
        
        const isLow = next < baseTime * 0.3;
        const tickInterval = isLow ? 250 : 800;
        if (now - lastSoundTickRef.current > tickInterval) {
          soundEngine.playTick(isLow);
          lastSoundTickRef.current = now;
        }

        if (next <= 0) {
          soundEngine.playError();
          setCombo(0);
          if (navigator.vibrate) navigator.vibrate(200);
          onGameOver(score);
          return 0;
        }
        return next;
      });
      timerRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = Date.now();
    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [onGameOver, score, baseTime]);

  const progress = (timeLeft / baseTime) * 100;
  const isUrgent = progress < 30;
  const multiplier = 1 + Math.floor(combo / 5);
  const isNewBest = score > highScore && highScore > 0;
  
  return (
    <div className={`flex flex-col min-h-screen p-6 text-white overflow-hidden transition-all duration-300 relative
      ${feedback === 'wrong' ? 'bg-red-900/40 animate-shake' : 
        isUrgent ? 'bg-red-950/40' :
        difficulty === 'HARD' ? 'bg-rose-950/20' : 
        difficulty === 'EASY' ? 'bg-emerald-950/20' : 'bg-transparent'}`}>
      
      {isUrgent && (
        <div className="absolute inset-0 pointer-events-none border-[12px] border-red-500/20 animate-pulse z-0" />
      )}

      <div className="flex items-center justify-between pt-safe mb-8 relative z-10">
        <div className="flex flex-col">
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] 
            ${isUrgent ? 'text-red-400' : difficulty === 'HARD' ? 'text-rose-400' : difficulty === 'EASY' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {difficulty} MODE
          </span>
          <div className="flex items-baseline gap-2 relative">
            <span className="text-5xl font-black tracking-tighter">{score}</span>
            {isNewBest && (
              <div className="absolute -right-2 top-0 translate-x-full flex items-center gap-1 bg-yellow-400 text-indigo-950 px-2 py-0.5 rounded-full text-[8px] font-black animate-pulse shadow-lg whitespace-nowrap">
                <Award size={10} /> NEW BEST!
              </div>
            )}
          </div>
        </div>
        <div className="w-28 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className={`h-full transition-all duration-75 ease-linear
              ${progress < 30 ? 'bg-red-500 animate-pulse' : 'bg-yellow-400'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-white/20 text-4xl font-black mb-2 italic">{equation.text}</div>
        <div className="text-[8rem] font-black tracking-tighter leading-none">
          {equation.displayResult}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
        <button
          onClick={() => handleAnswer(false)}
          className="bg-red-600 hover:bg-red-500 text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-2 shadow-[0_10px_0_0_#991b1b] active:shadow-none active:translate-y-2 transition-all outline-none"
        >
          <X size={44} strokeWidth={4} />
          <span className="font-black text-xs tracking-widest">WRONG</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="bg-green-600 hover:bg-green-500 text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-2 shadow-[0_10px_0_0_#166534] active:shadow-none active:translate-y-2 transition-all outline-none"
        >
          <Check size={44} strokeWidth={4} />
          <span className="font-black text-xs tracking-widest">RIGHT</span>
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
