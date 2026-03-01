const CACHE = "file-cache";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});


self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(url.pathname);
    if (hit) return hit;

    return fetch(event.request);
  })());
});

self.addEventListener('message', (event) => {
  if (event.data.type === "add_file") {
    event.waitUntil((async () => {
      const file = event.data.file;
      if (!file) return;

      const path = file.name;
      const type = file.type;
      const content = file.content;

      const cache = await caches.open(CACHE);

      const req = new Request(path, { method: "GET" });

      await cache.put(req, new Response(content, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "no-store",
        },
      }));
    })());
  }
});