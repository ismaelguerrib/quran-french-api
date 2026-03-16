# typeorm-read-access-patterns

## Metadata

- Category: persistence
- Difficulty: medium
- Repo specificity: high

## Overview

Use this skill when changing data access for read paths in this repository. It focuses on stable ordering, bounded pagination, strict filtering, explicit payload mapping, and safe evolution from the current `DataSource.getRepository(...)` pattern toward clearer repository injection where justified.

## When To Use

- Changing list queries, detail lookups, or read aggregation logic.
- Adding pagination or sorting to an endpoint.
- Introducing a repository facade because a service query is becoming hard to read.

## When Not To Use

- Pure controller contract work.
- Migration-only or seed-only changes.
- Cosmetic refactors with no effect on read queries.

## Core Pattern

1. Keep the service or repository in charge of query composition.
2. Use deterministic ordering for list endpoints.
3. Use strict allowlists for sort fields and filters.
4. Map entities to payloads explicitly instead of returning entities untouched.
5. If query logic becomes non-trivial, move it behind an injected repository or a dedicated repository facade.

## Real Repository Examples

- List pagination with `findAndCount` in [src/ayah-translations/ayah-translation.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayah-translations/ayah-translation.service.ts)
- Sort allowlist consumed by persistence in [src/translation-sources/translation-source.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/translation-sources/translation-source.service.ts)
- Multi-repository read orchestration in [src/ayahs/ayahs.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayahs/ayahs.service.ts)
- Standalone data source for CLI tooling in [src/database/data-source.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/database/data-source.ts)

## Anti-Patterns

- Unordered list queries.
- Dynamic sort fields passed straight from user input.
- Returning entities with unused relations and columns.
- Spreading query construction across controller and service.
- Hiding persistence errors behind broad catch-all logic with no context.

## Implementation Checklist

- Identify whether the change belongs in a service or a dedicated repository abstraction.
- Keep pagination bounded and deterministic.
- Keep sorting and filters on explicit allowlists.
- Select or map only the fields required by the API contract.
- If using `DataSource`, keep repository acquisition in one place.
- If migrating to injected repositories, update the module wiring in the same change.

## Frequent Errors

- Forgetting that `find()` without `order` is not a stable public contract.
- Using a loose cast to satisfy TypeORM order typing instead of constraining keys earlier.
- Loading relations eagerly for convenience.
- Mixing persistence entities with API response types.

## Template

```ts
async findAll(query: ResourceListQuery): Promise<ResourceListResponse> {
  const [rows, total] = await this.resourceRepository.findAndCount({
    order: { id: 'ASC' },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize,
  });

  return {
    data: rows.map((row) => this.toPayload(row)),
    meta: { page: query.page, pageSize: query.pageSize, total },
  };
}
```

## Integration With Other Skills

- Combine with `query-parameter-contract-hardening` when the query inputs are changing.
- Combine with `nest-read-only-resource-slice` when routes or payloads change.
- Finish with `nestjs-read-path-test-matrix`.

## Test Strategy

- Unit-test mapping and not-found cases.
- Mock repository responses for service tests when the logic is simple.
- Add integration coverage if query composition becomes complex enough to justify it.

## Performance Notes

- Preserve index-friendly filters and ordering.
- Avoid relation loading unless the endpoint contract needs it.
- Keep deep pagination concerns visible if a list could grow large.

## Debug Guide

- If the service fails in tests with “Database connection is not configured”, inspect how the service gets its repository and whether the test should mock the repository boundary instead.
- If a list endpoint returns inconsistent order, inspect the `order` clause first.
