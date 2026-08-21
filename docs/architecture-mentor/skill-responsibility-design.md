# Skill 职责设计

## 设计目标

Skill（技能模块）用于高质量执行一种可复用的认知工作，不负责决定长期目标，也不拥有完整教学流程。Architecture Mentor（架构导师）根据 Mentoring Contract、当前上下文和 Learner Model 主动选择 Skill。

```text
Mentoring Contract + Active Context
                  ↓
        Architecture Mentor
        判断当前为什么做什么
                  ↓
        选择一个或多个 Skill
        执行具体认知工作
                  ↓
      产出事实、Artifact 或候选记录
                  ↓
      是否准备改变长期状态？
       ├─ 否：继续教学
       └─ 是：触发对应门禁
```

这是一种职责关系，不是固定调用链。导师可以只调用一个 Skill，也可以直接讲解、提问或调查；Skill 不要求按本文顺序执行。

## 拆分原则

一个职责适合独立成 Skill，通常需要满足：

- 它是一种在多个场景中重复出现的认知工作，而不是某个知识章节。
- 它有清晰输入、输出和质量标准。
- 它需要一组相对稳定的工具或证据要求。
- 它的禁止项与其他职责明显不同。
- 独立后能够降低越权写入长期状态的风险。

因此不优先建立 DDD Skill、Distributed Systems Skill 或 Data Architecture Skill。领域知识作为资料、能力维度和 Insight 参与不同策略，而不决定 Skill 边界。

## 顶层 Architecture Mentor

Architecture Mentor 是编排者，不是一个包揽所有步骤的“大 Skill”。它负责：

- 读取当前 Mentoring Contract 和 Active Context；
- 判断用户表面问题是否需要重新诊断；
- 在用户兴趣、现实交付、长期能力和可实践性之间确定当前优先级；
- 选择、组合或跳过具体 Skill；
- 决定何时只做临时探索，何时提交长期状态变更候选；
- 记录少量会影响未来教学的 Mentoring Intervention；
- 不能绕过三类长期状态变更门禁。

顶层导师不应亲自维护所有文件格式、生命周期索引和能力升级细节，这些职责应由边界更明确的状态维护 Skill 承担。

## v1 逻辑 Skill 集

| 逻辑 Skill | 核心任务 | 主要产出 | 禁止直接做的事 |
| --- | --- | --- | --- |
| Architecture Investigation | 调查陌生系统并重建架构事实、边界、约束和可能的设计理由 | Experience、来源索引、候选 Insight | 把现有实现当正确架构；宣布学习者掌握某项能力 |
| Architecture Challenge | 通过设计题、评审、对比、反事实或苏格拉底式提问暴露学习者判断 | 学习者 Artifact、Experience、候选 Evidence | 长期替用户完成关键推理；直接提升 Capability State |
| Architecture Retrospective | 把决策、预测、实际结果和心智模型修正连接起来 | Experience、候选 Evidence、候选 Insight | 从单个结果推出通用原则；把项目成功当能力证明 |
| Transfer Assessment | 在约束不同的陌生案例中验证判断是否可迁移 | 预先定义的案例与评价维度、候选跨场景 Evidence | 在评估前泄露关键答案；自行宣布高置信度 Transfer |
| Memory Curation | 校验长期 Evidence、维护生命周期、替代关系和 Active Context | 被接纳的 Evidence、生命周期更新、派生视图 | 创造不存在的学习表现；根据记录数量提升能力 |
| Learner Model Calibration | 用 Evidence 更新 Hypothesis 和 Capability State | 新假设、受质疑状态、显式替代后的能力状态 | 把导师旧判断当证据；用未知填补成“不会” |
| Mentoring Contract Management | 展示、比较、提议和应用契约变更 | 契约提案、用户确认后的新版本和历史版本 | 未经用户确认改变目标、约束或导师权限 |

这些是逻辑职责，不要求最终必须实现七个物理 Skill。相邻职责可以合并，但合并后仍必须保留输入输出、禁止项和状态写权限边界。

## Strategy Skill：产生学习经历

前四类属于策略执行 Skill。它们负责创造高价值学习经历或评估场景，不直接拥有长期学习者状态。

### Architecture Investigation

适用于陌生项目研究、代码考古、ADR 与 Git 历史分析、优秀架构案例重建。主要质量要求是区分 Observation、Inference、Evidence 和 Principle，并为每项推断保留来源和不确定性。

它可以直接生成 Experience 和来源索引，也可以提交候选 Insight。只有当学习者在调查中产生了可观察表现时，才可以提交候选 Evidence；调查结论本身不是学习者能力证据。

### Architecture Challenge

适用于设计挑战、架构评审、方案比较、反事实推演和苏格拉底式追问。它根据导师给出的目标能力和现实上下文选择挑战方式，但不自行决定长期学习方向。

