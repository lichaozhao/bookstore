# AI Coding 状态外化
适用于需要跨 session 维护状态的长任务。

## 工作流程
- 在 `docs/status.md` 维护任务状态
- 每次任务都是先读取 `docs/status.md`，然后工作，工作完成后覆盖更新 `docs/status.md`
- 工作中，信息不足时，把问题写进 Open Questions 再问我，不要盲改。

## `docs/status.md` 内任务状态包含：
- Goal：当前任务的最终目标（一句话）
- Plan：步骤清单，标注 [done] / [doing] / [todo]
- Facts：已确认的代码事实（如"auth 用 JWT RS256"）
- Decisions：已做的设计决策 + 一句话理由
- Open Questions：尚未解决的问题
- Next Action：下一步要做什么

## 规则
- `docs/status.md` 是状态快照，不是日志，不要追加，要覆盖。
- 不要把对话原文抄进去，只写结论。
- 已做的决策不要反复推翻，除非有新事实。
- 文件控制在 200 行以内。