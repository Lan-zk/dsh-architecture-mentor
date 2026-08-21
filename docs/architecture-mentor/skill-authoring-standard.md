# 导师 Skill 编写规范

> 状态：proposed（候选规范，尚未在任何 SKILL.md 中实现）。
> 本文把 `projects/dsh/.agents/skills/` 与 `projects/dsh/.agents/notes/` 中观察到的设计手法，转译为架构导师预设 Skill 的编写规则。只借手法，不搬 dsh 的环境绑定实现：pnpm/CI 校验脚本、三语 triplet、路径编码生命周期、`agents/openai.yaml` 均不进入 v1。

## 1. 目的与适用对象

本规范回答一个问题：导师预设里的每个 `SKILL.md` **应该怎样写**，才能把已经确认的语义设计（职责、门禁、写权限、记忆不变量）变成可执行、可检查、可报告的指令。

适用对象（按 [DSH 工程化设计](./dsh-engineering-design.md) §7.2）：

- 预设内置：`mentor-workspace-init`、`architecture-investigation`、`architecture-challenge`、`architecture-retrospective`、`learner-model-calibration`（v1 含 Memory Curation 职责）、`mentoring-contract-management`；
- 工作区 `.agents/skills/` 下的用户覆盖副本与扩展技能。

本规范不重新定义：

- Skill 的职责边界与写权限 → [Skill 职责设计](./skill-responsibility-design.md)；
- DSH 运行时机制 → [DSH 工程化设计](./dsh-engineering-design.md)；
- 记忆语义与门禁内容 → [长期记忆模型](./memory-model.md)、[记忆生命周期](./memory-lifecycle.md)、[长期状态变更门禁](./state-change-gates.md)。

## 2. 本轮已确认的决定

- 先定编写规范，再逐个落地 SKILL.md；当前交付物只有设计文档。
- 只借 dsh 的设计手法，不搬环境绑定实现。
- v1 零脚本：三类门禁由记录模板必填字段 + 技能内检查清单承载；校验由导师自检执行、用户复核，git 提交历史作为审计链。
- `memory-curation` 不拆出独立 Skill，并入 `learner-model-calibration`；该 Skill 必须显式保持两条职责边界（见 §8.1）。
- 不改变 [Workspace 目录设计](./workspace-directory-design.md) 的结论：生命周期是记录属性，不按生命周期建目录、不移动文件；仅从 dsh 借入**冻结语义**（见 §7.4）。
- frontmatter 与技能名使用 ASCII（沿用工程化设计 §9）。

尚未决定：SKILL.md 正文语言（中文 / 英文 / 双语）、各技能的最终 description 文本、记录模板字段最终枚举、校准示例与检索探针的具体内容。

## 3. 编写总原则

这些原则是从 dsh 11 个技能与 Agent Notes 体系提炼的，是本规范后续条款的依据：

1. **契约优先、权威单源**。SKILL.md 是执行件，不复制规则全文；指向 owning 文档并说明"读它回答什么"。例外：在本技能执行点上必须当场成立的契约（写权限、门禁触发条件）允许局部重复，并链接权威处。——来自 `dsh-code-review` / `dsh-doc-standards` 的 "Sources of truth (read, don't re-summarize)"。
2. **弱流程、强约束的姿态要显式写出**。每个技能正文开头声明"约束什么、不规定每一步"，与 [自适应导师系统](./adaptive-mentorship-system.md) 的控制原则一致。——来自 dsh 的 "This skill is guidance, not a checklist/script"。
3. **入口可判定，缺输入即停**。没有当前契约、没有指定项目、没有可用 Artifact 时，报告缺什么并停止，不推断、不脑补、不用访谈替代执行前提。允许的例外是流程本身包含的用户确认步骤（初始化阶段的契约访谈、工作区升级确认）。——来自 `dsh-prose-standard` 的 scope 契约。
4. **先分诊，后执行**。每个技能必须有分类表，先判定当前请求属于哪类，再走对应路径。——来自 `dsh-doc-site-sync` 的 Classify the change。
5. **门禁必须落到字段与清单**。每个门禁必答问题都要有一个模板字段、一条检查项承接；不允许只靠"导师记得"。——来自 Agent Notes 的 header block + `verify-agent-note-format` 思想。
6. **写时治理，不延后审计**。任何准备改变长期状态的动作，必须在同一动作内检查并处理受影响的旧记录。——来自 `.agents/notes/AGENTS.md` 的第一条规则。

