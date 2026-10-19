<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Agent Guidance

This project has reusable agent workflows in [`../.agents/skills/`](../.agents/skills/). Read the relevant `SKILL.md` before starting work. Use the workflow that matches the request rather than recreating it.

### Working agreements

- Read relevant source, documentation, `GLOSSARY.md`, and ADRs before editing.
- Preserve existing behavior, architecture, terminology, and localization.
- Make precise, focused changes; do not fix unrelated issues.
- Follow the project's domain language. Resolve ambiguous terms before implementing.
- Prefer deep modules: keep interfaces small and hide complexity behind them.
- Do not commit secrets, credentials, generated artifacts, or temporary files.

### Development workflow

- For features and bug fixes, use [`implement`](../.agents/skills/implement/) and follow [`tdd`](../.agents/skills/tdd/).
- Write tests against public interfaces and agreed seams, not implementation details.
- Work in vertical slices: red test, minimal green implementation, then refactor.
- Run targeted tests and type checking during development, then the applicable full suite before completion.
- Verify the requested behavior directly; do not claim success from a proxy check.
- Use [`diagnosing-bugs`](../.agents/skills/diagnosing-bugs/) for bugs that need a tight reproduction loop.

### Design and documentation

- Use [`codebase-design`](../.agents/skills/codebase-design/) for module, interface, seam, adapter, depth, leverage, and locality decisions.
- Use [`domain-modeling`](../.agents/skills/domain-modeling/) when clarifying domain terms, updating `GLOSSARY.md`, or recording ADRs.
- Use [`writing-for-agents`](../.agents/skills/writing-for-agents/) when modifying agent instructions or skills.
- Keep documentation synchronized with behavior and workflow changes.

### Delivery and safety

- Use [`code-review`](../.agents/skills/code-review/) to review completed changes.
- Use [`pr`](../.agents/skills/pr/) when preparing a pull-request description.
- Use [`triage`](../.agents/skills/triage/) for incoming issues or pull requests, and [`to-tickets`](../.agents/skills/to-tickets/) for turning a specification into implementation tickets.
- Use [`git-guardrails-claude-code`](../.agents/skills/git-guardrails-claude-code/) before potentially destructive Git operations.
- If work spans multiple sessions, use [`to-spec`](../.agents/skills/to-spec/), then [`to-tickets`](../.agents/skills/to-tickets/), and implement blockers first.

### Other available workflows

Consult the matching skill for [`ask-matt`](../.agents/skills/ask-matt/), [`chief-of-staff`](../.agents/skills/chief-of-staff/), [`claude-handoff`](../.agents/skills/claude-handoff/), [`grill-me`](../.agents/skills/grill-me/), [`grill-with-docs`](../.agents/skills/grill-with-docs/), [`grilling`](../.agents/skills/grilling/), [`handoff`](../.agents/skills/handoff/), [`implement-spec`](../.agents/skills/implement-spec/), [`improve-codebase-architecture`](../.agents/skills/improve-codebase-architecture/), [`loop-me`](../.agents/skills/loop-me/), [`migrate-to-shoehorn`](../.agents/skills/migrate-to-shoehorn/), [`prototype`](../.agents/skills/prototype/), [`research`](../.agents/skills/research/), [`retro`](../.agents/skills/retro/), [`scaffold-exercises`](../.agents/skills/scaffold-exercises/), [`setup-matt-poc-skills`](../.agents/skills/setup-matt-poc-skills/), [`setup-pre-commit`](../.agents/skills/setup-pre-commit/), [`setup-ts-deep-modules`](../.agents/skills/setup-ts-deep-modules/), [`teach`](../.agents/skills/teach/), [`to-questionnaire`](../.agents/skills/to-questionnaire/), [`to-spec`](../.agents/skills/to-spec/), [`wait-what`](../.agents/skills/wait-what/), [`wayfinder`](../.agents/skills/wayfinder/), [`wizard`](../.agents/skills/wizard/), [`writing-beats`](../.agents/skills/writing-beats/), [`writing-fragments`](../.agents/skills/writing-fragments/), and [`writing-shape`](../.agents/skills/writing-shape/).
