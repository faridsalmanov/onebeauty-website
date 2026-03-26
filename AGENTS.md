<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project may use a newer or changed Next.js version. Do not assume APIs, file structure, routing behavior, caching, or server/client component rules from prior knowledge.

Before writing or editing any Next.js code:

1. Read the relevant local docs in `node_modules/next/dist/docs/` for the feature you are touching.
2. Check this codebase’s existing patterns before introducing a new one.
3. Prefer the project’s current App Router / Pages Router conventions exactly as already used here.
4. Do not invent deprecated patterns. Heed deprecation warnings and migration notes.
5. Verify whether the file must be a Server Component or Client Component before adding hooks, browser APIs, or `"use client"`.
6. Confirm data fetching, caching, metadata, route handlers, and navigation APIs against local docs before coding.
7. When changing layout, background effects, routing, or rendering behavior, inspect `app/layout.*`, `app/page.*`, shared components, and global styles first.
8. Keep changes minimal and consistent with the current codebase.
9. After edits, run the project checks if available (lint, typecheck, build) and fix any issues caused by the change.
10. If framework behavior is unclear, state the uncertainty briefly and base the implementation on the local docs, not memory.

Specific expectations for this repo:
- Do not assume older Next.js examples are valid.
- Do not replace working project structure with generic template code.
- Prefer copy-pasteable production-ready code over pseudo-code.
- When editing visual/background effects, ensure layering, positioning, and stacking context work with the existing layout.
<!-- END:nextjs-agent-rules -->