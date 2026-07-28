'use client';

import React from 'react';
import { GuessRecord, GameMode, Player } from '@/lib/api';

interface GuessHistoryProps {
  history: GuessRecord[];
  player1History?: GuessRecord[];
  player2History?: GuessRecord[];
  mode: GameMode;
  currentTurn?: Player;
}

/** Four Mastermind-style pegs: solid = Dead, ringed = Wounded, faint = no match. */
function FeedbackPegs({ dead, wounded }: { dead: number; wounded: number }) {
  const pegs: ('dead' | 'wounded' | 'none')[] = [];
  for (let i = 0; i < dead; i++) pegs.push('dead');
  for (let i = 0; i < wounded; i++) pegs.push('wounded');
  while (pegs.length < 4) pegs.push('none');

  return (
    <div className="flex items-center gap-1.5">
      {pegs.map((p, i) => (
        <span
          key={i}
          className={
            p === 'dead'
              ? 'h-2.5 w-2.5 rounded-full bg-dead shadow-[0_0_8px_rgba(242,85,90,0.5)]'
              : p === 'wounded'
                ? 'h-2.5 w-2.5 rounded-full border-2 border-wounded'
                : 'h-2.5 w-2.5 rounded-full bg-surface-3'
          }
        />
      ))}
    </div>
  );
}

function GuessRow({ item, round }: { item: GuessRecord; round: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-surface-border bg-surface-2/60 px-3.5 py-3 transition-colors hover:border-slate-200 animate-slide-up">
      <div className="flex items-center gap-3.5">
        <span className="w-6 font-mono text-[11px] text-slate-400">{round.toString().padStart(2, '0')}</span>
        <span className="font-mono text-lg font-semibold tracking-[0.35em] text-slate-900">{item.guess}</span>
      </div>
      <div className="flex items-center gap-4">
        <FeedbackPegs dead={item.dead} wounded={item.wounded} />
        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          <span className={item.dead > 0 ? 'text-dead' : 'text-slate-400'}>{item.dead}<span className="text-slate-400">D</span></span>
          <span className={item.wounded > 0 ? 'text-wounded' : 'text-slate-400'}>{item.wounded}<span className="text-slate-400">W</span></span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-surface-border py-10 text-center">
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Column({
  title,
  list,
  active,
  accent,
}: {
  title: string;
  list: GuessRecord[];
  active: boolean;
  accent: 'accent' | 'win';
}) {
  const dot = accent === 'accent' ? 'bg-accent' : 'bg-win';
  const ring = active
    ? accent === 'accent'
      ? 'border-accent/40'
      : 'border-win/40'
    : 'border-surface-border opacity-70';

  return (
    <div className={`space-y-2.5 rounded-2xl border bg-surface-1/60 p-3 transition-all ${ring}`}>
      <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          <span className="text-xs font-semibold text-slate-800">{title}</span>
        </div>
        <span className="text-[10px] text-muted">{list.length} {list.length === 1 ? 'guess' : 'guesses'}</span>
      </div>
      {list.length === 0 ? (
        <EmptyState label="No guesses yet" />
      ) : (
        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {list.map((item, idx) => (
            <GuessRow key={idx} item={item} round={list.length - idx} />
          ))}
        </div>
      )}
    </div>
  );
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({
  history,
  player1History = [],
  player2History = [],
  mode,
  currentTurn,
}) => {
  const is2P = mode === 'TWO_PLAYER_SAME_DEVICE';

  if (is2P) {
    const p1List = [...(player1History.length > 0 ? player1History : history.filter((r) => r.player === 'PLAYER_1'))].reverse();
    const p2List = [...(player2History.length > 0 ? player2History : history.filter((r) => r.player === 'PLAYER_2'))].reverse();
    const isP1Turn = currentTurn === 'PLAYER_1';

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold text-slate-600">Deduction log</h2>
          <span className="eyebrow">side&nbsp;by&nbsp;side</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Column title="Player 1" list={p1List} active={isP1Turn} accent="accent" />
          <Column title="Player 2" list={p2List} active={!isP1Turn} accent="win" />
        </div>
      </div>
    );
  }

  const reversed = [...history].reverse();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold text-slate-600">Deduction log</h2>
        <span className="eyebrow">{history.length} {history.length === 1 ? 'guess' : 'guesses'}</span>
      </div>
      {history.length === 0 ? (
        <EmptyState label="Your guesses and their Dead / Wounded feedback will appear here" />
      ) : (
        <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
          {reversed.map((item, index) => (
            <GuessRow key={index} item={item} round={history.length - index} />
          ))}
        </div>
      )}
    </div>
  );
};
