'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/personal-character.glb';
const MODEL_SCALE = 9.2;
const INTRO_DURATION = 1.7;

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

// Mouth animation constants
const MOUTH_MAX_OPEN = 0.010;       // max offset per jaw piece (in model units)
const MOUTH_SPEED_THRESHOLD = 1000;  // px/s pointer speed to reach full open
const MOUTH_DRAG_OPEN = 0.7;        // how open (0-1) when dragging
const MOUTH_IDLE_AMPLITUDE = 0.25;  // subtle idle "breathing" (0-1 fraction of max)
const MOUTH_IDLE_SPEED = 1.8;       // breathing cycle speed (rad/s)

export function CharacterModel() {
  const gltf = useGLTF(MODEL_PATH);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const mouthUpper = useRef<THREE.Object3D | null>(null);
  const mouthLower = useRef<THREE.Object3D | null>(null);
  const mouthUpperRestY = useRef(0);
  const mouthLowerRestY = useRef(0);
  const introStart = useRef<number | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerSpeed = useRef(0);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const lastPointerTime = useRef(0);

  // Drag-to-rotate interactive state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragAccumulated = useRef(0);
  const dragOffset = useRef(0);

  const { reducedMotion, finePointer } = useMotionPreferences();

  // Assemble the unified head group (neck pivot) so head, hair, eyes and brows rotate together seamlessly
  useEffect(() => {
    // Texture pixel art filter
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

    // Make sure model world matrices are up-to-date before re-parenting
    model.updateMatrixWorld(true);

    const pivot = new THREE.Group();
    pivot.name = 'unified_head_pivot';
    pivot.position.set(0, 0.46, 0);
    model.add(pivot);
    pivot.updateMatrixWorld(true);

    const headPartNames = [
      'head',
      'hair',
      'eyebrow_negX',
      'eyebrow_posX',
      'eye_white_negX',
      'eye_white_posX',
      'pupil_negX',
      'pupil_posX',
      'mouth_upper',
      'mouth_lower',
    ];

    headPartNames.forEach((name) => {
      const part = model.getObjectByName(name);
      if (part) {
        pivot.attach(part);
      }
    });

    // Cache mouth references and rest positions
    const upper = pivot.getObjectByName('mouth_upper');
    const lower = pivot.getObjectByName('mouth_lower');
    if (upper) {
      mouthUpper.current = upper;
      mouthUpperRestY.current = upper.position.y;
    }
    if (lower) {
      mouthLower.current = lower;
      mouthLowerRestY.current = lower.position.y;
    }

    headGroup.current = pivot;
  }, [model]);

  // Pointer move & global drag release listeners
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = event.clientX - dragStartX.current;
        // 0.013 radians per horizontal pixel moved
        dragOffset.current = deltaX * 0.013;
      }

      // Track pointer speed for mouth animation
      const now = performance.now();
      const dt = (now - lastPointerTime.current) / 1000;
      if (dt > 0.001) {
        const dx = event.clientX - lastPointerPos.current.x;
        const dy = event.clientY - lastPointerPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        pointerSpeed.current = dist / dt; // px/s
      }
      lastPointerPos.current = { x: event.clientX, y: event.clientY };
      lastPointerTime.current = now;

      if (finePointer) {
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
      }
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        // Commit the offset so the snap-back smoothly returns to 0
        dragAccumulated.current += dragOffset.current;
        dragOffset.current = 0;
        document.body.style.cursor = '';
      }
    };

    const resetPointer = () => {
      pointerTarget.current = { x: 0, y: 0 };
      pointerSpeed.current = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('blur', resetPointer);
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', resetPointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
    };
  }, [finePointer]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    document.body.style.cursor = 'grabbing';
  };

  useFrame(({ clock }, delta) => {
    const isIntroActive =
      !reducedMotion &&
      introStart.current !== null &&
      clock.elapsedTime - introStart.current < INTRO_DURATION;

    // Smoothly spring drag back to 0 when not dragging
    if (!isDragging.current) {
      dragAccumulated.current = THREE.MathUtils.damp(
        dragAccumulated.current,
        0,
        5.5,
        delta,
      );
    }

    const currentTotalDrag = dragAccumulated.current + dragOffset.current;

    // Body follow targets (subtle accompanying body rotation)
    const bodyTargetY = finePointer && !reducedMotion ? pointerTarget.current.x * 0.07 : 0;
    const bodyTargetX = finePointer && !reducedMotion ? pointerTarget.current.y * 0.025 : 0;

    // Head follow targets: fade out head twist when body is heavily rotated/dragged
    const dragFade = Math.max(0, 1 - Math.abs(currentTotalDrag) * 1.2);
    const headTargetY = finePointer && !reducedMotion ? pointerTarget.current.x * 0.38 * dragFade : 0;
    const headTargetX = finePointer && !reducedMotion ? pointerTarget.current.y * 0.22 * dragFade : 0;

    if (group.current) {
      if (reducedMotion) {
        group.current.rotation.set(0, 0, 0);
        group.current.scale.setScalar(MODEL_SCALE);
      } else {
        introStart.current ??= clock.elapsedTime;
        const elapsed = clock.elapsedTime - introStart.current;
        const progress = THREE.MathUtils.clamp(elapsed / INTRO_DURATION, 0, 1);
        const eased = easeOutQuart(progress);

        if (progress < 1) {
          // Intro 360 spin
          group.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 2, 0, eased);
          group.current.scale.setScalar(
            THREE.MathUtils.lerp(MODEL_SCALE * 0.78, MODEL_SCALE, eased),
          );
        } else {
          // Normal interactive body tracking + drag rotation
          const targetRotY = bodyTargetY + currentTotalDrag;
          group.current.rotation.y = THREE.MathUtils.damp(
            group.current.rotation.y,
            targetRotY,
            isDragging.current ? 16 : 8,
            delta,
          );
          group.current.rotation.x = THREE.MathUtils.damp(
            group.current.rotation.x,
            bodyTargetX,
            8,
            delta,
          );
          group.current.scale.setScalar(MODEL_SCALE);
        }
      }
    }

    // Head tracking (only active after intro spin to keep orientation clean)
    if (headGroup.current) {
      if (reducedMotion || isIntroActive) {
        headGroup.current.rotation.set(0, 0, 0);
      } else {
        headGroup.current.rotation.y = THREE.MathUtils.damp(
          headGroup.current.rotation.y,
          headTargetY,
          10,
          delta,
        );
        headGroup.current.rotation.x = THREE.MathUtils.damp(
          headGroup.current.rotation.x,
          headTargetX,
          10,
          delta,
        );
      }
    }

    // Mouth animation
    if (mouthUpper.current && mouthLower.current) {
      let mouthOpenTarget = 0;

      if (reducedMotion || isIntroActive) {
        mouthOpenTarget = 0;
      } else if (isDragging.current) {
        // Mouth opens when dragging ("whoa!" reaction)
        mouthOpenTarget = MOUTH_DRAG_OPEN;
      } else {
        // Pointer speed drives mouth open (surprise)
        const speedFactor = THREE.MathUtils.clamp(
          pointerSpeed.current / MOUTH_SPEED_THRESHOLD,
          0,
          1,
        );
        // Idle breathing when pointer is slow
        const idleBreath =
          MOUTH_IDLE_AMPLITUDE *
          (0.5 + 0.5 * Math.sin(clock.elapsedTime * MOUTH_IDLE_SPEED));

        mouthOpenTarget = Math.max(speedFactor, idleBreath);
      }

      // Decay pointer speed naturally (it won't decay on its own if pointer stops)
      pointerSpeed.current *= Math.max(0, 1 - delta * 6);

      const offset = mouthOpenTarget * MOUTH_MAX_OPEN;

      mouthUpper.current.position.y = THREE.MathUtils.damp(
        mouthUpper.current.position.y,
        mouthUpperRestY.current + offset,
        12,
        delta,
      );
      mouthLower.current.position.y = THREE.MathUtils.damp(
        mouthLower.current.position.y,
        mouthLowerRestY.current - offset,
        12,
        delta,
      );
    }
  });

  return (
    <group
      ref={group}
      scale={MODEL_SCALE}
      onPointerDown={handlePointerDown}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
