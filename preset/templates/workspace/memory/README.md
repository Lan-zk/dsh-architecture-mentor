# memory/ — 五类长期记忆

本目录保存未来可能改变导师行为的信息。**不是所有已保存信息都是记忆**：
Raw History 在 `../history/`，五类长期记忆是 Experience、Evidence、Hypothesis、
Capability State、Architecture Insight。Active Memory 必须少而高价值。

## 通用约定

- 记录命名 `YYYY-MM-DD-slug.md`；身份 = 稳定相对路径；引用用相对路径。
- 生命周期是 frontmatter 字段，**不移动文件**；归档只加冻结元数据，不改正文。
- 事实类记录不改写原文；解释类记录用 `supersedes`/`superseded_by` 显式替代。
- 门禁由本目录模板的必填字段 + `learner-model-calibration` 技能的检查清单承载。

各类型允许的 `lifecycle` 值：

| 类型 | 允许值 |
| --- | --- |
| Experience / Evidence（事实类） | `candidate`、`active`、`archived` |
| Hypothesis / Insight（解释类） | `candidate`、`active`、`challenged`、`superseded`、`archived` |
| Capability State（证据摘要） | `active`、`challenged`、`superseded`、`archived` |

冻结语义：`lifecycle: archived` 时置 `frozen: true` 并填 `archived_at`；此后只允许修改
冻结元数据与引用修复，正文不得改写。git 提交历史代替 hash 密封。

## 门禁一映射：写入长期 Evidence

| 门禁一必答问题 | Evidence 必填字段 | 检查清单（calibration 技能执行） |
| --- | --- | --- |
| 对应的 Experience 是什么 | `experience_ref` | □ 指向存在的 Experience |
| 原始产出是什么 | `artifact_ref` | □ 指向原始产出，非导师总结 |
| 实际观察到的行为（非人格评价） | `observed_behavior` | □ 描述行为，不是评价 |
| 当时的业务/技术/组织上下文 | `context` | □ 已写明 |
| 接受了多少提示或 AI 协助 | `assistance_level` | □ 已写明提示程度 |
| 支持哪项能力或反驳哪项假设 | `supports_or_contradicts` | □ 已写明对象 |
| 是否存在明显反证 | `counterevidence` | □ 已检查并记录 |
| 为什么对未来教学仍有价值 | `future_decision_value` | □ 已说明 |
| 来源可追溯、未来可重新评估 | `re_evaluable_source` | □ 可回溯到原始产出 |
| （门禁通过 ≠ 掌握） | — | □ 已确认只表示"这一次" |

## 门禁二映射：提升 Capability State

| 门禁二必答要求 | Capability 必填字段 | 检查清单（calibration 技能执行） |
| --- | --- | --- |
| 具体能力维度与适用范围 | `capability_dimension` | □ 范围明确 |
| 引用通过门禁一的证据 | `evidence_refs` | □ 每条指向合格 Evidence |
| 证据覆盖哪个阶段 | `stage` | □ 是 exposure..transfer 之一 |
| 区分 Single-case / Repeated / Cross-context | `strength` | □ 已区分 |
| 提示程度 | `assistance` | □ 已写明 |
| 结果校准情况 | `calibration` | □ 已写明 |
| 时间稳定性 | `time_stability` | □ 已写明 |
| 是否存在未解决的冲突证据 | `unresolved_counterevidence` | □ 已检查并记录 |
| 保留尚未证明的部分 | `unproven_scope` | □ 已保留未知 |
| 记录旧状态及显式替代 | `supersedes` | □ 指向被替代状态 |
| 高置信度 Transfer 需跨场景证据 | — | □ `stage: transfer` 时 `strength: cross-context` |

> 定稿说明：`time_stability` 是 M2 定稿时相对《Skill 编写规范》§7.2 候选枚举新增的字段，
> 用于 1:1 承接门禁二"说明时间稳定性"这一必答要求；其余字段与候选枚举一致。

## 写入三分诊（默认少写）

| 分类 | 判定 | 处理 |
| --- | --- | --- |
| 不进入长期记忆 | 对未来教学决策没有可预见影响 | 留在 Raw History |
| 只写 Experience | 发生了值得追溯的事实，但无可观察学习表现 | 写 Experience |
| 走 Evidence 门禁 | 有学习者行为、原始产出，可能改变教学起点/诊断/挑战 | 按上方字段与清单执行门禁一 |

