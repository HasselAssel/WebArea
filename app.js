async function isFileView() {
  const params = new URLSearchParams(window.location.search);
  const cache = await caches.open(CACHE);
  const req = new Request("index.html", { method: "GET" });
  return params.has("f") || params.has("d") || !(await cache.match(req));
}

async function getFilesFromHash() {
  const hash = window.location.hash;
  if (hash === "") return [];
  const hashData = hash.substring(1);
  const compressedBytes = base64ToBytes(hashData);
  const decompressedBytes = await decompress(compressedBytes);
  const files = unbundleFiles(decompressedBytes);

  return files;
}

setLinkText(window.location.href);

(async () => {
  const files = await getFilesFromHash();
  if (!files.length) return; 
  await addFiles(files);

  if (await isFileView()) {
    const blob = new Blob([defaultHtmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
  } else {
    location.href = "index.html"
  }
})();