## 4. Frontmatter 与触发契约

机制事实（见工程化设计 §2.5，已核实）：`name` 必须 kebab-case 且与目录名一致；`description` 必填；可选 `whenToUse`、`disable-model-invocation`、`user-invocable`、`metadata`。`metadata.version` 用于预设升级与工作区覆盖副本的 diff 比对。

description 是唯一始终在场的触发契约，按以下规则写：

- 同时覆盖三件事：**何时用**（触发场景与请求动词）、**做什么**（一句结果）、**何时不用 / 何时需要用户显式确认**。
- 对抗触发不足（undertriggering）：宁可具体列举场景（"设计一个新服务"、"复盘一次迁移"、"研究一个陌生代码库"），也不要只写抽象定义。
- 描述行为而非知识主题，与"Skill 按认知动作拆分"一致。
- ASCII 书写；`Use when ...` 开头（dsh 惯例），允许逗号分句枚举触发条件。

触发职责示意（最终文本待定，但边界按此执行）：

| Skill | 默认可被模型选择 | 需要用户复核 / 确认的路径 |
| --- | --- | --- |
| mentor-workspace-init | 仅当 `.mentor/workspace.yml` 缺失或版本落后 | 升级写入工作区文件前（用户确认） |
| architecture-investigation | 是 | 无 |
| architecture-challenge | 是 | 无 |
| architecture-retrospective | 是 | 无 |
| learner-model-calibration | 日常记忆维护可自动 | 通过 Evidence 门禁写入长期记录、提升 Capability State（用户复核） |
| mentoring-contract-management | 仅展示 / 比较契约时可自动 | 应用任何契约修改（用户明确确认） |

装载边界要写进正文第一条（参考 `dsh-translate-docs` 的 Invocation boundary）：即使 frontmatter 未设置 `disable-model-invocation`，需要用户确认的路径也必须在正文声明"未经确认不执行"。

## 5. 正文骨架

每个 SKILL.md 使用以下固定骨架，顺序不强制，但节名语义固定：

```text
# <技能标题：动词开头，说明认知动作>

## 身份与姿态
## 权威来源
## 入口契约与分诊
## 执行动作与质量标准
## 禁止项
## 门禁与候选提交        （状态类技能必填；策略类技能改为"候选产出"）
## 校准示例              （记忆类技能必填；其他按需）
## 检查清单
## 报告契约
```

篇幅纪律：正文目标 ≤ 200 行；超出的示例、检索探针、模板全文移入 `references/`，并在正文写明何时读取。渐进式披露沿用工程化设计 §6 的 L0–L3 分工：常驻原则在 AGENTS.md（L1），执行细节在 SKILL.md（L2），模板全文在工作区记录模板（L3）。

## 6. 各块的写作规则

### 6.1 身份与姿态

- 第一句：本技能完成什么认知工作、产出什么。
- 第二句：本技能**不**做什么（不决定长期方向、不自行提升能力状态……），与职责设计一致。
- 姿态句：说明本技能约束哪些质量与写权限，而不规定每一步教学动作。例如："本技能约束一次调查的证据质量与记录边界，不规定必须先看哪个目录。"

### 6.2 权威来源

- 逐条列出 owning 文档，每条写"读它回答什么问题"（例：`memory-model.md` —— 判断哪些信息算 Memory、五类记录各回答什么问题）。
- 执行前读当前版本，不凭记忆。
- 不重总结权威内容。局部必须成立的契约（总原则 1 的例外）可以重复，但必须指向权威位置。

