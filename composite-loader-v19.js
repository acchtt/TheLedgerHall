(() => {
  const parts = [
    'assets/composite-v19.part0',
    'assets/composite-v19.part1'
  ];

  Promise.all(parts.map(path => fetch(path, { cache: 'force-cache' }).then(response => {
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.text();
  })))
    .then(chunks => {
      const encoded = chunks.join('').replace(/\s+/g, '');
      document.documentElement.style.setProperty(
        '--ledger-composite-v19',
        `url("data:image/webp;base64,${encoded}")`
      );
      document.documentElement.classList.add('composite-v19-ready');
    })
    .catch(error => {
      console.error('Ledger Hall composite background failed to load:', error);
      document.documentElement.classList.add('composite-v19-failed');
    });
})();
