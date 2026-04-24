import { ApiClient } from '@api/ApiClient';
import { dataCleaner } from '@fixtures/DataCleaner';
import { Book } from '@models/Book';

/**
 * Books API service with automatic cleanup.
 */
export class BooksApi {
    constructor(private readonly api: ApiClient) {}

    async createBook(book: Book, shouldCleanup = true) {
        console.log(`[BooksApi] Creating book: ${book.title}`);
        const response = await this.api.post('/Books', book);

        console.log(`[BooksApi] Book creation response received with status: ${response.status()}`);

        if (response.ok()) {
            const createdBook = await response.json();
            console.log(`[BooksApi] Book created successfully with ID: ${createdBook.id}`);

            if (shouldCleanup) {
                const bookId = createdBook.id;

                dataCleaner.register(async () => {
                    const res = await this.deleteBook(bookId);

                    if (!res.ok() && res.status() !== 404) {
                        console.warn(
                            `[Cleanup Failed] Book ID: ${bookId}, Status: ${res.status()}`,
                        );
                    }
                });
            }
        } else {
            console.log(`[BooksApi] Book creation failed with status: ${response.status()}`);
        }

        return response;
    }

    async deleteBook(id: number | string) {
        console.log(`[BooksApi] Deleting book with ID: ${id}`);
        const response = await this.api.delete(`/Books/${id}`);

        if (response.ok()) {
            console.log('[BooksApi] Book deleted successfully');
        } else {
            console.log(`[BooksApi] Book deletion failed with status: ${response.status()}`);
        }

        return response;
    }
}
