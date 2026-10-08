// Use short text marks instead of system-dependent emoji glyphs.
(() => {
  document.querySelectorAll('.skill-card').forEach((card, index) => {
    const label = card.querySelector('h3')?.textContent.trim().toUpperCase() || '';
    const mark = label.startsWith('PYTHON') ? 'PY' : label.startsWith('WEB') ? 'WEB' : label.startsWith('JAVA') ? 'JV' : label.startsWith('MYSQL') ? 'DB' : label.slice(0, 3) || `S${index + 1}`;
    const icon = card.querySelector('.skill-icon');
    if (icon) { icon.textContent = mark; icon.classList.add('emoji-fix'); }
  });
  document.querySelectorAll('.project-image').forEach((panel, index) => {
    if (panel.querySelector('img')) return;
    panel.textContent = `PROJECT ${String(index + 1).padStart(2, '0')}`;
    panel.classList.add('emoji-fix');
  });
  document.querySelectorAll('.contact-icon').forEach((icon, index) => {
    icon.textContent = ['MAIL', 'CALL', 'MAP'][index] || 'INFO';
    icon.classList.add('emoji-fix');
  });
  const status = document.querySelector('.intro-status');
  if (status) status.innerHTML = '<i></i> INTRODUCTION | 00:30';
  const start = document.querySelector('#intro-start');
  const mute = document.querySelector('#intro-mute');
  const skip = document.querySelector('#intro-skip');
  if (start) {
    start.textContent = 'Start introduction';
    start.addEventListener('click', () => setTimeout(() => { start.textContent = 'Voice introduction on'; }, 0));
  }
  if (mute) {
    mute.textContent = 'Mute voice';
    mute.addEventListener('click', () => setTimeout(() => { mute.textContent = mute.getAttribute('aria-pressed') === 'true' ? 'Voice muted' : 'Mute voice'; }, 0));
  }
  if (skip) skip.textContent = 'Skip intro';
  const kicker = document.querySelector('.hero-kicker');
  if (kicker) {
    const statusText = document.querySelector('#profile-availability')?.textContent || '';
    const area = document.querySelector('#profile-location-short')?.textContent || '';
    const dot = kicker.querySelector('.availability-dot') || document.createElement('span');
    dot.className = 'availability-dot';
    kicker.replaceChildren(dot, document.createTextNode(` ${statusText} / ${area}`));
  }
})();
