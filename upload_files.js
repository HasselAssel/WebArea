const input = document.getElementById("fileInput");

input.addEventListener("change", async (e) => {
  const fileList = [...e.target.files];

  const files = await Promise.all(
    fileList.map(async (file) => ({
      name: file.name,
      content: new Uint8Array(await file.arrayBuffer())
    }))
  );

  console.log(files);
});