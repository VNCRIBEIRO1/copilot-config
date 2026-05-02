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


---

## 17. Dolly Zoom (Vertigo / Hitchcock)

### Como funciona (mecânica)
- Combinação de `perspective` decrescente + `scale` crescente sincronizadas no scroll → primeiro plano fica do mesmo tamanho enquanto o fundo "se aproxima ou se afasta", criando dilatação ótica.
- A "ilusão" funciona quando o sujeito principal mantém tamanho aparente constante e o ambiente colapsa ao redor.

### Stack canônico
- GSAP ScrollTrigger com `scrub: true` interpolando `perspective` e `scale` em direções opostas.
- Pode ser feito em CSS puro com `@scroll-timeline` (Chrome 115+).

### Refs Awwwards
- The Line Studio (homepage hero) — dolly em foto do fundador
- Igloo Inc (transição entre seções) — dolly invertido com depth
- Render (case studies)

---

## 18. Scramble Text (decode effect)

### Como funciona
- Cada caractere é embaralhado entre símbolos aleatórios (Latin / Katakana) num intervalo de ms até "travar" no caractere final.
- Stagger por índice cria efeito cascata da esquerda para a direita.

### Stack canônico
- GSAP Pro ScrambleTextPlugin
- Anime.js v4 anime.text() com onUpdate
- Vanilla: requestAnimationFrame com Math.random()

### Refs Awwwards
- Resn (loading screens)
- Active Theory V6 (project counters)
- Linear (status badges)

---

## 19. Kinetic Typography (text-on-path)

### Como funciona
- Texto renderizado dentro de `<textPath href="#curve">` num SVG, animando o `startOffset` ou rotacionando o `<g>` pai.
- Pode combinar com scroll-velocity para o texto serpentear conforme o scroll.

### Stack canônico
- SVG `<textPath>` puro
- GSAP ScrollTrigger animando startOffset
- Three.js TextGeometry + CurvePath para 3D

### Refs Awwwards
- AIM Kharkiv (manifesto pages)
- The Line Studio (about)
- Spatzek (project transitions)

---

## 20. Color Inversion Section (mix-blend-mode)

### Como funciona
- Cursor ou seção com `mix-blend-mode: difference` invertendo cor de tudo que está abaixo.
- Cria efeito "raio-x" sem precisar trocar paleta manualmente.

### Stack canônico
- CSS `mix-blend-mode: difference` no cursor ou no overlay
- Texto branco fica preto sobre fundo branco e vice-versa
- Combina com `backdrop-filter: invert(1)` em zonas específicas

### Refs Awwwards
- Bruno Simon Portfolio (cursor invert)
- Femme Type (gallery hover)
- Daybreak Studio (project covers)

---

## 21. Sticky Cards Stack (scroll-pinned)

### Como funciona
- Cada card é `position: sticky` com top incrementando por card.
- Conforme rola, novos cards "empilham" sobre os anteriores criando deck shuffle.
- Variant: combinar com scale decrescente para profundidade.

### Stack canônico
- CSS puro `position: sticky; top: calc(100px + var(--i) * 20px)`
- GSAP para enhancement (rotation/scale por card)

### Refs Awwwards
- Linear pricing — feature stack
- Vercel changelog — date stack
- Notion templates — card deck

---

## 22. Image Reveal on Hover (link image preview)

### Como funciona
- Lista de links; ao hover, imagem aparece próxima ao cursor com clip-path + escala.
- Pode usar grid de imagens pré-carregadas, mostrando uma por vez via opacity.

### Stack canônico
- GSAP gsap.to no mouseenter animando clip-path + scale
- Framer Motion AnimatePresence + key swap

### Refs Awwwards
- Studio Lumio (project list)
- Bennett & Clive (works index)
- Akaru (case studies)

---

## 23. Cursor Magnifier (zoom lens)

### Como funciona
- Círculo segue cursor exibindo versão ampliada (zoom 2-3x) da área embaixo via background-image + background-position calculado.
- Bordas suaves com mask radial.

### Stack canônico
- CSS background-position calc((mouseX/W) * -100%) calc((mouseY/H) * -100%)
- JS atualiza var custom no mousemove

### Refs Awwwards
- Cartier W&W (product images)
- Zara (lookbook)
- Apple compare (specs)

---

## 24. Split-flap Counter (mechanical numbers)

### Como funciona
- Cada dígito é uma "carta" que gira 180° revelando o próximo número.
- Aeroporto/estação de trem vibe.

### Stack canônico
- CSS transform rotateX com perspective + 3D backface
- Lib react-flip-numbers ou flapper.js

