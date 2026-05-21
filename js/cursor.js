// ═══════════════════════════════
// cursor.js — Arcane crosshair cursor
// ═══════════════════════════════

export function initCursor() {
  const el = document.getElementById('cursor');
  if (!el) return;

  document.addEventListener('mousemove', (e) => {
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
  });

  // Enlarge on interactive elements
  const targets = ['a', 'button', '.project-card', '.contact-link',
                   '.scroll-close', '.enter-prompt', '.key-rune'];
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(targets.join(','))) {
      el.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(targets.join(','))) {
      el.classList.remove('hover');
    }
  });
}
