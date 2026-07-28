(() => {
  'use strict';
  const root = document.documentElement;
  const chunks = window.__V35_SKIN_CHUNKS || [];
  const fail = (reason) => {
    root.dataset.skinStatus = reason;
    root.classList.remove('v35-skin-ready');
    root.classList.add('v35-skin-error');
  };

  if (chunks.length !== 8 || chunks.some((chunk) => typeof chunk !== 'string' || !chunk.length)) {
    fail('missing-chunk');
    return;
  }

  const base64 = chunks.join('');
  if (base64.length !== 23892) {
    fail(`length-${base64.length}`);
    return;
  }

  let binary;
  try {
    binary = atob(base64);
  } catch {
    fail('base64');
    return;
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const validJpeg = bytes.length === 17919 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  if (!validJpeg) {
    fail(`signature-${bytes.length}`);
    return;
  }

  const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
  const image = new Image();
  image.onload = () => {
    root.style.setProperty('--v35-skin', `url("${objectUrl}")`);
    root.dataset.skinStatus = 'ready';
    root.classList.remove('v35-skin-error');
    root.classList.add('v35-skin-ready');
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    fail('decode');
  };
  image.src = objectUrl;
})();