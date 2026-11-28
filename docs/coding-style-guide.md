# Coding style guide

## Naming

- Use lowercase filenames with hyphens between words and lowercase extensions
  across the repository, including for components, hooks, tests, and assets.
- Use uppercase basenames and lowercase `.md` extensions for conventional
  root documents such as `AGENTS.md`, `README.md`, and `LICENSE.md`.
- Keep required tool and framework filenames such as `__root.tsx`,
  `product.$id.tsx`, and `_redirects`. Keep existing migration names.
- Use UpperCamelCase (PascalCase) for React components and lowerCamelCase for
  hooks, other functions, and variables.

## TypeScript and React

- Use `import type` for type-only imports. Let TypeScript infer obvious types
  and use explicit types where they clarify a contract.
- Use `@/` for imports across areas of `src/` and relative imports for nearby
  modules. Reuse existing components and helpers when they fit.
- Use Tailwind classes for styling and the shared `cn` helper in
  `src/utils/cn.ts` when combining conditional classes.

## Routes and server code

- Define file-based routes in `src/routes/`. Keep route-specific components and
  helpers near their routes, using `-components/` where appropriate. Put shared
  UI in `src/components/`.
- Make route changes in the route files and let TanStack Router regenerate
  `src/route-tree.gen.ts`. The shared formatter skips this generated file.
- Keep database access and secrets in server code. Validate server function
  inputs at the boundary using the existing Zod patterns.

## Local checks

- Run project commands through pnpm to use the Node.js runtime pinned in
  `package.json`. See the [development setup](../README.md#development).
- Run `pnpm lint` for Oxlint and `pnpm fmt <path>` to format changed files with
  Oxfmt. Both commands use the project-local Vite+ CLI and read their settings
  from `vite.config.ts`. Keep formatting changes scoped to the files you edit.
- Format on save uses the Oxc extension (`oxc.oxc-vscode`) in VS Code and
  `pnpm` in Zed. Open the repository root as the workspace so both editors use
  the project's formatter settings.
- Codex and Claude Code run safe Oxlint fixes followed by Oxfmt at the end of
  each turn. The hooks compare the current Git worktree with a snapshot taken
  when the prompt was submitted and fix files with new edits. If the starting
  snapshot is unavailable, they skip autofixes. Review and trust both Codex
  hooks in `/hooks` when prompted.
- Place Vitest tests alongside the code they cover as `*.test.ts`. Run
  `pnpm test` to check behavior and `pnpm build` for changes that affect the app
  build.
