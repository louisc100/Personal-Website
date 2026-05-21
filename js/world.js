// ═══════════════════════════════
// world.js — Three.js Medieval Village Scene
// Upgraded: landmark buildings, improved geometry, sign posts
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { buildNorthernDistricts } from './zones.js';

const PERFORMANCE_MODE = true;
const ENABLE_DECORATIVE_POINT_LIGHTS = !PERFORMANCE_MODE;
const ENABLE_POINT_LIGHTS = true;

// ═══════════════════════════════
// MATERIAL PALETTE
// ═══════════════════════════════
function makeStablePaneMaterial(color) {
  const mat = new THREE.MeshBasicMaterial({ color });
  mat.depthWrite = false;
  mat.polygonOffset = true;
  mat.polygonOffsetFactor = -2;
  mat.polygonOffsetUnits = -8;
  return mat;
}

function makeMats() {
  return {
    stone:      new THREE.MeshLambertMaterial({ color: 0x3d3025 }),
    stoneDark:  new THREE.MeshLambertMaterial({ color: 0x252015 }),
    stoneMid:   new THREE.MeshLambertMaterial({ color: 0x4a3a28 }),
    stoneLight: new THREE.MeshLambertMaterial({ color: 0x5a4a35 }),
    thatch:     new THREE.MeshLambertMaterial({ color: 0x5c3d1e }),
    thatchDark: new THREE.MeshLambertMaterial({ color: 0x3d2810 }),
    wood:       new THREE.MeshLambertMaterial({ color: 0x4a2c0f }),
    woodLight:  new THREE.MeshLambertMaterial({ color: 0x6b4020 }),
    woodDark:   new THREE.MeshLambertMaterial({ color: 0x2a1608 }),
    gold:       new THREE.MeshLambertMaterial({ color: 0xb88b28, emissive: 0x3a2600, emissiveIntensity: 0.22 }),
    arcane:     new THREE.MeshLambertMaterial({ color: 0x00e5ff, emissive: 0x00aacc, emissiveIntensity: 0.85 }),
    ember:      new THREE.MeshLambertMaterial({ color: 0xff6a00, emissive: 0xff3300, emissiveIntensity: 1.0 }),
    emberSoft:  new THREE.MeshLambertMaterial({ color: 0xff9933, emissive: 0xff6600, emissiveIntensity: 0.6 }),
    ground:     new THREE.MeshLambertMaterial({ color: 0x1e1508 }),
    cobble:     new THREE.MeshLambertMaterial({ color: 0x2e2010 }),
    iron:       new THREE.MeshLambertMaterial({ color: 0x1a1a1a }),
    ironWarm:   new THREE.MeshLambertMaterial({ color: 0x2a1f10 }),
    copper:     new THREE.MeshLambertMaterial({ color: 0x7c4a1e, emissive: 0x3d1f00, emissiveIntensity: 0.2 }),
    foliage:    new THREE.MeshLambertMaterial({ color: 0x162010 }),
    foliage2:   new THREE.MeshLambertMaterial({ color: 0x1f2e14 }),
    slate:      new THREE.MeshLambertMaterial({ color: 0x1a2030 }),
    parchment:  new THREE.MeshLambertMaterial({ color: 0xc9a96e, emissive: 0x6b4000, emissiveIntensity: 0.15 }),
    barrel:     new THREE.MeshLambertMaterial({ color: 0x5c3010 }),
    smoke:      new THREE.MeshLambertMaterial({ color: 0x445566, transparent: true, opacity: 0.4 }),
    blueGlass:  new THREE.MeshLambertMaterial({ color: 0x88ccff, emissive: 0x224488, emissiveIntensity: 0.5 }),
    mud:        new THREE.MeshLambertMaterial({ color: 0x1a1208 }),
    dirt:       new THREE.MeshLambertMaterial({ color: 0x251a0a }),
    grass:      new THREE.MeshLambertMaterial({ color: 0x182210 }),
    grassDark:  new THREE.MeshLambertMaterial({ color: 0x0f1a0a }),
    cobbleDark: new THREE.MeshLambertMaterial({ color: 0x221808 }),
    cobbleMid:  new THREE.MeshLambertMaterial({ color: 0x352510 }),
    wattle:     new THREE.MeshLambertMaterial({ color: 0xb8864e }),
    daub:       new THREE.MeshLambertMaterial({ color: 0xc4a882 }),
    thatchLight:new THREE.MeshLambertMaterial({ color: 0x7a5530 }),
    roofRidge:  new THREE.MeshLambertMaterial({ color: 0x2a1a0c }),
    // New materials for upgraded landmarks
    obsidian:   new THREE.MeshLambertMaterial({ color: 0x0a0a14, emissive: 0x00044a, emissiveIntensity: 0.3 }),
    runeStone:  new THREE.MeshLambertMaterial({ color: 0x1a1030, emissive: 0x220044, emissiveIntensity: 0.2 }),
    gearMetal:  new THREE.MeshLambertMaterial({ color: 0x2a2218, emissive: 0x100800, emissiveIntensity: 0.1 }),
    brassBright:new THREE.MeshLambertMaterial({ color: 0xa97022, emissive: 0x3a1c00, emissiveIntensity: 0.18 }),
    steamPipe:  new THREE.MeshLambertMaterial({ color: 0x3a2a1a, emissive: 0x180800, emissiveIntensity: 0.05 }),
    arcaneDeep: new THREE.MeshLambertMaterial({ color: 0x0055aa, emissive: 0x002266, emissiveIntensity: 0.6 }),
    arcanePurple:new THREE.MeshLambertMaterial({ color: 0x8800ff, emissive: 0x440088, emissiveIntensity: 0.7 }),
    crystalBlue:new THREE.MeshLambertMaterial({ color: 0x44aaff, emissive: 0x1155aa, emissiveIntensity: 0.8, transparent: true, opacity: 0.85 }),
    windowArcane:makeStablePaneMaterial(0x1f8797),
    windowAmber: makeStablePaneMaterial(0x9f541e),
    windowBlue:  makeStablePaneMaterial(0x527f9b),
    goldBright: new THREE.MeshLambertMaterial({ color: 0xcaa63a, emissive: 0x4d2a00, emissiveIntensity: 0.25 }),
    coppGreen:  new THREE.MeshLambertMaterial({ color: 0x2d6b55, emissive: 0x0a2a1a, emissiveIntensity: 0.15 }),
    ivoryStone: new THREE.MeshLambertMaterial({ color: 0x8a7a60, emissive: 0x2a1a00, emissiveIntensity: 0.05 }),
    marbleDark: new THREE.MeshLambertMaterial({ color: 0x30281e, emissive: 0x080400, emissiveIntensity: 0.0 }),
  };
}

function addPointLight(scene, color, intensity, distance, x, y, z, { decorative = true } = {}) {
  if (!ENABLE_POINT_LIGHTS) return { intensity };
  if (decorative && !ENABLE_DECORATIVE_POINT_LIGHTS) return null;
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(x, y, z);
  scene.add(light);
  return light;
}

const terrainOverlayMats = new WeakMap();

function getTerrainOverlayMat(material, offsetUnits = -3) {
  if (!terrainOverlayMats.has(material)) {
    const clone = material.clone();
    clone.depthWrite = false;
    clone.polygonOffset = true;
    clone.polygonOffsetFactor = -1;
    clone.polygonOffsetUnits = offsetUnits;
    terrainOverlayMats.set(material, clone);
  }
  return terrainOverlayMats.get(material);
}

// ═══════════════════════════════
// GROUND & PATHS
// ═══════════════════════════════
function addGrassClump(parent, M, x, z, radius = 0.9, density = 10) {
  for (let i = 0; i < density; i++) {
    const mat = Math.random() < 0.65 ? M.grass : M.grassDark;
    const tuft = new THREE.Mesh(
      new THREE.ConeGeometry(0.05 + Math.random() * 0.07, 0.18 + Math.random() * 0.22, 5),
      mat
    );
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    tuft.position.set(
      x + Math.cos(angle) * dist,
      0.09 + Math.random() * 0.03,
      z + Math.sin(angle) * dist
    );
    tuft.rotation.y = Math.random() * Math.PI * 2;
    parent.add(tuft);
  }
}

function addFlagstone(parent, material, x, z, w, d, y = 0.04, rot = 0) {
  const stone = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.018 + Math.random() * 0.008, d),
    getTerrainOverlayMat(material, -6)
  );
  stone.position.set(x, y, z);
  stone.rotation.y = rot;
  stone.receiveShadow = false;
  parent.add(stone);
  return stone;
}

function addCobblePaver(parent, material, x, z, w, d, y = 0.064, rot = 0) {
  const stone = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.018, d),
    getTerrainOverlayMat(material, -7)
  );
  stone.position.set(x, y, z);
  stone.rotation.y = rot;
  stone.receiveShadow = false;
  parent.add(stone);
  return stone;
}

function addCobbleStrip(parent, mats, centerX, startZ, endZ, width, step = 0.62) {
  const rows = Math.floor((endZ - startZ) / step);
  for (let r = 0; r <= rows; r++) {
    const z = startZ + r * step;
    const stagger = r % 2 === 0 ? 0 : 0.36;
    for (let x = -width / 2 + 0.36; x <= width / 2 - 0.2; x += 0.72) {
      const edgeTaper = Math.abs(x) > width * 0.38 ? 0.88 : 1.0;
      const mat = mats[Math.abs((r * 3 + Math.round((x + 10) * 5))) % mats.length];
      addCobblePaver(
        parent,
        mat,
        centerX + x + stagger * 0.35 + (Math.random() - 0.5) * 0.025,
        z + (Math.random() - 0.5) * 0.025,
        (0.58 + Math.random() * 0.05) * edgeTaper,
        0.48 + Math.random() * 0.05,
        0.068,
        (Math.random() - 0.5) * 0.018
      );
    }
  }
}

function addCobbleCrossing(parent, mats, startX, endX, centerZ, depth, step = 0.66) {
  const cols = Math.floor((endX - startX) / step);
  for (let c = 0; c <= cols; c++) {
    const x = startX + c * step;
    const stagger = c % 2 === 0 ? 0 : 0.30;
    for (let z = -depth / 2 + 0.35; z <= depth / 2 - 0.2; z += 0.66) {
      const mat = mats[Math.abs((c * 5 + Math.round((z + 10) * 4))) % mats.length];
      addCobblePaver(
        parent,
        mat,
        x + (Math.random() - 0.5) * 0.025,
        centerZ + z + stagger * 0.35 + (Math.random() - 0.5) * 0.025,
        0.52 + Math.random() * 0.05,
        0.56 + Math.random() * 0.05,
        0.072,
        (Math.random() - 0.5) * 0.018
      );
    }
  }
}

