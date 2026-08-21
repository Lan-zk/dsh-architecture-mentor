# 架构导师 v1 落地开发计划

> 状态：confirmed（已确认）。确认日期：2026-08-21。
> 本次执行范围：M0–M4。M5 试点验证与 M6 发布准备已由用户明确延后，不在本次执行范围内。

## 1. 计划定位

本计划把 `docs/architecture-mentor/` 中的设计基线转换为可执行的工程交付步骤，目标是把本仓库落地为**一条命令可安装的 DSH 开源预设 `architecture-mentor`**：

- 安装器把 `preset/` 复制到用户预设根 `$DSH_HOME/.agent-presets/architecture-mentor/`；
- 首次对话通过 `mentor-workspace-init` 建立学习工作区（导师人格 = 工作区根 `AGENTS.md`；长期状态 = `contract/ history/ memory/ mentoring/ views/`）；
- v1 交付 5 个策略/状态技能 + 1 个引导技能（共 6 个 `SKILL.md`）；
- 三类长期状态门禁以"记录模板必填字段 + 技能内检查清单 + git 审计链"零脚本承载。

本计划是**工程交付计划**，不是运行时教学流程。产品的"弱流程 + 强约束"只体现在模板与技能中；本计划的里程碑、验收标准只约束交付质量，不进入运行时。

## 2. 依据文档

| 文档 | 在本计划中的作用 |
| --- | --- |
| `docs/architecture-mentor/vision-and-scope.md` | 判断范围与非目标 |
| `docs/architecture-mentor/adaptive-mentorship-system.md` | 运行时控制原则（弱流程 + 强约束） |
| `docs/architecture-mentor/mentoring-contract.md` | 契约语义与门禁三内容 |
| `docs/architecture-mentor/state-change-gates.md` | 三类门禁的必答问题 |
| `docs/architecture-mentor/learning-guardrails.md` | 教学行为质量边界 |
| `docs/architecture-mentor/capability-evidence-model.md` | 能力阶梯与证据强度 |
| `docs/architecture-mentor/memory-model.md` | 五类记忆与八条不变量 |
| `docs/architecture-mentor/memory-lifecycle.md` | 生命周期、活跃工作集与更新语义 |
| `docs/architecture-mentor/agent-skill-workspace.md` | 三层职责与依赖方向 |
| `docs/architecture-mentor/workspace-directory-design.md` | 工作区逻辑目录与写入/读取边界 |
| `docs/architecture-mentor/skill-responsibility-design.md` | 技能职责边界与状态写权限 |
| `docs/architecture-mentor/skill-authoring-standard.md` | `SKILL.md` 编写规范与自审清单 |
| `docs/architecture-mentor/dsh-engineering-design.md` | 安装、预设组合、初始化与门禁机械落地 |
| `docs/AI时代软件架构师的深度研究.md` | 能力维度种子清单的背景依据 |

参考样本：`projects/dsh/.agents/notes/`（README.md、AGENTS.md）与 `projects/dsh/.agents/skills/` 下的 dsh 技能。v1 只借设计手法，不搬环境绑定实现（pnpm/CI 校验、三语 triplet、路径编码生命周期均不进入 v1）。

## 3. 已确认决策（D1–D11）

以下决策已由用户确认（2026-08-21），作为后续实施的稳定输入。变更需重新确认（见 §9）。

