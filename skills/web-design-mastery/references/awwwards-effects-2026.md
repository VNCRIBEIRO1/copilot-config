# Awwwards SOTD Effect Library 2026

Catálogo curado de efeitos vencedores no Awwwards (SOTM/SOTD/SOTY 2024-2026), com mecânica detalhada, código pronto e variações.

> Sites referenciados: Bruno Simon Portfolio, Lusion v3, Active Theory V6, Resn (Tracing Art, Sculpting Harmony, Zentry, Navigate), Immersive Garden (Cartier, Montfort, David Whyte), Akaru, Obys (AIM Modernism), Merci Michel (Cartier Journey), Anime.js by Julian Garnier, OFF+BRAND (Lando Norris), Daybreak Studio (Dropbox Brand), Spatzek Studio, abeto (Igloo Inc), Studio 28K, Patrick Heng, Aristide Benoist.

---

## 1. Image Trail (cursor-following images)

**Onde foi visto:** OFF+BRAND, Active Theory V6, muitos portfólios de studios.

**Mecânica:** uma sequência de `<img>` segue o cursor com delay decrescente; cada imagem aparece quando o cursor se move uma distância mínima (`threshold`), depois desaparece após N ms.

```javascript
class ImageTrail {
  constructor(images) {
    this.images = images.map(src => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'trail-img';
      document.body.appendChild(img);
      return img;
    });
    this.lastX = 0;
    this.lastY = 0;
    this.index = 0;
    this.threshold = 60;       // pixels min para spawn
    this.lifetime = 600;       // ms até fade out

    window.addEventListener('pointermove', e => this.onMove(e));
  }

  onMove(e) {
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    if (Math.hypot(dx, dy) < this.threshold) return;

    const img = this.images[this.index % this.images.length];
    this.index++;

    gsap.set(img, {
      x: e.clientX, y: e.clientY,
      xPercent: -50, yPercent: -50,
      opacity: 1, scale: 0.8,
      rotate: gsap.utils.random(-15, 15),
    });
    gsap.to(img, {
      scale: 1, duration: 0.4, ease: 'power3.out',
    });
    gsap.to(img, {
      opacity: 0, scale: 1.2,
      duration: this.lifetime / 1000,
      ease: 'power2.in',
      delay: 0.2,
    });

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
}

// CSS: .trail-img { position:fixed; pointer-events:none; width:240px; opacity:0; z-index:50; }
```

**Variações:**
- **Stack mode** (Lusion v3): sem fade, apenas rotação acumulada formando uma pilha
- **Distortion mode** (Resn): cada imagem com WebGL displacement map ondulando
- **Caption mode** (OFF+BRAND): cada imagem tem caption que aparece em hover
- **Wheel mode**: o trail responde também ao scroll wheel, não só mouse

---

## 2. Distortion / Liquid Hover sobre Imagens (WebGL)

**Onde foi visto:** Resn (Tracing Art), Lusion v3, Cartier Watches & Wonders.

**Mecânica:** plano Three.js com shader de displacement; mouse position passa como `uniform`; o fragment shader perturba UVs com base na distância ao cursor + noise.

```javascript
// Three.js + custom GLSL shader
import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(2, 2.5, 32, 32);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture:  { value: new THREE.TextureLoader().load('/img.jpg') },
    uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
    uTime:     { value: 0 },
    uHover:    { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uHover;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float dist = distance(uv, uMouse);
      pos.z += sin(dist * 8.0) * 0.2 * uHover * exp(-dist * 3.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform float uHover;
    void main() {
      vec2 uv = vUv;
      vec2 dir = uv - uMouse;
      float dist = length(dir);
      uv += normalize(dir) * 0.04 * uHover * exp(-dist * 4.0);
      gl_FragColor = texture2D(uTexture, uv);
    }
  `,
});

