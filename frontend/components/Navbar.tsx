'use client';

import React from 'react';
import { Target, RotateCcw, Users, User } from 'lucide-react';
import { GameMode } from '@/lib/api';

interface NavbarProps {
  mode?: GameMode;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onReset }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
            <Target className="w-6 h-6 text-white animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              Dead & Wounded
            </h1>
            <p className="text-xs text-slate-400 font-medium">Bulls & Cows Code Breaker</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {mode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
              {mode === 'VS_COMPUTER' ? (
                <>
                  <User className="w-3.5 h-3.5" /> VS Computer
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5" /> 2 Players (Pass & Play)
                </>
              )}
            </span>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200 active:scale-95 shadow-sm"
            title="Start New Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};