function buildGround(scene, M) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220, 1, 1), M.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  const turfMats = [M.grassDark, M.grass, M.foliage2];
  [
    [-14, 9, 24, 20, 0.02, turfMats[0]],
    [14, 9, 24, 20, 0.02, turfMats[1]],
    [0, 32, 40, 18, 0.02, turfMats[1]],
    [0, -16, 34, 24, 0.02, turfMats[0]],
    [-28, 0, 28, 30, 0.02, turfMats[2]],
    [28, 0, 28, 30, 0.02, turfMats[2]],
  ].forEach(([x, z, w, d, y, mat]) => {
    const turf = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, d), getTerrainOverlayMat(mat, -2));
    turf.position.set(x, y + 0.02, z);
    turf.receiveShadow = false;
    scene.add(turf);
  });

  const roadBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.024, 60), getTerrainOverlayMat(M.cobbleDark, -3));
  roadBase.position.set(0, 0.03, 10);
  roadBase.receiveShadow = false;
  scene.add(roadBase);

  const roadCross = new THREE.Mesh(new THREE.BoxGeometry(26, 0.024, 6.2), getTerrainOverlayMat(M.cobbleDark, -3));
  roadCross.position.set(0, 0.03, 7);
  roadCross.receiveShadow = false;
  scene.add(roadCross);

  const laneWear = [
    [-1.25, 58, 0.52],
    [1.25, 58, 0.48],
    [0, 16, 0.36],
  ];
  laneWear.forEach(([x, depth, opacity]) => {
    const rut = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.015, depth), getTerrainOverlayMat(M.mud, -7));
    rut.position.set(x, 0.05, 10);
    rut.material = rut.material.clone();
    rut.material.transparent = true;
    rut.material.opacity = opacity;
    scene.add(rut);
  });

  const squareApron = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.03, 10.5), getTerrainOverlayMat(M.cobbleDark, -4));
  squareApron.position.set(0, 0.04, 7.2);
  squareApron.receiveShadow = false;
  scene.add(squareApron);

  const cobbleMats = [M.stoneMid, M.stoneLight, M.cobbleMid, M.cobble];
  addCobbleStrip(scene, cobbleMats, 0, -14.5, 41.5, 4.75, 0.62);
  addCobbleCrossing(scene, cobbleMats, -12.4, 12.4, 7, 5.25, 0.66);

  for (let i = -24; i <= 31; i++) {
    const z = i * 1.02 + 9.5;
    const leftMat = cobbleMats[Math.abs(i * 5 + 1) % cobbleMats.length];
    const rightMat = cobbleMats[Math.abs(i * 7 + 2) % cobbleMats.length];
    addFlagstone(scene, leftMat, -2.68 + (Math.random() - 0.5) * 0.08, z, 0.34 + Math.random() * 0.08, 0.70 + Math.random() * 0.10, 0.062, (Math.random() - 0.5) * 0.035);
    addFlagstone(scene, rightMat, 2.68 + (Math.random() - 0.5) * 0.08, z + (Math.random() - 0.5) * 0.04, 0.34 + Math.random() * 0.08, 0.70 + Math.random() * 0.10, 0.062, (Math.random() - 0.5) * 0.035);

    if (i >= -4 && i <= 10) {
      const centerMat = cobbleMats[Math.abs(i * 3 + 2) % cobbleMats.length];
      addFlagstone(
        scene,
        centerMat,
        (Math.random() - 0.5) * 0.18,
        z + 0.08,
        0.42 + Math.random() * 0.08,
        0.50 + Math.random() * 0.08,
        0.078,
        (Math.random() - 0.5) * 0.025
      );
    }
  }

  for (let i = -11; i <= 11; i++) {
    const mat = cobbleMats[Math.abs(i * 5 + 1) % cobbleMats.length];
    addFlagstone(
      scene,
      mat,
      i * 1.0 + (Math.random() - 0.5) * 0.06,
      7 + (Math.random() - 0.5) * 0.10,
      0.48 + Math.random() * 0.08,
      0.56 + Math.random() * 0.08,
      0.082,
      (Math.random() - 0.5) * 0.025
    );
  }

  for (let i = 0; i < 9; i++) {
    const mat = cobbleMats[i % cobbleMats.length];
    addFlagstone(scene, mat, -4.2 - i * 0.92 + (Math.random() - 0.5) * 0.06, 7 + (Math.random() - 0.5) * 0.10, 0.46 + Math.random() * 0.08, 0.52 + Math.random() * 0.08, 0.082, (Math.random() - 0.5) * 0.035);
    addFlagstone(scene, mat, 4.2 + i * 0.92 + (Math.random() - 0.5) * 0.06, 7 + (Math.random() - 0.5) * 0.10, 0.46 + Math.random() * 0.08, 0.52 + Math.random() * 0.08, 0.082, (Math.random() - 0.5) * 0.035);
  }

  for (let i = 0; i < 6; i++) {
    for (let side = -1; side <= 1; side += 2) {
      const mat = cobbleMats[Math.abs(i + side) % cobbleMats.length];
      addFlagstone(
        scene,
        mat,
        side * 1.45 + (Math.random() - 0.5) * 0.08,
        17 + i * 1.18 + (Math.random() - 0.5) * 0.14,
        0.44 + Math.random() * 0.08,
        0.52 + Math.random() * 0.08,
        0.078,
        (Math.random() - 0.5) * 0.03
      );
    }
  }

  for (let i = 0; i < 12; i++) {
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 1.02), M.stoneMid);
    curbL.position.set(-2.78, 0.075, -14 + i * 2.15);
    curbL.rotation.y = (Math.random() - 0.5) * 0.04;
    curbL.receiveShadow = false;
    scene.add(curbL);

    const curbR = curbL.clone();
    curbR.position.x = 2.78;
    scene.add(curbR);
  }

  const mudSpots = [
    [-7,-3,1.8], [7,-3,1.8], [-7,13,1.8], [7,13,1.8],
    [-2,1,0], [2,4,0], [0,7,0], [-9.5,2,0.8], [9.5,2,0.8],
  ];
  mudSpots.forEach(([mx, mz, rz]) => {
    const mud = new THREE.Mesh(new THREE.BoxGeometry(
      1.2+Math.random()*0.6, 0.01, 0.8+Math.random()*0.5), getTerrainOverlayMat(M.mud, -8));
    mud.position.set(mx+(Math.random()-0.5)*0.3, 0.04, mz+rz+(Math.random()-0.5)*0.2);
    mud.rotation.y = Math.random()*Math.PI;
    scene.add(mud);
  });

  const grassZones = [
    [-10,5],[-12,10],[-10,16],[-13,20],[-16,3],[-16,14],
    [ 10,5],[ 12,10],[ 10,16],[ 13,20],[ 16,3],[ 16,14],
    [-6,-7],[ 6,-7],[-5,28],[5,28],[-8,25],[8,25],
  ];
  grassZones.forEach(([gx, gz]) => addGrassClump(scene, M, gx, gz, 1.8, 12));

  [
    [-18, 24, 3.4, 2.6], [18, 24, 3.4, 2.6], [-20, 6, 3.6, 2.8], [20, 6, 3.6, 2.8],
    [-13, -10, 3.0, 2.2], [13, -10, 3.0, 2.2], [-6, 33, 2.8, 2.0], [6, 33, 2.8, 2.0],
  ].forEach(([x, z, w, d]) => {
    const patch = new THREE.Mesh(
      new THREE.CylinderGeometry(w, w * 0.88, 0.04, 10),
      getTerrainOverlayMat(Math.random() < 0.5 ? M.grass : M.foliage, -5)
    );
    patch.scale.z = d / w;
    patch.position.set(x, 0.055, z);
    patch.rotation.y = Math.random() * Math.PI;
    patch.receiveShadow = false;
    scene.add(patch);
  });

  for (let z = -16; z <= 36; z += 2.4) {
    addGrassClump(scene, M, -3.55 + (Math.random() - 0.5) * 0.25, z + (Math.random() - 0.5) * 0.3, 0.55, 5);
    addGrassClump(scene, M, 3.55 + (Math.random() - 0.5) * 0.25, z + (Math.random() - 0.5) * 0.3, 0.55, 5);
  }

  for (let i = 0; i < 60; i++) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const pebble = new THREE.Mesh(new THREE.BoxGeometry(
      0.10+Math.random()*0.12, 0.05+Math.random()*0.04, 0.10+Math.random()*0.12), M.cobbleDark);
    pebble.position.set(
      side*(2.2+Math.random()*0.8) + (Math.random()-0.5)*0.3,
      0.025,
      (Math.random()-0.5)*50 + 10,
    );
    pebble.rotation.y = Math.random()*Math.PI*2;
    scene.add(pebble);
  }

  for (let rz = 1.4; rz <= 6.8; rz += 0.72) {
    const stagger = Math.round(rz * 10) % 2 === 0 ? 0 : 0.34;
    for (let sx = -3.2; sx <= 3.2; sx += 0.72) {
      const mat = cobbleMats[Math.abs(Math.round(sx * 7 + rz * 5)) % cobbleMats.length];
      addCobblePaver(
        scene,
        mat,
        sx + stagger * 0.25 + (Math.random() - 0.5) * 0.02,
        rz + (Math.random() - 0.5) * 0.02,
        0.48 + Math.random() * 0.05,
        0.50 + Math.random() * 0.05,
        0.086,
        (Math.random() - 0.5) * 0.015
      );
    }
  }
}

