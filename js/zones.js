// ═══════════════════════════════
// zones.js — Research Centre & Game Zone Districts
// Two new northern districts beyond the Forge Tower
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

const PERFORMANCE_MODE = true;
const ENABLE_DECORATIVE_POINT_LIGHTS = !PERFORMANCE_MODE;

// ── Shared material factory (mirrors world.js palette + zone-specific) ──
function makeZoneMats() {
  return {
    // Inherited base palette
    stone:       new THREE.MeshLambertMaterial({ color: 0x3d3025 }),
    stoneDark:   new THREE.MeshLambertMaterial({ color: 0x252015 }),
    stoneMid:    new THREE.MeshLambertMaterial({ color: 0x4a3a28 }),
    stoneLight:  new THREE.MeshLambertMaterial({ color: 0x5a4a35 }),
    wood:        new THREE.MeshLambertMaterial({ color: 0x4a2c0f }),
    woodLight:   new THREE.MeshLambertMaterial({ color: 0x6b4020 }),
    woodDark:    new THREE.MeshLambertMaterial({ color: 0x2a1608 }),
    iron:        new THREE.MeshLambertMaterial({ color: 0x1a1a1a }),
    ironWarm:    new THREE.MeshLambertMaterial({ color: 0x2a1f10 }),
    copper:      new THREE.MeshLambertMaterial({ color: 0x7c4a1e, emissive: 0x3d1f00, emissiveIntensity: 0.2 }),
    gold:        new THREE.MeshLambertMaterial({ color: 0xd4af37, emissive: 0x6b5000, emissiveIntensity: 0.4 }),
    arcane:      new THREE.MeshLambertMaterial({ color: 0x00e5ff, emissive: 0x00aacc, emissiveIntensity: 0.85 }),
    ember:       new THREE.MeshLambertMaterial({ color: 0xff6a00, emissive: 0xff3300, emissiveIntensity: 1.0 }),
    emberSoft:   new THREE.MeshLambertMaterial({ color: 0xff9933, emissive: 0xff6600, emissiveIntensity: 0.6 }),
    slate:       new THREE.MeshLambertMaterial({ color: 0x1a2030 }),
    cobble:      new THREE.MeshLambertMaterial({ color: 0x2e2010 }),
    cobbleMid:   new THREE.MeshLambertMaterial({ color: 0x352510 }),
    cobbleDark:  new THREE.MeshLambertMaterial({ color: 0x221808 }),
    dirt:        new THREE.MeshLambertMaterial({ color: 0x251a0a }),
    grass:       new THREE.MeshLambertMaterial({ color: 0x182210 }),
    smoke:       new THREE.MeshLambertMaterial({ color: 0x445566, transparent: true, opacity: 0.4 }),
    parchment:   new THREE.MeshLambertMaterial({ color: 0xc9a96e, emissive: 0x6b4000, emissiveIntensity: 0.15 }),
    gearMetal:   new THREE.MeshLambertMaterial({ color: 0x2a2218, emissive: 0x100800, emissiveIntensity: 0.1 }),
    brassBright: new THREE.MeshLambertMaterial({ color: 0xc8922a, emissive: 0x7a4400, emissiveIntensity: 0.35 }),
    // ── Research Centre palette ──
    // Cool scientific blues/teals, polished obsidian, glowing data-streams
    obsidian:    new THREE.MeshLambertMaterial({ color: 0x0a0d18, emissive: 0x000830, emissiveIntensity: 0.4 }),
    dataBlue:    new THREE.MeshLambertMaterial({ color: 0x0055cc, emissive: 0x002266, emissiveIntensity: 0.7 }),
    dataTeal:    new THREE.MeshLambertMaterial({ color: 0x00ccaa, emissive: 0x006655, emissiveIntensity: 0.75 }),
    crystalBlue: new THREE.MeshLambertMaterial({ color: 0x55aaff, emissive: 0x1144aa, emissiveIntensity: 0.8, transparent: true, opacity: 0.82 }),
    crystalTeal: new THREE.MeshLambertMaterial({ color: 0x00eedd, emissive: 0x007766, emissiveIntensity: 0.9, transparent: true, opacity: 0.80 }),
    runeBlue:    new THREE.MeshLambertMaterial({ color: 0x1a2040, emissive: 0x000840, emissiveIntensity: 0.35 }),
    ivoryStone:  new THREE.MeshLambertMaterial({ color: 0x8a7a60, emissive: 0x1a0e00, emissiveIntensity: 0.0 }),
    darkPanel:   new THREE.MeshLambertMaterial({ color: 0x0d1020, emissive: 0x000420, emissiveIntensity: 0.2 }),
    glowGreen:   new THREE.MeshLambertMaterial({ color: 0x00ff88, emissive: 0x008844, emissiveIntensity: 1.0 }),
    glowAmber:   new THREE.MeshLambertMaterial({ color: 0xffcc00, emissive: 0xaa7700, emissiveIntensity: 0.9 }),
    // ── Game Zone palette ──
    // Warmer, playful — rich purples, electric accents, carnival stonework
    arenaStone:  new THREE.MeshLambertMaterial({ color: 0x3a2d45 }),
    arenaDark:   new THREE.MeshLambertMaterial({ color: 0x1e1428 }),
    arenaLight:  new THREE.MeshLambertMaterial({ color: 0x5a4570 }),
    purple:      new THREE.MeshLambertMaterial({ color: 0x8800ff, emissive: 0x440088, emissiveIntensity: 0.7 }),
    purpleDeep:  new THREE.MeshLambertMaterial({ color: 0x4400aa, emissive: 0x220055, emissiveIntensity: 0.5 }),
    magenta:     new THREE.MeshLambertMaterial({ color: 0xff00cc, emissive: 0x880066, emissiveIntensity: 0.8 }),
    electric:    new THREE.MeshLambertMaterial({ color: 0xffee00, emissive: 0xaa9900, emissiveIntensity: 0.9 }),
    neonRed:     new THREE.MeshLambertMaterial({ color: 0xff2244, emissive: 0xaa0022, emissiveIntensity: 0.85 }),
    festive:     new THREE.MeshLambertMaterial({ color: 0xff6622, emissive: 0xaa2200, emissiveIntensity: 0.6 }),
    flagRed:     new THREE.MeshLambertMaterial({ color: 0xcc1111, emissive: 0x660000, emissiveIntensity: 0.3 }),
    flagBlue:    new THREE.MeshLambertMaterial({ color: 0x1144cc, emissive: 0x002266, emissiveIntensity: 0.3 }),
    flagGold:    new THREE.MeshLambertMaterial({ color: 0xffcc22, emissive: 0xaa7700, emissiveIntensity: 0.4 }),
  };
}