| # | 决策项 | 确认内容 | 依据 |
| --- | --- | --- | --- |
| D1 | 物理技能集 | 6 个 `SKILL.md`：`mentor-workspace-init` + `architecture-investigation`、`architecture-challenge`、`architecture-retrospective`、`learner-model-calibration`（含 Memory Curation 职责）、`mentoring-contract-management`。`transfer-assessment` 后置到 v2 | 工程化设计 §7.2、编写规范 §1 |
| D2 | 门禁执行方式 | 门禁一、二：导师自检（检查清单）+ 用户复核；门禁三：必须用户明确确认；git 提交历史为审计链。独立 Validator 后置（依赖 delegation） | 工程化设计 §8 |
| D3 | 记录存储 | Markdown + YAML frontmatter；每记录一文件，命名 `YYYY-MM-DD-slug.md`；引用一律用相对路径 | 工程化设计 §9、Workspace 目录设计 |
| D4 | `contract/current.md` | 存完整契约 + frontmatter 版本字段；指针方案后置 | Workspace 目录设计 |
| D5 | 技能语言 | frontmatter/`name`/`description` 全 ASCII，`description` 用 `Use when ...` 开头（英文）；正文中文 | 编写规范 §4 |
| D6 | Active Context 预算 | 试点参数：`active-context.md` ≤ 8 KB；排序 = 决策价值 × 证据质量 × 误用风险；M5 试点时用真实数据校准后回写文档 | 记忆生命周期开放项 |
| D7 | 能力维度 | 用深度研究文档 2026–2030 优先级表中 ★★★★★ 条目做种子清单；维度按实际 Evidence 按需创建；不发布完整能力地图 | 定位与目标、深度研究 |
| D8 | `git init` | 工作区初始化时提示并引导，经用户确认后执行；不静默 init | 工程化设计 §5.4 |
| D9 | 版本策略 | 预设 `VERSION = 0.1.0-rc.1`；技能 `metadata.version`；升级 = 预设升级；工作区覆盖副本不随预设自动升级 | 工程化设计 §4、§7.2 |
| D10 | 发布渠道 | 延后决定。M6 试点通过后再定（GitHub Release 优先候选，npm registry 后置） | 工程化设计 §9 |
| D11 | 人格同源 | persona 与 AGENTS.md 模板由同一源 + 构建期 Node 脚本生成；产物入库、禁止手改（防漂移） | 工程化设计 §5.3、§6 |

## 4. 范围边界

### 4.1 本次执行范围（M0–M4）

- 决策收敛与文档基线校正；
- 仓库骨架、Node 安装器与预设组合文件；
- 工作区模板（含记录模板 = 三类门禁的载体）；
- 6 个 `SKILL.md`（按编写规范 §11 自审清单验收）；
- L0 persona 与 L1 AGENTS.md 的同源生成与预算控制。

### 4.2 明确延后（不在本次执行）

| 延后项 | 重新激活条件 |
| --- | --- |
| M5 端到端试点验证 | 用户明确发起；具备一个真实项目与真实学习者记录 |
| M6 发布准备与发布 | 试点通过；用户明确发起 |
| `transfer-assessment` 技能 | 先确定独立评估者机制（v2） |
| 独立 Validator / delegation 复核 | 宿主 delegation 能力启用后再评估 |
| 完整架构能力地图与机械升级阈值 | 积累真实 Evidence 后，以设计原则为约束继续收敛 |
| 学习/交付/混合模式切换协议 | 契约字段在实际使用中出现该需求后设计 |
| 双语技能与技能翻译 | 中文 v1 稳定后按需决定 |

### 4.3 非目标（始终不因开发节奏改变）

- 不建课程、不做知识章节型 Skill；
- 不让 AI 读代码后直接产出"看似合理的架构总结"；
- 不追求记录数量、完成率或概念覆盖率；
- 不把门禁做成每次对话的固定流程；
- 不用脚本实现门禁（v1 门禁零脚本）。

## 5. 里程碑

执行顺序：M0 → M1 → M2 → M3 → M4。M2 完成后设一次人工检查点（记录模板是语义核心，先验收再写技能）。

### M0 — 决策收敛与仓库基线（0.5–1 人日）

**任务**

- [x] 新建 `docs/architecture-mentor/v1-implementation-decisions.md`，记录 §3 的 D1–D11 及依据；本计划文档作为其配套执行文件。
- [x] 校正 `docs/architecture-mentor/README.md` 的开放项清单：已被后续文档关闭的项（如"存储介质 = Markdown + YAML frontmatter"）移入设计基线；仍开放项逐条标注"已决定 / 延后（原因）/ 试点验证中"。
- [x] 对仓库根执行 `git init` 并首次提交（当前仓库不是 git 仓库；审计链与"禁止静默重写"依赖 git）。
- [x] 明确 `projects/` 下外部源码副本不进 git 管理的边界（遵循 `projects/README.md` 既有约定）。

