import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Trophy, User, LogOut, Shield, ArrowLeft, Play, RotateCcw, Home, Heart } from 'lucide-react';

// Types
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type GameState = 'AUTH' | 'MENU' | 'PLAYING' | 'GAMEOVER' | 'PROFILE' | 'PRIVACY';

interface GameResult {
  score: number;
  difficulty: Difficulty;
  timestamp: number;
}

interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  highScores: Record<Difficulty, number>;
  history: GameResult[];
  totalSolved: number;
}

interface Equation {
  text: string;
  result: number;
  isCorrect: boolean;
  displayResult: number;
}

// Sound System
class SoundEngine {
  private audioContext: AudioContext | null = null;

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playCorrect() {
    this.init();
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  playWrong() {
    this.init();
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  playGameOver() {
    this.init();
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }
}

const soundEngine = new SoundEngine();

// Equation Generator
const generateEquation = (difficulty: Difficulty): Equation => {
  const maxNum = difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 20 : 50;
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let a = Math.floor(Math.random() * maxNum) + 1;
  let b = Math.floor(Math.random() * maxNum) + 1;
  
  let result: number;
  switch (op) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    default: result = 0;
  }
  
  const isCorrect = Math.random() > 0.5;
  const displayResult = isCorrect ? result : result + (Math.random() > 0.5 ? 1 : -1);
  
  return {
    text: `${a} ${op} ${b}`,
    result,
    isCorrect,
    displayResult
  };
};

// AccountEntry Component
const AccountEntry: React.FC<{
  onAccountCreated: (name: string) => void;
  existingUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}> = ({ onAccountCreated, existingUsers, onSelectUser }) => {
  const [name, setName] = useState('');
  const [showExisting, setShowExisting] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      onAccountCreated(name.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-3xl mb-4 border border-amber-500/20">
            <Brain className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            MATH<span className="text-amber-400">FLASH</span>
          </h1>
          <p className="text-slate-400 text-sm">Train your brain in seconds</p>
        </div>

        {!showExisting ? (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors"
            >
              Start Playing
            </button>
            {existingUsers.length > 0 && (
              <button
                onClick={() => setShowExisting(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
              >
                Select Existing Profile
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowExisting(false)}
              className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            {existingUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="w-full flex items-center gap-3 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <div className={`w-12 h-12 ${user.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {user.name[0].toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-slate-400 text-sm">{user.totalSolved} solved</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Menu Component
const Menu: React.FC<{
  onStart: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  activeUser: UserProfile;
  onViewProfile: () => void;
  onViewPrivacy: () => void;
  onLogout: () => void;
}> = ({ onStart, difficulty, setDifficulty, activeUser, onViewProfile, onViewPrivacy, onLogout }) => {
  const difficulties: { key: Difficulty; label: string; time: string; color: string }[] = [
    { key: 'EASY', label: 'Easy', time: '8s', color: 'bg-emerald-500' },
    { key: 'MEDIUM', label: 'Medium', time: '4s', color: 'bg-amber-500' },
    { key: 'HARD', label: 'Hard', time: '2.5s', color: 'bg-rose-500' }
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onViewProfile}
          className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl"
        >
          <div className={`w-10 h-10 ${activeUser.avatarColor} rounded-full flex items-center justify-center text-white font-bold`}>
            {activeUser.name[0].toUpperCase()}
          </div>
          <span className="text-white font-semibold">{activeUser.name}</span>
        </button>
        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-2">
            MATH<span className="text-amber-400">FLASH</span>
          </h1>
          <p className="text-slate-400">Select difficulty and start!</p>
        </div>

        <div className="space-y-4 mb-8">
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              onClick={() => setDifficulty(diff.key)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                difficulty === diff.key
                  ? `${diff.color} border-white scale-105`
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-lg">{diff.label}</span>
                <span className="text-white/80 text-sm">{diff.time} per question</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold">{activeUser.highScores[diff.key]}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>

        <button
          onClick={onViewPrivacy}
          className="mt-4 text-slate-500 hover:text-slate-400 text-sm transition-colors"
        >
          Privacy Policy
        </button>
      </div>
    </div>
  );
};

// GameBoard Component
const GameBoard: React.FC<{
  difficulty: Difficulty;
  onGameOver: () => void;
  score: number;
  setScore: (s: number) => void;
  highScore: number;
}> = ({ difficulty, onGameOver, score, setScore, highScore }) => {
  const [equation, setEquation] = useState<Equation>(generateEquation(difficulty));
  const [timeLeft, setTimeLeft] = useState(100);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<number>();

  const timeLimit = difficulty === 'EASY' ? 8000 : difficulty === 'MEDIUM' ? 4000 : 2500;

  useEffect(() => {
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / timeLimit) * 100);
      setTimeLeft(remaining);
      if (remaining === 0) {
        soundEngine.playGameOver();
        onGameOver();
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [equation, timeLimit, onGameOver]);

  const handleAnswer = (userSaysCorrect: boolean) => {
    clearInterval(timerRef.current);
    
    if (userSaysCorrect === equation.isCorrect) {
      soundEngine.playCorrect();
      setScore(score + 1);
      setEquation(generateEquation(difficulty));
    } else {
      soundEngine.playWrong();
      setShake(true);
      setTimeout(() => {
        setShake(false);
        onGameOver();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-white font-bold text-xl">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-slate-400 font-semibold">{highScore}</span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-amber-500 transition-all duration-100"
          style={{ width: `${timeLeft}%` }}
        />
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center ${shake ? 'animate-shake' : ''}`}>
        <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8 mb-8 w-full">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-4">{equation.text}</div>
            <div className="text-6xl font-black text-amber-400">= {equation.displayResult}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={() => handleAnswer(true)}
            className="py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl rounded-xl transition-colors active:scale-95"
          >
            TRUE ✓
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-6 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xl rounded-xl transition-colors active:scale-95"
          >
            FALSE ✗
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
};

// GameOver Component
const GameOver: React.FC<{
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
  onRevive: () => void;
  canRevive: boolean;
}> = ({ score, highScore, onRestart, onMenu, onRevive, canRevive }) => {
  const isNewHighScore = score > highScore;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Game Over!</h2>
        {isNewHighScore && (
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">New High Score!</span>
          </div>
        )}
        <div className="text-7xl font-black text-amber-400 mb-2">{score}</div>
        <div className="text-slate-400">
          Best: <span className="text-white font-semibold">{Math.max(score, highScore)}</span>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        {canRevive && (
          <button
            onClick={onRevive}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Heart className="w-5 h-5" />
            Continue (One Time)
          </button>
        )}
        <button
          onClick={onRestart}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
        <button
          onClick={onMenu}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-5 h-5" />
          Main Menu
        </button>
      </div>
    </div>
  );
};

// ProfileView Component
const ProfileView: React.FC<{
  user: UserProfile;
  onBack: () => void;
}> = ({ user, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <button
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className={`w-24 h-24 ${user.avatarColor} rounded-full flex items-center justify-center text-white font-black text-4xl mx-auto mb-4`}>
          {user.name[0].toUpperCase()}
        </div>
        <h2 className="text-3xl font-black text-white">{user.name}</h2>
        <p className="text-slate-400 mt-2">{user.totalSolved} problems solved</p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-white font-bold text-lg">High Scores</h3>
        {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((diff) => (
          <div key={diff} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl">
            <span className="text-white font-semibold">{diff}</span>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-white font-bold">{user.highScores[diff]}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-white font-bold text-lg mb-4">Recent Games</h3>
        {user.history.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No games played yet</p>
        ) : (
          <div className="space-y-2">
            {user.history.slice().reverse().map((game, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl">
                <span className="text-slate-400 text-sm">{game.difficulty}</span>
                <span className="text-white font-semibold">{game.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// PrivacyPolicy Component
const PrivacyPolicy: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-amber-400" />
        <h2 className="text-3xl font-black text-white">Privacy Policy</h2>
      </div>

      <div className="space-y-6 text-slate-300 leading-relaxed">
        <section>
          <h3 className="text-white font-bold text-lg mb-2">Privacy First</h3>
          <p>Math Flash Pro is designed with your privacy as the top priority. All your data is stored locally on your device using browser storage (localStorage). We do not collect, transmit, or store any personal information on external servers.</p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-2">Data Storage</h3>
          <p>Your profile information, game scores, and history are saved exclusively on your device. This data never leaves your device and is not shared with any third parties.</p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-2">What We Store</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Your chosen username</li>
            <li>Game scores and difficulty levels</li>
            <li>Game history (last 10 games)</li>
            <li>Avatar color preference</li>
          </ul>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-2">Data Control</h3>
          <p>You have full control over your data. You can clear all game data by clearing your browser's local storage or by uninstalling the app.</p>
        </section>

        <section>
          <h3 className="text-white font-bold text-lg mb-2">No Tracking</h3>
          <p>We do not use analytics, tracking cookies, or any third-party services that collect user data.</p>
        </section>
      </div>
    </div>
  );
};

// Main App Component
const AVATAR_COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-indigo-500'];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('AUTH');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [canRevive, setCanRevive] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = () => {
      try {
        const saved = localStorage.getItem('math-flash-pro-users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
            const lastActive = localStorage.getItem('math-flash-pro-active-id');
            if (lastActive && parsed.some((u: UserProfile) => u.id === lastActive)) {
              setActiveUserId(lastActive);
              setGameState('MENU');
            }
          }
        }
      } catch (e) {
        console.warn("Storage recovery skipped:", e);
      } finally {
        setIsReady(true);
      }
    };
    initializeApp();
  }, []);

  const activeUser = users.find(u => u.id === activeUserId);

  const handleAccountCreated = (name: string) => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      highScores: { EASY: 0, MEDIUM: 0, HARD: 0 },
      history: [],
      totalSolved: 0
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setActiveUserId(newUser.id);
    localStorage.setItem('math-flash-pro-users', JSON.stringify(updatedUsers));
    localStorage.setItem('math-flash-pro-active-id', newUser.id);
    setGameState('MENU');
  };

  const handleSelectUser = (user: UserProfile) => {
    setActiveUserId(user.id);
    localStorage.setItem('math-flash-pro-active-id', user.id);
    setGameState('MENU');
  };

  const handleLogout = () => {
    setActiveUserId(null);
    localStorage.removeItem('math-flash-pro-active-id');
    setGameState('AUTH');
  };

  const startGame = () => {
    setScore(0);
    setCanRevive(true);
    setGameState('PLAYING');
  };

  const endGame = () => {
    if (!activeUser) return;
    const result: GameResult = { score, difficulty, timestamp: Date.now() };
    const updatedUsers = users.map(u => {
      if (u.id === activeUser.id) {
        const newHighScore = Math.max(u.highScores[difficulty], score);
        return {
          ...u,
          history: [...u.history, result].slice(-10),
          highScores: { ...u.highScores, [difficulty]: newHighScore },
          totalSolved: u.totalSolved + score
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('math-flash-pro-users', JSON.stringify(updatedUsers));
    setGameState('GAMEOVER');
  };

  if (!isReady) return null;

  return (
    <div className="w-full min-h-screen bg-slate-900 overflow-hidden flex flex-col items-center">
      <main className="w-full max-w-md min-h-screen relative bg-slate-900">
        {gameState === 'AUTH' && (
          <AccountEntry 
            onAccountCreated={handleAccountCreated} 
            existingUsers={users}
            onSelectUser={handleSelectUser}
          />
        )}

        {activeUser && gameState === 'MENU' && (
          <Menu 
            onStart={startGame} 
            difficulty={difficulty} 
            setDifficulty={setDifficulty}
            activeUser={activeUser}
            onViewProfile={() => setGameState('PROFILE')}
            onViewPrivacy={() => setGameState('PRIVACY')}
            onLogout={handleLogout}
          />
        )}

        {activeUser && (gameState === 'PROFILE' || gameState === 'PRIVACY') && (
           <div className="absolute inset-0 z-50 bg-slate-900">
             {gameState === 'PROFILE' && <ProfileView user={activeUser} onBack={() => setGameState('MENU')} />}
             {gameState === 'PRIVACY' && <PrivacyPolicy onBack={() => setGameState('MENU')} />}
           </div>
        )}

        {gameState === 'PLAYING' && (
          <GameBoard 
            difficulty={difficulty}
            onGameOver={endGame} 
            score={score} 
            setScore={setScore} 
            highScore={activeUser?.highScores[difficulty] || 0}
          />
        )}

        {gameState === 'GAMEOVER' && (
          <GameOver 
            score={score} 
            highScore={activeUser?.highScores[difficulty] || 0} 
            onRestart={startGame} 
            onMenu={() => setGameState('MENU')}
            onRevive={() => { setCanRevive(false); setGameState('PLAYING'); }}
            canRevive={canRevive}
          />
        )}
      </main>
    </div>
  );
};

export default App;