// ═══════════════════════════════
// STANDARD HOUSE — Medieval Half-Timbered
// ═══════════════════════════════
function buildHouse(scene, M, x, z, rotY, scale=1, arcLevel=0) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  g.scale.setScalar(scale);

  const found = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.42, 4.4), M.stoneDark);
  found.position.y = 0.21; found.castShadow = true; found.receiveShadow = true; g.add(found);
  for (let fi = 0; fi < 6; fi++) {
    const fw = 0.48 + Math.random()*0.22;
    const stone = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.18, 0.16), M.stone);
    stone.position.set(-1.3 + fi*0.46, 0.35, 2.22 + (Math.random()-0.5)*0.06);
    stone.rotation.y = (Math.random()-0.5)*0.05;
    g.add(stone);
  }

  const gWalls = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 4.0), M.daub);
  gWalls.position.y = 1.22; gWalls.castShadow = true; gWalls.receiveShadow = true; g.add(gWalls);

  const studXs = [-1.4, -0.65, 0, 0.65, 1.4];
  studXs.forEach(sx => {
    const stud = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.62, 0.12), M.woodDark);
    stud.position.set(sx, 1.21, 2.07); g.add(stud);
  });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.10, 0.12), M.woodDark);
  rail.position.set(0, 1.55, 2.07); g.add(rail);
  const sill = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.10, 0.12), M.woodDark);
  sill.position.set(0, 0.44, 2.07); g.add(sill);

  [-2.0, 2.0].forEach((sz, si) => {
    [0.42, 1.60].forEach(sy => {
      const hbeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 4.05), M.woodDark);
      hbeam.position.set(si === 0 ? -1.56 : 1.56, sy, 0); g.add(hbeam);
    });
    [-1.8, -0.6, 0.6, 1.8].forEach(svz => {
      const vstud = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.62, 0.10), M.woodDark);
      vstud.position.set(si === 0 ? -1.56 : 1.56, 1.21, svz); g.add(vstud);
    });
  });

  const upperWalls = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.45, 4.1), M.wattle);
  upperWalls.position.y = 2.75; upperWalls.castShadow = true; g.add(upperWalls);
  const jettyBeam = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.18, 0.14), M.woodDark);
  jettyBeam.position.set(0, 2.00, 2.08); g.add(jettyBeam);
  studXs.forEach(sx => {
    const ustud = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.46, 0.12), M.woodDark);
    ustud.position.set(sx, 2.74, 2.17); g.add(ustud);
  });
  [[-1.05, -0.32], [0.35, -0.32]].forEach(([bx, dir]) => {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.1, 0.10), M.woodDark);
    brace.rotation.z = dir * 0.65;
    brace.position.set(bx, 2.74, 2.17); g.add(brace);
  });
  const urail = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.10, 0.12), M.woodDark);
  urail.position.set(0, 3.42, 2.17); g.add(urail);

  const roofL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.82, 4.55), M.thatch);
  roofL.rotation.z = 0.62;
  roofL.position.set(-0.92, 4.26, 0); roofL.castShadow = true; g.add(roofL);
  const roofR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.82, 4.55), M.thatch);
  roofR.rotation.z = -0.62;
  roofR.position.set(0.92, 4.26, 0); roofR.castShadow = true; g.add(roofR);
  const roofFillL = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.12, 4.55), M.thatch);
  roofFillL.rotation.z = 0.62;
  roofFillL.position.set(-0.88, 4.25, 0); g.add(roofFillL);
  const roofFillR = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.12, 4.55), M.thatch);
  roofFillR.rotation.z = -0.62;
  roofFillR.position.set(0.88, 4.25, 0); g.add(roofFillR);
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 4.65), M.roofRidge);
  ridge.position.set(0, 4.85, 0); g.add(ridge);
  [-2.2, 2.2].forEach(gz => {
    const gable = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.72, 1.68, 3), M.thatchLight);
    gable.rotation.y = Math.PI; gable.position.set(0, 4.26, gz); g.add(gable);
    const gbt = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.5, 0.10), M.woodDark);
    gbt.position.set(0, 4.14, gz + (gz > 0 ? 0.05 : -0.05)); g.add(gbt);
  });
  [-2.3, 2.3].forEach(ez => {
    const eave = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.10, 0.38), M.woodDark);
    eave.position.set(0, 3.56, ez); g.add(eave);
  });

  const chimX = 0.9, chimZ = -1.5;
  const chim = new THREE.Mesh(new THREE.BoxGeometry(0.56, 2.0, 0.56), M.stoneDark);
  chim.position.set(chimX, 4.0, chimZ); g.add(chim);
  const chimTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.16, 0.68), M.stone);
  chimTop.position.set(chimX, 5.05, chimZ); g.add(chimTop);
  [-0.3, 0.3].forEach(cx => {
    const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.6), M.stone);
    corbel.position.set(chimX+cx, 4.96, chimZ); g.add(corbel);
  });

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.55, 0.14), M.woodDark);
  doorFrame.position.set(0, 0.77, 2.08); g.add(doorFrame);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.36, 0.10), M.wood);
  door.position.set(0, 0.68, 2.11); g.add(door);
  [-0.22, 0, 0.22].forEach(dx => {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.36, 0.05), M.woodDark);
    plank.position.set(dx, 0.68, 2.14); g.add(plank);
  });
  [[-0.28,0.3],[0.28,0.3],[-0.28,0.9],[0.28,0.9]].forEach(([ds, dy]) => {
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.04,5,5), M.iron);
    stud.position.set(ds, dy, 2.16); g.add(stud);
  });
  const step = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.36), M.stoneMid);
  step.position.set(0, 0.04, 2.26); g.add(step);

  [-0.9, 0.9].forEach((wx, wi) => {
    const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.54, 0.14), M.woodDark);
    wFrame.position.set(wx, 1.28, 2.08); g.add(wFrame);
    const mh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.07), M.woodDark);
    mh.position.set(wx, 1.28, 2.13); g.add(mh);
    const mv = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.44, 0.07), M.woodDark);
    mv.position.set(wx, 1.28, 2.13); g.add(mv);
    const glaze = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.04),
      arcLevel > 0 ? M.windowArcane : M.windowAmber);
    glaze.position.set(wx, 1.28, 2.10); g.add(glaze);
    const shutterClosed = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.44, 0.06), M.wood);
    shutterClosed.position.set(wx - 0.32, 1.28, 2.15); g.add(shutterClosed);
    const shutterOpen = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.44, 0.06), M.wood);
    shutterOpen.rotation.y = wi === 0 ? -1.2 : 1.2;
    shutterOpen.position.set(wx + 0.34, 1.28, 2.10); g.add(shutterOpen);
    const wsill = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.07, 0.22), M.stoneMid);
    wsill.position.set(wx, 1.03, 2.14); g.add(wsill);
  });

  const uwFrame = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.62, 0.14), M.woodDark);
  uwFrame.position.set(0, 2.76, 2.22); g.add(uwFrame);
  const uwGlaze = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.04),
    arcLevel > 0 ? M.windowArcane : M.windowAmber);
  uwGlaze.position.set(0, 2.76, 2.24); g.add(uwGlaze);
  const uwSill = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.20), M.stoneMid);
  uwSill.position.set(0, 2.45, 2.28); g.add(uwSill);

  [-0.9, 0.9].forEach(wx => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.14, 0.18), M.woodDark);
    box.position.set(wx, 1.01, 2.18); g.add(box);
    [0,1,2].forEach(fi => {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.04,4,4), M.ember);
      flower.position.set(wx - 0.16 + fi*0.16, 1.12, 2.20); g.add(flower);
    });
  });

  if (arcLevel >= 1) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2), M.copper);
    rod.position.set(0, 5.5, 0); g.add(rod);
    const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), M.gold);
    tip.position.set(0, 6.18, 0); g.add(tip);
  }
  if (arcLevel >= 2) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0), M.arcane);
    tube.position.set(1.52, 1.6, 0.4); g.add(tube);
  }

  scene.add(g);
  return g;
}

// ═══════════════════════════════
// SIGN POST HELPER
// ═══════════════════════════════
function buildSignPost(parentGroup, x, y, z, M) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1), M.ironWarm);
  pole.position.set(x, y - 0.55, z); parentGroup.add(pole);
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.1), M.woodLight);
  board.position.set(x, y, z); parentGroup.add(board);
  const face = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.08), M.parchment);
  face.position.set(x, y, z + 0.04); parentGroup.add(face);
  [[-0.42,0.12],[-0.42,-0.12],[0.42,0.12],[0.42,-0.12]].forEach(([sx, sy]) => {
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 5), M.gold);
    stud.position.set(x+sx, y+sy, z+0.05); parentGroup.add(stud);
  });
}

function buildSign(parentGroup, x, y, z, M) {
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.1), M.woodLight);
  board.position.set(x, y, z); parentGroup.add(board);
  const face = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.08), M.parchment);
  face.position.set(x, y, z + 0.04); parentGroup.add(face);
}

