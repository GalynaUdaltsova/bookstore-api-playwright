import { config } from '@config/config';
import { Page } from '@playwright/test';

/**
 * Base class for Page Objects.
 */
export abstract class BasePage {
    constructor(protected readonly page: Page) {}

    abstract readonly pageUrl: string;

    async navigate(): Promise<void> {
        // Remove trailing slash from base URL to avoid double slashes
        const baseUrl = config.ui.baseURL.replace(/\/$/, '');

        // Ensure path starts with slash
        const path = this.pageUrl.startsWith('/') ? this.pageUrl : `/${this.pageUrl}`;

        const fullUrl = `${baseUrl}${path}`;

        await this.page.goto(fullUrl, {
            waitUntil: 'domcontentloaded',
        });
    }
}
