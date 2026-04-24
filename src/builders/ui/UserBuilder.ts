import { faker } from '@faker-js/faker';
import { User } from '@models/User';

/**
 * Test data builder for User objects.
 */
export class UserBuilder {
    static randomUser(): User {
        return {
            username: faker.internet.displayName(),
            password: faker.internet.password({ length: 12, memorable: true }) + '1A!',
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };
    }

    static specificUser(modifier: (user: User) => void): User {
        const user = this.randomUser();
        modifier(user);
        return user;
    }
}