### Refs Awwwards
- Apple WWDC countdowns
- Stripe Sessions (event hero)
- Linear changelog stats

---

## 25. Pixel Reveal / 8-bit Loading

### Como funciona
- Grid de quadrados que iluminam aleatoriamente até preencher o conteúdo.
- Stagger random por delay individual em cada célula.
- IDENTIDADE PIXELCODE STUDIO

### Stack canônico
- CSS Grid + @keyframes com animation-delay calc(var(--i) * Xms)
- Canvas 2D para versão pesada com 1000+ pixels

### Refs Awwwards
- id-software glitch loaders
- Atari arcade tributes
- Pixelmator hero

---

## 26. Parallax Layers (multi-depth)

### Como funciona
- 3 a 7 camadas com velocidades diferentes movendo no scroll.
- Camadas distantes movem 0.2x, próximas 0.8x, frente 1x.

### Stack canônico
- CSS transform translateY calc(var(--scroll) * SPEED)
- Lenis + GSAP para suavização
- WebGL para parallax com depth map

### Refs Awwwards
- Firewatch (campo)
- Studio JQ (about)
- Igloo Inc (case)

---

## 27. Marquee Vertical Cilíndrico

### Como funciona
- Texto rola verticalmente em loop infinito mas dentro de um overflow hidden curvo.
- Combina com mask-image linear-gradient para fade nas bordas.

### Stack canônico
- CSS @keyframes translateY infinito
- mask-image linear-gradient(180deg, transparent, black 20%, black 80%, transparent)

### Refs Awwwards
- Notion AI page
- Vercel testimonials

---

## 28. Hero Video Mask Reveal

### Como funciona
- Vídeo de fundo escondido por clip-path que se abre na entrada.
- Texto sobreposto aparece com stagger por linha.

### Stack canônico
- CSS clip-path circle(0% at 50% 50%) → circle(150% at 50% 50%)
- HTML5 video autoplay muted loop

### Refs Awwwards
- Apple AirPods Pro
- Cartier journey

---

## 29. Glitch Text (RGB split)

### Como funciona
- Mesmo texto duplicado 2x com text-shadow rgb deslocado em @keyframes random.
- Variant: usa clip-path cortando faixas horizontais.

### Stack canônico
- CSS puro com @keyframes glitch deslocando text-shadow
- Lib glitch-text-css

### Refs Awwwards
- CyberPunk 2077 marketing
- Bruno Simon experiments

---

## 30. Liquid Marquee SVG (deformação fluida)

### Como funciona
- Marquee usa <feDisplacementMap> com noise animado, deformando o texto como líquido.
- Combinar com <feTurbulence> para wobble orgânico.

### Stack canônico
- SVG <filter> com feTurbulence + feDisplacementMap
- Animar baseFrequency em loop

### Refs Awwwards
- Awwwards SOTD frequente
- Bonhomme

---

## 31. Scroll-Snap Slideshow

### Como funciona
- Painéis full-screen com scroll-snap-type y mandatory.
- Cada painel "trava" no centro ao rolar.

### Stack canônico
- CSS scroll-snap-type + scroll-snap-align
- Suave com scroll-behavior smooth

### Refs Awwwards
- Apple iPad lineup
- Tesla product pages

---

## 32. 3D Tilt Card with Parallax Layers

### Como funciona
- Card em preserve-3d com 2-4 elementos filhos a depths diferentes (translateZ).
- Hover rotaciona pai → cada layer move com paralaxe natural.

### Stack canônico
- CSS transform-style preserve-3d no card pai
- JS calcula rotateX/Y do mouse, aplica no card pai
- Layers filhas com translateZ(20px), (40px), etc.

### Refs Awwwards
- Linear pricing cards
- Stripe Press
- Resn portfolio cards

---

## 33. Squiggle / Wavy Underline (animated)

### Como funciona
- SVG path serpenteado por baixo do link, animando stroke-dashoffset no hover.
- Path real, não pseudo-element.

### Stack canônico
- SVG inline path d="M0,5 Q50,0 100,5 T200,5"
- CSS stroke-dasharray + stroke-dashoffset animados

### Refs Awwwards
- Squarespace blog
- Stripe sub-pages

---

## 34. Card Fold/Unfold (origami)

### Como funciona
- Card aparece como folha dobrada, "desdobra" em 2-3 etapas no scroll.
- Cada dobra é rotateX(180deg) → 0 com transform-origin alternando.

### Stack canônico
- CSS @keyframes em sequência ou GSAP timeline
- preserve-3d obrigatório em todos pais

