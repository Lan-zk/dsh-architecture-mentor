# Agent Notes（本仓库）

记录"我们做了什么、为什么、代价"，与 `docs/` 的设计基线分离。
`docs/` 讲应当是什么（当前有效设计）；notes 讲已经发生或打算发生的事。

## 生命周期与分类

路径：`{lifecycle}/{class}/yyyy-mm-dd-slug.md`

- `proposed/` —— 提案，尚未实现。
- `implemented/` —— 已落地，记录 shipped 现实。
- `rejected/` —— 已否决，仅在仍能防止重复错误时保留。

`class` 从封闭集合取：`process`（工作流/政策）、`architecture`（源码结构）、`feature`（能力）、`simplification`（删减）、`testing`（测试策略）。

## 文件格式（精简单语）

- 首行：`# Agent Note: <标题>`
- 第二行：`Status: implemented` / `Status: proposed` / `Status: rejected — <原因>`
- 正文骨架：
  - `proposed/`：`## Problem` / `## Proposal` / `## Alternatives considered` / `## Acceptance criteria` / `## Risks`
  - `implemented/`：`## Problem` / `## Decision` / `## Alternatives considered` / `## Consequences`
  - `rejected/`：保留提案骨架，`Status` 行写否决原因
- 每条 note 必须保留唯一理由、替代方案、后果与验收证据。

## 维护规则

- 每个非平凡变更必须新增或更新对应 note；同一主题先做 supersession 审计。
- 旧判断不得静默改写：新 note 显式 `supersedes: <相对路径>` 或交叉引用旧 note。
- 引用一律用相对路径。
- 不引入 `.i18n.yaml`、不引入脚本校验；本仓库为纯中文单语。
