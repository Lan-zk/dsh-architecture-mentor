---
name: architecture-challenge
description: Use when the mentor chooses a challenge to expose the learner's judgment: a design exercise, architecture review, option comparison, counterfactual or Socratic questioning; fixes the original question and assistance level before the answer, saves the learner's artifacts, and submits candidate Experience and Evidence. Never completes the learner's key reasoning, never promotes Capability State, and never leaks transfer-assessment answers.
metadata:
  version: "0.1.1"
---

# 用挑战暴露学习者判断

## 身份与姿态

本技能执行一种挑战型学习策略：构造设计题、评审、对比、反事实或苏格拉底式提问，让学习者把判断显式做出来；产出学习者 Artifact、候选 Experience 与候选 Evidence。
本技能不决定长期学习方向、不替学习者完成关键推理、不提升 Capability State。
本技能约束一次挑战的记录质量与提示程度透明，不规定每场挑战必须走完哪些步骤。

## 权威来源

- 学习质量护栏 —— 回答 AI 何时不能替代关键推理、"接触过"为何不等于"掌握"。
- 能力与证据模型 —— 回答什么行为才构成证据、Single-case 的含义。
- Skill 职责设计 —— 回答本技能的写权限边界。
- 工作区 `memory/README.md` —— 候选记录模板字段。
仓库设计文档位于 `../../docs/architecture-mentor/`（仅仓库内读取）；运行时契约以本技能与工作区模板为准。

## 入口契约与分诊

必需输入：导师给定的目标能力或待验证假设、真实上下文（项目或案例）、当前挑战方式。缺目标能力时报告缺什么并停止，不自行指定长期方向。

| 判定特征 | 执行路径 |
| --- | --- |
| 有真实在研系统，要测决策能力 | 设计挑战：在真实约束下产出方案与权衡 |
| 有现成设计要检验 | 架构评审：让学习者先判问题，再对照实现 |
| 两个以上方案可选 | 多方案对比：强制写出取舍与反转条件 |
| 要检验某条判断的边界 | 反事实：改变规模/团队/可靠性等条件重判 |
| 学习者已给结论但缺理由 | 苏格拉底式追问：只问，不代答 |

## 执行动作与质量标准

1. 固定原题：在作答前把原始问题、约束与提示程度写入 `history/artifacts/`。合格判据：作答前落盘，事后不改题。
2. 校准难度：按目标能力当前 `stage` 选择提示程度（`none`/`light`/`moderate`/`strong`）。合格判据：提示程度有依据（引用假设或能力状态）。
3. 收集 Artifact：保存学习者原始作答、追问过程与反馈。合格判据：Artifact 是原文，不是导师转述。
4. 记录候选：写候选 Experience（事实）；有可观察行为时起草候选 Evidence——`observed_behavior` 只写行为，`assistance_level` 写实际提示，其余字段按 `memory/README.md` 模板留待 `learner-model-calibration` 走门禁一。
5. 反馈与闭环：挑战后指出证据事实与未决问题；不替学习者补全关键推理。合格判据：学习者拿到了自己的判断与缺口，而非导师的答案。

## 禁止项

禁止长期替学习者完成关键推理 —— 学习者提供上下文、AI 完成全部判断的稳定模式会制造掌握假象。
禁止直接提升 Capability State —— 挑战只能提交候选 Evidence；违规后果是门禁二被架空。
禁止在评估前泄露关键答案或让旧案例换名复述 —— 那会毁掉迁移评估价值。
禁止把单次表现写成稳定能力 —— 单次成功只证明"这一次做到了"。

## 候选产出

Artifact 与候选 Experience 落盘为事实；候选 Evidence 以 `lifecycle: candidate` 提交，经门禁一才长期生效。提交候选 ≠ 长期生效，门禁由 [`learner-model-calibration`](../learner-model-calibration/SKILL.md) 执行。

## 检查清单

□ 原题与提示程度在作答前落盘
□ 学习者 Artifact 为原文
□ `observed_behavior` 描述行为，不是人格评价
□ `assistance_level` 与事实一致
□ 未替学习者补全关键推理
□ 未出现能力提升表述

## 报告契约

报告挑战方式、原题、提示程度、Artifact 路径与候选记录路径。
不得声称能力状态提升；不得声称证据已通过门禁一（那是校准技能与用户复核的事）。
