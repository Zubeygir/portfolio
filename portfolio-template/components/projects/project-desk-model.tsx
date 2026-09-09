'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '@/lib/types';
import { createPaperTexture, type PaperTextureLabels } from './project-desk-paper-texture';

interface ProjectDeskModelProps {
  projects: Project[];
  activePaperIndex: number | null;
  isInspecting: boolean;
  onPaperClick: (index: number) => void;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  labels?: PaperTextureLabels;
}

const MODEL_PATH = '/models/project_desk.glb';

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
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene once on mount
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Paper object references & permanent rest transforms recorded once
  const papersRef = useRef<(THREE.Object3D | null)[]>([]);
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

    // Dark paper material to replace any raw white from the GLB
    const darkPaperMaterial = new THREE.MeshStandardMaterial({
      color: 0x141620,
      roughness: 0.88,
      metalness: 0.05,
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
            child.material = darkPaperMaterial;
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

        // Top texture plane (material map populated by the texture-sync effect)
        const topGeo = new THREE.PlaneGeometry(widthX, depthZ);
        const topMat = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.98,
          depthWrite: false,
        });

        const topPlaneMesh = new THREE.Mesh(topGeo, topMat);
        topPlaneMesh.name = `paper_plane_${i}`;
        topPlaneMesh.position.set(centerX, maxY + 0.0006, centerZ);
        topPlaneMesh.rotation.set(-Math.PI / 2, 0, 0);
        paperObj.add(topPlaneMesh);

        // Bottom backing plane so flipped/lifted paper is also clean dark paper
        const backMat = new THREE.MeshBasicMaterial({
          color: 0x12141c,
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
      const targetRotY = pointer.x * 0.05;
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
        // Flying up towards the camera (Inspecting mode)
        const targetX = 0;
        const targetY = 0.45;
        const targetZ = 0.52;
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
        const targetY = isHovered ? rest.pos.y + 0.038 : rest.pos.y;
        const targetRotX = isHovered ? rest.rot.x - 0.06 : rest.rot.x;

        paperObj.position.x = THREE.MathUtils.damp(paperObj.position.x, rest.pos.x, 6.5, delta);
        paperObj.position.y = THREE.MathUtils.damp(paperObj.position.y, targetY, 6.5, delta);
        paperObj.position.z = THREE.MathUtils.damp(paperObj.position.z, rest.pos.z, 6.5, delta);

        paperObj.rotation.x = THREE.MathUtils.damp(paperObj.rotation.x, targetRotX, 6.5, delta);
        paperObj.rotation.y = THREE.MathUtils.damp(paperObj.rotation.y, rest.rot.y, 6.5, delta);
        paperObj.rotation.z = THREE.MathUtils.damp(paperObj.rotation.z, rest.rot.z, 6.5, delta);

        paperObj.scale.x = THREE.MathUtils.damp(paperObj.scale.x, rest.scale.x, 6.5, delta);
        paperObj.scale.y = THREE.MathUtils.damp(paperObj.scale.y, rest.scale.y, 6.5, delta);
        paperObj.scale.z = THREE.MathUtils.damp(paperObj.scale.z, rest.scale.z, 6.5, delta);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.36, 0]}>
      <primitive
        object={scene}
        onClick={(e: { stopPropagation: () => void; object: THREE.Object3D }) => {
          e.stopPropagation();
          // Ignore clicks while inspecting a paper
          if (isInspecting) return;
          const idx = findPaperIndex(e.object);
          if (idx !== null) {
            onPaperClick(idx);
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
