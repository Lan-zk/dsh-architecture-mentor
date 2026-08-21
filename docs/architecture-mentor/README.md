# 架构导师设计文档

本目录沉淀“架构学习技能设计”对话中已经形成共识的设计基线，以及在此基础上推导出的 Memory Model v1（第一版记忆模型）和后续的工程化收敛结论。仍在讨论的项统一在文末开放项清单中标注 v1 状态，不再散落各处。

整理时遵循两条规则：

1. 以对话后期的修正为准。例如，“AI 辅助开发新应用时容易在前期架构设计上失控”是当前能力信号，不是整个系统的最终目标。
2. 区分已确认原则和候选实现。已确认原则可以指导下一阶段设计；候选实现仍需验证。

## 文档导航

| 文档 | 内容 |
| --- | --- |
| [定位与目标](./vision-and-scope.md) | 要解决的问题、优先训练的能力、真实项目的角色和非目标 |
| [自适应导师系统](./adaptive-mentorship-system.md) | 弱流程、强约束、持续状态、导师主导权和策略选择 |
| [导师契约](./mentoring-contract.md) | 用户拥有的目标、现实约束、导师权限和契约修改原则 |
| [长期状态变更门禁](./state-change-gates.md) | 写入长期证据、提升能力状态、修改导师契约时必须满足的约束 |
| [学习质量护栏](./learning-guardrails.md) | 无论采用何种教学策略都必须满足的约束 |
| [能力与证据模型](./capability-evidence-model.md) | 从接触到迁移的能力阶梯、证据强度和能力状态更新原则 |
| [长期记忆模型](./memory-model.md) | 原始历史与五类长期记忆的关系、证据链和记忆不变量 |
| [记忆生命周期与活跃上下文](./memory-lifecycle.md) | 候选、活跃、受质疑、替代、归档，以及工作集预算与遗忘 |
| [Agent、Skill 与 Workspace 的职责](./agent-skill-workspace.md) | 当前认可的组织方向、责任边界和仍待设计的内容 |
| [Workspace 目录设计](./workspace-directory-design.md) | 从契约、历史、五类记忆、导师运行记录和派生视图推导出的逻辑目录 |
| [Skill 职责设计](./skill-responsibility-design.md) | 按认知动作拆分的 Skill 边界、输入输出、禁止项和状态写权限 |
| [Skill 编写规范](./skill-authoring-standard.md) | 参考 dsh 的设计手法，规定 SKILL.md 的触发契约、正文骨架、零脚本门禁承载与记忆类专项规则 |
| [DSH 工程化设计](./dsh-engineering-design.md) | 开源安装命令、预设组合、AGENTS.md 导师人格与工作区初始化的工程注意事项（运行时机制已核实） |
| [v1 实现决策](./v1-implementation-decisions.md) | D1–D11 已确认决策、派生的 v1 硬约束与开放项归宿 |
| [v1 落地开发计划](./v1-implementation-plan.md) | M0–M4 执行步骤、交付物与验收标准；试点与发布延后 |

背景研究见 [《AI 时代软件架构师的深度研究》](../AI时代软件架构师的深度研究.md)。

> 注：本文档引用的 `projects/dsh/.agents/` 样本是本地参考材料，按 `projects/README.md` 的约定不进入 git 管理。样本的规范出处是 dsh 上游仓库（deepseek-harness）：`@deepseek-ai/dsh` 包的 repository 字段指向 `github.com/deepseek-ai/deepseek-harness`。

## 已确认的设计基线

