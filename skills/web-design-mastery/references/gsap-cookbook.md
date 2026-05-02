# GSAP Cookbook — ScrollTrigger · Observer · SplitText

Receitas completas e prontas para produção. Cobre setup, SplitText, Observer e padrões avançados de ScrollTrigger para scroll-driven motion e tipografia animada.

> **Versão de referência:** GSAP 3.12+ (npm `gsap@^3.12`).
> A partir da 3.12, **SplitText, Observer, Flip, DrawSVG** são **gratuitos** (antes exigiam GSAP Club).
> ScrollTrigger sempre foi gratuito.

---

## 1. Setup — `registerPlugin`

Registrar cada plugin uma vez antes de usar. Sem isso os plugins não funcionam.

```javascript
// setup.js — importar e registrar no entry point da aplicação
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer }       from 'gsap/Observer';
import { SplitText }      from 'gsap/SplitText';
import { Flip }           from 'gsap/Flip';
import { DrawSVGPlugin }  from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'; // Club (pago)
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'; // Club

gsap.registerPlugin(
  ScrollTrigger,
  Observer,
  SplitText,
  Flip,
  DrawSVGPlugin,
  // MorphSVGPlugin,
  // ScrambleTextPlugin,
);
```

### Astro / SSR — evitar erros de hydration

```javascript
// Só registrar no cliente
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { SplitText }     from 'gsap/dist/SplitText';
import { Observer }      from 'gsap/dist/Observer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, Observer);
}
```

### Sincronizar com Lenis (smooth scroll obrigatório se usar Lenis)

```javascript
import Lenis from 'lenis';

const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1.05 });

// Conecta Lenis → ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);  // evita lag-smoothing do GSAP conflitar com Lenis
```

---

## 2. SplitText — Tipografia Animada

### O que faz

`SplitText` divide um elemento de texto em `<div>`/`<span>` individuais por **linhas**, **palavras** ou **chars**. Cada fragmento vira um elemento animável.

```javascript
const split = new SplitText('.headline', {
  type: 'lines,words,chars',  // quais dividir
  linesClass: 'split-line',
  wordsClass: 'split-word',
  charsClass: 'split-char',
});

// split.lines  → array de <div> para cada linha
// split.words  → array de <div> para cada palavra
// split.chars  → array de <div> para cada caractere

// Reverter (restaura HTML original)
split.revert();
```

### Padrão: reveal por linha com mask (clássico Awwwards)

```javascript
const split = new SplitText('h1', { type: 'lines', linesClass: 'line-inner' });

// Wrap externo com overflow:hidden para o efeito mask
gsap.set(split.lines, {
  overflow: 'hidden',
  display: 'block',
});

gsap.from(split.lines, {
  yPercent: 110,
  duration: 0.85,
  stagger: 0.08,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: 'h1',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});
```

### Padrão: char-by-char com rotação 3D

```javascript
const split = new SplitText('.kinetic', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 60,
  rotateX: -80,
  transformOrigin: '50% 100%',
  duration: 0.6,
  stagger: 0.025,
  ease: 'back.out(2)',
  scrollTrigger: { trigger: '.kinetic', start: 'top 80%' },
});
```

### Padrão: word-by-word blur reveal

```javascript
const split = new SplitText('.subheading', { type: 'words' });

gsap.from(split.words, {
  opacity: 0,
  filter: 'blur(12px)',
  y: 20,
  duration: 0.7,
  stagger: { amount: 0.5 },
  ease: 'power3.out',
  scrollTrigger: { trigger: '.subheading', start: 'top 85%' },
});
// Nota: filter em elementos inline pode ser pesado em listas longas.
// Para parágrafos, preferir só opacity+y.
```

### Padrão: variable font wght animado por char (avançado)

```javascript
// Funciona com fontes variáveis que têm eixo 'wght'
const split = new SplitText('.var-font', { type: 'chars' });

gsap.from(split.chars, {
  fontVariationSettings: '"wght" 100',
  opacity: 0,
  duration: 0.9,
  stagger: { amount: 0.6, from: 'random' },
  ease: 'power2.out',
  scrollTrigger: { trigger: '.var-font', start: 'top 80%' },
});
```

### Padrão: scramble text (requer ScrambleTextPlugin Club)

```javascript
gsap.to('.scramble', {
  scrambleText: {
    text: 'PIXEL CODE STUDIO',
    chars: 'upperCase',
    revealDelay: 0.3,
    speed: 0.5,
  },
  duration: 1.4,
  ease: 'none',
  scrollTrigger: { trigger: '.scramble', start: 'top 80%' },
});
```

### Alternativa vanilla (sem SplitText, sem dependência)

