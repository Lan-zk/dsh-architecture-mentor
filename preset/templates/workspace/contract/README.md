# contract/ — 用户拥有的权威状态

`current.md` 是当前有效的 Mentoring Contract；`history/` 保存被替代版本。
导师不能根据 Learner Model 推断自动修改契约；修改走门禁三。

## 门禁三：必答问题 ↔ 必填字段 ↔ 检查清单

| 门禁三必答问题 | 契约版本必填字段 | 检查清单（mentoring-contract-management 执行） |
| --- | --- | --- |
| 旧契约和新契约是什么 | `old_version_ref` + 正文八节新值 | □ 新旧差异已展示 |
| 触发修改的现实变化或新证据 | `reason` | □ 原因可追溯 |
| 导师建议 vs 用户决定 | `proposed_by` | □ 提出者已标注 |
| 用户明确确认或既有授权覆盖 | `user_confirmation` | □ 确认或授权证据在场 |
| 生效时间 | `effective_at` | □ 已记录 |
| 替代关系 | `supersedes` | □ 指向被替代版本 |
| 对教学计划的影响评估 | `teaching_impact` | □ 已评估并说明 |

历史版本命名 `YYYY-MM-DD-slug.md`；`current.md` 始终指向当前版本内容。
这里不放学习者能力记录、导师诊断或任何从 Learner Model 派生的结论。
