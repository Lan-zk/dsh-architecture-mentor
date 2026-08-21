---
name: trim-cot-leakage
description: Use when auditing or fixing prose that reads like a leaked reasoning transcript in dsh-architecture-mentor: dead design-session citations, change narration, version stamps, stack or PR vantage, reviewer-addressed justifications, control-flow narration, or hedged planning residue in docs, agent notes, skills, or config comments.
metadata:
  version: "0.1.0"
---

# 修剪思维链泄漏

> 来源：dsh-trim-cot-leakage，已适配本仓库。

思维链泄漏 = 视角是作者会话而非仓库：引用只有该会话能看到的产物、叙述变更而非状态、或与已离开的评审者争辩。修复不是只删除：有事实子句的段落先按现在时重述再删转录；无事实子句的段落直接删除。

## 唯一测试

对每个可疑段落问：**HEAD 读者在没有会话转录、PR 线程或未提交草稿时，能否解析每个引用并验证每个声明？** 不能 → 重述存留事实并删除其余；能 → 不是泄漏。但能解析的变更故事在当前状态面（README、docs）上仍是变更叙述，按第 3 类路由到归属。

## 分类

1. **死设计会话引用** —— `(decision N)`、`(audit C2)`、未提交草稿的 `§N`、阶段标签（`T4`、`P-I`）。有 committed owner 则指名+路径；否则删除并重述事实子句。
2. **栈 / PR 视角** —— "this PR"、"later PR"、"previous commit"。陈述 shipped 机制或扩展点；延后工作转 `TODO` 或 issue。
3. **变更叙述与版本戳** —— "used to"、"no longer"、"old X"、"v1"、"this cut"、"today"。陈述当前行为；固定回归用现在时反事实（"without X, Y happens"）。
4. **评审编排** —— "Rejected in review:"、"reviewer"、草稿序号。保留决定与理由为事实，删谁何时说。
5. **面向评审的辩护** —— "it simply…"、"this is correct because…"。陈述使代码安全的不变式，或删除。
6. **复述与推导转录** —— "first we X, then we Y"、测试走读、显然分支证明。删除；只留非显然契约/不变式。
7. **模糊与计划残留** —— "probably fine for now"、"should be enough"。转 `TODO`/`FIXME` 或陈述实际边界。
8. **作者语言滑移** —— 非目标语言片段、工作区私有分隔符。翻译或删除。

## 什么不是泄漏

- Issue 引用（`#1470`）、`TODO(name):`、`issue #N owns the follow-up`。
- Agent Note 与 postmortem 中已合并 PR / issue 引用（作为证据）。
- 抑制理由（lint-disable、coverage-ignore、空 catch 解释）。
- 现在时反事实回归钉（"without X, Y happens"）。
- 实测边界（"(measured: …)"，"measured" 有负载）。
- 运行时新旧对象（"old connection drains before new one accepts"）。
- 外部可解析引用（RFC 9110 §10.1.5、Figma frame）。
- 项目声音 "we"、Agent Note 的 Alternatives considered 章节。

## 工作流

1. 范围与排除按 [prose-standard](../prose-standard/SKILL.md)：显式 scope；不动 `.agents/notes/archived/`。
2. 只读审计：跑 [recall batteries](references/recall-batteries.md)（`--hidden`，排除 `.git/`），再对最密集散文无模式通读——探针会漏。
3. 按面修复 owner-first：派生产物 → 改源再生成；模型可见字符串 → 措辞即行为，标快照变更而非静默改写。
4. 删除前枚举命题并检查 [overcorrection traps](references/examples.md#overcorrection-traps)。
5. 复跑 batteries 期望只剩 sanctioned keeps；确认每个引用在 HEAD 可解析；运行 `git diff --check`。
