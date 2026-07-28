'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';

interface GameSetupProps {
  onStartGame: (mode: GameMode, customSecretCode?: string) => void;
  isLoading: boolean;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, isLoading }) => {
  const [mode, setMode] = useState<GameMode>('VS_COMPUTER');
  const [codeType, setCodeType] = useState<'random' | 'custom'>('random');
  const [customCode, setCustomCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const validate = (val: string): boolean => {
    if (!val) { setError(''); return false; }
    if (!/^\d+$/.test(val)) { setError('Numbers only (0–9)'); return false; }
    if (new Set(val).size !== val.length) { setError('No duplicate digits'); return false; }
    if (val.length !== 4) { setError('Must be 4 digits'); return false; }
    setError('');
    return true;
  };

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCustomCode(val);
    validate(val);
  };

  const handleStart = () => {
    if (mode === 'TWO_PLAYER_SAME_DEVICE' && codeType === 'custom') {
      if (!validate(customCode)) {
        if (!error) setError('Enter a valid 4-digit code');
        return;
      }
      onStartGame(mode, customCode);
    } else {
      onStartGame(mode);
    }
  };

  const is2P = mode === 'TWO_PLAYER_SAME_DEVICE';

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-white">New Game</h2>
        <p className="text-xs text-neutral-500">Crack the secret 4-digit code</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-surface-1 border border-surface-border p-1 gap-1">
        {(['VS_COMPUTER', 'TWO_PLAYER_SAME_DEVICE'] as GameMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              mode === m
                ? 'bg-accent text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {m === 'VS_COMPUTER' ? 'Solo' : '2 Players'}
          </button>
        ))}
      </div>

      {/* Mode Description */}
      <div className="rounded-xl bg-surface-1 border border-surface-border p-4">
        {!is2P ? (
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-neutral-300">Computer generates the code</p>
            <p className="text-[11px] text-neutral-500">Guess it in as few tries as possible</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-neutral-300 text-center">Secret code for this round</p>

            {/* Code Type */}
            <div className="flex gap-2">
              {(['random', 'custom'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setCodeType(t); setError(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    codeType === t
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-surface-border text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {t === 'random' ? 'Random' : 'Custom'}
                </button>
              ))}
            </div>

            {codeType === 'custom' && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showCode ? 'text' : 'password'}
                    maxLength={4}
                    value={customCode}
                    onChange={onCodeChange}
                    placeholder="e.g. 1234"
                    className="w-full px-4 py-3 bg-surface-2 border border-surface-border rounded-xl text-center tracking-[0.5em] font-mono text-base text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-neutral-300"
                  >
                    {showCode ? 'hide' : 'show'}
                  </button>
                </div>
                {error && (
                  <p className="text-[11px] text-dead text-center">{error}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading || (is2P && codeType === 'custom' && customCode.length !== 4)}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-dim text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? 'Starting...' : 'Start Game'}
      </button>

      {/* Collapsible Rules Guide */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300 py-1 transition-colors border-t border-surface-border/50 pt-3"
        >
          <span>How to Play &amp; Rules</span>
          <span>{showInstructions ? '▲' : '▼'}</span>
        </button>

        {showInstructions && (
          <div className="mt-3 p-3.5 bg-surface-1 rounded-xl border border-surface-border space-y-2.5 text-xs text-neutral-400 animate-fade-in text-left">
            <p className="text-neutral-300 font-medium">
              Guess the secret 4-digit code (numbers 0–9, no duplicates).
            </p>
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-dead">Dead (D)</span>
                <span>Correct digit in the correct position.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-wounded">Wounded (W)</span>
                <span>Correct digit, but in wrong position.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
