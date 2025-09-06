"use client";
import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment as DreiEnvironment } from '@react-three/drei';

/**
 * Rain particle system using instanced meshes.
 *
 * Instanced meshes allow Three.js to efficiently render many
 * identical geometries with differing transforms, as noted in
 * performance guidelines for Three.js【987843542628762†L67-L76】.  By
 * reusing a single geometry and material, the GPU can draw
 * hundreds of raindrops with minimal overhead.
 */
function Rain({ count = 400, areaSize = 20, height = 10, rainIntensity = 1 }) {
  const meshRef = useRef();
  // Precompute random initial positions for each raindrop
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * areaSize;
      const y = Math.random() * height;
      const z = (Math.random() - 0.5) * areaSize;
      arr.push([x, y, z]);
    }
    return arr;
  }, [count, areaSize, height]);
  // Dummy object used to update instance matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!meshRef.current) return;
    // Update each drop
    for (let i = 0; i < count; i++) {
      const pos = positions[i];
      // Move downward proportionally to rain intensity
      pos[1] -= 0.25 * rainIntensity;
      if (pos[1] < 0) pos[1] = height;
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.scale.set(0.02, 0.3, 0.02);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    // Inform Three.js that matrices have updated
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <cylinderGeometry args={[0.01, 0.01, 1]} />
      <meshStandardMaterial color="#88aaff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/**
 * Simple audio component using the Web Audio API.  This component
 * creates an <audio> element and starts playing when mounted.
 */
function AmbientAudio({ src, volume = 0.5, loop = true }) {
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = loop;
      audio.play().catch(() => {
        /* Audio play may require user interaction; ignore errors */
      });
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [volume, loop]);
  return <audio ref={audioRef} src={src} preload="auto" />;
}

/**
 * Swing component representing a porch swing.  It reacts to
 * pointer/touch events by increasing its swing amplitude.  When
 * idle, the swing gradually slows due to dampening.
 */
function Swing({ position = [0, 0, 0], color = '#987654' }) {
  const group = useRef();
  const [amplitude, setAmplitude] = useState(0);
  const [phase, setPhase] = useState(0);

  // Increase the amplitude when the swing is clicked
  const handleClick = () => {
    setAmplitude((amp) => Math.min(amp + 0.3, 1.0));
  };
  // Animate the swing
  useFrame((state, delta) => {
    // Apply dampening to gradually reduce amplitude
    setAmplitude((amp) => Math.max(amp * 0.99, 0.0));
    setPhase((ph) => ph + delta);
    const angle = Math.sin(phase) * amplitude * Math.PI * 0.25; // max ~45°
    if (group.current) {
      group.current.rotation.z = angle;
    }
  });
  return (
    <group ref={group} position={position} onClick={handleClick}>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Chains */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Tree component representing a cherry blossom.  It uses simple
 * geometries for the trunk and foliage, but you can replace these
 * shapes with high‑quality GLB models by placing them in the
 * public/models directory and loading via useGLTF.
 */
function Tree({ position = [0, 0, 0], scale = 1, trunkColor = '#8b5a2b', blossomColor = '#ffb7c5' }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 2]} />
        <meshStandardMaterial color={trunkColor} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color={blossomColor} />
      </mesh>
    </group>
  );
}

/**
 * Animal component representing small creatures like birds or cats.
 * In this example we simply render a sphere; for a realistic
 * experience load a GLB file via useGLTF.  When clicked, the
 * creature emits a sound and moves slightly.
 */
function Animal({ position = [0, 0, 0], color = '#ffaa00', soundSrc }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [jumpTime, setJumpTime] = useState(0);
  // Play sound on click
  const handleClick = () => {
    setJumpTime(0);
    if (ref.current && ref.current.userData.audio) {
      ref.current.userData.audio.currentTime = 0;
      ref.current.userData.audio.play().catch(() => {});
    }
  };
  useFrame((state, delta) => {
    // Simple jump animation when clicked
    setJumpTime((t) => t + delta);
    if (ref.current) {
      const yOffset = Math.sin(jumpTime * 10) * 0.2 * Math.exp(-2 * jumpTime);
      ref.current.position.y = position[1] + yOffset;
    }
  });
  return (
    <mesh
      ref={ref}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      userData={{ audio: new Audio(soundSrc || '') }}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={hovered ? '#ffcc88' : color} />
    </mesh>
  );
}

