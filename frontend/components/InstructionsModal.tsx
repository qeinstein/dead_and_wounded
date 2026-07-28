'use client';

import React from 'react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-surface-1 border border-surface-border rounded-2xl p-6 space-y-4 animate-scale-in text-left">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-bold text-white">How to Play</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-white text-xs font-mono px-2 py-1 rounded-lg border border-surface-border"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-neutral-300">
          <div className="space-y-1">
            <p className="font-semibold text-white">Objective</p>
            <p className="text-neutral-400 leading-relaxed">
              Crack the secret <strong className="text-white">4-digit code</strong>. All digits are unique (0–9). No duplicate digits allowed.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <p className="font-semibold text-white">Feedback Rules</p>
            <div className="p-2.5 bg-surface-2 rounded-xl border border-surface-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-dead text-xs mt-0.5">DEAD (D)</span>
                <span className="text-[11px] text-neutral-400">Correct digit in the <strong className="text-neutral-200">exact position</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-wounded text-xs mt-0.5">WOUNDED (W)</span>
                <span className="text-[11px] text-neutral-400">Correct digit exists, but in the <strong className="text-neutral-200">wrong position</strong>.</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <p className="font-semibold text-white">Example</p>
            <div className="p-2.5 bg-surface-2 rounded-xl border border-surface-border font-mono text-[11px] space-y-1">
              <p><span className="text-neutral-500">Secret:</span> <span className="text-accent font-bold">3 0 7 1</span></p>
              <p><span className="text-neutral-500">Guess:</span>  <span className="text-white font-bold">3 1 7 0</span></p>
              <p className="text-neutral-400 pt-1">
                Result: <span className="text-dead font-bold">2 Dead</span> (3 &amp; 7), <span className="text-wounded font-bold">2 Wounded</span> (0 &amp; 1)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-semibold text-xs bg-accent hover:bg-accent-dim text-white transition-colors active:scale-[0.98] mt-2"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