// Hover: gsap.to(material.uniforms.uHover, { value: 1, duration: 0.6 });
```

**Variações:**
- **Mesh distortion clássico** (curl noise no vertex)
- **Liquid metal** (refraction com normal map)
- **Glitch slice** (fragment shader com bandas de RGB shift)
- **Aberração cromática** em hover (offset RGB no fragment)

---

## 3. Custom Cursor com Estados Contextuais

**Onde foi visto:** Active Theory V6, Resn (todos), Immersive Garden, OFF+BRAND.

**Mecânica:** dois divs (dot + ring); o ring tem `lerp` mais lento que o dot; em hover sobre `[data-cursor]` o ring escala/muda cor/recebe label.

```javascript
const cursor = {
  dot:  document.querySelector('.cursor-dot'),
  ring: document.querySelector('.cursor-ring'),
  x: 0, y: 0,
  rx: 0, ry: 0,
};

window.addEventListener('pointermove', e => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  gsap.set(cursor.dot, { x: cursor.x, y: cursor.y });
});

gsap.ticker.add(() => {
  cursor.rx += (cursor.x - cursor.rx) * 0.18;  // lerp
  cursor.ry += (cursor.y - cursor.ry) * 0.18;
  gsap.set(cursor.ring, { x: cursor.rx, y: cursor.ry });
});

// Estados contextuais
document.querySelectorAll('[data-cursor]').forEach(el => {
  const state = el.dataset.cursor;  // "view", "drag", "play", "next"
  el.addEventListener('mouseenter', () => {
    cursor.ring.dataset.state = state;
    if (el.dataset.cursorLabel) {
      cursor.ring.textContent = el.dataset.cursorLabel;
    }
  });
  el.addEventListener('mouseleave', () => {
    cursor.ring.dataset.state = '';
    cursor.ring.textContent = '';
  });
});
```

```css
.cursor-dot {
  position:fixed; top:0; left:0; width:6px; height:6px;
  background:#fff; border-radius:50%;
  pointer-events:none; z-index:9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
}
.cursor-ring {
  position:fixed; top:0; left:0; width:40px; height:40px;
  border:1px solid #fff; border-radius:50%;
  pointer-events:none; z-index:9998;
  transform: translate(-50%, -50%);
  transition: width .35s, height .35s, background .35s;
  mix-blend-mode: difference;
  display:flex; align-items:center; justify-content:center;
  font-size: 11px; color:#000; text-transform:uppercase; letter-spacing:.1em;
}
.cursor-ring[data-state="view"]  { width:100px; height:100px; background:#fff; }
.cursor-ring[data-state="drag"]  { width:80px;  height:80px;  background:#ec268d; }
.cursor-ring[data-state="play"]  { width:90px;  height:90px;  background:#7b3ff2; }
```

**Variações:**
- **Trail particle cursor** (Studio 28K Kriss.ai): canvas com partículas seguindo
- **Magnetic cursor** (cursor cola em botões — combinar com seção 4)
- **Inverted glyph** (mix-blend-mode: difference + caractere muda por contexto)
- **Audio cursor** (toca click sound on enter, varia pitch)

---

## 4. Magnetic Buttons (cursor pull + button push)

**Onde foi visto:** Akaru, Obys, Spatzek Studio, infinitos portfólios.

**Mecânica:** dentro de raio `R`, botão é puxado em direção ao cursor com força proporcional `(1 - dist/R)`; ao sair, retorna com elastic ease.

```javascript
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  const strength = +btn.dataset.magnetic || 0.4;
  const radius = +btn.dataset.magneticRadius || 120;
  const inner = btn.querySelector('.btn-inner') || btn;

  btn.addEventListener('pointermove', e => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(btn, { x: dx * strength, y: dy * strength,
                   duration: 0.6, ease: 'power3.out' });
    gsap.to(inner, { x: dx * strength * 0.4, y: dy * strength * 0.4,
                     duration: 0.6, ease: 'power3.out' });
  });

  btn.addEventListener('pointerleave', () => {
    gsap.to(btn,   { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
    gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
  });
});
```

**Variações:**
- **Circle reveal** (Patrick Heng): hover gera círculo com cor sólida que cresce do ponto do cursor
- **Word swap** (label muda em hover com slide vertical)
- **Border distortion** (svg path morphs em hover)

---

## 5. Marquee com Skew On Scroll

**Onde foi visto:** Bennett & Clive, OFF+BRAND, Inkfish, Active Theory.

**Mecânica:** marquee horizontal infinito; ao scrollar, skew-Y proporcional à velocidade de scroll; ao parar, retorna a 0.

```javascript
const marquee = document.querySelector('.marquee-track');
let scrollVelocity = 0;
let lastScroll = 0;

ScrollTrigger.create({
  trigger: '.marquee-section',
  start: 'top bottom', end: 'bottom top',
  onUpdate: self => {
    scrollVelocity = self.getVelocity() * 0.001;
  }
});

gsap.ticker.add(() => {
  scrollVelocity *= 0.92; // damping
  const skew = gsap.utils.clamp(-15, 15, scrollVelocity * 8);
  gsap.set(marquee, { skewY: skew });
});

// Loop infinito
gsap.to(marquee, {
  xPercent: -50,
  duration: 30,
  ease: 'none',
  repeat: -1,
});
```

**Variações:**
- **Direção responde ao scroll** (rola para esquerda ao scroll-down, direita ao scroll-up)
- **Scale pulse** ao mudar direção
- **Texto + imagens intercalados** (Akaru style)

---

## 6. Section Reveal por Slice / Curtain

**Onde foi visto:** Cartier Watches & Wonders 2025, The Renaissance Edition, Montfort.

**Mecânica:** cobre seção com N painéis verticais (`<div>` com cor sólida); ao entrar viewport, sobem em sequência stagger com `clip-path` ou translateY de 100% → -100%.

```javascript
function curtainReveal(section, panelCount = 8) {
  // criar painéis
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  for (let i = 0; i < panelCount; i++) {
    const panel = document.createElement('div');
    panel.className = 'curtain-panel';
    curtain.appendChild(panel);
  }
  section.appendChild(curtain);

  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    onEnter: () => {
      gsap.to('.curtain-panel', {
        yPercent: -100,
        duration: 1.2,
        stagger: { amount: 0.5, from: 'start' },
        ease: 'power4.inOut',
      });
    },
    once: true,
  });
}
```

```css
.curtain { position:absolute; inset:0; display:flex; pointer-events:none; z-index:5; }
.curtain-panel { flex:1; background:#0f1230; }
```

**Variações:**
- **Diagonal slice** com `clip-path: polygon()` em diagonal
- **Mesh reveal** (grid 4×4 de painéis com stagger random)
- **Color pull-through** (painéis revelam imagem por trás em fases de cor)

---

## 7. Scroll-driven Text Distortion (variable font wght + skew)

**Onde foi visto:** AIM Kharkiv (Obys), Anime.js, Onnu Jonu Son.

**Mecânica:** velocidade de scroll → `font-variation-settings` (peso) + `skewX`; em scroll lento, peso normal; em scroll rápido, peso pesado + skew.

```javascript
const elements = gsap.utils.toArray('[data-velocity-text]');
let velocity = 0;

ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: self => { velocity = self.getVelocity() * 0.0008; },
});