```javascript
function splitChars(el) {
  const html = [...el.textContent].map(c =>
    c === ' ' ? '<span aria-hidden="true"> </span>'
              : `<span class="ch" style="display:inline-block">${c}</span>`
  ).join('');
  el.innerHTML = html;
  el.setAttribute('aria-label', el.dataset.text || el.textContent);
  return el.querySelectorAll('.ch');
}
```

> **Acessibilidade:** Ao splittar texto, adicione `aria-label` no container com o texto completo para leitores de tela não lerem cada letra separada.

---

## 3. Observer — Detector Universal de Gestos/Scroll

### O que faz

`Observer` detecta qualquer combinação de `scroll`, `wheel`, `touch`, `pointer`, `drag` em um alvo, com threshold de velocity/distância configurável. Muito mais confiável que eventos nativos para carousels, scroll-hijacked sections e gestos.

```javascript
Observer.create({
  target: window,             // alvo (window, elemento, seletor)
  type: 'wheel,touch,pointer', // tipos a escutar
  wheelSpeed: -1,             // inverte direção (opcional)
  onDown:  () => goNext(),    // scroll/swipe para baixo
  onUp:    () => goPrev(),    // scroll/swipe para cima
  tolerance: 10,              // pixels mínimos para disparar
  preventDefault: true,       // bloqueia scroll nativo
});
```

### Caso de uso 1: seções full-screen com snap

```javascript
// Seções 100vh que fazem snap ao scroll/swipe
const sections = gsap.utils.toArray('.full-section');
let current = 0;
let animating = false;

function goTo(index) {
  if (animating || index < 0 || index >= sections.length) return;
  animating = true;

  const tl = gsap.timeline({ onComplete: () => { animating = false; } });
  tl.to(sections[current], { yPercent: -100, duration: 0.9, ease: 'power3.inOut' })
    .from(sections[index], { yPercent: 100, duration: 0.9, ease: 'power3.inOut' }, '<');

  current = index;
}

Observer.create({
  type: 'wheel,touch,pointer',
  onDown: () => goTo(current + 1),
  onUp:   () => goTo(current - 1),
  tolerance: 10,
  preventDefault: true,
});
```

### Caso de uso 2: carrossel drag-to-scrub

```javascript
// Carrossel que responde a drag/swipe com inércia
let dragging = false;
let startX = 0;
let offsetX = 0;
const track = document.querySelector('.carousel-track');

Observer.create({
  target: track,
  type: 'touch,pointer',
  onPress:  (self) => { dragging = true; startX = self.x; },
  onDrag:   (self) => {
    if (!dragging) return;
    const delta = self.x - startX;
    gsap.set(track, { x: offsetX + delta });
  },
  onRelease: (self) => {
    dragging = false;
    const delta = self.x - startX;
    const snap = Math.round((offsetX + delta) / slideWidth) * slideWidth;
    offsetX = Math.min(0, Math.max(snap, -(slides.length - 1) * slideWidth));
    gsap.to(track, { x: offsetX, duration: 0.5, ease: 'power3.out' });
  },
});
```

### Caso de uso 3: marquee que acelera/desacelera com o scroll

```javascript
let direction = 1;
let speed = 1;

Observer.create({
  target: window,
  type: 'wheel,touch',
  onChangeY: (self) => {
    direction = self.deltaY > 0 ? 1 : -1;
    speed = Math.min(5, Math.abs(self.deltaY) / 100);
    gsap.to(marqueeState, { speed, duration: 0.5, ease: 'power2.out' });
  },
  onStop: () => gsap.to(marqueeState, { speed: 1, duration: 1, ease: 'power1.out' }),
});

const marqueeState = { speed: 1 };
gsap.ticker.add(() => {
  const x = parseFloat(track.dataset.x || 0);
  const newX = x - direction * marqueeState.speed;
  // wrap infinito
  const wrapped = ((newX % halfWidth) + halfWidth) % halfWidth - halfWidth;
  gsap.set(track, { x: wrapped });
  track.dataset.x = String(newX);
});
```

### Caso de uso 4: cursor magnético com Observer

```javascript
// Observer rastreia posição do pointer globalmente
const cursor = { x: 0, y: 0 };

Observer.create({
  type: 'pointer',
  onMove: (self) => {
    cursor.x = self.x;
    cursor.y = self.y;
  },
});

// Botões magnéticos
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  gsap.ticker.add(() => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(cursor.x - cx, cursor.y - cy);
    const threshold = 120;
    if (dist < threshold) {
      const pull = (1 - dist / threshold) * 0.35;
      gsap.to(btn, {
        x: (cursor.x - cx) * pull,
        y: (cursor.y - cy) * pull,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      });
    } else {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)', overwrite: true });
    }
  });
});
```

