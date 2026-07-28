'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CodeTiles = dynamic(() => import('./CodeTiles'), {
  ssr: false,
  loading: () => <Fallback />,
});

/** Lightweight 2D placeholder shown before the 3D canvas mounts. */
function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex h-16 w-12 items-center justify-center rounded-xl border border-surface-border bg-surface-2 font-mono text-2xl text-neutral-700"
        >
          ·
        </div>
      ))}
    </div>
  );
}

export function CodeDisplay({ digits }: { digits: string[] }) {
  return (
    <div className="mx-auto w-full max-w-[440px]" style={{ aspectRatio: '16 / 7' }}>
      <CodeTiles digits={digits} />
    </div>
  );
}
