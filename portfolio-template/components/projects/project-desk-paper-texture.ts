import * as THREE from 'three';
import type { Project } from '@/lib/types';

export interface PaperTextureLabels {
  projectPrefix?: string;
  clickForDetails?: string;
  brand?: string;
}

export function createPaperTexture(
  project: Project,
  isHovered = false,
  labels?: PaperTextureLabels
): THREE.CanvasTexture | THREE.Texture {
  if (typeof window === 'undefined') {
    return new THREE.Texture();
  }

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

  // Background color - sleek dark paper dossier
  ctx.fillStyle = isHovered ? '#1a1e2e' : '#12141d';
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 28);
  ctx.fill();

  // Subtle grid lines
  ctx.strokeStyle = isHovered ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const step = 48;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Border outline
  ctx.strokeStyle = isHovered ? '#f2d488' : '#2b3145';
  ctx.lineWidth = isHovered ? 6 : 4;
  ctx.beginPath();
  ctx.roundRect(10, 10, w - 20, h - 20, 24);
  ctx.stroke();

  // Top header accent line
  const accentGradient = ctx.createLinearGradient(30, 0, w - 30, 0);
  accentGradient.addColorStop(0, '#d4af37');
  accentGradient.addColorStop(0.5, '#f5e4ab');
  accentGradient.addColorStop(1, '#a8892d');
  ctx.fillStyle = accentGradient;
  ctx.fillRect(36, 32, w - 72, 6);

  // Project Number / Kicker
  ctx.fillStyle = '#f2d488';
  ctx.font = '600 34px "Geist Mono", monospace, sans-serif';
  ctx.fillText(`${projectPrefix} ${project.number}`, 48, 86);

  // Status Badge on Top-Right
  if (project.status || project.year) {
    const badgeText = `${project.status || 'PROJECT'} · ${project.year || '2025'}`;
    ctx.font = '500 24px "Geist Mono", monospace, sans-serif';
    const badgeW = ctx.measureText(badgeText).width + 36;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.14)';
    ctx.beginPath();
    ctx.roundRect(w - 48 - badgeW, 58, badgeW, 38, 19);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#f5e4ab';
    ctx.fillText(badgeText, w - 48 - badgeW + 18, 85);
  }

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(48, 120);
  ctx.lineTo(w - 48, 120);
  ctx.stroke();

  // Project Title (with wrapping)
  ctx.fillStyle = '#ffffff';
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
  ctx.fillStyle = '#f2d488';
  ctx.font = '500 28px "Geist Mono", monospace, sans-serif';
  ctx.fillText(`◆ ${roleText}`, 48, lineY + 65);

  // Summary / Description Snippet
  ctx.fillStyle = 'rgba(210, 215, 230, 0.75)';
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
    ctx.font = '500 22px "Geist Mono", monospace, sans-serif';
    project.technologies.slice(0, 3).forEach((tech: string) => {
      const tagWidth = ctx.measureText(tech).width + 24;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, 34, 8);
      ctx.fill();
      ctx.fillStyle = 'rgba(220, 225, 240, 0.85)';
      ctx.fillText(tech, tagX + 12, tagY + 24);
      tagX += tagWidth + 12;
    });
  }

  // Bottom action bar
  ctx.fillStyle = isHovered ? '#f5e4ab' : '#d4af37';
  ctx.font = '600 28px "Geist Mono", monospace, sans-serif';
  ctx.fillText(clickForDetails, w - ctx.measureText(clickForDetails).width - 48, h - 50);

  // Subtle watermark in bottom left
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = '500 20px "Geist Mono", monospace, sans-serif';
  ctx.fillText(brand, 48, h - 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
