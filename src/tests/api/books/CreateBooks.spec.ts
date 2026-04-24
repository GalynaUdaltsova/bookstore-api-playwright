import { BookBuilder } from '@builders/api/BookBuilder';
import { test } from '@fixtures/api/ApiFixtures';
import { ApiAssertions } from '@helpers/api/ApiAssertions';

test.describe('Books API - Create', () => {
    test('Create book - success @smoke', async ({ booksApi }) => {
        // Arrange
        const book = BookBuilder.randomBook();

        // Act
        const response = await booksApi.createBook(book);
        const responseData = await response.json();

        // Assert
        ApiAssertions.assertStatus(response.status(), 200);
        ApiAssertions.assertValidBook(responseData);
        ApiAssertions.assertContainsData(responseData, {
            title: book.title,
            pageCount: book.pageCount,
        });
    });

    test('Create book - invalid publishDate @regression', async ({ booksApi }) => {
        // Arrange
        const book = BookBuilder.specificFieldBook((b) => (b.publishDate = 'invalid-date'));

        // Act
        const response = await booksApi.createBook(book, false);
        const responseData = await response.json();

        // Assert
        ApiAssertions.assertStatus(response.status(), 400);
        ApiAssertions.assertError(responseData, 'publishDate');
    });
});
