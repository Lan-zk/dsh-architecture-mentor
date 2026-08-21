---
name: archive-agent-notes
description: Use when adding, auditing, pruning, archiving, or reviewing Agent Notes in dsh-architecture-mentor; checks every new note for superseded records, classifies implemented notes by future decision value, and applies the slim single-language archive rules.
metadata:
  version: "0.1.0"
---

# 归档与维护 Agent Notes

> 来源：dsh-archive-agent-notes，已适配本仓库（无三语、无脚本）。

## 权威来源

- `.agents/notes/README.md` —— 生命周期、分类、格式与维护规则。
- `.agents/AGENTS.md` —— 仓库维护纪律。
- `.agents/notes/` 下的活跃 note 树与入链。

## 新增 note 先查替代

每条新 note 都触发一次 scoped supersession 审计：检索同主题的活跃 note，分类为完全替代、部分替代或无冲突。完全替代的 implemented note 在同一次变更中归档；部分替代保留并双向交叉引用；已过时 proposal 改 rejected。

## 按未来决策价值分类

- **implemented keep**：理由、替代方案、负面保证、持久/线格式、归属边界、安全规则或重新引入条件仍可能指导未来工作。长度无关。
- **implemented archive**：决策已完结且正文不太可能指导未来工作（一次性 UI、窄适配器、已闭环的缺陷、被替代的实现细节）。
- **proposed never archive**：活跃提案；不再值得做就改为 rejected。
- **rejected keep**：仅当失败方案仍是诱人且重要的错误时保留。
- **rejected delete**：提案过时、被替代或不再可能阻止重复犯错时删除整个 note，并修复/删除入链。

不要按配额归档；逐条语义判断。

## 归档（精简单语）

1. 在 `Status:` 行下插入 `Archived: YYYY-MM-DD`。
2. 移动到 `.agents/notes/archived/{class}/`。
3. 正文冻结：只允许归档元数据与引用修复，不得改写事实。
4. 搜索并修复/删除入链；删除后不保留指向归档 note 的活跃链接（历史引用除外）。
5. 无脚本校验；git 提交留痕。

## 校准示例

- **keep**：248 词、定义持久边界与归属权的 note —— 仍是当前权威。
- **archive**：1,500 词、只描述已完成实现细节的 note —— 当前生成器/模板已是权威。
- **delete（rejected）**：972 词、前提已过时的否决 note —— 不再阻止任何诱人错误。
- 规模不是判据：400 词的边界 note 可 keep，1,500 词也可 archive。

## 校验

- `git diff --check`
- grep 确认无断链。
