#!/bin/bash
set -e

# -----------------------------
# Default values if not passed from GitHub Actions or local env
# -----------------------------
TEST_GROUP="${TEST_GROUP:-smoke}"
TEST_TYPE="${TEST_TYPE:-all}"  # api, ui, or all
ENVIRONMENT="${ENVIRONMENT:-qa}"
SKIP_CODE_QUALITY="${SKIP_CODE_QUALITY:-false}"

echo "Starting test execution..."
echo "Environment: $ENVIRONMENT"
echo "Test Type: $TEST_TYPE"
echo "Test Group: $TEST_GROUP"
echo "Skip Code Quality: $SKIP_CODE_QUALITY"

# -----------------------------
# Code Quality Checks (if not skipped)
# -----------------------------
if [ "$SKIP_CODE_QUALITY" != "true" ]; then
    echo "Running code quality checks..."
    
    echo "Running ESLint..."
    npm run lint || {
        echo "ESLint failed!"
        exit 1
    }
    
    echo "Checking Prettier formatting..."
    npm run format:check || {
        echo "Prettier formatting check failed!"
        echo "Run 'npm run format' to fix formatting issues"
        exit 1
    }
    
    echo "TypeScript type checking..."
    npm run type-check || {
        echo "TypeScript type check failed!"
        exit 1
    }
    
    echo "All code quality checks passed!"
else
    echo "Skipping code quality checks (SKIP_CODE_QUALITY=true)"
fi

# -----------------------------
# Load environment variables from Docker (GitHub Secrets) or .env file
# -----------------------------
if [ -z "$API_BASE_URL" ] || [ -z "$API_KEY" ] || [ -z "$UI_BASE_URL" ]; then
    ENV_FILE="/app/.env.$ENVIRONMENT"
    if [ -f "$ENV_FILE" ]; then
        echo "Loading environment variables from $ENV_FILE"
        export $(grep -v '^#' "$ENV_FILE" | xargs)
    fi
fi

# -----------------------------
# Check that required secrets are passed
# -----------------------------
if [ "$TEST_TYPE" = "api" ] || [ "$TEST_TYPE" = "all" ]; then
    if [ -z "$API_BASE_URL" ] || [ -z "$API_KEY" ]; then
        echo "ERROR: API_BASE_URL and API_KEY must be set via GitHub Secrets or .env file for API tests!"
        exit 1
    fi
fi

if [ "$TEST_TYPE" = "ui" ] || [ "$TEST_TYPE" = "all" ]; then
    if [ -z "$UI_BASE_URL" ]; then
        echo "ERROR: UI_BASE_URL must be set via GitHub Secrets or .env file for UI tests!"
        exit 1
    fi
fi

echo "API_BASE_URL=$API_BASE_URL"
echo "API_KEY=${API_KEY:0:4}***"
echo "UI_BASE_URL=$UI_BASE_URL"

# -----------------------------
# Determine Playwright test command
# -----------------------------
TEST_CMD=()
case $TEST_TYPE in
  "api")
    TEST_CMD=(npx playwright test --project=api --reporter=allure-playwright --output=allure-results/api)
    [ "$TEST_GROUP" != "all" ] && TEST_CMD+=(--grep="$TEST_GROUP")
    ;;
  "ui")
    TEST_CMD=(npx playwright test --project=ui-chromium --reporter=allure-playwright --output=allure-results/ui)
    [ "$TEST_GROUP" != "all" ] && TEST_CMD+=(--grep="$TEST_GROUP")
    ;;
  "all")
    TEST_CMD=(npx playwright test --project=api --project=ui-chromium --reporter=allure-playwright --output=allure-results)
    [ "$TEST_GROUP" != "all" ] && TEST_CMD+=(--grep="$TEST_GROUP")
    ;;
  *)
    echo "ERROR: Invalid TEST_TYPE. Must be 'api', 'ui', or 'all'"
    exit 1
    ;;
esac

# -----------------------------
# Execute tests
# -----------------------------
echo "Running command: ${TEST_CMD[*]}"
"${TEST_CMD[@]}"