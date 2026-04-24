import { test as base } from '@playwright/test';
import { LoginPage } from '@ui/pages/LoginPage';

/**
 * UI test fixtures.
 */
type TestFixtures = {
    loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
    loginPage: async ({ page }, use) => {
        console.log('[UiFixtures] Setting up login page');
        await page.context().clearCookies();
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        console.log('[UiFixtures] Login page ready');
        await use(loginPage);
    },
});
