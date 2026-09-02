'use client';

import { Canvas } from '@react-three/fiber';
import { CharacterModel } from './character-model';

export function CharacterScene() {
  return (
    <Canvas
      camera={{ position: [0, 3.35, -13], fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 3.35, 0)}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[-5, 11, -8]} intensity={3.2} />
      <directionalLight position={[7, 5, 6]} intensity={1.4} />
      <CharacterModel />
    </Canvas>
  );
}
