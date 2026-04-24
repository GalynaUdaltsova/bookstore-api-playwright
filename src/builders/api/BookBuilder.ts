import { faker } from '@faker-js/faker';
import { Book } from '@models/Book';

/**
 * Test data builder for Book objects.
 */
export class BookBuilder {
    static randomBook(): Book {
        return {
            id: 0,
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            pageCount: faker.number.int({ min: 10, max: 1000 }),
            excerpt: faker.lorem.paragraph(),
            publishDate: new Date().toISOString(),
        };
    }

    static specificFieldBook(modifier: (book: Book) => void): Book {
        const book = this.randomBook();
        modifier(book);
        return book;
    }
}
