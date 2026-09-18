'use client';

import { Suspense, useSyncExternalStore, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import type { Project } from '@/lib/types';
import { ProjectDeskModel } from './project-desk-model';
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
  onPaperClick: (index: number) => void;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  labels?: ProjectDeskLabels;
}

const emptySubscribe = () => () => {};

/**
 * Dynamically adjusts camera distance and pitch so the desk and all 5 papers
 * are 100% visible on all viewports, from narrow mobile screens to ultrawide desktops.
 */
function ResponsiveDeskCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    // Desk is ~1.0 unit wide. Target 1.30 units to ensure comfortable breathing room
    const targetWidth = 1.30;
    const fovRad = (36 * Math.PI) / 180;
    const tanHalfFov = Math.tan(fovRad / 2);

    // Calculate required distance to fit the full desk horizontally
    const requiredDistH = targetWidth / (2 * tanHalfFov * Math.max(aspect, 0.35));
    // Default comfortable desktop distance — pulled back to show full desk
    const baseDist = 3.5;
    const finalDist = Math.max(requiredDistH, baseDist);

    // Maintain pleasant isometric pitch angle (~46 degrees from horizontal)
    const pitchRad = (46 * Math.PI) / 180;
    const posY = Math.sin(pitchRad) * finalDist + 0.16;
    const posZ = Math.cos(pitchRad) * finalDist;

    camera.position.set(0, posY, posZ);
    camera.lookAt(0, 0.16, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

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
    <div className="project-desk-canvas-wrap">
      <Canvas
        camera={{
          position: [0, 1.45, 1.25],
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
        <ResponsiveDeskCamera />

        {/* Soft Ambient Light */}
        <ambientLight intensity={2.2} />

        {/* Primary Key Light */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Warm Golden Desk Lamp Light */}
        <pointLight
          position={[0, 1.6, 0.2]}
          intensity={2.0}
          color="#ffe8a8"
          distance={4.5}
          decay={2}
        />

        {/* Subtle Back Rim Light for Silhouette */}
        <directionalLight
          position={[-3, 4, -3]}
          intensity={1.2}
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
          <span className="desk-pill-hint">{clickToInspect}</span>
        </div>
      )}
    </div>
  );
}
