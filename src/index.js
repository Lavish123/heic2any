import workerStr from './worker.js';
const isHeic = async (file) => {
  const buffer = await file.arrayBuffer()
  const slicedBuffer = buffer.slice(8, 12)
  const brandMajor = new TextDecoder('utf-8')
    .decode(slicedBuffer)
    .replace('\0', ' ')
    .trim();

  switch (brandMajor) {
    case 'mif1':
      return true; // {ext: 'heic', mime: 'image/heif'};
    case 'msf1':
      return true; // {ext: 'heic', mime: 'image/heif-sequence'};
    case 'heic':
    case 'heix':
      return true; // {ext: 'heic', mime: 'image/heic'};
    case 'hevc':
    case 'hevx':
      return true; // {ext: 'heic', mime: 'image/heic-sequence'};
  }

  return false;
};

// Lazy-load worker to avoid initialization issues on load
let worker;
const loadWorker = () => {
    if (!worker) {
        const workerBlob = new Blob([workerStr], { type: "application/javascript" });
        worker = new Worker(URL.createObjectURL(workerBlob))
        worker.onerror = (error) => console.error('Worker error:', error)
    }
    return worker
}

const decodeBuffer = async (buffer) => {
	return new Promise((resolve, reject) => {
    loadWorker()
		const id = (Math.random() * new Date().getTime()).toString();
		const message = { id, buffer };
    worker.postMessage(message);
    const handleEvent = (event) => {
      if (event.data.id === id) {
        event.currentTarget.removeEventListener("message", handleEvent)
        if (event.data.error) {
          return reject(event.data.error);
        }
        return resolve(event.data.imageData);
      }
    }
    worker.addEventListener("message", handleEvent);
	});
}

const encodeByCanvas = async (imageBuffer) => {
  const imageData = await decodeBuffer(imageBuffer)

  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas;
};

const heicTo = async ({blob, type, quality}) => {
  const imageBuffer = await blob.arrayBuffer()
  const canvas = await encodeByCanvas(imageBuffer);
  return await new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob != null)
      resolve(blob);
    else
      reject(`Can't convert canvas to blob.`);
  }, type, quality));
};

export {
  isHeic,
  heicTo
}