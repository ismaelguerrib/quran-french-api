# AGENTS.md

## Project Context

- Current repository state: NestJS 11 + TypeORM 0.3 + PostgreSQL + Swagger, backend only.
- Project standard to preserve across future work: Angular + NestJS + RxJS with strict TypeScript, SOLID boundaries, and explicit naming.
- Public API is read-only. Do not introduce `POST`, `PUT`, `PATCH`, or `DELETE` endpoints unless the task explicitly redefines the product scope.
- Existing runtime code lives under `src/`. Database tooling lives under `src/database/`. Agent skills live under `.codex/skills/`.

## Working Rules

- Explore before editing. Read `package.json`, relevant `tsconfig*`, the target module, and existing tests before making changes.
- Follow the nearest `AGENTS.md`. Root rules apply everywhere unless a closer file narrows them.
- Keep changes minimal and local to the task. Do not refactor unrelated files to “clean up” the codebase.
- Preserve public contracts unless the task explicitly allows a breaking change: routes, response shapes, environment variable names, migration history, and OpenAPI-visible behavior.
- When a change touches behavior, update or add tests in the same change. Prefer targeted tests over broad rewrites.
- Do not modify generated output in `dist/`.

## Architecture Guardrails

- Keep controllers thin: HTTP transport, validation binding, and response mapping only.
- Keep services focused: read use cases, orchestration, and domain-level decisions. Do not bury HTTP parsing or Swagger concerns in services.
- Keep persistence explicit: prefer `TypeOrmModule.forFeature(...)` and injected repositories when touching a module deeply enough to justify it. Do not access the database from controllers.
- Prefer DTOs and `ValidationPipe` for query and path validation instead of duplicating ad hoc parsing helpers across controllers.
- Keep TypeScript explicit where it improves safety or comprehension. Avoid `any`, opportunistic casts, weakly discriminated unions, and “smart” type tricks that hide intent.
- Use explicit names. Do not introduce abbreviations such as `obj`, `res`, `val`, `tmp`, `cfg`, `svc`, or `data` when a precise role name is available. Standard stack acronyms such as API, DTO, URL, ID, and RxJS are fine.
- Apply SOLID pragmatically: one responsibility per class/file, clear dependency direction, composition over hidden coupling, no catch-all helpers or god services.
- RxJS is part of the project standard, but only use reactive composition where it simplifies async orchestration or derived state. Do not add reactive code as decoration.
- If Angular code is added later, keep components presentation-focused, push business logic into services/facades, and keep RxJS or signal boundaries explicit.

## Code Change Policy

- Match local patterns before introducing a new one. If the local pattern is weak, improve it only where the task directly benefits.
- Update types, Swagger/OpenAPI documentation, tests, and environment docs when the change alters those surfaces.
- Refactors are allowed only when they are necessary to deliver the requested change more safely.
- Do not rename files, symbols, routes, or environment variables unless the task requires it.

## Validation Checklist

- `npm run build` when TypeScript or runtime wiring changes.
- `npm run lint` when TypeScript source changes.
- `npm test` when unit-tested behavior changes.
- `npm run test:e2e` when endpoint contracts, routing, bootstrap, or OpenAPI exposure changes.
- Review impact on:
  - public API contract
  - database schema or seed data
  - environment configuration
  - read-only guarantees

## Directory-Specific Guidance

- See [src/AGENTS.md](/Users/ismaelguerrib/Codebase/quran-french-api/src/AGENTS.md) for backend module conventions.
- See [src/database/AGENTS.md](/Users/ismaelguerrib/Codebase/quran-french-api/src/database/AGENTS.md) for migrations and seed scripts.
- Add new local `AGENTS.md` files only when a subtree has stable rules that differ from the root and are likely to be reused.
