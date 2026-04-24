import { config } from '@config/config';
import { RequestOptions } from '@models/RequestOptions';
import { APIRequestContext } from '@playwright/test';

/**
 * Generic API client for HTTP requests.
 */
export class ApiClient {
    /**
     * Creates a new ApiClient instance.
     *
     * @param request - Playwright's APIRequestContext for making HTTP requests
     */
    constructor(private readonly request: APIRequestContext) {}

    private async sendRequest(method: string, path: string, options: RequestOptions = {}) {
        const url = this.buildUrl(path);

        // Merge default headers from config with custom ones from tests
        const mergedHeaders = {
            ...config.api.headers,
            ...options.headers,
        };

        console.log(`[API REQUEST] ${method} ${url}`);
        if (options.data) console.log(`[BODY] ${JSON.stringify(options.data)}`);

        return await this.request.fetch(url, {
            method,
            headers: mergedHeaders,
            params: options.params,
            data: options.data,
        });
    }

    private buildUrl(path: string): string {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${config.api.baseURL}${cleanPath}`;
    }

    async get(path: string, options?: RequestOptions) {
        return this.sendRequest('GET', path, options);
    }

    async post(path: string, body?: unknown, options?: RequestOptions) {
        return this.sendRequest('POST', path, { ...options, data: body });
    }

    async put(path: string, body?: unknown, options?: RequestOptions) {
        return this.sendRequest('PUT', path, { ...options, data: body });
    }

    async delete(path: string, options?: RequestOptions) {
        return this.sendRequest('DELETE', path, options);
    }

    async patch(path: string, body?: unknown, options?: RequestOptions) {
        return this.sendRequest('PATCH', path, { ...options, data: body });
    }
}
