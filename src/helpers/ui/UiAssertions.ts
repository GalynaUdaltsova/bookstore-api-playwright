import { expect, Locator, Page } from '@playwright/test';

export const SELECTORS = {
    EMAIL_INPUT: 'input[name="email"]',
    PASSWORD_INPUT: 'input[name="password"]',
    SUBMIT_BUTTON: 'button[type="submit"]',
    ERROR_ALERT: '[role="alert"]:not([id="__next-route-announcer__"])',
    SUCCESS_MESSAGE: '.success-message, [data-testid="success"]',
} as const;

/**
 * UI assertion helpers.
 */
export class UiAssertions {
    static async assertElementVisible(target: Page | Locator, selector?: string) {
        const locator =
            'locator' in target && selector ? target.locator(selector) : (target as Locator);
        await expect(locator).toBeVisible();
    }

    static async assertInputHasValue(
        target: Page | Locator,
        expectedValue: string,
        selector?: string,
    ) {
        const locator =
            'locator' in target && selector ? target.locator(selector) : (target as Locator);
        await expect(locator).toHaveValue(expectedValue);
    }

    static async assertLoginFailed(page: Page) {
        const errorLocator = page
            .locator(SELECTORS.ERROR_ALERT)
            .filter({ hasText: 'Accepted email:test@qabrains.' });
        await expect(errorLocator).toBeVisible();
    }
}
