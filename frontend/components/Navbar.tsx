'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, RotateCcw } from 'lucide-react';
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
      <header className="sticky top-0 z-30 w-full border-b border-surface-border bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-glow">
              <span className="font-mono text-[13px] font-bold text-white">DW</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">Dead &amp; Wounded</h1>
              <p className="text-[10px] font-medium text-muted">
                {mode ? (mode === 'VS_COMPUTER' ? 'Solo · vs Computer' : 'Pass &amp; Play') : 'Code Breaker'}
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => setShowRules(true)}
              className="hidden items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-slate-300 hover:text-slate-900 sm:flex"
            >
              How to Play
            </button>
            <Link
              href="/about"
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Engineering</span>
            </Link>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </nav>
        </div>
      </header>

      <InstructionsModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </>
  );
};
