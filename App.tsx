
import React, { useState, useEffect } from 'react';
import { GameState, Difficulty, UserProfile, GameResult } from './types';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import GameOver from './components/GameOver';
import AccountEntry from './components/AccountEntry';
import ProfileView from './components/ProfileView';
import PrivacyPolicy from './components/PrivacyPolicy';

const AVATAR_COLORS = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-indigo-500'];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('AUTH');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [canRevive, setCanRevive] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('math-flash-pro-users');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUsers(parsed);
        const lastActive = localStorage.getItem('math-flash-pro-active-id');
        if (lastActive && parsed.some((u: UserProfile) => u.id === lastActive)) {
          setActiveUserId(lastActive);
          setGameState('MENU');
        }
      }
    } catch (e) {
      console.error("Storage error", e);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

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

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center bg-[#0f172a]">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <main className="relative z-10 w-full max-w-md min-h-screen flex flex-col shadow-2xl overflow-hidden">
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
            onInstall={deferredPrompt ? handleInstallClick : undefined}
          />
        )}

        {activeUser && gameState === 'PROFILE' && (
          <ProfileView user={activeUser} onBack={() => setGameState('MENU')} />
        )}

        {activeUser && gameState === 'PRIVACY' && (
          <PrivacyPolicy onBack={() => setGameState('MENU')} />
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