**交付物**

1. `docs/architecture-mentor/v1-implementation-decisions.md`
2. 校正后的 `docs/architecture-mentor/README.md`
3. 仓库根 git 历史与首次提交

**验收标准**

- README 中每条"尚未确认"都有明确归宿：已决定 / 显式延后（含原因）/ 试点验证中；
- 决策文档中每条决策都能回溯到 owning 文档；
- 仓库有 git 历史，且 `projects/` 边界按约定处理。

### M1 — 仓库骨架 + 安装器 + 预设组合（1–1.5 人日）

**任务**

- [x] 按工程化设计 §3 建目录：`scripts/install.mjs`、`preset/agent.cordis.yml`、`preset/preset.yml`、`preset/VERSION`、`preset/skills/`、`preset/templates/`。
- [x] `package.json`：`bin` → `scripts/install.mjs`；纯 Node ESM、零构建、无运行时依赖。
- [x] 安装器契约（工程化设计 §4）：
  - 解析 `DSH_HOME ?? ~/.dsh` → 目标 `$DSH_HOME/.agent-presets/architecture-mentor/`；
  - `VERSION` 比较实现幂等 / 升级；覆盖前备份；
  - 目标已存在但无本仓库 `VERSION` 时拒绝并提示（预设 id 冲突防护）；
  - 绝不触碰 shipped 预设目录（代码路径上不存在任何写 shipped 的分支）。
- [x] `agent.cordis.yml` 按 §7.1 从 `standard` 拷贝裁剪：保留 persona、agent-instructions、tool-fs、tool-fs-search、tool-pwsh（Windows）/ tool-bash（其余）、skill-filesystem（`customSkillDirs` → 预设 `skills/`，使用 `baseUrl` 的 `!!js` 表达式）、tool-skill、tool-ask-user、tool-todo、tool-goal、plan-mode、compaction；delegation / tool-jobs / tool-web 默认关闭。
- [x] `preset.yml`：`name: 架构导师`、`description`（只影响展示）。
- [x] 最小冒烟测试 `scripts/smoke-install.mjs`（或等价 `node --test`）：临时 `DSH_HOME` 下验证复制、幂等、升级备份、冲突拒绝四路径。说明：这是安装器自身的构建期测试，不是门禁脚本，不违反"门禁零脚本"。

**交付物**

1. 可执行的 `scripts/install.mjs` 与 `package.json`
2. `preset/agent.cordis.yml`、`preset/preset.yml`、`preset/VERSION`
3. 安装器冒烟测试与运行说明

**验收标准**

- 安装 → 重复安装（no-op）→ 升级（备份 + 替换）→ 冲突拒绝，四路径全部通过；
- 临时 `DSH_HOME` 下预设目录结构与 `preset/` 一致；
- 真实 DSH 中 `agentPresets.list()` 可发现 `architecture-mentor`，`standingKeyFor` 挂载无冲突（当前机器 `C:\Users\lzk\.dsh` 可直接验证）；
- 安装器逻辑约百行量级，无 TS 依赖，无写 shipped 路径。

### M2 — 工作区模板与门禁载体（2.5–3 人日）★ 语义核心

**任务**

- [ ] `preset/templates/workspace/` 按 Workspace 目录设计生成：
  - `contract/current.md` + `contract/history/`；
  - `history/{sessions,projects,artifacts,sources}`；
  - `memory/{experiences,evidence,learner-model/{hypotheses,capabilities},insights}`；
  - `mentoring/interventions/`；
  - `views/{active-context,challenged,archived,indexes}`；
  - `.agents/skills/README.md`（用户覆盖层说明，占位）；
  - `.gitignore`（含 `AGENTS.local.md`）。
