// ═══════════════════════════════
// main.js — Arcane Forge Orchestrator
// Wires all modules together and runs the game loop
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

import { initCursor }    from './cursor.js';
import { initParticles }  from './particles.js';
import { initBoot }       from './boot.js';
import { buildWorld }     from './world.js';
import { Cart }           from './cart.js';
import { HUD }            from './hud.js';
import { PanelManager }   from './panels.js';
import { MeteorSystem }   from './meteors.js';
import { buildAnimals }   from './animals.js';
import { buildNPCs }      from './npcs.js';

// ── Init cursor & particles immediately (pre-boot) ──
initCursor();
initParticles();

// ── Boot sequence → then launch world ──
initBoot(() => {
  _hideBoot();
  _launchWorld();
});

function _hideBoot() {
  document.getElementById('boot')?.classList.add('hidden');
}

// ═══════════════════════════════
// WORLD LAUNCH
// ═══════════════════════════════

function _launchWorld() {
  // ── Renderer ──
  const canvas   = document.getElementById('world-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type    = THREE.BasicShadowMap;
  // Sky dome handles the background — clear to black just in case
  renderer.setClearColor(0x060d1f);

  // ── Scene & camera ──
  const scene = new THREE.Scene();
  scene.fog   = new THREE.FogExp2(0x16263f, 0.0056);

  const camera = new THREE.PerspectiveCamera(
    65, window.innerWidth / window.innerHeight, 0.9, 220
  );
  camera.position.set(0, 3.5, -9);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Build world ──
  const worldObjects = buildWorld(scene);

  // ── Cart ──
  const cart = new Cart(scene);

  // ── HUD ──
  const hud = new HUD();
  setTimeout(() => hud.show(), 700);

  // ── Panel Manager ──
  const panels = new PanelManager(hud);

  // ── Meteors ──
  const meteors = new MeteorSystem(scene);

  // ── Animals ──
  const animals = buildAnimals(scene);
  // ── NPCs / villagers ──
  const npcs = buildNPCs(scene);

  // ── Music ──
  const audio  = new Audio('music/alexander-nakarada-adventure.mp3');
  audio.loop   = true;
  audio.volume = 0.35;
  audio.play().catch(() => {}); // catch autoplay policy errors silently

  // ── Game loop ──
  let t       = 0;
  let lastNow = performance.now();
  let uiTimer = 0;
  let cameraSpeed01 = 0;
  const lookTarget = new THREE.Vector3(0, 2.0, -5);

  function animate(now = performance.now()) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastNow) / 1000, 0.033);
    lastNow = now;
    t += dt;
    uiTimer += dt;

    cart.update(dt, t);

    const pos       = cart.getPosition();
    const speedInfo = cart.getSpeedInfo();
    const speedLerp = 1 - Math.pow(0.88, dt / 0.016);
    cameraSpeed01 += (speedInfo.speed01 - cameraSpeed01) * speedLerp;

    if (uiTimer >= 0.08) {
      hud.update({
        x:            pos.x,
        z:            pos.z,
        angle:        pos.angle,
        displaySpeed: speedInfo.displaySpeed,
        speed01:      speedInfo.speed01,
      });
      panels.checkZones(pos.x, pos.z);
      uiTimer = 0;
    }

    // Camera spring follow
    const camDist  = 7.5 + cameraSpeed01 * 3.5;
    const camHeight = 3.4 + cameraSpeed01 * 1.4;
    const targetX  = pos.x + Math.sin(pos.angle + cart.camAngleOffset) * (-camDist);
    const targetZ  = pos.z + Math.cos(pos.angle + cart.camAngleOffset) * (-camDist);

    const camLerp = 1 - Math.pow(0.88, dt / 0.016);
    camera.position.x += (targetX      - camera.position.x) * camLerp;
    camera.position.y += (camHeight    - camera.position.y) * camLerp;
    camera.position.z += (targetZ      - camera.position.z) * camLerp;

    const lookLerp = 1 - Math.pow(0.86, dt / 0.016);
    lookTarget.x += (pos.x - lookTarget.x) * lookLerp;
    lookTarget.y += (cart.camPitchOffset - lookTarget.y) * lookLerp;
    lookTarget.z += (pos.z - lookTarget.z) * lookLerp;
    camera.lookAt(lookTarget);

    // Subsystems
    meteors.update(dt);
    animals.forEach(a => a.update(dt, t, pos.x, pos.z));
    npcs.forEach(n => n.update(dt, t, pos.x, pos.z));

    _animateWorld(worldObjects, t, dt);

    renderer.render(scene, camera);
  }

  animate();
}

// ═══════════════════════════════
// WORLD ANIMATIONS
// ═══════════════════════════════

