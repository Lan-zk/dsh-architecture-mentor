# AGENTS.md — dsh-architecture-mentor 仓库常驻指引

> 渐进式披露：本文件只放每个会话都需要的方向与指针；细节在各自归属文档中按需读取。
> 中文为本仓库维护语言；面向人的入口见 `README-zh.md`。

## 这是什么

一个把真实工程工作转化为架构学习体验的 DSH 开源预设：安装器、预设组合、工作区模板、6 个导师技能、身份同源生成。V1 已落地；试点与发布延后。

## 顶层布局

| 路径 | 作用 | 何时读 |
| --- | --- | --- |
| `README-zh.md` / `README.md` | 项目介绍与快速开始 | 首次进入或向人解释时 |
| `docs/architecture-mentor/README.md` | 设计基线导航（应当是什么） | 做设计相关判断前 |
| `.agents/notes/README.md` | 决策与实现记录规则 | 写或审 note 时 |
| `.agents/AGENTS.md` | 仓库维护纪律（docs/notes 边界、提交前校验） | 修改 docs/ 或 .agents/ 时 |
| `.agents/skills/` | 本地维护技能 | 需要文档/程序腐烂审计时 |
| `preset/README.md` | 产品预设目录说明 | 改 preset 时 |
| `scripts/README.md` | 构建与校验脚本 | 运行或修改脚本时 |

## 常驻纪律

- `docs/` 只放当前有效设计；实施记录进 `.agents/notes/`。
- 已完成计划折叠为 implemented note，不留在 docs/ 当执行史。
- 提交前运行：`node scripts/smoke-install.mjs`、`node scripts/generate-identity.mjs --check`、`git diff --check`。
- 移动/删除文档需修复所有入链，删除需用户确认。

## 按需加载

- 设计语义：`docs/architecture-mentor/` 各文档。
- 实施记录：`.agents/notes/implemented/`。
- 维护技能：`.agents/skills/`（`doc-standards`、`prose-standard`、`trim-cot-leakage`、`archive-agent-notes`、`find-simplifications`）。
- 产品实现：`preset/`、`scripts/`。
