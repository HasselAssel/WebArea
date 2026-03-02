async function addDefaultHtmlFile() {
  const content = `<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
</head>
<body>
  <p>Seems like the link was wrong or had no "index.html"</p>
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