function _animateWorld(w, t, dt) {
  const { forge, lanterns, well, sky, zoneMarkers, workshop, guildHall, campfires, birds } = w;

  if (!w.staticGlowConfigured) {
    lanterns.forEach((l) => {
      if (l.light) l.light.intensity = 1.25;
      l.globe.material.emissiveIntensity = 0.95;
    });
    [zoneMarkers.projectsMarker, zoneMarkers.aboutMarker, zoneMarkers.contactMarker].forEach((m) => {
      m.orb.material.emissiveIntensity = 0.85;
      if (m.light) m.light.intensity = 1.05;
    });
    w.staticGlowConfigured = true;
  }

  // ── Forge tower animations ──
  forge.fire.position.y        = 0.87 + Math.sin(t * 4.2) * 0.12;
  forge.fire.scale.setScalar(1 + Math.sin(t * 7.1) * 0.16);
  forge.crystal.rotation.y     = t * 0.80;
  forge.crystal.rotation.x     = Math.sin(t * 0.50) * 0.30;
  forge.crystalInner.rotation.y = -t * 1.2;
  forge.crystalInner.rotation.z =  t * 0.6;
  forge.crystalLight.intensity = 3.4;
  forge.forgeLight.intensity   = 4.2;
  forge.runeLight.intensity    = 1.1;

  // ── Well glow ──
  well.glow.material.emissiveIntensity = 0.95 + Math.sin(t * 1.1) * 0.15;
  if (well.wl) well.wl.intensity = 1.45;

  // ── Stars ──
  sky.starsBright.rotation.y       = t * 0.0007;
  sky.starsDim.rotation.y          = t * 0.0005;
  sky.starsBright.material.opacity = 0.80 + 0.15 * Math.sin(t * 1.3);
  sky.starsDim.material.opacity    = 0.45 + 0.15 * Math.sin(t * 1.7 + 1.2);

  // ── Zone marker orbs ──
  const { projectsMarker, aboutMarker, contactMarker } = zoneMarkers;
  const orbHeights = [5.8, 9.2, 7.0];
  [projectsMarker, aboutMarker, contactMarker].forEach((m, i) => {
    m.orb.position.y  = orbHeights[i] + Math.sin(t * 1.8 + i * 2.1) * 0.22;
    m.orb.rotation.y  = t * 1.1 + i * 1.4;
  });

  // ── Chimney smoke animation ──
  // Smoke puffs rise in local space above their chimney, expand, fade, then recycle
  function animateSmoke(smokeArr) {
    smokeArr.forEach((puff) => {
      const speed = 0.42;
      // Only rise — no x/z drift so puffs stay above the chimney in local space
      puff.position.y += speed * dt;
      // Expand and fade based on how far above the base it has risen
      const age = (puff.position.y - puff.userData.baseY) / 3.5;
      puff.scale.setScalar(1.0 + age * 1.2);
      puff.material.opacity = Math.max(0, 0.45 - age * 0.38);
      // Recycle back to chimney mouth when exhausted
      if (puff.position.y > puff.userData.baseY + 4.2 || puff.material.opacity <= 0) {
        puff.position.set(
          puff.userData.baseX + (Math.random() - 0.5) * 0.15,
          puff.userData.baseY,
          puff.userData.baseZ + (Math.random() - 0.5) * 0.15,
        );
        puff.scale.setScalar(0.4 + Math.random() * 0.3);
        puff.material.opacity = 0.38;
      }
    });
  }

  if (workshop?.smoke)       animateSmoke(workshop.smoke);
  if (guildHall?.smokeBig)   animateSmoke(guildHall.smokeBig);
  if (guildHall?.smokeSmall) animateSmoke(guildHall.smokeSmall);

  // ── Campfire flicker ──
  campfires.forEach((cf, i) => {
    const flicker = Math.sin(t * 5.2 + i * 2.3) * 0.08;
    cf.flame.scale.set(1 + flicker, 1 + Math.abs(flicker) * 0.5, 1 + flicker);
    cf.flame.position.y = 0.28 + Math.sin(t * 8 + i) * 0.04;
    cf.flameOuter.scale.set(1 - flicker * 0.5, 1 + flicker * 0.3, 1 - flicker * 0.5);
    cf.flameOuter.rotation.y = t * 2.1 + i;
    if (cf.fireLight) cf.fireLight.intensity = 1.65;
  });

  // ── Birds flocking ──
  birds.forEach(flock => {
    flock.angle += flock.speed * dt;
    flock.meshes.forEach((bird, bi) => {
      const a = flock.angle + bird.userData.orbitAngle;
      const r = bird.userData.orbitR;
      bird.position.set(
        flock.cx + Math.cos(a) * r,
        flock.cy + bird.userData.heightVar + Math.sin(t * 1.4 + bi) * 1.2,
        flock.cz + Math.sin(a) * r,
      );
      // Face direction of travel
      bird.rotation.y = a + Math.PI / 2;
      // Wing flap
      const flap = Math.sin(t * 5.5 + bird.userData.phaseOffset);
      bird.children[0].rotation.z =  0.7 + flap * 0.5;
      bird.children[1].rotation.z = -0.7 - flap * 0.5;
    });
  });
}
