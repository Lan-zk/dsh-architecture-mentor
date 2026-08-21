---
name: doc-standards
description: Use when writing, moving, reviewing, or auditing documentation in dsh-architecture-mentor; deciding where content belongs, checking budgets, hunting doc slop, or auditing the corpus for rot.
metadata:
  version: "0.1.0"
---

# 文档标准与文档腐烂审计

> 来源：dsh-doc-standards，已适配本仓库。

## 权威来源

- `.agents/AGENTS.md` —— docs/ 与 notes/ 边界、提交前校验。
- `.agents/notes/README.md` —— 决策何时进 notes、生命周期与归档。
- `docs/architecture-mentor/README.md` —— 设计文档导航、开放项与实施记录指针。

## 结构先于文字

1. 定位文档在仓库树中的位置与直接子级；父级只保留子级的用途/职责/高层行为，细节下沉到各自归属。
2. 按用途分类：参考文档供查找，教程/计划类有明确读者与可观察结果。
3. 混合形态拆分；小形态标清小节。
4. 移动/重命名前 grep 入链；移动必须原子完成并修复所有入链。

## 审计语料

1. 度量：统计 `docs/` 与 `.agents/` 的 Markdown 字数，找超预算 outlier（本仓库纪律：SKILL.md ≤ 200 行，AGENTS.md/README 精简）。
2. 用 [trim-cot-leakage](../trim-cot-leakage/SKILL.md) 清思维链、过程叙述、死引用。
3. 用 grep 找重复短语；保留一个 home，其余改链接。
4. 替换手写目录/状态清单为权威树或脚本引用（如 `.agents/notes/README.md`、`preset/skills/` 实际树）。
5. implemented note 移除迁移计划、验收任务清单、未来式；保留验收契约与命名缺口。
6. 删除若改变承诺行为而非解释，先走 [find-simplifications](../find-simplifications/SKILL.md) 或写 note。

## 删除与废弃

- 删除/废弃需用户确认；先标 `[已废弃]` 再删（遵守 revise-docs 约束）。
- 归档 note 用 [archive-agent-notes](../archive-agent-notes/SKILL.md)。

## 校验

- `node scripts/smoke-install.mjs`
- `node scripts/generate-identity.mjs --check`
- `git diff --check`
- grep 确认无断链。