- [ ] 每个目录自带 README（≤ 约 10 行）：职责、主要写入者、记录命名与模板约定、生命周期要点、"什么不该放这里"；README 是导航说明，权威规则留在 AGENTS.md 与技能。
- [ ] 记录模板 = 门禁载体（编写规范 §7.2 字段定稿）：
  - `evidence`：`experience_ref`、`artifact_ref`、`observed_behavior`、`context`、`assistance_level`、`supports_or_contradicts`、`counterevidence`、`future_decision_value`、`re_evaluable_source` 必填，1:1 承接门禁一；
  - `capability`：`capability_dimension`、`evidence_refs`、`stage`、`strength`、`assistance`、`calibration`、`unresolved_counterevidence`、`unproven_scope`、`supersedes` 必填，1:1 承接门禁二；
  - `contract` 版本：`proposed_by`、`reason`、`old_version_ref`、`user_confirmation`、`effective_at`、`supersedes`、`teaching_impact` 必填，1:1 承接门禁三；
  - 补充 `experience`、`hypothesis`、`insight`、`intervention` 模板；
  - 统一 lifecycle 字段（`candidate/active/challenged/superseded/archived`）与冻结字段（`frozen: true`、`archived_at`）。
- [ ] 模板 README 中放"门禁必答问题 ↔ 必填字段 ↔ 检查清单"映射表（机械可查的追踪表）。
- [ ] `.mentor/workspace.yml` 标记模板约定：`schemaVersion`、`templateVersion`、`initializedAt`，断点续跑语义（每完成一步即落盘）。
- [ ] 约束落实：Experience/Evidence 模板不设"解释/结论"字段（事实不可变）；解释类记录（Hypothesis/Capability State/Insight）全部带 `supersedes`/`superseded_by` 引用位。

**交付物**

1. 完整工作区模板树（含各目录 README 与 `.gitignore`）
2. 五类记忆 + 契约 + 干预记录模板（frontmatter + 骨架）
3. 门禁映射追踪表
4. `.mentor/workspace.yml` 模板

**验收标准**

- 门禁一、二、三的每个必答问题都能在模板中找到唯一承载字段，无遗漏、无"靠记忆"项；
- 事实类与解释类模板的字段边界符合记忆模型；
- 初始化一次即可得到完整目录 + 全部模板；
- 模板全文不进入 AGENTS.md（L1 只放指针）；
- 生命周期由字段表达，不靠移动文件表达。

### M3 — 六个 SKILL.md 编写（3–4 人日）

**任务**（每个技能严格按编写规范 §5 骨架，正文目标 ≤ 200 行，超出的示例/探针/模板全文移入 `references/`）

- [ ] `mentor-workspace-init`：判定（标记缺失 / 版本落后 / 当前）→ 目录骨架 → 契约访谈（八类语义）→ 写入 AGENTS.md → 生成 `views/active-context.md` 骨架；**写工作区文件前需用户确认**；永不复制技能；每步落盘断点标记。
- [ ] `architecture-investigation`：强制 Observation / Inference / Evidence / Principle 四层分离；产出 Experience、来源索引、候选 Insight；禁止把现有实现当正确架构；有学习者行为时才提交候选 Evidence。
- [ ] `architecture-challenge`：分诊挑战方式（评审/对比/反事实/苏格拉底式等）；保存作答前原题、提示程度、学习者 Artifact 与反馈；只提交候选 Evidence，禁止越过门禁。
- [ ] `architecture-retrospective`：连接"当时知道什么 → 判断 → 预测 → 结果 → 心智模型修正"；归因检查（不把项目成败全归因于架构判断）；产出 Experience、候选 Evidence、候选 Insight。
- [ ] `learner-model-calibration`（双职责分区，§8.1）：
  - Memory Curation：记录准入、生命周期、替代关系、派生视图；可决定合格 Evidence，**不可**提升 Capability State；
  - Learner Model Calibration：用 Evidence 更新 Hypothesis 与 Capability State，执行门禁二；**不可**创造 Evidence；
  - 含写时治理（§8.2 scoped supersession 审计）、写入三分诊（§8.3）、类型敏感更新（§8.4）、检索探针（§8.5）、keep/archive/delete 三组带规模的校准示例（§8.6）、报告契约（不得声称能力状态变化）。
