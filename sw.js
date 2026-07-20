/*
 * sw.js — service worker for offline support.
 * Precaches all app assets on install, serves cache-first, and updates
 * the cache in the background when the network is available. Bump
 * CACHE_NAME whenever any precached file changes so clients pick up
 * the new version.
 */

const CACHE_NAME = "meat-temp-v2";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./icons.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./photos/beef.jpg",
  "./photos/pork.jpg",
  "./photos/poultry.jpg",
  "./photos/lamb.jpg",
  "./photos/ground.jpg",
  "./photos/seafood.jpg",
  "./photos/game.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached — fall back to the app shell for
          // navigations so the SPA still boots and routes client-side.
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return cached;
        });

      return cached || networkFetch;
    })
  );
});
