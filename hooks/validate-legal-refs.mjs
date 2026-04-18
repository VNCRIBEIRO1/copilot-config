/**
 * Hook: Validate legal content in LLM responses
 * Checks for hallucinated articles and known invalid references
 * Triggered on PostToolUse for terminal commands (ollama, curl to LLM)
 */
import { readFileSync } from 'fs';

// Cross-platform stdin: fd 0 works on Windows + Unix
let raw = '';
try { raw = readFileSync(0, 'utf-8'); } catch { /* empty stdin is ok */ }
const input = JSON.parse(raw || '{}');
const output = input?.toolUse?.output || '';

// Only check if output contains legal-looking content
if (!/art\.\s*\d+|Lei\s*[\d.]+/i.test(output)) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

const warnings = [];

// Known valid article ranges for key laws
const validRanges = {
  'Lei 8.213': { min: 1, max: 156 },
  'Lei 8.212': { min: 1, max: 105 },
  'Decreto 3.048': { min: 1, max: 387 },
  'Lei 8.742': { min: 1, max: 40 },
};

// Check for articles that exceed known ranges
for (const [law, range] of Object.entries(validRanges)) {
  const regex = new RegExp(`art\\.?\\s*(\\d+).*?${law.replace(/\s/g, '\\s*').replace(/\./g, '\\.')}`, 'gi');
  let match;
  while ((match = regex.exec(output)) !== null) {
    const artNum = parseInt(match[1]);
    if (artNum > range.max || artNum < range.min) {
      warnings.push(`Possible hallucination: art. ${artNum} of ${law} (valid range: ${range.min}-${range.max})`);
    }
  }
}

// Check reverse pattern too: "Lei X, art. Y"
for (const [law, range] of Object.entries(validRanges)) {
  const regex = new RegExp(`${law.replace(/\s/g, '\\s*').replace(/\./g, '\\.')}.*?art\\.?\\s*(\\d+)`, 'gi');
  let match;
  while ((match = regex.exec(output)) !== null) {
    const artNum = parseInt(match[1]);
    if (artNum > range.max || artNum < range.min) {
      warnings.push(`Possible hallucination: ${law}, art. ${artNum} (valid range: ${range.min}-${range.max})`);
    }
  }
}

if (warnings.length > 0) {
  process.stdout.write(JSON.stringify({
    continue: true,
    systemMessage: `⚠️ Legal reference check:\n${warnings.join('\n')}\nVerify these references before using in dataset.`
  }));
} else {
  process.stdout.write(JSON.stringify({ continue: true }));
}
