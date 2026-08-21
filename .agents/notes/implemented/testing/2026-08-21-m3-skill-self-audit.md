# Agent Note: 架构导师 M3 技能自审

Status: implemented

## Problem

六个 `SKILL.md` 落地前需要按《Skill 编写规范》§11 自审清单逐项核对，并留档供验收与后续维护追溯。

## Decision

按 §11 自审清单对 6 个技能完成机械自审，结果全部通过，记录见下表。依据：frontmatter name 与目录一致且 kebab-case；description 全 ASCII 且以 `Use when` 开头；正文含身份与姿态、权威来源、入口契约与分诊、执行动作与质量标准、禁止项、检查清单、报告契约；状态类技能的门禁以模板字段 + 检查清单承载；记忆类技能含写时治理、三分诊、类型敏感更新、校准示例；正文均 ≤ 200 行（66–93 行）。

| 技能 | 行数 | 说明 |
| --- | --- | --- |
| mentor-workspace-init | 69 | 初始化/升级三分诊、契约访谈、断点续跑 |
| architecture-investigation | 66 | 四层分离、候选 Experience/Insight |
| architecture-challenge | 68 | 五路挑战分诊、作答前固定原题 |
| architecture-retrospective | 66 | 时间线、归因检查、错误认知纠正 |
| learner-model-calibration | 93 | 双职责分区、门禁一/二、校准示例 |
| mentoring-contract-management | 66 | 契约四分诊、门禁三 7 字段 |

人工复核：用户决定跳过（2026-08-21）。机械自审作为当前验收证据；门禁与写权限内容在试点时用真实行为再验证。

## Alternatives considered

- **保留人工复核流程**：用户明确跳过，避免阻塞 V1 搭建。
- **只自审不落盘**：会丢失验收依据，最终写入本 note 留档。

## Consequences

- 6 个技能通过机械自审并随预设分发；本地预设刷新安装后 `discoverPresets` 仍为 `broken: null`。
- 门禁与写权限内容的人工复核责任转移到试点阶段。
