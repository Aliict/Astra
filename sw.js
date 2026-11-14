// Service worker: keeps ASTRA working offline.
// On install it stores the app files, the libraries the page loads from CDNs (Tailwind CSS
// and Chart.js), the fonts stylesheet and the font files that stylesheet lists. Requests
// are answered from the cache first, and a fresh copy is fetched in the background for
// next time. Anything that cannot be fetched at install time is stored on first use.
const CACHE = 'astra-v0.2.0';
const LOCAL = ['./', './index.html', './manifest.json', './icon-512.png'];
const CDN = [
  'https://cdn.tailwindcss.com/3.4.17',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js'
];
const FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&display=swap';
const CDN_HOSTS = ['cdn.tailwindcss.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(LOCAL);
    // The page loads these with plain script tags (no-cors), so an opaque copy is
    // exactly what it will ask for.
    await Promise.all(CDN.map(async url => {
      try {
        await cache.put(url, await fetch(new Request(url, { mode: 'no-cors' })));
      } catch (err) {
        // stored on first use
      }
    }));
    // Google Fonts allows CORS, so the stylesheet can be read to find its font files.
    // The page asks for those files before this worker controls it, so they would
    // otherwise never be stored.
    try {
      const css = await fetch(FONTS_CSS, { mode: 'cors' });
      await cache.put(FONTS_CSS, css.clone());
      const files = [...(await css.text()).matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
      await Promise.all(files.map(async file => {
        try {
          const response = await fetch(file, { mode: 'cors' });
          if (response.ok) await cache.put(file, response);
        } catch (err) {
          // stored on first use
        }
      }));
    } catch (err) {
      // stored on first use
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !CDN_HOSTS.includes(url.hostname)) return; // not ours to store

  const network = fetch(event.request).then(async response => {
    // ok: same-origin and CORS responses (font files). opaque: no-cors CDN scripts and stylesheets.
    if (response.ok || response.type === 'opaque') {
      const cache = await caches.open(CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  });
  event.waitUntil(network.catch(() => undefined));
  event.respondWith(caches.match(event.request)
    .then(cached => cached || network)
    .catch(() => Response.error()));
});
