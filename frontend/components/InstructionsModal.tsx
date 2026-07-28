'use client';

import React from 'react';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="panel w-full max-w-sm space-y-5 p-6 text-left animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-semibold text-white">How to play</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border text-muted transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-white">Objective</p>
          <p className="text-xs leading-relaxed text-muted">
            Crack the secret <span className="text-neutral-200">4-digit code</span>. Every digit is unique (0–9) — no repeats.
          </p>
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-medium text-white">Feedback</p>
          <div className="space-y-2.5 rounded-xl border border-surface-border bg-surface-2 p-3.5">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 flex-shrink-0 rounded-full bg-dead shadow-[0_0_8px_rgba(242,85,90,0.5)]" />
              <p className="text-xs text-muted">
                <span className="font-semibold text-dead">Dead</span> — right digit, right position.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 flex-shrink-0 rounded-full border-2 border-wounded" />
              <p className="text-xs text-muted">
                <span className="font-semibold text-wounded">Wounded</span> — right digit, wrong position.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-white">Example</p>
          <div className="space-y-1 rounded-xl border border-surface-border bg-surface-2 p-3.5 font-mono text-xs">
            <p><span className="text-muted">Secret</span> &nbsp;<span className="font-bold tracking-[0.3em] text-accent">3071</span></p>
            <p><span className="text-muted">Guess&nbsp;</span> &nbsp;<span className="font-bold tracking-[0.3em] text-white">3170</span></p>
            <p className="border-t border-surface-border pt-1.5 text-muted">
              → <span className="font-semibold text-dead">2 Dead</span> (3, 7) · <span className="font-semibold text-wounded">2 Wounded</span> (0, 1)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-xl bg-accent text-xs font-semibold text-white transition-colors hover:bg-accent-dim active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
