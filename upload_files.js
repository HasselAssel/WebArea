function setLinkText(link) {
  const el = document.getElementById("link");
  el.textContent = link;
}

const input = document.getElementById("fileInput");

input.addEventListener("change", async (e) => {
  const fileList = [...e.target.files];

  const files = await Promise.all(
    fileList.map(async (file) => ({
      name: file.name,
      content: new Uint8Array(await file.arrayBuffer())
    }))
  );

  const bytes = bundleFiles(files);
  const compressedBytes= await compress(bytes);
  const base64CompressedBytes = bytesToBase64(compressedBytes);

  const prefix = window.location.origin + window.location.pathname;

  //const text = "hasselassel.github.io/WebArea/#" + base64CompressedBytes;
  const text = prefix + "#" + base64CompressedBytes;
  setLinkText(text);
});

async function copyLink() {
  const el = document.getElementById("link");
  await navigator.clipboard.writeText(el.textContent);
}