/**
 * Custom hook to cycle through seasons and associated weather.  The
 * cycle length can be configured via the `duration` parameter.  At
 * each step the season and weather state is updated.  This hook
 * intentionally keeps logic simple; you can extend it to simulate
 * sunrise/sunset, snow, fog or thunderstorms.  See the Three.js
 * tutorial on interactivity【48456416660804†L200-L269】 for details
 * about animating objects over time.
 */
function useSeasonCycle(duration = 60) {
  const [season, setSeason] = useState('spring');
  const [weather, setWeather] = useState('rain');
  useEffect(() => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const weathers = {
      spring: 'rain',
      summer: 'sun',
      autumn: 'wind',
      winter: 'snow',
    };
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % seasons.length;
      const nextSeason = seasons[index];
      setSeason(nextSeason);
      setWeather(weathers[nextSeason]);
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [duration]);
  return { season, weather };
}

/**
 * Main Environment component containing the porch, tree, animals and
 * weather effects.  It uses OrbitControls for navigation and
 * includes ambient sounds.  Many of the models are represented
 * with simple geometry; replace them with high quality GLB files
 * in the public/models directory using the useGLTF hook.  Use
 * instanced meshes for particle systems as demonstrated in Rain
 * component【987843542628762†L67-L76】.
 */
export default function Environment({ idleMode = false }) {
  const { season, weather } = useSeasonCycle();
  const [animals, setAnimals] = useState([
    { id: 0, position: [2, 0.15, 2], color: '#ddaa66', soundSrc: '/sounds/squirrel.mp3' },
    { id: 1, position: [-1.5, 0.15, 1.5], color: '#88bbff', soundSrc: '/sounds/bird.mp3' },
  ]);
  // Determine rain intensity based on weather
  const rainIntensity = weather === 'rain' ? 1.0 : weather === 'snow' ? 0.3 : 0;
  // Handle idle mode: spawn animals periodically when idleMode is true
  useEffect(() => {
    if (!idleMode) return;
    const interval = setInterval(() => {
      setAnimals((prev) => {
        // Limit the number of animals to avoid overpopulation
        const max = 8;
        const id = Date.now();
        const newAnimal = {
          id,
          position: [
            (Math.random() - 0.5) * 6,
            0.15,
            (Math.random() - 0.5) * 6,
          ],
          color: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
          soundSrc: Math.random() < 0.5 ? '/sounds/cat.mp3' : '/sounds/bird.mp3',
        };
        const animals = [...prev, newAnimal];
        return animals.length > max ? animals.slice(animals.length - max) : animals;
      });
    }, 10000 + Math.random() * 10000); // spawn every 10–20 seconds
    return () => clearInterval(interval);
  }, [idleMode]);
  return (
    <>
      {/* Basic lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      {/* Porch floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3f4c5c" />
      </mesh>
      {/* Cherry blossom tree */}
      <Tree position={[-4, 0, -2]} scale={2} />
      {/* Swing on the porch */}
      <Swing position={[0, 1, 0]} />
      {/* Render animals */}
      {animals.map((a) => (
        <Animal key={a.id} position={a.position} color={a.color} soundSrc={a.soundSrc} />
      ))}
      {/* Rain effect if raining */}
      {rainIntensity > 0 && <Rain rainIntensity={rainIntensity} />}
      {/* Ambient sounds; adjust volume depending on season */}
      <AmbientAudio src="/sounds/ambient-rain.mp3" volume={rainIntensity > 0 ? 0.6 : 0.2} />
      <AmbientAudio src="/sounds/wind-chimes.mp3" volume={0.3} />
      {/* Orbit controls allow the viewer to navigate the scene */}
      <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}