// ═══════════════════════════════
// LANDMARK 1: ARCANE WORKSHOP / MAGITEK FORGE
// (Projects zone — left side, X≈-11, Z≈7)
// Aesthetic: Industrial medieval + arcane machinery, multi-level,
// clock-tower-like with exposed gears, steam pipes, rune arrays
// ═══════════════════════════════
function buildWorkshop(scene, M, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = Math.PI * 0.5;

  // ── Wide stone foundation platform ──
  const plat = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.50, 6.2), M.stoneDark);
  plat.position.y = 0.25; plat.castShadow = true; g.add(plat);
  // Stepped front approach
  [0.38, 0.22, 0.08].forEach((sy, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(3.2 + i*0.5, 0.16, 0.55), M.stoneMid);
    step.position.set(0, sy, 3.12 + i*0.55); g.add(step);
  });
  // Foundation corner blocks
  [[-3.8,2.9],[3.8,2.9],[-3.8,-2.9],[3.8,-2.9]].forEach(([cx,cz]) => {
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), M.stone);
    block.position.set(cx, 0.35, cz); g.add(block);
  });

  // ── Main hall body — two-tone stone & iron ──
  const hallLow = new THREE.Mesh(new THREE.BoxGeometry(7.5, 2.6, 5.8), M.stone);
  hallLow.position.y = 1.80; hallLow.castShadow = true; hallLow.receiveShadow = true; g.add(hallLow);
  const hallUp = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.8, 5.9), M.stoneMid);
  hallUp.position.y = 4.10; hallUp.castShadow = true; g.add(hallUp);

  // ── Iron I-beam frame on facade ──
  [-3.0, -1.0, 1.0, 3.0].forEach(bx => {
    const vb = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.5, 0.20), M.gearMetal);
    vb.position.set(bx, 3.0, 2.95); g.add(vb);
    const capTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.28), M.gearMetal);
    capTop.position.set(bx, 5.28, 2.96); g.add(capTop);
  });
  [-0.8, 1.6, 3.3, 5.0].forEach(by => {
    const hb = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.15, 0.18), M.gearMetal);
    hb.position.set(0, by, 2.96); g.add(hb);
  });

  // ── Central clock tower rising from the hall ──
  const towerBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.5, 3.0), M.stoneLight);
  towerBase.position.set(0, 5.25, 0); g.add(towerBase);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(2.7, 4.2, 2.7), M.stoneDark);
  tower.position.set(0, 7.6, 0); tower.castShadow = true; g.add(tower);
  // Tower corner buttresses
  [[-1.2,-1.2],[1.2,-1.2],[-1.2,1.2],[1.2,1.2]].forEach(([cx,cz]) => {
    const butt = new THREE.Mesh(new THREE.BoxGeometry(0.45, 4.5, 0.45), M.stone);
    butt.position.set(cx, 7.5, cz); g.add(butt);
    const bCap = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.6, 4), M.slate);
    bCap.rotation.y = Math.PI/4;
    bCap.position.set(cx, 9.85, cz); g.add(bCap);
  });
  // Tower merlons
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    if (Math.abs(Math.cos(a)) > 0.3 && Math.abs(Math.sin(a)) > 0.3) continue; // corners handled by buttresses
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.38), M.stoneMid);
    m.position.set(Math.cos(a)*1.3, 9.72, Math.sin(a)*1.3); g.add(m);
  }
  // Clock face — large brass gear ring
  const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.12, 16), M.gearMetal);
  clockFace.rotation.x = Math.PI/2;
  clockFace.position.set(0, 7.8, 1.38); g.add(clockFace);
  // Gear teeth on clock face
  for (let t = 0; t < 16; t++) {
    const a = (t/16)*Math.PI*2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.18, 0.12), M.brassBright);
    tooth.position.set(Math.cos(a)*1.06, 7.8, 1.38 + Math.sin(a)*1.06);
    tooth.rotation.x = a; g.add(tooth);
  }
  const clockInner = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.10, 16), M.brassBright);
  clockInner.rotation.x = Math.PI/2;
  clockInner.position.set(0, 7.8, 1.40); g.add(clockInner);
  // Clock hands
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.60, 0.05), M.ironWarm);
  hourHand.position.set(0, 7.8, 1.42);
  hourHand.rotation.z = 0.8; g.add(hourHand);
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.82, 0.05), M.gold);
  minHand.position.set(0, 7.8, 1.43);
  minHand.rotation.z = -1.2; g.add(minHand);

  // Tower roof — steep pyramid
  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(1.65, 3.2, 4), M.slate);
  towerRoof.rotation.y = Math.PI/4;
  towerRoof.position.set(0, 10.3, 0); towerRoof.castShadow = true; g.add(towerRoof);
  // Spire
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 1.8, 8), M.iron);
  spire.position.set(0, 12.2, 0); g.add(spire);
  const spireGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), M.arcane);
  spireGem.position.set(0, 13.25, 0); g.add(spireGem);

  // ── Side wing: lower annexe (right side) ──
  const annexe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, 4.2), M.stoneMid);
  annexe.position.set(4.55, 1.9, -0.2); annexe.castShadow = true; g.add(annexe);
  const annexRoof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 4.4), M.thatchDark);
  annexRoof.position.set(4.55, 3.4, -0.2); annexRoof.castShadow = true; g.add(annexRoof);
  // Annexe chimney
  const achim = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.8, 0.55), M.stoneDark);
  achim.position.set(5.2, 3.5, -1.1); g.add(achim);
  const achimTop = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.16, 0.70), M.stone);
  achimTop.position.set(5.2, 4.44, -1.1); g.add(achimTop);

  // ── Exposed steam pipes on front wall ──
  // Vertical pipes left cluster
  [-2.0, -2.55].forEach((px, pi) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.2, 8), M.steamPipe);
    pipe.position.set(px, 2.1, 3.00); g.add(pipe);
    // Elbow (box connector)
    const elbow = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.30), M.brassBright);
    elbow.position.set(px, 3.65, 3.05); g.add(elbow);
    // Horizontal run from elbow
    const hpipe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7+pi*0.3, 8), M.steamPipe);
    hpipe.rotation.z = Math.PI/2;
    hpipe.position.set(px + 0.4 + pi*0.15, 3.65, 3.00); g.add(hpipe);
    // Steam vent cap
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.18, 8), M.brassBright);
    vent.rotation.x = -0.4;
    vent.position.set(px + 0.85 + pi*0.35, 3.9, 2.88); g.add(vent);
  });
  // Pipe along roof edge (right side)
  const roofPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 6.8, 8), M.steamPipe);
  roofPipe.rotation.z = Math.PI/2;
  roofPipe.position.set(0, 5.48, 2.96); g.add(roofPipe);
  // Pipe clamps
  [-2.5, -0.5, 1.5, 3.0].forEach(cx => {
    const clamp = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.04, 5, 10), M.iron);
    clamp.rotation.y = Math.PI/2;
    clamp.position.set(cx, 5.48, 2.96); g.add(clamp);
  });

  // ── Giant wall gear (right of door) ──
  const gearRing = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.13, 10, 20), M.gearMetal);
  gearRing.position.set(2.55, 2.8, 3.08); g.add(gearRing);
  for (let sp = 0; sp < 12; sp++) {
    const a = (sp/12)*Math.PI*2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.65, 0.08), M.ironWarm);
    spoke.rotation.z = a; spoke.position.set(2.55, 2.8, 3.09); g.add(spoke);
  }
  // Gear teeth
  for (let t = 0; t < 20; t++) {
    const a = (t/20)*Math.PI*2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.10), M.brassBright);
    tooth.position.set(2.55 + Math.cos(a)*0.95, 2.8 + Math.sin(a)*0.95, 3.11);
    tooth.rotation.z = a; g.add(tooth);
  }
  const gearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 8), M.brassBright);
  gearHub.rotation.x = Math.PI/2;
  gearHub.position.set(2.55, 2.8, 3.12); g.add(gearHub);

  // Secondary smaller gear (meshing)
  const gear2Ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.09, 8, 16), M.gearMetal);
  gear2Ring.position.set(3.78, 3.68, 3.08); g.add(gear2Ring);
  for (let sp = 0; sp < 7; sp++) {
    const a = (sp/7)*Math.PI*2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 0.07), M.ironWarm);
    spoke.rotation.z = a; spoke.position.set(3.78, 3.68, 3.09); g.add(spoke);
  }
  const gear2Hub = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 8), M.gold);
  gear2Hub.rotation.x = Math.PI/2;
  gear2Hub.position.set(3.78, 3.68, 3.12); g.add(gear2Hub);

  // ── Arcane instrument array (left wall, wall-mounted) ──
  // Panel backing
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.14), M.stoneDark);
  panel.position.set(-3.0, 2.2, 3.00); g.add(panel);
  // Gauges (circles)
  [[-3.5,2.6],[-2.5,2.6],[-3.5,1.85],[-2.5,1.85]].forEach(([gx, gy]) => {
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 12), M.gearMetal);
    gauge.rotation.x = Math.PI/2;
    gauge.position.set(gx, gy, 3.06); g.add(gauge);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.30, 0.04), M.brassBright);
    needle.position.set(gx, gy, 3.09);
    needle.rotation.z = (Math.random()-0.5)*1.2; g.add(needle);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 5, 12), M.windowArcane);
    innerRing.rotation.x = Math.PI/2;
    innerRing.position.set(gx, gy, 3.08); g.add(innerRing);
  });

  // ── Rune array embedded in front wall base ──
  for (let ri = 0; ri < 5; ri++) {
    const rune = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.08), M.runeStone);
    rune.position.set(-2.0 + ri*1.0, 0.75, 3.0); g.add(rune);
    const runeGlyph = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.04), M.windowArcane);
    runeGlyph.position.set(-2.0 + ri*1.0, 0.75, 3.03); g.add(runeGlyph);
  }

  // ── Workbench outside (right of door) ──
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.20, 0.65), M.woodLight);
  bench.position.set(1.8, 0.95, 3.28); g.add(bench);
  [0.9, 2.7].forEach(bx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.78, 0.10), M.wood);
    leg.position.set(bx, 0.48, 3.28); g.add(leg);
  });
  // Items on bench: vials
  [-0.6, 0, 0.6].forEach((tx, i) => {
    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.42+i*0.1, 8), M.arcane);
    vial.position.set(1.8+tx, 1.27, 3.26); g.add(vial);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.07, 8), M.gold);
    cap.position.set(1.8+tx, 1.51+i*0.05, 3.26); g.add(cap);
  });

  // ── Animated smoke puffs ──
  const workshopSmoke = [];
  for (let s = 0; s < 8; s++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.20 + s * 0.06, 6, 6), M.smoke.clone());
    const bx = 5.2, bz = -1.1;
    puff.position.set(bx, 4.65 + s * 0.44, bz);
    puff.userData.offset = s * 0.9 + Math.random() * 1.2;
    puff.userData.baseX  = bx;
    puff.userData.baseY  = 4.65 + s * 0.44;
    puff.userData.baseZ  = bz;
    g.add(puff);
    workshopSmoke.push(puff);
  }

  // ── Wide arched double doors ──
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.22), M.gearMetal);
  doorFrame.position.set(0, 1.25, 3.00); g.add(doorFrame);
  // Door arch
  const doorArch = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.20, 12, 1, false, 0, Math.PI), M.gearMetal);
  doorArch.rotation.z = Math.PI/2; doorArch.rotation.y = Math.PI/2;
  doorArch.position.set(0, 2.52, 2.99); g.add(doorArch);
  [-0.47, 0.47].forEach(dx => {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.84, 2.25, 0.12), M.woodDark);
    leaf.position.set(dx, 1.12, 3.04); g.add(leaf);
    // Brass cross brace
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.08, 0.07), M.brassBright);
    brace.position.set(dx, 1.5, 3.07); g.add(brace);
    const brace2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.15, 0.07), M.brassBright);
    brace2.position.set(dx, 1.1, 3.07); g.add(brace2);
    // Iron hinges
    [0.4, 1.2, 2.0].forEach(hy => {
      const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.10, 0.09), M.ironWarm);
      hinge.position.set(dx + (dx>0?-0.39:0.39), hy, 3.08); g.add(hinge);
    });
  });

  // Ground floor windows (3)
  [-2.2, 0, 2.2].forEach(wx => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.70, 0.16), M.gearMetal);
    fr.position.set(wx, 1.60, 3.00); g.add(fr);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.50, 0.05), M.windowArcane);
    gl.position.set(wx, 1.60, 3.02); g.add(gl);
    // Mullion
    const mul = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.50, 0.08), M.gearMetal);
    mul.position.set(wx, 1.60, 3.05); g.add(mul);
  });
  // Upper floor windows (4)
  [-2.4, -0.8, 0.8, 2.4].forEach(wx => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.85, 0.15), M.gearMetal);
    fr.position.set(wx, 4.15, 3.01); g.add(fr);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.65, 0.05), M.windowArcane);
    gl.position.set(wx, 4.15, 3.03); g.add(gl);
    // Pointed arch top
    const archTop = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.30, 3), M.gearMetal);
    archTop.position.set(wx, 4.73, 3.00); g.add(archTop);
  });

  // ── Torch sconces flanking door ──
  [-1.14, 1.14].forEach(tx => {
    const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.44, 0.13), M.ironWarm);
    sconce.position.set(tx, 2.5, 3.07); g.add(sconce);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 6), M.ember);
    flame.position.set(tx, 2.82, 3.07); g.add(flame);
  });

  // ── Hanging workshop sign ──
  const signArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.1), M.ironWarm);
  signArm.position.set(0, 5.55, 3.5); g.add(signArm);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.12), M.woodDark);
  signBoard.position.set(0, 5.05, 3.98); g.add(signBoard);
  const signGlyph = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.38, 0.09), M.brassBright);
  signGlyph.position.set(0, 5.05, 4.02); g.add(signGlyph);
  // Gear decoration on sign
  const signGear = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.055, 6, 12), M.gearMetal);
  signGear.position.set(-0.48, 5.05, 4.03); g.add(signGear);

  // Lights
  addPointLight(scene, 0xff8800, 2.25, 14, x - 4, 3, z);
  addPointLight(scene, 0x00e5ff, 1.45, 9, x - 4, 8, z);
  addPointLight(scene, 0xffcc44, 1.05, 7, x - 4, 1.5, z + 3);

  scene.add(g);
  return { g, smoke: workshopSmoke, worldX: x, worldZ: z, rotY: Math.PI * 0.5 };
}

