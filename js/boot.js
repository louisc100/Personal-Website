// ═══════════════════════════════
// boot.js — Medieval boot sequence
// ═══════════════════════════════

const BOOT_LINES = [
  { text: '> Kindling the Arcane Forge-fire...', cls: '' },
  { text: '> Consulting the Grand Registry... OK', cls: 'ok' },
  { text: '> Binding cobblestone matrices... OK', cls: 'ok' },
  { text: '> Channeling ley-line conduits... STABLE', cls: 'arcane' },
  { text: '> Loading village & outlying districts...', cls: '' },
  { text: '> WARN: Anomalous flux in North Tower — monitoring', cls: 'warn' },
  { text: '> Calibrating mechanical carriage... OK', cls: 'ok' },
  { text: '> Zone detection modules armed...', cls: 'arcane' },
  { text: '> All systems nominal. Traveller, you may enter.', cls: 'ok' },
];

export function initBoot(onEnter) {
  if (new URLSearchParams(window.location.search).get('skipBoot') === '1') {
    const bootEl = document.getElementById('boot');
    if (bootEl) bootEl.style.display = 'none';
    onEnter();
    return;
  }

  const logEl   = document.getElementById('boot-log');
  const fillEl  = document.getElementById('rune-fill');
  const promptEl= document.getElementById('enter-prompt');

  let delay = 500;

  BOOT_LINES.forEach((line, i) => {
    delay += 350 + Math.random() * 180;
    const pct = Math.round(((i + 1) / BOOT_LINES.length) * 100);

    setTimeout(() => {
      const div = document.createElement('div');
      div.innerHTML = `<span class="${line.cls}">${line.text}</span>`;
      logEl.appendChild(div);
      fillEl.style.width = pct + '%';

      if (i === BOOT_LINES.length - 1) {
        setTimeout(() => {
          promptEl.classList.add('visible');
          _listenForEntry(onEnter);
        }, 550);
      }
    }, delay);
  });
}

function _listenForEntry(onEnter) {
  let fired = false;
  const go = () => {
    if (fired) return;
    fired = true;
    onEnter();
  };

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter') {
      document.removeEventListener('keydown', handler);
      go();
    }
  });

  document.getElementById('enter-prompt')
    ?.addEventListener('click', go, { once: true });
}
