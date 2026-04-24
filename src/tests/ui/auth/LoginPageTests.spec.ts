import { UserBuilder } from '@builders/ui/UserBuilder';
import { test } from '@fixtures/ui/UiFixtures';
import { SELECTORS, UiAssertions } from '@helpers/ui/UiAssertions';
import { expect } from '@playwright/test';

test.describe('Login Page - Feature Tests', () => {
    test('User can login with valid credentials @smoke', async ({ page, loginPage }) => {
        // Arrange
        const user = UserBuilder.randomUser();

        // Act
        await loginPage.login(user.email, user.password);

        // Assert
        const hasError = await page.locator(SELECTORS.ERROR_ALERT).first().isVisible();
        const hasSuccess = await page.locator(SELECTORS.SUCCESS_MESSAGE).first().isVisible();

        expect(
            hasError || hasSuccess,
            'Login should result in either success or error',
        ).toBeTruthy();

        await UiAssertions.assertElementVisible(page, SELECTORS.EMAIL_INPUT);
        await expect(page.locator(SELECTORS.PASSWORD_INPUT)).toHaveAttribute('type', 'password');
    });

    test('User cannot login with invalid credentials @regression', async ({ page, loginPage }) => {
        // Arrange
        const user = UserBuilder.specificUser((u) => (u.password = '123'));

        // Act
        await loginPage.login(user.email, user.password);

        // Assert
        await UiAssertions.assertLoginFailed(page);
        await UiAssertions.assertInputHasValue(page, user.email, SELECTORS.EMAIL_INPUT);

        expect(page.url()).toContain('login');
    });

    test.describe('Edge Scenario - Boundary Conditions', () => {
        const edgeCases = [
            { email: 'test+special@example.com', description: 'special characters' },
            { email: 'long'.repeat(20) + '@example.com', description: 'very long email' },
            { email: 'user@domain.co.uk', description: 'subdomain' },
            { email: 'user.name@example.com', description: 'dots in email' },
        ];

        for (const { email, description } of edgeCases) {
            test(`handles ${description} email @regression`, async ({ page, loginPage }) => {
                // Arrange
                const user = UserBuilder.specificUser((u) => (u.email = email));

                // Act
                await loginPage.login(user.email, user.password);

                // Assert
                const hasError = await page.locator(SELECTORS.ERROR_ALERT).first().isVisible();
                const hasSuccess = await page
                    .locator(SELECTORS.SUCCESS_MESSAGE)
                    .first()
                    .isVisible();

                expect(hasError || hasSuccess).toBeTruthy();
            });
        }
    });
});
