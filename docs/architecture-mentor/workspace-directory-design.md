# Workspace 目录设计

## 设计范围

本文只定义 Workspace（工作区）的逻辑信息架构，不创建实际目录，也不决定最终存储介质。目录名称和文件名是 Memory Model v1 的可读表达；未来即使改用数据库，信息边界、权威关系和写入规则仍应保持成立。

目录设计从以下约束推导：

- Mentoring Contract（导师契约）是用户拥有的权威状态，不属于学习记忆。
- Raw History（原始历史）负责保真，不直接改变 Learner Model（学习者模型）。
- 长期记忆分为 Experience、Evidence、Hypothesis、Capability State 和 Architecture Insight。
- 事实性记录与解释性记录必须分开，旧判断不得静默改写。
- Lifecycle（生命周期）是记录属性，不应依靠移动文件表达。
- Active Memory（活跃记忆）是有预算的派生工作集，不是另一份权威数据。
- 实际项目代码和大型外部资料不应为了记忆系统被重复复制。

## v1 逻辑目录

```text
workspace/
├─ contract/
│  ├─ current.md
│  └─ history/
│
├─ history/
│  ├─ sessions/
│  ├─ projects/
│  ├─ artifacts/
│  └─ sources/
│
├─ memory/
│  ├─ experiences/
│  ├─ evidence/
│  ├─ learner-model/
│  │  ├─ hypotheses/
│  │  └─ capabilities/
│  └─ insights/
│
├─ mentoring/
│  └─ interventions/
│
└─ views/
   ├─ active-context.md
   ├─ challenged.md
   ├─ archived.md
   └─ indexes/
```

这个结构是逻辑设计，不表示每个叶子目录都必须存在，也不表示每条记录必须是单独 Markdown 文件。

## `contract/`：用户拥有的权威状态

```text
contract/
├─ current.md
└─ history/
```

`current.md` 表示当前有效的 Mentoring Contract，包括目标、训练范围、现实约束、导师权限和用户否决边界。它不由导师根据 Learner Model 自动生成。

`history/` 保存被替代的契约版本及其生效时间、修改原因和替代关系。修改 `current.md` 必须经过契约变更门禁；普通教学策略调整不会触发契约版本更新。

具体实现可以让 `current.md` 保存完整内容，也可以只保存指向不可变版本的指针。关键要求是：当前版本明确、历史可追溯、导师不能静默修改。

## `history/`：原始事实和可追溯来源

```text
history/
├─ sessions/
├─ projects/
├─ artifacts/
└─ sources/
```

### `sessions/`

保存有保留价值的原始对话、学习活动和时间线。它不是自动总结目录，也不要求每次会话都生成长期 Learning Record。

### `projects/`

保存项目身份、代码位置、版本、提交、PR、ADR 和运行环境等引用信息。实际代码可以位于 Workspace 外部；这里优先保存稳定引用和必要快照元数据，避免复制整个仓库。

### `artifacts/`

保存学习者原始产出，例如设计草稿、架构图、答案、预测、评审意见和实现结果。Evidence 必须能够回溯到这些原始产出，而不是只保存导师的评价。

### `sources/`

保存书籍、论文、外部文档、开源项目和案例的来源信息、版本及必要摘录。它说明导师依据了什么，不自动构成学习者能力证据。

原始历史可以量大，但默认不进入 Active Context（活跃上下文）。

## `memory/`：五类长期记忆

```text
memory/
├─ experiences/
├─ evidence/
├─ learner-model/
│  ├─ hypotheses/
│  └─ capabilities/
└─ insights/
```

### `experiences/`

保存从原始历史中筛选出的、未来仍值得引用的事实单元。Experience 描述发生了什么，并链接相关 session、project、artifact 或 source，不宣布掌握程度。

### `evidence/`

保存通过长期 Evidence 写入门禁的学习证据。每条 Evidence 至少要能回到原始产出，并说明观察行为、上下文、提示程度、支持或反驳的能力判断以及明显反证。

目录中存在 Evidence 不代表 Capability State 自动升级。能力提升由独立门禁处理。

