'use client';
import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../store/useStore';

/**
 * Avatar component renders a simple humanoid figure with adjustable
 * proportions and colours.  It responds to global state from
 * zustand to update body type, hair colour, skin tone and accessory.
 * Replace this placeholder with a high‑quality GLB model if you
 * have one; the logic here demonstrates how to react to state.
 */
export default function Avatar({ position = [0, 0, 0] }) {
  const { bodyType, hairColor, skinTone, accessory } = useStore((state) => state.avatar);
  // Scale factor for body based on type
  const scale = useMemo(() => {
    switch (bodyType) {
      case 'slim':
        return [0.8, 1.0, 0.8];
      case 'full':
        return [1.2, 1.0, 1.2];
      default:
        return [1.0, 1.0, 1.0];
    }
  }, [bodyType]);
  return (
    <group position={position} scale={scale}>
      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.4, 0.7, 0.2]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.12, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0.12, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Accessory */}
      {accessory === 'hat' && (
        <mesh position={[0, 2.3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.35, 0.4, 16]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
    </group>
  );
}