gsap.ticker.add(() => {
  velocity *= 0.9;
  const wght = gsap.utils.clamp(200, 900, 500 + Math.abs(velocity) * 200);
  const skew = gsap.utils.clamp(-12, 12, velocity * 4);
  elements.forEach(el => {
    el.style.fontVariationSettings = `"wght" ${wght}`;
    el.style.transform = `skewX(${skew}deg)`;
  });
});
```

**Pré-requisito:** fonte variável com eixo `wght` e amplo range (Inter, Roboto Flex, Recursive, Geist, Object Sans).

**Variações:**
- **Width axis** (`wdth`) ao invés de peso (Roboto Flex tem)
- **Slant axis** (`slnt`) para itálico dinâmico
- **Combo wght + opsz** (optical size)

---

## 8. Sticky Hero com Scrub Scrub Scrub (3D scene scrolling)

**Onde foi visto:** Lusion v3, Cartier Journey, Sculpting Harmony, Zentry.

**Mecânica:** seção `min-h: 400vh` com canvas Three.js dentro de `position: sticky; top: 0; height: 100vh`; ScrollTrigger com `scrub` controla camera position, model rotation, light intensity.

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.scroll-scene',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});

tl.to(camera.position,    { z: 2, duration: 1 }, 0)
  .to(camera.position,    { z: -1, duration: 1 }, 1)
  .to(model.rotation,     { y: Math.PI * 2, duration: 2 }, 0)
  .to(directionalLight,   { intensity: 3, duration: 1 }, 0.5);
```

