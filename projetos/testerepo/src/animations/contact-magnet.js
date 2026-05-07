import { gsap } from 'gsap';
import { decodeMatrixReveals, eraseMatrixReveals } from './arsenal-sequence.js';

let particleSystem = null;
let liquidLoop = null;

function initParticles(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  const particles = [];
  const COUNT = 80;
  const mouse = { x: -9999, y: -9999 };
  let raf = null;
  let running = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.4 + 0.2,
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist2 = dx * dx + dy * dy;
      const radius = 150;
      if (dist2 < radius * radius) {
        const dist = Math.sqrt(dist2) || 0.01;
        const force = (radius - dist) / radius * 1.2;
        p.vx += (dx / dist) * force * 0.18;
        p.vy += (dy / dist) * force * 0.18;
      }
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
      ctx.fillStyle = `rgba(0, 229, 255, ${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (running) raf = requestAnimationFrame(step);
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function onLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  resize();
  spawn();

  window.addEventListener('resize', () => { resize(); spawn(); });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseout', onLeave);

  return {
    start() {
      if (running) return;
      running = true;
      step();
    },
    stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    },
  };
}

function initMagnetic(button) {
  if (!button) return;
  const label = button.querySelector('.contact-cta__label');
  const icon = button.querySelector('.contact-cta__icon');
  const radius = 200;
  let rect;

  function refreshRect() { rect = button.getBoundingClientRect(); }

  function onMove(e) {
    if (!rect) refreshRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      const factor = 1 - dist / radius;
      gsap.to(button, { x: dx * 0.3 * factor, y: dy * 0.3 * factor, duration: 0.4, ease: 'power2.out' });
      if (label) gsap.to(label, { x: dx * 0.5 * factor, y: dy * 0.5 * factor, duration: 0.4, ease: 'power2.out' });
      if (icon) gsap.to(icon, { x: dx * 0.5 * factor, y: dy * 0.5 * factor, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to([button, label, icon].filter(Boolean), { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('scroll', refreshRect);
  window.addEventListener('resize', refreshRect);
  refreshRect();
}

function startLiquidLoop() {
  const turbulence = document.getElementById('feTurbulence');
  if (!turbulence || liquidLoop) return;
  liquidLoop = gsap.to(turbulence, {
    attr: { baseFrequency: 0.05 },
    duration: 6,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
}

function stopLiquidLoop() {
  if (liquidLoop) {
    liquidLoop.kill();
    liquidLoop = null;
  }
  const turbulence = document.getElementById('feTurbulence');
  if (turbulence) gsap.set(turbulence, { attr: { baseFrequency: 0 } });
}

export function initContactMagnet() {
  const section = document.querySelector('.contact-cinema');
  if (!section) return;
  const canvas = section.querySelector('.contact-particles');
  const button = section.querySelector('[data-magnetic]');

  particleSystem = initParticles(canvas);
  initMagnetic(button);
}

export async function revealContactCinema(section) {
  if (!section) return;
  const eyebrow = section.querySelector('.contact-cinema__eyebrow');
  const words = section.querySelectorAll('.contact-cinema__word');
  const lead = section.querySelector('.contact-cinema__lead');
  const cta = section.querySelector('.contact-cta');
  const meta = section.querySelector('.contact-cinema__meta');

  gsap.set(words, { clipPath: 'inset(0 100% 0 0)' });
  gsap.set(cta, { opacity: 0, scale: 0.85 });
  gsap.set(meta, { opacity: 0, y: 20 });

  if (particleSystem) particleSystem.start();
  startLiquidLoop();

  if (eyebrow?._matrixReveal?.decode) await eyebrow._matrixReveal.decode();

  await new Promise(resolve => {
    gsap.to(words, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.8,
      stagger: 0.15,
      ease: 'expo.out',
      onComplete: resolve,
    });
  });

  if (lead?._matrixReveal?.decode) lead._matrixReveal.decode();

  gsap.to(cta, {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: 'back.out(1.6)',
  });

  gsap.to(meta, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.3,
    ease: 'power2.out',
  });
}

export async function hideContactCinema(section) {
  if (!section) return;

  if (particleSystem) particleSystem.stop();
  stopLiquidLoop();

  const targets = section.querySelectorAll('.contact-cinema__word, .contact-cta, .contact-cinema__meta, .contact-cinema__lead, .contact-cinema__eyebrow');

  await new Promise(resolve => {
    gsap.to(targets, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });

  await eraseMatrixReveals(section);
}
