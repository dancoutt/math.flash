
import React, { useState, useEffect } from 'react';
import { GameState, Difficulty, UserProfile, GameResult } from './types.ts';
import Menu from './components/Menu.tsx';
import GameBoard from './components/GameBoard.tsx';
import GameOver from './components/GameOver.tsx';
import AccountEntry from './components/AccountEntry.tsx';
import ProfileView from './components/ProfileView.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';

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
    try {
      const saved = localStorage.getItem('math-flash-pro-users');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUsers(parsed);
        const lastActive = localStorage.getItem('math-flash-pro-active-id');
        if (lastActive && parsed.some((u: any) => u.id === lastActive)) {
          setActiveUserId(lastActive);
          setGameState('MENU');
        }
      }
    } catch (e) {
      console.error("Storage initialization error", e);
    }
    // Pequeno atraso para garantir que o DOM esteja pronto para receber o conteúdo
    setTimeout(() => setIsReady(true), 50);
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

  // Se não estiver pronto, renderiza um container vazio mas presente no DOM para o splash script detectar
  if (!isReady) {
    return <div id="app-loading-indicator" className="opacity-0">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#0f172a]">
      <main className="w-full max-w-md min-h-screen flex flex-col relative bg-[#0f172a]">
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
