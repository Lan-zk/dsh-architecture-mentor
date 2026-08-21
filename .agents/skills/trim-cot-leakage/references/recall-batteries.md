# Recall batteries

针对 [分类](../SKILL.md#分类) 的探针，在 2026-08 purge 期间调校。每个命中都要语义判断——batteries 会过度匹配，也会漏匹配：每轮 review 都发现 batteries 没抓到的案例，因此必须配合对最密集散文的无模式通读。

## 调用规则

- 加 `--hidden --glob '!.git/**'` 使隐藏目录被搜；排除 `.agents/notes/archived/**`（冻结快照），以及本技能目录自身（其文件引用泄漏措辞作校准）。
- 若环境没有 `rg`，用等价的 `Select-String` / `grep -P` 模式；探针定义不变。
- 自然语言行加 `-i` 使句首大写命中（"This PR adds…"、"Probably fine…"）；第一行匹配代码模式的保持大小写敏感，`-i` 会把 `\bT\d\b` 和 `\bP-I\b` 变成噪音。
- 零命中模式在亲眼见过它命中前不证明任何事：先对已知阳性字符串测试再信任阴性。

## English battery

```sh
rg -n --hidden '\(decision \d|\(audit [A-Z]\d|design §|plan §|design ledger|\(B ruling|\bP-I\b|\bW\d\b|\bT\d\b' ...
rg -n --hidden -i 'this PR|this branch|this stack|later PR|previous commit|this commit' ...
rg -n --hidden -i 'used to |no longer|previously|the old |was renamed|was moved' ...
rg -n --hidden -i '\bv1\b|this cut|\bcut \d|\btoday\b|\bfor now\b|roadmap' ...
rg -n --hidden -i 'rejected in review|review round|reviewer|as of v\d' ...
rg -n --hidden -i 'probably |should be enough|should suffice|it simply|is safe —|is safe --' ...
rg -n --hidden '§\d' ...
```

## Chinese battery

```sh
rg -n --hidden '设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有' ...
rg -n --hidden '(^|[^a-zA-Z])端([^a-zA-Z]|$)' --glob '*.md' ...
```

## 已知误报家族

- **工具性 "used to"** —— "the key used to sign requests" 是工具性，不是时间性；时间性形式在其前有主体状态（"colors used to come from…"）。
- **运行时新旧** —— "old connection drains before the new one accepts" 命名交接中的活对象，不是仓库状态。
- **"This PR" 出现在流程文档** —— 关于 PR 工作流的文档（"PR body should…"）合法使用 "PR"；禁令针对某 PR 视角看代码的文档。
- **`v1` 作为协议/路径段** —— `/v1/chat`、wire 格式名是标识符，不是版本戳。
- **`§N` 有 committed owner** —— 外部标准（RFC 9110 §10.1.5）与拥有自身节号的 committed 文档可按节引用。
- **对比性 "actually" 与名词 "wait"** —— 普通英语，不是 hedge。
- **"Today" 在生成时间戳与 CLI 输出样本** —— 记录输出保持原声。
- **本版本 在 zh 散文** —— 版本化产物上下文中 "this release" 的合法表达；被禁的是裸戳 "本版"。
- **Alternatives considered 章节** —— Note 的 genre 槽内 "rejected" 是合法归属，不是评审编排。
