function bundleFiles(files) {
  const encoder = new TextEncoder();

  let totalSize = 4;

  for (const { name, content } of files) {
    const nameBytes = encoder.encode(name);
    totalSize += 4 + nameBytes.length;
    totalSize += 4 + content.length;
  }

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let offset = 0;

  view.setUint32(offset, files.length);
  offset += 4;

  for (const { name, content } of files) {
    const nameBytes = encoder.encode(name);

    view.setUint32(offset, nameBytes.length);
    offset += 4;

    uint8.set(nameBytes, offset);
    offset += nameBytes.length;

    view.setUint32(offset, content.length);
    offset += 4;

    uint8.set(content, offset);
    offset += content.length;
  }

  return new Uint8Array(buffer);
}

function unbundleFiles(data) {
  const decoder = new TextDecoder();
  const view = new DataView(data.buffer);
  const uint8 = new Uint8Array(data.buffer);

  let offset = 0;

  const fileCount = view.getUint32(offset);
  offset += 4;

  const files = [];

  for (let i = 0; i < fileCount; i++) {
    const nameLength = view.getUint32(offset);
    offset += 4;

    const nameBytes = uint8.slice(offset, offset + nameLength);
    const name = decoder.decode(nameBytes);
    offset += nameLength;

    const contentLength = view.getUint32(offset);
    offset += 4;

    const content = uint8.slice(offset, offset + contentLength);
    offset += contentLength;

    files.push({ name, content });
  }

  return files;
}