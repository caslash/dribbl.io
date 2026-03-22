---
name: reat-unit-test-engineer must read apps/web/test/CLAUDE.md
description: When invoking the  reat-unit-test-engineer agent, always instruct it to read apps/web/test/CLAUDE.md first — the agent does not do this automatically and will violate project conventions if not told explicitly.
type: feedback
---

Always instruct the reat-unit-test-engineer agent to read `/Users/cameronslash/Developer/dribbl.io/apps/web/test/CLAUDE.md` before writing any tests.

**Why:** The agent previously ignored this file and violated multiple conventions — it co-located the test file in `src/` instead of `test/`, used `.test.tsx` instead of `.spec.tsx`, and skipped the structured mock system (`ComponentsMock`, `HooksMock`, aggregate barrel pattern). The user caught this and had to re-run the agent with explicit instructions.

**How to apply:** In every reat-unit-test-engineer prompt, include an explicit instruction like: "Read `/Users/cameronslash/Developer/dribbl.io/apps/web/test/CLAUDE.md` first — it is the authoritative source for test file location, naming, and mock conventions. Follow it exactly."
