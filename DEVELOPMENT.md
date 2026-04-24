# Development Guide

This guide provides detailed information for developers working on the bookstore API & UI test framework.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Adding New Tests](#adding-new-tests)
- [Adding New API Endpoints](#adding-new-api-endpoints)
- [Adding New UI Pages](#adding-new-ui-pages)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Best Practices](#testing-best-practices)
- [Debugging Tips](#debugging-tips)

## Architecture Overview

### Layer Structure

```
src/
├── api/           # API layer - HTTP clients and services
├── ui/            # UI layer - Page Objects
├── builders/      # Test data generation
├── fixtures/      # Test setup and teardown
├── helpers/       # Utilities and assertions
├── models/        # TypeScript interfaces
├── config/        # Configuration management
└── tests/         # Actual test files
```

### Key Patterns

1. **Page Object Model**: UI pages extend `BasePage` and encapsulate element interactions
2. **Builder Pattern**: Test data generation with customizable fields
3. **Fixture Pattern**: Reusable test setup with automatic cleanup
4. **Assertion Helpers**: Centralized validation logic

## Adding New Tests

### API Tests

1. Create test file in `src/tests/api/[domain]/`
2. Use `ApiFixtures` for setup
3. Use `ApiAssertions` for validation
4. Follow naming convention: `[Feature].spec.ts`

```typescript
import { test } from '@fixtures/api/ApiFixtures';
import { ApiAssertions } from '@helpers/api/ApiAssertions';

test.describe('New Feature - API', () => {
    test('should create new resource', async ({ apiClient }) => {
        // Test implementation
    });
});
```

### UI Tests

1. Create test file in `src/tests/ui/[domain]/`
2. Use `UiFixtures` for setup
3. Use `UiAssertions` for validation
4. Follow naming convention: `[Feature].spec.ts`

```typescript
import { test } from '@fixtures/ui/UiFixtures';
import { UiAssertions } from '@helpers/ui/UiAssertions';

test.describe('New Feature - UI', () => {
    test('should display new feature', async ({ page }) => {
        // Test implementation
    });
});
```

## Adding New API Endpoints

### 1. Create API Service

```typescript
// src/api/NewFeatureApi.ts
import { ApiClient } from '@api/ApiClient';
import { dataCleaner } from '@fixtures/DataCleaner';
import { NewFeature } from '@models/NewFeature';

export class NewFeatureApi {
    constructor(private readonly api: ApiClient) {}

    async createFeature(feature: NewFeature, shouldCleanup = true) {
        const response = await this.api.post('/features', feature);
        
        if (response.ok() && shouldCleanup) {
            const created = await response.json();
            dataCleaner.register(async () => {
                await this.deleteFeature(created.id);
            });
        }
        
        return response;
    }

    async deleteFeature(id: number | string) {
        return this.api.delete(`/features/${id}`);
    }
}
```

### 2. Add to Fixtures

```typescript
// src/fixtures/api/ApiFixtures.ts
import { NewFeatureApi } from '@api/NewFeatureApi';

type ApiFixtures = {
    // existing fixtures...
    newFeatureApi: NewFeatureApi;
};

export const test = base.extend<ApiFixtures>({
    // existing fixtures...
    newFeatureApi: async ({ apiClient }, use) => {
        await use(new NewFeatureApi(apiClient));
    },
});
```

### 3. Create Model

```typescript
// src/models/NewFeature.ts
export interface NewFeature {
    id: number;
    name: string;
    description?: string;
    enabled: boolean;
}
```

## Adding New UI Pages

### 1. Create Page Object

```typescript
// src/ui/pages/NewFeaturePage.ts
import { BasePage } from '@ui/pages/BasePage';

export class NewFeaturePage extends BasePage {
    readonly pageUrl = '/new-feature';

    async createFeature(name: string, description: string): Promise<void> {
        await this.page.fill('[data-testid="feature-name"]', name);
        await this.page.fill('[data-testid="feature-description"]', description);
        await this.page.click('[data-testid="submit"]');
    }

    async getFeatureItems(): Promise<string[]> {
        return await this.page.locator('[data-testid="feature-item"]').allTextContents();
    }
}
```

### 2. Add Selectors

```typescript
// src/helpers/ui/UiAssertions.ts
export const SELECTORS = {
    // existing selectors...
    FEATURE_NAME: '[data-testid="feature-name"]',
    FEATURE_DESCRIPTION: '[data-testid="feature-description"]',
    FEATURE_ITEMS: '[data-testid="feature-item"]',
} as const;
```

### 3. Add to Fixtures

```typescript
// src/fixtures/ui/UiFixtures.ts
import { NewFeaturePage } from '@ui/pages/NewFeaturePage';

type TestFixtures = {
    // existing fixtures...
    newFeaturePage: NewFeaturePage;
};

export const test = base.extend<TestFixtures>({
    // existing fixtures...
    newFeaturePage: async ({ page }, use) => {
        const newFeaturePage = new NewFeaturePage(page);
        await newFeaturePage.navigate();
        await use(newFeaturePage);
    },
});
```

## Code Style Guidelines

### TypeScript

1. Use strict typing - avoid `any` when possible
2. Use interfaces for data structures
3. Use generics for reusable components
4. Add JSDoc comments for all public methods

### Naming Conventions

- **Classes**: PascalCase (`ApiClient`, `BookBuilder`)
- **Methods**: camelCase (`createBook`, `assertStatus`)
- **Constants**: UPPER_SNAKE_CASE (`SELECTORS`, `API_BASE_URL`)
- **Files**: PascalCase for classes (`ApiClient.ts`), kebab-case for features (`create-books.spec.ts`)

### File Organization

- One class/interface per file
- Group related functionality in directories
- Use path aliases instead of relative imports
- Keep test files separate from implementation

## Testing Best Practices

### Test Structure

```typescript
test.describe('Feature Description', () => {
    test('should do something specific @smoke', async ({ fixture }) => {
        // Arrange
        const testData = Builder.randomData();
        
        // Act
        const result = await fixture.performAction(testData);
        
        // Assert
        Assertions.assertResult(result);
    });
});
```

### Test Data Management

1. Use builders for test data generation
2. Make data realistic but deterministic
3. Use cleanup for all created resources
4. Avoid hardcoded test data

### Assertions

1. Use specific assertion helpers
2. Include meaningful error messages
3. Assert on behavior, not implementation
4. Use proper matchers (`toMatchObject` for partial matching)

### Error Handling

1. Test both success and failure scenarios
2. Validate error messages and status codes
3. Test edge cases and boundary conditions
4. Use proper error assertions

## Debugging Tips

### API Debugging

1. Check network logs in browser dev tools
2. Use `console.log` in ApiClient for request/response logging
3. Validate request/response structures
4. Check API documentation for expected formats

### UI Debugging

1. Use Playwright Inspector: `npx playwright test --debug`
2. Use trace viewer: `npx playwright show-trace trace.zip`
3. Take screenshots: `await page.screenshot({ path: 'debug.png' })`
4. Use page.pause() for manual inspection

### Common Issues

1. **Timing issues**: Use proper waits and assertions
2. **Selector issues**: Use data-testid attributes
3. **Environment issues**: Check configuration and secrets
4. **Cleanup issues**: Verify data cleanup registration

## Performance Considerations

1. Use parallel test execution
2. Reuse fixtures where possible
3. Minimize unnecessary waits
4. Clean up resources promptly

## Security Considerations

1. Never commit secrets or API keys
2. Use environment variables for configuration
3. Validate all inputs in tests
4. Use HTTPS for API requests

## Contributing

1. Follow the existing code style
2. Add tests for new functionality
3. Update documentation
4. Ensure all tests pass before submitting

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [JSDoc Documentation](https://jsdoc.app/)
- [Page Object Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
