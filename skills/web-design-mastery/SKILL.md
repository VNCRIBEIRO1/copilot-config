---
name: web-design-mastery
description: "Master web designer especializado em efeitos visuais modernos, animações CSS/JS, micro-interações, glassmorphism, neomorphism, gradients, scroll effects, GSAP animations, Tailwind patterns e UI components premium. WHEN: criar efeito visual, animação CSS, efeito hover, parallax, scroll animation, glassmorphism, gradient, blob, aurora, shimmer, card effect, button animation, text animation, noise texture, grain effect, neon glow, frosted glass, morphing, particle, cursor effect, loading animation, page transition, micro-interaction, dark mode design, component premium."
argument-hint: "Descreva o efeito desejado, contexto de uso (hero/card/botão/fundo), paleta de cores e framework (Tailwind/vanilla CSS/GSAP)"
---

# Web Design Mastery — Efeitos & Animações Premium

Repositório completo de efeitos visuais modernos para web design de alto impacto. Inclui CSS puro, Tailwind, GSAP e JavaScript. Todos os efeitos são testados e prontos para produção.

> **📚 Documentos complementares (LEIA-OS):**
> - [`EFFECTS-MECHANICS.md`](./EFFECTS-MECHANICS.md) — manual técnico de cards/carrosséis/tipografia/transições/scroll/3D + Awwwards-tier checklist
> - [`references/awwwards-effects-2026.md`](./references/awwwards-effects-2026.md) — **16 efeitos vencedores 2024-2026** com mecânica detalhada, código pronto e variações. Refs: Bruno Simon, Lusion v3, Active Theory V6, Resn, Immersive Garden, Akaru, Obys, Anime.js, OFF+BRAND, Daybreak, Studio 28K
> - [`references/gsap-cookbook.md`](./references/gsap-cookbook.md) — GSAP + ScrollTrigger + Observer + SplitText completo (registerPlugin, scrub, snap, batch, magnetic, etc)
>
> **Stack canônico 2026:** GSAP 3.12+ (free SplitText/Observer/Flip/DrawSVG) · Lenis · R3F + drei · anime.js v4 · motion.dev · View Transitions API

## Índice de Efeitos