- [ ] `mentoring-contract-management`：展示 / 比较 / 提案 / 应用契约变更；**应用变更必须用户明确确认**；保存当前版本、生效时间与历史替代关系。
- [ ] 每个技能 frontmatter：`name`（kebab-case，与目录一致）、英文 `description` 覆盖"何时用 / 做什么 / 何时不用或需用户确认"、`metadata.version`；需确认路径在正文第一条声明"未经确认不执行"。
- [ ] 技能间用相对链接引用，不复述规则全文；写明"谁拥有哪项判断"（§9）。

**交付物**

1. `preset/skills/` 下 6 个技能目录包（SKILL.md + 必要的 references/）
2. 编写规范 §11 自审记录（逐技能、逐项可勾选留档）

**验收标准**

- 6 个技能全部通过 §11 自审清单；
- 每个策略技能写明"提交候选 ≠ 长期生效"；每个状态技能的门禁以模板字段 + 检查清单承载；
- 抽查无越权：Challenge 不能写 Capability State，Calibration 不能创造 Evidence，Contract Management 不评估能力；
- frontmatter `name` 与目录名一致且合法；正文行数在纪律内（超出部分在 references/）。

### M4 — 导师身份三层与同源生成（1 人日）

**任务**

- [ ] 建立单一身份源文件，由 `scripts/generate-identity.mjs`（构建期）生成两份产物：
  - persona 节（L0，2–4 KB）：精简导师身份 + bootstrap 指引（首会话工作区 AGENTS.md 尚不存在时的兜底）；
  - `templates/AGENTS.md`（L1，目标 ≤ 16 KB，上限 64 KB）：导师人格、原则、八条不变量、三类门禁摘要、技能触发索引（一行一技能）、记录模板指针、契约与 active-context 指针。
- [ ] 生成脚本确定性输出；产物入库；从此禁手改产物（M4 起所有改动改源文件）。
- [ ] AGENTS.md 内容纪律（§6）：不放技能执行细节、不放模板全文、不放具体学习记录；写明"不覆盖系统/开发者/直接用户指令"与"门禁由模板必填字段 + 检查流程承载，不靠本文件陈述"。

**交付物**

1. 身份源文件 + `scripts/generate-identity.mjs`
2. 生成的 persona 节与 `templates/AGENTS.md`

**验收标准**

- 脚本两次运行 diff 为空（确定性）；
- persona 与 AGENTS.md 无不一致陈述；
- AGENTS.md ≤ 16 KB；抽查"不放"清单全部成立；
- bootstrap 兜底与初始化完成后的权威切换声明齐备。

## 6. 延后里程碑（不在本次执行，保留触发条件）

### M5 — 真实运行时端到端试点（延后）

触发条件：用户明确发起；具备一个真实项目与真实学习者记录。

要点（届时执行）：

- 全新安装 → roster 出现"架构导师" → 新会话工具清单含 `skill`/文件/`pwsh` → 技能目录出现全部 6 技能；
- 全新工作区初始化、重入幂等、`templateVersion` 升级确认流；
- 三条最小教学回路：纯探索（不触发门禁）、挑战→候选 Evidence→门禁一→门禁二、契约修改→未确认拒绝→确认后应用；
- 验证"禁止静默重写"：新状态记录 `supersedes` 指向旧记录，旧记录原样保留；
- 验收矩阵：6 条学习护栏各 1 个可观察行为；8 条记忆不变量各 1 组正/反证据；三类门禁各成功执行 1 次 + 各被正确拒绝 1 次；纯探索会话零长期记录写入；
- 输出试点报告：触发不足/过度、字段摩擦、Active Context 预算实测、遮蔽与升级风险；
- 试点数据回写 D6（Active Context 预算）等试点参数。

### M6 — 发布准备（延后）

触发条件：M5 通过；用户明确发起。

要点（届时执行）：

- 产品优先的根 README：一条命令安装、信任声明、快速开始、Known limitations；
- LICENSE、升级/覆盖/回滚 runbook；
- 复核工程化设计 §10 风险清单并逐条关闭或转 Known limitations；
- 决定发布渠道（D10：GitHub Release 优先候选，npm registry 后置）。

## 7. 交付物 ↔ 设计文档追踪矩阵

