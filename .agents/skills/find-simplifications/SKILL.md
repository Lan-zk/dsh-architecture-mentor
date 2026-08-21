---
name: find-simplifications
description: Use when hunting for non-obvious simplification candidates in dsh-architecture-mentor: dead, duplicated, speculative, over-built, or hand-rolled surfaces in scripts, preset configuration, docs, or agent notes; and when folding superseded notes or writing proposed notes.
metadata:
  version: "0.1.0"
---

# 查找程序与文档的简化机会

> 来源：dsh-find-simplifications，已适配本仓库。

## 范围

- 代码：`scripts/*.mjs`
- 配置：`preset/agent.cordis.yml`、`preset/preset.yml`、`preset/templates/**`
- 文档：`docs/architecture-mentor/**`、`.agents/**`
- 依赖：`package.json`

## 强候选

- 无生产消费者的脚本、工具或配置开关（如 `agent.cordis.yml` 中保持关闭且无人启用的行）。
- 两份表示镜像同一事实（如文档重复的开放项、重复的目录索引、模板与 note 重复的规则）。
- 投机通用性：只为一个场景设计的抽象或参数。
- 手写代码可用 Node 内置或已依赖的成熟包替代（按依赖政策评估，删除实现加测试才算净收益）。
- 已加后删的能力仍被文档描述为可用。

## 证明或否决

- 先 grep 精确符号/字符串/路径，再读调用点；不要只靠列表。
- 生产语料：`scripts/`、`preset/`、`package.json`；非生产：`docs/`、`.agents/`、测试（若有）。
- 否决：有真实消费者；由已实施 note 明确的刻意设计；删除引发无关连锁改动。

## 收敛 superseded notes

- 审计 `.agents/notes/` 中同主题旧 note；完全替代则把唯一理由、替代方案、后果、验收证据并入当前 note 后删除；部分替代保留交叉引用。
- 用 [archive-agent-notes](../archive-agent-notes/SKILL.md) 做保留/归档/删除判断。

## 写 note

- 路径：`.agents/notes/proposed/{class}/yyyy-mm-dd-slug.md`
- 结构：按 `.agents/notes/README.md` 的 proposed 骨架（Problem / Proposal / Alternatives considered / Acceptance criteria / Risks）。

## 内联 TODO

只用于小的局部清理；用稳定标签如 `TODO(name):`，说明为何可安全重访与做什么；不用于需要 note 级决策的行为。

## 校验

- `node scripts/smoke-install.mjs`
- `node scripts/generate-identity.mjs --check`
- `git diff --check`
