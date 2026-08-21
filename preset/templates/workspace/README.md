# 架构导师工作区

本目录是 Architecture Mentor 的长期状态载体。它遵循 `docs/architecture-mentor/` 设计文档中的
《Workspace 目录设计》逻辑分区：`contract/` 用户权威状态、`history/` 原始事实、`memory/`
五类长期记忆、`mentoring/` 导师运行记录、`views/` 非权威派生视图。

## 目录职责索引

| 目录 | 回答的问题 | 主要写入者 | 权威性 |
| --- | --- | --- | --- |
| `contract/` | 系统当前服务于什么目标和边界？ | 用户确认后的契约管理职责 | 用户拥有的权威状态 |
| `history/` | 实际发生了什么？原始产出在哪？ | 会话、调查与产出捕获职责 | 原始事实来源 |
| `memory/` | 什么值得长期相信并影响未来教学？ | 通过门禁的记忆维护职责 | 可追溯的长期记录 |
| `mentoring/` | 导师为什么做过什么干预？ | 顶层导师 | 运行历史，不是能力证据 |
| `views/` | 当前默认读取什么工作集？ | 派生生成器（可随时重建） | 非权威缓存和索引 |

## 通用纪律

1. 记录命名 `YYYY-MM-DD-slug.md`；跨文件引用一律用相对路径，不用裸编号。
2. 生命周期是 frontmatter 字段（`candidate/active/challenged/superseded/archived`），
   **不靠移动文件表达**。记录身份 = 稳定路径。
3. 事实类记录（Experience/Evidence）不改写原文；解释类记录（Hypothesis/Capability
   State/Insight）通过 `supersedes`/`superseded_by` 显式替代。
4. 三类门禁（写入长期 Evidence、提升 Capability State、修改 Mentoring Contract）
   由**记录模板必填字段 + 技能内检查清单 + git 提交历史**承载，不靠记忆或脚本。
5. `views/` 删除后可从权威记录重建；不要手改视图后反向覆盖原始记录。
6. 本工作区必须是一个独立 git 项目根（技能发现依赖它）；所有长期状态变更走 git 审计。

模板全文：`memory/README.md`（五类记忆模板与门禁映射）、`contract/current.md`（契约模板）。
导师人格：工作区根 `AGENTS.md`。
