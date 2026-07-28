(() => {
  const parts = [
    'assets/ledger-v23.part0',
    'assets/ledger-v23.part1',
    'assets/ledger-v23.part2',
    'assets/ledger-v23.part3'
  ];

  let skinObjectUrl = null;

  function decodeBase64ToBlob(encoded, mimeType) {
    const binary = atob(encoded);
    const chunkSize = 32768;
    const chunks = [];

    for (let offset = 0; offset < binary.length; offset += chunkSize) {
      const slice = binary.slice(offset, offset + chunkSize);
      const bytes = new Uint8Array(slice.length);
      for (let index = 0; index < slice.length; index += 1) {
        bytes[index] = slice.charCodeAt(index);
      }
      chunks.push(bytes);
    }

    return new Blob(chunks, { type: mimeType });
  }

  Promise.all(parts.map(path => fetch(`${path}?build=blob24`, { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.text();
  })))
    .then(chunks => {
      const encoded = chunks.join('').replace(/\s+/g, '');
      const blob = decodeBase64ToBlob(encoded, 'image/webp');
      skinObjectUrl = URL.createObjectURL(blob);
      document.documentElement.style.setProperty('--ledger-skin-v23', `url("${skinObjectUrl}")`);
      document.documentElement.classList.add('skin-v23-ready');
    })
    .catch(error => {
      console.error('Ledger Hall production skin failed to load:', error);
      document.documentElement.classList.add('skin-v23-failed');
    });

  window.addEventListener('pagehide', () => {
    if (skinObjectUrl) URL.revokeObjectURL(skinObjectUrl);
  }, { once: true });
})();
