# AGENTS.md

## Scope

- Applies to all runtime NestJS code under `src/`, except where `src/database/AGENTS.md` is more specific.

## Module Structure

- Keep feature code grouped by feature directory, as currently done in `src/ayahs/`, `src/ayah-translations/`, and `src/translation-sources/`.
- Prefer this shape when expanding a feature:
  - controller for HTTP transport
  - service for read use cases
  - `dto/` for query and response contracts when inputs or outputs grow
  - `entities/` for TypeORM entities
  - `repositories/` only when query composition becomes substantial

## Backend Guardrails

- Do not add mutating HTTP endpoints.
- Keep response envelopes stable. Existing list endpoints return `{ data, meta }`; detail endpoints return `{ data }`.
- Do not rename existing public routes such as `/ayahs`, `/ayah-translations`, or `/translation-source` unless the task explicitly accepts a breaking API change.
- Update Swagger decorators in the same change as the controller behavior.
- Prefer DTO classes with validation decorators over repeated `parsePositiveInt`, `parseSortBy`, or similar controller-local parsing helpers.
- If you touch persistence wiring substantially, prefer injected repositories over optional `DataSource` access. If you keep `DataSource`, contain it inside the service and keep failure modes explicit.
- Keep entity relations non-eager by default. Load only what the endpoint needs.
- Keep query sorting and filtering on strict allowlists.

## Naming And Types

- Public payload types, DTOs, services, and entities must use explicit names that describe their domain role.
- Avoid duplicate type names with different meanings. For example, do not keep both an API payload `Ayah` and a persistence or domain `Ayah` in separate files unless the distinction is justified and named clearly.
- Prefer `string | null` or `number | null` over ambiguous optional fields in API payloads when the contract intentionally returns nulls.

## Testing

- Add or update unit tests when controller parsing, service orchestration, or payload mapping changes.
- Add or update e2e tests when routes, OpenAPI exposure, or bootstrap behavior changes.
- “Should be defined” tests are not enough for behavioral changes.