### `learner-model/hypotheses/`

保存导师当前准备验证的能力假设。Hypothesis 必须引用 Evidence，并通过 `candidate`、`active`、`challenged`、`superseded` 或 `archived` 等生命周期状态表达当前有效性。

### `learner-model/capabilities/`

保存某项具体能力在当前证据下的覆盖范围、已证明内容、尚未证明内容和反证。新状态显式替代旧状态，不能只保留一个不断被覆盖的总分。

### `insights/`

保存可复用的 Architecture Insight，包括上下文、作用力、判断、权衡、替代方案、反例和重新评估条件。它属于知识，不证明学习者已经掌握。

## `mentoring/`：导师运行记录

```text
mentoring/
└─ interventions/
```

这里保存少量具有 Future Decision Value（未来决策价值）的 Mentoring Intervention（教学干预），例如导师为什么改变挑战方向、某种策略预期验证什么假设、实际效果如何。

它不是每次策略调用的日志。普通提问、讲解和工具调用不应自动生成 intervention。只有一项策略选择可能改变未来怎样教学时，才值得长期保存。

Intervention 记录可以引用 Learner Model，但不能作为证明 Capability State 的 Evidence。

## `views/`：非权威派生视图

```text
views/
├─ active-context.md
├─ challenged.md
├─ archived.md
└─ indexes/
```

`views/` 根据当前契约和长期记录生成导师需要的工作集与索引：

- `active-context.md`：当前目标、关键能力状态、待验证假设、高价值证据和相关 Insight 的有预算工作集。
- `challenged.md`：存在冲突证据、需要继续验证的记录视图。
- `archived.md`：已退出默认上下文、但可以按需检索的记录索引。
- `indexes/`：按能力、项目、主题、时间或记录关系生成的检索入口。

视图不是 Source of Truth（权威来源），不应被手工修改后反向覆盖原始记录。删除视图后应能够从契约和记录重新生成。

## 为什么不按生命周期建目录

不采用下面这种结构：

```text
memory/
├─ active/
├─ challenged/
├─ superseded/
└─ archived/
```

原因是记录状态变化会导致文件移动、引用失效和历史追踪困难。同一条 Evidence 可能退出活跃工作集，但仍被一个 Capability State 引用。记录应拥有稳定身份和稳定位置，生命周期由元数据和派生视图表达。

## 写入和读取边界

| 区域 | 主要写入者 | 默认读取方式 | 权威性 |
| --- | --- | --- | --- |
| `contract/` | 用户确认后的契约管理职责 | 每次导师决策前读取当前版本 | 用户拥有的权威状态 |
| `history/` | 会话、项目调查和产出捕获职责 | 按来源追溯时读取 | 原始事实来源 |
| `memory/experiences/` | 调查、复盘或记忆维护职责 | 按当前任务检索 | 筛选后的事实记录 |
| `memory/evidence/` | 通过 Evidence 门禁的记忆维护职责 | 能力校准时检索 | 长期能力证据 |
| `memory/learner-model/` | 学习者模型校准职责 | 导师选策略时读取活跃部分 | 可证伪的派生状态 |
| `memory/insights/` | 调查、复盘和知识提炼职责 | 与当前案例相关时检索 | 有边界的可复用知识 |
| `mentoring/` | 上层导师 | 评估策略效果时检索 | 导师运行历史，不是能力证据 |
| `views/` | 派生生成器或记忆维护职责 | 默认上下文入口 | 非权威缓存和索引 |

## 当前仍未决定（V1 已收口部分）

V1 已决定：每类记录为单文件 Markdown + YAML frontmatter；记录标识 = 稳定相对路径 + `YYYY-MM-DD-slug.md` 命名；`current.md` 存完整契约 + 版本字段；派生视图由 `learner-model-calibration` 生成。

仍开放：

- 原始会话与大型 Artifact 的保留、脱敏和删除策略。
- Active Context 的容量预算、排序和检索算法（V1 试点参数：≤ 8 KB）。

这些问题不影响当前逻辑边界，后续可以在不改变 Memory Model 的前提下继续收敛。