### Refs Awwwards
- Apple invitation pages
- Stripe Atlas welcome

---

## 35. Shape Morph Background (SVG path)

### Como funciona
- Blob SVG com path que muda d em loop infinito.
- Lib flubber ou anime.js v4 morphTo.

### Stack canônico
- Anime.js v4 createSpring + morphTo
- GSAP MorphSVG (Pro)
- Vanilla com d3-interpolate

### Refs Awwwards
- Stripe Connect (background blobs)
- Linear gradient backgrounds

---

## 36. Cursor Trail (particle dots)

### Como funciona
- Array de 20-50 pontos seguindo cursor com lerp incremental.
- Cada ponto tem opacity decrescente do head ao tail.

### Stack canônico
- requestAnimationFrame loop
- Canvas 2D ou divs absolutas
- Combinar com mix-blend-mode

### Refs Awwwards
- Bruno Simon (cursor)
- Femme Type

---

## 37. Hero Word Mask (word slides through hole)

### Como funciona
- Palavras hero entram por uma "fenda" (clip-path retangular fino) → expandem.
- Combina com escala leve.

### Stack canônico
- CSS clip-path inset(50% 0 50% 0) → inset(0)
- Stagger por palavra com animation-delay

### Refs Awwwards
- Daybreak Studio (hero)
- Active Theory V6

---

## 38. Scroll-driven Number Counter

### Como funciona
- Número de 0 → 180 anima em sync com scrollYProgress.
- IntersectionObserver dispara animação ao entrar na viewport.

### Stack canônico
- Framer Motion useTransform(scrollY, [0,1], [0, 180])
- requestAnimationFrame com easing

### Refs Awwwards
- Stripe stats
- Linear customer logos

---

## 39. Card Hover Image Stack (3D fan)

### Como funciona
- Card mostra apenas 1 imagem; no hover, abre como leque com 3-4 imagens em 3D.
- Cada imagem rotaciona Y com offset crescente.

### Stack canônico
- CSS preserve-3d
- Hover ativa .is-fanned aplicando transform rotateY(15deg) translateZ(20px) por imagem

### Refs Awwwards
- Apple product carousels
- Femme Type books

---

## 40. Audio Visualizer Bars (Web Audio API)

### Como funciona
- AnalyserNode getByteFrequencyData → array de N valores → N barras com altura dinâmica.
- Cada frame atualiza altura via CSS var.

### Stack canônico
- Web Audio API + AnalyserNode
- requestAnimationFrame
- Canvas 2D ou divs absolutas

### Refs Awwwards
- Slosh Seltzer
- DJ portfolio templates

---

## 41. Reveal por Letras (char stagger)

### Como funciona
- Cada char tem delay incremental + opacity 0 → 1, translateY 30 → 0.
- Pode combinar com rotateZ leve.

### Stack canônico
- GSAP SplitText
- CSS puro com pseudo nth-child delays
- Framer Motion variants com staggerChildren

### Refs Awwwards
- AIM Kharkiv
- The Line Studio

---

## 42. Image Comparison Slider

### Como funciona
- Duas imagens sobrepostas; slider divide visibilidade horizontal/vertical.
- Mouse drag move o split.

### Stack canônico
- CSS clip-path inset(0 X% 0 0) controlado por JS
- Lib react-compare-image

### Refs Awwwards
- Photo retouch portfolios
- Before/after case studies

---

## 43. Float Bubble Tooltip

### Como funciona
- Tooltip em formato de bolha com tail SVG, segue mouse com lag de 100ms.
- Aparece com bounce cubic-bezier elastic.

### Stack canônico
- Floating UI lib
- CSS bubble com ::after triangular

### Refs Awwwards
- Apple support pages
- Notion docs

---

## 44. Page Transition Wipe (curtain reveal)

### Como funciona
- Ao trocar rota, divs colored sobem cobrindo tela inteira → revelam nova página.
- Multi-curtain com staggered colors.

### Stack canônico
- Next.js View Transitions API
- Framer Motion AnimatePresence + variants

### Refs Awwwards
- Cartier journey
- Daybreak Studio

---

## 45. Sticky Word Highlight (reading line)

### Como funciona
- Cada palavra do parágrafo ganha highlight progressivo conforme scrolla, como ler com marca-texto.
- Cor cresce da esquerda para direita por linha.

### Stack canônico
- IntersectionObserver por palavra
- CSS background-image com background-size animado

### Refs Awwwards
- The New York Times features
- Apple iPhone story pages

---

## 46. Geometric Shape Loader

