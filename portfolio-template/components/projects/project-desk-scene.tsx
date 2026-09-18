'use client';

import { Suspense, useSyncExternalStore, useEffect, useRef, type RefObject } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from '@/lib/types';
import { ProjectDeskModel, type MorphOrigin } from './project-desk-model';
import type { PaperTextureLabels } from './project-desk-paper-texture';

export interface ProjectDeskLabels extends PaperTextureLabels {
  clickToInspect?: string;
  instruction?: string;
  loading?: string;
}

interface ProjectDeskSceneProps {
  projects: Project[];
  activePaperIndex: number | null;
  isInspecting: boolean;
  onPaperClick: (index: number, origin?: MorphOrigin) => void;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  labels?: ProjectDeskLabels;
}

const emptySubscribe = () => () => {};

/**
 * Dynamically adjusts camera distance and pitch so the desk and all 5 papers
 * are 100% visible on all viewports, from narrow mobile screens to ultrawide desktops.
 * Also dollies in from farther back on first mount for an "arriving at the desk" entrance,
 * and nudges slightly as the section scrolls through the viewport.
 */
function ResponsiveDeskCamera({ scrollProgress }: { scrollProgress: RefObject<number> }) {
  const { camera, size } = useThree();
  const restPos = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.16, 0));
  const hasIntroed = useRef(false);

  useEffect(() => {
    const aspect = size.width / size.height;
    // Desk is ~1.0 unit wide. Target 1.55 units for extra breathing room so the
    // desk lamp (now on the far side after the 180° desk flip) stays in frame.
    const targetWidth = 1.55;
    const fovRad = (36 * Math.PI) / 180;
    const tanHalfFov = Math.tan(fovRad / 2);

    // Calculate required distance to fit the full desk horizontally
    const requiredDistH = targetWidth / (2 * tanHalfFov * Math.max(aspect, 0.35));
    // Default comfortable desktop distance — pulled back to show full desk
    const baseDist = 4.1;
    const finalDist = Math.max(requiredDistH, baseDist);

    // Maintain pleasant isometric pitch angle (~46 degrees from horizontal)
    const pitchRad = (46 * Math.PI) / 180;
    const posY = Math.sin(pitchRad) * finalDist + 0.16;
    const posZ = Math.cos(pitchRad) * finalDist;

    restPos.current.set(0, posY, posZ);

    if (!hasIntroed.current) {
      // Start noticeably farther back/higher so the first frame reads as a dolly-in.
      camera.position.set(0, posY * 1.55, posZ * 1.55);
      hasIntroed.current = true;
    }

    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((state, delta) => {
    // Scroll progress goes 0 (section below viewport) → 1 (section above viewport);
    // 0.5 is roughly "centered". Keep the nudge subtle so it reads as ambient depth, not a slide.
    const scrollOffset = (scrollProgress.current - 0.5) * 0.12;
    const stateCamera = state.camera;

    stateCamera.position.x = THREE.MathUtils.damp(stateCamera.position.x, restPos.current.x, 3.2, delta);
    stateCamera.position.y = THREE.MathUtils.damp(
      stateCamera.position.y,
      restPos.current.y + scrollOffset,
      3.2,
      delta
    );
    stateCamera.position.z = THREE.MathUtils.damp(stateCamera.position.z, restPos.current.z, 3.2, delta);
    stateCamera.lookAt(lookAtTarget.current);
  });

  return null;
}

export function ProjectDeskScene({
  projects,
  activePaperIndex,
  isInspecting,
  onPaperClick,
  hoveredIndex,
  onHoverIndex,
  labels,
}: ProjectDeskSceneProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0.5);

  useEffect(() => {
    if (!mounted) return;

    const updateScrollProgress = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // 0 when the canvas center is at the bottom of the viewport, 1 when at the top.
      scrollProgress.current = THREE.MathUtils.clamp(
        1 - (rect.top + rect.height / 2) / viewportH,
        0,
        1
      );
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [mounted]);

  const projectPrefix = labels?.projectPrefix || 'PROJE';
  const clickToInspect = labels?.clickToInspect || 'İncelemek için tıkla ↗';
  const loadingText = labels?.loading || '3D Proje Masası Hazırlanıyor...';

  if (!mounted) {
    return (
      <div className="project-desk-loading">
        <div className="desk-spinner" />
        <p>{loadingText}</p>
      </div>
    );
  }

  return (
    <div className="project-desk-canvas-wrap" ref={wrapRef}>
      <Canvas
        camera={{
          position: [0, 1.68, 1.47],
          fov: 36,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.8]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.16, 0);
        }}
      >
        <ResponsiveDeskCamera scrollProgress={scrollProgress} />

        {/* Soft Ambient Light */}
        <ambientLight intensity={1.7} />

        {/* Primary Key Light */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={2.1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Warm Golden Desk Lamp Light — dimmed vs. the old dark paper, which
            absorbed far more light than the current light-cream paper reflects */}
        <pointLight
          position={[0, 1.6, 0.2]}
          intensity={1.1}
          color="#ffe8a8"
          distance={4.5}
          decay={2}
        />

        {/* Subtle Back Rim Light for Silhouette */}
        <directionalLight
          position={[-3, 4, -3]}
          intensity={0.9}
          color="#9ec2f8"
        />

        <Suspense fallback={null}>
          <ProjectDeskModel
            projects={projects}
            activePaperIndex={activePaperIndex}
            isInspecting={isInspecting}
            onPaperClick={onPaperClick}
            hoveredIndex={hoveredIndex}
            onHoverIndex={onHoverIndex}
            labels={labels}
          />
        </Suspense>
      </Canvas>

      {/* Floating Hover Indicator Badge at bottom of canvas */}
      {hoveredIndex !== null && projects[hoveredIndex] && !isInspecting && (
        <div className="desk-hover-overlay-pill" aria-live="polite">
          <span className="desk-pill-number">
            {projectPrefix} {projects[hoveredIndex].number}
          </span>
          <span className="desk-pill-title">
            {projects[hoveredIndex].title}
          </span>
          <span className="desk-pill-counter">
            {hoveredIndex + 1} / {Math.min(projects.length, 5)}
          </span>
          <span className="desk-pill-hint">{clickToInspect}</span>
        </div>
      )}
    </div>
  );
}
