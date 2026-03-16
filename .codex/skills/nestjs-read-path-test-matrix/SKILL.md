# nestjs-read-path-test-matrix

## Metadata

- Category: testing
- Difficulty: medium
- Repo specificity: high

## Overview

Use this skill when a read path changes and the repository needs meaningful coverage instead of placeholder tests. The current codebase has real endpoint behavior but many controller and service tests only assert that the class is defined.

## When To Use

- Any change to controller parsing, service orchestration, payload mapping, routing, bootstrap, or OpenAPI exposure.
- Replacing placeholder tests with behavior-oriented tests.
- Adding a new read endpoint.

## When Not To Use

- Pure documentation changes.
- Migration-only work with no API impact.
- Large infrastructure testing changes beyond the touched feature.

## Core Pattern

1. Add controller unit tests for parameter validation and service delegation.
2. Add service unit tests for mapping, pagination metadata, and not-found behavior.
3. Add e2e coverage when routing, bootstrap, or OpenAPI exposure changes.
4. Prefer a small matrix of meaningful cases over many duplicate happy-path assertions.

## Real Repository Examples

- Minimal controller placeholder test in [src/translation-sources/translation-source.controller.spec.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/translation-sources/translation-source.controller.spec.ts)
- Minimal service placeholder test in [src/ayah-translations/ayah-translation.service.spec.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/ayah-translations/ayah-translation.service.spec.ts)
- Existing bootstrap and OpenAPI e2e coverage in [test/app.e2e-spec.ts](/Users/ismaelguerrib/Codebase/quran-french-api/test/app.e2e-spec.ts)
- Health controller behavior test in [src/app.controller.spec.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/app.controller.spec.ts)

## Anti-Patterns

- Ending with only `should be defined` after changing behavior.
- Testing private helper methods directly instead of public behavior.
- Duplicating controller and service assertions for the same outcome without adding value.
- Ignoring not-found and invalid-input cases.

## Implementation Checklist

- Identify the public behavior changed by the patch.
- Add at least one failing or edge-path test if behavior changed.
- Verify response shape, not just status or class existence.
- If OpenAPI-visible behavior changed, update e2e checks as needed.
- Keep mocks narrow and intention-revealing.

## Frequent Errors

- Mocking too deep and re-testing implementation details.
- Skipping pagination metadata assertions.
- Missing the unhappy path for invalid query parameters.
- Forgetting that `NODE_ENV === 'test'` disables database imports in [src/app.module.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/app.module.ts).

## Template

```ts
it('rejects an invalid page size', async () => {
  await expect(controller.findAll('1', '0')).rejects.toThrow(BadRequestException);
});

it('returns mapped payload data', async () => {
  await expect(service.findOne(1)).resolves.toEqual({
    data: { id: 1, code: 'example', label: null, language: 'fr' },
  });
});
```

## Integration With Other Skills

- Use after `nest-read-only-resource-slice`.
- Use after `query-parameter-contract-hardening`.
- Use after `typeorm-read-access-patterns`.

## Test Strategy

- Unit tests first for parsing and mapping.
- E2E tests only for route wiring, bootstrap behavior, and contract exposure.
- Keep the suite targeted to changed behavior to avoid brittle noise.

## Performance Notes

- Fast unit tests should carry most of the coverage.
- Keep e2e tests small and focused because they bootstrap the full Nest application.

## Debug Guide

- If e2e tests fail because routes are missing, inspect `app.setGlobalPrefix('v1')` in [src/main.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/main.ts) and the OpenAPI registration in [src/openapi/openapi.ts](/Users/ismaelguerrib/Codebase/quran-french-api/src/openapi/openapi.ts).
- If controller tests fail unexpectedly, check whether validation currently happens manually in the controller or through DTO binding.
