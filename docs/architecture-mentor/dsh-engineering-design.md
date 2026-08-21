# DSH 工程化设计：安装、预设与工作区初始化

> 状态：implemented（v1 已按本文落地，实现见 `preset/` 与 `scripts/`；与实现不一致时以代码为准并同步本文）。
> 本文档中的运行时机制均以 DeepSeek Harness 0.1.0-rc.7 源码核实为准（出处标注到包与文件）；DSH 升级后需复核。

## 1. 目标与问题澄清

本仓库将作为开源项目发布：用户执行一条命令，把仓库中的 Agent 预设安装到自己的 DSH，之后在任一本地学习工作区开始使用。

运行时的三层分工，与 [《Agent、Skill 与 Workspace 的职责》](./agent-skill-workspace.md) 的职责模型一一对应：

| 角色 | 载体 | DSH 机制 |
| --- | --- | --- |
| 导师身份 | 工作区根目录 `AGENTS.md` | agent-instructions 基线自动注入 |
| 导师手脚（策略 / 状态 Skill） | 预设内置 `skills/<skill>/SKILL.md`（默认）+ 工作区 `.agents/skills/`（用户覆盖层） | skill-filesystem：`customSkillDirs`（rank 300）+ 项目技能根（rank 200，遮蔽预设） |
| 长期状态 | 工作区目录（contract/ history/ memory/ mentoring/ views/） | 普通文件 + git 审计 |

安装命令只做一件事：把预设目录放入 DSH 的用户预设根。**Skill 不全局安装**：策略与状态 Skill 全部内置在预设目录（仅该预设的会话可见，rank 300），随预设一起升级；工作区 `.agents/skills/` 只作为用户的覆盖/扩展层（rank 200，同名遮蔽预设内置版本）。初始化不再复制技能。

### 硬约束

1. 安装器只能写入 `$DSH_HOME/.agent-presets/`，绝不触碰随部署发布的 shipped 预设（升级会覆盖它们，损坏 `cordis` 预设会禁用预设编写能力）。
2. 初始化过程的所有写入都在会话工作区内完成。
3. 导师人格文件必须允许用户修改、git 跟踪；Skill 的定制通过工作区覆盖层进行（覆盖后的副本不随预设自动升级），不直接修改预设目录本身。

## 2. 已验证的 DSH 运行时机制（承重墙）

### 2.1 Agent 预设的发现与目录

