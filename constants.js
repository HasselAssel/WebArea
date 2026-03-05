const CACHE = "file-cache";

const SW_URL = "sw.js";

const defaultHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>No Website</title>
  <link rel="icon" type="image/svg+xml" href='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="13.8" y="8.6" width="36.4" height="46.8" rx="5.2" fill="none" stroke="%239fd3ff" stroke-width="5"/><line x1="20" y1="21.6" x2="44" y2="21.6" stroke="%239fd3ff" stroke-width="5"/><line x1="20" y1="32" x2="37" y2="32" stroke="%239fd3ff" stroke-width="5.2"/></svg>'>
</head>
<body style="background-color: #0d0d0d; color: #e6e6e6; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
  <p style="color: #9fd3ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; display: block; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 14px;">Either there was no index.html or you wanted to look at the files in the link (?f or ?d)</p>
  <p style="color: #9fd3ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; display: block; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 14px;">Here are the contained files:</p>
  <div id="files" style="color: #9fd3ff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; display: block; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 14px;"></div>
  <script>
(async () => {
  const container = document.getElementById("files");
  const cache = await caches.open("${CACHE}");
  const keys = await cache.keys();

  keys.forEach(req => {
    const url = new URL(req.url);
    const filename = url.pathname.split("/").pop() || "download";

    const link = document.createElement("a");
    link.setAttribute("style", "color: #9fd3ff;");
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