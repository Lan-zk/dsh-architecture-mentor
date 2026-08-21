// Build-time smoke test for scripts/install.mjs (not a runtime gate script).
//
// Runs the installer against a throwaway DSH_HOME and verifies the four
// contract paths from dsh-engineering-design.md §4:
//   fresh install, idempotent no-op, upgrade with backup, foreign-dir refusal.
// Also asserts the installer never writes outside
//   <dsh-home>/.agent-presets/architecture-mentor*
//
// Usage: node scripts/smoke-install.mjs

import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { installPreset, readVersion } from './install.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE_VERSION = readVersion(path.join(ROOT, 'preset'));
const tmp = mkdtempSync(path.join(tmpdir(), 'dsh-architecture-mentor-smoke-'));
const dshHome = path.join(tmp, 'dsh-home');
const presetsRoot = path.join(dshHome, '.agent-presets');
const targetDir = path.join(presetsRoot, 'architecture-mentor');

const silent = { log: () => {} };
const results = [];
function step(name, fn) {
  try {
    fn();
    results.push(`PASS ${name}`);
  } catch (error) {
    results.push(`FAIL ${name}: ${error.message}`);
  }
}

try {
  // 1. Fresh install.
  step('fresh install', () => {
    const result = installPreset({ dshHome, log: silent.log });
    assert.equal(result.status, 'installed');
    assert.equal(readVersion(targetDir), SOURCE_VERSION);
    assert.ok(existsSync(path.join(targetDir, 'agent.cordis.yml')));
  });

  // 2. Idempotent no-op.
  step('idempotent no-op', () => {
    const result = installPreset({ dshHome, log: silent.log });
    assert.equal(result.status, 'noop');
    assert.equal(readVersion(targetDir), SOURCE_VERSION);
  });

  // 3. Upgrade with backup.
  step('upgrade with backup', () => {
    writeFileSync(path.join(targetDir, 'VERSION'), '0.0.1\n');
    const result = installPreset({ dshHome, log: silent.log });
    assert.equal(result.status, 'upgraded');
    assert.ok(result.backupDir);
    assert.ok(existsSync(result.backupDir));
    assert.equal(readVersion(targetDir), SOURCE_VERSION);
  });

  // 4. Foreign directory refusal (preset-id conflict).
  step('foreign directory refusal', () => {
    rmSync(targetDir, { recursive: true, force: true });
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(path.join(targetDir, 'foreign-marker.txt'), 'not ours');
    const result = installPreset({ dshHome, log: silent.log });
    assert.equal(result.status, 'refused');
    assert.ok(existsSync(path.join(targetDir, 'foreign-marker.txt')));
  });

  // 5. Downgrade refusal.
  step('downgrade refusal', () => {
    rmSync(targetDir, { recursive: true, force: true });
    installPreset({ dshHome, log: silent.log });
    writeFileSync(path.join(targetDir, 'VERSION'), `${SOURCE_VERSION.split('-')[0]}-zzz-later\n`);
    const result = installPreset({ dshHome, log: silent.log });
    assert.equal(result.status, 'downgrade-refused');
  });

  // 6. Write-scope containment: only architecture-mentor* may exist.
  step('write-scope containment', () => {
    const entries = readdirSync(presetsRoot);
    for (const entry of entries) {
      assert.ok(
        entry === 'architecture-mentor' || entry.startsWith('architecture-mentor.bak-'),
        `unexpected entry in .agent-presets: ${entry}`,
      );
    }
  });

  console.log(results.join('\n'));
  const failures = results.filter((line) => line.startsWith('FAIL'));
  if (failures.length > 0) {
    console.error(`\n${failures.length} smoke step(s) failed`);
    process.exitCode = 1;
  } else {
    console.log('\nall smoke steps passed');
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