1. [Gradientes e Fundos](#1-gradientes-e-fundos)
2. [Glassmorphism](#2-glassmorphism)
3. [Neumorphism](#3-neumorphism)
4. [Animações de Texto](#4-animações-de-texto)
5. [Cards Premium](#5-cards-premium)
6. [Botões Avançados](#6-botões-avançados)
7. [Efeitos de Scroll](#7-efeitos-de-scroll)
8. [Partículas e Blobs](#8-partículas-e-blobs)
9. [Cursor Customizado](#9-cursor-customizado)
10. [Loading e Transições](#10-loading-e-transições)
11. [Micro-interações](#11-micro-interações)
12. [Efeitos de Imagem](#12-efeitos-de-imagem)
13. [Neon & Glow](#13-neon--glow)
14. [Noise & Grain](#14-noise--grain)
15. [Aurora Background](#15-aurora-background)
16. [3D Effects CSS](#16-3d-effects-css)
17. [GSAP Animations](#17-gsap-animations)
18. [Tailwind Patterns](#18-tailwind-patterns)

---

## 1. Gradientes e Fundos

### Gradiente Brand Diagonal
```css
.bg-brand-gradient {
  background: linear-gradient(135deg, #ec268d 0%, #7b3ff2 100%);
}
/* Tailwind: bg-gradient-to-br from-pink-500 to-violet-600 */
```

### Gradiente Mesh (moderno)
```css
.bg-mesh {
  background-color: #0f1230;
  background-image:
    radial-gradient(at 40% 20%, rgba(236,38,141,0.35) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(123,63,242,0.3) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(236,38,141,0.2) 0px, transparent 50%),
    radial-gradient(at 80% 100%, rgba(123,63,242,0.25) 0px, transparent 50%);
}
```

### Conic Gradient (rainbow spin)
```css
.bg-conic-spin {
  background: conic-gradient(from 0deg, #ec268d, #7b3ff2, #3b82f6, #ec268d);
  animation: spin 8s linear infinite;
  border-radius: 50%;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### Animated Gradient Background
```css
.bg-animated-gradient {
  background: linear-gradient(-45deg, #ec268d, #7b3ff2, #0f1230, #1e1b4b);
  background-size: 400% 400%;
  animation: gradient-shift 12s ease infinite;
}
@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 2. Glassmorphism

### Glass Card Clássico
```css
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Frosted Glass Dark
```css
.glass-dark {
  background: rgba(15, 18, 48, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}
```

### Frosted Glass Premium (com borda luminosa)
```css
.glass-premium {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}
.glass-premium::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}
```

### Tailwind Glass
```html
<div class="bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl">
```

---

## 3. Neumorphism

### Soft UI Card (light)
```css
.neu-card {
  background: #e8ecf0;
  border-radius: 20px;
  box-shadow:
    8px 8px 16px rgba(163, 177, 198, 0.6),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}
.neu-inset {
  box-shadow:
    inset 8px 8px 16px rgba(163, 177, 198, 0.6),
    inset -8px -8px 16px rgba(255, 255, 255, 0.8);
}
```

### Soft UI Dark
```css
.neu-dark {
  background: #1a1d2e;
  border-radius: 16px;
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.5),
    -4px -4px 12px rgba(255, 255, 255, 0.03);
}
```

---

## 4. Animações de Texto

### Gradient Text Animado
```css
.gradient-text-animated {
  background: linear-gradient(90deg, #ec268d, #7b3ff2, #ec268d);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: text-shine 4s linear infinite;
}
@keyframes text-shine {
  to { background-position: 200% center; }
}
```

### Typewriter Effect (CSS)
```css
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #ec268d;
  animation: typing 3.5s steps(30) 1s forwards, blink 0.75s step-end infinite;
  width: 0;
}
@keyframes typing { to { width: 100%; } }
@keyframes blink { 50% { border-color: transparent; } }
```

### Text Reveal (word by word, GSAP)
```javascript
// GSAP split-word reveal
function revealWords(el) {
  const words = el.textContent.split(' ');
  el.innerHTML = words.map(w =>
    `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${w}&nbsp;</span></span>`
  ).join('');
  gsap.to(el.querySelectorAll('span > span'), {
    y: '0%',
    duration: 0.7,
    stagger: 0.05,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
}
```

### Scramble Text (GSAP)
```javascript
// Requer gsap/ScrambleTextPlugin
gsap.to('.scramble-target', {
  duration: 1.2,
  scrambleText: {
    text: 'Texto Final Aqui',
    chars: 'upperCase',
    revealDelay: 0.5,
    speed: 0.4
  }
});
```

### Glitch Effect (CSS)
```css
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}
.glitch::before {
  color: #ec268d;
  animation: glitch-1 0.8s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}
.glitch::after {
  color: #7b3ff2;
  animation: glitch-2 0.8s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}
@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 2px); }
  40% { transform: translate(3px, -2px); }
}
@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(3px, -2px); }
  40% { transform: translate(-3px, 2px); }
}
```

---

## 5. Cards Premium

### Card com Spotlight (mouse tracking)
```javascript
// React: adapte para vanilla
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});
```
```css
.spotlight-card {
  position: relative;
  overflow: hidden;
}
.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(236,38,141,0.12),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
}
.spotlight-card:hover::before { opacity: 1; }
```

### Card Tilt 3D
```javascript
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
```

### Card com Borda Gradiente Animada
```css
.card-gradient-border {
  position: relative;
  background: #fff;
  border-radius: 20px;
  z-index: 0;
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 22px;
  background: linear-gradient(135deg, #ec268d, #7b3ff2, #3b82f6);
  z-index: -1;
  animation: border-spin 4s linear infinite;
  background-size: 300% 300%;
}
@keyframes border-spin {
  0%   { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
```

### Beam Card (raio de luz horizontal)
```css
.beam-card {
  position: relative;
  overflow: hidden;
  background: #0f1230;
  border-radius: 20px;
}
.beam-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(236,38,141,0.12),
    rgba(123,63,242,0.08),
    transparent
  );
  animation: beam-sweep 3s ease-in-out infinite;
}
@keyframes beam-sweep {
  to { left: 140%; }
}
```

---

## 6. Botões Avançados

### Magnetic Button (GSAP)
```javascript
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  });
});
```

### Ripple Effect
```javascript
document.querySelectorAll('.btn-ripple').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      transform:scale(0);
      animation:ripple-anim 0.6s linear;
      background:rgba(255,255,255,0.3);
      width:100px;height:100px;
      left:${e.clientX - rect.left - 50}px;
      top:${e.clientY - rect.top - 50}px;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
```
```css
@keyframes ripple-anim {
  to { transform: scale(4); opacity: 0; }
}
```

### Button com Shimmer
```css
.btn-shimmer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ec268d, #7b3ff2);
  color: #fff;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
}
.btn-shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -75%;
  width: 50%;
  height: 200%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );
  transform: skewX(-20deg);
  animation: btn-shimmer 2.5s ease-in-out infinite;
}
@keyframes btn-shimmer {
  to { left: 125%; }
}
```

---

## 7. Efeitos de Scroll

### Reveal on Scroll (Intersection Observer)
```javascript
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```
```css
[data-reveal] { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
[data-reveal].is-visible { opacity: 1; transform: none; }
```

### Parallax Suave (GSAP ScrollTrigger)
```javascript
gsap.to('[data-parallax]', {
  yPercent: -25,
  ease: 'none',
  scrollTrigger: {
    trigger: '[data-parallax]',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5
  }
});
```

### Sticky Section com Progress Bar
```javascript
ScrollTrigger.create({
  trigger: '.sticky-section',
  start: 'top top',
  end: '+=500%',
  scrub: true,
  pin: true,
  onUpdate: self => {
    document.querySelector('.progress-bar').style.width = (self.progress * 100) + '%';
  }
});
```

### Horizontal Scroll
```javascript
const sections = gsap.utils.toArray('.h-section');
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-scroll-container',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + document.querySelector('.h-scroll-container').offsetWidth
  }
});
```

---

## 8. Partículas e Blobs

### Blob Animado SVG/CSS
```css
.blob {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236,38,141,0.4), rgba(123,63,242,0.2));
  filter: blur(80px);
  border-radius: 50%;
  animation: blob-morph 12s ease-in-out infinite;
}
@keyframes blob-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%       { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75%       { border-radius: 60% 30% 60% 40% / 70% 40% 50% 60%; }
}
```

### Float Animation
```css
.float {
  animation: float-y 4s ease-in-out infinite;
}
@keyframes float-y {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-16px); }
}
/* Variações com delay: animation-delay: 0.5s, 1s, 1.5s */
```

### Partículas Canvas (vanilla JS)
```javascript
// Ver references/particles-canvas.md para implementação completa
// Solução leve sem biblioteca (~60 linhas)
```

---

## 9. Cursor Customizado

### Cursor Dot + Ring
```javascript
const dot = document.createElement('div');
dot.className = 'cursor-dot';
const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function raf() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(raf);
})();
```
```css
.cursor-dot, .cursor-ring { position: fixed; pointer-events: none; z-index: 9999; border-radius: 50%; }
.cursor-dot { width: 8px; height: 8px; background: #ec268d; }
.cursor-ring { width: 36px; height: 36px; border: 2px solid rgba(236,38,141,0.5); }
```

---

## 10. Loading e Transições

### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}
@keyframes skeleton-loading {
  to { background-position: -200% 0; }
}
/* Dark: trocar #f0f0f0 → #1a1d2e, #e0e0e0 → #252840 */
```

### Page Transition (fade + slide)
```javascript
// Astro view transitions ou custom:
document.addEventListener('click', async e => {
  const link = e.target.closest('a[href]');
  if (!link || link.target || link.href.startsWith('#')) return;
  e.preventDefault();
  await gsap.to('main', { opacity: 0, y: -20, duration: 0.3 }).then();
  window.location.href = link.href;
});
window.addEventListener('pageshow', () => {
  gsap.from('main', { opacity: 0, y: 20, duration: 0.4 });
});
```

### Preloader Elegante
```css
.preloader {
  position: fixed; inset: 0; z-index: 9999;
  background: #0f1230;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 1.5rem;
}
.preloader__bar {
  width: 200px; height: 2px; background: rgba(255,255,255,0.1);
  border-radius: 2px; overflow: hidden;
}
.preloader__bar > span {
  display: block; height: 100%; width: 0;
  background: linear-gradient(90deg, #ec268d, #7b3ff2);
  transition: width 0.1s linear;
}
```

---

## 11. Micro-interações

### Toggle Switch Animado
```css
.toggle { position: relative; width: 52px; height: 28px; cursor: pointer; }
.toggle input { opacity: 0; position: absolute; }
.toggle-track {
  width: 100%; height: 100%; border-radius: 14px;
  background: #ddd; transition: background 0.3s;
}
.toggle input:checked ~ .toggle-track { background: linear-gradient(135deg,#ec268d,#7b3ff2); }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 22px; height: 22px; border-radius: 50%;
  background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle input:checked ~ .toggle-thumb { transform: translateX(24px); }
```

### Like Button Burst
```javascript
// heart burst ao clicar
btn.addEventListener('click', () => {
  btn.classList.toggle('is-liked');
  if (btn.classList.contains('is-liked')) {
    gsap.from(btn.querySelector('.icon'), {
      scale: 0, rotation: -30, duration: 0.5, ease: 'back.out(3)'
    });
  }
});
```

### Input Focus Underline Animado
```css
.input-fancy { border: none; border-bottom: 2px solid #ddd; outline: none; background: transparent; }
.input-fancy { position: relative; }
.input-fancy::after {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 0; height: 2px;
  background: linear-gradient(90deg, #ec268d, #7b3ff2);
  transition: width 0.35s ease;
}
.input-fancy:focus::after { width: 100%; }
```

---

## 12. Efeitos de Imagem

### Hover Zoom com Overlay
```css
.img-hover { overflow: hidden; border-radius: 16px; position: relative; }
.img-hover img { transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.img-hover:hover img { transform: scale(1.06); }
.img-hover::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(236,38,141,0) 0%, rgba(123,63,242,0.4) 100%);
  opacity: 0; transition: opacity 0.4s;
}
.img-hover:hover::after { opacity: 1; }
```

### Image Reveal Clip-path (GSAP ScrollTrigger)
```javascript
gsap.from('.img-reveal', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.2,
  ease: 'power4.inOut',
  scrollTrigger: { trigger: '.img-reveal', start: 'top 80%' }
});
```

### Duotone Filter (CSS)
```css
.duotone {
  filter: saturate(0) contrast(1.1);
  position: relative;
}
.duotone::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(236,38,141,0.4), rgba(123,63,242,0.4));
  mix-blend-mode: multiply;
}
```

---

## 13. Neon & Glow

### Neon Text
```css
.neon-text {
  color: #fff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #ec268d,
    0 0 82px #ec268d,
    0 0 92px #ec268d;
  animation: neon-flicker 4s infinite alternate;
}
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff,
      0 0 42px #ec268d, 0 0 82px #ec268d;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}
```

### Glow Box Shadow
```css
.glow-brand  { box-shadow: 0 0 20px rgba(236,38,141,0.5), 0 0 40px rgba(236,38,141,0.25); }
.glow-violet { box-shadow: 0 0 20px rgba(123,63,242,0.5), 0 0 40px rgba(123,63,242,0.25); }
.glow-pulse  { animation: glow-pulse 2s ease-in-out infinite alternate; }
@keyframes glow-pulse {
  from { box-shadow: 0 0 10px rgba(236,38,141,0.3); }
  to   { box-shadow: 0 0 30px rgba(236,38,141,0.7), 0 0 60px rgba(236,38,141,0.3); }
}
```

---

## 14. Noise & Grain

### Grain Texture Overlay
```css
.grain::before {
  content: '';
  position: fixed;
  inset: -200%;
  width: 400%; height: 400%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  animation: grain-move 0.5s steps(1) infinite;
  z-index: 9998;
}
@keyframes grain-move {
  0%  { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(3%, 35%); }
  90% { transform: translate(-10%, 10%); }
  100% { transform: translate(0, 0); }
}
```

---

## 15. Aurora Background

### Aurora Borealis Effect
```css
.aurora-bg {
  position: relative;
  overflow: hidden;
}
.aurora-bg::before,
.aurora-bg::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: aurora-drift 15s ease-in-out infinite alternate;
}
.aurora-bg::before {
  width: 60%; height: 60%;
  background: radial-gradient(ellipse, rgba(236,38,141,0.4), transparent 70%);
  top: -20%; left: -20%;
}
.aurora-bg::after {
  width: 50%; height: 50%;
  background: radial-gradient(ellipse, rgba(123,63,242,0.35), transparent 70%);
  bottom: -20%; right: -20%;
  animation-delay: -7s;
  animation-direction: alternate-reverse;
}
@keyframes aurora-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(10%, 10%) scale(1.15); }
}
```

---

## 16. 3D Effects CSS

### 3D Card Flip
```css
.card-3d-wrapper { perspective: 1000px; }
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}
.card-3d:hover { transform: rotateY(180deg); }
.card-3d__front, .card-3d__back {
  backface-visibility: hidden;
  position: absolute; inset: 0;
}
.card-3d__back { transform: rotateY(180deg); }
```

### CSS 3D Scene (carousel base)
```css
.scene {
  perspective: 1400px;
  perspective-origin: 50% 45%;
}
.ring {
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--radius) * -1)) rotateY(var(--angle, 0deg));
}
/* IMPORTANTE: não usar filter em filhos de preserve-3d (quebra no Chrome) */
/* Usar opacity para estados ativos/inativos */
```

### Tilt 3D Avançado (com perspectiva variável)
```javascript
document.querySelectorAll('[data-tilt-advanced]').forEach(card => {
  const maxTilt = parseFloat(card.dataset.tiltMax || 15);
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const x = (e.clientY - cy) / (r.height / 2) * -maxTilt;
    const y = (e.clientX - cx) / (r.width / 2) * maxTilt;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const perspective = 800 + dist;
    card.style.transform = `perspective(${perspective}px) rotateX(${x}deg) rotateY(${y}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.5)', clearProps: 'all' });
  });
});
```

---

## 17. GSAP Animations

### Stagger Reveal (entrada suave)
```javascript
gsap.from('.stagger-item', {
  opacity: 0, y: 40, scale: 0.97,
  duration: 0.7, ease: 'power3.out',
  stagger: { amount: 0.6, from: 'start' },
  scrollTrigger: { trigger: '.stagger-container', start: 'top 80%' }
});
```

### Counter Animado
```javascript
const obj = { value: 0 };
gsap.to(obj, {
  value: 10000,
  duration: 2.5,
  ease: 'power2.out',
  onUpdate: () => el.textContent = Math.round(obj.value).toLocaleString('pt-BR'),
  scrollTrigger: { trigger: el, start: 'top 90%', once: true }
});
```

### Linha SVG Draw
```javascript
const paths = document.querySelectorAll('[data-line]');
paths.forEach(p => {
  const len = p.getTotalLength();
  gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(p, {
    strokeDashoffset: 0, duration: 2, ease: 'power2.inOut',
    scrollTrigger: { trigger: p, start: 'top 90%' }
  });
});
```

### Split Text by Char
```javascript
function splitByChar(el) {
  const chars = el.textContent.split('');
  el.innerHTML = chars.map(c =>
    c === ' ' ? ' ' : `<span class="char inline-block">${c}</span>`
  ).join('');
  return el.querySelectorAll('.char');
}
const chars = splitByChar(document.querySelector('.split-heading'));
gsap.from(chars, {
  y: 60, opacity: 0, rotateX: -80,
  duration: 0.6, stagger: 0.03, ease: 'back.out(2)',
  scrollTrigger: { trigger: chars[0].parentElement, start: 'top 80%' }
});
```

---

## 18. Tailwind Patterns

### Tokens recomendados para projeto com `#ec268d` / `#7b3ff2`
```javascript
// tailwind.config.mjs
colors: {
  brand:  { 500: '#ec268d', 600: '#d41e7e' },
  violet2: { 500: '#7b3ff2', 600: '#6930da' },
  ink:    { 50: '#f0f1f8', 100: '#e1e3f0', 400: '#8b8fac', 800: '#1f2147', 900: '#0f1230' },
}
```

### Componentes Tailwind Prontos

```html
<!-- Badge pill -->
<span class="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 ring-1 ring-violet-500/20">
  ✨ Novo
</span>

<!-- Card com hover elevation -->
<div class="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-500/20">

<!-- Gradient heading -->
<h2 class="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">

<!-- Glass card (dark) -->
<div class="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">

<!-- Glow button -->
<button class="rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(236,38,141,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(236,38,141,0.6)]">

<!-- Skeleton -->
<div class="h-4 w-3/4 rounded bg-gray-200 animate-pulse">
```

---

## Referências Internas

- [css-effects-catalog.md](./references/css-effects-catalog.md) — Catálogo completo com 80+ snippets
- [gsap-cookbook.md](./references/gsap-cookbook.md) — Receitas GSAP para todos os cenários
- [tailwind-components.md](./references/tailwind-components.md) — Components prontos para Tailwind
- [animation-timing.md](./references/animation-timing.md) — Guia de timing e easing para animações naturais
