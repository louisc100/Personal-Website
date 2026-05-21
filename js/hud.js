// ═══════════════════════════════
// hud.js — HUD live display updates
// ═══════════════════════════════

const DIRS = ['N','NE','E','SE','S','SW','W','NW'];

function getCardinal(angle) {
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return DIRS[Math.round(a / (Math.PI / 4)) % 8];
}

const SECTORS = [
  { minZ: -Infinity, maxZ: -2,  label: 'SECTOR: VILLAGE GATE · APPROACH', danger: false },
  { minZ: -2,        maxZ: 8,   label: 'SECTOR: VILLAGE SQUARE · ACTIVE', danger: false },
  { minZ: 8,         maxZ: 16,  label: 'SECTOR: MARKET DISTRICT · TRADING POST', danger: false },
  { minZ: 16,        maxZ: 24,  label: 'SECTOR: NORTH WARD · ARCANE DISTRICT', danger: false },
  { minZ: 24,        maxZ: Infinity, label: 'SECTOR: ARCANE FORGE · ⚠ RESTRICTED ZONE', danger: true },
];

export class HUD {
  constructor() {
    this.el         = document.getElementById('hud');
    this.speedEl    = document.getElementById('speed-val');
    this.arcaneEl   = document.getElementById('arcane-fill');
    this.needleEl   = document.getElementById('compass-needle');
    this.dirEl      = document.getElementById('dir-label');
    this.coordXEl   = document.getElementById('coord-x');
    this.coordZEl   = document.getElementById('coord-z');
    this.sectorEl   = document.getElementById('hud-sector');
    this.zoneHintEl = document.getElementById('zone-hint');
  }

  show() {
    this.el?.classList.add('visible');
  }

  update({ x, z, angle, displaySpeed, speed01 }) {
    if (this.speedEl) this.speedEl.textContent = displaySpeed;

    if (this.arcaneEl)
      this.arcaneEl.style.width = Math.min(100, 20 + displaySpeed) + '%';

    if (this.needleEl)
      this.needleEl.style.transform = `rotate(${angle}rad)`;

    if (this.dirEl) this.dirEl.textContent = getCardinal(angle);

    if (this.coordXEl) this.coordXEl.textContent = 'X: ' + x.toFixed(1);
    if (this.coordZEl) this.coordZEl.textContent = 'Z: ' + z.toFixed(1);

    const sector = SECTORS.find(s => z >= s.minZ && z < s.maxZ);
    if (sector && this.sectorEl) {
      this.sectorEl.textContent = sector.label;
      this.sectorEl.classList.toggle('danger', sector.danger);
    }
  }

  showZoneHint(text) {
    if (!this.zoneHintEl) return;
    this.zoneHintEl.textContent = text;
    this.zoneHintEl.classList.add('visible');
  }

  hideZoneHint() {
    this.zoneHintEl?.classList.remove('visible');
  }
}
