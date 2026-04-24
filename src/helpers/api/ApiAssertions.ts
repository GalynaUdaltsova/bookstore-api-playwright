import { Book } from '@models/Book';
import { expect } from '@playwright/test';

/**
 * API assertion helpers.
 */
export class ApiAssertions {
    static assertStatus(actual: number, expected: number): void {
        expect(actual, `Expected status ${expected}, but got ${actual}`).toBe(expected);
    }

    static assertContainsData<T extends Record<string, unknown>>(
        responseData: T,
        expectedData: Partial<T>,
    ): void {
        expect(responseData).toMatchObject(expectedData);
    }

    static assertValidBook(book: Book): void {
        const bookMatcher: Record<keyof Book, unknown> = {
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            pageCount: expect.any(Number),
            excerpt: expect.any(String),
            publishDate: expect.any(String),
        };

        expect(book).toMatchObject(bookMatcher);

        if (book.pageCount) {
            expect(book.pageCount, 'Page count must be positive').toBeGreaterThan(0);
        }
    }

    static assertError(responseData: unknown, expectedText?: string): void {
        expect(responseData, 'Response should be defined').not.toBeNull();
        expect(responseData, 'Response should be an object').toBeInstanceOf(Object);

        if (expectedText) {
            const errorString = JSON.stringify(responseData);
            expect(errorString, `Error message should contain: "${expectedText}"`).toContain(
                expectedText,
            );
        }
    }
}
