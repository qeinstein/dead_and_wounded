'use client';

import React, { useState } from 'react';
import { Cpu, Users, Eye, EyeOff, Shuffle, PenLine } from 'lucide-react';
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

  const validate = (val: string, label: string): boolean => {
    if (!val) { setError(''); return false; }
    if (!/^\d+$/.test(val)) { setError(`${label}: numbers only (0–9)`); return false; }
    if (new Set(val).size !== val.length) { setError(`${label}: no duplicate digits`); return false; }
    if (val.length !== 4) { setError(`${label}: must be 4 digits`); return false; }
    setError('');
    return true;
  };

  const handleStart = () => {
    if (mode === 'TWO_PLAYER_SAME_DEVICE') {
      let code1: string | undefined;
      let code2: string | undefined;
      if (p1CodeType === 'custom') {
        if (!validate(p1CustomCode, 'Player 1 code')) return;
        code1 = p1CustomCode;
      }
      if (p2CodeType === 'custom') {
        if (!validate(p2CustomCode, 'Player 2 code')) return;
        code2 = p2CustomCode;
      }
      onStartGame(mode, code1, code2);
    } else {
      onStartGame(mode);
    }
  };

  const is2P = mode === 'TWO_PLAYER_SAME_DEVICE';

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <span className="eyebrow">New game</span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Crack the code</h2>
        <p className="mx-auto max-w-xs text-sm text-muted">
          Deduce a secret sequence of four unique digits from Dead &amp; Wounded feedback.
        </p>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-2">
        <ModeCard
          active={!is2P}
          onClick={() => { setMode('VS_COMPUTER'); setError(''); }}
          icon={<Cpu className="h-4 w-4" />}
          title="Solo"
          subtitle="vs Computer"
        />
        <ModeCard
          active={is2P}
          onClick={() => { setMode('TWO_PLAYER_SAME_DEVICE'); setError(''); }}
          icon={<Users className="h-4 w-4" />}
          title="2 Players"
          subtitle="Pass &amp; Play"
        />
      </div>

      {/* Config */}
      <div className="panel space-y-4 p-4">
        {!is2P ? (
          <p className="text-center text-sm text-muted">
            The computer picks a secret code with <span className="text-slate-800">Fisher–Yates</span> shuffling.
            Guess it in as few rounds as possible.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted">Each player sets a code for the other to crack.</p>
            <CodeSetup
              label="Player 1 code"
              hint="guessed by Player 2"
              accent="accent"
              type={p1CodeType}
              setType={(t) => { setP1CodeType(t); setError(''); }}
              value={p1CustomCode}
              show={showP1Code}
              toggleShow={() => setShowP1Code((s) => !s)}
              onChange={(v) => { setP1CustomCode(v); validate(v, 'Player 1 code'); }}
            />
            <CodeSetup
              label="Player 2 code"
              hint="guessed by Player 1"
              accent="win"
              type={p2CodeType}
              setType={(t) => { setP2CodeType(t); setError(''); }}
              value={p2CustomCode}
              show={showP2Code}
              toggleShow={() => setShowP2Code((s) => !s)}
              onChange={(v) => { setP2CustomCode(v); validate(v, 'Player 2 code'); }}
            />
          </div>
        )}
        {error && <p className="text-center text-[11px] font-medium text-dead">{error}</p>}
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white shadow-glow transition-all hover:bg-accent-dim disabled:opacity-40 active:scale-[0.99]"
      >
        {isLoading ? 'Starting…' : 'Start Match'}
      </button>
    </div>
  );
};

function ModeCard({
  active, onClick, icon, title, subtitle,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-accent/50 bg-accent/[0.07] shadow-glow'
          : 'border-surface-border bg-surface-1 hover:border-slate-300'
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-accent text-white' : 'bg-surface-3 text-muted'}`}>
        {icon}
      </span>
      <span>
        <span className={`block text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-600'}`}>{title}</span>
        <span className="block text-[11px] text-muted">{subtitle}</span>
      </span>
    </button>
  );
}

function CodeSetup({
  label, hint, accent, type, setType, value, show, toggleShow, onChange,
}: {
  label: string; hint: string; accent: 'accent' | 'win';
  type: 'random' | 'custom'; setType: (t: 'random' | 'custom') => void;
  value: string; show: boolean; toggleShow: () => void; onChange: (v: string) => void;
}) {
  const dot = accent === 'accent' ? 'bg-accent text-accent' : 'bg-win text-win';
  const focusRing = accent === 'accent' ? 'focus:border-accent/50' : 'focus:border-win/50';

  return (
    <div className="space-y-2.5 border-t border-surface-border pt-3.5 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-2 text-xs font-semibold ${accent === 'accent' ? 'text-accent' : 'text-win'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${dot.split(' ')[0]}`} />
          {label}
        </span>
        <span className="text-[10px] text-muted">{hint}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(['random', 'custom'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] font-medium transition-colors ${
              type === t
                ? accent === 'accent'
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-win/50 bg-win/10 text-win'
                : 'border-surface-border text-muted hover:text-slate-800'
            }`}
          >
            {t === 'random' ? <Shuffle className="h-3 w-3" /> : <PenLine className="h-3 w-3" />}
            {t === 'random' ? 'Random' : 'Custom'}
          </button>
        ))}
      </div>

      {type === 'custom' && (
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            maxLength={4}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="e.g. 1234"
            className={`w-full rounded-xl border border-surface-border bg-surface-2 px-3 py-2.5 text-center font-mono text-sm tracking-[0.4em] text-slate-900 placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none ${focusRing}`}
          />
          <button
            type="button"
            onClick={toggleShow}
            aria-label={show ? 'Hide code' : 'Show code'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-800"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
