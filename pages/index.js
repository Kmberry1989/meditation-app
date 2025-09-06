import React, { Suspense } from 'react';
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
  return (
    <div className="app-container">
      <Canvas
        className="scene-canvas"
        shadows
        camera={{ position: [5, 3, 8], fov: 50 }}
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