### 6.3 入口契约与分诊

- 列必需输入（当前契约、active-context、目标项目、原始 Artifact 等）。
- 缺什么就报告缺什么并停止；禁止推断缺失输入、禁止为绕过门禁而补造上下文。
- 分诊表：2–4 行分类，每行 = 判定特征 → 执行路径。例如 Memory Curation 的写入三分诊（§8.3）。

### 6.4 执行动作与质量标准

- 每个动作写：做什么 + 怎样算合格（可观察判据，而不是"认真做"）。
- 宁可少量高质量动作，不堆步骤；与 dsh 的 "a short review with one substantiated blocker is better than a list of nits" 同构。
- 需要工具或检索时，给出可执行的具体做法（grep 模式、读取路径、先读谁）。

### 6.5 禁止项

- 格式：`禁止 X。` + 一句为什么（失败模式）+ 违反的可见后果。
- 必须与 [Skill 职责设计](./skill-responsibility-design.md) 的"禁止直接做的事"一致；不新增越权条款。
- 禁止项面向行为，不面向态度。例如："禁止把现有实现直接解释为正确架构——实现可能来自历史偶然；违规产物是'看似合理的架构总结'。"

### 6.6 门禁与候选提交

- 策略类技能：只产出 Artifact、Experience 与候选记录，明确写"提交候选 ≠ 长期生效"。
- 状态类技能：写清本技能执行哪类门禁；门禁问题以模板字段与检查清单承载（§7），不复制问题全文。
- 凡属三类门禁的动作，必须引用对应检查清单并逐项执行。

### 6.7 校准示例

- 示例校准**判据**，不演示流程。
- 正例 / 反例 / 边界案例成对出现；可以带规模数字以证明"长度、数量不是判据"（来自 `dsh-archive-agent-notes` 的词数示例）。
- 示例放 `references/examples.md` 时，正文保留一两个最典型者。

### 6.8 检查清单

- 每条是一个可判定 true/false 的检查项，指向模板字段或门禁问题。
- 判断类条目单列（"用判断回答"），不能伪装成机械检查。
- 执行结束前逐项执行；未满足项必须报告，不得为了收尾勾选。

### 6.9 报告契约

- 规定报告什么：产出物、分类结果、实际执行的检查项、未满足项与原因。
- 明确"不得声称什么"：例如不得声称能力提升（未过门禁二）、不得声称已归档（未完成冻结步骤）。

## 7. 门禁的零脚本承载

### 7.1 机制

```text
门禁必答问题
    ↓ 一一映射
记录模板 frontmatter 必填字段（缺字段 = 门禁不通过）
    ↓ 执行界面
技能内检查清单（逐项核对字段与判断）
    ↓ 审计
git 提交历史（谁、何时、改了什么；旧记录不静默改写）
```

校验顺序与 [DSH 工程化设计](./dsh-engineering-design.md) §8 一致：门禁一、二由导师自检（检查清单）后交用户复核；门禁三必须获得用户明确确认。独立 Validator 后置。

### 7.2 字段映射（已定稿，见《v1 实现决策》§3）

| 门禁 | 记录类型 | 候选必填字段 |
| --- | --- | --- |
| 一：写入长期 Evidence | evidence | `experience_ref`、`artifact_ref`、`observed_behavior`、`context`、`assistance_level`、`supports_or_contradicts`、`counterevidence`、`future_decision_value`、`re_evaluable_source` |
| 二：提升 Capability State | capability | `capability_dimension`、`evidence_refs`、`stage`、`strength`、`assistance`、`calibration`、`time_stability`、`unresolved_counterevidence`、`unproven_scope`、`supersedes` |
| 三：修改 Mentoring Contract | contract 版本 | `proposed_by`、`reason`、`old_version_ref`、`user_confirmation`、`effective_at`、`supersedes`、`teaching_impact` |

