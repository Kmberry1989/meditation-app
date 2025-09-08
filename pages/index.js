'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Environment from '../components/Environment';
import Avatar from '../components/Avatar';
import AvatarCreator from '../components/AvatarCreator';
import useStore from '../store/useStore';

export default function Home() {
  const idleMode = useStore((state) => state.idleMode);
  const [gl, setGl] = useState(null);

  useEffect(() => {
    if (!gl) return;
    const canvas = gl.domElement;
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('WebGL context lost.');
    };
    const handleContextRestored = () => {
      console.info('WebGL context restored.');
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost, false);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
    };
  }, [gl]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Suspense fallback={<div>Loading 3D Scene...</div>}>
        <Canvas
          className="scene-canvas"
          shadows
          camera={{ position: [5, 3, 8], fov: 50 }}
          onCreated={({ gl }) => setGl(gl)}
        >
          <Environment idleMode={idleMode} />
          <Avatar position={[0, 1.1, 0]} />
        </Canvas>
      </Suspense>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <AvatarCreator />
      </div>
    </div>
  );
}
