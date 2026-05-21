// ═══════════════════════════════════════════════════════
// PATCH NOTES — Northern Districts integration
// Apply these three changes to wire up zones.js
// ═══════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────
// 1. world.js  — TWO CHANGES
// ───────────────────────────────────────────────────────

// ── 1a. Add import at the TOP of world.js (after the Three.js import) ──

import { buildNorthernDistricts } from './zones.js';


// ── 1b. Inside buildWorld(), add BEFORE the return statement ──
//    (right after the birds line and before the lighting block is fine)

  // ── Northern Districts ──
  const { rc, gz, districtLanterns } = buildNorthernDistricts(scene);


// ── 1c. Update the return object to include the new districts ──
//    Replace the existing return { ... } with:

  return {
    forge, lanterns, well, sky,
    zoneMarkers: { projectsMarker, aboutMarker, contactMarker },
    workshop, guildHall,
    campfires: [campfire1, campfire2],
    birds,
    // Northern districts
    rc, gz, districtLanterns,
  };


// ───────────────────────────────────────────────────────
// 2. panels.js  — Add two new zones to the ZONES array
// ───────────────────────────────────────────────────────

// Replace the existing ZONES array with this:

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


// ── Add two new panel builders anywhere before PANEL_CONTENT ──

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


// ── Update PANEL_CONTENT to include the new panels ──
// Add these two entries to the existing PANEL_CONTENT object:

const PANEL_CONTENT = {
  projects: { sigil: '⚗', title: 'Projects Archive',     eyebrow: 'CONSTRUCTED WORKS',    build: buildProjectsPanel },
  about:    { sigil: '📜', title: 'About the Traveller',  eyebrow: 'IDENTITY SCROLL',       build: buildAboutPanel    },
  contact:  { sigil: '✉',  title: 'Transmit a Message',   eyebrow: 'ARCANE CORRESPONDENCE',  build: buildContactPanel  },
  research: { sigil: '🔬', title: 'Research Centre',      eyebrow: 'ARCANE SCIENCES',        build: buildResearchPanel },
  gamezone: { sigil: '🎮', title: 'Game Zone',            eyebrow: 'THE ARENA',              build: buildGameZonePanel },
};


// ───────────────────────────────────────────────────────
// 3. cart.js  — Expand world bounds
// ───────────────────────────────────────────────────────

// Find this block (around line 170):
//   // World bounds
//   this.x = Math.max(-18, Math.min(18, this.x));
//   this.z = Math.max(-12, Math.min(36, this.z));

// Replace with:
    // World bounds — expanded for northern districts
    this.x = Math.max(-24, Math.min(24, this.x));
    this.z = Math.max(-12, Math.min(64, this.z));
