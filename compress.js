/*const format = "CompressionStream" in window &&
               CompressionStream.supportedFormats?.includes?.("brotli")
               ? "brotli"
               : "gzip"; // WTF is this, I was lagging??!?!?!?*/
const format = "gzip";
               

async function compress(bytes) {
  const stream = new Blob([bytes]).stream()
    .pipeThrough(new CompressionStream(format));

  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function decompress(compressedBytes) {
  const stream = new Blob([compressedBytes]).stream()
    .pipeThrough(new DecompressionStream(format));

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
}