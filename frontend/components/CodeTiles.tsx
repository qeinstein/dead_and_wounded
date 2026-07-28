'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CodeTiles — the game's genuine 3D element, tuned for the light theme.
 *
 * A precision-machined row of four light tiles seated in a soft recessed bezel. Each tile
 * shows the digit entered for its slot; filled tiles rise, brighten, and light an indigo
 * accent underline, and every keypress kicks a short settle animation.
 *
 * Digits are rasterised to a CanvasTexture with a system monospace font — no external font
 * files, no network, no UV guesswork (the digit sits on a flat, camera-facing quad).
 */

const SLOTS = 4;
const SPACING = 1.5;
const TILE_W = 1.15;
const TILE_H = 1.5;
const TILE_D = 0.34;

const ACCENT = '#4f46e5';

function makeDigitTexture(char: string, filled: boolean): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  // dark digit on light tile when filled; faint grey placeholder dot otherwise
  ctx.fillStyle = filled ? '#0f172a' : '#cbd5e1';
  ctx.font = `700 ${filled ? size * 0.62 : size * 0.4}px ui-monospace, "JetBrains Mono", Menlo, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2 + size * 0.02);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function Tile({ digit, x }: { digit: string | undefined; x: number }) {
  const group = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  const bodyRef = useRef<THREE.MeshStandardMaterial>(null);
  const anim = useRef(0);
  const glow = useRef(0);

  const filled = Boolean(digit);
  const char = digit ?? '·';

  const texture = useMemo(() => makeDigitTexture(char, filled), [char, filled]);

  useEffect(() => {
    anim.current = 1;
    return () => texture.dispose();
  }, [char, filled, texture]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    anim.current = Math.max(0, anim.current - delta * 3.2);
    glow.current += ((filled ? 1 : 0) - glow.current) * Math.min(1, delta * 8);

    const nod = Math.sin(anim.current * Math.PI);
    g.rotation.x = nod * -0.5;
    g.position.y = glow.current * 0.09 + nod * 0.04;

    if (glowRef.current) glowRef.current.emissiveIntensity = glow.current * 2.6;
    if (bodyRef.current) bodyRef.current.emissiveIntensity = glow.current * 0.08;
  });

  return (
    <group position={[x, 0, 0]}>
      {/* recessed socket */}
      <RoundedBox args={[TILE_W + 0.22, TILE_H + 0.22, 0.22]} radius={0.1} smoothness={4} position={[0, 0, -0.16]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} metalness={0.05} />
      </RoundedBox>

      {/* the tile itself */}
      <group ref={group}>
        <RoundedBox args={[TILE_W, TILE_H, TILE_D]} radius={0.11} smoothness={5}>
          <meshStandardMaterial
            ref={bodyRef}
            color={filled ? '#ffffff' : '#eef1f6'}
            roughness={0.45}
            metalness={0.2}
            emissive={ACCENT}
            emissiveIntensity={0}
          />
        </RoundedBox>

        {/* digit face */}
        <mesh position={[0, 0, TILE_D / 2 + 0.011]}>
          <planeGeometry args={[TILE_W * 0.92, TILE_H * 0.92]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} />
        </mesh>

        {/* accent underline that glows when the slot is filled */}
        <mesh position={[0, -TILE_H / 2 + 0.14, TILE_D / 2 + 0.012]}>
          <planeGeometry args={[TILE_W * 0.5, 0.055]} />
          <meshStandardMaterial
            ref={glowRef}
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Scene({ digits }: { digits: string[] }) {
  const offset = ((SLOTS - 1) * SPACING) / 2;
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 8, 6]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 3, 4]} intensity={0.55} color="#c7d2fe" />
      <pointLight position={[0, -1, 3]} intensity={0.35} color={ACCENT} />

      {Array.from({ length: SLOTS }).map((_, i) => (
        <Tile key={i} digit={digits[i]} x={i * SPACING - offset} />
      ))}

      <ContactShadows
        position={[0, -TILE_H / 2 - 0.12, 0]}
        opacity={0.28}
        scale={9}
        blur={2.8}
        far={4}
        resolution={512}
        color="#475569"
      />
    </>
  );
}

export default function CodeTiles({ digits }: { digits: string[] }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 7], fov: 26 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene digits={digits} />
    </Canvas>
  );
}
