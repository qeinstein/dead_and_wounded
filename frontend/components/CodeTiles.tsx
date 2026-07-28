'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CodeTiles — the game's genuine 3D element.
 *
 * A precision-machined row of four tiles seated in a dark bezel. Each tile shows
 * the digit currently entered for its slot; filled tiles rise and glow with the
 * accent colour, and every keypress kicks a short settle animation.
 *
 * Digits are rasterised to a CanvasTexture with a system monospace font — no
 * external font files, no network, and no UV/alignment guesswork (the digit sits
 * on a flat, camera-facing quad).
 */

const SLOTS = 4;
const SPACING = 1.5;
const TILE_W = 1.15;
const TILE_H = 1.5;
const TILE_D = 0.34;

const ACCENT = '#7c6cff';

function makeDigitTexture(char: string, filled: boolean): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = filled ? '#f6f7fb' : '#39404f';
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
  const anim = useRef(0); // settle-animation phase (1 -> 0)
  const glow = useRef(0); // 0 (empty) -> 1 (filled), smoothed

  const filled = Boolean(digit);
  const char = digit ?? '·';

  const texture = useMemo(() => makeDigitTexture(char, filled), [char, filled]);

  useEffect(() => {
    // kick the settle animation whenever this slot's value changes
    anim.current = 1;
    return () => texture.dispose();
  }, [char, filled, texture]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    anim.current = Math.max(0, anim.current - delta * 3.2);
    glow.current += ((filled ? 1 : 0) - glow.current) * Math.min(1, delta * 8);

    // nod/settle — always returns to rest at 0
    const nod = Math.sin(anim.current * Math.PI);
    g.rotation.x = nod * -0.5;
    g.position.y = glow.current * 0.09 + nod * 0.04;

    if (glowRef.current) glowRef.current.emissiveIntensity = glow.current * 2.4;
    if (bodyRef.current) {
      bodyRef.current.emissiveIntensity = glow.current * 0.15;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      {/* recessed socket */}
      <RoundedBox args={[TILE_W + 0.22, TILE_H + 0.22, 0.22]} radius={0.1} smoothness={4} position={[0, 0, -0.16]}>
        <meshStandardMaterial color="#0b0d12" roughness={0.95} metalness={0.1} />
      </RoundedBox>

      {/* the tile itself */}
      <group ref={group}>
        <RoundedBox args={[TILE_W, TILE_H, TILE_D]} radius={0.11} smoothness={5}>
          <meshStandardMaterial
            ref={bodyRef}
            color={filled ? '#212636' : '#171b24'}
            roughness={0.42}
            metalness={0.55}
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
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 7, 6]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#8ea2ff" />
      <pointLight position={[0, -1.5, 2.5]} intensity={0.6} color={ACCENT} />

      {Array.from({ length: SLOTS }).map((_, i) => (
        <Tile key={i} digit={digits[i]} x={i * SPACING - offset} />
      ))}

      <ContactShadows
        position={[0, -TILE_H / 2 - 0.12, 0]}
        opacity={0.5}
        scale={9}
        blur={2.6}
        far={4}
        resolution={512}
        color="#000000"
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