---

## 4. ScrollTrigger — Padrões Avançados

### Padrão essencial: stagger de cards em grid

```javascript
gsap.from('.card', {
  opacity: 0,
  y: 50,
  scale: 0.96,
  duration: 0.7,
  ease: 'power3.out',
  stagger: { amount: 0.4, from: 'start' },
  scrollTrigger: {
    trigger: '.cards-grid',
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',  // play na entrada, reverse na saída
  },
});
```

### Padrão: `scrub` — timeline controlada pelo scroll

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=150%',        // duração do scroll em pixels
    pin: true,            // fixa o elemento
    scrub: 1.5,           // lag em segundos (mais suave)
    anticipatePin: 1,     // evita flash ao fixar
  },
});

tl.from('.hero__title',   { y: 0, opacity: 1 })           // posição inicial da timeline
  .to('.hero__title',     { y: -100, opacity: 0 }, 0)     // 0 = início da timeline
  .from('.hero__image',   { scale: 0.8, opacity: 0 }, 0)
  .to('.hero__image',     { scale: 1.15, yPercent: -15 }, 0.5);
```

### Padrão: `snap` — seções com snap points

```javascript
ScrollTrigger.create({
  trigger: '.sections-container',
  start: 'top top',
  end: 'bottom bottom',
  snap: {
    snapTo: 1 / (totalSections - 1),  // fração do progresso total
    duration: { min: 0.3, max: 0.7 },
    ease: 'power2.inOut',
    delay: 0.1,
  },
});
```

### Padrão: `batch` — animar grupos ao entrar na viewport

```javascript
// Melhor para listas longas (lazy revela sem criar 1 ST por item)
ScrollTrigger.batch('.fade-item', {
  onEnter: batch => gsap.from(batch, {
    opacity: 0, y: 40, stagger: 0.06, duration: 0.7, ease: 'power3.out',
  }),
  onLeave: batch => gsap.set(batch, { opacity: 0, y: -20 }),
  onEnterBack: batch => gsap.from(batch, { opacity: 0, y: -40, stagger: 0.06, duration: 0.7 }),
  onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 40 }),
  start: 'top 85%',
  batchMax: 5,      // máximo de elementos por batch trigger
});
```

### Padrão: scroll horizontal com pin

```javascript
const panels = gsap.utils.toArray('.h-panel');

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-scroll-wrapper',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + document.querySelector('.h-scroll-wrapper').offsetWidth * (panels.length - 1),
    invalidateOnRefresh: true,  // recalcula ao resize
  },
});
```

### Padrão: parallax em múltiplas camadas

```javascript
const layers = [
  { el: '.layer-bg',   speed: -0.1 },
  { el: '.layer-mid',  speed: -0.3 },
  { el: '.layer-fore', speed: -0.6 },
];

layers.forEach(({ el, speed }) => {
  gsap.to(el, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
});
```

### Padrão: clip-path image reveal no scroll

```javascript
gsap.from('.img-reveal', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.2,
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: '.img-reveal',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// Variação: revelar de baixo
gsap.from('.img-reveal-up', {
  clipPath: 'inset(100% 0 0 0)',
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.img-reveal-up', start: 'top 85%' },
});
```

### Padrão: contador numérico animado no scroll

```javascript
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.v).toLocaleString('pt-BR');
    },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});
```

### Padrão: SVG stroke draw

```javascript
document.querySelectorAll('[data-draw]').forEach(path => {
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: path,
      start: 'top 85%',
      scrub: 1,           // controle manual pelo scroll
    },
  });
});
```

### ScrollTrigger — callbacks úteis

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  onEnter:      () => console.log('entrou'),
  onLeave:      () => console.log('saiu pelo topo'),
  onEnterBack:  () => console.log('entrou de volta'),
  onLeaveBack:  () => console.log('saiu pelo rodapé'),
  onUpdate:     (self) => console.log('progress:', self.progress.toFixed(2)),
  onToggle:     (self) => console.log('ativo:', self.isActive),
  markers: import.meta.env.DEV,  // mostrar marcadores apenas em dev (Astro/Vite)
});
```

### ScrollTrigger.refresh() — quando usar

```javascript
// Chamar após qualquer mudança no DOM que altere alturas
document.querySelector('.accordion').addEventListener('click', () => {
  // Esperar animação de expansão antes de recalcular
  setTimeout(() => ScrollTrigger.refresh(), 400);
});

// Em Astro, chamar após view transition
document.addEventListener('astro:page-load', () => {
  ScrollTrigger.refresh();
});
```

