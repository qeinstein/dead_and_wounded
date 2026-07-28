'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';

interface GameSetupProps {
  onStartGame: (mode: GameMode, p1Code?: string, p2Code?: string) => void;
  isLoading: boolean;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, isLoading }) => {
  const [mode, setMode] = useState<GameMode>('VS_COMPUTER');
  const [p1CodeType, setP1CodeType] = useState<'random' | 'custom'>('random');
  const [p1CustomCode, setP1CustomCode] = useState('');
  const [showP1Code, setShowP1Code] = useState(false);

  const [p2CodeType, setP2CodeType] = useState<'random' | 'custom'>('random');
  const [p2CustomCode, setP2CustomCode] = useState('');
  const [showP2Code, setShowP2Code] = useState(false);

  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const validate = (val: string, label: string): boolean => {
    if (!val) { setError(''); return false; }
    if (!/^\d+$/.test(val)) { setError(`${label}: Numbers only (0–9)`); return false; }
    if (new Set(val).size !== val.length) { setError(`${label}: No duplicate digits allowed`); return false; }
    if (val.length !== 4) { setError(`${label}: Must be 4 digits`); return false; }
    setError('');
    return true;
  };

  const handleStart = () => {
    if (mode === 'TWO_PLAYER_SAME_DEVICE') {
      let code1: string | undefined = undefined;
      let code2: string | undefined = undefined;

      if (p1CodeType === 'custom') {
        if (!validate(p1CustomCode, 'Player 1 Code')) return;
        code1 = p1CustomCode;
      }
      if (p2CodeType === 'custom') {
        if (!validate(p2CustomCode, 'Player 2 Code')) return;
        code2 = p2CustomCode;
      }

      onStartGame(mode, code1, code2);
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
            {m === 'VS_COMPUTER' ? 'Solo vs Computer' : '2 Players (Pass & Play)'}
          </button>
        ))}
      </div>

      {/* Mode Configuration */}
      <div className="rounded-xl bg-surface-1 border border-surface-border p-4 space-y-4">
        {!is2P ? (
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-neutral-300">Computer generates a secret code</p>
            <p className="text-[11px] text-neutral-500">Try to guess it in as few moves as possible!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-neutral-300 text-center">
              Each player sets a secret code for the other to guess!
            </p>

            {/* Player 1 Code Setup */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent">Player 1 Secret Code</span>
                <span className="text-[10px] text-neutral-500">(Guessed by Player 2)</span>
              </div>

              <div className="flex gap-2">
                {(['random', 'custom'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setP1CodeType(t); setError(''); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      p1CodeType === t
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-surface-border text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {t === 'random' ? 'Random Code' : 'Custom Code'}
                  </button>
                ))}
              </div>

              {p1CodeType === 'custom' && (
                <div className="relative">
                  <input
                    type={showP1Code ? 'text' : 'password'}
                    maxLength={4}
                    value={p1CustomCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setP1CustomCode(val);
                      validate(val, 'Player 1 Code');
                    }}
                    placeholder="Player 1 Code (e.g. 1234)"
                    className="w-full px-3 py-2 bg-surface-2 border border-surface-border rounded-xl text-center tracking-[0.4em] font-mono text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowP1Code(!showP1Code)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-neutral-300"
                  >
                    {showP1Code ? 'hide' : 'show'}
                  </button>
                </div>
              )}
            </div>

            {/* Player 2 Code Setup */}
            <div className="space-y-2 border-t border-surface-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-400">Player 2 Secret Code</span>
                <span className="text-[10px] text-neutral-500">(Guessed by Player 1)</span>
              </div>

              <div className="flex gap-2">
                {(['random', 'custom'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setP2CodeType(t); setError(''); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      p2CodeType === t
                        ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                        : 'border-surface-border text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {t === 'random' ? 'Random Code' : 'Custom Code'}
                  </button>
                ))}
              </div>

              {p2CodeType === 'custom' && (
                <div className="relative">
                  <input
                    type={showP2Code ? 'text' : 'password'}
                    maxLength={4}
                    value={p2CustomCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setP2CustomCode(val);
                      validate(val, 'Player 2 Code');
                    }}
                    placeholder="Player 2 Code (e.g. 5678)"
                    className="w-full px-3 py-2 bg-surface-2 border border-surface-border rounded-xl text-center tracking-[0.4em] font-mono text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowP2Code(!showP2Code)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-neutral-300"
                  >
                    {showP2Code ? 'hide' : 'show'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-[11px] text-dead text-center pt-1">{error}</p>
        )}
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-dim text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? 'Starting...' : 'Start Match'}
      </button>

      {/* Collapsible Rules Guide */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300 py-1 transition-colors border-t border-surface-border/50 pt-3"
        >
          <span>How 2-Player Match Works</span>
          <span>{showInstructions ? '▲' : '▼'}</span>
        </button>

        {showInstructions && (
          <div className="mt-3 p-3.5 bg-surface-1 rounded-xl border border-surface-border space-y-2 text-xs text-neutral-400 animate-fade-in text-left">
            <p className="text-neutral-300 font-medium">
              Both players set a secret 4-digit code. Players take turns trying to guess the opponent&apos;s code!
            </p>
            <div className="space-y-1 pt-1 text-[11px]">
              <p><strong className="text-accent">Player 1 Turn:</strong> Guesses Player 2&apos;s secret code.</p>
              <p><strong className="text-purple-400">Player 2 Turn:</strong> Guesses Player 1&apos;s secret code.</p>
              <p className="text-neutral-400 pt-1">First player to get <strong className="text-dead">4 Dead</strong> wins!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
