'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/personal-character.glb';
const MODEL_SCALE = 9.2;
const INTRO_DURATION = 1.7;

type PupilState = {
  node: THREE.Object3D;
  origin: THREE.Vector3;
};

function easeOutQuart(value: number) {
  return 1 - Math.pow(1 - value, 4);
}

function useMotionPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: true,
    finePointer: false,
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    const update = () => {
      setPreferences({
        reducedMotion: reducedMotion.matches,
        finePointer: finePointer.matches,
      });
    };

    update();
    reducedMotion.addEventListener('change', update);
    finePointer.addEventListener('change', update);

    return () => {
      reducedMotion.removeEventListener('change', update);
      finePointer.removeEventListener('change', update);
    };
  }, []);

  return preferences;
}

export function CharacterModel() {
  const gltf = useGLTF(MODEL_PATH);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef<THREE.Group>(null);
  const introStart = useRef<number | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const { reducedMotion, finePointer } = useMotionPreferences();

  const pupils = useMemo<PupilState[]>(() => {
    return ['pupil_negX', 'pupil_posX']
      .map((name) => model.getObjectByName(name))
      .filter((node): node is THREE.Object3D => node !== undefined)
      .map((node) => ({ node, origin: node.position.clone() }));
  }, [model]);

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        const map =
          'map' in material && material.map instanceof THREE.Texture
            ? material.map
            : null;

        if (!map) return;
        map.magFilter = THREE.NearestFilter;
        map.minFilter = THREE.NearestMipmapNearestFilter;
        map.needsUpdate = true;
      });
    });
  }, [model]);

  useEffect(() => {
    if (!finePointer) {
      pointerTarget.current = { x: 0, y: 0 };
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.current = {
        x: THREE.MathUtils.clamp(
          (event.clientX / window.innerWidth) * 2 - 1,
          -1,
          1,
        ),
        y: THREE.MathUtils.clamp(
          -((event.clientY / window.innerHeight) * 2 - 1),
          -1,
          1,
        ),
      };
    };

    const resetPointer = () => {
      pointerTarget.current = { x: 0, y: 0 };
    };

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('blur', resetPointer);
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetPointer);
      document.documentElement.removeEventListener(
        'pointerleave',
        resetPointer,
      );
    };
  }, [finePointer]);

  useFrame(({ clock }, delta) => {
    if (group.current) {
      if (reducedMotion) {
        group.current.rotation.y = 0;
        group.current.scale.setScalar(MODEL_SCALE);
      } else {
        introStart.current ??= clock.elapsedTime;
        const elapsed = clock.elapsedTime - introStart.current;
        const progress = THREE.MathUtils.clamp(elapsed / INTRO_DURATION, 0, 1);
        const eased = easeOutQuart(progress);

        group.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 2, 0, eased);
        group.current.scale.setScalar(
          THREE.MathUtils.lerp(MODEL_SCALE * 0.78, MODEL_SCALE, eased),
        );
      }
    }

    // The camera looks from negative Z, so screen-right maps to local negative X.
    const targetX = finePointer ? pointerTarget.current.x * -0.009 : 0;
    const targetY = finePointer ? pointerTarget.current.y * 0.005 : 0;

    pupils.forEach(({ node, origin }) => {
      node.position.x = THREE.MathUtils.damp(
        node.position.x,
        origin.x + targetX,
        10,
        delta,
      );
      node.position.y = THREE.MathUtils.damp(
        node.position.y,
        origin.y + targetY,
        10,
        delta,
      );
    });
  });

  return (
    <group ref={group} scale={MODEL_SCALE}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