### Como funciona
- Forma geométrica (triângulo/hexágono) gira/escala com perspectiva enquanto carrega.
- 3D-ish com gradiente conic.

### Stack canônico
- CSS conic-gradient + @keyframes rotate
- SVG path com stroke-dashoffset

### Refs Awwwards
- Apple keynote loadings
- Linear app loaders

---

## 47. Magnetic Cursor Field (FX field)

### Como funciona
- Cursor distorce elementos próximos baseado em distância (campo magnético).
- Ímãs invisíveis em pontos da tela atraem o cursor.

### Stack canônico
- requestAnimationFrame calculando distância cursor ↔ alvo
- GSAP gsap.to com lerp

### Refs Awwwards
- Active Theory V6
- Resn experiments

---

## 48. Layered Text Stroke (outline text stack)

### Como funciona
- Mesma palavra repetida 5-7x com -webkit-text-stroke e cor transparente.
- Cada cópia desloca alguns px → sensação de profundidade tipográfica.

### Stack canônico
- CSS -webkit-text-stroke 1px var(--ink)
- color transparent
- Stack em position absolute

### Refs Awwwards
- Bonhomme
- AIM Kharkiv

---

## 49. SVG Stroke Drawing (handwriting)

### Como funciona
- SVG path com stroke-dasharray = pathLength e stroke-dashoffset = pathLength → anima offset para 0.
- Logo ou letra "se desenha" do começo ao fim.

### Stack canônico
- CSS @keyframes draw com stroke-dashoffset
- GSAP DrawSVG (Pro)

### Refs Awwwards
- Apple invitation logos
- Squarespace logo intros

---

## 50. Floating Object Idle Animation

### Como funciona
- Elemento "respira" com translateY infinito 4-6s ease-in-out.
- Combina com leve rotação em loop oposto.

### Stack canônico
- CSS @keyframes float 0%,100% translateY(0); 50% translateY(-20px)
- duração 5-7s

### Refs Awwwards
- Mascots em landings de SaaS
- Stripe illustrations

---

## 51. Card Border Beam (animated gradient border)

### Como funciona
- Border do card é gradiente cônico que rotaciona em loop (efeito mágico).
- Ao hover, velocidade aumenta 3-5x.

### Stack canônico
- CSS background conic-gradient + mask para deixar só border
- @property --angle animado para 360deg

### Refs Awwwards
- Vercel pricing cards
- Linear feature cards

---

## 52. Zoom Out Hero (start zoomed → unzoom)

### Como funciona
- Hero começa com scale(2) e cobre tela inteira; ao scrollar, dá zoom out revelando o site.
- Cinematic intro.

### Stack canônico
- GSAP ScrollTrigger scrub em scale 2 → 1
- CSS transform-origin 50% 50%

### Refs Awwwards
- Apple Vision Pro intro
- Cartier journey

---

## 53. Modal Glass Slide In

### Como funciona
- Modal entra deslizando com glassmorphism + clip-path radial expansão a partir do botão clicado.
- Origin point fica nas coords do click.

### Stack canônico
- CSS clip-path circle(0 at X Y) → circle(150% at X Y)
- backdrop-filter blur

### Refs Awwwards
- Apple toggles
- Linear command palette

---

## 54. Diagonal Section Divider (skew)

### Como funciona
- Seção tem clip-path angulado (não retangular), criando transições diagonais entre cores.
- Combina com parallax leve do conteúdo interno.

### Stack canônico
- CSS clip-path polygon(0 5%, 100% 0, 100% 95%, 0 100%)

### Refs Awwwards
- Stripe Atlas
- Vercel landing

---

## 55. Hover Card Tilt + Image Zoom Combo

### Como funciona
- Tilt 3D + imagem interna escala 1.1x no hover + spotlight gradient seguindo cursor.
- Triple effect synchronized.

### Stack canônico
- Vanilla JS handlers (não React state — performance)
- CSS transform rotateX rotateY + scale na child img

### Refs Awwwards
- Linear pricing
- Vercel changelog

---

## 56. Hero Sphere/Ring (Three.js orbit)

### Como funciona
- Esfera 3D com pontos orbitando, paleta de cores cycling.
- Mouse gira a câmera levemente (drag à la Bruno Simon).

### Stack canônico
- @react-three/fiber + drei
- OrbitControls com damping
- InstancedMesh para pontos

### Refs Awwwards
- Vercel hero
- Anthropic Claude landing

---

## 57. Reveal Word-by-word com Easing Stagger Custom

### Como funciona
- Cada palavra entra com delay calculado por função custom (não linear), ex: delay = i * 0.05 + Math.sin(i) * 0.1.
- Cria fluxo orgânico vs mecânico do stagger linear.