**Performance crítica:**
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`
- Pausar render quando seção fora da viewport (IntersectionObserver)
- Use `frustumCulled = false` apenas se necessário

**Variações:**
- **Model swap** (3+ modelos GLB trocados em pontos do scroll)
- **Material morph** (mesh material muda de PBR → wireframe → toon)
- **Particle emission** ligada/desligada por sections

---

## 9. Page Transition Cinemática (FLIP + curtain + clip-path)

**Onde foi visto:** Active Theory V6, Daybreak (Dropbox Brand), Watson, abeto (Igloo Inc).

**Mecânica:** ao clicar `<a>`, anima curtain (seção 6) cobrindo a tela; durante cobertura, navega; após nova página, curtain sai; **bonus**: shared elements (FLIP) animam entre páginas.

```javascript
// Astro 5+ View Transitions API + custom CSS
@view-transition { navigation: auto; }

::view-transition-old(root),
::view-transition-new(root) {
  animation: none; /* customize abaixo */
}

::view-transition-old(root) {
  animation: 0.5s cubic-bezier(0.7,0,0.3,1) both curtain-out;
}
::view-transition-new(root) {
  animation: 0.6s cubic-bezier(0.7,0,0.3,1) 0.3s both curtain-in;
}

@keyframes curtain-out {
  from { clip-path: inset(0 0 0 0); }
  to   { clip-path: inset(0 0 100% 0); }
}
@keyframes curtain-in {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}

/* Shared element FLIP nativo */
.hero-image { view-transition-name: hero-image; }
```

```javascript
// GSAP FLIP fallback (browsers sem View Transitions)
const state = Flip.getState('.hero-image');
// after navigation
Flip.from(state, { duration: 0.6, ease: 'power3.inOut' });
```

**Variações:**
- **Slice horizontal** (clip-path inset top + bottom)
- **Liquid morph** (SVG path morph entre keyframes)
- **Mask reveal com noise** (PNG mask animada)

---

## 10. Bento Grid com Hover Spotlight + Tilt + Beam

**Onde foi visto:** Linear, Vercel, Kriss.ai (Studio 28K), Terminal Industries.

**Mecânica:** grid CSS irregular (auto-fit + spans variados); cada card combina 3 efeitos: spotlight gradient seguindo cursor, tilt 3D leve, beam (linha luminosa percorrendo borda em hover).

```css
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 200px;
  gap: 16px;
}
.bento > .card-1 { grid-column: span 6; grid-row: span 2; }
.bento > .card-2 { grid-column: span 3; }
.bento > .card-3 { grid-column: span 3; grid-row: span 2; }

.bento-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  transform-style: preserve-3d;
  transition: transform .4s ease;
}

/* Spotlight */
.bento-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(236,38,141,0.15), transparent 40%
  );
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}
.bento-card:hover::before { opacity: 1; }

/* Beam border */
.bento-card::after {
  content: '';
  position: absolute; inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--angle, 0deg),
    transparent 270deg,
    #ec268d 300deg,
    #7b3ff2 330deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0;
  transition: opacity .3s;
}
.bento-card:hover::after { opacity: 1; animation: beam-rotate 2s linear infinite; }

@property --angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes beam-rotate { to { --angle: 360deg; } }
```

```javascript
// Mouse tracking + tilt
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    const rx = (y / r.height - 0.5) * -8;
    const ry = (x / r.width  - 0.5) *  8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});
