'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Environment from '../components/Environment';
import Avatar from '../components/Avatar';
import AvatarCreator from '../components/AvatarCreator';
import useStore from '../store/useStore';

/**
 * The home page renders a full‑screen 3D canvas using React Three
 * Fiber.  The Environment component contains the porch, weather
 * and animals, while the Avatar represents the user.  An overlay
 * panel allows the user to customise their avatar and toggle idle
 * mode.  The Canvas is wrapped in Suspense to support lazy
 * loading of 3D models.
 */
export default function Home() {
  const idleMode = useStore((state) => state.idleMode);
  const [gl, setGl] = useState(null);

  // Attach WebGL context loss/restoration handlers
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
    <div className="app-container">
      <Canvas
        className="scene-canvas"
        shadows
        camera={{ position: [5, 3, 8], fov: 50 }}
        onCreated={({ gl }) => setGl(gl)}
      >
        <Suspense fallback={null}>
          {/* Render environment with idle mode */}
          <Environment idleMode={idleMode} />
          {/* Place avatar slightly above ground in front of porch */}
          <Avatar position={[0, 0, 2]} />
        </Suspense>
      </Canvas>
      {/* Overlay for UI controls */}
      <div className="ui-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <AvatarCreator />
        {/* Additional UI components could be added here (e.g. mood presets, guides) */}
      </div>
    </div>
  );
}