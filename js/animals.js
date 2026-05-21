// ═══════════════════════════════
// animals.js — Village Animals (Dogs & Cats)
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// ── Low-poly Dog mesh ──
function buildDog(color = 0x8b6340) {
  const mat     = new THREE.MeshLambertMaterial({ color });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x2a1a08 });
  const g = new THREE.Group();

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 0.9), mat);
  body.position.y = 0.36;
  g.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.30), mat);
  head.position.set(0, 0.54, 0.48);
  g.add(head);

  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.16), mat);
  snout.position.set(0, 0.46, 0.62);
  g.add(snout);

  // Ears (two flat boxes tilted out)
  [-1, 1].forEach(side => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.10), darkMat);
    ear.position.set(side * 0.16, 0.68, 0.46);
    ear.rotation.z = side * 0.3;
    g.add(ear);
  });

  // Tail
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.07), mat);
  tail.position.set(0, 0.52, -0.46);
  tail.rotation.x = -0.5;
  g.add(tail);

  // Legs (4)
  [[-0.18, 0.3], [0.18, 0.3], [-0.18, -0.3], [0.18, -0.3]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), mat);
    leg.position.set(lx, 0.14, lz);
    g.add(leg);
  });

  g.scale.setScalar(0.72);
  return g;
}

// ── Low-poly Cat mesh ──
function buildCat(color = 0x888888) {
  const mat     = new THREE.MeshLambertMaterial({ color });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const g = new THREE.Group();

  // Body (slimmer than dog)
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.72), mat);
  body.position.y = 0.30;
  g.add(body);

  // Head (rounder)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.26), mat);
  head.position.set(0, 0.46, 0.38);
  g.add(head);

  // Pointed ears
  [-1, 1].forEach(side => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 4), darkMat);
    ear.position.set(side * 0.10, 0.60, 0.36);
    g.add(ear);
  });

  // Tail (long, curved via angled segments)
  const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.30, 0.06), mat);
  tail1.position.set(0, 0.44, -0.38);
  tail1.rotation.x = -0.7;
  g.add(tail1);

  const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), mat);
  tail2.position.set(0, 0.66, -0.54);
  tail2.rotation.x = -1.4;
  g.add(tail2);

  // Legs
  [[-0.13, 0.26], [0.13, 0.26], [-0.13, -0.26], [0.13, -0.26]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), mat);
    leg.position.set(lx, 0.11, lz);
    g.add(leg);
  });

  g.scale.setScalar(0.7);
  return g;
}

// ── Animal entity ──
class Animal {
  constructor(scene, mesh, waypoints, speed, type) {
    this.scene     = scene;
    this.mesh      = mesh;
    this.waypoints = waypoints;   // Array of {x, z}
    this.speed     = speed;
    this.type      = type;        // 'dog' | 'cat'

    this.wpIndex   = 0;
    this.idleTimer = 0;           // how long to sit still
    this.idling    = false;
    this.tailTimer = 0;           // for tail wag

    // Start at first waypoint
    this.mesh.position.set(waypoints[0].x, 0, waypoints[0].z);
    scene.add(this.mesh);
  }

