---
name: architecture-investigation
description: Use when investigating an unfamiliar codebase, doing code archaeology, reconstructing an architecture decision and its constraints, or researching an open-source system; separates observation, inference, evidence and principle, and produces investigation reports, source indexes, Experience records and candidate Insight. Never treats the current implementation as the correct architecture and never declares learner capability.
metadata:
  version: "0.1.1"
---

# 调查陌生系统并重建架构事实

## 身份与姿态

本技能完成一种认知工作：把陌生系统还原为架构事实、边界、约束与可能的设计理由；产出调查产物、Experience、来源索引与候选 Insight。
本技能不判断学习方向、不宣布学习者掌握某项能力、不把现有实现解释成正确架构。
本技能约束一次调查的证据质量与记录边界，不规定必须先看哪个目录。

## 权威来源

- 学习质量护栏 —— 回答 Observation / Inference / Evidence / Principle 必须怎样分离，什么不能伪造。
- Skill 职责设计 —— 回答本技能可以提交哪些候选记录、禁止写什么。
- 长期记忆模型 —— 回答 Insight 的质量字段与 Experience 的事实边界。
- 工作区 `memory/README.md` —— 记录模板字段；`history/README.md` —— 原始产出归属。
仓库设计文档位于 `../../docs/architecture-mentor/`（仅仓库内读取）；运行时契约以本技能与工作区模板为准。

## 入口契约与分诊

必需输入：目标项目路径（或稳定引用）与调查目的。缺项目时报告缺什么并停止，不代用户指定。

| 判定特征 | 执行重点 |
| --- | --- |
| 陌生代码库通读 | 先骨架（模块/依赖/数据流），后关键路径 |
| 决策重建（ADR / git 历史） | 沿决策链回溯约束与替代 |
| 开源案例研究 | 强调约束、代价与不适用条件 |
| 为挑战或复盘提供事实基础 | 只产事实与来源，不下教学结论 |

## 执行动作与质量标准

1. 圈定范围与来源：仓库路径、git 历史、ADR、README、配置、运行环境。合格判据：每条材料有路径或版本。
2. 四层分离：所有结论显式标记 Observation / Inference / Evidence / Principle；每条 Inference 至少一条 Observation 与一条 Evidence 支撑；不确定处写"未证实"。合格判据：不存在无来源推断。
3. 重建结构与决策：模块边界、质量属性、关键决策、代价与替代（优先取自 ADR 与 PR 讨论）。合格判据：每个关键决策有约束与代价，不只有选型名称。
4. 产出落盘：调查产物放 `history/artifacts/`；值得引用的外部来源写 `history/sources/`；值得长期引用的事实写候选 Experience（模板见 `memory/README.md`）。合格判据：记录只有事实，无掌握程度。
5. 候选记录：候选 Insight 必须满足全部质量字段（`context`/`forces`/`decision`/`trade_offs`/`alternatives`/`counterexamples`/`re_evaluation_triggers`）；只有观察到学习者行为时，才起草候选 Evidence 交 `learner-model-calibration` 走门禁一。

## 禁止项

禁止把现有实现直接解释为正确架构 —— 实现可能来自历史偶然；违规产物是"看似合理的架构总结"。
禁止伪造无法从证据确认的设计意图 —— 推断必须可追溯；违规产物是编造的历史。
禁止宣布学习者掌握或直接提升 Capability State —— 调查结论不是能力证据；违规后果是学习者模型被污染。

## 候选产出

调查产物、来源索引与 Experience 作为事实落盘；候选 Insight / Evidence 以 `lifecycle: candidate` 提交，长期生效由 [`learner-model-calibration`](../learner-model-calibration/SKILL.md) 决定。提交候选 ≠ 长期生效。

## 检查清单

□ 每条 Inference 有 Observation + Evidence 支撑
□ 来源带路径或版本
□ 报告无"现有实现即正确"表述
□ 候选 Insight 七字段齐备，或已放弃提交
□ 未出现能力掌握表述
□ 候选记录 `lifecycle: candidate`

## 报告契约

报告调查范围、材料清单、事实与推断的数量、落盘文件与候选记录路径。
不得声称能力状态变化；不得声称 Insight 已进入高置信度知识库。
