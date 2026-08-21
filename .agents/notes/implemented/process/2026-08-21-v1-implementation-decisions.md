# Agent Note: 架构导师 v1 实现决策

Status: implemented

## Problem

V1 从设计文档落地为可安装的 DSH 预设前，README 中一批"尚未确认的实现决策"必须逐一给出归宿，否则实现会不断漂移、文档状态失真。

## Decision

V1 实施决策（D1–D11）确认如下，配套实现见 [2026-08-21-v1-implementation](./2026-08-21-v1-implementation.md)。

| # | 决策 | 内容 | 依据 |
| --- | --- | --- | --- |
| D1 | 物理技能集 | 6 个 `SKILL.md`：`mentor-workspace-init` + `architecture-investigation`、`architecture-challenge`、`architecture-retrospective`、`learner-model-calibration`（含 Memory Curation 职责）、`mentoring-contract-management`；`transfer-assessment` 后置 v2 | 工程化设计 §7.2；编写规范 §1、§2 |
| D2 | 门禁执行方式 | 门禁一、二：导师自检（检查清单）+ 用户复核；门禁三：必须用户明确确认；git 提交历史为审计链；独立 Validator 后置（依赖 delegation） | 工程化设计 §8；编写规范 §2 |
| D3 | 记录存储 | Markdown + YAML frontmatter；每记录一文件，命名 `YYYY-MM-DD-slug.md`；引用一律用相对路径 | 工程化设计 §9；Workspace 目录设计 |
| D4 | `contract/current.md` | 存完整契约 + frontmatter 版本字段；指针方案后置 | Workspace 目录设计 |
| D5 | 技能语言 | frontmatter/`name`/`description` 全 ASCII；`description` 以 `Use when ...` 开头（英文）；正文中文 | 编写规范 §4、§13 |
| D6 | Active Context 预算 | 试点参数：`active-context.md` ≤ 8 KB；排序 = 决策价值 × 证据质量 × 误用风险；试点用真实数据校准后回写（试点当前延后） | 记忆生命周期开放项；工程化设计 §6 |
| D7 | 能力维度 | 以《AI 时代软件架构师的深度研究》2026–2030 优先级表 ★★★★★ 条目为种子清单；维度按实际 Evidence 按需创建；不发布完整能力地图 | 定位与目标；能力与证据模型 |
| D8 | `git init` | 工作区初始化时提示并引导，经用户确认后执行；不静默 init | 工程化设计 §5.2、§5.4 |
| D9 | 版本策略 | 预设 `VERSION` 与 npm 包版本同步（当前 `0.1.2`）；技能 `metadata.version` 同步；升级 = 预设升级；工作区覆盖副本不随预设自动升级 | 工程化设计 §4、§7.2 |
| D10 | 发布渠道 | 延后决定；试点通过后优先候选 GitHub Release，npm registry 后置 | 工程化设计 §9 |
| D11 | 人格同源 | persona 与 AGENTS.md 模板由同一源 + 构建期 Node 脚本生成；生成产物入库，仓库内不手改产物（改动只发生在源文件） | 工程化设计 §5.3、§6 |

执行边界与定稿偏差：

- 本次执行范围 M0–M4；试点与发布须用户重新发起。
- 运行时门禁零脚本：只由记录模板必填字段 + 技能内检查清单 + git 审计承载；本仓库允许的脚本仅限安装器、身份生成器与构建期冒烟测试。
- 记录模板字段已定稿：门禁一 9 字段、门禁二 10 字段、门禁三 7 字段，落在 `preset/templates/workspace/memory/README.md` 与 `contract/current.md`。相对《Skill 编写规范》§7.2 候选枚举，定稿新增 `time_stability`，用于 1:1 承接门禁二"说明时间稳定性"；候选枚举中其余字段保持不变。

开放项的完整清单与 v1 状态以 `docs/architecture-mentor/README.md` 为唯一权威展示处。

## Alternatives considered

- **实施记录继续留在 docs/**：会让设计目录混合不同生命周期，最终选择 `.agents/notes/`。
- **完整照搬 dsh 三语 triplet 与脚本门禁**：成本高且本仓库为纯中文，最终采用精简单语 Agent Notes。
- **Active Context 预算写成硬数字**：缺少试点证据，最终保留为试点参数。

## Consequences

- `docs/architecture-mentor/` 只保留当前有效设计基线；实施决策与执行记录进入 `.agents/notes/`。
- 字段定稿偏差（`time_stability`）有单一权威记录，owning 文档同步收口。
- 试点与发布保持延后，未因本决策改变。