## 检索探针（零脚本，先跑再通读）

```text
lifecycle: candidate|challenged     # 待验证 / 冲突记录
supersedes:                          # 替代链是否完整
superseded_by:                       # 是否双向交叉引用
lifecycle: active 且无 evidence_ref  # 缺少证据链的活跃解释
```

## 模板：Experience（事实单元）

```markdown
---
type: experience
lifecycle: candidate        # candidate | active | archived
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
occurred_at: YYYY-MM-DD
project_ref: null           # 相对路径（history/projects/…）或 null
session_ref: null           # 相对路径（history/sessions/…）或 null
summary:                    # 发生了什么（可追溯事实）
future_decision_value:      # 为什么未来仍值得引用
frozen: false
archived_at: null
---

# <标题>

<!-- 只陈述可追溯事实。禁止写掌握程度、能力评价或解释性结论。 -->
```

## 模板：Evidence（学习证据，门禁一载体）

```markdown
---
type: evidence
lifecycle: candidate        # candidate | active | archived
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
experience_ref: ../experiences/YYYY-MM-DD-slug.md
artifact_ref: ../../history/artifacts/YYYY-MM-DD-slug/<file>
observed_behavior:          # 学习者实际做了什么；禁止人格评价
context:                    # 业务 / 技术 / 组织上下文
assistance_level: none      # none | light | moderate | strong
supports_or_contradicts:    # 支持的能力 / 反驳的假设（用相对路径引用）
counterevidence: none       # 已检查的明显反证；无则写 none
future_decision_value:      # 为什么这条记录会改变未来教学
re_evaluable_source:        # 来源如何追溯、未来如何重新评估
frozen: false
archived_at: null
---

# <标题>

<!-- 正文补充当时情境；记录"这一次"发生了什么，不声称掌握。 -->
```

## 模板：Hypothesis（导师假设）

```markdown
---
type: hypothesis
lifecycle: candidate        # candidate | active | challenged | superseded | archived
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
statement:                  # 可证伪的诊断，例如"可能倾向于方案先行"
evidence_refs: []           # 依据的 Evidence 相对路径；可为空数组但不可省略
rationale:                  # 为什么形成该假设
test_plan:                  # 如何验证 / 反驳；观察什么行为算反证
supersedes: []
superseded_by: []
frozen: false
archived_at: null
---

# <标题>

<!-- 假设不是事实；被验证、被反驳或替代时在 frontmatter 更新，不静默改写旧结论。 -->
```

## 模板：Capability State（能力状态，门禁二载体）

```markdown
---
type: capability
lifecycle: active           # active | challenged | superseded | archived
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
capability_dimension:       # 具体能力维度与适用范围
evidence_refs: []           # 通过门禁一的 Evidence 相对路径（非空）
stage: exposure             # exposure | explain | recognize | decide | predict | transfer
strength: single-case       # single-case | repeated | cross-context
assistance: none            # none | light | moderate | strong
calibration:                # 预测与结果的校准情况
time_stability:             # 间隔多久仍能重新判断；单次=不稳定
unresolved_counterevidence: none   # 未解决冲突证据；无则写 none
unproven_scope:             # 尚未证明的部分，保留未知，不写成"不会"
supersedes: []              # 被替代的旧 Capability 相对路径
superseded_by: []
frozen: false
archived_at: null
---

# <标题>

<!-- 已证明：逐条列出（引用 evidence_refs）。
     尚未证明：逐条列出（不能据证据空白推断"不会"）。 -->
```

## 模板：Architecture Insight（架构经验）

```markdown
---
type: insight
lifecycle: candidate        # candidate | active | challenged | superseded | archived
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
context:                    # 适用上下文与条件
forces:                     # 作用力 / 约束与目标
decision:                   # 判断及其理由
trade_offs:                 # 权衡与主要成本
alternatives:               # 可行替代方案
counterexamples: none       # 反例或不适用条件；无则写 none
re_evaluation_triggers:     # 什么变化触发重新评估，甚至反转
source_refs: []             # 案例与外部知识来源（相对路径或稳定链接）
supersedes: []
superseded_by: []
frozen: false
archived_at: null
---

# <标题>

<!-- Insight 属于知识，不证明学习者已经掌握；不得写成脱离条件的口号。 -->
```
