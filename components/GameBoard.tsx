import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Check, X, Award, Flame, Zap } from 'lucide-react';
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
  const [hasBrokenRecord, setHasBrokenRecord] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const lastSoundTickRef = useRef<number>(0);

  const handleAnswer = useCallback((answer: boolean) => {
    if (answer === equation.isCorrect) {
      // Feedback auditivo com pitch baseado no combo
      soundEngine.playSuccess(1 + (combo * 0.1));
      
      const nextCombo = combo + 1;
      const comboBonus = Math.floor(nextCombo / 5);
      const increment = 1 + comboBonus;
      
      const newScore = score + increment;
      
      if (newScore > highScore && !hasBrokenRecord && highScore > 0) {
        setHasBrokenRecord(true);
        soundEngine.playRecord();
      }
      
      setScore(newScore);
      setEquation(generateEquation(newScore, difficulty));
      
      // Ganho de tempo proporcional ao quão rápido o player foi
      const isFast = timeLeft > (baseTime * 0.6);
      const timeBonus = isFast ? baseTime * 0.2 : 400;
      setTimeLeft(Math.min(baseTime, timeLeft + timeBonus));
      
      setCombo(nextCombo);
      setFeedback('correct');
      
      if (navigator.vibrate) navigator.vibrate(10);
      setTimeout(() => setFeedback(null), 300);
    } else {
      soundEngine.playError();
      setFeedback('wrong');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => onGameOver(score), 400);
    }
  }, [equation, score, timeLeft, difficulty, baseTime, onGameOver, setScore, combo, highScore, hasBrokenRecord]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setTimeLeft(prev => {
        const next = prev - delta;
        
        const isLow = next < baseTime * 0.35;
        const tickInterval = isLow ? 200 : 800;
        
        if (now - lastSoundTickRef.current > tickInterval) {
          soundEngine.playTick(isLow);
          lastSoundTickRef.current = now;
        }

        if (next <= 0) {
          soundEngine.playError();
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
  const isUrgent = progress < 35;
  const isNewBest = score > highScore && highScore > 0;
  
  return (
    <div className={`flex flex-col min-h-screen p-6 text-white overflow-hidden transition-all duration-300 relative
      ${feedback === 'wrong' ? 'flash-wrong animate-shake' : feedback === 'correct' ? 'flash-correct' : ''}
      ${isUrgent ? 'bg-red-950/10' : 'bg-transparent'}`}>
      
      <div className="flex items-center justify-between pt-safe mb-8 relative z-10">
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 
            ${isUrgent ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`}>
            {difficulty}
          </span>
          <div className="flex items-baseline gap-2 relative">
            <span className="text-6xl font-black tracking-tighter italic">{score}</span>
            {isNewBest && (
              <div className="absolute -right-2 top-0 translate-x-full bg-yellow-400 text-indigo-950 px-2 py-0.5 rounded-full text-[8px] font-black animate-bounce shadow-lg shadow-yellow-400/20 whitespace-nowrap uppercase">
                New Record
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {combo > 2 && (
            <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/20 animate-in zoom-in duration-300">
              <Flame size={12} className="text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-black text-orange-500">{combo} COMBO</span>
            </div>
          )}
          <div className="w-32 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className={`h-full transition-all duration-100 ease-linear
                ${progress < 35 ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="text-white/30 text-4xl font-black mb-4 italic tracking-widest">{equation.text}</div>
        <div className={`text-[9rem] font-black tracking-tighter leading-none italic
          ${feedback === 'correct' ? 'text-green-400 scale-110' : feedback === 'wrong' ? 'text-red-400' : 'text-white'} 
          transition-all duration-200`}>
          {equation.displayResult}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
        <button
          onClick={() => handleAnswer(false)}
          className="group bg-red-600 hover:bg-red-500 text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-2 shadow-[0_12px_0_0_#991b1b] active:shadow-none active:translate-y-2 transition-all outline-none"
        >
          <X size={48} strokeWidth={4} className="group-active:scale-90 transition-transform" />
          <span className="font-black text-xs tracking-[0.2em] italic">FALSE</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="group bg-green-600 hover:bg-green-500 text-white rounded-[2.5rem] p-8 flex flex-col items-center gap-2 shadow-[0_12px_0_0_#166534] active:shadow-none active:translate-y-2 transition-all outline-none"
        >
          <Check size={48} strokeWidth={4} className="group-active:scale-90 transition-transform" />
          <span className="font-black text-xs tracking-[0.2em] italic">TRUE</span>
        </button>
      </div>

      {/* Background Visual Feedback */}
      {combo >= 10 && (
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
          <Zap size={200} className="absolute -top-10 -left-10 text-yellow-400 animate-pulse" />
          <Zap size={150} className="absolute -bottom-10 -right-10 text-yellow-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default GameBoard;