### Stack canônico
- Framer Motion variants com when beforeChildren
- Custom delay por index

### Refs Awwwards
- Anthropic essays
- Stripe Press

---

## 58. Color Wash Section (gradient overlay on scroll)

### Como funciona
- Seção tem overlay gradient que muda hue conforme scroll position.
- Background muda de humor ao rolar.

### Stack canônico
- GSAP ScrollTrigger animando background com gradient
- CSS @property --hue para interpolação

### Refs Awwwards
- Linear (homepage)
- Stripe Connect

---

## 59. Type Mask Image (texto recortado de imagem)

### Como funciona
- Texto enorme com background-image clipado em -webkit-background-clip text.
- Imagem se move dentro do texto com parallax no scroll.

### Stack canônico
- CSS background-clip text; color transparent
- background-position animado por scroll

### Refs Awwwards
- Femme Type
- The Line Studio

---

## 60. Reveal Cards Falling (gravity stagger)

### Como funciona
- Cards entram com translateY(-100vh) → 0 (caem do topo).
- Cada card tem rotation random de -8 a 8 deg.
- Bounce com spring ease.

### Stack canônico
- Framer Motion spring com bounce 0.5
- Stagger 100ms entre cards

### Refs Awwwards
- Vercel deploy cards
- Notion templates gallery

---

## 61. Section Pin Scrub (Lusion-style)

### Como funciona
- Seção fica pinada (sticky) por X scroll height, conteúdo dentro anima em scrub.
- Página fica parada, conteúdo conta a história.

### Stack canônico
- GSAP ScrollTrigger pin true scrub 1 end +=2000
- Lenis smooth scroll

### Refs Awwwards
- Lusion v3 (manifesto)
- Cartier journey

---

## 62. Hover Card Open (recipe-style)

### Como funciona
- Card colapsado mostra título; hover abre área inferior revelando descrição + CTA.
- Transição via max-height ou grid-template-rows 0fr → 1fr.

### Stack canônico
- CSS grid-template-rows transition (técnica moderna)
- max-height fallback

### Refs Awwwards
- Linear features
- Apple compare

---

## 63. Logo Marquee Infinite (clients band)

### Como funciona
- Logos em linha horizontal com marquee infinito, paleta dessaturada → hover satura.
- Combinar com mask-image linear para fade nas pontas.

### Stack canônico
- CSS marquee @keyframes linear infinite
- mask-image gradient

### Refs Awwwards
- Stripe customers
- Vercel testimonials band

---

## 64. Cinematic Cursor Light (spot follow)

### Como funciona
- Cursor é um holofote: gradient radial branco que ilumina elementos abaixo via mix-blend-mode overlay.
- Resto da página fica escurecido.

### Stack canônico
- Div fixed full-screen com background dark
- Pseudo ::before com radial-gradient na posição do cursor
- mix-blend-mode multiply ou screen

### Refs Awwwards
- Anthropic dark theme
- Linear changelog dark

---

## 65. WebGL Image Reveal (RGB shift)

### Como funciona
- Shader fragment com canais R/G/B deslocados por px diferentes; ao hover, deslocamento converge.
- Glitch saudável tipográfico.

### Stack canônico
- @react-three/fiber + custom shader
- ogl-three lib lightweight

### Refs Awwwards
- Resn
- Lusion experiments

---

## 66. Fluid Cursor Shader (WebGL)

### Como funciona
- Shader fluido onde o cursor espalha tinta como Photoshop liquify.
- Decay temporal devolve fluido ao estado plano.

### Stack canônico
- WebGL shader pavelDoGreat/WebGL-Fluid-Simulation
- ogl-three

### Refs Awwwards
- Active Theory V6
- Resn

---

## Como combinar (presets para projetos completos)

### Preset Awwwards SOTD
1, 3, 4, 7, 9, 10, 11, 14, 17, 25, 32, 41, 51, 64

### Preset SaaS Premium (Linear-tier)
3, 4, 10, 11, 25, 32, 38, 51, 56, 58, 62, 63

### Preset Studio Criativo
1, 2, 12, 15, 17, 19, 22, 25, 30, 35, 40, 65, 66

### Preset E-commerce Cinematográfico
3, 4, 5, 6, 23, 28, 31, 39, 42, 52, 53, 55

### Preset Editorial / Tipográfico
7, 14, 18, 19, 27, 29, 41, 45, 48, 57, 59

### Preset Performance-first (lighthouse 95+)
3, 5, 11, 14, 25, 31, 38, 50, 51, 63

