import { Equation, Difficulty } from '../types.ts';

export const generateEquation = (score: number, difficulty: Difficulty): Equation => {
  const level = Math.floor(score / 5) + 1;
  
  let operators = ['+'];
  let maxNum = 10;

  switch (difficulty) {
    case 'EASY':
      maxNum = 8 + Math.floor(score / 2);
      operators = score > 10 ? ['+', '-'] : ['+'];
      break;
    case 'MEDIUM':
      maxNum = 20 + (level * 3);
      operators = ['+', '-'];
      if (score > 10) operators.push('*');
      break;
    case 'HARD':
      maxNum = 40 + (level * 6);
      operators = ['+', '-', '*'];
      break;
  }

  const operator = operators[Math.floor(Math.random() * operators.length)];
  let a: number, b: number;

  if (operator === '*') {
    const multMax = difficulty === 'HARD' ? 12 : 9;
    a = Math.floor(Math.random() * (difficulty === 'EASY' ? 5 : multMax)) + 2;
    b = Math.floor(Math.random() * (difficulty === 'HARD' ? level + 4 : 6)) + 2;
  } else {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * maxNum) + 1;
    if (operator === '-' && a < b) [a, b] = [b, a];
  }

  let actualResult: number;
  switch (operator) {
    case '+': actualResult = a + b; break;
    case '-': actualResult = a - b; break;
    case '*': actualResult = a * b; break;
    default: actualResult = a + b;
  }

  const isCorrect = Math.random() > 0.4;
  let displayResult = actualResult;

  if (!isCorrect) {
    const deviationRange = difficulty === 'HARD' ? 5 : 3;
    let offset = (Math.floor(Math.random() * deviationRange) + 1) * (Math.random() > 0.5 ? 1 : -1);
    displayResult = actualResult + offset;
    
    if (displayResult < 0) displayResult = Math.abs(displayResult) + 1;
    if (displayResult === actualResult) displayResult += 1;
  }

  return {
    text: `${a} ${operator} ${b} =`,
    result: actualResult,
    isCorrect,
    displayResult
  };
};

export const getBaseTime = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'EASY': return 8000;
    case 'MEDIUM': return 4000;
    case 'HARD': return 2500;
    default: return 4000;
  }
};