- 出处：`@deepseek-ai/dsh-agent-presets`（`lib/index.js`、`lib/types/discovery.js`）。
- 预设 = 一个目录，目录名即预设 id；合法 id：`[a-z0-9][a-z0-9-]*`。
- 根配置：`roots: [{ path, trust: "system" | "user" }]`；插件在 `includeUserRoot`（默认开启）时固定追加用户预设根 `$DSH_HOME/.agent-presets/`（`USER_PRESET_DIR = ".agent-presets"`，trust `user`）。Windows 下即 `%USERPROFILE%\.dsh\.agent-presets\`。
- 发现不缓存（`list()`/`resolve()` 每次重读）：安装后**无需重启进程**即出现在预设名单。
- 目录内容：`agent.cordis.yml`（组合文件）+ 可选 `preset.yml`（`name`、`description`、可选 `order`；只影响展示，不写会在选择器里显示裸目录名）。
- 服务 API `agentPresets`：`list` / `read` / `copy` / `delete` / `standingKeyFor`。`copy()` 是"整目录复制进用户根"的官方写路径，但只在运行时内可用，**没有对应 CLI 命令**。

### 2.2 CLI 现状

- 出处：`@deepseek-ai/dsh/lib/bin.js`。
- `dsh` 只有 `web` 与 `plugin` 两个子命令。`plugin` 面向宿主平面的 npm 插件（转发 pnpm 到 profile 目录），与预设无关。
- 结论：**安装命令必须由本仓库自备**（见第 4 节）。

### 2.3 组合文件要点

- persona 行（`@deepseek-ai/dsh-persona`）：`text` 支持 `{{model}}`、`{{cwd}}` 模板变量；可选 `complete`、`includeRuntimeContext`。
- `baseUrl`：组合文件所在目录，可在 `!!js` 表达式中使用（cordis 预设的 skill-filesystem 行是官方示范）。
- 平面规则：注册表、沙箱、审批、持久化、模型路由属宿主平面；预设只提供工具、persona、提示节。发布服务的行必须置于 `isolate` realm——本预设的行全部是消费型/注册型，与 `standard` 同形；skill-filesystem 注册进预设层的宿主 skill 注册表，无需 realm。
- 开发纪律：从 `standard` 拷贝裁剪，不从头手写；发布前用 `standingKeyFor(id)` 做挂载校验（只能在真实运行时执行，仓库无法自带）。

### 2.4 AGENTS.md 自动注入

- 出处：`@deepseek-ai/dsh-agent-instructions`（`lib/index.js`）。
- 候选名：`AGENTS.md` / `CLAUDE.md` + 本地覆盖 `AGENTS.local.md` / `CLAUDE.local.md`。
- 发现顺序：用户全局 `~/.dsh/AGENTS.md` → 项目根（从 cwd 向上找第一个含 `.git` 的目录；找不到则以 cwd 为根）→ 根到 cwd 的每个目录（宽 → 窄）。
- 语义：更具体的指令优先；**不覆盖系统、开发者、直接用户指令**。
- 预算：`maxBytes`（预设行可配置，默认 65536）；超预算会被截断。
- 嵌套目录的 AGENTS.md 在该目录下文件被触碰后，以 "Additional instructions from:" 形式追加注入（本会话注入 `projects\dsh\.agents\notes\AGENTS.md` 即此机制）。
- 结论：导师人格放 `<workspace>/AGENTS.md`（工作区根，属基线注入），每次在该工作区开会话自动在场。这是"AGENTS.md 扮演导师身份"的机制基础。

### 2.5 Skill 发现与装载

- 出处：`@deepseek-ai/dsh-skill-filesystem`（`lib/index.js`）、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-tool-skill`。
- 技能根（rank 数字小者优先）：

  | 根 | rank |
  | --- | --- |
  | `<projectRoot>/.dsh/skills` | 100 |
  | `<projectRoot>/.agents/skills` | 200 ← 用户覆盖层 |
  | 预设 `customSkillDirs` | 300 |
  | `~/.dsh/skills` | 400 |
  | `$DSH_AGENTS_HOME ?? ~/.agents/skills` | 500 |