字段名与取值在记录模板中定义；技能只引用字段，不重新定义。

### 7.3 检查清单形态示例（Evidence 门禁，非最终文本）

```text
□ experience_ref 指向存在的 Experience
□ artifact_ref 指向原始产出（非导师总结）
□ observed_behavior 描述行为，不是人格评价
□ context 写明业务/技术/组织上下文
□ assistance_level 写明提示程度
□ supports_or_contradicts 写明支持/反驳的对象
□ counterevidence 已检查并记录
□ future_decision_value 说明为何影响未来教学
□ re_evaluable_source 未来可重新评估
□ 已确认本记录只表示"这一次"，不声称掌握
```

### 7.4 冻结语义（借自 dsh，不改变目录结论）

- 归档 = 在记录内写入 `lifecycle: archived`、`archived_at`、`frozen: true`；**正文不得改写**。允许的修改仅限冻结元数据与引用修复。
- 重新评估旧结论时：开新记录，用 `supersedes` 显式指向旧记录；不修改旧记录正文。
- 归档动作的检查清单必须包含："只增加了冻结元数据，未改正文；引用已修复或标注为历史引用"。
- dsh 的 hash 密封在 v1 以 git 提交历史代替；不引入脚本。

## 8. 记忆类技能专项规则

适用于 `learner-model-calibration`（含 Memory Curation 职责）。这是"参考 dsh 设计记忆相关 skill"的核心部分。

### 8.1 双职责边界

同一 Skill 内两条职责分区写明，写权限不同（照 [Skill 职责设计](./skill-responsibility-design.md) 的写权限表）：

- **Memory Curation 职责**：决定记录准入、生命周期、替代关系与派生视图。可以决定一条记录是否合格 Evidence，**不能**据此提升 Capability State。
- **Learner Model Calibration 职责**：用长期 Evidence 更新 Hypothesis 与 Capability State，执行能力提升门禁。**不能**创造 Evidence。

### 8.2 写时治理（最高优先级规则）

任何新候选记录或新结论写入前，先做一次 scoped supersession 审计：检索同主题的 Experience / Evidence / Hypothesis / Capability State / Insight，并当场处理：

- **完全被替代**：新记录成为权威。解释类记录（Hypothesis、Capability State、Insight）按类型进入 `superseded` 并交叉引用；事实类记录（Experience、Evidence）保持不可变，需要时归档而不是删除（与 [记忆生命周期](./memory-lifecycle.md) 的更新语义一致）。
- **部分被替代**：保留旧记录仍成立的部分，双向交叉引用。
- **无冲突**：不制造替代关系，进入下一判断。

禁止把 supersession 审计延后到"以后统一整理"——这是 dsh Agent Notes 体系的第一条规则。

### 8.3 写入三分诊（默认少写）

| 分类 | 判定 | 处理 |
| --- | --- | --- |
| 不进入长期记忆 | 对未来教学决策没有可预见影响 | 留在 Raw History，不生成记录 |
| 只写 Experience | 发生了值得追溯的事实，但还没有可观察的学习表现 | 写 Experience，不碰 Evidence |
| 走 Evidence 门禁 | 有学习者行为、原始产出，可能改变教学起点 / 诊断 / 挑战 | 按 §7.2 字段与检查清单执行门禁一 |

### 8.4 类型敏感的更新语义

从 [记忆生命周期](./memory-lifecycle.md) 转成可执行规则：

| 记录类型 | 发现错误 / 冲突时 |
| --- | --- |
| Experience / Evidence | 不改写原文；追加更正记录并交叉引用（事实近似不可变） |
| Hypothesis | 可 `challenged`、`superseded`，替代必须指向新记录 |
| Capability State | 新状态显式 `supersedes` 旧状态，保留轨迹 |
| Architecture Insight | 可质疑、细化、替代；不静默改适用边界 |

### 8.5 检索探针（零脚本）

