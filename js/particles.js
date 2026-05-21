// ═══════════════════════════════
// particles.js — Floating embers & arcane motes
// ═══════════════════════════════

export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width  = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn() {
    const isArcane = Math.random() < 0.28;
    particles.push({
      x:          Math.random() * window.innerWidth,
      y:          window.innerHeight + 12,
      vx:         (Math.random() - 0.5) * 0.35,
      vy:         -(Math.random() * 0.55 + 0.18),
      size:       Math.random() * 2.2 + 0.5,
      life:       1.0,
      decay:      Math.random() * 0.003 + 0.0018,
      wobble:     Math.random() * Math.PI * 2,
      wobbleSpd:  Math.random() * 0.018 + 0.008,
      isArcane,
    });
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (particles.length < 90 && Math.random() < 0.09) spawn();

    particles = particles.filter(p => p.life > 0);

    for (const p of particles) {
      p.wobble += p.wobbleSpd;
      p.x += p.vx + Math.sin(p.wobble) * 0.28;
      p.y += p.vy;
      p.life -= p.decay;

      const alpha = p.life * 0.65;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isArcane
        ? `rgba(0, 229, 255, ${alpha})`
        : `rgba(255, 140, 0,  ${alpha})`;
      ctx.fill();
    }

    animFrame = requestAnimationFrame(tick);
  }

  tick();

  return () => cancelAnimationFrame(animFrame);
}
