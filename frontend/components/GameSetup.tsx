'use client';

import React, { useState } from 'react';
import { User, Users, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { GameMode } from '@/lib/api';

interface GameSetupProps {
  onStartGame: (mode: GameMode, customSecretCode?: string) => void;
  isLoading: boolean;
}

export const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, isLoading }) => {
  const [mode, setMode] = useState<GameMode>('VS_COMPUTER');
  const [customCodeType, setCustomCodeType] = useState<'RANDOM' | 'CUSTOM'>('RANDOM');
  const [customCode, setCustomCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateCode = (val: string): boolean => {
    if (!val) {
      setErrorMsg('');
      return false;
    }
    if (!/^\d+$/.test(val)) {
      setErrorMsg('Code must contain numbers only (0-9)');
      return false;
    }
    const chars = val.split('');
    const hasDupes = new Set(chars).size !== chars.length;
    if (hasDupes) {
      setErrorMsg('All 4 digits must be unique (e.g. 1234)');
      return false;
    }
    if (val.length !== 4) {
      setErrorMsg('Code must be exactly 4 digits long');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCustomCode(val);
    validateCode(val);
  };

  const handleStart = () => {
    if (mode === 'TWO_PLAYER_SAME_DEVICE' && customCodeType === 'CUSTOM') {
      if (!validateCode(customCode)) {
        if (!errorMsg) setErrorMsg('Please enter a valid 4-digit unique code');
        return;
      }
      onStartGame(mode, customCode);
    } else {
      onStartGame(mode);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-white">Setup Game</h2>
        <p className="text-sm text-slate-400">Select game mode & crack the 4-digit code</p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setMode('VS_COMPUTER');
            setErrorMsg('');
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-semibold text-xs transition-all ${
            mode === 'VS_COMPUTER'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" />
          Single Player
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('TWO_PLAYER_SAME_DEVICE');
            setErrorMsg('');
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-semibold text-xs transition-all ${
            mode === 'TWO_PLAYER_SAME_DEVICE'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          2 Players Pass & Play
        </button>
      </div>

      {/* Mode Details */}
      {mode === 'VS_COMPUTER' ? (
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            System Secret Code
          </div>
          <p>The computer will generate a secret 4-digit unique code. Crack it in as few guesses as possible!</p>
        </div>
      ) : (
        <div className="space-y-4 p-4 bg-slate-800/40 rounded-xl border border-slate-800/80">
          <div className="text-xs font-semibold text-slate-300">Player 1 Secret Code Configuration:</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCustomCodeType('RANDOM');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border ${
                customCodeType === 'RANDOM'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              Random Code
            </button>
            <button
              type="button"
              onClick={() => setCustomCodeType('CUSTOM')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border ${
                customCodeType === 'CUSTOM'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              Custom Code
            </button>
          </div>

          {customCodeType === 'CUSTOM' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs text-slate-400 flex items-center justify-between">
                <span>Player 1 Secret Code (4 Unique Digits):</span>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showSecret ? 'Hide' : 'Reveal'}
                </button>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSecret ? 'text' : 'password'}
                  maxLength={4}
                  value={customCode}
                  onChange={handleCustomCodeChange}
                  placeholder="e.g. 1234"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center tracking-[0.4em] font-mono text-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading || (mode === 'TWO_PLAYER_SAME_DEVICE' && customCodeType === 'CUSTOM' && customCode.length !== 4)}
        className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Starting Game...' : 'Start Game'}
      </button>
    </div>
  );
};
