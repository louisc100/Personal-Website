// ═══════════════════════════════
// cart.js — Mechanical cart physics & input
// ═══════════════════════════════

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class Cart {
  constructor(scene) {
    this.scene = scene;
    this.speed    = 0;
    this.angle    = 0;
    this.x        = 0;
    this.z        = -5;
    this.wheelRot = 0;

    // Config
    this.MAX_SPEED  = 0.125;
    this.BOOST_MAX  = 0.175;
    this.ACCEL      = 0.0085;
    this.FRICTION   = 0.936;
    this.STEER      = 0.041;

    // Input
    this.keys = {};
    this._bindKeys();

    // Mouse-look
    this.camAngleOffset = 0;   // horizontal orbit (yaw)
    this.camPitchOffset = 2.0; // vertical tilt (lookAt Y), start slightly upward
    this._dragging = false;
    this._lastMX   = 0;
    this._lastMY   = 0;
    this._bindMouse();

    this._buildMesh();
  }

  _bindKeys() {
    window.addEventListener('keydown', e => { this.keys[e.code] = true;  });
    window.addEventListener('keyup',   e => { this.keys[e.code] = false; });
  }

  _bindMouse() {
    window.addEventListener('mousedown', e => {
      this._dragging = true;
      this._lastMX = e.clientX;
      this._lastMY = e.clientY;
    });
    window.addEventListener('mouseup', () => { this._dragging = false; });
    window.addEventListener('mousemove', e => {
      if (!this._dragging) return;

      // Horizontal drag → yaw (orbit left/right)
      this.camAngleOffset -= (e.clientX - this._lastMX) * 0.005;

      // Vertical drag → pitch (lookAt Y up/down)
      // Dragging up (negative deltaY) raises the look target → camera tilts up
      this.camPitchOffset -= (e.clientY - this._lastMY) * 0.04;
      // Clamp: floor keeps ground visible, ceiling stops flipping past zenith
      this.camPitchOffset = Math.max(-2, Math.min(18, this.camPitchOffset));

      this._lastMX = e.clientX;
      this._lastMY = e.clientY;
    });
  }

  _buildMesh() {
    const woodMat   = new THREE.MeshLambertMaterial({ color: 0x4a2c0f });
    const ironMat   = new THREE.MeshLambertMaterial({ color: 0x1c1c1c });
    const brassMat  = new THREE.MeshBasicMaterial({ color: 0x8f641c });
    const copperMat = new THREE.MeshBasicMaterial({ color: 0x7b3f18 });
    const arcaneMat = new THREE.MeshBasicMaterial({ color: 0x2297aa });
    const emberMat  = new THREE.MeshBasicMaterial({ color: 0xb34616 });
    const leatherMat = new THREE.MeshLambertMaterial({ color: 0x2c1709 });

    this.group = new THREE.Group();

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 1.8), woodMat);
    body.position.y = 0.55; body.castShadow = true;
    this.group.add(body);

    // Separate brass rails avoid coplanar faces with the wooden body.
    [
      [0, 0.86,  0.99, 1.14, 0.08, 0.08],
      [0, 0.86, -0.99, 1.14, 0.08, 0.08],
      [-0.58, 0.82, 0, 0.08, 0.10, 1.76],
      [ 0.58, 0.82, 0, 0.08, 0.10, 1.76],
    ].forEach(([x, y, z, w, h, d]) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), brassMat);
      rail.position.set(x, y, z);
      this.group.add(rail);
    });

    [-0.42, 0.42].forEach(sx => {
      [-0.62, 0, 0.62].forEach(sz => {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 5), brassMat);
        rivet.position.set(sx, 0.83, sz);
        this.group.add(rivet);
      });
    });

    // Iron chassis sides
    [-0.54, 0.54].forEach(sx => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 1.9), ironMat);
      side.position.set(sx, 0.45, 0);
      this.group.add(side);
    });

    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.16, 0.12), ironMat);
    frontBumper.position.set(0, 0.36, 0.98);
    this.group.add(frontBumper);

    const rearBoiler = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.66, 12), copperMat);
    rearBoiler.rotation.z = Math.PI / 2;
    rearBoiler.position.set(0, 0.68, -0.66);
    this.group.add(rearBoiler);
    [-0.26, 0.26].forEach(bx => {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.018, 6, 12), ironMat);
      band.rotation.y = Math.PI / 2;
      band.position.set(bx, 0.68, -0.66);
      this.group.add(band);
    });

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.46), leatherMat);
    seat.position.set(0, 0.82, -0.4);
    this.group.add(seat);

    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.32, 0.08), leatherMat);
    seatBack.position.set(0, 1.00, -0.64);
    this.group.add(seatBack);

    // Arcane engine coil (front)
    const engineFrame = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.34, 0.12), ironMat);
    engineFrame.position.set(0, 0.58, 1.02);
    this.group.add(engineFrame);

    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 8, 16), brassMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.set(0, 0.58, 1.10);
    this.group.add(coil);

    // Engine core glow
    this.engineGlow = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), arcaneMat);
    this.engineGlow.position.set(0, 0.58, 1.12);
    this.group.add(this.engineGlow);

    [-0.28, 0.28].forEach(sx => {
      const runeRail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 1.20), arcaneMat);
      runeRail.position.set(sx, 0.91, 0.03);
      this.group.add(runeRail);
    });

    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.82, 8), ironMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 1.02, 0.34);
    this.group.add(handleBar);

    [-0.24, 0.24].forEach(sx => {
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.08), woodMat);
      grip.position.set(sx, 1.02, 0.72);
      this.group.add(grip);
    });

    // Wheels
    this.wheels = [
      this._makeWheel(-0.6,  0.72, woodMat, ironMat),
      this._makeWheel( 0.6,  0.72, woodMat, ironMat),
      this._makeWheel(-0.6, -0.72, woodMat, ironMat),
      this._makeWheel( 0.6, -0.72, woodMat, ironMat),
    ];

    // Front lantern in an open iron cage, kept proud of the bonnet to prevent flicker.
    [
      [0, 0.92, 1.13, 0.30, 0.035, 0.035],
      [0, 1.14, 1.13, 0.30, 0.035, 0.035],
      [-0.15, 1.03, 1.13, 0.035, 0.24, 0.035],
      [0.15, 1.03, 1.13, 0.035, 0.24, 0.035],
    ].forEach(([x, y, z, w, h, d]) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ironMat);
      bar.position.set(x, y, z);
      this.group.add(bar);
    });
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), emberMat);
    lantern.position.set(0, 1.03, 1.19);
    this.group.add(lantern);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.10, 0.34), brassMat);
    hood.position.set(0, 0.93, 0.72);
    this.group.add(hood);

    [-0.22, 0.22].forEach(sx => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.62, 8), copperMat);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(sx, 0.92, -0.05);
      this.group.add(pipe);
    });

    // Cart light
    this.cartLight = new THREE.PointLight(0xff8c00, 0, 0);
    this.cartLight.position.set(0, 1.0, 1.6);
    this.group.add(this.cartLight);

    this.group.position.set(this.x, 0, this.z);
    this.scene.add(this.group);
  }

  _makeWheel(wx, wz, woodMat, ironMat) {
    const wg = new THREE.Group();
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.13, 10), ironMat
    );
    rim.rotation.z = Math.PI / 2;
    wg.add(rim);

    for (let s = 0; s < 4; s++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.48, 0.06), woodMat);
      spoke.rotation.x = (s / 4) * Math.PI * 2;
      wg.add(spoke);
    }

    wg.position.set(wx, 0.28, wz);
    wg.castShadow = true;
    this.group.add(wg);
    return wg;
  }

  update(dt, t) {
    const frameScale = Math.min(dt / 0.016, 2.1);
    const boost  = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const maxSpd = boost ? this.BOOST_MAX : this.MAX_SPEED;

    const fwd  = this.keys['KeyW'] || this.keys['ArrowUp'];
    const back = this.keys['KeyS'] || this.keys['ArrowDown'];
    const left = this.keys['KeyA'] || this.keys['ArrowLeft'];
    const rght = this.keys['KeyD'] || this.keys['ArrowRight'];

    if (fwd)  this.speed = Math.min(this.speed + this.ACCEL * frameScale, maxSpd);
    if (back) this.speed = Math.max(this.speed - this.ACCEL * 0.85 * frameScale, -maxSpd * 0.58);
    const coasting = !fwd && !back;
    this.speed *= Math.pow(coasting ? 0.90 : this.FRICTION, frameScale);
    if (Math.abs(this.speed) < 0.000001) this.speed = 0;

    if (Math.abs(this.speed) > 0.002) {
      const dir = this.speed > 0 ? 1 : -1;
      if (left) this.angle += this.STEER * dir * frameScale;
      if (rght) this.angle -= this.STEER * dir * frameScale;
    }

    this.x += Math.sin(this.angle) * this.speed * frameScale;
    this.z += Math.cos(this.angle) * this.speed * frameScale;

    // World bounds
    this.x = Math.max(-24, Math.min(24, this.x));
    this.z = Math.max(-12, Math.min(64, this.z));

    // Apply to group
    this.group.position.x = this.x;
    this.group.position.z = this.z;
    this.group.rotation.y = this.angle;

    // Wheel spin
    this.wheelRot += this.speed * 3.6 * frameScale;
    this.wheels.forEach(w => { w.rotation.x = this.wheelRot; });

    // Bounce
    const spd01 = Math.min(Math.abs(this.speed) / this.MAX_SPEED, 1);
    this.group.position.y = Math.sin(t * 10) * 0.016 * spd01;
    this.group.rotation.z = Math.sin(t * 7.5) * 0.018 * spd01;

  }

  /** Returns { speed01, displaySpeed } */
  getSpeedInfo() {
    const speed01 = Math.min(Math.abs(this.speed) / this.MAX_SPEED, 1);
    return {
      speed01,
      displaySpeed: Math.round(Math.abs(this.speed) * 540),
    };
  }

  getPosition() { return { x: this.x, z: this.z, angle: this.angle }; }
}