---

## 5. SplitText + ScrollTrigger — Combinações Premium

### Hero title em 3 fases (linha → palavra → char)

```javascript
async function animateHero() {
  const titleSplit = new SplitText('.hero-title', { type: 'lines,words,chars' });
  const subSplit   = new SplitText('.hero-subtitle', { type: 'words' });

  const tl = gsap.timeline({ delay: 0.3 });

  // Fase 1: linhas entram de baixo
  tl.from(titleSplit.lines, {
    yPercent: 105,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    onStart: () => gsap.set(titleSplit.lines, { overflow: 'hidden' }),
  });

  // Fase 2: chars ganham peso (variable font)
  tl.to(titleSplit.chars, {
    fontVariationSettings: '"wght" 800',
    duration: 0.6,
    stagger: { amount: 0.3, from: 'center' },
    ease: 'power2.out',
  }, '-=0.3');

  // Fase 3: subtitle por palavra
  tl.from(subSplit.words, {
    opacity: 0,
    y: 15,
    filter: 'blur(6px)',
    duration: 0.6,
    stagger: 0.04,
    ease: 'power3.out',
  }, '-=0.4');
}

animateHero();
```

### Scroll-triggered paragraph reveal por linha

```javascript
document.querySelectorAll('[data-split-reveal]').forEach(el => {
  const split = new SplitText(el, { type: 'lines' });

  // Garantir overflow hidden por linha
  split.lines.forEach(line => {
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.from(split.lines, {
    yPercent: 110,
    duration: 0.7,
    stagger: 0.06,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
  });
});
```

### Floating chars com mouse proximity

```javascript
const split = new SplitText('.floating-text', { type: 'chars' });
const chars = [...split.chars];
const originalPositions = chars.map(c => {
  const r = c.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});

// Observer rastreia cursor
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
Observer.create({ type: 'pointer', onMove: s => { mx = s.x; my = s.y; } });

const RADIUS = 80;
const STRENGTH = 25;

gsap.ticker.add(() => {
  chars.forEach((c, i) => {
    const dx = mx - originalPositions[i].x;
    const dy = my - originalPositions[i].y;
    const dist = Math.hypot(dx, dy);
    if (dist < RADIUS) {
      const force = (1 - dist / RADIUS) * STRENGTH;
      gsap.to(c, {
        x: -(dx / dist) * force,
        y: -(dy / dist) * force,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      gsap.to(c, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    }
  });
});
```

---

## 6. Observer + ScrollTrigger — Padrões Compostos

### Seções com storytelling (Observer para snap + ScrollTrigger para conteúdo interno)

```javascript
const sections = gsap.utils.toArray('.story-section');
let current = 0;
let isAnimating = false;

// Timeline de cada seção (conteúdo interno)
const timelines = sections.map(sec => {
  return gsap.timeline({ paused: true })
    .from(sec.querySelector('.title'), { y: 60, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from(sec.querySelector('.body'),  { y: 40, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from(sec.querySelector('.cta'),   { scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, '-=0.3');
});

function navigateTo(index) {
  if (isAnimating || index === current || index < 0 || index >= sections.length) return;
  isAnimating = true;

  const dir = index > current ? 1 : -1;

  gsap.to(sections[current], { yPercent: -100 * dir, duration: 0.8, ease: 'power3.inOut' });
  gsap.from(sections[index], { yPercent:  100 * dir, duration: 0.8, ease: 'power3.inOut',
    onComplete: () => {
      isAnimating = false;
      current = index;
      timelines[current].restart();
    }
  });
}

Observer.create({
  type: 'wheel,touch,pointer',
  onDown: () => navigateTo(current + 1),
  onUp:   () => navigateTo(current - 1),
  tolerance: 15,
  preventDefault: true,
});

// Iniciar primeira seção
timelines[0].play();
```

### Galeria com drag horizontal livre + snap (Observer)

```javascript
const track = document.querySelector('.gallery-track');
const items = [...track.children];
const itemW = items[0].offsetWidth + 24; // largura + gap
const maxX = 0;
const minX = -(itemW * (items.length - 1));

let xPos = 0;

Observer.create({
  target: track,
  type: 'touch,pointer',
  dragMinimum: 5,
  onDrag: (self) => {
    xPos = gsap.getProperty(track, 'x') + self.deltaX;
    gsap.set(track, { x: xPos });
  },
  onDragEnd: (self) => {
    // Snap ao item mais próximo
    const nearest = Math.round(-xPos / itemW);
    const snapped = Math.max(0, Math.min(nearest, items.length - 1));
    xPos = -(snapped * itemW);
    gsap.to(track, { x: xPos, duration: 0.5, ease: 'power3.out' });

    // Highlight item ativo
    items.forEach((item, i) => {
      gsap.to(item, { opacity: i === snapped ? 1 : 0.4, scale: i === snapped ? 1 : 0.9, duration: 0.3 });
    });
  },
});
```

