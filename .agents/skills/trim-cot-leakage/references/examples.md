# 思维链泄漏示例

用于识别治理原则，不是文本模板。本文件刻意引用泄漏措辞作为校准材料；其措辞不代表可在外使用。

## 死引用

### 有 committed owner 的决策序号

**泄漏：** "Slash 输入按可见目录解析（decision 21）。"

**修复：** "Slash 输入按可见目录解析——该决定由 [对应 Agent Note](../../../notes/implemented/process/2026-08-21-v1-implementation.md) 拥有。"

序号在 HEAD 无处解析；决定的名字与 owning note 路径可以。每个文件至少一次给出 owning note 路径，后续可用可搜索名。

### 无 owner 的决策序号

**泄漏：** "注册表拒绝重名（decision 7: 名字扁平，无命名空间）。"

**修复：** "注册表拒绝重名；名字扁平，无命名空间。"

没有 committed artifact 拥有 "decision 7"，所以删除引用——但其事实子句（扁平名字）重述后保留。

### 审计项代码

**泄漏：** "渲染是纯函数：相同快照、相同字符串（audit R3）。"

**修复：** "渲染是纯函数：相同快照、相同字符串。"

仓库没有审计文档；代码是会话简写，承载零命题。

### 未提交草稿的节号

**泄漏：** "分层遵循设计（v2 §3.2）：`src/core/` 是纯核心。"

**修复：** "分层：`src/core/` 是纯核心。"

没人提交的草稿的 `§N` 不可解析。对照："按 RFC 9110 §10.1.5 转义" 保留——外部标准按设计在仓库外可解析。

### 计划阶段标签

**泄漏：** "`src/client/` 是 shell（T4）；P-I 迁移拥有适配器。"

**修复：** "`src/client/` 是 shell；适配器位于 `src/client/adapters/`。"

阶段标签索引从未落地的计划；用阶段产出的东西替换标签。

## 栈 / PR 视角

### 持久散文中的栈位置

**泄漏：** "未来远程后端实现该接口（沙箱后端是此栈中的 later PR）。"

**修复：** "远程后端无需改动渲染层即可实现该接口。"

持久散文看不到栈。保留扩展点契约；未决工作的 home 是 PR 本身、`TODO` 或 issue。

### README 中的 "This PR"

**泄漏：** "此 PR 为会话列表增加游标分页。"

**修复：** "会话列表按游标分页。"

README 比任何 PR 都长寿；把机制陈述为当前事实。

## 变更叙述与版本戳

### 带 PR 号的战争故事

**泄漏：** "颜色曾来自 `--widget-*` token，没有任何定义，所以总是渲染 fallbacks；alias token 修复了它（PR #88）。"

**修复：** "颜色来自 alias token；未定义 token 渲染 fallbacks。"

两个现存事实都保留——当前机制与持续失败行为——以现在时重述。bug 传记属于 PR 与其 Agent Note。

### 删除叙述

**泄漏：** "`probe` 字段随 removal cut 消失；badges 现在走通用 projection pair。"

**修复：** "Badges 使用通用 projection pair。"

从没见过 `probe` 的读者不会从它的缺席学到什么。"现在" 对比已删除的过去是版本戳。

### 固定回归 → 现在时反事实

**泄漏：** "这曾对多字节标签双重编码。"

**修复：** "没有字节长度守卫时，多字节标签会双重编码。"

回归钉以现在时反事实存留，命名守卫；"used to" 把它钉到仓库考古。

### 索引性版本戳

**泄漏：** "批量渲染在本 cut 是同步的；异步路径是 roadmap 工作。"

**修复：** "批量渲染是同步的。"（延后住在调用点的 `TODO(widget-batch):`）

"this cut" / "v1" / "today" 一旦合并就过时。Agent Note 变更故事内的历史阶段名是当前状态安全的；索引性形式永远不是。

## 评审编排

### 把评审结论写成散文

**泄漏：** "Rejected in review: 缓存解析后的 spec。我们保持每次调用解析。"

**修复（在 Agent Note 的 Alternatives considered 中）：** "**缓存解析后的 spec。** 否决：spec 依赖每次调用的 cwd，按请求键的缓存会提供过期根。"

Alternatives considered 是归属；评审者与轮次不属于理由。

### 草稿序号

**泄漏：** "As of v5 of this note, loader 也验证 manifest。"

**修复：** "Loader 验证 manifest。"

implemented note 陈述 shipped 现实；其自身修订历史在 git。

## 面向评审的辩护

### 论证 cast

**泄漏：** "这个 cast 安全——SDK 构造了对象，它只是没把 optional 声明得够严格。"

**修复：** "SDK 构造该对象时每个 optional 都有值；声明类型比运行时保证更宽松。"

