'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '@/lib/types';
import { createPaperTexture, type PaperTextureLabels } from './project-desk-paper-texture';

export interface MorphOrigin {
  x: number;
  y: number;
}

interface ProjectDeskModelProps {
  projects: Project[];
  activePaperIndex: number | null;
  isInspecting: boolean;
  onPaperClick: (index: number, origin?: MorphOrigin) => void;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  labels?: PaperTextureLabels;
}

const MODEL_PATH = '/models/project_desk.glb';
// The source model's front faces away from the camera on the N-S axis — flipped 180°.
const DESK_BASE_ROTATION_Y = Math.PI;

// Shared soft radial-glow texture for the paper hover glint (one canvas, reused by all papers).
let glowTextureCache: THREE.CanvasTexture | null = null;
function getGlowTexture(): THREE.CanvasTexture | null {
  if (typeof window === 'undefined') return null;
  if (glowTextureCache) return glowTextureCache;

  const size = 256;
  const canvas = window.document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 244, 214, 0.9)');
  gradient.addColorStop(0.5, 'rgba(255, 230, 170, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 230, 170, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  glowTextureCache = new THREE.CanvasTexture(canvas);
  return glowTextureCache;
}

export function ProjectDeskModel({
  projects,
  activePaperIndex,
  isInspecting,
  onPaperClick,
  hoveredIndex,
  onHoverIndex,
  labels,
}: ProjectDeskModelProps) {
  const gltf = useGLTF(MODEL_PATH);
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene once on mount
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Paper object references & permanent rest transforms recorded once
  const papersRef = useRef<(THREE.Object3D | null)[]>([]);
  const glowsRef = useRef<(THREE.Mesh | null)[]>([]);
  const restTransforms = useRef<
    { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3 }[]
  >([]);
  const isInitialized = useRef(false);

  // Generate textures when projects or labels change
  const textures = useMemo(() => {
    return projects.slice(0, 5).map((project) => ({
      normal: createPaperTexture(project, false, labels),
      hovered: createPaperTexture(project, true, labels),
    }));
  }, [projects, labels]);

  // 1. One-time scene setup: configure materials, precision planes, and record original rest transforms
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Warm ivory paper material to replace any raw white from the GLB
    const paperMaterial = new THREE.MeshStandardMaterial({
      color: 0xefe6cf,
      roughness: 0.92,
      metalness: 0.0,
    });

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        if (obj.material) {
          const mat = (
            Array.isArray(obj.material) ? obj.material[0] : obj.material
          ) as THREE.MeshStandardMaterial;

          if (mat && 'roughness' in mat) {
            mat.roughness = 0.82;
            mat.metalness = 0.08;
            if (mat.map) {
              mat.map.magFilter = THREE.NearestFilter;
              mat.map.minFilter = THREE.NearestMipmapNearestFilter;
            }
          }
        }
      }
    });

    // Extract paper_1 to paper_5 and record pristine rest positions
    const foundPapers: (THREE.Object3D | null)[] = [];
    const transforms: { pos: THREE.Vector3; rot: THREE.Euler; scale: THREE.Vector3 }[] = [];

    for (let i = 1; i <= 5; i++) {
      const paperName = `paper_${i}`;
      const paperObj = scene.getObjectByName(paperName);

      if (paperObj) {
        foundPapers.push(paperObj);

        // Store permanent original rest transforms (NEVER mutate these)
        transforms.push({
          pos: paperObj.position.clone(),
          rot: paperObj.rotation.clone(),
          scale: paperObj.scale.clone(),
        });

        // Replace any raw white mesh material with dark paper material
        paperObj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = paperMaterial;
          }
        });

        // Compute exact geometry bounds for precision plane sizing
        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        let maxY = 0.0038;
        let minY = -0.0044;

        paperObj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            child.geometry.computeBoundingBox();
            const b = child.geometry.boundingBox;
            if (b) {
              minX = Math.min(minX, b.min.x);
              maxX = Math.max(maxX, b.max.x);
              minZ = Math.min(minZ, b.min.z);
              maxZ = Math.max(maxZ, b.max.z);
              maxY = Math.max(maxY, b.max.y);
              minY = Math.min(minY, b.min.y);
            }
          }
        });

        // Sizing with 0.5% margin so paper edges seamlessly blend into paper body
        const widthX = isFinite(maxX - minX) ? (maxX - minX) * 1.005 : 0.26;
        const depthZ = isFinite(maxZ - minZ) ? (maxZ - minZ) * 1.005 : 0.17;
        const centerX = isFinite(maxX + minX) ? (maxX + minX) / 2 : 0;
        const centerZ = isFinite(maxZ + minZ) ? (maxZ + minZ) / 2 : 0;

        // Top texture plane (material map populated by the texture-sync effect).
        // toneMapped: false — this is flat text/UI content, not lit geometry; tone
        // mapping compresses its contrast and makes the ink text hard to read.
        const topGeo = new THREE.PlaneGeometry(widthX, depthZ);
        const topMat = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.98,
          depthWrite: false,
          toneMapped: false,
        });

        const topPlaneMesh = new THREE.Mesh(topGeo, topMat);
        topPlaneMesh.name = `paper_plane_${i}`;
        topPlaneMesh.position.set(centerX, maxY + 0.0006, centerZ);
        topPlaneMesh.rotation.set(-Math.PI / 2, 0, 0);
        paperObj.add(topPlaneMesh);

        // Soft hover glint — faded in/out in the frame loop, sits just above the paper
        const glowTexture = getGlowTexture();
        if (glowTexture) {
          const glowMat = new THREE.MeshBasicMaterial({
            map: glowTexture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const glowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(widthX * 1.15, depthZ * 1.15),
            glowMat
          );
          glowMesh.name = `paper_glow_${i}`;
          glowMesh.position.set(centerX, maxY + 0.0012, centerZ);
          glowMesh.rotation.set(-Math.PI / 2, 0, 0);
          paperObj.add(glowMesh);
          glowsRef.current[i - 1] = glowMesh;
        }

        // Bottom backing plane so flipped/lifted paper is also clean dark paper
        const backMat = new THREE.MeshBasicMaterial({
          color: 0xe0d6ba,
          depthWrite: false,
        });
        const backPlaneMesh = new THREE.Mesh(topGeo, backMat);
        backPlaneMesh.name = `paper_back_${i}`;
        backPlaneMesh.position.set(centerX, minY - 0.0006, centerZ);
        backPlaneMesh.rotation.set(Math.PI / 2, 0, 0);
        paperObj.add(backPlaneMesh);
      } else {
        foundPapers.push(null);
      }
    }

    papersRef.current = foundPapers;
    restTransforms.current = transforms;
  }, [scene]); // Only run ONCE for the cloned scene

  // 2. Synchronize paper textures when textures, active state, or hover change
  useEffect(() => {
    papersRef.current.forEach((paperObj, idx) => {
      if (!paperObj) return;
      const plane = paperObj.getObjectByName(`paper_plane_${idx + 1}`) as THREE.Mesh;
      if (plane && plane.material) {
        const mat = plane.material as THREE.MeshBasicMaterial;
        const isHovered = hoveredIndex === idx && activePaperIndex === null;
        const targetTex = isHovered ? textures[idx]?.hovered : textures[idx]?.normal;
        if (targetTex && mat.map !== targetTex) {
          mat.map = targetTex;
          mat.needsUpdate = true;
        }
      }
    });
  }, [hoveredIndex, activePaperIndex, textures]);

  // Helper to find which paper (0..4) an intersected object belongs to
  const findPaperIndex = (obj: THREE.Object3D | null): number | null => {
    let cur = obj;
    while (cur && cur !== scene) {
      if (cur.name && cur.name.startsWith('paper_')) {
        const match = cur.name.match(/paper_(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= 1 && num <= 5) return num - 1;
        }
      }
      cur = cur.parent;
    }
    return null;
  };

  // Frame animation loop
  useFrame((state, delta) => {
    const { pointer } = state;

    // Subtle ambient parallax of the desk
    if (groupRef.current && activePaperIndex === null) {
      const targetRotY = DESK_BASE_ROTATION_Y + pointer.x * 0.05;
      const targetRotX = -pointer.y * 0.03;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3.5,
        delta
      );
    }

    // Animate each paper
    papersRef.current.forEach((paperObj, idx) => {
      if (!paperObj) return;
      const rest = restTransforms.current[idx];
      if (!rest) return;

      // A paper is active if it's currently selected
      const isActive = activePaperIndex === idx;
      const isHovered = hoveredIndex === idx && activePaperIndex === null;

      if (isActive && isInspecting) {
        // Flying up towards the camera (Inspecting mode).
        // targetZ is negated vs. its original value because the whole desk (this
        // paper's ancestor chain) is now yawed 180° — without the flip this sends
        // the paper away from the camera / out of frame. targetRotX stays as-is:
        // the pitch tilt isn't mirrored by the parent yaw the way position is.
        const targetX = 0;
        const targetY = 0.45;
        const targetZ = -0.52;
        const targetScale = 2.6;
        const targetRotX = -0.42;

        paperObj.position.x = THREE.MathUtils.damp(paperObj.position.x, targetX, 5.5, delta);
        paperObj.position.y = THREE.MathUtils.damp(paperObj.position.y, targetY, 5.5, delta);
        paperObj.position.z = THREE.MathUtils.damp(paperObj.position.z, targetZ, 5.5, delta);

        paperObj.rotation.x = THREE.MathUtils.damp(paperObj.rotation.x, targetRotX, 5.5, delta);
        paperObj.rotation.y = THREE.MathUtils.damp(paperObj.rotation.y, 0, 5.5, delta);
        paperObj.rotation.z = THREE.MathUtils.damp(paperObj.rotation.z, 0, 5.5, delta);

        paperObj.scale.x = THREE.MathUtils.damp(paperObj.scale.x, targetScale, 5.5, delta);
        paperObj.scale.y = THREE.MathUtils.damp(paperObj.scale.y, targetScale, 5.5, delta);
        paperObj.scale.z = THREE.MathUtils.damp(paperObj.scale.z, targetScale, 5.5, delta);
      } else {
        // Returning to or resting on the desk
        const tiltSign = rest.pos.x >= 0 ? 1 : -1;
        const targetY = isHovered ? rest.pos.y + 0.038 : rest.pos.y;
        const targetRotX = isHovered ? rest.rot.x - 0.06 : rest.rot.x;
        const targetRotZ = isHovered ? rest.rot.z + tiltSign * 0.035 : rest.rot.z;

        paperObj.position.x = THREE.MathUtils.damp(paperObj.position.x, rest.pos.x, 6.5, delta);
        paperObj.position.y = THREE.MathUtils.damp(paperObj.position.y, targetY, 6.5, delta);
        paperObj.position.z = THREE.MathUtils.damp(paperObj.position.z, rest.pos.z, 6.5, delta);

        paperObj.rotation.x = THREE.MathUtils.damp(paperObj.rotation.x, targetRotX, 6.5, delta);
        paperObj.rotation.y = THREE.MathUtils.damp(paperObj.rotation.y, rest.rot.y, 6.5, delta);
        paperObj.rotation.z = THREE.MathUtils.damp(paperObj.rotation.z, targetRotZ, 6.5, delta);

        paperObj.scale.x = THREE.MathUtils.damp(paperObj.scale.x, rest.scale.x, 6.5, delta);
        paperObj.scale.y = THREE.MathUtils.damp(paperObj.scale.y, rest.scale.y, 6.5, delta);
        paperObj.scale.z = THREE.MathUtils.damp(paperObj.scale.z, rest.scale.z, 6.5, delta);
      }

      // Hover glint fade
      const glow = glowsRef.current[idx];
      if (glow) {
        const mat = glow.material as THREE.MeshBasicMaterial;
        const targetOpacity = isHovered ? 0.18 : 0;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 7, delta);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.36, 0]} rotation={[0, DESK_BASE_ROTATION_Y, 0]}>
      <primitive
        object={scene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          // Ignore clicks while inspecting a paper
          if (isInspecting) return;
          const idx = findPaperIndex(e.object);
          if (idx !== null) {
            // The clicked paper always flies up to the same fixed "inspecting" spot
            // (near the top-center of the canvas) before the modal opens 400ms later,
            // so anchor the morph there instead of the paper's original desk position —
            // otherwise the modal grows from a spot the paper has already left.
            const rect = gl.domElement.getBoundingClientRect();
            onPaperClick(idx, {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height * 0.38,
            });
          }
        }}
        onPointerMove={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
          e.stopPropagation();
          if (isInspecting) {
            document.body.style.cursor = 'auto';
            return;
          }
          const idx = findPaperIndex(e.object);
          if (idx !== null) {
            document.body.style.cursor = 'pointer';
            onHoverIndex(idx);
          } else {
            document.body.style.cursor = 'auto';
            onHoverIndex(null);
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          onHoverIndex(null);
        }}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