function addZonePointLight(scene, color, intensity, distance, x, y, z) {
  if (!ENABLE_DECORATIVE_POINT_LIGHTS) return null;
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  return light;
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTRICT GROUND
// Paves two plazas and a connecting crossroad beyond the forge (Z≈38+)
// ─────────────────────────────────────────────────────────────────────────────
function buildDistrictGround(scene, M) {
  const cobbleMats = [M.cobble, M.cobbleMid, M.cobbleDark];

  // ── Crossroad connecting the two districts (Z=38, spans X=-22 to 22) ──
  const crossDirt = new THREE.Mesh(new THREE.BoxGeometry(46, 0.03, 5.0), M.dirt);
  crossDirt.position.set(0, 0.01, 40); scene.add(crossDirt);
  for (let i = -22; i <= 22; i++) {
    const mat = cobbleMats[Math.abs(i * 3) % 3];
    const c = new THREE.Mesh(new THREE.BoxGeometry(
      0.85 + Math.random()*0.18, 0.06 + Math.random()*0.03, 1.8 + Math.random()*0.22), mat);
    c.position.set(i*1.02 + (Math.random()-0.5)*0.15, 0.03, 40 + (Math.random()-0.5)*0.2);
    c.rotation.y = (Math.random()-0.5)*0.08;
    scene.add(c);
  }

  // ── Path from forge (Z=33) up to crossroad (Z=38) — extend main road ──
  const dirtExt = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.03, 10), M.dirt);
  dirtExt.position.set(0, 0.01, 37); scene.add(dirtExt);
  for (let i = 34; i <= 41; i++) {
    [[-0.88],[0.88]].forEach(([ox]) => {
      const mat = cobbleMats[Math.abs(i * 5) % 3];
      const c = new THREE.Mesh(new THREE.BoxGeometry(
        1.7 + Math.random()*0.22, 0.06 + Math.random()*0.03, 0.85 + Math.random()*0.18), mat);
      c.position.set(ox + (Math.random()-0.5)*0.1, 0.03, i*1.05 + (Math.random()-0.5)*0.2);
      c.rotation.y = (Math.random()-0.5)*0.08;
      scene.add(c);
    });
  }

  // ── Research Centre plaza (right / east, X=10–22, Z=42–62) ──
  const rcDirt = new THREE.Mesh(new THREE.BoxGeometry(14, 0.03, 22), M.dirt);
  rcDirt.position.set(16, 0.01, 52); scene.add(rcDirt);
  // Polished dark plaza tiles (circuit-board feel — a grid of obsidian slabs)
  for (let xi = 0; xi < 6; xi++) {
    for (let zi = 0; zi < 10; zi++) {
      const mat = (xi + zi) % 2 === 0 ? M.runeBlue : M.obsidian;
      const tile = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.055, 2.0), mat);
      tile.position.set(10 + xi*2.1, 0.027, 42 + zi*2.1);
      tile.receiveShadow = true; scene.add(tile);
    }
  }
  // Glowing rune lines on plaza (data-stream channels)
  [0, 4.2, 8.4].forEach(ox => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.065, 20), M.dataTeal);
    line.position.set(11 + ox, 0.035, 52); scene.add(line);
  });
  [0, 4.2, 8.4, 12.6, 16.8].forEach(oz => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.065, 0.14), M.dataBlue);
    line.position.set(16, 0.035, 43 + oz); scene.add(line);
  });

  // ── Path from crossroad to Research Centre ──
  for (let i = 0; i < 5; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const mat = cobbleMats[(i+side+3)%3];
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.055, 0.8), mat);
      p.position.set(7 + i*0.9 + (Math.random()-0.5)*0.1, 0.027, 40 + (Math.random()-0.5)*0.3);
      scene.add(p);
    }
  }

  // ── Game Zone plaza (left / west, X=-22 to -10, Z=42–62) ──
  const gzDirt = new THREE.Mesh(new THREE.BoxGeometry(14, 0.03, 22), M.dirt);
  gzDirt.position.set(-16, 0.01, 52); scene.add(gzDirt);
  // Warm arena flagstones — slightly raised, irregular
  for (let xi = 0; xi < 6; xi++) {
    for (let zi = 0; zi < 10; zi++) {
      const mat = (xi + zi) % 3 === 0 ? M.arenaDark : M.arenaStone;
      const tile = new THREE.Mesh(new THREE.BoxGeometry(
        1.9 + Math.random()*0.18, 0.05 + Math.random()*0.02, 1.9 + Math.random()*0.18), mat);
      tile.position.set(-22 + xi*2.1 + (Math.random()-0.5)*0.1, 0.025, 42 + zi*2.1 + (Math.random()-0.5)*0.1);
      tile.rotation.y = (Math.random()-0.5)*0.06;
      tile.receiveShadow = true; scene.add(tile);
    }
  }
  // Coloured trim lines (festive circuit)
  [0, 6.3, 12.6].forEach(oz => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.07, 0.18), M.purple);
    line.position.set(-16, 0.036, 44 + oz); scene.add(line);
  });

  // ── Path from crossroad to Game Zone ──
  for (let i = 0; i < 5; i++) {
    const mat = cobbleMats[i%3];
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.055, 0.8), mat);
    p.position.set(-7 - i*0.9 + (Math.random()-0.5)*0.1, 0.027, 40 + (Math.random()-0.5)*0.3);
    scene.add(p);
  }

  // ── Gateway arch pillars (either side of main road at Z=38) ──
  // These mark the transition from village to the new districts
  [[-5.5, 38],[5.5, 38]].forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 6.5, 0.9), M.stoneMid);
    pillar.position.set(px, 3.25, pz); pillar.castShadow = true; scene.add(pillar);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.0, 4), M.slate);
    cap.rotation.y = Math.PI/4; cap.position.set(px, 7.2, pz); scene.add(cap);
    const capOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24),
      new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0xaa6600, emissiveIntensity: 0.8 }));
    capOrb.position.set(px, 7.85, pz); scene.add(capOrb);
    addZonePointLight(scene, 0xffcc44, 1.2, 7, px, 7.85, pz);
  });
  // Arch lintel between pillars
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.55, 0.65), M.stoneDark);
  lintel.position.set(0, 6.72, 38); scene.add(lintel);
  const lintelGlow = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.18, 0.30), M.arcane);
  lintelGlow.position.set(0, 6.72, 38); scene.add(lintelGlow);

  // ── Scatter grass tufts in northern zone periphery ──
  const northGrass = [
    [-8,42],[-9,48],[-8,55],[-9,60],[-22,45],[-22,52],[-22,58],
    [22,45],[22,52],[22,58],[8,42],[9,48],[8,55],[9,60],
    [-5,65],[5,65],[0,64],
  ];
  northGrass.forEach(([gx, gz]) => {
    for (let t = 0; t < 4; t++) {
      const mat = Math.random() < 0.5 ? M.grass : M.grassDark;
      const tuft = new THREE.Mesh(new THREE.BoxGeometry(
        0.06+Math.random()*0.06, 0.18+Math.random()*0.14, 0.06+Math.random()*0.06), mat);
      tuft.position.set(gx+(Math.random()-0.5)*2.5, 0.09, gz+(Math.random()-0.5)*2.5);
      tuft.rotation.y = Math.random()*Math.PI*2;
      scene.add(tuft);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH CENTRE
// X≈16, Z≈52 (right / east district)
// Aesthetic: Arcane-scientific observatory complex — dark obsidian walls,
// glowing data conduits, modular tower wings, a central analysis dome,
// holographic sigil arrays, instrument clusters
// ─────────────────────────────────────────────────────────────────────────────
export function buildResearchCentre(scene, x, z) {
  const M = makeZoneMats();
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  // Faces south (toward player approach from crossroad)
  g.rotation.y = Math.PI;

  // ══ FOUNDATION PLATFORM ══
  const plat = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.55, 9.5), M.obsidian);
  plat.position.y = 0.27; plat.castShadow = true; g.add(plat);
  // Glowing border inlay
  const border = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.07, 9.7), M.dataTeal);
  border.position.y = 0.51; g.add(border);
  // Raised inner platform
  const innerPlat = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.18, 8.8), M.runeBlue);
  innerPlat.position.y = 0.58; g.add(innerPlat);

  // ══ MAIN CENTRAL BLOCK ══
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(8.0, 5.5, 7.5), M.obsidian);
  mainBlock.position.y = 3.27; mainBlock.castShadow = true; mainBlock.receiveShadow = true; g.add(mainBlock);
  // Horizontal data-conduit bands
  [1.5, 3.0, 4.5, 5.8].forEach(by => {
    const band = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.10, 7.6), M.dataTeal);
    band.position.y = by; g.add(band);
  });
  // Vertical conduit strips on facade
  [-2.8, -0.9, 0.9, 2.8].forEach(bx => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 5.5, 0.12), M.dataBlue);
    strip.position.set(bx, 3.27, 3.77); g.add(strip);
    // Node pulses
    [1.2, 2.8, 4.5].forEach(by => {
      const node = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.20, 0.14), M.crystalTeal);
      node.position.set(bx, by, 3.79); g.add(node);
    });
  });

  // ══ LEFT WING (Mathematics / PDE lab) ══
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.0, 6.5), M.runeBlue);
  leftWing.position.set(-5.9, 2.55, 0.2); leftWing.castShadow = true; g.add(leftWing);
  // Wing facade conduits
  [-0.8, 0.8].forEach(bx => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 4.0, 0.10), M.dataTeal);
    strip.position.set(-5.9+bx, 2.55, 3.26); g.add(strip);
  });
  const leftRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.24, 6.9), M.darkPanel);
  leftRoof.position.set(-5.9, 4.67, 0.2); g.add(leftRoof);
  // Mini spire on wing
  const leftSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.18, 1.8, 8), M.copper);
  leftSpire.position.set(-5.9, 5.7, 0.2); g.add(leftSpire);
  const leftGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), M.crystalBlue);
  leftGem.position.set(-5.9, 6.7, 0.2); g.add(leftGem);
  // Left wing windows — tall blue glass panels
  [-0.1, 1.6, -1.8].forEach(wz => {
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.60, 1.80, 0.16), M.iron);
    wFrame.position.set(-5.9, 2.55, 3.28+wz*0.3); g.add(wFrame);
    const wGlass = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.58, 0.10), M.crystalBlue);
    wGlass.position.set(-5.9, 2.55, 3.30+wz*0.3); g.add(wGlass);
  });

  // ══ RIGHT WING (Statistics / Data lab) ══
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.0, 6.5), M.runeBlue);
  rightWing.position.set(5.9, 2.55, 0.2); rightWing.castShadow = true; g.add(rightWing);
  [-0.8, 0.8].forEach(bx => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 4.0, 0.10), M.dataBlue);
    strip.position.set(5.9+bx, 2.55, 3.26); g.add(strip);
  });
  const rightRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.24, 6.9), M.darkPanel);
  rightRoof.position.set(5.9, 4.67, 0.2); g.add(rightRoof);
  const rightSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.18, 1.8, 8), M.copper);
  rightSpire.position.set(5.9, 5.7, 0.2); g.add(rightSpire);
  const rightGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), M.crystalTeal);
  rightGem.position.set(5.9, 6.7, 0.2); g.add(rightGem);
  [-0.1, 1.6, -1.8].forEach(wz => {
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.60, 1.80, 0.16), M.iron);
    wFrame.position.set(5.9, 2.55, 3.28+wz*0.3); g.add(wFrame);
    const wGlass = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.58, 0.10), M.crystalTeal);
    wGlass.position.set(5.9, 2.55, 3.30+wz*0.3); g.add(wGlass);
  });

  // ══ CENTRAL ANALYSIS DOME ══
  const domeRing = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.12, 1.20, 16), M.obsidian);
  domeRing.position.set(0, 6.87, -0.5); g.add(domeRing);
  // Dome ring glow band
  const domeGlow = new THREE.Mesh(new THREE.TorusGeometry(2.06, 0.09, 8, 32), M.dataTeal);
  domeGlow.rotation.x = Math.PI/2;
  domeGlow.position.set(0, 7.46, -0.5); g.add(domeGlow);
  // Hemisphere
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 18, 10, 0, Math.PI*2, 0, Math.PI/2), M.darkPanel);
  dome.position.set(0, 7.46, -0.5); dome.castShadow = true; g.add(dome);
  // Dome meridian ribs (glowing)
  for (let r = 0; r < 8; r++) {
    const a = (r/8)*Math.PI*2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.06), M.dataBlue);
    rib.position.set(Math.cos(a)*1.0, 8.2, -0.5 + Math.sin(a)*1.0);
    rib.rotation.y = a; g.add(rib);
  }
  // Dome slit observation aperture
  const slit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.0, 0.18), M.crystalBlue);
  slit.position.set(0, 8.1, 1.48); g.add(slit);
  // Crystal pinnacle
  const pinnacle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 2.2, 8), M.copper);
  pinnacle.position.set(0, 10.25, -0.5); g.add(pinnacle);
  const pinnacleGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), M.crystalBlue);
  pinnacleGem.position.set(0, 11.55, -0.5); g.add(pinnacleGem);

  // ══ FRONT ENTRANCE PORTAL ══
  // Entry arch
  const archFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.6, 0.35), M.obsidian);
  archFrame.position.set(0, 1.8, 3.77); g.add(archFrame);
  const archTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.14, 1.14, 0.33, 12, 1, false, 0, Math.PI), M.obsidian);
  archTop.rotation.z = Math.PI/2; archTop.rotation.y = Math.PI/2;
  archTop.position.set(0, 3.6, 3.75); g.add(archTop);
  // Glowing arch border
  const archBorder = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.6, 0.12), M.dataTeal);
  archBorder.position.set(-1.20, 1.8, 3.79); g.add(archBorder);
  const archBorderR = archBorder.clone();
  archBorderR.position.set(1.20, 1.8, 3.79); g.add(archBorderR);
  // Doors (sliding panel aesthetic — dark with teal circuit lines)
  [-0.55, 0.55].forEach(dx => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.35, 0.12), M.darkPanel);
    door.position.set(dx, 1.67, 3.81); g.add(door);
    // Circuit lines on door
    [0.6, 1.4, 2.2, 3.0].forEach(dy => {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.06), M.dataTeal);
      line.position.set(dx, dy, 3.84); g.add(line);
    });
    [-0.3, 0.3].forEach(lx => {
      const vline = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.2, 0.06), M.dataBlue);
      vline.position.set(dx+lx, 1.67, 3.84); g.add(vline);
    });
  });
  // Arch keystone gem
  const keyGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), M.crystalBlue);
  keyGem.position.set(0, 4.75, 3.80); g.add(keyGem);

  // ══ ENTRANCE WINDOWS (flanking arch) ══
  [-3.2, 3.2].forEach(wx => {
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.80, 2.8, 0.22), M.iron);
    wFrame.position.set(wx, 2.6, 3.78); g.add(wFrame);
    const wGlass = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.55, 0.13), M.crystalBlue);
    wGlass.position.set(wx, 2.6, 3.81); g.add(wGlass);
    // Arch cap on window
    const wArch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.30, 0.30, 0.15, 10, 1, false, 0, Math.PI), M.iron);
    wArch.rotation.z = Math.PI/2; wArch.rotation.y = Math.PI/2;
    wArch.position.set(wx, 3.9, 3.76); g.add(wArch);
  });

  // ══ HOLOGRAPHIC SIGIL ARRAY (front plaza, floating hexagonal panels) ══
  const sigilPositions = [[-4.5,0.8,5.2],[-2.0,1.2,5.5],[0,0.9,5.3],[2.0,1.1,5.5],[4.5,0.8,5.2]];
  sigilPositions.forEach(([sx, sy, sz], i) => {
    const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 6), M.runeBlue);
    panel.position.set(sx, sy, sz); g.add(panel);
    const glyph = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 6),
      i % 2 === 0 ? M.crystalBlue : M.crystalTeal);
    glyph.position.set(sx, sy+0.04, sz); g.add(glyph);
    addZonePointLight(scene, i % 2 === 0 ? 0x44aaff : 0x00eedd, 0.8, 4, x + sx, sy + 0.5, z + sz);
    // Thin pole holding it up
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, sy), M.ironWarm);
    pole.position.set(sx, sy/2, sz); g.add(pole);
  });

  // ══ INSTRUMENT CLUSTER (right yard — telescope + gauges) ══
  const instrBase = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.55, 0.30, 10), M.obsidian);
  instrBase.position.set(5.0, 0.72, 5.5); g.add(instrBase);
  const instrPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), M.copper);
  instrPole.position.set(5.0, 1.42, 5.5); g.add(instrPole);
  const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.6, 10), M.copper);
  scopeTube.rotation.z = 0.65;
  scopeTube.position.set(5.4, 2.0, 5.5); g.add(scopeTube);
  const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.14, 10), M.crystalBlue);
  scopeLens.rotation.z = 0.65;
  scopeLens.position.set(5.9, 2.52, 5.5); g.add(scopeLens);

  // ══ ROAD-SIDE DATA PYLONS (marking the path to the centre) ══
  [-4.5, 4.5].forEach(px => {
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 0.35), M.obsidian);
    pylon.position.set(px, 2.17, 6.0); g.add(pylon);
    const pGlow = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.20, 0.20), M.crystalTeal);
    pGlow.position.set(px, 4.15, 6.0); g.add(pGlow);
    addZonePointLight(scene, 0x00eedd, 1.0, 6, x + px, 4.5, z + 6.0);
    // Horizontal band every 1m
    [1.0, 2.0, 3.0].forEach(by => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.42), M.dataBlue);
      band.position.set(px, by, 6.0); g.add(band);
    });
  });

  // ══ COMING SOON SIGN ══
  const signArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), M.ironWarm);
  signArm.position.set(0, 5.55, 4.35); g.add(signArm);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.80, 0.14), M.darkPanel);
  signBoard.position.set(0, 5.05, 4.82); g.add(signBoard);
  const signBorder = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.90, 0.10), M.dataTeal);
  signBorder.position.set(0, 5.05, 4.80); g.add(signBorder);
  const signFace = new THREE.Mesh(new THREE.BoxGeometry(3.75, 0.62, 0.10), M.runeBlue);
  signFace.position.set(0, 5.05, 4.85); g.add(signFace);

  // ══ LIGHTS ══
  addZonePointLight(scene, 0x0088ff, 3.0, 24, x, 6, z);
  addZonePointLight(scene, 0x00eedd, 2.0, 16, x, 11, z);
  addZonePointLight(scene, 0x0044cc, 1.5, 14, x + 5, 2, z + 5);

  scene.add(g);
  return { g, pinnacleGem };
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME ZONE
// X≈-16, Z≈52 (left / west district)
// Aesthetic: Festive arena — warm purples, electric accents, round colosseum
// walls, tournament banners, scoreboard tower, prize podium, carnival arches
// ─────────────────────────────────────────────────────────────────────────────
export function buildGameZone(scene, x, z) {
  const M = makeZoneMats();
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = Math.PI;

  // ══ OUTER ARENA WALL (partial colosseum ring) ══
  // An arc of wall segments wrapping the rear and sides
  for (let i = 0; i < 14; i++) {
    const a = (i / 13) * Math.PI + Math.PI * 0.05; // arc from ~185° to ~355°
    const r = 7.8;
    const wx = Math.cos(a) * r;
    const wz = Math.sin(a) * r - 2.0;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.5, 1.5), M.arenaStone);
    seg.position.set(wx, 2.25, wz);
    seg.rotation.y = a; seg.castShadow = true; g.add(seg);
    // Merlon on top
    const merl = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.55), M.arenaDark);
    merl.position.set(wx, 4.82, wz); g.add(merl);
    // Every other segment gets a banner
    if (i % 2 === 0) {
      const bannerMat = [M.flagRed, M.flagBlue, M.flagGold][i % 3];
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 1.1), bannerMat);
      banner.position.set(wx * 1.02, 3.2, wz * 1.02);
      banner.rotation.y = a + Math.PI; g.add(banner);
    }
  }

  // ══ MAIN ARENA FLOOR ══
  const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 7.0, 0.22, 18), M.arenaDark);
  arenaFloor.position.set(0, 0.11, -2.0); arenaFloor.receiveShadow = true; g.add(arenaFloor);
  // Inner ring (competition circle — glowing)
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.14, 8, 36), M.purple);
  innerRing.rotation.x = Math.PI/2;
  innerRing.position.set(0, 0.25, -2.0); g.add(innerRing);
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.10, 8, 40), M.purpleDeep);
  outerRing.rotation.x = Math.PI/2;
  outerRing.position.set(0, 0.25, -2.0); g.add(outerRing);
  // Cardinal marker stars
  for (let i = 0; i < 4; i++) {
    const a = (i/4)*Math.PI*2;
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), M.electric);
    star.position.set(Math.cos(a)*3.8, 0.36, -2.0 + Math.sin(a)*3.8); g.add(star);
  }

  // ══ SCOREBOARD TOWER (centre-back) ══
  const sbBase = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.50, 1.2), M.arenaDark);
  sbBase.position.set(0, 0.25, -7.8); g.add(sbBase);
  const sbTower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.5, 1.0), M.arenaStone);
  sbTower.position.set(0, 3.25, -7.8); sbTower.castShadow = true; g.add(sbTower);
  // Dark screen panel
  const sbScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.8, 0.14), M.darkPanel);
  sbScreen.position.set(0, 3.25, -7.26); g.add(sbScreen);
  // Screen border (electric glow)
  const sbBorder = new THREE.Mesh(new THREE.BoxGeometry(3.75, 3.95, 0.10), M.electric);
  sbBorder.position.set(0, 3.25, -7.24); g.add(sbBorder);
  // Score placeholders (two columns, red vs blue)
  [-1.0, 1.0].forEach((sx, si) => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.4, 0.08), si===0?M.neonRed:M.dataBlue);
    col.position.set(sx, 3.25, -7.22); g.add(col);
    // "Bar graph" segments
    [0.5, 1.2, 2.0, 2.6, 3.1].slice(0, si===0?3:4).forEach(by => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.28, 0.06),
        si===0?M.neonRed:M.dataBlue);
      bar.position.set(sx, by, -7.20); g.add(bar);
    });
  });
  // Scoreboard top — carnival spire
  const sbRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.5, 4), M.arenaLight);
  sbRoof.rotation.y = Math.PI/4; sbRoof.position.set(0, 6.50, -7.8); g.add(sbRoof);
  const sbSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.15, 1.6, 8), M.iron);
  sbSpire.position.set(0, 7.8, -7.8); g.add(sbSpire);
  const sbStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.26), M.electric);
  sbStar.position.set(0, 8.7, -7.8); g.add(sbStar);
  addZonePointLight(scene, 0xffee00, 2.0, 10, x, 8.5, z - 7.8);
  // Corner flags on scoreboard
  [-2.0, 2.0].forEach(fx => {
    const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), M.iron);
    fPole.position.set(fx, 7.1, -7.8); g.add(fPole);
    const fFlag = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.48), fx<0?M.flagRed:M.flagBlue);
    fFlag.position.set(fx+0.36, 8.0, -7.78);
    fFlag.rotation.y = Math.PI; g.add(fFlag);
  });

  // ══ ENTRANCE CARNIVAL ARCH ══
  // Two thick pylons
  [-3.2, 3.2].forEach((px, pi) => {
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(1.3, 6.5, 1.3), M.arenaStone);
    pylon.position.set(px, 3.25, 5.5); pylon.castShadow = true; g.add(pylon);
    // Pylon bands
    [1.5, 3.0, 4.5].forEach(by => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.16, 1.45), M.arenaLight);
      band.position.set(px, by, 5.5); g.add(band);
    });
    // Top cap
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), M.purple);
    cap.rotation.y = Math.PI/4; cap.position.set(px, 7.45, 5.5); g.add(cap);
    const capGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.20),
      pi===0?M.neonRed:M.dataBlue);
    capGem.position.set(px, 8.3, 5.5); g.add(capGem);
    addZonePointLight(scene, pi === 0 ? 0xff2244 : 0x1144cc, 1.5, 8, x + px, 8.3, z + 5.5);
  });
  // Arch lintel
  const archLintel = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.70, 0.90), M.arenaDark);
  archLintel.position.set(0, 6.65, 5.5); g.add(archLintel);
  const archGlow = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.28, 0.55), M.purple);
  archGlow.position.set(0, 6.65, 5.52); g.add(archGlow);
  // "GAME ZONE" text suggestion — sign under arch
  const archSign = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.70, 0.16), M.darkPanel);
  archSign.position.set(0, 5.55, 5.55); g.add(archSign);
  const archSignBorder = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.84, 0.12), M.magenta);
  archSignBorder.position.set(0, 5.55, 5.53); g.add(archSignBorder);
  const archSignFace = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.55, 0.10), M.arenaDark);
  archSignFace.position.set(0, 5.55, 5.57); g.add(archSignFace);

  // ══ SIDE SPECTATOR STANDS (left & right of arena) ══
  [-1, 1].forEach(side => {
    const baseX = side * 6.2;
    // Three tiered rows
    [0, 1, 2].forEach(tier => {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(
        1.1, 0.55, 9.0), M.arenaStone);
      stand.position.set(baseX + side*tier*0.5, 0.44 + tier*0.55, -2.2);
      g.add(stand);
    });
    // Railing
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.30, 9.2), M.iron);
    rail.position.set(baseX + side*1.5, 2.10, -2.2); g.add(rail);
    // Team colour panel
    const teamPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 8.6),
      side < 0 ? M.neonRed : M.dataBlue);
    teamPanel.position.set(baseX + side*0.55, 1.35, -2.2); g.add(teamPanel);
  });

  // ══ PRIZE PODIUM (centre front) ══
  // Three-step podium
  [[0, 0.55, 0.6],[0.9, 0.38, 0.45],[-0.9, 0.28, 0.35]].forEach(([px, py, ph]) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.75, ph, 0.65), M.arenaLight);
    step.position.set(px, ph/2, 4.2); g.add(step);
    // Position label star
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), M.electric);
    star.position.set(px, ph+0.12, 4.2); g.add(star);
  });
  // Trophy cup on top step
  const trophyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.16, 8), M.gold);
  trophyBase.position.set(0, 0.72, 4.2); g.add(trophyBase);
  const trophyBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.30, 8), M.gold);
  trophyBody.position.set(0, 0.94, 4.2); g.add(trophyBody);
  const trophyCup = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.08, 0.25, 10), M.gold);
  trophyCup.position.set(0, 1.21, 4.2); g.add(trophyCup);
  [-0.18, 0.18].forEach(hx => {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 10, Math.PI), M.gold);
    handle.rotation.y = hx > 0 ? 0 : Math.PI;
    handle.position.set(hx, 1.21, 4.2); g.add(handle);
  });
  const trophyGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), M.electric);
  trophyGem.position.set(0, 1.42, 4.2); g.add(trophyGem);

  // ══ CORNER TORCH PILLARS (4, flanking arena) ══
  [[-5.2, 3.5],[ 5.2, 3.5],[-5.2,-6.5],[ 5.2,-6.5]].forEach(([px, pz], pi) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), M.arenaStone);
    pillar.position.set(px, 2.1, pz); pillar.castShadow = true; g.add(pillar);
    const torchBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.30, 8), M.iron);
    torchBase.position.set(px, 4.35, pz); g.add(torchBase);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), M.ember);
    flame.position.set(px, 4.62, pz); g.add(flame);
    addZonePointLight(scene, 0xff7700, 2.0, 10, x + px, 4.8, z + pz);
  });

  // ══ COMING SOON SIGN ══
  const signArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), M.ironWarm);
  signArm.position.set(0, 6.35, 5.9); g.add(signArm);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.80, 0.14), M.darkPanel);
  signBoard.position.set(0, 5.85, 6.40); g.add(signBoard);
  const signBorder = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.94, 0.10), M.magenta);
  signBorder.position.set(0, 5.85, 6.38); g.add(signBorder);
  const signFace = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.68, 0.10), M.arenaDark);
  signFace.position.set(0, 5.85, 6.42); g.add(signFace);

  // ══ LIGHTS ══
  addZonePointLight(scene, 0xaa44ff, 3.2, 26, x, 5, z);
  addZonePointLight(scene, 0xff2244, 2.0, 16, x - 5, 2, z - 2);
  addZonePointLight(scene, 0x1144cc, 2.0, 16, x + 5, 2, z - 2);
  addZonePointLight(scene, 0xffee00, 1.5, 12, x, 2, z + 4);

  scene.add(g);
  return { g, sbStar };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTRICT LANTERNS — extended road lighting for the northern corridor
