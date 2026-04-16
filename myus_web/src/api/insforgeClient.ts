import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: 'https://jp84sgki.us-east.insforge.app',
});

// Track OAuth callback promise so App can await it before rendering
let authCallbackPromise: Promise<void> | null = null;

export const waitForAuthCallback = () => authCallbackPromise;

export default insforge;