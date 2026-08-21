---
name: learner-model-calibration
description: Use when maintaining long-term memory or calibrating the learner model: triage candidate observations, run scoped supersession audits, admit Experience, Evidence and Insight, update lifecycles and derived views, or update Hypotheses and Capability States. Enforces Gate 1 (writing long-term Evidence) and Gate 2 (promoting Capability State) as template fields plus checklists, and requires user review before either takes effect. Never invents evidence and never promotes capability from curation alone.
metadata:
  version: "0.1.1"
---

# 维护长期记忆并校准学习者模型

## 身份与姿态

本技能包含两条职责分区，写权限不同：
- Memory Curation：决定记录准入、生命周期、替代关系与派生视图；可以决定一条记录是否合格 Evidence，**不能**提升 Capability State。
- Learner Model Calibration：用长期 Evidence 更新 Hypothesis 与 Capability State，执行门禁二；**不能**创造 Evidence。
本技能约束长期状态变更的证据质量与可追溯性，不规定日常教学流程。

## 权威来源

- 长期状态变更门禁 —— 回答门禁一、二各自必须满足什么。
- 长期记忆模型 —— 回答五类记录、证据链与八条不变量。
- 记忆生命周期 —— 回答生命周期状态与类型敏感的更新语义。
- 能力与证据模型 —— 回答能力阶梯与证据强度。
- 工作区 `memory/README.md` —— 模板字段与门禁映射表；`views/README.md` —— 视图语义。
仓库设计文档位于 `../../docs/architecture-mentor/`（仅仓库内读取）；运行时契约以本技能与工作区模板为准。

## 入口契约与分诊

必需输入：候选记录或维护请求；重建视图时需要 `contract/current.md`。缺输入时报告缺什么并停止。

| 判定特征 | 执行路径 |
| --- | --- |
| 新观察可能影响未来教学 | 写入三分诊（见下） |
| 已有记录需审计、归档、降级或删除 | Memory Curation 维护路径 |
| 用证据更新假设或能力状态 | Calibration 路径（门禁二） |
| 视图过期或缺失 | 重建派生视图 |

## 执行动作与质量标准

### Memory Curation

1. 写入三分诊（默认少写）：对未来教学没有可预见影响 → 留在 Raw History；只发生了值得追溯的事实 → 写 Experience；有学习者行为、原始产出、可能改变教学起点/诊断/挑战 → 走门禁一。
2. 写时治理（最高优先级）：任何新记录写入前，先做 scoped supersession 审计——检索同主题 Experience/Evidence/Hypothesis/Capability/Insight，当场处理：完全替代（解释类旧记录 `superseded` 并交叉引用；事实类不替代，按需归档）、部分替代（双向交叉引用，保留仍成立部分）、无冲突（不制造替代关系）。
3. 记录准入：按 `memory/README.md` 模板逐字段校验；缺字段即门禁不通过。Experience 只陈述事实；Evidence 只描述行为。
4. 类型敏感更新：Experience/Evidence 不改写原文，追加更正记录并交叉引用；Hypothesis 可 `challenged`/`superseded`；Capability State 新状态显式 `supersedes` 旧状态；Insight 可质疑、细化、替代，不静默改适用边界。
5. 归档与冻结：置 `lifecycle: archived`、`archived_at`、`frozen: true`；只允许冻结元数据与引用修复，正文不得改写；git 提交历史代替 hash 密封。
6. 检索探针：先跑候选模式（`lifecycle: candidate|challenged`、`supersedes:`、`superseded_by:`、`lifecycle: active` 且无 `evidence_ref`），再对该主题最密集的记录做无模式通读——探针会漏，关键词不是定义。
7. 重建视图：更新 `views/active-context.md`（≤ 8 KB，排序 = 决策价值 × 证据质量 × 误用风险）、`challenged.md`、`archived.md` 与 indexes。视图非权威，可删除重建。

### Learner Model Calibration

1. 更新 Hypothesis：检查 Evidence 支持或反驳哪些假设；支持 → `active`，冲突 → `challenged` 并写验证计划，被更准解释替代 → `superseded`。假设必须引用证据，不能把导师旧判断当新证据。
2. 更新 Capability State：只引用通过门禁一的 Evidence；按 `memory/README.md` 门禁二映射表逐字段填写；`stage: transfer` 必须 `strength: cross-context`；`unproven_scope` 保留未知，不写成"不会"。
3. 受质疑不是退化：新反证让状态进入 `challenged`，等待验证，不立即删除历史判断。

## 禁止项

禁止创造不存在的学习表现 —— Evidence 只能来自真实行为与原始产出；违规后果是学习者模型建立在虚构上。
禁止根据记录数量提升能力 —— 门禁二只看证据覆盖与强度；违规后果是课程完成度仪表盘式失真。
禁止把导师旧判断当新证据 —— 导师判断不能循环证明自身；违规后果是自我强化。
禁止用证据空白推断"不会" —— `unproven_scope` 必须保留未知；违规后果是把未知写成缺失。

## 门禁与候选提交

- 门禁一（写长期 Evidence）：逐项执行 `memory/README.md` 门禁一映射表的检查清单，全部满足后**交用户复核**；通过前记录保持 `candidate`。
- 门禁二（提升 Capability State）：逐项执行门禁二映射表检查清单，写 `supersedes` 显式替代旧状态，**交用户复核**；通过前不得宣称能力提升。
- 本技能不执行门禁三；契约变更归 [`mentoring-contract-management`](../mentoring-contract-management/SKILL.md)。
- 每条门禁动作在 git 提交中留痕。

## 校准示例

判据是未来决策价值，不是规模或数量：

- **keep**：一条 320 词的预测校准 Evidence——学习者两次独立预测，一次被运行结果推翻；它直接改变下次挑战起点。
- **archive**：一条 1,900 词的初期调查 Experience——项目已换技术栈；事实仍可追溯，但不再影响当前教学，归档并保留反例价值。
- **delete**：一份 45 行对话总结——没有学习者行为、没有原始产出、不影响任何未来决策；噪声。
- 规模不说明问题：一条 80 词的 Evidence 可以是 keep，一条 2,000 词的记录也可能 delete。

## 检查清单

□ 新写入前完成 scoped supersession 审计
□ 三分诊结论有依据（判断：为何 raw / Experience / 门禁一）
□ Evidence 九字段齐备且检查清单逐项通过
□ Capability 十字段齐备、`supersedes` 指向旧状态、Transfer 有跨场景证据
□ 归档只加了冻结元数据，正文未改，引用已修复或标注历史引用
□ 视图重建自权威记录，未手改后反向覆盖
□ 门禁一/二均获得用户复核
□ 相关变更已 git 提交

## 报告契约

报告 keep / archive / delete / 边界案例及其判据；校准路径报告新假设或新能力状态与替代链。
不得声称未经用户复核的门禁通过；不得声称能力状态发生变化，除非门禁二完成。
