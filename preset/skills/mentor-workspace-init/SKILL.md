---
name: mentor-workspace-init
description: Use when a workspace has no .mentor/workspace.yml, its templateVersion trails the installed preset, or the user asks to initialize or upgrade an Architecture Mentor workspace; scaffolds the contract, history, memory, mentoring and views directories from preset templates, interviews the user for the mentoring contract, and writes the workspace AGENTS.md and active context. Never writes workspace files without user confirmation and never copies skills into the workspace.
metadata:
  version: "0.1.1"
---

# 初始化或升级架构导师工作区

## 身份与姿态

本技能把空目录或旧版工作区初始化为 Architecture Mentor 工作区，产出目录骨架、契约、人格文件与初始活跃工作集。
本技能不决定学习目标、不评估学习者能力、不复制任何技能进工作区。
本技能约束初始化与升级的写入边界和幂等性，不规定首次教学必须做什么。

## 权威来源

- 工程化设计（仓库维护时读 `../../docs/architecture-mentor/dsh-engineering-design.md` §5）—— 回答初始化标记、步骤、确认边界与 git 根要求。
- Workspace 目录设计 —— 回答每个目录放什么、由谁写入、视图为何非权威。
- 导师契约 —— 回答契约访谈的八类语义与门禁三。
运行时契约以本技能与 `../../templates/` 为准；仓库文档不随预设分发，工作区内不依赖其在场。

## 入口契约与分诊

必需输入：当前工作区目录；本技能目录（资源根）。任何写工作区文件的操作前必须取得用户确认。

| 判定特征 | 执行路径 |
| --- | --- |
| `.mentor/workspace.yml` 缺失 | 完整初始化（先展示步骤并确认） |
| 标记存在且 `templateVersion` 落后 | 升级（先 diff，再逐项确认） |
| 标记为当前版本 | 报告已就绪并停止，进入正常导师会话 |

## 执行动作与质量标准

1. 项目根保障：确认工作区是独立 git 项目根。不是时说明后果并询问是否 `git init`，经确认后执行。合格判据：`.git` 位于工作区根。
2. 目录骨架：把 `../../templates/workspace/` 复制到工作区根：`contract/`、`history/`、`memory/`、`mentoring/`、`views/`、`.agents/skills/README.md`、`.gitignore`。合格判据：与模板树一致，每个叶子目录有 README。
3. 契约访谈：按八类语义逐项询问——长期目标、当前训练范围、现实约束、导师主动权、用户保留权力、当前工作模式、成功判据、复查条件——写入 `contract/current.md`；frontmatter 填 `proposed_by: user`、`user_confirmation: confirmed`、`effective_at`、`reason: 初始建立`。合格判据：八节均为用户原意，导师不代填。
4. 人格落地：把 `../../templates/AGENTS.md` 写入工作区根 `AGENTS.md`；`AGENTS.local.md` 由模板 `.gitignore` 排除提交。合格判据：文件存在且 ≤ 16 KB。
5. 初始工作集：按模板生成 `views/active-context.md`，指向 `contract/current.md`。
6. 断点续跑：每完成一步落盘 `.mentor/workspace.yml`（`schemaVersion`、`templateVersion`、`initializedAt`）。重入跳过已完成步骤，不覆盖用户已确认内容。
7. 升级：把新模板与工作区现有文件 diff，经用户确认后逐项应用；技能永不在此列。

## 禁止项

禁止未确认就写工作区文件 —— 契约与人格是用户拥有的权威状态；违规后果是导师覆盖用户意图。
禁止复制技能进工作区 —— `.agents/skills/` 只作用户覆盖层；违规后果是遮蔽预设内置版与升级失效。
禁止代用户填写契约内容 —— 契约八节只能来自用户；违规后果是导师把诊断写成用户目标。
禁止在非 git 根继续初始化 —— 技能发现依赖独立项目根；违规后果是技能不可见或污染外层仓库。

## 门禁与候选提交

本技能通过访谈加显式确认满足门禁三（初始化例外：流程本身包含用户确认）。生成的 `contract/current.md` 是首个契约版本，frontmatter 字段按 `contract/README.md` 的映射表填写。本技能不写 Evidence、不写 Capability State。

## 检查清单

□ 工作区是独立 git 项目根（或已确认 `git init`）
□ `.mentor/workspace.yml` 三字段齐备
□ 目录骨架与模板一致，叶子目录 README 齐备
□ `contract/current.md` 八节均为用户原意（判断：逐节核对用户原话）
□ `AGENTS.md` 已写入且 ≤ 16 KB
□ `views/active-context.md` 骨架存在
□ `.agents/skills/` 只有 README，无技能副本
□ 所有写入均获得用户确认

## 报告契约

报告创建或更新的文件、标记值（`schemaVersion`/`templateVersion`/`initializedAt`）与升级 diff 摘要。
不得声称学习者能力状态变化；不得声称契约内容来自导师判断。
