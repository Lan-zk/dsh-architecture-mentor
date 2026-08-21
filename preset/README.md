# preset/ — 可安装的 DSH 智能体预设

本目录由 `scripts/install.mjs` 整体复制到 `$DSH_HOME/.agent-presets/architecture-mentor/`。

- `agent.cordis.yml`：预设组合（persona、工具、技能装载、plan/compaction）。
- `preset.yml`：roster 展示元数据（名称/描述）。
- `VERSION`：预设版本号，安装器与工作区标记共用。
- `src/`：单一身份源（persona + AGENTS 段），由生成器产出两份产物。
- `skills/`：随预设分发的 6 个导师技能。
- `templates/`：工作区初始化模板（AGENTS.md 与 workspace 骨架）。

工作区 `.agents/skills/` 只是用户覆盖层，不随本目录分发。
