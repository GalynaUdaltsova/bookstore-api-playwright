import * as dotenv from 'dotenv';

/**
 * Environment configuration.
 */
const env = process.env.ENV || 'qa';

if (!process.env.API_BASE_URL || !process.env.API_KEY) {
    const envFile = `.env.${env}`;
    const result = dotenv.config({ path: envFile });
    if (result.error) {
        console.warn(`Could not load ${envFile}, using process.env directly`);
    } else {
        console.log(`Loaded env from ${envFile}`);
    }
}

if (!process.env.API_BASE_URL || !process.env.API_KEY || !process.env.UI_BASE_URL) {
    throw new Error(
        'API_BASE_URL, API_KEY, and UI_BASE_URL must be defined in env or GitHub Secrets!',
    );
}

export const config = {
    api: {
        baseURL: process.env.API_BASE_URL,
        apiKey: process.env.API_KEY,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    },
    ui: {
        baseURL: process.env.UI_BASE_URL,
        timeout: parseInt(process.env.UI_TIMEOUT || '60000'),
        viewport: {
            width: parseInt(process.env.VIEWPORT_WIDTH || '1280'),
            height: parseInt(process.env.VIEWPORT_HEIGHT || '720'),
        },
    },
    environment: env,
};
