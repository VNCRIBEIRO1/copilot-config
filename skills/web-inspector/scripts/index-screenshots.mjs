#!/usr/bin/env node
/**
 * index-screenshots.mjs
 * Gera manifest.json a partir de screenshots existentes num diretório.
 * 
 * Uso: node index-screenshots.mjs <diretorio> [url-do-site]
 * Ex:  node index-screenshots.mjs screenshots/spinelli https://spinelli-khaki.vercel.app
 */

import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { join, basename, extname } from 'path';

const dir = process.argv[2];
const siteUrl = process.argv[3] || 'unknown';

if (!dir) {
  console.error('Uso: node index-screenshots.mjs <diretorio> [url-do-site]');
  process.exit(1);
}

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const VIEWPORTS = ['desktop', 'mobile', 'tablet', 'laptop'];
const TYPES = ['full', 'fullpage', 'element', 'viewport'];

/**
 * Parsing inteligente de nome de arquivo.
 * Suporta nomes compostos como: presidente-prudente-desktop-full.png
 * Estratégia: procura viewport/type de trás pra frente, o resto é o nome da página.
 */
function parseFilename(filename) {
  const name = basename(filename, extname(filename));
  // Remove sufixo -embed se existir
  const clean = name.replace(/-embed$/, '');
  const parts = clean.split('-');

  let viewport = 'unknown';
  let type = 'viewport';
  const pageTokens = [];

  // Scan de trás pra frente — viewport e type ficam no final
  let i = parts.length - 1;
  while (i >= 0) {
    const lower = parts[i].toLowerCase();
    if (TYPES.includes(lower) && type === 'viewport') {
      type = lower === 'full' || lower === 'fullpage' ? 'fullPage' : lower;
    } else if (VIEWPORTS.includes(lower) && viewport === 'unknown') {
      viewport = lower;
    } else {
      break;
    }
    i--;
  }

  // Tudo que sobrou é o nome da página
  const page = parts.slice(0, i + 1).join('-') || 'unknown';
  const isEmbed = name.endsWith('-embed');

  return { page, viewport, type, isEmbed };
}

async function indexScreenshots() {
  const files = await readdir(dir);
  const images = files.filter(f =>
    IMAGE_EXTS.has(extname(f).toLowerCase()) && !f.endsWith('-embed.png')
  );

  if (images.length === 0) {
    console.log('Nenhuma imagem encontrada em', dir);
    process.exit(0);
  }

  const pages = new Map();

  for (const file of images) {
    const { page, viewport, type } = parseFilename(file);
    const fileStat = await stat(join(dir, file));

    if (!pages.has(page)) {
      const slug = page === 'home' || page === 'index' ? '' : page;
      pages.set(page, {
        url: siteUrl !== 'unknown' ? `${siteUrl}/${slug}` : slug,
        title: page.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        screenshots: []
      });
    }

    // Check for -embed variant
    const embedFile = file.replace(/(\.\w+)$/, '-embed$1');
    const hasEmbed = files.includes(embedFile);

    pages.get(page).screenshots.push({
      file,
      ...(hasEmbed ? { embed_file: embedFile } : {}),
      type,
      viewport,
      size_kb: Math.round(fileStat.size / 1024),
      description: `${page.replace(/-/g, ' ')} — ${viewport} ${type}`
    });
  }

  const manifest = {
    site: siteUrl,
    captured_at: new Date().toISOString(),
    viewport_configs: {
      desktop: { width: 1920, height: 1080 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 }
    },
    pages: Array.from(pages.values()),
    total_captures: images.length
  };

  const manifestPath = join(dir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✅ Manifest gerado: ${manifestPath}`);
  console.log(`   ${images.length} screenshots em ${pages.size} páginas`);
}

indexScreenshots().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});

indexScreenshots().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
