/*
 * WHAT IS THIS FILE?
 *
 * It's the  entry point for cloudflare-pages when building for production.
 *
 * Learn more about the cloudflare integration here:
 * - https://qwik.builder.io/integrations/deployments/cloudflare-pages/
 *
 */
import { createQwikRouter } from '@qwik.dev/router/middleware/cloudflare-pages';
import qwikRouterConfig from '@qwik-router-config';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';

// declare global {
//   interface QwikCityPlatform extends PlatformCloudflarePages {}
// }

const fetch = createQwikRouter({ render, qwikRouterConfig, manifest });

export { fetch };
