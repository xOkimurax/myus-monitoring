import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: 'https://jp84sgki.us-east.insforge.app',
  anonKey: 'ik_62254b582d90713b376c887fba194fac',
});

// Track OAuth callback promise so App can await it before rendering
let authCallbackPromise: Promise<void> | null = null;

export const waitForAuthCallback = () => authCallbackPromise;

export default insforge;