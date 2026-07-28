'use client';

import React, { useState, useEffect } from 'react';
import { Delete, RotateCcw, Send, AlertTriangle } from 'lucide-react';

interface KeypadInputProps {
  onSubmit: (guess: string) => void;
  isLoading: boolean;
}

export const KeypadInput: React.FC<KeypadInputProps> = ({ onSubmit, isLoading }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleKeyPress = (digit: string) => {
    if (digits.length >= 4) return;
    if (digits.includes(digit)) {
      setError(`Digit '${digit}' is already selected. Duplicates not allowed.`);
      return;
    }
    setError('');
    setDigits([...digits, digit]);
  };

  const handleBackspace = () => {
    setError('');
    setDigits(digits.slice(0, -1));
  };

  const handleClear = () => {
    setError('');
    setDigits([]);
  };

  const handleSubmit = () => {
    if (digits.length !== 4) {
      setError('Guess must be exactly 4 unique digits.');
      return;
    }
    const guess = digits.join('');
    onSubmit(guess);
    setDigits([]);
    setError('');
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        if (digits.length === 4) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, isLoading]);

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      {/* 4 Digit Display */}
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((idx) => {
          const char = digits[idx];
          return (
            <div
              key={idx}
              className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 shadow-inner ${
                char
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 scale-[1.03] shadow-indigo-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              {char || '_'}
            </div>
          );
        })}
      </div>

      {/* Instant Validation Warning */}
      {error && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium bg-red-950/40 border border-red-900/50 py-1.5 px-3 rounded-lg animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Numeric Keypad Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => {
          const isSelected = digits.includes(num);
          return (
            <button
              key={num}
              type="button"
              disabled={isLoading || isSelected}
              onClick={() => handleKeyPress(num)}
              className={`h-12 rounded-xl font-mono text-lg font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center ${
                isSelected
                  ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed opacity-40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-indigo-500'
              }`}
            >
              {num}
            </button>
          );
        })}

        {/* Bottom Row */}
        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={handleClear}
          className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/80 font-medium text-xs flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-30"
          title="Clear (Esc)"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>

        <button
          type="button"
          disabled={isLoading || digits.includes('0')}
          onClick={() => handleKeyPress('0')}
          className={`h-12 rounded-xl font-mono text-lg font-bold transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center ${
            digits.includes('0')
              ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed opacity-40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-indigo-500'
          }`}
        >
          0
        </button>

        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={handleBackspace}
          className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/80 font-medium text-xs flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-30"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isLoading || digits.length !== 4}
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {isLoading ? 'Evaluating...' : 'Submit Guess'}
      </button>
    </div>
  );
};
