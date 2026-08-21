#!/usr/bin/env node
// Build-time identity generator (D11): one source, two deterministic products.
//
//   preset/src/mentor-identity.md
//     ├─ persona section → persona `text:` block in preset/agent.cordis.yml
//     └─ agents section  → preset/templates/AGENTS.md
//
// Budgets: persona ≤ 4 KB, AGENTS ≤ 16 KB. Products are checked in; edits
// belong in the source file only. `--check` reports drift without writing.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, 'preset', 'src', 'mentor-identity.md');
const COMPOSITION = path.join(ROOT, 'preset', 'agent.cordis.yml');
const AGENTS = path.join(ROOT, 'preset', 'templates', 'AGENTS.md');

const PERSONA_MAX_BYTES = 4096;
const AGENTS_MAX_BYTES = 16384;
const PERSONA_INDENT = '      '; // matches `    text: |-` + two spaces in the composition

function read(file) {
  return readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function section(source, name) {
  const pattern = new RegExp(
    `<!--\\s*${name}:start\\s*-->\\n([\\s\\S]*?)\\n<!--\\s*${name}:end\\s*-->`,
  );
  const match = pattern.exec(source);
  if (!match) throw new Error(`missing "${name}" section in mentor-identity.md`);
  return match[1].trimEnd();
}

function composeWithPersona(composition, persona) {
  const startAnchor = '    text: |-';
  const endAnchor = '\n\n- id: agent-instructions';
  const starts = composition.split(startAnchor).length - 1;
  if (starts !== 1) throw new Error(`expected exactly one "${startAnchor.trim()}" anchor, found ${starts}`);
  const start = composition.indexOf(startAnchor);
  const end = composition.indexOf(endAnchor, start);
  if (end < 0) throw new Error(`persona block end anchor not found: ${JSON.stringify(endAnchor)}`);
  const indented = persona
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : PERSONA_INDENT + line))
    .join('\n');
  return composition.slice(0, start + startAnchor.length) + '\n' + indented + composition.slice(end);
}

function generate() {
  const source = read(SOURCE);
  const persona = section(source, 'persona');
  const agents = `${section(source, 'agents')}\n`;
  const personaBytes = Buffer.byteLength(persona, 'utf8');
  const agentsBytes = Buffer.byteLength(agents, 'utf8');
  if (personaBytes > PERSONA_MAX_BYTES) {
    throw new Error(`persona is ${personaBytes} bytes, over the ${PERSONA_MAX_BYTES} byte budget`);
  }
  if (agentsBytes > AGENTS_MAX_BYTES) {
    throw new Error(`AGENTS.md is ${agentsBytes} bytes, over the ${AGENTS_MAX_BYTES} byte budget`);
  }
  for (const required of ['{{cwd}}', '八条记忆不变量', 'Bootstrap']) {
    if (!persona.includes(required)) throw new Error(`persona section must contain: ${required}`);
  }
  for (const required of ['## 八条记忆不变量', '## 三类长期状态变更门禁', '## 技能索引']) {
    if (!agents.includes(required)) throw new Error(`agents section must contain: ${required}`);
  }
  const composition = composeWithPersona(read(COMPOSITION), persona);
  return { persona, agents, composition, personaBytes, agentsBytes };
}

const checkOnly = process.argv.includes('--check');
const { persona, agents, composition, personaBytes, agentsBytes } = generate();

if (checkOnly) {
  const drift = [];
  if (composition !== read(COMPOSITION)) drift.push(COMPOSITION);
  if (agents !== read(AGENTS)) drift.push(AGENTS);
  if (drift.length > 0) {
    console.error(`identity drift in: ${drift.join(', ')} — run node scripts/generate-identity.mjs`);
    process.exitCode = 1;
  } else {
    console.log(`identity ok (persona ${personaBytes}B, AGENTS ${agentsBytes}B)`);
  }
} else {
  writeFileSync(COMPOSITION, composition);
  writeFileSync(AGENTS, agents);
  console.log(`wrote ${path.relative(ROOT, COMPOSITION)} (persona ${personaBytes}B)`);
  console.log(`wrote ${path.relative(ROOT, AGENTS)} (${agentsBytes}B)`);
}