| 交付物 | 主要依据 | 关键约束 |
| --- | --- | --- |
| 决策文档与 README 校正（M0） | README"以对话后期的修正为准"、编写规范 §10 | 开放项不静默消失 |
| 安装器（M1） | 工程化设计 §4 | 只写用户预设根、备份、拒绝冲突、绝不碰 shipped |
| `agent.cordis.yml`（M1） | 工程化设计 §7.1 | 最小工具面；delegation/web 默认关 |
| 工作区模板（M2） | Workspace 目录设计 | 生命周期是字段不是目录；视图可再生成 |
| 记录/契约模板（M2） | 状态变更门禁、编写规范 §7 | 门禁问题 1:1 映射必填字段 |
| 6 个 SKILL.md（M3） | Skill 职责设计、编写规范 | 职责边界、写权限表、§11 自审清单 |
| 初始化流程（M3） | 工程化设计 §5 | 独立 git 根、断点续跑、不复制技能、用户确认 |
| persona/AGENTS.md（M4） | 工程化设计 §6 | ≤ 2–4 KB / ≤ 16 KB；同源生成；L1 只放常驻内容 |

## 8. 质量与验收机制

- 每个里程碑以"验收标准"为 DoD（Definition of Done），不满足不进入下一里程碑；
- M2 完成后设人工检查点：逐条核对门禁映射追踪表，再开始 M3；
- 6 个技能在 M3 由执行者按编写规范 §11 自审并留档，**门禁相关与写权限相关内容需人工复核**（借用 dsh `human-review-skill-maintenance` 的原则，不搬其实现）；
- v1 门禁零脚本：运行时门禁只由模板必填字段 + 检查清单 + git 审计承载；本仓库允许的脚本仅限安装器、身份生成器与构建期冒烟测试；
- 试点与发布延期不影响 M0–M4 的交付质量要求：所有验收标准在无试点情况下仍须满足。

## 9. 风险与缓解

| 风险 | 影响 | 缓解（落在里程碑） |
| --- | --- | --- |
| DSH rc 升级改变发现语义 | 安装/技能失效 | M1 记录核实版本（0.1.0-rc.7）；实施中复核对 @deepseek-ai/dsh-* 的机制引用 |
| 工作区嵌在外层 git 仓库 | 技能不可见/污染外层 | M3 初始化流程强制检测；M5 试点时专门验证 |
| AGENTS.md 常驻膨胀 | 每会话 token 税、超预算截断 | M4 硬性 ≤ 16 KB + 抽查"不放"清单 |
| 门禁"导师自检"自我放行 | 证据质量下降 | 必填字段 + 用户复核 + git 审计；M5 试点验证拒绝路径 |
| 技能自审是执行者自评 | 规范不被真实执行 | M3 人工复核门禁与写权限内容；M5 用真实行为验收 |
| persona 与 AGENTS.md 漂移 | 首会话与后续行为不一致 | M4 同源生成 + 确定性 diff 检查 |
| 升级覆盖用户工作区修改 | 定制丢失 | 升级走 diff + 用户确认；覆盖副本永不自动升级 |
| 模板字段摩擦（试点前不可见） | 门禁执行不顺畅 | M2 以必答问题为唯一字段依据；试点时集中修正 |

## 10. 变更规则

- D1–D11 的变更：必须回到本文件修改并重新获得用户确认，不得在执行中静默改向；
- 任务级微调（不影响已确认决策、owning 文档语义与验收标准）：git 提交中说明原因即可；
- 任何实施与 owning 设计文档发生冲突时：先更新设计文档并记录依据，再改实施，禁止让代码与文档漂移（编写规范 §10）。

## 11. 执行进度

- M0 已完成（首次提交 `c22b942`）：决策文档、README 校正、`.gitignore`（projects 边界）、`git init -b main`。
- M1 已完成：仓库骨架、`install.mjs` + 冒烟测试（6 项全过）、`agent.cordis.yml`（自官方 `standard` 拷贝裁剪）、`preset.yml`、`VERSION = 0.1.0-rc.1`；真实 DSH 库 `discoverPresets` 验证 `broken: null`，已安装至用户预设根。
- 下一步：M2 —— 工作区模板与门禁载体（M2 完成后设人工检查点，再进入 M3）。
