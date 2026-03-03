async function nukeCache() {
  await caches.delete(CACHE);
}

async function startSW() {
  await navigator.serviceWorker.register(SW_URL);
}

async function addFile(file) {
  const path = file.name;
  const content = file.content;

  const cache = await caches.open(CACHE);

  const req = new Request(path, { method: "GET" });

  await cache.put(req, new Response(content, {
    headers: {
      "Content-Type": "", // TODO add content type
      "Cache-Control": "no-store",
    },
  }));
}

async function addFiles(files) {
  await Promise.all(files.map(file => addFile(file)))
}