function setLinkText(link) {
  const el = document.getElementById("link");
  el.textContent = link;
}

const input = document.getElementById("fileInput");
const statusEl = document.getElementById("status");

input.addEventListener("change", async (e) => {
  statusEl.textContent = "Processing... 🤓";

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

  const text = prefix + "#" + base64CompressedBytes;
  setLinkText(text);

  statusEl.textContent = "Done 👍";
  
  const space = document.createElement("div");
  space.style.height = "10px";
  statusEl.appendChild(space);

  fileList.forEach(file => {
    const div = document.createElement("div");
    div.textContent = file.name;
    statusEl.appendChild(div);
  });
});

async function copyMainLink() {
  const el = document.getElementById("link");
  await copyToClipBoard(el.textContent);
}

async function copyFileOnlyLink() {
  const el = document.getElementById("link");
  const url = new URL(el.textContent);
  const whatWillItBe = Math.random() < 0.5 ? "f" : "d";
  url.searchParams.set(whatWillItBe, "");
  await navigator.clipboard.writeText(url.href);
}

async function copyToClipBoard(content) {
  await navigator.clipboard.writeText(content);
}