// ═══════════════════════════════
// LANDMARK 2: GRAND OBSERVATORY ACADEMY
// (About zone — right side, X≈11, Z≈7)
// Aesthetic: Classical medieval keep + astronomical observatory,
// multi-tier, decorative columns, arcane telescope dome, tall and imposing
// ═══════════════════════════════
function buildAcademy(scene, M, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = -Math.PI * 0.5;

  // ── Grand elevated plinth with decorative border ──
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.65, 6.2), M.ivoryStone);
  plinth.position.y = 0.32; plinth.castShadow = true; g.add(plinth);
  // Plinth border trim
  [[-3.4,0],[ 3.4,0],[0,-3.0],[0,3.0]].forEach(([px,pz]) => {
    const trim = new THREE.Mesh(new THREE.BoxGeometry(
      Math.abs(px) > 1 ? 0.28 : 7.0, 0.18,
      Math.abs(pz) > 1 ? 0.28 : 6.2
    ), M.stoneLight);
    trim.position.set(px, 0.68, pz); g.add(trim);
  });

  // Grand front steps (4 tiers)
  [0.56, 0.42, 0.26, 0.10].forEach((sy, i) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(3.0 + i*0.6, 0.18, 0.52), M.stoneMid);
    step.position.set(0, sy, 3.12 + i*0.52); g.add(step);
  });

  // ── Main keep body — three progressively narrower tiers ──
  const keepBase = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.0, 5.8), M.stoneMid);
  keepBase.position.y = 2.15; keepBase.castShadow = true; keepBase.receiveShadow = true; g.add(keepBase);

  const keepMid = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.6, 5.2), M.stoneLight);
  keepMid.position.y = 4.95; keepMid.castShadow = true; g.add(keepMid);

  const keepTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.0, 4.5), M.stoneMid);
  keepTop.position.y = 7.25; keepTop.castShadow = true; g.add(keepTop);

  // Decorative cornice rings between tiers
  [3.65, 6.28].forEach(hy => {
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(6.9 - (hy > 5 ? 0.8:0), 0.28, 6.2 - (hy > 5 ? 0.8:0)), M.stoneLight);
    cornice.position.set(0, hy, 0); g.add(cornice);
  });

  // ── 6 grand columns on facade (3 per tier) ──
  [-1.9, 0, 1.9].forEach(cx => {
    // Lower columns
    const colLow = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 3.2, 10), M.ivoryStone);
    colLow.position.set(cx, 2.25, 2.98); colLow.castShadow = true; g.add(colLow);
    const capLow = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.25, 0.60), M.stoneDark);
    capLow.position.set(cx, 3.97, 2.98); g.add(capLow);
    // Carved base
    const baseLow = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.58), M.stoneDark);
    baseLow.position.set(cx, 0.74, 2.98); g.add(baseLow);
    // Upper tier columns (slimmer)
    const colUp = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 2.8, 10), M.ivoryStone);
    colUp.position.set(cx, 5.08, 2.68); g.add(colUp);
    const capUp = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.22, 0.50), M.stoneDark);
    capUp.position.set(cx, 6.58, 2.68); g.add(capUp);
  });

  // ── Ornate arched windows (3 per tier) ──
  [-1.9, 0, 1.9].forEach(wx => {
    // Lower windows
    const recess = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.4, 0.22), M.stoneDark);
    recess.position.set(wx, 2.25, 3.01); g.add(recess);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.58, 2.0, 0.05), M.windowBlue);
    glass.position.set(wx, 2.22, 3.03); g.add(glass);
    // Arch keystone
    const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.14, 10, 1, false, 0, Math.PI), M.stoneDark);
    arch.rotation.z = Math.PI/2; arch.rotation.y = Math.PI/2;
    arch.position.set(wx, 3.31, 3.00); g.add(arch);
    // Window tracery cross
    const trH = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.08), M.stoneMid);
    trH.position.set(wx, 2.22, 3.06); g.add(trH);
    const trV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.85, 0.08), M.stoneMid);
    trV.position.set(wx, 2.22, 3.06); g.add(trV);
    // Upper tier windows
    const upRecess = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.8, 0.20), M.stoneDark);
    upRecess.position.set(wx, 5.12, 2.72); g.add(upRecess);
    const upGlass = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.55, 0.05), M.windowArcane);
    upGlass.position.set(wx, 5.08, 2.74); g.add(upGlass);
    const upArch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 8, 1, false, 0, Math.PI), M.stoneDark);
    upArch.rotation.z = Math.PI/2; upArch.rotation.y = Math.PI/2;
    upArch.position.set(wx, 5.98, 2.71); g.add(upArch);
  });

  // ── Triangular pediment / gable above entrance ──
  const pediment = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.1, 3), M.stoneLight);
  pediment.rotation.y = Math.PI/6;
  pediment.position.set(0, 4.42, 3.02); g.add(pediment);
  // Pediment relief line
  const relLine = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.10, 0.12), M.stoneDark);
  relLine.position.set(0, 3.65, 3.02); g.add(relLine);

  // ── Fortified battlements on top tier ──
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const merlFront = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.55, 0.42), M.stoneMid);
    merlFront.position.set(i * 1.1, 8.30, 2.28); g.add(merlFront);
    const merlBack = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.55, 0.42), M.stoneMid);
    merlBack.position.set(i * 1.1, 8.30, -2.28); g.add(merlBack);
  }
  [-1.4, 0, 1.4].forEach(cz => {
    const merlSide = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.50), M.stoneMid);
    merlSide.position.set(-2.42, 8.30, cz); g.add(merlSide);
    const merlSideR = merlSide.clone();
    merlSideR.position.set(2.42, 8.30, cz); g.add(merlSideR);
  });

  // ── Observatory dome structure (dramatic, large) ──
  const domeRing = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.62, 1.0, 14), M.stoneDark);
  domeRing.position.set(0, 9.25, 0); g.add(domeRing);
  // Dome windows in ring
  for (let d = 0; d < 6; d++) {
    const a = (d/6)*Math.PI*2;
    const dWin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.50, 0.08), M.windowArcane);
    dWin.position.set(Math.cos(a)*1.56, 9.28, Math.sin(a)*1.56);
    dWin.rotation.y = a; g.add(dWin);
  }
  // Main hemisphere dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.52, 16, 10, 0, Math.PI*2, 0, Math.PI/2), M.coppGreen);
  dome.position.set(0, 9.74, 0); g.add(dome);
  // Dome ribs (meridian lines)
  for (let r = 0; r < 8; r++) {
    const a = (r/8)*Math.PI*2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.52, 0.06), M.copper);
    rib.rotation.z = -Math.PI/2 + 0.2;
    rib.position.set(Math.cos(a)*0.76, 9.95, Math.sin(a)*0.76);
    rib.rotation.y = a; g.add(rib);
  }
  // Dome slit opening (observation slot)
  const domeSlit = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.16), M.obsidian);
  domeSlit.position.set(0, 10.05, 1.44); g.add(domeSlit);

  // Brass telescope emerging from dome slit
  const scopeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.5, 10), M.brassBright);
  scopeBase.rotation.x = 0.6;
  scopeBase.position.set(0, 10.05, 1.3); g.add(scopeBase);
  const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 1.4, 10), M.brassBright);
  scopeTube.rotation.x = 0.6;
  scopeTube.position.set(0, 10.55, 1.7); g.add(scopeTube);
  const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.14, 10), M.arcane);
  scopeLens.rotation.x = 0.6;
  scopeLens.position.set(0, 11.22, 2.1); g.add(scopeLens);

  // Central spire above dome
  const spireShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.15, 2.4, 8), M.copper);
  spireShaft.position.set(0, 11.72, 0); g.add(spireShaft);
  // Armillary sphere rings around spire
  for (let r = 0; r < 3; r++) {
    const armRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 6, 18), M.brassBright);
    armRing.rotation.x = (r/3)*Math.PI;
    armRing.rotation.y = (r/3)*Math.PI*0.6;
    armRing.position.set(0, 11.82, 0); g.add(armRing);
  }
  const crystalTip = new THREE.Mesh(new THREE.OctahedronGeometry(0.26), M.arcane);
  crystalTip.position.set(0, 13.2, 0); g.add(crystalTip);

  // ── Grand entrance portal ──
  const portalFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.30), M.stoneDark);
  portalFrame.position.set(0, 1.5, 3.01); g.add(portalFrame);
  // Portal arch
  const portalArch = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.28, 12, 1, false, 0, Math.PI), M.stoneDark);
  portalArch.rotation.z = Math.PI/2; portalArch.rotation.y = Math.PI/2;
  portalArch.position.set(0, 3.0, 3.0); g.add(portalArch);
  // Keystone
  const keystone = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.28, 0.32), M.stoneLight);
  keystone.position.set(0, 3.97, 2.99); g.add(keystone);
  // Double doors
  [-0.43, 0.43].forEach(dx => {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.75, 0.13), M.woodDark);
    leaf.position.set(dx, 1.37, 3.07); g.add(leaf);
    const panel1 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.10, 0.08), M.wood);
    panel1.position.set(dx, 1.85, 3.11); g.add(panel1);
    const panel2 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.80, 0.08), M.wood);
    panel2.position.set(dx, 0.60, 3.11); g.add(panel2);
    const knocker = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 6, 12), M.gold);
    knocker.position.set(dx, 0.9, 3.14); g.add(knocker);
  });

  // ── Academy courtyard features ──
  // Celestial orrery (small model solar system)
  const orreryBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.18, 10), M.stoneDark);
  orreryBase.position.set(-2.0, 0.73, 3.5); g.add(orreryBase);
  const orreryPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), M.brassBright);
  orreryPole.position.set(-2.0, 1.12, 3.5); g.add(orreryPole);
  for (let o = 0; o < 3; o++) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5+o*0.25, 0.03, 0.03), M.brassBright);
    arm.rotation.y = (o/3)*Math.PI*2;
    arm.position.set(-2.0 + Math.cos((o/3)*Math.PI*2)*((0.25+o*0.12)), 1.35+o*0.12, 3.5 + Math.sin((o/3)*Math.PI*2)*0.25);
    g.add(arm);
    const planet = new THREE.Mesh(new THREE.SphereGeometry(0.05+o*0.02, 6, 6), M.arcane);
    planet.position.set(-2.0 + Math.cos((o/3)*Math.PI*2)*(0.32+o*0.20), 1.38+o*0.12, 3.5 + Math.sin((o/3)*Math.PI*2)*(0.32+o*0.20));
    g.add(planet);
  }

  // Stone reading bench with book
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.50), M.stoneMid);
  bench.position.set(2.2, 0.73, 3.5); g.add(bench);
  [1.5, 2.9].forEach(bx => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.50, 0.14), M.stoneDark);
    leg.position.set(bx, 0.40, 3.5); g.add(leg);
  });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.48), M.woodDark);
  book.position.set(2.2, 0.90, 3.5);
  book.rotation.y = 0.3; g.add(book);
  const bookSpine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.48), M.arcane);
  bookSpine.position.set(1.99, 0.90, 3.5);
  bookSpine.rotation.y = 0.3; g.add(bookSpine);

  // Torch sconces flanking doors
  [-1.1, 1.1].forEach(tx => {
    const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.44, 0.13), M.iron);
    sconce.position.set(tx, 2.7, 3.09); g.add(sconce);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), M.arcane);
    flame.position.set(tx, 3.0, 3.09); g.add(flame);
  });

  // Lights
  addPointLight(scene, 0x8899ff, 2.3, 18, x + 4, 5, z);
  addPointLight(scene, 0x00e5ff, 1.75, 12, x + 4, 12, z);
  addPointLight(scene, 0xffeebb, 1.15, 9, x + 4, 2, z + 3);

  scene.add(g);
  return g;
}