// ─────────────────────────────────────────────────────────────────────────────
export function buildDistrictLanterns(scene) {
  const iron = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
  const ironWarm = new THREE.MeshLambertMaterial({ color: 0x2a1f10 });
  const lanterns = [];

  // Lanterns along the forge–crossroad corridor (Z=34 to 40)
  const newPositions = [
    [-4, 34], [4, 34], [-4, 39], [4, 39],
    // RC-side path (east)
    [8, 40], [12, 40], [16, 40],
    // GZ-side path (west)
    [-8, 40], [-12, 40], [-16, 40],
    // Along RC plaza edges
    [10, 46], [10, 52], [10, 58],
    [22, 46], [22, 52], [22, 58],
    // Along GZ plaza edges
    [-10, 46], [-10, 52], [-10, 58],
    [-22, 46], [-22, 52], [-22, 58],
  ];

  newPositions.forEach(([lx, lz]) => {
    const g = new THREE.Group();
    g.position.set(lx, 0, lz);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 3.7), iron);
    post.position.y = 1.85; g.add(post);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.07, 0.07), iron);
    arm.position.set(lx <= 0 ? 0.29 : -0.29, 3.65, 0); g.add(arm);

    // Research centre side gets blue-teal lanterns, game zone gets warm purple
    const isRC = lx > 0;
    const globeMat = new THREE.MeshLambertMaterial({
      color:    isRC ? 0x00e5ff : 0xcc44ff,
      emissive: isRC ? 0x00aacc : 0x880088,
      emissiveIntensity: 0.9,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), globeMat);
    globe.position.set(lx <= 0 ? 0.58 : -0.58, 3.62, 0); g.add(globe);
    scene.add(g);

    const lightColor = isRC ? 0x00ddff : 0xcc44ff;
    const light = addZonePointLight(scene, lightColor, 1.4, 9, lx + (lx <= 0 ? 0.58 : -0.58), 3.62, lz);
    lanterns.push({ globe, light });
  });

  return lanterns;
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTRICT TREES — northern tree line framing both plazas
// ─────────────────────────────────────────────────────────────────────────────
export function buildDistrictTrees(scene) {
  const wood    = new THREE.MeshLambertMaterial({ color: 0x4a2c0f });
  const foliage = new THREE.MeshLambertMaterial({ color: 0x162010 });
  const foliage2= new THREE.MeshLambertMaterial({ color: 0x1f2e14 });

  const treePositions = [
    // Between village and new districts (framing the gateway)
    [-8, 36], [8, 36], [-6, 37], [6, 37],
    // RC outer perimeter
    [24, 44], [24, 50], [24, 56], [24, 62],
    [10, 62], [14, 62], [18, 62],
    // GZ outer perimeter
    [-24, 44], [-24, 50], [-24, 56], [-24, 62],
    [-10, 62], [-14, 62], [-18, 62],
    // Between the two districts (north of crossroad)
    [-7, 44], [-7, 50], [-7, 56],
    [7, 44],  [7, 50],  [7, 56],
  ];

  treePositions.forEach(([tx, tz]) => {
    const h = 0.8 + Math.random() * 0.5;
    const g = new THREE.Group();
    g.position.set(tx, 0, tz);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.21, h*1.66), wood);
    trunk.position.y = h*0.83; g.add(trunk);
    [0,1,2].forEach(i => {
      const f = new THREE.Mesh(
        new THREE.ConeGeometry(0.80-i*0.18, 1.12, 7),
        i < 2 ? foliage : foliage2);
      f.position.y = h*1.62+i*0.56+0.36; g.add(f);
    });
    scene.add(g);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — call once from buildWorld()
// Returns objects needed for the animation loop
// ─────────────────────────────────────────────────────────────────────────────
export function buildNorthernDistricts(scene) {
  buildDistrictGround(scene, makeZoneMats());
  buildDistrictTrees(scene);
  const districtLanterns = buildDistrictLanterns(scene);

  // Research Centre: east side, X=16, Z=52 (world coords)
  const rc = buildResearchCentre(scene, 16, 52);

  // Game Zone: west side, X=-16, Z=52 (world coords)
  const gz = buildGameZone(scene, -16, 52);

  return { rc, gz, districtLanterns };
}
