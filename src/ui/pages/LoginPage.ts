import { SELECTORS } from '@helpers/ui/UiAssertions';
import { BasePage } from '@ui/pages/BasePage';

/**
 * Login page object.
 */
export class LoginPage extends BasePage {
    readonly pageUrl = '/ecommerce/login';

    async login(email: string, password: string): Promise<void> {
        console.log(`[LoginPage] Attempting login for: ${email}`);
        await this.page.fill(SELECTORS.EMAIL_INPUT, email);
        await this.page.fill(SELECTORS.PASSWORD_INPUT, password);
        await this.page.click(SELECTORS.SUBMIT_BUTTON);
        console.log('[LoginPage] Login form submitted');
    }
}
