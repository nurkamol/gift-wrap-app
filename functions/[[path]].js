/**
 * Cloudflare Pages Function – Gift Wrap App admin page (production)
 *
 * [[path]].js is a catch-all route — it handles every URL including /?shop=...
 * Uses the Web Standard Request/Response API (no Node.js req/res).
 *
 * Deployed automatically when you run:
 *   npx wrangler pages deploy public --project-name gift-wrap-app
 */

import { renderPage } from '../web/page.js';

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Health check endpoint
  if (url.pathname === '/health' || url.pathname === '/ping') {
    return new Response('ok', { status: 200 });
  }

  const shop = url.searchParams.get('shop') || '';
  const html = renderPage(shop);

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
