/**
 * Gift Wrap App – Local dev HTTPS server
 *
 * Uses a self-signed cert (web/certs/) so Shopify can load the admin page
 * over HTTPS on localhost. First visit: click "Advanced → Proceed to localhost".
 *
 * For production the same page is served via the Cloudflare Pages function
 * at functions/[[path]].js — no changes needed here.
 */

import https from 'https';
import http  from 'http';
import fs    from 'fs';
import path  from 'path';
import { URL, fileURLToPath } from 'url';
import { renderPage } from './page.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT      = parseInt(process.env.PORT || '3000', 10);

// ─── TLS cert (dev only) ──────────────────────────────────────────────────────
let tlsOptions = null;
try {
  tlsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
    key:  fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  };
} catch (_) {
  console.warn('[web] TLS cert not found — falling back to HTTP.');
  console.warn('[web] Generate with: openssl req -x509 -newkey rsa:2048 -keyout web/certs/key.pem -out web/certs/cert.pem -days 3650 -nodes -subj "/CN=localhost"');
}

// ─── Request handler ──────────────────────────────────────────────────────────
function handler(req, res) {
  if (req.url === '/health' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  let shop = '';
  try { shop = new URL(req.url, `https://localhost:${PORT}`).searchParams.get('shop') || ''; } catch (_) {}
  const html = renderPage(shop);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': Buffer.byteLength(html) });
  res.end(html);
}

// ─── Start ────────────────────────────────────────────────────────────────────
if (tlsOptions) {
  https.createServer(tlsOptions, handler).listen(PORT, () => {
    console.log(`🎁 Gift Wrap admin (HTTPS) → https://localhost:${PORT}`);
    console.log('   ⚠ First visit: click "Advanced → Proceed to localhost" to trust the cert.');
  });
} else {
  http.createServer(handler).listen(PORT, () => {
    console.log(`🎁 Gift Wrap admin (HTTP fallback) → http://localhost:${PORT}`);
  });
}
