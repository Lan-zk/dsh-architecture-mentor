# AGENTS.md — 本仓库维护规则

本仓库分两层文档：`docs/` 是产品设计基线，`.agents/notes/` 是决策与实现记录。
`docs/` 讲"应当是什么"，notes 讲"我们做了什么、为什么、代价"。

## 文档纪律

- `docs/architecture-mentor/` 只保留当前有效的设计基线；实施决策、执行计划、过程自审一律进 `.agents/notes/`。
- owning 设计文档必须与实现一致：状态标为 implemented 的文档不得残留"尚未实现/待定"的已落地项。
- 已完成计划的归宿是 implemented note，不是继续留在 docs/ 的执行史。
- 修改 docs/ 前，使用 `.agents/skills/` 下的本地维护技能：`doc-standards`、`prose-standard`、`trim-cot-leakage`、`archive-agent-notes`、`find-simplifications`。
- Agent Notes 规则见 `notes/README.md`；归档与审计使用 `archive-agent-notes` 技能。

## 提交前校验

```sh
node scripts/smoke-install.mjs
node scripts/generate-identity.mjs --check
git diff --check
```

文档移动/删除必须同步修复所有入链；不得留断链。
