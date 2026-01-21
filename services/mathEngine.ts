import { Equation, Difficulty } from '../types.ts';

export const generateEquation = (score: number, difficulty: Difficulty): Equation => {
  const level = Math.floor(score / 5) + 1;
  
  let operators = ['+'];
  let maxNum = 10;

  switch (difficulty) {
    case 'EASY':
      maxNum = 10 + Math.floor(score / 1.5);
      operators = score > 8 ? ['+', '-'] : ['+'];
      break;
    case 'MEDIUM':
      maxNum = 25 + (level * 4);
      operators = ['+', '-'];
      if (score > 12) operators.push('*');
      break;
    case 'HARD':
      maxNum = 45 + (level * 5);
      operators = ['+', '-', '*'];
      break;
  }

  const operator = operators[Math.floor(Math.random() * operators.length)];
  let a: number, b: number;

  if (operator === '*') {
    // Keep multiplications manageable even on hard
    const multMaxA = difficulty === 'HARD' ? 12 : 9;
    const multMaxB = difficulty === 'HARD' ? 9 : 6;
    a = Math.floor(Math.random() * multMaxA) + 2;
    b = Math.floor(Math.random() * multMaxB) + 2;
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

  // 40% chance of being false for balance
  const isCorrect = Math.random() > 0.45;
  let displayResult = actualResult;

  if (!isCorrect) {
    const deviationRange = difficulty === 'HARD' ? 4 : 2;
    // Ensure the false result is close but never equal to the correct one
    let offset = (Math.floor(Math.random() * deviationRange) + 1) * (Math.random() > 0.5 ? 1 : -1);
    displayResult = actualResult + offset;
    
    if (displayResult < 1) displayResult = Math.abs(displayResult) + 2;
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
    case 'MEDIUM': return 4500;
    case 'HARD': return 2800; // Slightly more generous than 2.5s for initial accessibility
    default: return 4500;
  }
};