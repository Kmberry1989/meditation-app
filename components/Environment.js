"use client";
import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment as DreiEnvironment } from '@react-three/drei';

// Rain particle system using instanced meshes.
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
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
      <meshStandardMaterial color="#aac7ff" transparent opacity={0.7} />
    </instancedMesh>
  );
}

// Simple audio component
function AmbientAudio({ src, volume = 0.5, loop = true }) {
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = loop;
      audio.play().catch(() => { /* Audio play may require user interaction; ignore errors */ });
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [volume, loop]);
  return <audio ref={audioRef} src={src} />;
}

// Swing component
function Swing({ position = [0, 0, 0], color = '#987654' }) {
  const group = useRef();
  const [amplitude, setAmplitude] = useState(0);
  const [phase, setPhase] = useState(0);
  const handleClick = () => {
    setAmplitude((amp) => Math.min(amp + 0.3, 1.0));
  };
  useFrame((state, delta) => {
    setAmplitude((amp) => Math.max(amp * 0.99, 0.0));
    setPhase((ph) => ph + delta);
    const angle = Math.sin(phase) * amplitude * Math.PI * 0.25;
    if (group.current) {
      group.current.rotation.z = angle;
    }
  });
  return (
    <group ref={group} position={position} onClick={handleClick}>
      {/* Seat */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 0.2, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Chains */}
      <mesh position={[-0.4, 1.6, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
      <mesh position={[0.4, 1.6, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  );
}

// Tree component
function Tree({ position = [0, 0, 0], scale = 1, trunkColor = '#8b5a2b', blossomColor = '#ffb7c5' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2, 10]} />
        <meshStandardMaterial color={trunkColor} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={blossomColor} />
      </mesh>
    </group>
  );
}

// Animal component
function Animal({ position = [0, 0, 0], color = '#ffaa00', soundSrc }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [jumpTime, setJumpTime] = useState(0);
  const handleClick = () => {
    setJumpTime(0);
    if (ref.current && ref.current.userData.audio) {
      ref.current.userData.audio.currentTime = 0;
      ref.current.userData.audio.play().catch(() => {});
    }
  };
  useFrame((state, delta) => {
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
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Custom hook for season/weather
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

// Main Environment component
export default function Environment({ idleMode = false }) {
  const { season, weather } = useSeasonCycle();
  const [animals, setAnimals] = useState([
    { id: 0, position: [2, 0.15, 2], color: '#ddaa66', soundSrc: '/sounds/squirrel.mp3' },
    { id: 1, position: [-1.5, 0.15, 1.5], color: '#88bbff', soundSrc: '/sounds/bird.mp3' },
  ]);
  // Determine rain intensity
  const rainIntensity = weather === 'rain' ? 1.0 : weather === 'snow' ? 0.3 : 0;
  // Handle idle mode: spawn animals periodically when idleMode is true
  useEffect(() => {
    if (!idleMode) return;
    const interval = setInterval(() => {
      setAnimals((prev) => {
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
    }, 10000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [idleMode]);
  return (
    <>
      {/* Basic lights */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 10, 3]} intensity={0.6} castShadow />
      {/* Porch floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 8]} />
        <meshStandardMaterial color="#ece6d0" />
      </mesh>
      {/* Cherry blossom tree */}
      <Tree position={[-2, 0, -2]} scale={1.5} />
      {/* Swing on the porch */}
      <Swing position={[2, 0.1, 0]} />
      {/* Render animals */}
      {animals.map((a) => (
        <Animal key={a.id} {...a} />
      ))}
      {/* Rain effect if raining */}
      {rainIntensity > 0 && <Rain rainIntensity={rainIntensity} />}
      {/* Ambient sounds; adjust volume depending on season */}
      <AmbientAudio src="/sounds/porch-ambience.mp3" volume={season === 'summer' ? 0.6 : 0.2} />
      {/* Orbit controls */}
      <OrbitControls />
      {/* Optional environment background */}
      <DreiEnvironment preset="sunset" />
    </>
  );
}
