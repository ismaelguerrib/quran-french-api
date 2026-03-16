# nest-read-only-resource-slice

## Metadata

- Category: backend-api
- Difficulty: medium
- Repo specificity: high

## Overview

Use this skill when adding or changing a read-only NestJS resource slice in this repository. The goal is to keep HTTP transport, read orchestration, persistence access, and contract documentation aligned without widening the change beyond the target feature.

## When To Use

- Adding a new `GET` list or detail endpoint.
- Extending an existing read-only resource with pagination, sorting, or filtered lookup.
- Reshaping a controller/service pair while preserving the current public contract.

## When Not To Use

- Database schema changes only.
- Seed-only work.
- Pure test work with no controller or service changes.
- Frontend or Angular tasks. This repository has no Angular runtime code today.

## Core Pattern

1. Start from the existing feature directory and preserve its public route names.
2. Keep the controller responsible for HTTP binding and contract description.
3. Keep the service responsible for read orchestration and not-found handling.
4. Keep persistence access out of the controller.
5. Keep list responses as `{ data, meta }` and detail responses as `{ data }` unless the existing endpoint already uses a different stable shape.
6. Update Swagger decorators with the behavior change instead of leaving stale schemas behind.

## Real Repository Examples

- [src/translation-sources/translation-source.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/translation-sources/translation-source.controller.ts)
- [src/translation-sources/translation-source.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/translation-sources/translation-source.service.ts)
- [src/ayah-translations/ayah-translation.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayah-translations/ayah-translation.controller.ts)
- [src/ayah-translations/ayah-translation.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayah-translations/ayah-translation.service.ts)
- [src/ayahs/ayahs.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayahs/ayahs.controller.ts)
- [src/ayahs/ayahs.service.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayahs/ayahs.service.ts)

## Anti-Patterns

- Adding `POST`, `PUT`, `PATCH`, or `DELETE` handlers.
- Querying the database from the controller.
- Mixing Swagger-only schema objects, HTTP parsing, and domain logic in one method until the controller becomes the real service.
- Renaming a stable route such as `/translation-source` as part of an unrelated cleanup.
- Returning raw entities directly from the controller.

## Implementation Checklist

- Read the existing feature module, controller, service, entity, and relevant tests.
- Preserve the current route prefix and response envelope.
- Introduce DTOs when inputs or outputs become more than trivial.
- Keep not-found and bad-input cases explicit.
- Update Swagger decorators and examples.
- Add or update unit tests and e2e tests for the changed behavior.

## Frequent Errors

- Turning a missing query parameter into a silent default when the current endpoint treats it as required.
- Returning different field nullability than the documented contract.
- Forgetting stable ordering for list endpoints.
- Leaving “should be defined” tests as the only coverage after changing behavior.

## Template

```ts
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  findAll(@Query() query: ResourceListQueryDto) {
    return this.resourceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: ResourceIdParamsDto) {
    return this.resourceService.findOne(params.id);
  }
}
```

## Integration With Other Skills

- Use `query-parameter-contract-hardening` when the endpoint accepts pagination, sorting, or filter inputs.
- Use `typeorm-read-access-patterns` when service changes affect query composition or repository access.
- Use `nestjs-read-path-test-matrix` before finishing the change.

## Test Strategy

- Unit-test controller validation and delegation when parsing rules change.
- Unit-test service mapping and not-found behavior.
- Add or update e2e coverage when routing or OpenAPI-visible behavior changes.

## Performance Notes

- Keep list queries ordered and bounded.
- Avoid unnecessary relation loading.
- Prefer projections or dedicated payload mapping over returning full entities.

## Debug Guide

- If the route is missing from OpenAPI, inspect [src/openapi/openapi.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/openapi/openapi.ts) and the controller decorators.
- If tests fail with database configuration errors, check how the module behaves under `NODE_ENV === 'test'` in [src/app.module.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/app.module.ts).
