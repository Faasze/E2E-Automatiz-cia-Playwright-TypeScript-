import type { BrowserContext } from '@playwright/test';

// reklamy a cookie dialóg občas prekryjú tlačidlá -> blokujem ich, nie sú predmetom testu
const BLOCKED_HOSTS = [
  'googlesyndication.com',
  'doubleclick.net',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'fundingchoicesmessages.google.com',
  'adservice.google.com',
  'amazon-adsystem.com',
];

export async function blockThirdPartyNoise(context: BrowserContext): Promise<void> {
  await context.route(
    (url) => BLOCKED_HOSTS.some((host) => url.hostname.endsWith(host)),
    (route) => route.abort(),
  );
}
