import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Simple NPC system: lightweight, low-poly villagers with wandering behavior
// Export: buildNPCs(scene) -> returns array of NPC objects with `update(dt, t, px, pz)`

class NPC {
  constructor(scene, x, z, opts = {}) {
    this.spawnX = x; this.spawnZ = z;
    this.group = new THREE.Group();
    this.group.position.set(x, 0, z);

    const bodyMat = new THREE.MeshLambertMaterial({ color: opts.colorBody || 0x806040 });
    const skinMat = new THREE.MeshLambertMaterial({ color: opts.colorSkin || 0xffd7b2 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.28), bodyMat);
    body.position.y = 0.35; this.group.add(body);
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), skinMat);
    head.position.y = 0.85; this.group.add(head);
    this.head = head;

    // Simple hat / hair as a cap
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.18, 6), bodyMat);
    hat.rotation.x = Math.PI; hat.position.set(0, 0.98, 0); this.group.add(hat);

    // Shadow/base subtle
    const base = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12 }));
    base.rotation.x = -Math.PI/2; base.position.y = 0.01; this.group.add(base);

    scene.add(this.group);

    // Movement state
    this.target = new THREE.Vector3(x, 0, z);
    this.speed = opts.speed || (0.9 + Math.random() * 0.6);
    this.wanderRadius = opts.radius || 4.0;
    this.id = Math.floor(Math.random() * 10000);
  }

  _pickTarget() {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * this.wanderRadius;
    this.target.set(this.spawnX + Math.cos(a) * r, 0, this.spawnZ + Math.sin(a) * r);
  }

  update(dt, t, px, pz) {
    // Occasionally pick a new target
    if (!this.target || Math.random() < 0.006) this._pickTarget();

    // Move toward target
    const pos = this.group.position;
    const dx = this.target.x - pos.x;
    const dz = this.target.z - pos.z;
    const dist = Math.sqrt(dx*dx + dz*dz);
    const hasCart = typeof px === 'number' && typeof pz === 'number';
    const pdx = hasCart ? pos.x - px : 0;
    const pdz = hasCart ? pos.z - pz : 0;
    const pd = Math.sqrt(pdx*pdx + pdz*pdz);
    const avoidRadius = 2.1;
    const avoidingCart = hasCart && pd < avoidRadius;

    if (dist > 0.14 || avoidingCart) {
      let nx = dist > 0.001 ? dx / dist : 0;
      let nz = dist > 0.001 ? dz / dist : 1;
      let spd = this.speed;

      if (avoidingCart) {
        const fallbackAngle = t + this.id * 0.01;
        const awayX = pd > 0.01 ? pdx / pd : Math.sin(fallbackAngle);
        const awayZ = pd > 0.01 ? pdz / pd : Math.cos(fallbackAngle);
        const pressure = (avoidRadius - Math.max(pd, 0.001)) / avoidRadius;

        if (pd < 1.05) {
          nx = awayX;
          nz = awayZ;
          spd *= 1.9;
        } else {
          nx = nx * (1 - pressure) + awayX * (pressure * 2.0);
          nz = nz * (1 - pressure) + awayZ * (pressure * 2.0);
          const len = Math.max(Math.sqrt(nx*nx + nz*nz), 0.001);
          nx /= len;
          nz /= len;
          spd *= 1.0 + pressure * 0.9;
        }
      }

      pos.x += nx * spd * dt;
      pos.z += nz * spd * dt;
      // face travel direction
      const yaw = Math.atan2(nx, nz);
      this.group.rotation.y += (yaw - this.group.rotation.y) * 0.15;
    } else {
      // small idle sway
      this.group.rotation.y += Math.sin(t * 0.6 + this.id) * 0.001;
      // small chance to choose a new spot
      if (Math.random() < 0.02) this._pickTarget();
    }

    // Head bob / idle animation
    this.head.position.y = 0.82 + Math.sin(t * 3.2 + this.id) * 0.03;

    // Optional: simple social behavior - look at player if close
    if (hasCart) {
      const lookX = px - pos.x, lookZ = pz - pos.z;
      const lookDist = Math.sqrt(lookX*lookX + lookZ*lookZ);
      if (lookDist < 3.0) {
        // look toward player a little
        const ang = Math.atan2(lookX, lookZ);
        this.head.rotation.y += (ang - this.head.rotation.y) * 0.12;
      } else {
        this.head.rotation.y *= 0.92; // relax
      }
    }
  }
}

export function buildNPCs(scene, opts = {}) {
  const npcs = [];
  // Example default placements (near village center / houses)
  const positions = opts.positions || [ [-5,2], [5,4] ];
  for (let i = 0; i < positions.length; i++) {
    const [x,z] = positions[i];
    const n = new NPC(scene, x, z, { radius: 5.0 });
    npcs.push(n);
  }

  // Return array-like objects with update signature similar to animals
  return npcs.map(n => ({ update: (dt,t,px,pz) => n.update(dt,t,px,pz), group: n.group }));
}
