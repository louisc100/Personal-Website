// ═══════════════════════════════
// panels.js — Zone detection + Holographic Arcane Scroll Panels
// ═══════════════════════════════

// ── Zone definitions (world coords) ──
const ZONES = [
  {
    id: 'projects',
    label: '[ PROJECTS ARCHIVE ]',
    minX: -14, maxX: -4, minZ: 2, maxZ: 13,
    hint: '⚙ WORKSHOP — Press E to enter',
  },
  {
    id: 'about',
    label: '[ ABOUT THE TRAVELLER ]',
    minX: 4,  maxX: 14, minZ: 2,  maxZ: 13,
    hint: '📚 ACADEMY — Press E to open',
  },
  {
    id: 'contact',
    label: '[ TRANSMIT MESSAGE ]',
    minX: -7, maxX: 7,  minZ: 17, maxZ: 29,
    hint: '⚜ GUILD HALL — Press E to enter',
  },
  {
    id: 'research',
    label: '[ RESEARCH CENTRE ]',
    minX: 9,  maxX: 23, minZ: 40, maxZ: 62,
    hint: '🔬 RESEARCH CENTRE — Press E to explore',
  },
  {
    id: 'gamezone',
    label: '[ GAME ZONE ]',
    minX: -23, maxX: -9, minZ: 40, maxZ: 62,
    hint: '🎮 GAME ZONE — Press E to enter',
  },
];