```

---

## 11. Aurora / Mesh Gradient Animado (CSS-only)

**Onde foi visto:** Linear (clássico), Anthropic, Vercel, Stripe.

**Mecânica:** múltiplas radial-gradients translúcidas em camadas, cada uma animada com `transform` + `filter: blur` enorme.

```css
.aurora {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.aurora::before, .aurora::after {
  content: '';
  position: absolute;
  width: 60vw; height: 60vw;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.55;
  z-index: -1;
  animation: aurora-drift 18s ease-in-out infinite alternate;
}
.aurora::before {
  background: radial-gradient(circle, #ec268d, transparent 70%);
  top: -20%; left: -10%;
}
.aurora::after {
  background: radial-gradient(circle, #7b3ff2, transparent 70%);
  bottom: -20%; right: -10%;
  animation-delay: -9s;
}

@keyframes aurora-drift {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(20%, 10%) scale(1.2); }
  100% { transform: translate(-10%, 20%) scale(0.9); }
}
```

**Variações WebGL** (mais smooth, audio-reactive):
- `react-three-fiber` + `@react-three/drei` `<MeshDistortMaterial>`
- `shadertoy` aurora shader port (perlin/simplex noise)

---

## 12. Audio-reactive Hero (opcional, muito Awwwards)

**Onde foi visto:** Slosh Seltzer, Ponpon Mania, Bruno Simon.

**Mecânica:** Web Audio API → `AnalyserNode.getByteFrequencyData()` → uniform no shader controla scale/intensity de visual (3D mesh, bars, particle system).

```javascript
const audio = new Audio('/track.mp3');
const ctx = new AudioContext();
const src = ctx.createMediaElementSource(audio);
const analyser = ctx.createAnalyser();
analyser.fftSize = 128;
src.connect(analyser).connect(ctx.destination);

const data = new Uint8Array(analyser.frequencyBinCount);

gsap.ticker.add(() => {
  analyser.getByteFrequencyData(data);
  const bass = data.slice(0, 8).reduce((a,b) => a+b, 0) / 8 / 255;
  const treble = data.slice(48, 64).reduce((a,b) => a+b, 0) / 16 / 255;
  // map to visuals
  visualMesh.scale.setScalar(1 + bass * 0.4);
  visualMesh.material.uniforms.uTreble.value = treble;
});
```

⚠️ **UX:** sempre exigir interação do usuário antes de tocar áudio (autoplay policies). Botão "Sound on/off" sempre visível.

---

## 13. Scroll-velocity-driven Image Stretch

**Onde foi visto:** Daybreak Studio, Watson, Inkfish.

**Mecânica:** velocidade do scroll → `scaleY` da imagem (stretch vertical no scroll-down, stretch horizontal no scroll-up).

```javascript
let prev = 0;
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: self => {
    const v = self.getVelocity() * 0.0006;
    gsap.to('.stretch-img', {
      scaleY: 1 + Math.abs(v) * 0.15,
      scaleX: 1 - Math.abs(v) * 0.05,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: true,
    });
  }
});
```

---

## 14. Text Reveal por Linha com Mask Animada (clip-path travel)

**Onde foi visto:** AIM Kharkiv, The Line Studio, Tracing Art.

**Mecânica:** SplitText em lines + cada linha tem wrapper com `clip-path: inset(0 100% 0 0)` que anima para `inset(0 0 0 0)` em sequência stagger.

```javascript
const split = new SplitText('h1', { type: 'lines' });
split.lines.forEach(line => {
  line.style.clipPath = 'inset(0 100% 0 0)';
});
gsap.to(split.lines, {
  clipPath: 'inset(0 0% 0 0)',
  duration: 1.2,
  stagger: 0.12,
  ease: 'power4.inOut',
  scrollTrigger: { trigger: 'h1', start: 'top 80%' },
});
```

**Variações:**
- **Wipe direction muda por linha** (par: left→right, ímpar: right→left)
- **Mask noise** (PNG mask animada)
- **Ink bleed** (clip-path com path SVG complexo)

---

## 15. Three.js Geometry Morph no Scroll

**Onde foi visto:** Igloo Inc (abeto), Lusion v3, Resn (Navigate).

**Mecânica:** dois `BufferGeometry` (mesh A, mesh B) → custom shader interpola positions usando uniform `uMix`. ScrollTrigger controla `uMix` de 0 → 1.

Trecho-chave do vertex shader:
```glsl
attribute vec3 positionTarget;
uniform float uMix;
void main() {
  vec3 pos = mix(position, positionTarget, smoothstep(0.0, 1.0, uMix));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

```javascript
gsap.to(material.uniforms.uMix, {
  value: 1,
  scrollTrigger: { trigger: '.morph-section', scrub: 1.5, start: 'top top', end: 'bottom bottom' }
});
```

---

## 16. SVG Path Morph (logo / shape transitions)

**Onde foi visto:** Anime.js, Akaru, Spatzek.

**Bibliotecas:** GSAP MorphSVGPlugin (Club, pago) **OU** anime.js v4 (open-source, gratuito).

```javascript
// Anime.js v4 (gratuito, leve, SVG morph nativo)
import { animate } from 'animejs';

animate('#shape', {
  d: { to: 'M50,10 L90,90 L10,90 Z' },  // de circle para triangle
  duration: 1200,
  easing: 'easeInOutQuart',
  loop: true,
  alternate: true,
});
```

---

## Lições gerais dos vencedores

| Princípio | Como aplicar |
|-----------|--------------|
| **Loading não é tempo morto** | Use o loading screen como animation hero (Active Theory, Lusion) |
| **Micro-interações em tudo** | Cada hover/click tem feedback visual (escala, cor, sound, particle) |
| **Mix-blend-mode é arma poderosa** | Cursor com `difference` funciona em fundo claro E escuro automaticamente |
| **Performance > Efeitos** | 60fps é não-negociável. Profile com DevTools Performance + Lighthouse |
| **Reduced motion respeitado** | Sempre fallback elegante para `prefers-reduced-motion: reduce` |
| **Transições conectam páginas** | View Transitions API + shared elements (não navegação tradicional) |
| **Tipografia = identidade** | Variable fonts + custom kerning > 50% do impacto visual |
| **Áudio é diferenciação** | Mesmo subtle UI sounds elevam percepção de qualidade (sempre opt-out) |
| **Detalhes obsessivos vencem** | Padding interno do botão, easing exato, color stops do gradient |
| **3D não é obrigatório** | Lusion usa muito; Anthropic, Linear, Stripe quase nada — ambos são SOTD |

---

## Stack recomendado por tipo de projeto

| Projeto | Stack |
|---------|-------|
| Portfolio / agência criativa | Next.js + R3F + GSAP + Lenis + custom shaders |
| SaaS / produto B2B | Next.js + Framer Motion + Tailwind + CSS-only effects |
| E-commerce premium | Next.js + GSAP + Lenis + WebGL hero + ProductImageZoom |
| Editorial / content | Astro + GSAP + SplitText + View Transitions |
| Landing page rápida | Astro + Tailwind + minimal GSAP + CSS animations |

---

## Referências e estudos para clonar

| Site | Estude |
|------|--------|
| brunosimon.me | Three.js Journey full project (carro físico, 3D portfolio) |
| lusion.co | Custom shaders, scroll-driven WebGL |
| activetheory.net | Loading screens, page transitions |
| resn.co.nz | WebGL distortion, audio reactive |
| immersive-g.com | Premium scroll storytelling, character animation |
| anime.js (Julian Garnier) | SVG morph, timeline mastery |
| codrops/tympanus.net | Tutoriais step-by-step de TODOS os efeitos acima |
| three.js journey | Curso definitivo (Bruno Simon) |

---

## Plugins / libs canônicos 2026

- **GSAP 3.12+** (todos plugins free agora) — animações
- **Lenis** — smooth scroll
- **R3F + drei + leva** — Three.js declarativo
- **anime.js v4** — alternativa gratuita ao GSAP MorphSVG
- **motion.dev** (ex-Framer Motion) — React animation
- **VanillaTilt** — tilt 3D leve
- **Splitting.js** — alternativa ao SplitText (gratuita)
- **Hover.css** — quick hover effects
- **lottie-web** — animações After Effects
- **TheatreJS** — animation editor visual