陈述维护者不得破坏的不变式。"It simply…" 是在回应一个 HEAD 不存在的人。如果不变式在代码可见，删除注释。

### 引用评审权威

**泄漏：** "这是正确的，因为评审者确认了 wrapping 顺序。"

**修复：**（删除；wrapping 顺序在函数 `@returns` 中陈述。）

正确性声明引用不变式或测试，从不引用人。

## 复述与推导转录

### 控制流叙述

**泄漏：** "先规范化 label，再截断它，再 wrap。"

**修复：**（删除。）

下面三行代码已说出同样内容。

### 测试走读

**泄漏：** "该测试创建 session，发两条消息，等第二条回复，然后断言日志有四条。"

**修复：** "两次往返必须恰好产生四条日志——projection 对共享前缀去重。"

只保留非显然的断言理由；走读复述测试体。

## 模糊与计划残留

### 无主延后

**泄漏：** "现在 eager 渲染大概没问题。"

**修复：**（删除；延后已有 `TODO(widget-batch):` 标记。）

无主的 hedge 是计划残留。若没有标记，写一个（`TODO(name): coalesce per frame`）而不是保留 hedge。

### 模糊尺寸

**泄漏：** "64 KiB buffer 对大多数情况应该够。"

**修复：** "64 KiB 容纳最大观测帧（48 KiB）并有头空间；更大帧在 `decode` 中响亮失败。"

用实际边界与超界失败行为替换 hedge。

## 作者语言滑移

**泄漏：** "Renderer runs on the client 端; see 设计稿 for spacing. ---- 私有 ----"

**修复：** "渲染器运行在客户端；间距遵循 Figma frame `widget-badges`。"

工作语言片段与会话分隔符是转录残留。Figma frame 名保留：外部来源按设计在仓库外可解析。

## 保留

### Issue 引用在所有面都持久

**保留：** "上限适用于完整渲染值，包括 wrappers（issue #1470 owns the follow-up）。"

Issue 在 HEAD 从任何面都可解析；"#N owns the follow-up" 是 README 中延后工作的归属。Agent Note 与 postmortem 额外允许引用已合并 PR 作为证据。

### 死名称不是"命名 owner"

**删除：** "widget seam 上的 badge renderer（见 widget-rendering RFC）。"

没有 committed 文件响应 "widget-rendering RFC"，所以指针是死的。重定向到 committed owner 或删除。

### 抑制理由

**保留（修复后）：** `// eslint-disable-next-line no-non-null-assertion -- 单元素字面量保证 index 0。`

抑制理由子句是必需散文。当所述理由为假时（原句说"上面循环守卫证明 frame 存在"，实际没有循环），修复理由；永不删除。

### 实测边界

**保留：** "深度上限（measured: 512 nests ≈ 0.15s 同步；4096 阻塞循环）。"

测量把常量钉住，"measured" 是区分数据与猜测的来源。

### 运行时新旧不是变更历史

**保留：** "旧连接先排空，新连接再接受。"

"旧"和"新"命名交接中的两个运行时对象，不是仓库状态；变更叙述禁令针对仓库历史，不是生命周期词汇。

## 过度修正陷阱

修剪前枚举命题；以下每个陷阱都在原始 purge 中 shipped 并被 review 捕获。

### 把义务翻成认可

**原文：** "这些直接注册是待迁移到 slots 的例外。"

**过度修正：** "这些直接注册是 sanctioned exceptions。"

**正确：** "这些直接注册是待迁移到 slots 的例外。"

"pending migration" 是义务；"sanctioned" 祝福现状。修剪反转了语气。

### 把假设提升为 shipped 功能

**原文：** "未来的 IPC shell 子类化 executor 并覆写 `spawn`。"

**过度修正：** "IPC shell 子类化 executor 并覆写 `spawn`。"

**正确：** "假设的 IPC shell——不存在这样的 shell——会子类化 executor 并覆写 `spawn`。"

只删未来标记会把设计示例变成 shipped 类声明。显式标记假设。

### 删除转录时误删真事实

**原文：** "门禁通知叙述检查顺序；通知文本也是仓库 doc 门禁编译的对象。"

**过度修正：** "……"（整句作为叙述删除。）

**正确：** "通知文本是仓库 doc 门禁编译的对象。"

半句是叙述，另一半是有负载的耦合。命题共享一行时删子句，不删整句。

### 保留数字却丢掉来源

**原文：** "4 MiB 上限是实测的：最大生成模块是 3.1 MiB。"

**过度修正：** "上限 4 MiB；最大生成模块 3.1 MiB。"

**正确：** 保留 "measured"。

没有 "measured"，3.1 MiB 读作定义而非观察；提高上限前无人重测。
