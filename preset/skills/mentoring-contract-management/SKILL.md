---
name: mentoring-contract-management
description: Use when displaying, comparing, proposing or applying a Mentoring Contract change; renders the current contract, diffs proposed versions, separates mentor proposals from user decisions, and applies a new version with its history and supersession chain. Never applies any contract change without explicit user confirmation and never evaluates learner capability.
metadata:
  version: "0.1.1"
---

# 管理导师契约及其变更

## 身份与姿态

本技能管理 Mentoring Contract 的展示、比较、提案与应用，产出契约提案、用户确认后的新版本与历史替代链。
本技能不评估学习者能力、不决定学习方向、不以诊断为由自动改契约。
本技能约束门禁三的确认与留痕，不规定契约多久复审一次。

## 权威来源

- 导师契约 —— 回答契约的八类语义、权力边界与"不是每次对话的表单"。
- 长期状态变更门禁 —— 回答门禁三的必答要求。
- 工作区 `contract/README.md` —— 门禁三映射表与版本命名；`contract/current.md` —— 当前版本。
仓库设计文档位于 `../../docs/architecture-mentor/`（仅仓库内读取）；运行时契约以本技能与工作区模板为准。

## 入口契约与分诊

必需输入：请求类型与（应用时）用户确认。无确认的应用请求一律拒绝并报告缺什么。

| 判定特征 | 执行路径 |
| --- | --- |
| 展示或解释当前契约 | 只读 `contract/current.md` 并回答 |
| 导师建议修改契约 | 产出提案与 diff，不应用 |
| 用户发起修改或确认导师提案 | 走门禁三后应用 |
| 复查条件被触发 | 提案一次复查，不自动改契约 |

## 执行动作与质量标准

1. 展示：读 `contract/current.md` 与 `contract/history/`，回答当前目标、范围、约束、权限、模式、判据与复查条件。合格判据：引用当前版本，不凭记忆。
2. 提案：把导师建议与用户决定分开呈现；diff 旧版本与建议版本（八节逐项）。合格判据：`proposed_by` 明确是 user 还是 mentor，理由可追溯。
3. 应用（门禁三）：逐项执行 `contract/README.md` 映射表检查清单；`user_confirmation` 记录用户明确确认或既有授权依据；填写 `effective_at`、`supersedes`（指向被替代版本）、`teaching_impact`；把新版本写入 `contract/history/YYYY-MM-DD-slug.md` 并更新 `contract/current.md`。合格判据：七字段齐备，历史链完整。
4. 留痕：git 提交本次契约变更；`teaching_impact` 说明是否中止、调整或继续当前教学活动。

## 禁止项

禁止未经用户明确确认应用契约修改 —— 契约是用户拥有的权威状态；违规后果是系统优化方向被导师篡改。
禁止以能力诊断为由自动改契约 —— Learner Model 与契约是两类状态；违规后果是推断覆盖用户目标。
禁止评估学习者能力 —— 本技能不拥有该判断；违规后果是职责越权。
禁止改写历史版本 —— 旧版本保留原文与替代关系；违规后果是追溯链断裂。

## 门禁与候选提交

本技能执行门禁三，以 `contract/README.md` 的映射表为字段与检查清单载体；未确认的提案只作为候选存在，不写入 `contract/`。

## 检查清单

□ `proposed_by` 已标注 user 或 mentor
□ `reason` 写明现实变化或新证据
□ `user_confirmation` 为明确确认或既有授权依据
□ `effective_at` 与 `supersedes` 已填
□ `teaching_impact` 已评估
□ 历史版本落盘且正文未被改写
□ 变更已 git 提交

## 报告契约

报告新旧版本差异、生效时间、替代链与教学影响。
不得声称用户已确认而实际只是导师建议；不得声称能力状态因契约变更而变化。
