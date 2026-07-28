'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface KeypadInputProps {
  onSubmit: (guess: string) => void;
  isLoading: boolean;
}

export const KeypadInput: React.FC<KeypadInputProps> = ({ onSubmit, isLoading }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState('');

  const addDigit = useCallback((d: string) => {
    if (digits.length >= 4) return;
    if (digits.includes(d)) {
      setError(`'${d}' already used`);
      return;
    }
    setError('');
    setDigits(prev => [...prev, d]);
  }, [digits]);

  const removeLast = useCallback(() => {
    setError('');
    setDigits(prev => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setError('');
    setDigits([]);
  }, []);

  const submit = useCallback(() => {
    if (digits.length !== 4) {
      setError('Enter 4 digits');
      return;
    }
    onSubmit(digits.join(''));
    setDigits([]);
    setError('');
  }, [digits, onSubmit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isLoading) return;
      if (e.key >= '0' && e.key <= '9') addDigit(e.key);
      else if (e.key === 'Backspace') removeLast();
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Enter' && digits.length === 4) submit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [digits, isLoading, addDigit, removeLast, clearAll, submit]);

  return (
    <div className="w-full space-y-4">
      {/* Digit Display */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono text-xl sm:text-2xl font-bold transition-all ${
              digits[i]
                ? 'bg-surface-2 border-accent/40 text-white'
                : 'bg-surface-1 border-surface-border text-neutral-700'
            }`}
          >
            {digits[i] || '·'}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-dead text-center animate-fade-in">{error}</p>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-[240px] sm:max-w-[280px] mx-auto">
        {['1','2','3','4','5','6','7','8','9'].map((n) => {
          const used = digits.includes(n);
          return (
            <button
              key={n}
              type="button"
              disabled={isLoading || used}
              onClick={() => addDigit(n)}
              className={`h-11 sm:h-12 rounded-xl font-mono text-base font-semibold transition-all active:scale-95 ${
                used
                  ? 'bg-surface-1 text-neutral-700 cursor-not-allowed'
                  : 'bg-surface-2 text-neutral-200 hover:bg-surface-3 border border-surface-border hover:border-neutral-600'
              }`}
            >
              {n}
            </button>
          );
        })}

        {/* Bottom row */}
        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={clearAll}
          className="h-11 sm:h-12 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-300 bg-surface-1 border border-surface-border transition-colors disabled:opacity-30 active:scale-95"
        >
          Clear
        </button>

        <button
          type="button"
          disabled={isLoading || digits.includes('0')}
          onClick={() => addDigit('0')}
          className={`h-11 sm:h-12 rounded-xl font-mono text-base font-semibold transition-all active:scale-95 ${
            digits.includes('0')
              ? 'bg-surface-1 text-neutral-700 cursor-not-allowed'
              : 'bg-surface-2 text-neutral-200 hover:bg-surface-3 border border-surface-border hover:border-neutral-600'
          }`}
        >
          0
        </button>

        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={removeLast}
          className="h-11 sm:h-12 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-300 bg-surface-1 border border-surface-border transition-colors disabled:opacity-30 active:scale-95"
        >
          ←
        </button>
      </div>

      {/* Submit */}
      <div className="max-w-[240px] sm:max-w-[280px] mx-auto">
        <button
          type="button"
          disabled={isLoading || digits.length !== 4}
          onClick={submit}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-dim text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isLoading ? 'Checking...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};
