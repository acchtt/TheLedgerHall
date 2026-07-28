(() => {
  'use strict';
  const chunks = window.__V34_SKIN_CHUNKS || [];
  const valid = chunks.length === 7 && chunks.every((chunk) => typeof chunk === 'string' && chunk.length > 0);
  if (!valid) {
    document.documentElement.classList.add('v34-skin-error');
    return;
  }
  const imageUrl = `data:image/jpeg;base64,${chunks.join('')}`;
  const image = new Image();
  image.onload = () => {
    document.documentElement.style.setProperty('--v34-skin', `url("${imageUrl}")`);
    document.documentElement.classList.remove('v34-skin-error');
    document.documentElement.classList.add('v34-skin-ready');
  };
  image.onerror = () => {
    document.documentElement.classList.remove('v34-skin-ready');
    document.documentElement.classList.add('v34-skin-error');
  };
  image.src = imageUrl;
})();