# AGENTS.md

## Scope

- Applies to `src/database/`, including migrations, the standalone data source, and seed scripts.

## Database Change Rules

- Database writes are allowed here only for explicit CLI workflows such as migrations and seeds. They are never allowed in public read endpoints.
- Keep migrations deterministic, forward-safe, and reversible when possible.
- Keep seed scripts idempotent. Prefer `upsert` or other explicit conflict handling over blind inserts.
- Do not place application business logic in migrations or seeds.
- Keep the standalone data source aligned with entity registration and environment validation.

## Safety

- Do not edit old migrations unless the task explicitly requires migration repair.
- When entities change, update the corresponding migration strategy deliberately. Do not rely on `synchronize`.
- Seed scripts must validate their assumptions and fail loudly on missing prerequisite data.
- Keep transaction scope tight and explicit.

## Verification

- If you change environment-dependent database code, review `src/config/database.config.ts` and `src/config/env.validation.ts` in the same pass.
- If a seed or migration changes public API expectations, call that out explicitly in your final summary.
