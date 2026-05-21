// ═══════════════════════════════
// meteors.js — Meteor Shower System
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class MeteorSystem {
  constructor(scene) {
    this.scene   = scene;
    this.meteors = [];

    // How often a new meteor can spawn (seconds)
    this.SPAWN_INTERVAL_MIN = 2.5;
    this.SPAWN_INTERVAL_MAX = 7.0;
    this._nextSpawn = this._randomInterval();

    // Shared trail material — additive so it glows against the dark sky
    this._mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
    });

    // Occasional shower burst (several meteors at once)
    this._showerTimer  = 30 + Math.random() * 40; // first shower after 30-70s
    this._inShower     = false;
    this._showerQueued = 0;
    this._showerDelay  = 0;
  }

  // ── Spawn a single meteor ──
  _spawn(fast = false) {
    // Pick a random start point high in the sky, biased toward the back/sides
    const startX =  (Math.random() - 0.5) * 160;
    const startY =  55 + Math.random() * 30;
    const startZ = -60 - Math.random() * 60;

    // Direction: always moving forward+down (so it streaks across the viewport)
    const speed  = fast
      ? 18 + Math.random() * 12
      :  8 + Math.random() * 10;

    const dirX   = (Math.random() - 0.5) * 0.4;
    const dirY   = -(0.55 + Math.random() * 0.35);   // mostly downward
    const dirZ   =   0.6 + Math.random() * 0.4;       // toward camera

    // Length of the visible trail (in world units)
    const trailLen = fast
      ? 6 + Math.random() * 8
      : 3 + Math.random() * 5;

    // Build a simple 2-point line (head → tail)
    const points = [
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(startX - dirX * trailLen,
                        startY - dirY * trailLen,
                        startZ - dirZ * trailLen),
    ];
    const geo  = new THREE.BufferGeometry().setFromPoints(points);
    const mat  = this._mat.clone();
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);

    this.meteors.push({
      line,
      geo,
      mat,
      // Current head position
      x: startX, y: startY, z: startZ,
      dirX, dirY, dirZ,
      speed,
      trailLen,
      life: 1.0,
      // How long before it fades (seconds of travel)
      duration: 1.4 + Math.random() * 0.8,
      elapsed:  0,
    });
  }

  _randomInterval() {
    return this.SPAWN_INTERVAL_MIN
      + Math.random() * (this.SPAWN_INTERVAL_MAX - this.SPAWN_INTERVAL_MIN);
  }

  // ── Call every frame ──
  update(dt) {
    // Regular spawn timer
    this._nextSpawn -= dt;
    if (this._nextSpawn <= 0) {
      this._spawn();
      this._nextSpawn = this._randomInterval();
    }

    // Shower burst timer
    this._showerTimer -= dt;
    if (this._showerTimer <= 0 && !this._inShower) {
      this._inShower     = true;
      this._showerQueued = 6 + Math.floor(Math.random() * 6); // 6-11 fast meteors
      this._showerDelay  = 0;
      this._showerTimer  = 45 + Math.random() * 60; // next shower in 45-105s
    }

    if (this._inShower) {
      this._showerDelay -= dt;
      if (this._showerDelay <= 0 && this._showerQueued > 0) {
        this._spawn(true);
        this._showerQueued--;
        this._showerDelay = 0.18 + Math.random() * 0.25; // stagger each streak
      }
      if (this._showerQueued === 0) this._inShower = false;
    }

    // Tick each active meteor
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.elapsed += dt;
      const progress = m.elapsed / m.duration; // 0 → 1

      // Move head
      m.x += m.dirX * m.speed * dt;
      m.y += m.dirY * m.speed * dt;
      m.z += m.dirZ * m.speed * dt;

      // Fade out in the last 40% of life
      m.life = progress < 0.6 ? 1.0 : 1.0 - (progress - 0.6) / 0.4;
      m.mat.opacity = Math.max(0, m.life) * 0.92;

      // Update geometry: head at current pos, tail trailing behind
      const positions = m.geo.attributes.position.array;
      positions[0] = m.x;
      positions[1] = m.y;
      positions[2] = m.z;
      positions[3] = m.x - m.dirX * m.trailLen;
      positions[4] = m.y - m.dirY * m.trailLen;
      positions[5] = m.z - m.dirZ * m.trailLen;
      m.geo.attributes.position.needsUpdate = true;

      // Remove dead meteors
      if (m.elapsed >= m.duration) {
        this.scene.remove(m.line);
        m.geo.dispose();
        m.mat.dispose();
        this.meteors.splice(i, 1);
      }
    }
  }
}
