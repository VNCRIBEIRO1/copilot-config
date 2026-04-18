/**
 * Hook: Validate JSONL dataset files after write
 * Triggered on PostToolUse for create_file AND replace_string_in_file on .jsonl files
 * Checks: JSON parse, message structure, legal refs, PII (LGPD)
 *
 * Blocking policy:
 *   CRITICAL (PII)          → block (continue: false)
 *   ERROR   (bad JSON, missing structure, empty content) → block
 *   WARNING (no legal ref)  → allow with message
 */
import { readFileSync } from 'fs';

// Cross-platform stdin: fd 0 works on Windows + Unix
let raw = '';
try { raw = readFileSync(0, 'utf-8'); } catch { /* empty stdin is ok */ }
const input = JSON.parse(raw || '{}');
const filePath = input?.toolUse?.input?.filePath
  || input?.toolUse?.input?.path
  || '';

// Only validate .jsonl files under dataset directories
if (!filePath.endsWith('.jsonl') || !filePath.includes('dataset')) {
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

const issues = [];

try {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  if (lines.length === 0) {
    issues.push('ERROR: File is empty (0 valid lines)');
  }

  lines.forEach((line, idx) => {
    const ln = idx + 1;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch (e) {
      issues.push(`Line ${ln}: ERROR - Invalid JSON — ${e.message}`);
      return;
    }

    // Structure: messages array
    if (!obj.messages || !Array.isArray(obj.messages)) {
      issues.push(`Line ${ln}: ERROR - Missing 'messages' array`);
      return;
    }

    // Required roles
    const roles = obj.messages.map(m => m.role);
    for (const role of ['system', 'user', 'assistant']) {
      if (!roles.includes(role)) {
        issues.push(`Line ${ln}: ERROR - Missing '${role}' message`);
      }
    }

    // Empty content
    for (const m of obj.messages) {
      if (!m.content || m.content.trim().length === 0) {
        issues.push(`Line ${ln}: ERROR - Empty content in '${m.role}' message`);
      }
    }

    // Legal reference in assistant response (warning only)
    const assistantMsg = obj.messages.find(m => m.role === 'assistant');
    if (assistantMsg?.content) {
      const hasLegalRef = /art\.?\s*\d+|Lei\s*[\d.\/]+|Decreto\s*[\d.\/]+|EC\s*\d+|S[uú]mula\s*\d+/i.test(assistantMsg.content);
      if (!hasLegalRef) {
        issues.push(`Line ${ln}: WARNING - No legal reference in assistant response`);
      }
    }

    // PII detection — CPF in multiple formats + raw 11-digit sequences
    const fullText = obj.messages.map(m => m.content || '').join(' ');
    if (
      /\d{3}\.?\d{3}\.?\d{3}[-./]?\d{2}/.test(fullText) ||   // 123.456.789-00, 12345678900, 123456789/00
      /CPF[:\s]*\d/.test(fullText)                              // "CPF: 123..." explicit mention
    ) {
      issues.push(`Line ${ln}: CRITICAL - Contains CPF pattern (LGPD violation)`);
    }
    // Phone numbers with area code (11 digits)
    if (/(?:\+55\s?)?\(?\d{2}\)?\s?\d{4,5}[-.\s]?\d{4}\b/.test(fullText)) {
      issues.push(`Line ${ln}: WARNING - Possible phone number detected`);
    }
  });
} catch (e) {
  // File doesn't exist yet or can't be read — skip silently
  process.stdout.write(JSON.stringify({ continue: true }));
  process.exit(0);
}

if (issues.length > 0) {
  const blocking = issues.filter(i => /CRITICAL|ERROR/.test(i));
  const message = `Dataset validation: ${issues.length} issue(s) found.\n${issues.join('\n')}`;

  process.stdout.write(JSON.stringify({
    continue: blocking.length === 0,
    systemMessage: message
  }));
} else {
  process.stdout.write(JSON.stringify({
    continue: true,
    systemMessage: 'Dataset validation passed. All entries have correct format and legal references.'
  }));
}
