async function main() {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const files = [
        { name: "app.js", content: encoder.encode(`async function main() {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const files = [
        { name: "file1.txt", content: encoder.encode("Hello") },
        { name: "file2.txt", content: encoder.encode("World!") }
    ];

    const bundle = bundleFiles(files);
    console.log("Bundle len: ", bundle.length);

    const compressed = await compress(bundle);
    console.log("Compressed len: ", compressed.length);

    const decompressed = await decompress(compressed);

    const restored = unbundleFiles(decompressed);

    const restoredFiles = restored.map( ({name, content}) => ({name, content: decoder.decode(content)}));

    console.log(restored);
    console.log(restoredFiles);
}

main();`) },
        { name: "compress.js", content: encoder.encode(`async function compress(bytes) {
  const stream = new Blob([bytes]).stream()
    .pipeThrough(new CompressionStream("brotli"));

  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function decompress(compressedBytes) {
  const stream = new Blob([compressedBytes]).stream()
    .pipeThrough(new DecompressionStream("brotli"));

  return new Uint8Array(await new Response(stream).arrayBuffer());
}


function bytesToBase64(bytes) {
  let base64 = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    base64 += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(base64);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}


function clean(str) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return decoder.decode(encoder.encode(str));
}`) }
    ];

    const bundle = bundleFiles(files);
    console.log("Bundle len: ", bundle.length);

    const compressed = await compress(bundle);
    console.log("Compressed len: ", compressed.length);

    const decompressed = await decompress(compressed);

    const restored = unbundleFiles(decompressed);

    const restoredFiles = restored.map( ({name, content}) => ({name, content: decoder.decode(content)}));

    console.log(restored);
    console.log(restoredFiles);
}

main();