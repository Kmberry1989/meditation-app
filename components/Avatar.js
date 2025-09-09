'use client';
import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../store/useStore';

// Avatar: adjustable humanoid figure
export default function Avatar({ position = [0, 0, 0] }) {
  const { bodyType, hairColor, skinTone, accessory } = useStore((state) => state.avatar);
  // Scale factor for body based on type
  const scale = useMemo(() => {
    switch (bodyType) {
      case 'slim': return [0.8, 1.0, 0.8];
      case 'full': return [1.2, 1.0, 1.2];
      default: return [1.0, 1.0, 1.0];
    }
  }, [bodyType]);
  return (
    <group position={position} scale={scale}>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.35, 0.65, 0.2]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.10, 0.65, 0]}>
        <boxGeometry args={[0.09, 0.45, 0.09]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      <mesh position={[0.10, 0.65, 0]}>
        <boxGeometry args={[0.09, 0.45, 0.09]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      {/* Accessory */}
      {accessory === 'hat' && (
        <mesh position={[0, 1.93, 0]}>
          <cylinderGeometry args={[0.14, 0.10, 0.12, 14]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      )}
    </group>
  );
}
