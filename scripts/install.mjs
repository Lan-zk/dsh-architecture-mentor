#!/usr/bin/env node
// Installer for the `architecture-mentor` DSH agent preset.
//
// Contract (docs/architecture-mentor/dsh-engineering-design.md §4):
//   - only writes $DSH_HOME/.agent-presets/architecture-mentor/ plus one
//     sibling backup dir during upgrades;
//   - never touches shipped presets;
//   - idempotent; upgrades by VERSION comparison with a backup first;
//   - refuses when the target exists but carries no VERSION of this project
//     (preset-id conflict), and refuses downgrades.
//
// Pure Node ESM, no build step, no runtime dependencies.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PRESET_ID = 'architecture-mentor';
const REPO_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE_DIR = path.join(REPO_ROOT, 'preset');

export function readVersion(dir) {
  const file = path.join(dir, 'VERSION');
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8').trim();
}

// Compares `x.y.z[-pre]` versions without dependencies.
// Returns -1 | 0 | 1 (a > b => 1).
export function compareVersions(a, b) {
  const parse = (v) => {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/.exec(String(v).trim());
    if (!match) throw new Error(`invalid version: ${JSON.stringify(v)}`);
    return {
      nums: [Number(match[1]), Number(match[2]), Number(match[3])],
      pre: match[4] ?? null,
    };
  };
  const va = parse(a);
  const vb = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if (va.nums[i] !== vb.nums[i]) return va.nums[i] > vb.nums[i] ? 1 : -1;
  }
  if (va.pre === null && vb.pre === null) return 0;
  if (va.pre === null) return 1; // release > prerelease
  if (vb.pre === null) return -1;
  if (va.pre === vb.pre) return 0;
  return va.pre > vb.pre ? 1 : -1;
}

function printAcceptanceChecklist(log, targetDir) {
  log('');
  log('安装完成。请在 DSH 中核对验收清单（工程化设计 §4.3）：');
  log('  1. 预设出现在 roster，显示名“架构导师”；');
  log('  2. 新会话工具清单包含 skill、文件工具与 pwsh/bash；');
  log('  3. 会话技能目录出现全部内置技能（mentor-workspace-init 与各策略/状态技能）；');
  log('  4. 开启第一个对话，完成工作区初始化。');
  log(`预设目录：${targetDir}`);
}

/**
 * @param {{dshHome?: string, log?: (s: string) => void}} options
 * @returns {{status: 'installed'|'noop'|'upgraded'|'refused'|'downgrade-refused', targetDir: string, reason?: string, backupDir?: string}}
 */
export function installPreset(options = {}) {
  const dshHome = options.dshHome ?? process.env.DSH_HOME ?? path.join(homedir(), '.dsh');
  const log = options.log ?? console.log;
  const presetsRoot = path.join(dshHome, '.agent-presets');
  const targetDir = path.join(presetsRoot, PRESET_ID);

  if (!existsSync(SOURCE_DIR) || !existsSync(path.join(SOURCE_DIR, 'agent.cordis.yml'))) {
    throw new Error(`preset source not found: ${SOURCE_DIR}`);
  }
  const sourceVersion = readVersion(SOURCE_DIR);
  if (!sourceVersion) throw new Error('preset/VERSION is missing or empty');

  mkdirSync(presetsRoot, { recursive: true });

  // Fresh install.
  if (!existsSync(targetDir)) {
    cpSync(SOURCE_DIR, targetDir, { recursive: true });
    log(`installed architecture-mentor ${sourceVersion}`);
    printAcceptanceChecklist(log, targetDir);
    return { status: 'installed', targetDir };
  }

  const targetVersion = readVersion(targetDir);
  if (targetVersion === null) {
    // Preset-id conflict: the directory is not ours.
    const reason =
      `${targetDir} exists but has no VERSION file from this project. ` +
      `Refusing to overwrite a foreign preset. Rename or remove it manually first.`;
    log(`refused: ${reason}`);
    return { status: 'refused', targetDir, reason };
  }

  const cmp = compareVersions(sourceVersion, targetVersion);
  if (cmp === 0) {
    log(`already installed: architecture-mentor ${targetVersion}`);
    return { status: 'noop', targetDir };
  }
  if (cmp < 0) {
    const reason =
      `installed version ${targetVersion} is newer than source version ${sourceVersion}; refusing downgrade.`;
    log(`refused: ${reason}`);
    return { status: 'downgrade-refused', targetDir, reason };
  }

  // Upgrade: back up the existing preset first, then replace.
  const backupDir = path.join(
    presetsRoot,
    `${PRESET_ID}.bak-${targetVersion}-${Date.now()}`,
  );
  rmSync(backupDir, { recursive: true, force: true });
  renameSync(targetDir, backupDir);
  try {
    cpSync(SOURCE_DIR, targetDir, { recursive: true });
  } catch (error) {
    // Restore the previous install before surfacing the failure.
    rmSync(targetDir, { recursive: true, force: true });
    renameSync(backupDir, targetDir);
    throw error;
  }
  log(`upgraded architecture-mentor ${targetVersion} -> ${sourceVersion}`);
  log(`backup: ${backupDir}`);
  printAcceptanceChecklist(log, targetDir);
  return { status: 'upgraded', targetDir, backupDir };
}

function isDirectRun() {
  if (!process.argv[1]) return false;
  return fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
}

if (isDirectRun()) {
  try {
    installPreset();
  } catch (error) {
    console.error(`install failed: ${error.message}`);
    process.exitCode = 1;
  }
}
