#!/usr/bin/env node
/**
 * validate-pdf-assets.mjs
 * Hook PreToolUse (matcher: run_in_terminal)
 *
 * Roda SOMENTE antes de comandos de terminal — e internamente filtra se é PDF.
 * 
 * 1. Extrai path do HTML do comando
 * 2. Verifica imagens referenciadas (existência + tamanho)
 * 3. Otimiza imagens >1600px via sharp
 * 4. Injeta CSS @media print UMA VEZ (idempotente — verifica marcador)
 * 5. Reporta problemas sem bloquear
 */

import { readFile, writeFile, access } from 'fs/promises';
import { resolve, dirname, basename } from 'path';

const MAX_IMG_WIDTH = 1600;
const CSS_MARKER = '/* __PDF_HOOK_INJECTED__ */';

const PDF_IMAGE_CSS = `
${CSS_MARKER}
@media print {
  img, .screenshot, .capture, [data-screenshot] {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid;
    break-inside: avoid;
    image-rendering: -webkit-optimize-contrast;
  }
  .screenshot-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    page-break-inside: avoid;
  }
  .screenshot-full {
    width: 100%;
    max-height: 90vh;
    object-fit: contain;
    page-break-before: always;
  }
  .screenshot-half {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }
  .screenshot-caption {
    font-size: 0.75rem;
    color: #666;
    text-align: center;
    margin-top: 0.25rem;
  }
  @page {
    size: A4;
    margin: 0;
  }
}
`;

async function readStdin() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  try { return JSON.parse(input); } catch { return {}; }
}

function extractCommand(hookData) {
  return hookData?.toolInput?.command
    || hookData?.tool?.input?.command
    || hookData?.input?.command
    || '';
}

async function optimizeImage(imgPath) {
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(imgPath).metadata();
    if (meta.width > MAX_IMG_WIDTH) {
      const buf = await sharp(imgPath)
        .resize(MAX_IMG_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
      await writeFile(imgPath, buf);
      process.stderr.write(`  📐 ${basename(imgPath)}: ${meta.width}→${MAX_IMG_WIDTH}px\n`);
      return true;
    }
  } catch { /* sharp não disponível — continua */ }
  return false;
}

async function validateAndPrepare(htmlPath) {
  const htmlDir = dirname(htmlPath);
  let html = await readFile(htmlPath, 'utf-8');
  let modified = false;
  const issues = [];

  // Coletar referências de imagens (src e url())
  const refs = new Set();
  for (const rx of [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /url\(["']?([^"')]+\.(?:png|jpg|jpeg|webp))["']?\)/gi,
  ]) {
    let m;
    while ((m = rx.exec(html)) !== null) refs.add(m[1]);
  }

  process.stderr.write(`🔍 ${refs.size} imagens em ${basename(htmlPath)}\n`);

  for (const src of refs) {
    if (src.startsWith('data:') || /^https?:\/\//.test(src)) continue;
    const imgPath = resolve(htmlDir, src);
    try {
      await access(imgPath);
      await optimizeImage(imgPath);
    } catch {
      issues.push(`❌ Not found: ${src}`);
    }
  }

  // Injetar CSS idempotente (apenas se marcador não existe)
  if (!html.includes(CSS_MARKER)) {
    const insertAt = html.lastIndexOf('</style>');
    if (insertAt !== -1) {
      html = html.slice(0, insertAt) + PDF_IMAGE_CSS + html.slice(insertAt);
      modified = true;
      process.stderr.write('  💉 CSS print injetado (primeira vez)\n');
    }
  }

  if (modified) {
    await writeFile(htmlPath, html, 'utf-8');
    process.stderr.write(`  ✅ ${basename(htmlPath)} atualizado\n`);
  }

  if (issues.length) process.stderr.write(issues.join('\n') + '\n');
  return { issues: issues.length, images: refs.size, modified };
}

async function main() {
  const hookData = await readStdin();
  const command = extractCommand(hookData);

  // Filtrar: só atuar se o comando envolve PDF
  if (!command.match(/pdf|export-pdf/i)) {
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  process.stderr.write('🔧 Pre-PDF: validando assets...\n');

  // Extrair .html do comando
  const htmlMatch = command.match(/([^\s"']+\.html)/i);
  if (!htmlMatch) {
    process.stderr.write('⚠️ Nenhum .html encontrado no comando\n');
    process.stdout.write(JSON.stringify({ continue: true }));
    return;
  }

  try {
    const result = await validateAndPrepare(resolve(htmlMatch[1]));
    const output = { continue: true };
    if (result.issues > 0) {
      output.systemMessage = `⚠️ ${result.issues} imagem(ns) não encontrada(s). Verifique antes de enviar o PDF.`;
    }
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    process.stderr.write(`⚠️ ${err.message}\n`);
    process.stdout.write(JSON.stringify({ continue: true }));
  }
}

main().catch(() => {
  process.stdout.write(JSON.stringify({ continue: true }));
});
