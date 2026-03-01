const CACHE = "file-cache";
const SW_URL = "/sw.js"

async function nukeCache() {
  //const regs = await navigator.serviceWorker.getRegistrations();
  //await Promise.all(regs.map(r => r.unregister()));
  await caches.delete(CACHE);
}

async function startSW() {
  await navigator.serviceWorker.register(SW_URL);
}

async function addFile(file) {
  await navigator.serviceWorker.ready;

  navigator.serviceWorker.controller.postMessage({
    type: "add_file",
    file
  });
}

async function addFiles(files) {
  await Promise.all(files.map(file => addFile(file)))
}