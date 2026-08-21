# scripts/ — 构建与校验脚本

- `install.mjs`：安装器，把 `preset/` 复制到 DSH 用户预设根（幂等、升级备份、冲突拒绝）。
- `smoke-install.mjs`：安装器冒烟测试（`node scripts/smoke-install.mjs`）。
- `generate-identity.mjs`：身份同源生成器，从 `preset/src/mentor-identity.md` 生成 persona 与 `preset/templates/AGENTS.md`（`node scripts/generate-identity.mjs --check` 防漂移）。

提交前校验：`node scripts/smoke-install.mjs`、`node scripts/generate-identity.mjs --check`、`git diff --check`。
