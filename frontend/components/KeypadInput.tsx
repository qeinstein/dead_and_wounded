'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';

interface KeypadInputProps {
  onSubmit: (guess: string) => void;
  isLoading: boolean;
}

export const KeypadInput: React.FC<KeypadInputProps> = ({ onSubmit, isLoading }) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState('');

  const addDigit = useCallback(
    (d: string) => {
      if (digits.length >= 4) return;
      if (digits.includes(d)) {
        setError(`${d} already used`);
        return;
      }
      setError('');
      setDigits((prev) => [...prev, d]);
    },
    [digits]
  );

  const removeLast = useCallback(() => {
    setError('');
    setDigits((prev) => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setError('');
    setDigits([]);
  }, []);

  const submit = useCallback(() => {
    if (digits.length !== 4) {
      setError('Enter all 4 digits');
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

  const ready = digits.length === 4;

  return (
    <div className="panel px-5 py-6 sm:px-7 sm:py-7">
      {/* 3D readout */}
      <CodeDisplay digits={digits} />

      {/* status line */}
      <div className="mt-1 mb-5 h-4 text-center">
        {error ? (
          <p className="text-[11px] font-medium text-dead animate-fade-in">{error}</p>
        ) : (
          <p className="eyebrow">
            {ready ? 'Ready — submit your guess' : `${digits.length} / 4 digits`}
          </p>
        )}
      </div>

      {/* keypad */}
      <div className="mx-auto grid max-w-[300px] grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => {
          const used = digits.includes(n);
          return (
            <KeyButton key={n} disabled={isLoading || used} used={used} onClick={() => addDigit(n)}>
              {n}
            </KeyButton>
          );
        })}

        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={clearAll}
          className="h-12 rounded-xl border border-surface-border bg-surface-1 text-[11px] font-semibold uppercase tracking-wider text-muted transition-all hover:text-slate-800 disabled:opacity-30 active:scale-95"
        >
          Clear
        </button>

        <KeyButton disabled={isLoading || digits.includes('0')} used={digits.includes('0')} onClick={() => addDigit('0')}>
          0
        </KeyButton>

        <button
          type="button"
          disabled={isLoading || digits.length === 0}
          onClick={removeLast}
          aria-label="Delete last digit"
          className="flex h-12 items-center justify-center rounded-xl border border-surface-border bg-surface-1 text-muted transition-all hover:text-slate-800 disabled:opacity-30 active:scale-95"
        >
          <Delete className="h-4 w-4" />
        </button>
      </div>

      {/* submit */}
      <button
        type="button"
        disabled={isLoading || !ready}
        onClick={submit}
        className="mx-auto mt-4 flex h-12 w-full max-w-[300px] items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white shadow-glow transition-all hover:bg-accent-dim disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-slate-400 disabled:shadow-none active:scale-[0.98]"
      >
        {isLoading ? 'Checking…' : 'Submit Guess'}
      </button>
    </div>
  );
};

function KeyButton({
  children,
  used,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  used: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`h-12 rounded-xl border font-mono text-lg font-semibold transition-all active:scale-95 ${
        used
          ? 'cursor-not-allowed border-surface-border bg-surface-1 text-slate-300'
          : 'border-surface-border bg-surface-2 text-slate-900 hover:border-accent/40 hover:bg-surface-3'
      }`}
    >
      {children}
    </button>
  );
}