// ═══════════════════════════════
// LANDMARK 3: GUILD HALL / ARCANE TAVERN
// (Contact zone — X≈0, Z≈22)
// Aesthetic: Imposing multi-wing timber-and-stone tavern, large porch,
// massive chimneys, detailed signage, barrel yard, warm inviting glow
// ═══════════════════════════════
function buildGuildHall(scene, M, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = Math.PI;

  // ── Wide stone foundation ──
  const base = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.52, 7.2), M.stoneDark);
  base.position.y = 0.26; base.castShadow = true; g.add(base);
  // Foundation stone course
  for (let fi = 0; fi < 10; fi++) {
    const fstone = new THREE.Mesh(new THREE.BoxGeometry(0.85+Math.random()*0.3, 0.26, 0.20), M.stone);
    fstone.position.set(-4.4 + fi*0.95 + (Math.random()-0.5)*0.1, 0.43, 3.64);
    fstone.rotation.y = (Math.random()-0.5)*0.04; g.add(fstone);
  }

  // ── Main hall body — large & tall ──
  const hall = new THREE.Mesh(new THREE.BoxGeometry(9.8, 4.0, 6.6), M.stone);
  hall.position.y = 2.26; hall.castShadow = true; hall.receiveShadow = true; g.add(hall);

  // ── Upper great hall (narrower, set back slightly) ──
  const upperHall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.6, 6.0), M.stoneMid);
  upperHall.position.y = 5.06; upperHall.castShadow = true; g.add(upperHall);

  // ── Heavy timber H-frame facade — multiple layers ──
  [-3.8,-2.0,0,2.0,3.8].forEach(bx => {
    const vb = new THREE.Mesh(new THREE.BoxGeometry(0.20, 5.8, 0.22), M.woodDark);
    vb.position.set(bx, 3.16, 3.36); g.add(vb);
    // Cap decorations
    const vcap = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.20, 0.28), M.woodDark);
    vcap.position.set(bx, 6.1, 3.34); g.add(vcap);
  });
  [0.65, 1.85, 3.2, 4.55].forEach(by => {
    const hb = new THREE.Mesh(new THREE.BoxGeometry(9.85, 0.18, 0.20), M.woodDark);
    hb.position.set(0, by, 3.36); g.add(hb);
  });
  // Diagonal braces
  [[-3.0, 1],[ 1.0, -1],[-3.0, -1],[ 1.0, 1]].forEach(([bx, dir]) => {
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.0, 0.14), M.woodDark);
    d.rotation.z = dir * 0.44; d.position.set(bx, 3.16, 3.37); g.add(d);
  });

  // ── Grand covered front porch ──
  const porchBase = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.20, 2.8), M.stoneDark);
  porchBase.position.set(0, 0.10, 5.0); g.add(porchBase);
  const porchFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.12, 2.6), M.cobbleMid);
  porchFloor.position.set(0, 0.22, 5.0); g.add(porchFloor);

  // Porch roof (dual slope for visual interest)
  const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.24, 3.2), M.thatch);
  porchRoof.position.set(0, 4.65, 5.0); porchRoof.castShadow = true; g.add(porchRoof);
  const porchRoofFront = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.18, 0.12), M.thatchDark);
  porchRoofFront.position.set(0, 4.56, 6.57); g.add(porchRoofFront);
  // Porch fascia board
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.48, 0.16), M.woodDark);
  fascia.position.set(0, 4.36, 6.60); g.add(fascia);

  // Porch posts (4 carved timber posts)
  [-4.0,-1.35,1.35,4.0].forEach(px => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 4.35, 8), M.wood);
    post.position.set(px, 2.18, 6.28); post.castShadow = true; g.add(post);
    // Post base
    const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.20, 0.38), M.woodDark);
    pBase.position.set(px, 0.10, 6.28); g.add(pBase);
    // Post cap
    const pCap = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.22, 0.40), M.woodDark);
    pCap.position.set(px, 4.50, 6.28); g.add(pCap);
    // Decorative carved band on post
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.18, 8), M.woodLight);
    band.position.set(px, 2.0, 6.28); g.add(band);
  });

  // Cross beams on porch
  const porchCB = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.16, 0.18), M.woodDark);
  porchCB.position.set(0, 4.35, 5.85); g.add(porchCB);
  const porchCB2 = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.16, 0.18), M.woodDark);
  porchCB2.position.set(0, 2.8, 5.85); g.add(porchCB2);

  // ── Wide gabled main roof ──
  // Primary slope
  const roofL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 7.6), M.thatch);
  roofL.rotation.z = 0.56; roofL.position.set(-4.5, 7.4, 0); roofL.castShadow = true; g.add(roofL);
  const roofR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.8, 7.6), M.thatch);
  roofR.rotation.z = -0.56; roofR.position.set(4.5, 7.4, 0); roofR.castShadow = true; g.add(roofR);
  const roofFillL = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.18, 7.6), M.thatch);
  roofFillL.rotation.z = 0.56; roofFillL.position.set(-4.5, 7.38, 0); g.add(roofFillL);
  const roofFillR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.18, 7.6), M.thatch);
  roofFillR.rotation.z = -0.56; roofFillR.position.set(4.5, 7.38, 0); g.add(roofFillR);
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.20, 7.7), M.roofRidge);
  ridge.position.set(0, 9.05, 0); g.add(ridge);
  // Gable ends
  [-3.68, 3.68].forEach(gz => {
    const gable = new THREE.Mesh(new THREE.CylinderGeometry(0, 5.2, 2.92, 3), M.thatchLight);
    gable.rotation.y = Math.PI; gable.position.set(0, 7.37, gz); g.add(gable);
    // Gable timber
    const gt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.6, 0.14), M.woodDark);
    gt.position.set(0, 7.28, gz + (gz>0?0.06:-0.06)); g.add(gt);
  });
  // Eave boards
  [-3.75, 3.75].forEach(ez => {
    const eave = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.14, 0.50), M.woodDark);
    eave.position.set(0, 6.25, ez); g.add(eave);
  });

  // ── Tall main chimney — right, massive ──
  const chim = new THREE.Mesh(new THREE.BoxGeometry(1.28, 3.8, 1.28), M.stoneDark);
  chim.position.set(3.8, 6.0, 2.0); g.add(chim);
  // Chimney corbels
  [-0.5, 0.5].forEach(cx => {
    const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.20, 1.34), M.stone);
    corbel.position.set(3.8+cx, 7.68, 2.0); g.add(corbel);
  });
  const chimTop = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.28, 1.55), M.stone);
  chimTop.position.set(3.8, 7.9, 2.0); g.add(chimTop);
  // Chimney pots (2)
  [-0.28, 0.28].forEach(cx => {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 8), M.ironWarm);
    pot.position.set(3.8+cx, 8.22, 2.0); g.add(pot);
    const potCap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.30, 8), M.iron);
    potCap.position.set(3.8+cx, 8.65, 2.0); g.add(potCap);
  });
  // Smoke
  const guildSmokeBig = [];
  for (let s = 0; s < 10; s++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.22 + s * 0.06, 6, 6), M.smoke.clone());
    const bx = 3.8, bz = 2.0;
    puff.position.set(bx, 8.45 + s * 0.48, bz);
    puff.userData.offset = s * 0.75 + Math.random() * 1.5;
    puff.userData.baseX = bx; puff.userData.baseY = 8.45 + s * 0.48; puff.userData.baseZ = bz;
    g.add(puff);
    guildSmokeBig.push(puff);
  }

  // Left chimney (smaller)
  const chim2 = new THREE.Mesh(new THREE.BoxGeometry(0.80, 2.5, 0.80), M.stoneDark);
  chim2.position.set(-3.6, 5.5, -2.2); g.add(chim2);
  const chim2Top = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.22, 0.98), M.stone);
  chim2Top.position.set(-3.6, 6.62, -2.2); g.add(chim2Top);
  const pot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.44, 8), M.ironWarm);
  pot2.position.set(-3.6, 6.87, -2.2); g.add(pot2);
  const guildSmokeSmall = [];
  for (let s = 0; s < 6; s++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.16 + s * 0.05, 6, 6), M.smoke.clone());
    const bx2 = -3.6, bz2 = -2.2;
    puff.position.set(bx2, 7.1 + s * 0.40, bz2);
    puff.userData.offset = s * 1.1 + Math.random() * 2.0;
    puff.userData.baseX = bx2; puff.userData.baseY = 7.1 + s * 0.40; puff.userData.baseZ = bz2;
    g.add(puff);
    guildSmokeSmall.push(puff);
  }

  // ── Grand arched double doors (wide with stonework arch) ──
  const doorSurround = new THREE.Mesh(new THREE.BoxGeometry(2.60, 3.30, 0.28), M.stoneMid);
  doorSurround.position.set(0, 1.65, 3.38); g.add(doorSurround);
  const doorTopArch = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.26, 14, 1, false, 0, Math.PI), M.stoneMid);
  doorTopArch.rotation.z = Math.PI/2; doorTopArch.rotation.y = Math.PI/2;
  doorTopArch.position.set(0, 3.30, 3.36); g.add(doorTopArch);
  const doorKeystone = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.32), M.stoneLight);
  doorKeystone.position.set(0, 4.51, 3.34); g.add(doorKeystone);
  // Door leaves
  [-0.58, 0.58].forEach(dx => {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.04, 3.0, 0.14), M.wood);
    leaf.position.set(dx, 1.50, 3.44); g.add(leaf);
    // Door panels (carved look)
    [0.6, 1.6, 2.5].forEach(dy => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.55, 0.08), M.woodLight);
      panel.position.set(dx, dy, 3.49); g.add(panel);
    });
    // Iron studs
    [[0.36, 0.45],[0.36, 1.1],[0.36, 1.85],[-0.36, 0.45],[-0.36, 1.1],[-0.36, 1.85]].forEach(([sx, sy]) => {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.055, 5, 5), M.iron);
      stud.position.set(dx+sx, sy, 3.50); g.add(stud);
    });
    // Hinges
    [0.4, 1.5, 2.6].forEach(hy => {
      const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.12, 0.10), M.ironWarm);
      hinge.position.set(dx + (dx>0?-0.50:0.50), hy, 3.48); g.add(hinge);
    });
    // Knocker ring
    const knocker = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 7, 14), M.gold);
    knocker.position.set(dx, 1.0, 3.52); g.add(knocker);
  });
  // Door step
  const step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.60), M.stoneMid);
  step.position.set(0, 0.07, 3.72); g.add(step);

  // ── Large amber-glow windows (facade) ──
  [[-3.5,1.8],[-1.9,1.8],[1.9,1.8],[3.5,1.8]].forEach(([wx, wy]) => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.90, 0.18), M.woodDark);
    fr.position.set(wx, wy, 3.38); g.add(fr);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.68, 0.05), M.windowAmber);
    gl.position.set(wx, wy, 3.40); g.add(gl);
    // Mullion
    const mulH = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.09), M.woodDark);
    mulH.position.set(wx, wy, 3.43); g.add(mulH);
    const mulV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.09), M.woodDark);
    mulV.position.set(wx, wy, 3.43); g.add(mulV);
    // Sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.09, 0.28), M.stoneDark);
    sill.position.set(wx, wy - 0.50, 3.44); g.add(sill);
    // Flower box
    const fbox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.22), M.woodDark);
    fbox.position.set(wx, wy - 0.56, 3.50); g.add(fbox);
    [0,1,2].forEach(fi => {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 4), M.ember);
      flower.position.set(wx - 0.18 + fi*0.18, wy - 0.43, 3.54); g.add(flower);
    });
  });
  // Upper windows
  [-2.8, 0, 2.8].forEach(wx => {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.15), M.woodDark);
    fr.position.set(wx, 4.95, 3.38); g.add(fr);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.55, 0.05), M.windowAmber);
    gl.position.set(wx, 4.95, 3.40); g.add(gl);
    // Round arch top
    const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 8, 1, false, 0, Math.PI), M.woodDark);
    arch.rotation.z = Math.PI/2; arch.rotation.y = Math.PI/2;
    arch.position.set(wx, 5.38, 3.37); g.add(arch);
  });

  // ── Tavern yard details ──
  // Large barrel cluster (left)
  [[-4.2,0.45,5.5],[-3.6,0.45,5.9],[-4.5,0.45,5.95],[-3.9,1.15,5.7]].forEach(([bx,by,bz]) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.78, 10), M.barrel);
    barrel.position.set(bx, by, bz); barrel.castShadow = true; g.add(barrel);
    [0.14,-0.14].forEach(hy => {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.04, 6, 14), M.iron);
      hoop.rotation.x = Math.PI/2; hoop.position.set(bx, by+hy, bz); g.add(hoop);
    });
  });

  // Crate stack (right)
  [[4.0,0.30,5.4],[4.0,0.70,5.4],[4.0,1.10,5.4],[4.5,0.30,5.7]].forEach(([cx,cy,cz]) => {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.58, 0.65), M.woodLight);
    crate.position.set(cx, cy, cz); g.add(crate);
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.67, 0.05, 0.67), M.woodDark);
    slat.position.set(cx, cy+0.14, cz); g.add(slat);
    const slat2 = new THREE.Mesh(new THREE.BoxGeometry(0.67, 0.05, 0.67), M.woodDark);
    slat2.position.set(cx, cy-0.14, cz); g.add(slat2);
  });

  // ── Hanging guild sign (ornate) ──
  const signPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.14), M.ironWarm);
  signPost1.position.set(-0.7, 5.55, 4.65); g.add(signPost1);
  const signPost2 = signPost1.clone();
  signPost2.position.set(0.7, 5.55, 4.65); g.add(signPost2);
  const signChain1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.04), M.ironWarm);
  signChain1.position.set(-0.7, 5.28, 4.65); g.add(signChain1);
  const signChain2 = signChain1.clone();
  signChain2.position.set(0.7, 5.28, 4.65); g.add(signChain2);
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.70, 0.14), M.woodLight);
  signBoard.position.set(0, 4.92, 4.65); g.add(signBoard);
  const signFace = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.52, 0.10), M.parchment);
  signFace.position.set(0, 4.92, 4.70); g.add(signFace);
  // Sign corner studs
  [[-0.70,0.22],[0.70,0.22],[-0.70,-0.22],[0.70,-0.22]].forEach(([sx,sy]) => {
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 5), M.gold);
    stud.position.set(sx, 4.92+sy, 4.72); g.add(stud);
  });
  // Sign arm
  const signArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.6), M.ironWarm);
  signArm.position.set(0, 5.55, 5.3); g.add(signArm);

  // Torch sconces (4, flanking door and on porch posts)
  [[-1.4, 2.8, 3.46],[1.4, 2.8, 3.46],[-4.0, 3.5, 6.3],[4.0, 3.5, 6.3]].forEach(([tx,ty,tz]) => {
    const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.50, 0.13), M.ironWarm);
    sconce.position.set(tx, ty, tz); g.add(sconce);
    const sconceArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.34), M.ironWarm);
    sconceArm.position.set(tx, ty+0.28, tz + (tz > 5 ? 0.18 : 0.18)); g.add(sconceArm);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), M.ember);
    flame.position.set(tx, ty+0.44, tz + (tz > 5 ? 0.2 : 0.2)); g.add(flame);
  });

  // Lantern hanging from porch beam (center)
  const lanternHanger = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.05), M.iron);
  lanternHanger.position.set(0, 4.13, 5.85); g.add(lanternHanger);
  const lanternBody = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.36, 0.30), M.ironWarm);
  lanternBody.position.set(0, 3.85, 5.85); g.add(lanternBody);
  const lanternGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), M.ember);
  lanternGlobe.position.set(0, 3.85, 5.85); g.add(lanternGlobe);

  // ── Well in guild yard ──
  const yardBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.58, 10), M.stoneDark);
  yardBase.position.set(2.8, 0.42, -3.8); g.add(yardBase);

  // Lights
  addPointLight(scene, 0xff7700, 3.0, 24, x, 3, z + 3);
  addPointLight(scene, 0xff9933, 1.85, 14, x, 2, z + 5.5);
  addPointLight(scene, 0xffcc55, 1.35, 10, x, 1.5, z - 2);

  scene.add(g);
  return { g, smokeBig: guildSmokeBig, smokeSmall: guildSmokeSmall };
}

