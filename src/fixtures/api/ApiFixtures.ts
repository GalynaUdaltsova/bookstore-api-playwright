import { ApiClient } from '@api/ApiClient';
import { BooksApi } from '@api/BooksApi';
import { dataCleaner } from '@fixtures/DataCleaner';
import { test as base, expect } from '@playwright/test';

/**
 * API test fixtures.
 */
type ApiFixtures = {
    apiClient: ApiClient;
    booksApi: BooksApi;
    autoCleanup: void;
};

export const test = base.extend<ApiFixtures>({
    apiClient: async ({ request }, use) => {
        const client = new ApiClient(request);
        await use(client);
        await dataCleaner.cleanup();
    },

    booksApi: async ({ apiClient }, use) => {
        await use(new BooksApi(apiClient));
    },
});

export { expect };
