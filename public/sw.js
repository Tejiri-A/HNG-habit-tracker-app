const CACHE_NAME = "habit-tracker-v1";

// App shell routes — HTML navigation requests
const SHELL_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ─── Install — cache the app shell ───────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ROUTES))
      // Force this SW to become active immediately
      // without waiting for existing tabs to close
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate — clean up old caches ──────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      // Take control of all open tabs immediately
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch — split strategy ───────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Next.js static chunks — cache first, they are content-hashed
  // so stale content is never an issue
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          }),
      ),
    );
    return;
  }

  // Navigation requests (HTML pages) — network first, fall back to cache
  // This means fresh content when online, app shell when offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }
});