// ═══════════════════════════════
// FORGE TOWER (upgraded)
// ═══════════════════════════════
function buildForgeTower(scene, M, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  for (let i = 0; i < 4; i++) {
    const a = (i/4)*Math.PI*2 + Math.PI/4;
    const butt = new THREE.Mesh(new THREE.BoxGeometry(0.70, 9.0, 0.70), M.stoneDark);
    butt.position.set(Math.cos(a)*3.69, 4.5, Math.sin(a)*3.69);
    butt.rotation.y = a; butt.castShadow = true; g.add(butt);
    const bCap = new THREE.Mesh(new THREE.ConeGeometry(0.525, 0.90, 4), M.stone);
    bCap.position.set(Math.cos(a)*3.69, 9.13, Math.sin(a)*3.69);
    bCap.rotation.y = a; g.add(bCap);
  }

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.65, 3.40, 12.0, 10), M.stoneDark);
  tower.position.y = 6.0; tower.castShadow = true; g.add(tower);

  [3.125, 6.375, 9.5].forEach(by => {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(2.80, 2.80, 0.325, 10), M.stone);
    band.position.y = by; g.add(band);
  });

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.775, 2.775, 0.575, 10), M.stoneLight);
  cap.position.y = 11.975; g.add(cap);

  for (let i = 0; i < 10; i++) {
    const a = (i/10)*Math.PI*2;
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.975, 0.50), M.stone);
    m.position.set(Math.cos(a)*2.525, 12.46, Math.sin(a)*2.525); g.add(m);
  }

  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.975, 5.125, 10), M.slate);
  roof.position.y = 14.79; roof.castShadow = true; g.add(roof);

  for (let i = 0; i < 4; i++) {
    const a = (i/4)*Math.PI*2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 10.125), M.arcane);
    col.position.set(Math.cos(a)*3.06, 5.06, Math.sin(a)*3.06); g.add(col);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1625, 0.05, 6, 12), M.gold);
    ring.rotation.x = Math.PI/2;
    ring.position.set(Math.cos(a)*3.06, 0.525, Math.sin(a)*3.06); g.add(ring);
  }

  const crystalOuter = new THREE.Mesh(new THREE.OctahedronGeometry(0.90), M.arcane);
  crystalOuter.position.y = 17.625; g.add(crystalOuter);
  const crystalInner = new THREE.Mesh(new THREE.OctahedronGeometry(0.45), M.gold);
  crystalInner.position.y = 17.625; g.add(crystalInner);

  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.525, 1.15, 0.825, 10), M.iron);
  basin.position.y = 0.4125; g.add(basin);
  const basinRim = new THREE.Mesh(new THREE.TorusGeometry(1.525, 0.1125, 8, 20), M.copper);
  basinRim.rotation.x = Math.PI/2; basinRim.position.y = 0.8375; g.add(basinRim);
  const fire = new THREE.Mesh(new THREE.SphereGeometry(0.825, 10, 10), M.ember);
  fire.position.y = 1.0875; g.add(fire);

  const runeRing = new THREE.Mesh(new THREE.TorusGeometry(5.75, 0.1125, 6, 44), M.gold);
  runeRing.rotation.x = Math.PI/2; runeRing.position.y = 0.0375; g.add(runeRing);
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    const rune = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.0625, 0.30), M.gold);
    rune.position.set(Math.cos(a)*5.75, 0.05, Math.sin(a)*5.75); g.add(rune);
  }

  const forgeLight = addPointLight(scene, 0xff6600, 5.2, 28, x, 2.5, z, { decorative: false });
  const crystalLight = addPointLight(scene, 0x00e5ff, 4.0, 30, x, 17.5, z, { decorative: false });
  const runeLight = addPointLight(scene, 0xd4af37, 1.6, 11, x, 0.625, z, { decorative: false });

  scene.add(g);
  return { g, fire, crystal: crystalOuter, crystalInner, crystalLight, forgeLight, runeLight };
}

// ═══════════════════════════════
// STREET LANTERN
// ═══════════════════════════════
function buildLantern(scene, M, x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 3.7), M.iron);
  post.position.y = 1.85; g.add(post);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), M.ironWarm);
  plate.position.y = 0.04; g.add(plate);

  let globe;
  if (x <= 0) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.07, 0.07), M.iron);
    arm.position.set(0.29, 3.65, 0); g.add(arm);
    globe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), M.arcane);
    globe.position.set(0.58, 3.62, 0); g.add(globe);
  } else {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.07, 0.07), M.iron);
    arm.position.set(-0.29, 3.65, 0); g.add(arm);
    globe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), M.arcane);
    globe.position.set(-0.58, 3.62, 0); g.add(globe);
  }

  scene.add(g);
  const light = addPointLight(scene, 0x00ddff, 1.8, 10, x + (x <= 0 ? 0.58 : -0.58), 3.62, z, { decorative: false });
  return { globe, light };
}

// ═══════════════════════════════
// MARKET STALL
// ═══════════════════════════════
function buildStall(scene, M, x, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.rotation.y = rotY;

  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.1, 1.7), M.wood);
  frame.position.y = 1.05; frame.castShadow = true; g.add(frame);
  [-0.8, 0.8].forEach(bx => {
    const vb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.1, 0.12), M.woodDark);
    vb.position.set(bx, 1.05, 0.85); g.add(vb);
  });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 2.0), M.thatch);
  awning.position.y = 2.1; awning.castShadow = true; g.add(awning);
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.36), M.woodLight);
  shelf.position.set(0, 1.36, 0.70); g.add(shelf);
  [-0.7, 0, 0.7].forEach(vx => {
    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.44, 8), M.arcane);
    vial.position.set(vx, 1.61, 0.68); g.add(vial);
    const vcap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.08, 8), M.gold);
    vcap.position.set(vx, 1.86, 0.68); g.add(vcap);
  });
  scene.add(g);
}

