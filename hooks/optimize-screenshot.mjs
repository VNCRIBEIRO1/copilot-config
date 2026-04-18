#!/usr/bin/env node
/**
 * optimize-screenshot.mjs
 * Hook PostToolUse (matcher: mcp_microsoft_pla_browser_take_screenshot)
 *
 * Roda SOMENTE após browser_take_screenshot.
 * - Encontra o screenshot salvo (via output do tool ou mais recente em .playwright-mcp/)
 * - Copia para o diretório de destino correto (screenshots/{dominio}/)
 * - Redimensiona para max 1600px largura (retina-ready para A4)
 * - Comprime PNG com sharp (lanczos3)
 * - Gera versão @1x (800px) para embed em HTML de proposta
 */

import { readdir, stat, writeFile, copyFile, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const MAX_WIDTH_RETINA = 1600; // 2x para A4 (210mm ≈ 794px CSS)
const MAX_WIDTH_EMBED = 800;   // 1x para embed em HTML

async function readStdin() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  try { return JSON.parse(input); } catch { return {}; }
}

async function getLatestScreenshot(dir) {
  try {
    const files = await readdir(dir);
    const images = files.filter(f =>
      ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(f).toLowerCase()) &&
      !f.includes('-embed')
    );
    if (!images.length) return null;

    let latest = null, latestTime = 0;
    for (const file of images) {
      const fp = join(dir, file);
      const s = await stat(fp);
      if (s.mtimeMs > latestTime) { latestTime = s.mtimeMs; latest = fp; }
    }
    return latest;
  } catch { return null; }
}

async function optimize(filePath, maxWidth, suffix = '') {
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(filePath).metadata();
    const originalSize = (await stat(filePath)).size;

    let pipeline = sharp(filePath);
    if (meta.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3'
      });
    }

    const buffer = await pipeline
      .png({ compressionLevel: 9, effort: 10, palette: false })
      .toBuffer();

    const outPath = suffix
      ? filePath.replace(/(\.\w+)$/, `${suffix}$1`)
      : filePath;

    await writeFile(outPath, buffer);
    const newSize = buffer.length;
    const pct = Math.round((1 - newSize / originalSize) * 100);

    process.stderr.write(
      `📸 ${basename(outPath)}: ${meta.width}×${meta.height}` +
      (meta.width > maxWidth ? ` → ${maxWidth}px` : '') +
      ` | ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB (${pct > 0 ? '-' : '+'}${Math.abs(pct)}%)\n`
    );
    return outPath;
  } catch (err) {
    process.stderr.write(`⚠️ sharp: ${err.message}\n`);
    return filePath;
  }
}

async function main() {
  const hookData = await readStdin();

  // Double-check: skip if not a screenshot tool (belt + suspenders with matcher)
  const toolName = hookData?.toolName || hookData?.tool?.name || '';
  if (toolName && !toolName.includes('screenshot')) {
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  // Find the screenshot — try extracting path from tool output, else latest in .playwright-mcp
  let screenshotPath = null;
  const output = hookData?.toolOutput || hookData?.output || '';
  const pathMatch = typeof output === 'string' && output.match(/\.playwright-mcp[\\\/][^\s\]]+\.png/i);
  if (pathMatch) {
    screenshotPath = pathMatch[0];
  } else {
    screenshotPath = await getLatestScreenshot('.playwright-mcp');
  }

  if (!screenshotPath) {
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  // Optimize: full resolution (retina) in-place
  await optimize(screenshotPath, MAX_WIDTH_RETINA);

  // Generate embed version for HTML proposals
  await optimize(screenshotPath, MAX_WIDTH_EMBED, '-embed');

  process.stdout.write(JSON.stringify({ continue: true }));
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});
