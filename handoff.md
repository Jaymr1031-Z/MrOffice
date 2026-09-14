# Codex Handoff

## Current Goal

Convert GenOffice into a conventional open-source desktop office suite by removing Genspark-specific account login, credits/charging, cloud projects, CLI dependencies, and cloud-only AI features. Preserve ordinary functionality such as local document editing, BYOK providers, Codex CLI support, and web/image search.

## Completed

- Removed the Genspark AI provider, login credentials, billing/credit error type, and Genspark-specific request headers from `packages/ai-provider` and `packages/agent-core`.
- Removed Genspark CLI/auth source and tests from `packages/ai-search`; search now uses Serper, Tavily, and DuckDuckGo.
- Removed shell account/cloud-project entry points, cloud-project IPC, onboarding credits text, and packaged Genspark CLI resources.
- Removed Genspark login and cloud image-generation IPC from Docs, Sheets, PDF, Markdown, and Slides.
- Slides now uses only the local structured-spec-to-PPTX page-generation path; cloud page generation, cloud image generation, and media analysis were removed.
- Updated key Slides and provider tests to use the local path/Codex fallback rather than the removed provider.
- Regenerated `package-lock.json` with `npm install --package-lock-only --ignore-scripts`.

## Key Technical Decisions

- Default provider is `codex`; a configured API-key provider or a keyless custom endpoint remains selectable through `activeProvider`.
- Do not remove normal domain terms such as mathematical integrals, spreadsheet `member` fields, coordinate points, or output-token budgets merely because Chinese text may contain “积分”.
- Do not replace removed cloud image generation with a new third-party image service. Image search remains available.
- Preserve the local Slides pipeline: renderer LLM output -> `parsePageSpec`/`buildPagePptx` -> local temporary PPTX marker -> existing landing pipeline.

## Core Files Changed

- AI/provider/search core: `packages/ai-provider/src/*`, `packages/agent-core/src/electron-transport.ts`, `packages/ai-search/src/index.ts`.
- App IPC/UI: `apps/{docs,sheets,slides,pdf,markdown}/src/{main,preload,renderer,shared}`.
- Shell: `apps/shell/src/main/index.ts`, `apps/shell/src/renderer/src/{Home,SettingsModal,Onboarding}.tsx`, `apps/shell/electron-builder.cjs`.
- Tests: `apps/slides/tests/*`, `packages/{agent-core,ai-provider}/tests/*`.

## Validation

Confirmed on 2026-09-14:

```powershell
npm install --package-lock-only --ignore-scripts
npm run typecheck
```

- Lockfile update completed; npm audit reported 5 existing dependency vulnerabilities (2 moderate, 3 high). No automated remediation was applied.
- Full `npm run typecheck` exited 0 after the changes.
- `npm test` was run but stopped in `@genoffice/electron-utils`: 7/123 tests failed before reaching later workspaces. Failures are Windows-specific test assumptions around POSIX path separators, read-only-directory behavior under an Administrator account, and mocked `fetchRemoteImage` calls. No direct cause from the Genspark cleanup has been established; inspect before changing those tests.
- Targeted cleanup coverage passed: `@genoffice/ai-search` (9 tests), `@genoffice/agent-core` (77 tests), `@genoffice/ai-provider` (163 tests), and `@genoffice/slides` (702 passed, 12 skipped). Slides emits non-fatal jsdom canvas warnings.
- Desktop runtime smoke tests, Electron packaging, and visual UI checks have not yet been run.

## Current State And Blockers

- There is no external blocker. Worktree is intentionally dirty and must be preserved.
- A prior docs/metadata patch was attempted but rejected as one hunk did not match `tools/gen-third-party-notices.mjs`; that multi-file patch was not applied. README, CONTRIBUTING, PRIVACY, notices, and repository-brand URLs still need focused edits.
- Runtime/product strings and SVG marks still contain Genspark branding in Docs, Sheets, Slides, PDF, and Markdown. Some are visual marks; replace them consistently with the existing generic AI/sparkle icon, rather than deleting an AI entry point.

## Known Issues

- `apps/shell/src/renderer/src/Home.tsx` currently uses a literal `Oldest` sort label because removed cloud-sort translation keys no longer exist. Add a normal i18n key across `strings.ts` before release.
- Genspark-related historical issue comments and test fixture HTML may remain; distinguish harmless historical fixture text from active code paths, but remove public-facing Genspark branding and references.
- `README.md`, `CONTRIBUTING.md`, `PRIVACY.md`, `tools/gen-third-party-notices.mjs`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, package metadata, updater URLs, and GitHub URLs still reference the original upstream. Renaming/rehosting needs an explicit target repository/maintainer choice; do not invent one.

## Rejected Or Failed Approaches

- Do not run `git reset --hard`, checkout, or clean: all current changes belong to this task/worktree and have not been committed.
- Do not use a Genspark account as a fallback for incomplete BYOK configuration. Fallback is Codex.
- Do not keep cloud slide generation conditionally disabled; the whole Genspark cloud path was intentionally removed.

## Workspace

- Repository: `D:\Users\Administrator\Desktop\workCode\genoffice`
- Branch: `main`
- HEAD: `fa58fff`
- Worktree: many modified/deleted files listed by `git status --short`; no changes staged or committed in this session.

## Next Steps

1. Remove obsolete login/credit localization keys (`errGskNotLoggedIn`, `errGskCli`, `aiGskLoginBtn`, `aiCreditsExhausted`, account status labels) from app translation sources, keeping type consistency.
2. Replace user-facing `GensparkMark`/`Genspark AI` UI labels with a generic AI icon/name across Docs, Sheets, Slides, PDF, and Markdown; then delete unreferenced mark components.
3. Clean docs/notices/package metadata. Ask the user for a replacement upstream URL and maintainer/vendor identity before changing GitHub release/security/updater URLs or publisher information.
4. Run `npm test`; fix regressions introduced by the removed provider paths.
5. Run `npm run typecheck` again after each logical cleanup; then run the Windows package command (`npm run dist:win`) and verify the installer/sidecar only if the user wants a fresh EXE.

## Do Not Repeat

- The full typecheck has already passed after the core/app changes. Rerun it only after further edits, and report the fresh output.
- `npm install --package-lock-only --ignore-scripts` has already updated the lockfile; do not manually edit lockfile entries.
- Genspark cloud IPC and Slides cloud generation have already been removed; do not re-add compatibility shims.

## Suggested Skills

- `session-handoff` or `handoff` to refresh this file when pausing again.
- `verification-before-completion` before claiming final completion.
- `release-skills` only if a new Windows installer is requested after the cleanup is fully tested.
