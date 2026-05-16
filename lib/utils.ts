import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function getColorFromRgb(rgb: string): string {
  return `#${rgb}`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '#4D924A';
    case 'medium': return '#FF6B00';
    case 'hard': return '#D01012';
    default: return '#006DB7';
  }
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '⭐ Easy';
    case 'medium': return '⭐⭐ Medium';
    case 'hard': return '⭐⭐⭐ Hard';
    default: return difficulty;
  }
}
