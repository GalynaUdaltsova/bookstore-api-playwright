# Bookstore API & UI Tests

Automation testing framework for bookstore application built with Playwright and TypeScript. Supports separate API and UI testing with clean architecture and best practices.

## Project Structure

```
bookstore-api-playwright/
├── src/
│   ├── api/                    # API clients and services
│   │   ├── ApiClient.ts       # Generic API client
│   │   └── BooksApi.ts        # Books-specific API service
│   ├── ui/                     # UI Page Objects
│   │   └── pages/
│   │       ├── BasePage.ts      # Base page object
│   │       └── LoginPage.ts    # Login page object model
│   ├── fixtures/               # Test fixtures and data management
│   │   ├── DataCleaner.ts     # Automatic test data cleanup
│   │   ├── api/
│   │   │   └── ApiFixtures.ts  # API test fixtures
│   │   └── ui/
│   │       └── UiFixtures.ts   # UI test fixtures
│   ├── builders/               # Test data builders
│   │   ├── api/
│   │   │   └── BookBuilder.ts  # Book test data builder
│   │   └── ui/
│   │       └── UserBuilder.ts  # User test data builder
│   ├── helpers/                # Assertion helpers
│   │   ├── api/
│   │   │   └── ApiAssertions.ts # API assertion helpers
│   │   └── ui/
│   │       └── UiAssertions.ts  # UI assertion helpers
│   ├── models/                 # TypeScript interfaces
│   │   ├── Book.ts             # Book model
│   │   ├── User.ts             # User model
│   │   └── RequestOptions.ts   # Request options
│   ├── tests/                  # Test files
│   │   ├── api/                # API tests
│   │   │   └── books/
│   │   │       └── CreateBooks.spec.ts
│   │   └── ui/                 # UI tests
│   │       └── auth/
│   │           └── LoginPageTests.spec.ts
│   └── config/                 # Configuration
│       └── config.ts           # Environment configuration
├── .github/workflows/          # CI/CD workflows
│   └── playwright.yml         # GitHub Actions workflow
├── docker-entrypoint.sh        # Docker test runner script
├── Dockerfile                  # Docker configuration
├── playwright.config.ts        # Playwright configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.js               # ESLint configuration
├── .prettierrc.json           # Prettier configuration
└── .prettierignore            # Prettier exclusions
```

## Getting Started

### Prerequisites
- Node.js 18+
- Playwright
- Docker (for containerized testing)

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install
```

## Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run with UI interface
npm run test:ui

# Run in headed mode
npm run test:headed

# Run in debug mode
npm run test:debug

# Run smoke tests
npm run test:smoke

# Run for staging environment
npm run test:staging

# View reports
npm run report
npm run report:allure
```

### Docker Testing
```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:test

# Environment variables for Docker:
# ENV=qa (default)
# TEST_TYPE=all
# TEST_GROUP=all
```

## Test Types

### API Tests
- **Location**: `src/tests/api/`
- **Framework**: Playwright API testing
- **Features**:
  - Automatic test data cleanup
  - Request/response validation
  - Data builders for realistic test data
  - Error handling tests
  - Centralized ApiClient

### UI Tests
- **Location**: `src/tests/ui/`
- **Framework**: Playwright UI testing
- **Features**:
  - Page Object Model with BasePage inheritance
  - Cross-browser testing (Chrome)
  - Responsive design testing
  - Error handling and validation
  - Form interaction testing
  - Automatic navigation through fixtures

## Configuration

### Playwright Config
The `playwright.config.ts` defines separate projects for API and UI tests:

```typescript
projects: [
  // API Tests Project
  {
    name: 'api',
    testMatch: '**/api/**/*.spec.ts',
    use: {
      baseURL: process.env.API_BASE_URL,
      trace: 'on-first-retry',
    },
  },

  // UI Tests Project
  {
    name: 'ui-chromium',
    testMatch: '**/ui/**/*.spec.ts',
    use: {
      ...devices['Desktop Chrome'],
      baseURL: process.env.UI_BASE_URL,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'on-first-retry',
    },
  },
]
```

### TypeScript Configuration
- **Path aliases**: `@api/*`, `@ui/*`, `@models/*`, `@config/*`, `@helpers/*`
- **Strict mode**: Enabled for maximum type safety
- **Target**: ES2021, **Module**: CommonJS

### Environment Setup
Create environment files with your actual values:

```bash
# For QA environment
cat > .env.qa << EOF
API_BASE_URL=your-api-base-url
API_KEY=your-api-key
UI_BASE_URL=your-ui-base-url
ENV=qa
EOF

# For Staging environment
cat > .env.staging << EOF
API_BASE_URL=your-staging-api-url
API_KEY=your-staging-api-key
UI_BASE_URL=your-staging-ui-url
ENV=staging
EOF
```