- 首要目标是：面对复杂真实系统，学习者能够逐渐独立做出高质量、可解释、可迁移的架构判断。
- 真实项目是诊断器、实验场和经验来源，不是课程大纲，也不是架构原则的权威来源。
- 架构学习可以从真实问题、优秀开源项目、事故、设计文档、概念或个人好奇等不同入口开始，但最终应落到架构判断能力上。
- 系统应是拥有持续状态的自适应导师系统，而不是固定课程或必须逐步执行的流水线。
- 导师拥有提出方向、挑战诊断和选择教学策略的主动权；学习者保留最终目标、现实约束和否决方向的权力。
- 系统采用“弱化学习活动的固定流程，强化长期状态变更的证据门禁，导师在门禁范围内主动选择策略”的控制原则。
- v1 只对三类高影响动作设置强制门禁：写入长期 Evidence、提升 Capability State、修改 Mentoring Contract。普通教学活动不受统一流程约束。
- 长期状态必须建立在可追溯的学习证据上，并且允许被新证据削弱、修正、替代或归档。
- Memory（记忆）不是所有已保存信息，而是未来可能改变导师行为的信息；Raw History（原始历史）可以很多，Active Memory（活跃记忆）必须少而高价值。
- 长期记忆区分 Experience（经历）、Evidence（学习证据）、Hypothesis（导师假设）、Capability State（能力状态）和 Architecture Insight（架构经验）。
- 只有可验证的学习证据可以改变学习者模型；导师过去的判断不能循环成为证明自身正确的新证据。
- “接触过”“听懂了”“项目完成了”均不能自动等同于“掌握了”。
- 旧判断不得被静默改写；事实性证据保留当时发生的事情，后续解释通过质疑、替代或归档发生变化。
- Skill 落地遵循统一的编写规范；v1 以记录模板必填字段与技能内检查清单承载三类门禁（零脚本），Memory Curation 职责并入 learner-model-calibration。

## 已由后续文档确认的实现决策

以下条目曾被列为开放项，现已由后续设计文档关闭：

- Workspace 记录存储介质：**Markdown + YAML frontmatter**，每记录一文件（《DSH 工程化设计》§9）。
- 安装路径与安装器：用户预设根 `$DSH_HOME/.agent-presets/architecture-mentor/`；安装器为 Node ESM（`.mjs`）、无构建步骤，经 npm bin 分发（《DSH 工程化设计》§4）。
- 导师人格载体与技能分发：工作区根 `AGENTS.md` 为导师人格；技能全部预设内置，工作区 `.agents/skills/` 仅作用户覆盖层（rank 200 遮蔽 rank 300）；初始化不复制技能（《DSH 工程化设计》§5–§6）。
- v1 物理技能集：5 个策略/状态技能 + 1 个引导技能（`memory-curation` 并入 `learner-model-calibration`；`transfer-assessment` 后置 v2）（《DSH 工程化设计》§7.2）。
- v1 门禁执行：门禁一、二由导师自检 + 用户复核，门禁三必须用户明确确认，git 提交历史为审计链；独立 Validator 后置（《DSH 工程化设计》§8）。
- 工作区必须是独立 git 项目根（《DSH 工程化设计》§5.4）。

## 尚未确认的实现决策（v1 执行状态）

| 开放项 | v1 状态 | 归宿 |
| --- | --- | --- |
| 完整的架构能力地图及其粒度 | 延后 | 以深度研究 ★★★★★ 条目作种子清单（D7），积累真实 Evidence 后再收敛 |
| 五类长期记录的最终字段、标识符、引用方式 | 部分决定 | 存储与命名已定（D3）；字段已由记录模板定稿（`preset/templates/workspace/memory/README.md`、`contract/current.md`）；候选来源见《Skill 编写规范》§7.2 |
| 生命周期状态转换和能力升级所需的具体证据阈值 | 试点验证中 | 试点延后；仍以本目录原则为约束继续收敛 |
| 三类门禁由谁执行 | 已决定 v1 方式 | 见上文；独立 Validator 后置 |
| Mentoring Contract 的最终字段，以及学习/交付模式的切换规则 | 部分决定 | v1 契约字段已由模板定稿（`contract/current.md`）；模式切换协议延后 |
| Active Memory 的容量预算、排序和按需检索机制 | 试点参数 | D6：≤ 8 KB 试点值，试点校准后回写 |
| v1 逻辑 Skill 合并与最终物理数量 | 已决定 | 见上文（5 + 1） |
| 如何机械地评估诊断准确性、迁移能力和长期进步 | 保持开放 | 不因 v1 交付节奏而猜测 |

这些开放项的后续收敛与 v1 决策记录见 [《v1 实现决策》](./v1-implementation-decisions.md)；执行步骤与验收标准见 [《v1 落地开发计划》](./v1-implementation-plan.md)。
