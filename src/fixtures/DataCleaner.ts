/**
 * Automatic test data cleanup.
 */
class DataCleaner {
    private cleanupActions: (() => Promise<void>)[] = [];

    register(action: () => Promise<void>) {
        this.cleanupActions.push(action);
    }

    async cleanup() {
        if (this.cleanupActions.length === 0) return;

        console.log(`[DataCleaner] Starting cleanup of ${this.cleanupActions.length} actions`);
        const reversedActions = [...this.cleanupActions].reverse();

        for (const action of reversedActions) {
            try {
                await action();
                console.log('[DataCleaner] Cleanup action completed');
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                if (errorMessage?.includes('closed') || errorMessage?.includes('interrupted')) {
                    console.log(`[DataCleaner] Cleanup action skipped: ${errorMessage}`);
                    break;
                }
                console.warn('[CLEANUP ERROR]', e);
            }
        }

        this.cleanupActions = [];
        console.log('[DataCleaner] Cleanup completed');
    }
}

export const dataCleaner = new DataCleaner();
