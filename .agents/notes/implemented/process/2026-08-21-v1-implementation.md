# Agent Note: 架构导师 v1 实现落地

Status: implemented

## Problem

V1 需要从设计文档变成一条命令可安装的 DSH 预设：安装器、预设组合、工作区模板、六个技能、身份同源生成。若只交付代码不收敛执行记录，docs/ 会留下已完成的计划和过时的验收状态。

## Decision

V1（M0–M4）已按 [v1-implementation-decisions](./2026-08-21-v1-implementation-decisions.md) 落地，交付物与验证证据如下。

| 里程碑 | 交付物 | 验证证据 |
| --- | --- | --- |
| M0 决策与基线 | 决策记录、README 开放项校正、`.gitignore`、`git init -b main` | 仓库基线提交 |
| M1 安装器与组合 | `scripts/install.mjs`、`preset/agent.cordis.yml`、`preset.yml`、`VERSION = 0.1.0-rc.1` | 冒烟测试 6/6；`discoverPresets` 显示 `broken: null` |
| M2 工作区模板 | 28 个模板文件；门禁一/二/三字段载体 | 门禁字段 25/25 覆盖；AGENTS.md 6.5 KB ≤ 16 KB |
| M3 六个技能 | 6 个 SKILL.md（66–93 行） | §11 机械自审通过；人工复核按用户决定跳过，试点时用真实行为再验证 |
| M4 身份同源 | `preset/src/mentor-identity.md` + `scripts/generate-identity.mjs` | persona 2,099 B ≤ 4 KB；AGENTS 4,744 B ≤ 16 KB；两次生成 diff 为空 |

安装器契约：只写用户预设根 `$DSH_HOME/.agent-presets/architecture-mentor/`，覆盖前备份，冲突拒绝，绝不触碰 shipped 预设。预设组合从官方 `standard` 拷贝裁剪；delegation / tool-jobs / tool-web 默认关闭。工作区初始化由 `mentor-workspace-init` 执行，写入前需用户确认；技能永不复制进工作区。

发布状态：2026-08-21 已发布 npm prerelease `dsh-architecture-mentor@0.1.0-rc.1` 至 npmjs.com，并初始化 GitHub 远程 `github.com/Lan-zk/dsh-architecture-mentor`（提交已推送）。安装命令见根 README 与 `dsh-engineering-design.md` §4。

## Alternatives considered

- **先做 M5 试点再落地 M0–M4**：用户决定跳过试点，直接搭建完整 V1。
- **先做 M6 完整发布（正式版 + GitHub Release）**：最初延后；V1 完成后仅发布 npm prerelease `0.1.0-rc.1`，正式版仍延后。
- **把已完成的计划留在 docs/**：执行史会持续腐烂，最终折叠为本 implemented note 并删除原计划文件。

## Consequences

- 仓库具备完整 V1：安装器、预设组合、模板、技能、身份同源生成。
- 人工复核流程被跳过，以机械自审为当前验收证据；试点时用真实行为补验。
- M5 试点延后；npm prerelease 已发布（`0.1.0-rc.1`），正式版与 GitHub Release 仍延后，触发条件保留在 docs/architecture-mentor/README.md 与实施计划相关记录中。
- 后续维护按 `.agents/AGENTS.md` 规则：docs/ 只留设计基线，实施记录进 notes。