// ═══════════════════════════════
// WELL
// ═══════════════════════════════
function buildWell(scene, M, x, z) {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.86, 0.72, 12), M.stoneDark);
  base.position.set(x, 0.36, z); scene.add(base);
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.14), M.stone);
    brick.position.set(x+Math.cos(a)*0.73, 0.64, z+Math.sin(a)*0.73);
    brick.rotation.y = a; scene.add(brick);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.066, 8, 24), M.iron);
  ring.rotation.x = Math.PI/2; ring.position.set(x, 0.74, z); scene.add(ring);
  [-0.62, 0.62].forEach(px => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.52, 6), M.wood);
    post.position.set(x+px, 1.48, z); scene.add(post);
  });
  const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.09, 0.09), M.woodDark);
  crossBar.position.set(x, 2.24, z); scene.add(crossBar);
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.82, 4), M.ironWarm);
  rope.position.set(x, 0.92, z); scene.add(rope);
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 12), M.arcane);
  glow.position.set(x, 0.74, z); scene.add(glow);
  const wl = addPointLight(scene, 0x00e5ff, 1.8, 7, x, 1.8, z, { decorative: false });
  return { glow, wl };
}

// ═══════════════════════════════
// TREE
// ═══════════════════════════════
function buildTree(scene, M, x, z, h=1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.21, h*1.66), M.wood);
  trunk.position.y = h*0.83; g.add(trunk);
  [0,1,2].forEach(i => {
    const f = new THREE.Mesh(
      new THREE.ConeGeometry(0.80-i*0.18, 1.12, 7),
      i < 2 ? M.foliage : M.foliage2
    );
    f.position.y = h*1.62+i*0.56+0.36; g.add(f);
  });
  scene.add(g);
}

// ═══════════════════════════════
// SKY
// ═══════════════════════════════
function buildSkyDome(scene) {
  const geo = new THREE.SphereGeometry(200, 24, 18);
  const positions = geo.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const zenith  = new THREE.Color(0x060d1f);
  const horizon = new THREE.Color(0x0d1f3c);
  const tmp = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const t = Math.max(0, positions.getY(i) / 200);
    tmp.lerpColors(horizon, zenith, Math.pow(t, 0.6));
    colors[i*3] = tmp.r; colors[i*3+1] = tmp.g; colors[i*3+2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
}

function buildSky(scene) {
  buildSkyDome(scene);
  function makeStarLayer(count, size, opacity, color) {
    const geo = new THREE.BufferGeometry();
    const verts = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random()*Math.PI*2;
      const phi   = Math.acos(2*Math.random()-1);
      const r     = 150 + Math.random()*20;
      const yVal  = Math.abs(r*Math.cos(phi));
      if (yVal < 5) { i--; continue; }
      verts.push(r*Math.sin(phi)*Math.cos(theta), yVal, r*Math.sin(phi)*Math.sin(theta));
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity }));
    scene.add(points); return points;
  }
  const starsBright = makeStarLayer(360, 0.55, 0.95, 0xfff8e8);
  const starsDim    = makeStarLayer(620, 0.28, 0.60, 0xaac4dd);
  const moonGroup   = new THREE.Group();
  moonGroup.position.set(-40, 28, -75);
  moonGroup.add(new THREE.Mesh(new THREE.CircleGeometry(4.5, 40),
    new THREE.MeshBasicMaterial({ color: 0xfff2b8, side: THREE.DoubleSide })));
  moonGroup.add(new THREE.Mesh(new THREE.RingGeometry(4.8, 7.5, 40),
    new THREE.MeshBasicMaterial({ color: 0xffeebb, transparent: true, opacity: 0.10, side: THREE.DoubleSide })));
  moonGroup.lookAt(0,0,0); scene.add(moonGroup);
  return { starsBright, starsDim, moonGroup };
}

// ═══════════════════════════════
// ZONE MARKER
// ═══════════════════════════════
function buildZoneMarker(scene, M, x, z, color) {
  const mat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.9 });
  const orb  = new THREE.Mesh(new THREE.OctahedronGeometry(0.30), mat);
  orb.position.set(x, 4.5, z); scene.add(orb);
  const light = addPointLight(scene, color, 1.7, 9, x, 4.6, z, { decorative: false });
  return { orb, light };
}

// ═══════════════════════════════
// ANIMATED BIRDS
// ═══════════════════════════════
function buildBirds(scene) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x222233 });
  const birds = [];

  function makeFlock(cx, cy, cz, count, speed, radius) {
    const flock = { meshes: [], cx, cy, cz, speed, radius, angle: Math.random()*Math.PI*2 };
    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      [-1,1].forEach(side => {
        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 3), mat);
        wing.rotation.z = side * 0.7;
        wing.rotation.x = Math.PI / 2;
        wing.position.set(side * 0.18, 0, 0);
        g.add(wing);
      });
      g.userData.phaseOffset = (i / count) * Math.PI * 2;
      g.userData.orbitAngle  = (i / count) * Math.PI * 2;
      g.userData.orbitR      = radius * (0.7 + Math.random() * 0.6);
      g.userData.heightVar   = (Math.random() - 0.5) * 4;
      scene.add(g);
      flock.meshes.push(g);
    }
    birds.push(flock);
    return flock;
  }

  makeFlock( -11, 16, 7,  5, 0.28, 3.5);
  makeFlock(  11, 18, 7,  4, 0.22, 3.0);
  makeFlock(   0, 14, 22, 6, 0.35, 4.5);

  return birds;
}

// ═══════════════════════════════
// CAMPFIRE
// ═══════════════════════════════
function buildCampfire(scene, M, x, z) {
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    const stone = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.18), M.stone);
    stone.position.set(x + Math.cos(a)*0.34, 0.07, z + Math.sin(a)*0.34);
    stone.rotation.y = a; scene.add(stone);
  }
  [-1,1].forEach(side => {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.72, 6), M.wood);
    log.rotation.z = 0.55 * side;
    log.position.set(x + side*0.12, 0.08, z); scene.add(log);
  });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.38, 7), M.ember);
  flame.position.set(x, 0.28, z); scene.add(flame);
  const flameOuter = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.52, 7), M.emberSoft);
  flameOuter.position.set(x, 0.22, z); scene.add(flameOuter);
  const fireLight = addPointLight(scene, 0xff6600, 2.0, 7, x, 0.5, z, { decorative: false });
  return { flame, flameOuter, fireLight };
}

// ═══════════════════════════════
// HANGING BANNER
// ═══════════════════════════════
function buildBanner(scene, M, x, z, rotY, color) {
  const mat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.2 });
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8), M.iron);
  pole.position.y = 1.9; g.add(pole);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9), M.iron);
  arm.rotation.z = Math.PI/2; arm.position.set(0, 3.6, 0); g.add(arm);
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.2), mat);
  cloth.position.set(0, 2.85, 0.02); g.add(cloth);
  for (let f = 0; f < 5; f++) {
    const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.04), mat);
    fringe.position.set(-0.30 + f * 0.15, 2.22, 0.02); g.add(fringe);
  }
  scene.add(g);
  return { cloth, g };
}

// ═══════════════════════════════
// WORLD EXPORT
// ═══════════════════════════════
export function buildWorld(scene) {
  const M = makeMats();

  buildGround(scene, M);

  buildHouse(scene, M, -7,  -3, Math.PI*0.5,  1.0, 2);
  buildHouse(scene, M, -7,  -9, Math.PI*0.5,  0.85, 0);
  buildHouse(scene, M, -7,  13, Math.PI*0.5,  1.1, 2);
  buildHouse(scene, M,  7,  -3, -Math.PI*0.5, 1.0, 1);
  buildHouse(scene, M,  7,  -9, -Math.PI*0.5, 1.0, 0);
  buildHouse(scene, M,  7,  13, -Math.PI*0.5, 0.9, 1);

  // ── Three landmark buildings ──
  const workshop  = buildWorkshop(scene, M, -11, 7);
  buildAcademy(scene, M,   11, 7);
  const guildHall = buildGuildHall(scene, M,  0, 22);

  buildStall(scene, M, -9.5, 2,  Math.PI*0.5);
  buildStall(scene, M,  9.5, 2, -Math.PI*0.5);
  buildStall(scene, M, -9.5, 13, Math.PI*0.5);

  const well = buildWell(scene, M, 3, 4);
  buildWell(scene, M, -4, 18);

  const forge = buildForgeTower(scene, M, 0, 33);

  const lanternPositions = [
    [-4,-6],[4,-6],[-4,0],[4,0],[-4,6],[4,6],
    [-4,12],[4,12],[-4,18],[4,18],[-4,25],[4,25]
  ];
  const lanterns = lanternPositions.map(([lx,lz]) => buildLantern(scene, M, lx, lz));

  const treePos = [
    [-14,-11],[-15,-5],[-14,2],[-15,10],[-14,17],[-15,24],
    [ 14,-11],[ 15,-4],[ 14,3],[ 15,11],[ 14,18],[ 15,25],
  ];
  treePos.forEach(([tx,tz]) => buildTree(scene, M, tx, tz));

  const projectsMarker = buildZoneMarker(scene, M, -9,  7,  0xff8c00);
  const aboutMarker    = buildZoneMarker(scene, M,  9,  7,  0x00e5ff);
  const contactMarker  = buildZoneMarker(scene, M,  0,  22, 0xd4af37);

  const campfire1 = buildCampfire(scene, M, -2, 1);
  const campfire2 = buildCampfire(scene, M,  6, 16);

  buildBanner(scene, M, -8.5, 4,  0,           0xff8c00);
  buildBanner(scene, M, -8.5, 10, 0,           0xff8c00);
  buildBanner(scene, M,  8.5, 4,  Math.PI,     0x00e5ff);
  buildBanner(scene, M,  8.5, 10, Math.PI,     0x00e5ff);
  buildBanner(scene, M, -3.5, 21, Math.PI/2,   0xd4af37);
  buildBanner(scene, M,  3.5, 21, -Math.PI/2,  0xd4af37);

  const birds = buildBirds(scene);

  // ── Northern Districts ──
  const { rc, gz, districtLanterns } = buildNorthernDistricts(scene);

  scene.add(new THREE.AmbientLight(0x3a2815, 1.78));
  scene.add(new THREE.HemisphereLight(0x6f8fad, 0x3f2a12, 0.96));
  const moonLight = new THREE.DirectionalLight(0x8aa4c2, 0.86);
  moonLight.position.set(-20, 40, -20);
  moonLight.castShadow = false;
  moonLight.shadow.mapSize.set(512, 512);
  moonLight.shadow.camera.left   = moonLight.shadow.camera.bottom = -42;
  moonLight.shadow.camera.right  = moonLight.shadow.camera.top    =  42;
  moonLight.shadow.camera.far    = 140;
  moonLight.shadow.bias = -0.0008;
  moonLight.shadow.normalBias = 0.02;
  scene.add(moonLight);

  addPointLight(scene, 0xffa04a, 2.35, 26, 0, 5, 0, { decorative: false });
  addPointLight(scene, 0xffd38c, 1.55, 18, 0, 8, 8, { decorative: false });

  const sky = buildSky(scene);

  return {
    forge, lanterns, well, sky,
    zoneMarkers: { projectsMarker, aboutMarker, contactMarker },
    workshop, guildHall,
    campfires: [campfire1, campfire2],
    birds,
    // Northern districts
    rc, gz, districtLanterns,
  };
}
