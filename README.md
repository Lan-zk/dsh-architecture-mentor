# dsh-architecture-mentor

An installable [DSH](https://github.com/deepseek-ai/deepseek-harness) agent preset that turns real engineering work into adaptive architecture-learning experiences. The workspace is not a course: it is a mentor with persistent state, evidence-gated capability calibration, and a lean set of strategy and state skills.

> Status: V1 implemented. Pilot validation and release are deferred by the owner.

## What is included

- One-command installer (`scripts/install.mjs`) that copies `preset/` into the DSH user preset root.
- A preset composition (`preset/agent.cordis.yml`) trimmed from DSH `standard`.
- Workspace templates with five long-term memory record types, mentoring contract, and derived views.
- Six mentor skills: `mentor-workspace-init` plus five strategy/state skills.
- Same-source identity generation for the L0 persona and the workspace `AGENTS.md`.

## Quick start

```sh
# From this repository
node scripts/install.mjs
```

Then start a DSH session, select the preset named 架构导师, and let `mentor-workspace-init` initialize a learning workspace.

## Repository layout

| Path | Purpose |
| --- | --- |
| `docs/architecture-mentor/` | Current design baselines (what should be). |
| `.agents/notes/` | Decision and implementation records (what was done and why). |
| `.agents/skills/` | Local maintenance skills for doc and program rot. |
| `preset/` | The installable agent preset. |
| `scripts/` | Installer, smoke test, and identity generator. |
| `projects/` | Local reference copies of external projects, not git-managed. |

For Chinese documentation, see [README-zh.md](README-zh.md).