## Code Quality

### Tools
```bash
# Check linting
npm run lint

# Fix linting
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format

# Type checking
npm run type-check

# Full quality check
npm run code-quality
```

## Test Data Management

### DataCleaner
Automatic test data cleanup system:
- Registers cleanup actions during tests
- Executes cleanup after test completion
- Prevents test data pollution
- Graceful error handling during cleanup

### Data Builders
Reusable builders for creating test data:
- `BookBuilder`: Creates realistic book data with Faker
- `UserBuilder`: Creates user data with various scenarios
- Supports customization through modifier functions

## Test Architecture

### API Testing
- **Client**: `ApiClient` with generic HTTP methods
- **Services**: Domain-specific services (`BooksApi`)
- **Fixtures**: Reusable test setup with `ApiFixtures`
- **Assertions**: `ApiAssertions` for response validation
- **Auto-cleanup**: Automatic cleanup data registration

### UI Testing
- **Page Objects**: `LoginPage` extends `BasePage`
- **Fixtures**: Reusable UI setup with `UiFixtures`
- **Assertions**: `UiAssertions` for UI validation
- **Selectors**: Centralized selectors in `SELECTORS` constant

## Docker Support

Optimized Dockerfile for test execution:
- **Build stage**: Installs dependencies
- **Runtime stage**: Minimal image with test requirements only
- **Optimized layers**: Faster build times
- **Entry point**: Flexible test runner script via `docker-entrypoint.sh`
- **Volume mounting**: For preserving Allure results

## CI/CD Integration

### GitHub Actions Workflow
- **Automated testing** on push and pull requests
- **Environment selection**: QA, Staging via workflow inputs
- **Test filtering**: Smoke, Regression, All tests
- **Code Quality Checks**: ESLint, Prettier, TypeScript before tests
- **Allure reporting**: Automatic test report generation
- **GitHub Pages deployment**: Publishing reports to gh-pages
- **Artifacts**: Downloadable test results (30 days)
- **Scheduled runs**: Weekly execution via cron
- **Manual triggers**: Workflow dispatch for manual runs

#### Jobs:
1. **code-quality**: Code quality checks
2. **test**: Test execution in Docker
3. **deploy**: Allure reports publishing
4. **notify**: Result notifications

## Environment Variables

| Variable | Required | Description |
|-----------|-----------|-------------|
| `API_BASE_URL` | Yes | Base URL for API tests |
| `API_KEY` | Yes | API authentication key |
| `UI_BASE_URL` | Yes | Base URL for UI tests |
| `ENV` | No | Environment (qa/staging/production, default: qa) |
| `UI_TIMEOUT` | No | UI test timeout (default: 60000) |
| `VIEWPORT_WIDTH` | No | Viewport width (default: 1280) |
| `VIEWPORT_HEIGHT` | No | Viewport height (default: 720) |
| `TEST_TYPE` | No | Test type (api/ui/all) |
| `TEST_GROUP` | No | Test group (smoke/regression/all) |

## Test Reporting

### Allure Reports
- **Generation**: Automatic after test runs
- **Deployment**: GitHub Pages integration
- **Artifacts**: Downloadable from GitHub Actions
- **Retention**: 30 days
- **History**: Preserves test history between runs
- **Metrics**: Execution times, pass/fail statistics

### Local Reports
```bash
# View HTML report
npm run report

# Generate and view Allure report
npm run report:allure
```

### Debug Mode
```bash
# Run with debugging
npm run test:debug

# Run with trace viewer
npx playwright show-trace trace.zip

# Code generation
npx playwright codegen https://your-app-url
```

## Architectural Advantages

### Best Practices
- **SOLID principles** in architecture
- **TypeScript strict mode** for maximum type safety
- **Path aliases** for clean imports
- **Separation of concerns** between layers
- **Reusable components** and DRY principle

### Scalability
- Easy addition of new API endpoints
- Simple UI page extension
- Flexible fixture system
- Environment-specific configurations
- Parallel execution optimization

### Reliability
- Automatic test data cleanup
- Graceful error handling
- Retry logic for flaky tests
- Comprehensive logging
- Cross-browser compatibility

## License

This project is licensed under the MIT License.

---

**Built with ❤️ using Playwright for reliable application testing**

## Documentation

- **[Development Guide](./DEVELOPMENT.md)** - Comprehensive guide for developers
- **[README](./README.md)** - Project overview and getting started

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Requirements
- All tests must pass (`npm run code-quality`)
- Follow ESLint and Prettier rules
- Add tests for new functionality
- Update documentation when necessary
- Follow the [Development Guide](./DEVELOPMENT.md) for best practices
