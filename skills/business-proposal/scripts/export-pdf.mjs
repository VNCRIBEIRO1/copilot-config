/**
 * export-pdf.mjs — Converts proposal HTML to PDF via Playwright
 * 
 * Usage: node export-pdf.mjs <input.html> [output.pdf]
 * 
 * If output is omitted, replaces .html with .pdf
 * Requires: npx playwright install chromium (first run)
 */

import { chromium } from 'playwright';
import { readFile, access } from 'fs/promises';
import { resolve, basename, dirname, join } from 'path';

const [,, inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error('Usage: node export-pdf.mjs <input.html> [output.pdf]');
  process.exit(1);
}

const inputPath = resolve(inputArg);
const outputPath = outputArg 
  ? resolve(outputArg) 
  : inputPath.replace(/\.html$/, '.pdf');

const MAX_RETRIES = 3;
const TIMEOUT_MS = 30_000;
const VIEWPORT = { width: 1280, height: 900 };

try {
  await access(inputPath);
} catch {
  console.error(`❌ File not found: ${inputPath}`);
  process.exit(1);
}

console.log(`📄 Input:  ${basename(inputPath)}`);
console.log(`📁 Output: ${basename(outputPath)}`);

async function generatePdf(attempt = 1) {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: VIEWPORT });

    // Load HTML with file:// protocol for local asset loading
    const htmlContent = await readFile(inputPath, 'utf-8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT_MS,
    });

    // Wait for all fonts AND images to load
    await page.evaluate(() =>
      Promise.all([
        document.fonts.ready,
        ...Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise((res, rej) => {
            img.onload = res;
            img.onerror = res; // don't block on broken images
          })),
      ])
    );

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      scale: 1,
      timeout: TIMEOUT_MS,
    });

    await browser.close();
    console.log(`✅ PDF generated: ${basename(outputPath)}`);
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    if (attempt < MAX_RETRIES) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}. Retrying...`);
      return generatePdf(attempt + 1);
    }
    throw err;
  }
}

generatePdf().catch(err => {
  console.error(`❌ PDF generation failed after ${MAX_RETRIES} attempts: ${err.message}`);
  process.exit(1);
});
