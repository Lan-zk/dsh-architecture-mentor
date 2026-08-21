---
name: prose-standard
description: Use when writing, reviewing, restoring, trimming, or auditing prose in dsh-architecture-mentor, including deciding where documentation or comments are required across Markdown, agent instructions, notes, prompts, descriptions, and diagnostics.
metadata:
  version: "0.1.0"
---

# 本仓库散文标准

> 来源：dsh-prose-standard，已适配本仓库。

写足以保留契约，然后删除推理转录、重复与装饰。契约 = 义务、不变量、前置/后置条件或兼容承诺。本技能是 guidance，不是 script。

## 输入与排除

需要显式 `scope`；缺失则报告并停止，不推断全仓库范围。默认 `automatic` 模式；用户明确要求时才进 `interactive`。

始终排除 `.agents/notes/archived/`（冻结快照）。

## 保留完整命题

编辑前枚举每条命题的：actor/action、条件/时序、模态（must/may/never）、否定保证/例外、归属/副作用/失败模式/后果。删除形容词、重复与叙述，但任何事实子句必须存活；词数减少本身不是改进。

- 在使用点保留完整本地契约；架构、理由、算法、历史与扩展示例链接到 owning 文档。
- 非显然理由在省略会导致误用时保留；否则写后果并链接理由 home。

## 各位置覆盖

- **README / AGENTS.md**：消费者契约、配置、语义、失败、限制、扩展点、模型可见效果；引用稳定模型可见文本。
- **Agent Notes**：唯一理由、机制、替代、后果、shipped 验证证据与命名缺口；implemented note 用现在时，移除规划清单。
- **Skills 与 agent 指令**：行为护栏、显式范围（"guidance, not a script/checklist"）、工作流精简并链接权威来源。
- **配置注释**：访问限制、非显然接线/加载顺序、安全姿态、重放行为、异常与易误用；不叙述配置已展示的条目。
- **Prompt / 可见字符串**：措辞即行为，改动需行为验证或说明为何无快照。
- **诊断**：命名失败主体/路径、违反规则与修正；移除内部执行叙述。

## 工作流

1. 确认 scope、mode、当前分支。
2. 读 `.agents/AGENTS.md` 与 owning 文档；不确定时读 [examples](references/examples.md)。
3. 检查请求范围，不只最大文件；用搜索和词数找候选，再语义判断。
4. 分类 keep / add / trim / restore / restructure / defer；只在授权编辑时应用。
5. 先改 owner 再改派生物；学新规则后重查类似段落。
6. 运行 `node scripts/smoke-install.mjs`、`node scripts/generate-identity.mjs --check`、`git diff --check`。
7. 报告检查范围、明确改动、故意保留、延期案例与执行的检查。

## 边界决定

只有至少两个版本都满足完整命题规则、且本技能未裁决时才 borderline。自动模式：授权时应用明确编辑并报告 borderline，不削弱命题。交互模式：按原则归类，给 2–3 个可接受版本并推荐一个，说明事实/结构差异。
