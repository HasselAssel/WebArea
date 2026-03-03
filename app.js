async function addDefaultHtmlFile() {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>No Website</title>
</head>
<body>
  <p>Seems like the link was wrong or had no "index.html"</p>
  <p>Here are the contained files though:<br>(index.html is this page)</p>
  <div id="files"></div>
  <script>
(async () => {
  const container = document.getElementById("files");
  const cache = await caches.open("${CACHE}");
  const keys = await cache.keys();

  keys.forEach(req => {
    const url = new URL(req.url);
    const filename = url.pathname.split("/").pop() || "download";

    const link = document.createElement("a");
    link.textContent = filename;
    link.href = req.url;

    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const res = await cache.match(req);
      if (!res) return alert("File not found in cache.");

      const blob = await res.blob();

      const url = new URL(req.url);
      const filename = url.pathname.split("/").pop() || "download";

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    });

    container.appendChild(link);
    container.appendChild(document.createElement("br"));
  });
})();
  </script>
</body>
</html>`;
  await addFile({name: "index.html", content});
}

async function getFilesFromHash() {
  const hash = window.location.hash
  if (hash === "") return []
  const hashData = hash.substring(1);
  const compressedBytes = base64ToBytes(hashData);
  const decompressedBytes = await decompress(compressedBytes);
  const files = unbundleFiles(decompressedBytes);

  return files;
}

async function start() {
  async function ensureSWControlled() {
    if (!navigator.serviceWorker.controller) {
      await startSW();
      window.location.reload();
      return false;
    }
    return true;
  }
  if (!(await ensureSWControlled())) return;
  await nukeCache();
  await addDefaultHtmlFile();
  const files = await getFilesFromHash();
  if (!files.length) return; 
  await addFiles(files);
  location.href = "index.html"
}

setLinkText(window.location.href);
start();