# query-parameter-contract-hardening

## Metadata

- Category: api-contract
- Difficulty: medium
- Repo specificity: high

## Overview

Use this skill when a NestJS endpoint in this repository accepts path or query parameters and the contract must remain explicit, validated, and documented. The repository currently duplicates manual parsing helpers across controllers; this skill keeps that behavior from drifting further.

## When To Use

- Adding or changing `page`, `pageSize`, `sortBy`, `sortDir`, or resource identifiers.
- Replacing controller-local parsing helpers with DTO-based validation.
- Tightening an endpoint contract without changing its external meaning.

## When Not To Use

- Pure service or repository work with no HTTP parameter surface.
- Database-only tasks.
- Changes that intentionally redesign the whole API contract and have already been approved as breaking changes.

## Core Pattern

1. Define the allowed inputs explicitly.
2. Prefer DTO classes plus `ValidationPipe` over hand-rolled parsing repeated in each controller.
3. Keep allowlists for sorting and filtering explicit and narrow.
4. Keep defaults explicit in code and Swagger.
5. Preserve route and field names unless a breaking change is intentional.

## Real Repository Examples

- Manual positive integer parsing in [src/ayahs/ayahs.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayahs/ayahs.controller.ts)
- Manual pagination parsing in [src/ayah-translations/ayah-translation.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayah-translations/ayah-translation.controller.ts)
- Manual sort allowlists in [src/translation-sources/translation-source.controller.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/translation-sources/translation-source.controller.ts)
- Environment validation style in [src/config/env.validation.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/config/env.validation.ts)

## Anti-Patterns

- Accepting free-form `sortBy` values.
- Parsing numbers in multiple controllers with slightly different rules.
- Silently coercing invalid input instead of rejecting it.
- Returning `404` for malformed input that should be a `400`.
- Leaving Swagger docs stale after changing validation rules.

## Implementation Checklist

- List the allowed query and path parameters.
- Decide whether the current contract must be preserved exactly or can be improved.
- Introduce DTOs with validation decorators when the endpoint has more than trivial inputs.
- Bind validation as close to the controller boundary as possible.
- Keep page size limits explicit.
- Mirror defaults and enums in Swagger decorators.
- Add tests for valid input, invalid input, and boundary values.

## Frequent Errors

- Forgetting to cap `pageSize`.
- Moving validation into the service and making the controller opaque.
- Using broad casts after validation instead of typed DTO fields.
- Introducing abbreviations such as `qry`, `cfg`, or `res` in DTOs or helper names.

## Template

```ts
export class ResourceListQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize = 20;
}
```

## Integration With Other Skills

- Pair with `nest-read-only-resource-slice` for controller/service changes.
- Pair with `nestjs-read-path-test-matrix` to cover validation outcomes.

## Test Strategy

- Controller unit tests for bad input and delegation.
- E2E tests for `400` behavior on invalid query strings.
- OpenAPI checks when enum or default values change.

## Performance Notes

- Reject invalid input early to avoid wasted database work.
- Keep sort and filter allowlists aligned with indexed columns when possible.

## Debug Guide

- If validation does not run, inspect bootstrap behavior in [src/main.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/main.ts) and check whether the controller uses DTO binding or raw strings.
- If Swagger shows old defaults, verify the relevant `@ApiQuery` or `@ApiParam` decorators in the controller.