它应保留学习者作答前的原始问题、提示程度、学习者 Artifact 和后续反馈。它可以提交候选 Evidence，但不能越过 Evidence 门禁或 Capability 提升门禁。

### Architecture Retrospective

适用于事故、重构、迁移、长期后果和错误认知纠正。它连接“当时知道什么、做了什么判断、预测了什么、后来发生什么、心智模型怎样变化”。

它特别适合产生高价值 Misconception Correction，但必须处理结果归因：项目结果受到实现质量、团队和外部环境影响，不能把所有成功或失败都归因于架构判断。

### Transfer Assessment

适用于准备提高能力置信度，尤其是声明 Predict 或 Transfer 时。它应改变业务、规模、可靠性、成本、组织或技术条件，避免只把旧案例换名复述。

评估场景、关键变量和评价维度应尽量在看到学习者答案前固定。是否由独立评估者执行仍未决定，但这个 Skill 只能产生候选跨场景 Evidence，最终能力更新属于 Learner Model Calibration。

## State Skill：维护长期可信状态

后三类属于状态维护 Skill。它们不负责设计日常课程，而是在准备改变长期状态时执行门禁和维护权威关系。

### Memory Curation

负责：

- 判断候选观察是否达到长期 Evidence 的最低标准；
- 检查原始 Artifact、来源、提示程度和 Future Decision Value；
- 维护 Experience、Evidence、Insight 的稳定身份和交叉引用；
- 管理 `candidate`、`active`、`challenged`、`superseded`、`archived`；
- 生成 Active Context 和其他非权威视图；
- 降级、归档或删除低价值派生内容。

它可以决定一条记录是否是合格 Evidence，但不能据此自行提升 Capability State。

### Learner Model Calibration

负责：

- 检查长期 Evidence 是否支持某个 Hypothesis；
- 区分 Single-case、Repeated 和 Cross-context Evidence；
- 更新已证明、尚未证明和存在反证的范围；
- 让旧假设或旧能力状态进入 challenged、superseded 或 archived；
- 执行 Capability State 提升门禁；
- 为导师生成可解释的当前能力摘要。

它不能创造 Evidence，也不能根据缺少记录推断学习者不会某项能力。

### Mentoring Contract Management

负责：

- 展示当前契约；
- 把导师建议与用户决定明确分离；
- 对比旧版本和建议版本；
- 验证用户确认或既有授权；
- 应用契约变更门禁；
- 保存当前版本、生效时间和历史替代关系。

它不评估学习者能力，也不能以能力诊断为由自动改变契约。

## 状态写权限

| 记录或状态 | 可提交候选的职责 | 可使其成为长期有效状态的职责 |
| --- | --- | --- |
| Experience | Investigation、Challenge、Retrospective、Transfer Assessment | Memory Curation |
| Evidence | Challenge、Retrospective、Transfer Assessment；有学习者行为时的 Investigation | Memory Curation 通过 Evidence 门禁 |
| Hypothesis | Architecture Mentor、Learner Model Calibration | Learner Model Calibration |
| Capability State | Learner Model Calibration | Learner Model Calibration 通过能力提升门禁 |
| Architecture Insight | Investigation、Retrospective、Architecture Mentor | Memory Curation |
| Mentoring Intervention | Architecture Mentor | Architecture Mentor，仅在具有未来教学价值时 |
| Mentoring Contract | Architecture Mentor 或用户提出修改 | Contract Management 在用户确认后应用 |
| Active Context / indexes | Memory Curation | 派生视图，不是权威状态 |

“可提交候选”不等于可以直接写成 `active`。策略 Skill 的主要职责是产生真实经历和可复核 Artifact，状态 Skill 才负责长期状态门禁。

## Skill 组合不是固定流程

以下调用都合法：

```text
研究开源项目：
Architecture Investigation

挑战一个正在设计的系统：
Architecture Challenge

事故复盘并修正能力状态：
Architecture Retrospective
→ Memory Curation
→ Learner Model Calibration

只做一次探索但不形成长期状态：
Architecture Investigation
→ 结束，不触发门禁
```

当没有长期状态变更时，不必为了“流程完整”调用 Memory Curation 或 Learner Model Calibration。

## 当前仍未决定

- 七个逻辑职责最终合并成多少个物理 Skill。
- Architecture Investigation 是否进一步拆分代码调查与决策重建。
- Transfer Assessment 是否必须由独立 Agent 或校验器执行。
- Memory Curation 和 Learner Model Calibration 能否由同一 Skill 实现而不产生自我强化。
- Skill 使用何种输入输出格式提交候选记录。
- 顶层导师如何计算当前学习优先级和选择策略。
- 学习、交付、混合模式如何影响 Skill 行为。

这些未决项应通过少量真实学习任务验证后再确定，不能仅根据目录整齐程度决定。
