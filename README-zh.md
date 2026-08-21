# dsh-architecture-mentor

一个可安装的 [DSH](https://github.com/deepseek-ai/deepseek-harness) 智能体预设：把真实工程工作转化为自适应架构学习体验。工作区不是课程，而是一个拥有持续状态的导师系统，通过证据门禁校准能力状态，并配有一套精简的策略技能与状态技能。

> 状态：V1 已落地；npm 正式版 `0.1.1` 已发布。试点验证由仓库所有者延后。

## 包含内容

- 一条命令安装器（`scripts/install.mjs`）：把 `preset/` 复制到 DSH 用户预设根。
- 从 DSH `standard` 裁剪的预设组合（`preset/agent.cordis.yml`）。
- 工作区模板：五类长期记忆记录、导师契约、派生视图。
- 六个导师技能：`mentor-workspace-init` 加五个策略/状态技能。
- L0 persona 与工作区 `AGENTS.md` 的同源生成。

## 快速开始

### 从 npm 安装（已发布）

```sh
npm exec --yes --package=dsh-architecture-mentor -- architecture-mentor-install
```

或全局安装：

```sh
npm i -g dsh-architecture-mentor
architecture-mentor-install
```

### 从源码安装

```sh
# 在本仓库目录
node scripts/install.mjs
```

然后启动 DSH 会话，选择名为"架构导师"的预设，让 `mentor-workspace-init` 初始化学习工作区。

## 更新已安装的预设

```sh
npm exec --yes --package=dsh-architecture-mentor@0.1.1 -- architecture-mentor-install
```

安装器会比较 `preset/VERSION` 与已安装版本：包更新则备份旧预设并替换，版本相同则为 no-op。
若想强制刷新同版本，先删除 `~/.dsh/.agent-presets/architecture-mentor` 再执行。

## 仓库布局

| 路径 | 作用 |
| --- | --- |
| `docs/architecture-mentor/` | 当前设计基线（应当是什么）。 |
| `.agents/notes/` | 决策与实现记录（做了什么、为什么）。 |
| `.agents/skills/` | 本地维护技能（文档/程序腐烂审计）。 |
| `preset/` | 可安装的智能体预设。 |
| `scripts/` | 安装器、冒烟测试与身份生成器。 |

英文版见 [README.md](README.md)。
