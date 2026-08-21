---
name: architecture-retrospective
description: Use when reviewing an incident, migration, refactor or long-term consequence to connect what the learner knew, decided and predicted with what actually happened; reconstructs the timeline, checks attribution, extracts misconception corrections, and produces Experience, candidate Evidence and candidate Insight. Never turns a single outcome into a general principle and never treats project success as capability proof.
metadata:
  version: "0.1.0-rc.1"
---

# 把决策、预测与结果连起来复盘

## 身份与姿态

本技能执行复盘型学习策略：连接"当时知道什么 → 做了什么判断 → 预测了什么 → 后来发生什么 → 心智模型怎样变化"，产出 Experience、候选 Evidence 与候选 Insight。
本技能不下能力结论、不把项目成败等同于架构判断水平。
本技能约束归因质量与证据边界，不规定复盘必须按固定模板问答。

## 权威来源

- 能力与证据模型 —— 回答错误认知纠正为何是高价值证据，以及它必须保留什么。
- 学习质量护栏 —— 回答单个案例为何不能直接产生通用原则。
- 长期记忆模型 —— 回答 Insight 的质量要求与 Evidence 的行为描述要求。
- 工作区 `memory/README.md` —— 候选记录模板字段。
仓库设计文档位于 `../../docs/architecture-mentor/`（仅仓库内读取）；运行时契约以本技能与工作区模板为准。

## 入口契约与分诊

必需输入：一次可追溯的决策或预测、结果证据、学习者的原始产出或陈述。缺结果证据时报告缺什么并停止，不凭印象归因。

| 判定特征 | 执行路径 |
| --- | --- |
| 生产事故或失败 | 事故复盘：故障链 + 当时的判断缺口 |
| 迁移、重构或技术债偿还 | 演进复盘：原决策条件与今天的偏差 |
| 有预测可对照结果 | 预测校准：预测原文 vs 实际结果 |
| 学习者承认或表现出旧误区 | 错误认知纠正：旧判断 → 触发证据 → 新解释 → 迁移表现 |

## 执行动作与质量标准

1. 重建时间线：把"当时知道、当时判断、当时预测"按原始材料还原，逐项对照实际结果。合格判据：每项有 artifact 或会话引用，不是事后追认。
2. 归因检查：区分架构判断、实现质量、团队与外部环境的贡献。合格判据：报告明确写出哪些结果不能归因于架构判断。
3. 提炼纠正：对 Misconception Correction 保留四段——旧判断、触发修正的证据、新解释、后续迁移表现。合格判据：旧判断原文在场，不静默改写。
4. 产出候选：写候选 Experience（事实）；有学习者行为时起草候选 Evidence；只有通过"单个案例 → 通用原则"的检验（反例、跨案例、反事实或运行校准之一）才提交候选 Insight，且七字段齐备。

## 禁止项

禁止把项目成败全部归因于架构判断 —— 结果受实现、团队与外部环境影响；违规后果是证据失真。
禁止从单个结果推出通用原则 —— 只解释原项目是熟悉度；违规产物是无边界口号。
禁止把项目按时交付自动写成能力增长 —— 工程结果不等于学习结果。
禁止静默改写旧判断 —— 纠正必须保留旧判断并显式替代。

## 候选产出

候选 Experience 落盘为事实；候选 Evidence / Insight 以 `lifecycle: candidate` 提交，长期生效由 [`learner-model-calibration`](../learner-model-calibration/SKILL.md) 决定。提交候选 ≠ 长期生效。

## 检查清单

□ 时间线每项可追溯到原始材料
□ 归因区分了架构/实现/团队/环境
□ 纠正记录四段齐备（若适用）
□ 候选 Insight 七字段齐备，或已放弃提交
□ 未出现"项目成功 ⇒ 能力掌握"表述
□ 候选记录 `lifecycle: candidate`

## 报告契约

报告复盘对象、时间线结论、归因边界与候选记录路径。
不得声称能力状态提升；不得声称单案例经验已是通用原则。