- projectRoot 判定：从 cwd 向上找第一个 `.git`；找不到则退回 cwd。
- 形态：目录包 `<root>/<skill-name>/SKILL.md`（`references/` 等随包文件以技能目录为资源根解析），或扁平 `<root>/<name>.md`。
- frontmatter 必填：`name`（kebab-case 小写连字符 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`，须与目录名一致）、`description`；可选 `whenToUse`、`disable-model-invocation`、`user-invocable`、`metadata`。
- 根目录被 chokidar 监视，且 write/edit 工具触碰技能路径会触发失效：**会话中写入的新技能当次会话即可见**。
- 模型通过 `skill` 工具按精确名字装载完整指令；装载结果会告知技能自身目录（资源根）。
- 层级：project 层 > runtime（预设）层 > user 层——工作区本地同名技能会遮蔽预设内置副本。

### 2.6 "全局安装 Skill" 在 DSH 里的样子（本设计回避它的理由）

- 用户全局根是 `~/.dsh/skills` 与 `~/.agents/skills`。全局安装意味着所有项目、所有预设会话共享同一份技能版本：与"技能随预设版本化、用户可按工作区定制"的模型冲突。
- 因此技能**内置预设**（仅该预设会话可见，随预设升级）；项目根 `.agents/skills`（原生支持、rank 200、可 git 跟踪、会话内热加载）保留为**用户覆盖/扩展层**。

## 3. 仓库结构

```text
dsh-architecture-mentor/
├─ .agents/AGENTS.md                # 仓库维护规则
├─ .agents/notes/                   # Agent Notes：决策与实现记录（精简单语）
├─ README.md                          # 安装与快速开始、信任声明
├─ LICENSE
├─ package.json                       # bin → scripts/install.mjs（npm / pnpm 均可）
├─ scripts/install.mjs                # 安装器：纯 Node ESM，无构建步骤
├─ scripts/smoke-install.mjs          # 安装器冒烟测试
├─ scripts/generate-identity.mjs      # 身份同源生成器（--check 防漂移）
├─ preset/                            # 安装时整体复制到 $DSH_HOME/.agent-presets/architecture-mentor/
│  ├─ agent.cordis.yml                # 导师组合（见 7.1）
│  ├─ preset.yml                      # name: 架构导师 / description
│  ├─ VERSION                         # 模板版本号：安装器与工作区标记共用
│  ├─ src/mentor-identity.md          # 单一身份源（persona + AGENTS 段）
│  ├─ skills/                         # 预设内置技能全集（customSkillDirs 指向此处）
│  │  ├─ mentor-workspace-init/SKILL.md        # 初始化 / 升级工作区
│  │  ├─ architecture-investigation/SKILL.md   # 策略技能
│  │  ├─ architecture-challenge/SKILL.md
│  │  ├─ architecture-retrospective/SKILL.md
│  │  ├─ learner-model-calibration/SKILL.md    # 状态技能（v1 含 Memory Curation 职责）
│  │  └─ mentoring-contract-management/SKILL.md
│  └─ templates/                      # 初始化的模板源（不作为技能注册）
│     ├─ AGENTS.md                    # 导师人格模板 → 工作区根（渐进式披露，见第 6 节）
│     └─ workspace/
│        ├─ README.md                 # 工作区总览 + 目录职责索引
│        ├─ .agents/skills/README.md  # 用户覆盖层说明（占位）
│        ├─ contract/README.md        # 以下：每个目录自带的职责说明
│        ├─ contract/current.md       # 契约 v1 模板
│        ├─ history/README.md
│        ├─ memory/README.md          # 五类记忆模板（frontmatter + 骨架）与各子目录 README
│        ├─ mentoring/README.md
│        └─ views/README.md           # views/active-context.md 模板
└─ docs/architecture-mentor/…         # 设计文档（本文件归属此处）
```

要点：

- **模板必须与组合文件同目录**：安装后 `baseUrl` 是唯一可靠的定位锚（`DSH_HOME` 可能未设置、预设 id 可改、路径各平台不同）。引导技能通过自己的资源根（技能目录）反推预设根：`<preset>/skills/mentor-workspace-init/` 的父目录链即 `<preset>/`，模板在 `<preset>/templates/`。
- **全部技能随预设分发**（`customSkillDirs` → 预设 `skills/`）：这是 DSH 官方预设同款模式（cordis 预设即自带技能目录）。升级技能 = 升级预设（`npm update`），无需逐工作区同步。
- **工作区 `.agents/skills/`（rank 200）遮蔽预设内置同名技能（rank 300）**：用户定制 = 把该技能复制到工作区本地再改；副本从此刻起归用户所有，不再随预设升级。预设目录本身不修改（与"不改 shipped 预设、复制到用户根再改"同一纪律）。
- `mentor-workspace-init` 永不复制进工作区——它负责所有工作区的初始化与升级，必须始终取预设内置版本。

## 4. 安装命令设计（已定案：Node 脚本）

- **实现语言：JavaScript（Node ESM，`.mjs`）**。`dsh` 本身是 Node CLI，目标环境必然有 Node——用 JS 天然跨平台，免去 ps1 / sh 双份脚本与平台分支；安装逻辑约百行，无需 TypeScript 构建步骤（若仓库后续引入 TS 工程再迁移不迟）。
- **分发方式：npm bin**（`package.json` 的 `bin` 指向 `scripts/install.mjs`）。已发布 npmjs.com（正式版 `0.1.1`；rc 测试版由 GitHub Actions 自动发布），已验证命令：
  - `npm exec --yes --package=dsh-architecture-mentor -- architecture-mentor-install`
  - `npm i -g dsh-architecture-mentor` 后执行 `architecture-mentor-install`
  - 源码运行：`node scripts/install.mjs`
- bin 逻辑：解析 `DSH_HOME ?? ~/.dsh` → 目标 `$DSH_HOME/.agent-presets/architecture-mentor/` → 复制 `preset/` → 幂等（已存在时按 `VERSION` 判定覆盖/升级，覆盖前备份）→ 打印验收指引。

### 不采用：`dsh plugin`

- plugin 是宿主平面插件（pnpm 进 profile），预设没有对应命令；且 profile-boot 对 `agent-presets` 行的 roots 覆盖会吞掉用户层配置（`lib/profile-boot-*.js` 中 shipped 预设根以 overlay 形式最后叠加）。记录为反模式。

### 安装器契约

1. 只写用户预设根；覆盖前先备份；**绝不触碰 shipped 预设目录**。
2. 目标目录名即预设 id：`architecture-mentor`（合法 kebab id）。
3. 安装后验收清单（写入 README）：
   - 预设出现在 roster（显示名"架构导师"）；
   - 新会话工具清单含 `skill`、文件工具、`pwsh`/`bash`；
   - 会话技能目录出现全部内置技能（`mentor-workspace-init` 与各策略/状态技能）；
   - 开启第一个对话，完成工作区初始化。
4. 版本留痕：安装器把 `VERSION` 留在预设目录；初始化时把 `templateVersion` 写入工作区标记（见 5.1），升级判定据此进行。

### 上游愿望

- 向 DSH 提议 `dsh preset add <path | git-url>`：直接复用 `agentPresets.copy()` 服务，让"一条命令安装开源预设"成为官方能力。官方命令落地前，本仓库以 npm bin 等价实现。

## 5. 初次对话初始化（工作区引导）

### 5.1 判定与幂等

- 标记文件：`<workspace>/.mentor/workspace.yml`（`schemaVersion`、`templateVersion`、`initializedAt`）。
- 首会话无标记 → 运行 `mentor-workspace-init`；标记存在但 `templateVersion` 落后 → 询问升级（用户显式确认后按 diff 更新工作区内的 AGENTS.md、README 与记录模板；**技能不在此列**，技能随预设升级）；标记当前 → 进入正常导师会话。
- 断点续跑：初始化每完成一步即落盘标记，重入从断点继续。

### 5.2 步骤

1. **项目根保障**：若工作区不是 git 仓库，提示并引导 `git init`（原因见 5.4）。
2. **目录骨架**：按 [《Workspace 目录设计》](./workspace-directory-design.md) 建 `contract/ history/ memory/ mentoring/ views/`，并创建 `.agents/skills/`（只含 README，作为用户覆盖层占位）。
3. **每个目录自带 README.md**：从模板写入，说明该目录的作用、主要写入者、记录命名与模板约定、生命周期要点、"什么不该放这里"。README 是导航与说明，不是权威规则（权威在 AGENTS.md 与技能）；每个不超过约 10 行，防止文档债。
4. **契约访谈**：按 [《导师契约》](./mentoring-contract.md) 的八类语义逐项询问（长期目标、训练范围、现实约束、导师主动权、用户保留权、工作模式、成功判据、复查条件），写入 `contract/current.md`；此后修改必须走契约门禁。
5. **导师人格落地**：把 `templates/AGENTS.md` 写入 `<workspace>/AGENTS.md`（渐进式披露，见第 6 节）；把 `AGENTS.local.md` 加入 `.gitignore` 供用户个人覆盖。
6. **初始工作集**：生成 `views/active-context.md` 骨架，初始化完成。策略与状态技能已随预设内置，初始化结束后立即可用，无需复制。

### 5.3 首会话的 bootstrap 兜底

- 首会话时工作区 `AGENTS.md` 尚不存在：预设 persona 必须内置一版**精简导师身份**（原则、八条不变量、三类门禁摘要），并在初始化完成后声明"此后以工作区 AGENTS.md 为权威人格"。
- 技能内置预设意味着首会话即可装载全部策略技能——初始化结束后即可开始第一轮调查/挑战，无额外等待。
- persona 与 AGENTS.md 模板应由同一源生成（构建期从同一份内容切分），减少漂移。

### 5.4 关键陷阱：工作区必须是独立项目根

- 技能发现以 `.git` 向上定位项目根；若用户选择的工作区嵌在某个更大的仓库内，`.agents/skills` 会解析到**外层仓库根**——技能不可见，或污染外层仓库。
- 规则：**学习工作区自身必须是（或成为）git 仓库**。git 审计同时满足设计对"可追溯、不可静默改写"的要求。

## 6. 身份分层与渐进式披露

AGENTS.md **不是全量设计文档的拷贝**，而是常驻的第一层。它采用渐进式披露：只写"每次对话都必须在场"的原则与索引，其余按需装载。

| 披露层 | 内容 | 装载时机 | 预算纪律 |
| --- | --- | --- | --- |
| L0 persona（预设） | 精简导师身份 + bootstrap 指引 | 每会话常驻 | 约 2–4 KB |
| L1 AGENTS.md（工作区） | 导师人格：原则、八条不变量、三类门禁摘要、技能索引（何时用哪个）、记录模板索引、工作区 README 指针 | 基线自动注入 | 控制在 `maxBytes` 内（默认 64 KB，目标 ≤ 16 KB） |
| L2 Skill | 每种认知工作的执行细节、门禁必答问题、模板全文、质量检查 | `skill` 工具按需装载 | 不常驻 |
| L3 workspace 文档 | 契约、五类记忆、视图、各目录 README | read/grep 按需读取 | 遵守 Active Memory 预算 |

### AGENTS.md 的内容规划规则

1. **放**：每会话都需要的身份与原则；技能触发索引（一条技能一行：名字 + 何时用）；记录模板的指针（指向哪个 Skill 或文件，而非模板全文）；当前契约与 active-context 的指针。
2. **不放**：技能执行细节（在 L2）；模板全文与字段说明（在 L2/L3）；具体学习记录与能力状态（在 L3，且按 Active Memory 预算筛选后才进入上下文）。
3. **原则复刻设计自身**："Raw History 可以很多，Active Memory 必须少而高价值"。AGENTS.md 是常驻上下文，膨胀即每会话持续征税。
4. **注入语义提醒**：AGENTS.md 不覆盖系统/开发者/直接用户指令。**硬约束（门禁、写权限）不能只靠 AGENTS.md 陈述**，必须由模板必填字段与校验流程承载（见第 8 节）。

## 7. 预设组合与技能集

### 7.1 v1 组合行（从 `standard` 拷贝后裁剪）

保留：`persona`、`agent-instructions`、`tool-fs`、`tool-fs-search`、`tool-pwsh`（Windows）/ `tool-bash`（其余平台）、`skill-filesystem`（`customSkillDirs` → 预设 `skills/`，使用 `baseUrl` 的 `!!js` 表达式）、`tool-skill`、`tool-ask-user`、`tool-todo`、`tool-goal`、plan-mode（isolate group）、compaction（isolate group）。

可选（默认关闭）：delegation（子代理/工作流——未来独立 Validator 再启用，且需宿主后端配合）、`tool-jobs`（与 delegation 配套）、`tool-web`（一手资料检索策略）。

禁入：`agent-loop`、沙箱/审批行、任何宿主注册表提供者。

### 7.2 逻辑 Skill → 物理 Skill（全部内置预设）

- 命名候选全集（kebab-case）：`architecture-investigation`、`architecture-challenge`、`architecture-retrospective`、`transfer-assessment`、`learner-model-calibration`、`mentoring-contract-management`。
- v1 合并与裁剪：`memory-curation` 并入 `learner-model-calibration`（设计文档允许相邻职责合并，须保留输入输出与写权限边界）；`transfer-assessment` 后置到 v2。**v1 交付 6 个物理 SKILL.md：5 个策略/状态技能 + 1 个引导技能 `mentor-workspace-init`，全部随预设分发。**
- 每个 SKILL.md frontmatter 携带 `metadata: { version }`，供预设升级与工作区覆盖副本的 diff 比对。
- **用户定制路径**：复制目标技能到 `<workspace>/.agents/skills/<同名>/` 再修改——rank 200 遮蔽预设 rank 300；该副本从此刻起归用户所有，不再随预设升级。
- 状态写权限表照搬 [《Skill 职责设计》](./skill-responsibility-design.md) 的"状态写权限"一节。

## 8. 门禁的机械落地（v1）

- 记录模板即门禁载体：Evidence 模板的 frontmatter 把 [《长期状态变更门禁》](./state-change-gates.md) 门禁一的 8 个必答问题做成必填字段；Capability State 模板同理承接门禁二。
- git 提交历史 = 审计链；"旧判断不得静默改写"由 append-only 文件 + 显式 `superseded` 引用实现。
- 校验 v1 由导师执行 + 用户复核；独立 Validator 后置（启用 delegation 后的候选）。

## 9. 已确认 / V1 后仍开放

已确认（含 V1 落地后收口的开放项）：

- 安装路径 = 用户预设根 `$DSH_HOME/.agent-presets/architecture-mentor/`；安装器 = Node 脚本（`.mjs`，无构建步骤），经 npm bin 分发。
- npm 发布：正式版 `dsh-architecture-mentor@0.1.1` 已发布至 npmjs.com（2026-08-21）；rc 测试版由 GitHub Actions 自动发布，安装命令见 README 与 §4。
- 导师人格 = 工作区根 `AGENTS.md`，按渐进式披露规划内容（第 6 节）；技能 = 预设内置全集，工作区 `.agents/skills/` 仅作用户覆盖层（rank 200 遮蔽 rank 300）。
- 初始化不再复制技能；初始化时创建的每个目录自带 README.md 说明职责。
- 工作区必须为独立 git 项目根；Workspace 存储介质 = Markdown + YAML frontmatter。
- v1 物理技能集 = 6 个 SKILL.md（5 策略/状态 + 1 引导），见 §7.2 与实际 `preset/skills/`。
- 初始化时 `git init`：提示并引导，经用户确认后执行（见《v1 实现决策》D8）。
- 契约 v1 字段最终枚举：已由 `preset/templates/workspace/contract/current.md` 与 `memory/README.md` 定稿。
- delegation / `tool-jobs` / `tool-web`：v1 默认关闭。
- AGENTS.md 与 Skill 语言策略：frontmatter/`description` ASCII（英文 `Use when`），技能正文中文。

V1 后仍开放：

- GitHub Release —— 可选，试点通过后决定；npm `latest` 已指向正式版 `0.1.1`。
- delegation / `tool-web` 是否随独立 Validator 纳入后续版本。

## 10. 风险清单

| 风险 | 后果 | 缓解 |
| --- | --- | --- |
| 工作区嵌在外层 git 仓库 | 技能根解析到外层、技能不可见 | 初始化强制/引导 git init（5.4） |
| AGENTS.md 常驻膨胀 | 每会话 token 成本、超预算截断 | 预算纪律（第 6 节）+ 模板化 |
| 升级覆盖用户本地修改 | 用户定制丢失 | 显式确认 + diff 更新 + git 跟踪 |
| persona 与 AGENTS.md 漂移 | 首会话与后续会话行为不一致 | 同源生成 + `VERSION` 校验 |
| 用户覆盖副本不随预设升级 | 工作区本地定制的技能错过上游修复 | 预设升级时对覆盖副本做 diff 提示；`.agents/skills/README.md` 写明该语义 |
| 引导技能被遮蔽 | 用户无意把 `mentor-workspace-init` 复制进工作区，遮蔽预设版 | 该技能永不自动落地工作区；README 注明其特殊性 |
| 预设 id 冲突 | 覆盖他人同名预设 | 安装前检测并拒绝（或提示改名） |
| 依赖 DSH 内部机制 | rc 版本变更破坏发现语义 | 文档记录核实过的版本与出处；发布时复核 |
| 信任模型被低估 | 安装即授权 fs/shell 工具 | README 显著声明；组合保持最小工具面 |
