# =========================
# Stage 1: build stage
# =========================
FROM mcr.microsoft.com/playwright:v1.58.2-jammy AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and configuration files
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY playwright.config.ts ./
COPY .eslintrc.js ./.eslintrc.js
COPY .prettierrc.json ./.prettierrc.json
COPY .prettierignore ./.prettierignore

# =========================
# Stage 2: runtime stage
# =========================
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Copy dependencies and source from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/playwright.config.ts ./playwright.config.ts
COPY --from=build /app/.eslintrc.js ./.eslintrc.js
COPY --from=build /app/.prettierrc.json ./.prettierrc.json
COPY --from=build /app/.prettierignore ./.prettierignore
COPY --from=build /app/package.json ./package.json

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set default environment variables
ENV ENV=qa
ENV ALLURE_RESULTS_DIR=/app/allure-results

# Default command: run tests only
CMD ["./docker-entrypoint.sh"]