维护 / 审计时先跑候选 grep 模式，再**无模式通读**该主题下最密集的记录——探针会漏，关键词不是定义（来自 `dsh-trim-cot-leakage` 的 recall-batteries 纪律）：

```text
lifecycle: candidate|challenged     # 待验证 / 冲突记录
supersedes:                          # 替代链是否完整
superseded_by:                       # 是否双向交叉引用
lifecycle: active 且无 evidence_ref  # 缺少证据链的活跃解释
```

### 8.6 校准示例与报告

- 校准示例必填，至少三组：**keep**（未来决策价值明确）、**archive**（已完成使命 / 低价值）、**delete**（噪声或无依据派生）。示例带记录规模，说明规模不是判据。
- 报告契约：报告 keep / archive / delete / 边界案例及其判据；**不得声称能力状态发生变化**（那是 Calibration 门禁的事）。

## 9. 技能间引用与组合边界

- 技能间使用相对链接引用（DSH 技能目录为资源根），引用另一技能的章节而非复述其规则。
- 每个技能写明"谁拥有哪项判断"：
  - 顶层 Mentor 拥有：当前优先级、策略选择、是否只做临时探索；
  - 策略技能拥有：一次认知工作的执行质量与候选产出；
  - Memory Curation 拥有：记录准入与生命周期；
  - Calibration 拥有：能力状态更新；
  - Contract Management 拥有：契约应用。
- 组合不是固定流程：只在需要时装载另一技能，不以"流程完整"为由连调（同 [Skill 职责设计](./skill-responsibility-design.md) §Skill 组合不是固定流程）。

## 10. 规范自身的执行与演进

- 每个 SKILL.md 落地前用 §11 自审清单检查；工作区覆盖副本同样适用本规范。
- owning 设计文档变化时，对应技能的"权威来源"节必须同步更新，防止文档与技能漂移。
- 边界案例升级：当两种做法都满足规范、且规范未裁决时，把裁决结果写回本规范的校准示例或对应条款，不口头解决。
- 本规范只承诺"怎样写"，不承诺"这样写就足够好"——规范生效后仍需通过真实学习任务验证（与 README 的开放项口径一致）。

## 11. 自审清单（编写 / 审查 SKILL.md 时使用）

```text
□ frontmatter name 与目录一致，kebab-case
□ description 覆盖何时用 / 做什么 / 何时不用或需用户确认
□ 正文有姿态声明（弱流程 + 强约束）
□ 权威来源逐条指向 owning 文档，未复制规则全文
□ 入口契约列出必需输入，缺输入即停
□ 分诊表先于执行动作
□ 执行动作每条都有可观察的合格判据
□ 禁止项与职责设计的禁止项一致，无新增越权
□ 状态类技能的门禁以模板字段 + 检查清单承载
□ 记忆类技能有写时治理、三分诊、类型敏感更新、校准示例
□ 检查清单可逐项判定，判断项未伪装成机械项
□ 报告契约写明报告什么、不得声称什么
□ 正文 ≤ 200 行，超出部分移入 references/
```

## 12. 参考依据

观察样本：`projects/dsh/.agents/skills/` 下全部 11 个 SKILL.md（重点：`dsh-archive-agent-notes`、`dsh-code-review`、`dsh-doc-site-sync`、`dsh-prose-standard`、`dsh-trim-cot-leakage`、`dsh-translate-docs`、`dsh-pre-push-checks`）与 `projects/dsh/.agents/notes/`（README.md、archived/AGENTS.md）。借鉴手法清单与来源见 §3 总原则。

## 13. 尚未决定

- SKILL.md 正文语言与语体（中文叙述 / 保留 dsh 式高密度英文指令语体 / 双语）。
- 六个技能的最终 description 文本与触发矩阵定稿。
- 校准示例、检索探针的具体内容与存放位置。
- 检查清单的粒度：按门禁一条一组，还是按动作拆开。