---

## 7. Receitas de Timing e Easing

| Efeito | Ease recomendada | Duration |
|--------|-----------------|----------|
| Reveal de título (linha) | `power4.out` | 0.8–1.2s |
| Reveal de parágrafo (palavra) | `power3.out` | 0.6–0.8s |
| Card entrance | `power3.out` | 0.5–0.7s |
| Fade simples | `power2.out` | 0.4–0.6s |
| Retorno magnético | `elastic.out(1, 0.5)` | 0.6–0.8s |
| Botão press feedback | `back.out(3)` | 0.25–0.35s |
| Modal open | `power4.inOut` | 0.5–0.7s |
| Parallax | `none` (linear) | — (scrub) |
| Page transition exit | `power3.in` | 0.3–0.4s |
| Page transition enter | `power3.out` | 0.4–0.6s |
| Counter numérico | `power2.out` | 1.5–2.5s |
| SVG draw (scrub) | `power2.inOut` | — (scrub) |

### Stagger presets

```javascript
// Da esquerda para direita
stagger: { amount: 0.5, from: 'start' }

// Do centro para as bordas
stagger: { amount: 0.4, from: 'center' }

// Aleatório (orgânico)
stagger: { amount: 0.6, from: 'random' }

// Grid (da célula mais próxima do trigger)
stagger: { amount: 0.5, grid: [rows, cols], from: 'center', ease: 'power2.in' }
```

---

## 8. Pitfalls & Best Practices

| Problema | Causa | Solução |
|---------|-------|---------|
| `ScrollTrigger` não dispara | Plugin não registrado | `gsap.registerPlugin(ScrollTrigger)` |
| Posições erradas no scroll | Lenis e ScrollTrigger dessincronizados | Conectar com `lenis.on('scroll', ScrollTrigger.update)` |
| Animação joga na posição errada após resize | ST calcula posições na montagem | Usar `invalidateOnRefresh: true` e/ou `ScrollTrigger.refresh()` |
| `SplitText` quebra layout no resize | Splits são estáticos | Recriar split no `resize` com debounce |
| `filter` em filho de `preserve-3d` invisível | Bug Chrome/Edge | Usar só `opacity` para estados, nunca `filter` em cenas 3D |
| `SplitText` quebra acessibilidade | Chars isolados lidos letra por letra | Adicionar `aria-label` no container com texto completo |
| Observer não dispara em mobile | `type` não inclui `touch` | `type: 'wheel,touch,pointer'` |
| Animações piscam no SSR (Astro/Next) | GSAP roda antes do CSS carregar | Usar `ScrollTrigger.refresh()` no `astro:page-load` |
| Jank no início do scroll | `lagSmoothing` padrão do GSAP | `gsap.ticker.lagSmoothing(0)` quando usar Lenis |
| `from()` com `opacity: 0` não funciona com `will-change` | Conflito de compositor | Evitar `will-change: opacity` manual; GSAP gerencia |

### Accessibility

```javascript
// Desativar animações pesadas se preferência do sistema
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // código com animações completas
  initAnimations();
  return () => {
    // cleanup quando media query muda
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
});
mm.add('(prefers-reduced-motion: reduce)', () => {
  // versão sem animação
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'all' });
  });
});
```

---

## 9. Setup completo para Astro 4 + GSAP + Lenis + SplitText

```javascript
// src/scripts/gsap-init.js
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer }      from 'gsap/Observer';
import { SplitText }     from 'gsap/SplitText';
import { Flip }          from 'gsap/Flip';
import Lenis             from 'lenis';

gsap.registerPlugin(ScrollTrigger, Observer, SplitText, Flip);

export function initGSAP() {
  // Lenis
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

```astro
<!-- src/layouts/Base.astro -->
<script>
  import { initGSAP } from '../scripts/gsap-init.js';

  // Inicializar após o DOM estar pronto
  const lenis = initGSAP();

  // Reinicializar após Astro view transitions
  document.addEventListener('astro:page-load', () => {
    ScrollTrigger.refresh();
  });

  document.addEventListener('astro:before-swap', () => {
    lenis.stop();
    ScrollTrigger.getAll().forEach(st => st.kill());
  });

  document.addEventListener('astro:after-swap', () => {
    lenis.start();
    ScrollTrigger.refresh();
  });
</script>
```