// ── Panel HTML content builders ──
function buildProjectsPanel() {
  const projects = [
    { icon: '⚗', name: 'Alchemist UI', desc: 'A design system forged in the arcane traditions of component-driven development.', tags: ['React', 'TypeScript', 'CSS'] },
    { icon: '🗺', name: 'Realm Mapper', desc: 'Interactive world-building tool with procedural generation and live collaboration.', tags: ['Three.js', 'WebSockets', 'Node'] },
    { icon: '📡', name: 'Ether Signal', desc: 'Real-time data pipeline visualization for distributed arcane network nodes.', tags: ['D3.js', 'Kafka', 'Go'] },
    { icon: '🔮', name: 'Oracle API', desc: 'A predictive analytics engine wrapped in a clean RESTful interface.', tags: ['Python', 'FastAPI', 'ML'] },
    { icon: '🏰', name: 'Forge CMS', desc: 'Headless content management built for speed, flexibility, and dark themes.', tags: ['Next.js', 'Sanity', 'Edge'] },
    { icon: '⚔', name: 'Duel Engine', desc: 'Multiplayer strategy game engine with deterministic physics and rollback netcode.', tags: ['C++', 'WebAssembly', 'WebRTC'] },
  ];

  return `
    <div class="scroll-lore">
      "Here lie records of my constructed works — each an attempt to bend
      the laws of computation toward something useful, beautiful, or both."
    </div>
    <div class="scroll-divider">Completed Commissions</div>
    <div class="project-grid">
      ${projects.map(p => `
        <div class="project-card">
          <span class="project-card-icon">${p.icon}</span>
          <div class="project-card-name">${p.name}</div>
          <div class="project-card-desc">${p.desc}</div>
          <div class="project-card-tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function buildAboutPanel() {
  const skills = [
    { name: 'Partial Differential Equations',    pct: 89 },
    { name: 'Statistical Learning',   pct: 88 },
    { name: 'Calculus of Vartiations',        pct: 92 },
    { name: 'Statistical Inference',    pct: 87 },
    { name: 'Analysis',    pct: 85 },
  ];
  const timeline = [
    { year: '2024', title: 'Senior Engineer', text: 'Leading frontend architecture at a funded startup building next-gen dev tooling.' },
    { year: '2022', title: 'Full-Stack Dev', text: 'Built scalable SaaS platforms serving 50k+ users across three continents.' },
    { year: '2020', title: 'First Commit', text: 'Shipped first open-source project. 800 GitHub stars and counting.' },
    { year: '2018', title: 'The Beginning', text: 'Graduated in Computer Science. Promptly ignored everything taught about waterfall.' },
  ];

  return `
    <div class="scroll-lore">
      "A traveller from the northern territories, drawn to the intersection of
      craft and computation. I build things that feel as good as they look."
    </div>
    <div class="scroll-divider">Capability Matrix</div>
    <div class="about-grid">
      <div>
        <div class="about-block-title">Arcane Skills</div>
        ${skills.map(s => `
          <div class="skill-row">
            <div class="skill-name">${s.name}<span>${s.pct}%</span></div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width:${s.pct}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div>
        <div class="about-block-title">Chronicle</div>
        ${timeline.map(e => `
          <div class="timeline-item">
            <div class="timeline-year">${e.year}</div>
            <div class="timeline-text">
              <strong>${e.title}</strong>
              ${e.text}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function buildContactPanel() {
  const links = [
    { icon: '🐙', label: 'GitHub',   val: 'https://github.com/louisc100' },
    { icon: '🔗', label: 'LinkedIn', val: 'https://www.linkedin.com/in/louis-charistias-saragih-969b26265/' },
    { icon: '🐦', label: 'Twitter',  val: '@yourhandle' },
    { icon: '📧', label: 'Email',    val: 'mailto:louischaristias10@gmail.com' },
  ];

  return `
    <div class="scroll-lore">
      "Send a raven, light a signal fire, or simply fill out the form below.
      All messages are received; most are answered within a fortnight."
    </div>
    <div class="scroll-divider">Channels of Correspondence</div>
    <div class="contact-grid">
      ${links.map(l => `
        <div class="contact-link" data-url="${l.val}">
          <span class="contact-icon">${l.icon}</span>
          <div>
            <div class="contact-link-label">${l.label}</div>
            <div class="contact-link-val">${l.val}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="scroll-divider">Transmit a Message</div>
    <div class="transmit-label">Compose Dispatch</div>
    <form onsubmit="return false">
      <div class="transmit-row">
        <input class="arcane-input" type="text"  placeholder="Your name..." />
        <input class="arcane-input" type="email" placeholder="Your email..." />
      </div>
      <textarea class="arcane-input full" placeholder="Your message, traveller..."></textarea>
      <button class="transmit-btn" type="submit">
        <span class="btn-icon">✦</span> Transmit
      </button>
    </form>
  `;
}

function buildResearchPanel() {
  const tracks = [
    {
      icon: '∂',
      name: 'Partial Differential Equations',
      desc: 'Wave equations, heat diffusion, and Laplace solvers rendered as living simulations in the world.',
      tags: ['Finite Differences', 'Spectral Methods', 'Numerical Analysis'],
    },
    {
      icon: '∫',
      name: 'Calculus of Variations',
      desc: 'Brachistochrone curves, minimal surfaces, and geodesics — extremal problems made visual.',
      tags: ['Euler-Lagrange', 'Optimal Paths', 'Functionals'],
    },
    {
      icon: '⟶',
      name: 'Optimal Transport',
      desc: 'Moving measures from source to target — Wasserstein distances and fluid-dynamics duality.',
      tags: ['Wasserstein', 'Monge-Kantorovich', 'Earth Mover'],
    },
    {
      icon: '📈',
      name: 'Statistical Learning',
      desc: 'Bayesian inference engines, live distribution animators, and interactive hypothesis tests.',
      tags: ['Bayesian', 'MCMC', 'Estimation'],
    },
    {
      icon: '🤖',
      name: 'AI Trading Duel',
      desc: 'Two agent NPCs compete on live stock data. Inspect their algorithms and watch the scoreboard.',
      tags: ['Reinforcement Learning', 'Live API', 'Multi-Agent'],
    },
  ];

  return `
    <div class="scroll-lore">
      "Where computation meets mathematics. Each exhibit is a living proof —
      not merely described, but demonstrated. Enter and observe the arcane engines at work."
    </div>
    <div class="scroll-divider">Active Research Tracks</div>
    <div class="project-grid">
      ${tracks.map(t => `
        <div class="project-card">
          <span class="project-card-icon">${t.icon}</span>
          <div class="project-card-name">${t.name}</div>
          <div class="project-card-desc">${t.desc}</div>
          <div class="project-card-tags">
            ${t.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="scroll-divider">Status</div>
    <div class="scroll-lore" style="color: #00eedd; font-style: normal;">
      ⚗ Research Centre is under active construction.
      New exhibits appear as projects are completed.
    </div>
  `;
}

function buildGameZonePanel() {
  const games = [
    {
      icon: '⚔',
      name: 'AI Trading Duel Arena',
      desc: 'Watch two reinforcement-learning agents battle in real-time using live market data. Place your bets.',
      tags: ['Live Stocks API', 'RL Agents', 'Leaderboard'],
      status: 'Planned',
    },
    {
      icon: '🧩',
      name: 'Simulation Sandbox',
      desc: 'Tweak parameters on running simulations — change viscosity, boundary conditions, or initial states.',
      tags: ['Interactive', 'Physics', 'PDE'],
      status: 'Planned',
    },
    {
      icon: '🎯',
      name: 'Optimisation Challenges',
      desc: 'Can you find a better path than the optimal transport solver? Beat the algorithm.',
      tags: ['Puzzle', 'Algorithms', 'Competitive'],
      status: 'Planned',
    },
    {
      icon: '🃏',
      name: 'Probability Duels',
      desc: 'Head-to-head Bayesian inference. Update your priors faster than your opponent.',
      tags: ['Statistics', 'Multiplayer', 'Bayesian'],
      status: 'Planned',
    },
  ];

  return `
    <div class="scroll-lore">
      "The arena awaits challengers. Here, mathematics is not merely studied —
      it is contested. May the best algorithm win."
    </div>
    <div class="scroll-divider">Upcoming Exhibits</div>
    <div class="project-grid">
      ${games.map(g => `
        <div class="project-card">
          <span class="project-card-icon">${g.icon}</span>
          <div class="project-card-name">${g.name}</div>
          <div class="project-card-desc">${g.desc}</div>
          <div class="project-card-tags">
            ${g.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            <span class="tag" style="background: rgba(255,100,0,0.2); border-color: #ff6400; color: #ff9944;">
              ${g.status}
            </span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="scroll-divider">Status</div>
    <div class="scroll-lore" style="color: #cc44ff; font-style: normal;">
      🎮 Game Zone is under construction. The arena is being forged.
      Check back as new challenges are unveiled.
    </div>
  `;
}

const PANEL_CONTENT = {
  projects: { sigil: '⚗', title: 'Projects Archive',     eyebrow: 'CONSTRUCTED WORKS',    build: buildProjectsPanel },
  about:    { sigil: '📜', title: 'About the Traveller',  eyebrow: 'IDENTITY SCROLL',       build: buildAboutPanel    },
  contact:  { sigil: '✉',  title: 'Transmit a Message',   eyebrow: 'ARCANE CORRESPONDENCE',  build: buildContactPanel  },
  research: { sigil: '🔬', title: 'Research Centre',      eyebrow: 'ARCANE SCIENCES',        build: buildResearchPanel },
  gamezone: { sigil: '🎮', title: 'Game Zone',            eyebrow: 'THE ARENA',              build: buildGameZonePanel },
};

// ═══════════════════════════════
// PanelManager
// ═══════════════════════════════

export class PanelManager {
  constructor(hud) {
    this.hud         = hud;
    this.activeZone  = null;
    this.openPanel   = null;
    this.isOpen      = false;

    this._backdrop = document.getElementById('panel-backdrop');
    this._panel    = document.getElementById('scroll-panel');

    this._backdrop?.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' && this.activeZone && !this.isOpen) {
        this.open(this.activeZone.id);
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /** Call every frame with current cart position */
  checkZones(x, z) {
    if (this.isOpen) return;

    const entered = ZONES.find(
      zone => x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ
    );

    if (entered && entered !== this.activeZone) {
      this.activeZone = entered;
      this.hud.showZoneHint(entered.hint);
    } else if (!entered && this.activeZone) {
      this.activeZone = null;
      this.hud.hideZoneHint();
    }
  }

  open(panelId) {
    const cfg = PANEL_CONTENT[panelId];
    if (!cfg || !this._panel) return;

    this.isOpen    = true;
    this.openPanel = panelId;
    this.hud.hideZoneHint();

    // Populate
    this._panel.innerHTML = `
      <div class="scroll-paper">
        <div class="scroll-top-bar">
          <span class="scroll-sigil">${cfg.sigil}</span>
          <div class="scroll-header-text">
            <div class="scroll-eyebrow">${cfg.eyebrow}</div>
            <div class="scroll-title">${cfg.title}</div>
          </div>
          <div class="scroll-close" id="panel-close-btn">✕</div>
        </div>
        ${cfg.build()}
      </div>
    `;

    // Make contact links clickable
    const contactLinks = this._panel.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
      link.addEventListener('click', () => {
        const url = link.dataset.url;
        if (url.startsWith('mailto:')) {
          window.location.href = url; // open email client
        } else {
          window.open(url, '_blank'); // open other links in new tab
        }
      });
    });

    document.getElementById('panel-close-btn')
      ?.addEventListener('click', () => this.close());

    // Show
    this._backdrop?.classList.add('visible');
    requestAnimationFrame(() => {
      this._panel.classList.add('visible');
    });
  }

  close() {
    this.isOpen    = false;
    this.openPanel = null;

    this._panel?.classList.remove('visible');
    this._backdrop?.classList.remove('visible');

    // Re-check zone after close
    setTimeout(() => {
      if (this.activeZone) {
        this.hud.showZoneHint(this.activeZone.hint);
      }
    }, 500);
  }
}
