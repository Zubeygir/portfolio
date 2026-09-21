import * as THREE from 'three';
import type { Project } from '@/lib/types';

export interface PaperTextureLabels {
  projectPrefix?: string;
  clickForDetails?: string;
  brand?: string;
}

// Shared paper-grain tile (one small noise canvas, reused as a repeating pattern by all papers).
let grainTileCache: HTMLCanvasElement | null = null;
function getGrainTile(): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  if (grainTileCache) return grainTileCache;

  const size = 160;
  const tile = window.document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const tctx = tile.getContext('2d');
  if (!tctx) return null;

  const imageData = tctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const shade = 150 + Math.floor(Math.random() * 90);
    imageData.data[i] = shade;
    imageData.data[i + 1] = shade - 6;
    imageData.data[i + 2] = shade - 16;
    imageData.data[i + 3] = Math.random() * 40;
  }
  tctx.putImageData(imageData, 0, 0);

  grainTileCache = tile;
  return grainTileCache;
}

function getMonoFamily(): string {
  const name = getComputedStyle(document.body).getPropertyValue('--font-mono-label').trim();
  return name || 'monospace';
}

export function createPaperTexture(
  project: Project,
  isHovered = false,
  labels?: PaperTextureLabels
): THREE.CanvasTexture | THREE.Texture {
  if (typeof window === 'undefined') {
    return new THREE.Texture();
  }

  const monoFamily = getMonoFamily();
  const projectPrefix = labels?.projectPrefix || 'PROJE';
  const clickForDetails = labels?.clickForDetails || 'DETAYLAR İÇİN TIKLA ↗';
  const brand = labels?.brand || 'ZUBEYIR ALI DEMIR // PORTFOLIO';

  const canvas = window.document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // Background — warm ivory paper, not a dark UI card
  const bgColor = isHovered ? '#f8f1de' : '#efe6cf';
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 6);
  ctx.fill();

  // Faint paper-fiber grain, multiplied over the base so it darkens instead of washing out
  const grainTile = getGrainTile();
  if (grainTile) {
    const pattern = ctx.createPattern(grainTile, 'repeat');
    if (pattern) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 6);
      ctx.clip();
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  // Soft vignette toward the edges, like light falling off a physical sheet
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(60, 48, 24, 0.10)');
  ctx.fillStyle = vignette;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 6);
  ctx.fill();

  // Top header accent line — thin ink-gold rule, not a bright gradient bar
  ctx.strokeStyle = '#a8823a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 40);
  ctx.lineTo(w - 48, 40);
  ctx.stroke();

  // Project Number / Kicker
  ctx.fillStyle = '#7d5f22';
  ctx.font = `600 34px ${monoFamily}, monospace`;
  ctx.fillText(`${projectPrefix} ${project.number}`, 48, 86);

  // Status Badge on Top-Right
  if (project.status || project.year) {
    const badgeText = `${project.status || 'PROJECT'} · ${project.year || '2025'}`;
    ctx.font = `500 24px ${monoFamily}, monospace`;
    const badgeW = ctx.measureText(badgeText).width + 36;
    ctx.fillStyle = 'rgba(33, 29, 22, 0.05)';
    ctx.beginPath();
    ctx.roundRect(w - 48 - badgeW, 58, badgeW, 38, 3);
    ctx.fill();
    ctx.strokeStyle = 'rgba(33, 29, 22, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(33, 29, 22, 0.85)';
    ctx.fillText(badgeText, w - 48 - badgeW + 18, 85);
  }

  // Divider line
  ctx.strokeStyle = 'rgba(33, 29, 22, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(48, 120);
  ctx.lineTo(w - 48, 120);
  ctx.stroke();

  // Project Title (with wrapping)
  ctx.fillStyle = '#201c14';
  ctx.font = 'bold 50px Inter, system-ui, sans-serif';
  const titleWords = project.title.split(' ');
  let line = '';
  let lineY = 190;
  const maxTitleWidth = w - 100;
  let titleLines = 0;

  for (let n = 0; n < titleWords.length; n++) {
    const testLine = line + titleWords[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTitleWidth && n > 0) {
      ctx.fillText(line.trim(), 48, lineY);
      line = titleWords[n] + ' ';
      lineY += 60;
      titleLines++;
      if (titleLines >= 2) break; // max 2 lines
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 48, lineY);

  // Role / Category badge
  const roleText = project.role || project.category || 'Software Developer';
  ctx.fillStyle = '#6f5420';
  ctx.font = `500 28px ${monoFamily}, monospace`;
  ctx.fillText(`◆ ${roleText}`, 48, lineY + 65);

  // Summary / Description Snippet
  ctx.fillStyle = 'rgba(33, 29, 22, 0.82)';
  ctx.font = 'normal 26px Inter, system-ui, sans-serif';
  const summary = project.summary || (project.description ? project.description.slice(0, 110) + '...' : '');
  const words = summary.split(' ');
  let sLine = '';
  let sY = lineY + 125;
  let sLines = 0;
  for (let n = 0; n < words.length; n++) {
    const test = sLine + words[n] + ' ';
    if (ctx.measureText(test).width > maxTitleWidth && n > 0) {
      ctx.fillText(sLine.trim(), 48, sY);
      sLine = words[n] + ' ';
      sY += 40;
      sLines++;
      if (sLines >= 2) break;
    } else {
      sLine = test;
    }
  }
  if (sLines < 2) {
    ctx.fillText(sLine.trim(), 48, sY);
  }

  // Technologies pill preview
  if (project.technologies && project.technologies.length > 0) {
    let tagX = 48;
    const tagY = h - 130;
    ctx.font = `500 22px ${monoFamily}, monospace`;
    project.technologies.slice(0, 3).forEach((tech: string) => {
      const tagWidth = ctx.measureText(tech).width + 24;
      ctx.fillStyle = 'rgba(33, 29, 22, 0.09)';
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, 34, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(33, 29, 22, 0.84)';
      ctx.fillText(tech, tagX + 12, tagY + 24);
      tagX += tagWidth + 12;
    });
  }

  // Bottom action bar
  ctx.fillStyle = isHovered ? '#5f4a1c' : '#7d5f22';
  ctx.font = `600 28px ${monoFamily}, monospace`;
  ctx.fillText(clickForDetails, w - ctx.measureText(clickForDetails).width - 48, h - 50);

  // Subtle watermark in bottom left
  ctx.fillStyle = 'rgba(33, 29, 22, 0.4)';
  ctx.font = `500 20px ${monoFamily}, monospace`;
  ctx.fillText(brand, 48, h - 50);

  const texture = new THREE.CanvasTexture(canvas);
  // Canvas 2D always draws in sRGB — without this the renderer treats the
  // pixels as linear and re-applies sRGB encoding on top, which washes out
  // the ink/cream contrast (was masked before by the old near-black/white palette).
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  // Desk model is rotated 180° on the Y axis (see DESK_BASE_ROTATION_Y in
  // project-desk-model.tsx) to face the camera correctly — that flips the
  // paper planes' UV orientation too, so counter-rotate the texture itself.
  texture.center.set(0.5, 0.5);
  texture.rotation = Math.PI;
  texture.needsUpdate = true;
  return texture;
}