  update(dt, t, cartX, cartZ) {
    this.tailTimer += dt;

    const target = this.waypoints[this.wpIndex];
    const dx     = target.x - this.mesh.position.x;
    const dz     = target.z - this.mesh.position.z;
    const dist   = Math.sqrt(dx * dx + dz * dz);
    const pdx    = this.mesh.position.x - cartX;
    const pdz    = this.mesh.position.z - cartZ;
    const pdist  = Math.max(Math.sqrt(pdx * pdx + pdz * pdz), 0.001);
    const avoidRadius = this.type === 'cat' ? 2.65 : 2.35;
    const personalSpace = this.type === 'cat' ? 1.35 : 1.2;
    const avoidingCart = pdist < avoidRadius;

    // ── Idle behaviour ──
    if (this.idling) {
      if (avoidingCart) {
        this.idling = false;
      } else {
        this.idleTimer -= dt;
        // Gentle sit-bob
        this.mesh.position.y = Math.sin(t * 1.2) * 0.015;
        if (this.idleTimer <= 0) {
          this.idling = false;
          this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
        }
        return;
      }
    }

    // ── Move toward waypoint ──
    if (dist < 0.18 && !avoidingCart) {
      // Reached waypoint — maybe idle for a bit
      const willIdle = this.type === 'cat'
        ? Math.random() < 0.55   // cats idle more
        : Math.random() < 0.30;
      if (willIdle) {
        this.idling    = true;
        this.idleTimer = (this.type === 'cat' ? 2.5 : 1.2) + Math.random() * 3.0;
      } else {
        this.wpIndex = (this.wpIndex + 1) % this.waypoints.length;
      }
    } else {
      let moveX = dist > 0.001 ? dx / dist : 0;
      let moveZ = dist > 0.001 ? dz / dist : 1;
      let spd = this.speed;

      if (avoidingCart) {
        const fallbackAngle = t + (this.type === 'cat' ? 1.7 : -1.1);
        const awayX = pdist > 0.01 ? pdx / pdist : Math.sin(fallbackAngle);
        const awayZ = pdist > 0.01 ? pdz / pdist : Math.cos(fallbackAngle);
        const pressure = (avoidRadius - pdist) / avoidRadius;

        if (pdist < personalSpace) {
          moveX = awayX;
          moveZ = awayZ;
          spd *= 2.4;
        } else {
          moveX = moveX * (1 - pressure) + awayX * (pressure * 2.4);
          moveZ = moveZ * (1 - pressure) + awayZ * (pressure * 2.4);
          const len = Math.max(Math.sqrt(moveX * moveX + moveZ * moveZ), 0.001);
          moveX /= len;
          moveZ /= len;
          spd *= 1.0 + pressure * 1.4;
        }
      }

      this.mesh.position.x += moveX * spd * dt;
      this.mesh.position.z += moveZ * spd * dt;

      // Face direction of travel
      this.mesh.rotation.y = Math.atan2(moveX, moveZ);

      // Walk bob
      this.mesh.position.y = Math.abs(Math.sin(t * (avoidingCart ? 10 : 6))) * (avoidingCart ? 0.052 : 0.04);
    }
  }
}

// ═══════════════════════════════
// Main export
// ═══════════════════════════════

export function buildAnimals(scene) {
  const animals = [];

  // ── Dogs ──
  const dogDefs = [
    {
      color: 0x8b6340,
      speed: 1.4,
      waypoints: [
        { x: -5, z: -2 }, { x: -2, z: -4 }, { x:  1, z: -2 },
        { x:  2, z:  2 }, { x: -2, z:  3 }, { x: -5, z:  1 },
      ],
    },
    {
      color: 0xb08040,
      speed: 1.2,
      waypoints: [
        { x:  5, z:  8 }, { x:  8, z:  6 }, { x:  8, z: 10 },
        { x:  5, z: 12 }, { x:  3, z:  9 },
      ],
    },
    {
      color: 0x5a3a1a,
      speed: 1.6,
      waypoints: [
        { x: -3, z: 14 }, { x:  0, z: 16 }, { x:  3, z: 14 },
        { x:  2, z: 11 }, { x: -2, z: 12 },
      ],
    },
  ];

  dogDefs.forEach(def => {
    const mesh = buildDog(def.color);
    animals.push(new Animal(scene, mesh, def.waypoints, def.speed, 'dog'));
  });

  // ── Cats ──
  const catDefs = [
    {
      color: 0xaaaaaa,
      speed: 0.9,
      waypoints: [
        { x:  3, z: -3 }, { x:  5, z: -5 }, { x:  6, z: -2 },
        { x:  4, z:  0 }, { x:  2, z: -1 },
      ],
    },
    {
      color: 0xcc8833,
      speed: 1.0,
      waypoints: [
        { x: -6, z:  6 }, { x: -8, z:  8 }, { x: -6, z: 10 },
        { x: -4, z:  8 }, { x: -5, z:  6 },
      ],
    },
    {
      color: 0x333333,
      speed: 0.8,
      waypoints: [
        { x:  1, z: 19 }, { x:  3, z: 21 }, { x:  0, z: 23 },
        { x: -2, z: 21 }, { x: -1, z: 18 },
      ],
    },
  ];

  catDefs.forEach(def => {
    const mesh = buildCat(def.color);
    animals.push(new Animal(scene, mesh, def.waypoints, def.speed, 'cat'));
  });

  return animals;
}
