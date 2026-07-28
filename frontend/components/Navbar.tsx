'use client';

import React, { useState } from 'react';
import { GameMode } from '@/lib/api';
import { InstructionsModal } from './InstructionsModal';

interface NavbarProps {
  mode?: GameMode;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode, onReset }) => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <header className="w-full border-b border-surface-border bg-surface-1/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white text-xs font-bold">DW</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Dead &amp; Wounded</h1>
              {mode && (
                <p className="text-[10px] text-neutral-500 font-medium">
                  {mode === 'VS_COMPUTER' ? 'vs Computer' : 'Pass &amp; Play'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRules(true)}
              className="text-xs font-medium text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-surface-border hover:border-neutral-600 transition-colors flex items-center gap-1"
              title="How to Play"
            >
              <span>Rules</span>
            </button>

            <button
              onClick={onReset}
              className="text-xs font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-surface-border hover:border-neutral-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </header>

      <InstructionsModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </>
  );
};
