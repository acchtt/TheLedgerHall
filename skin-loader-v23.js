(() => {
  const parts = [
    'assets/ledger-v23.part0',
    'assets/ledger-v23.part1',
    'assets/ledger-v23.part2',
    'assets/ledger-v23.part3'
  ];

  Promise.all(parts.map(path => fetch(path, { cache: 'force-cache' }).then(response => {
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.text();
  })))
    .then(chunks => {
      const encoded = chunks.join('').replace(/\s+/g, '');
      document.documentElement.style.setProperty(
        '--ledger-skin-v23',
        `url("data:image/webp;base64,${encoded}")`
      );
      document.documentElement.classList.add('skin-v23-ready');
    })
    .catch(error => {
      console.error('Ledger Hall production skin failed to load:', error);
      document.documentElement.classList.add('skin-v23-failed');
    });
})();
