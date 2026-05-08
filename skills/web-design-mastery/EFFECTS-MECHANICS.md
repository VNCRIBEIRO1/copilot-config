# Effects Mechanics — Auditoria Profunda 2026

Documento complementar ao `SKILL.md`. Para cada categoria-chave (cards, carrosséis, tipografia, transições, scroll, 3D), explica **como o efeito funciona mecanicamente**, lista **variações e melhorias**, **caveats de browser** e **referências Awwwards-tier**.

> **Leitura recomendada:** primeiro o índice no SKILL.md para ver o catálogo de código pronto; depois este arquivo para entender a teoria e escolher variações sofisticadas.

---

## Tendências 2026 (Awwwards / Codrops / Motion Highlights)

| Tendência | Mecânica central | Stack típica |
|-----------|------------------|--------------|
| **Scroll-driven 3D worlds** | Câmera Three.js animada por timeline GSAP atrelada ao `scrollTrigger` | Three.js + GSAP + Lenis |
| **WebGPU procedural** | Compute shaders para milhões de instâncias (grama, partículas) | Three.js TSL + WebGPU |
| **NPR / Watercolor shaders** | Pós-processamento com displacement + paper texture | Three.js + post-processing |
| **Distortion + blur on scroll** | Shader fragment com `displacementMap` controlado por velocidade do scroll | WebGL + Lenis velocity |
| **Editorial rhythm** | Grade fluida com tipografia variable e leitura scroll-snap | CSS Grid + `font-variation-settings` |
| **Variable typography kinetic** | Animação de eixos `wght`, `wdth`, `slnt` em tempo real | CSS @property + variable fonts |
| **View Transitions API** | Browser nativo cross-fade + morph entre rotas | Astro view transitions / native |
| **Magnetic + custom cursor** | Tween de proximidade entre cursor e elementos com `pointer` events | GSAP + RAF |
| **Unicorn Studio shaders** | Shaders WebGL plug-and-play como background | Unicorn Studio embed |
| **Cinematic micrositios** | Camadas em paralaxe + transições de capítulo + áudio | GSAP + Howler |

Sites de referência (estudo obrigatório): `awwwards.com/sites/ruinart-digital-fresco`, `awwwards.com/sites/silent-house`, `awwwards.com/sites/detroit-paris`, `awwwards.com/sites/shader-development-studio`, `tympanus.net/codrops` (case studies + tutoriais).

---

## 1. Cards — Mecânica & Variações

### 1.1 Spotlight Card (mouse-tracked radial gradient)

**Como funciona**
- Card define duas CSS custom properties `--mx` e `--my` (% relativos ao próprio bbox).
- JS atualiza essas variáveis no `mousemove` usando `getBoundingClientRect()`.
- Pseudo-elemento `::before` posiciona um `radial-gradient(circle at var(--mx) var(--my), color, transparent)` — o gradiente "segue" o cursor.
- `opacity: 0 → 1` no `:hover` evita repaint quando não há interação.

**Por que é leve**: o browser apenas repinta o pseudo-elemento; nenhuma reflow.

**Variações**
1. **Spotlight com border luminoso** — adicionar segundo `::after` com `mask-composite: exclude` para iluminar só a borda (técnica do Vercel).
2. **Spotlight grupo (constellation)** — atualizar `--mx/--my` em **todos** os cards do grid simultaneamente; o card mais próximo do cursor tem `opacity` proporcional à distância (`1 - dist/threshold`).
3. **Spotlight com cor dinâmica** — sample da paleta da imagem do card via `Vibrant.js` para o gradiente combinar com o conteúdo.
4. **Spotlight reativo a velocidade** — `radius` do gradiente cresce com a velocidade do mouse (`Math.hypot(dx, dy)`).

**Melhorias / pitfalls**
- Use `pointer-events: none` no pseudo-elemento, senão captura cliques.
- Respeitar `prefers-reduced-motion: reduce` desabilitando o efeito.
- Em mobile, substituir por gradiente estático suave (sem `mousemove`).

**Referência Awwwards-tier**: [linear.app](https://linear.app), [vercel.com](https://vercel.com), Silent House (Awwwards SOTD).

---

### 1.2 Tilt 3D Card

**Como funciona**
- Card pai tem `perspective` (distância da câmera virtual).
- JS calcula posição relativa do mouse no card (`(mouseX - centerX) / halfWidth` → -1..1).
- Aplica `rotateX = -y * maxTilt`, `rotateY = x * maxTilt` em graus.
- `transform-style: preserve-3d` permite filhos com `translateZ` parecerem flutuar.

**Variações**
1. **Tilt com camadas parallax** — filhos em `translateZ(20px)`, `translateZ(60px)` etc. recebem o mesmo rotate mas profundidades diferentes (ícone, título, badge).
2. **Tilt com glare** — adicionar `::after` com `linear-gradient` que se move conforme o mouse (simula reflexo de vidro).
3. **Tilt amortecido (lerp)** — `currentRot += (targetRot - currentRot) * 0.1` num loop RAF; movimento suave em vez de tracking direto.
4. **Tilt magnético** — cursor atrai o card como ímã: `card.x = (mouseX - cardCenter) * 0.15` ao mesmo tempo que rotaciona.
5. **Tilt invertido (push-back)** — borda oposta ao mouse "afunda" mais (`scale` decresce em direção ao cursor) — sensação de pressionar.

**Melhorias / pitfalls**
- **NUNCA** usar `filter` em filhos de `preserve-3d` no Chrome/Edge — quebra renderização. Use `opacity`.
- `will-change: transform` no card melhora compositor mas custa memória; remover ao `mouseleave`.
- `transform-origin` central evita "rabo" desalinhado quando combina rotate + scale.

**Referência**: stripe.com/cards, apple.com/airpods-max, Detroit Paris (Awwwards).

---

### 1.3 Beam Card (sweep horizontal de luz)

**Como funciona**
- `::after` posicionado com `left: -100%`, `width: 60%`, gradient horizontal transparente→branco→transparente.
- Animação CSS move `left` para `140%` em loop.
- `overflow: hidden` no card recorta o sweep.

**Variações**
1. **Beam diagonal** — gradient com `transform: skewX(-20deg)` e movimento diagonal (sensação de "scan laser").
2. **Beam on-hover** — animação `paused` por padrão, `running` no `:hover`.
3. **Beam multi-color** — gradient com 3 stops (rosa→violeta→azul) reproduz a paleta da brand.
4. **Beam reativo a scroll** — posição do beam atrelada ao `scrollTrigger.progress`.

---

### 1.4 Card com Border Gradient Animado

**Como funciona**
- Pseudo `::before` com `inset: -2px` e `background: linear-gradient(...)` cria um "anel" maior que o card.
- `z-index: -1` coloca atrás; o card opaco tampa o miolo, sobrando 2px de borda colorida.
- Animação muda `background-position` em loop, simulando rotação do gradiente.

**Variações**
1. **Conic gradient rotativo** — substituir por `conic-gradient(from var(--angle), ...)` + `@property --angle` para animação em GPU.
2. **Border que reage ao mouse** — `--angle` derivado do ângulo do cursor relativo ao centro.
3. **Dashed animated** — `border-image` com SVG de tracejado animando `stroke-dashoffset`.
4. **Border com glow externo** — adicionar `filter: drop-shadow(0 0 12px var(--brand))` no pseudo-elemento.

**Melhorias**: prefira `@property --angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }` — performante, animável diretamente, sem JS.

---

## 2. Carrosséis — Mecânica & Variações

### 2.1 Drag-snap Horizontal (Swiper-like)

**Como funciona**
- Container flex com `overflow-x: hidden`; track interno move com `transform: translateX(-i * slideWidth)`.
- Pointer events: `pointerdown` salva `startX`, `pointermove` move o track sem transição, `pointerup` calcula delta e snap para o slide mais próximo.
- "Snap" é apenas `transition: transform .5s cubic-bezier(.22,.61,.36,1)` ativado após `pointerup`.

**Variações**
1. **Free-mode com momentum** — após `pointerup`, integrar velocidade (`v *= 0.95` por frame) até slide mais próximo (Apple-style).
2. **Snap CSS-only** — `scroll-snap-type: x mandatory` + `scroll-snap-align: start` em cada slide; `scroll-behavior: smooth`. Zero JS.
3. **Loop infinito virtual** — duplicar primeiros e últimos N slides; ao chegar no clone, "teleportar" sem transição para o original.
4. **Slide com peek** — `padding-inline` no container revela próximo/anterior parcialmente.
5. **Auto-play com pause-on-hover** — `setInterval` que avança slide; `mouseenter` zera intervalo.

**Melhorias**
- Use `pointer` events (não `mouse` + `touch`) — unifica desktop/mobile.
- `touch-action: pan-y` em mobile permite scroll vertical natural enquanto arrasta horizontal.
- Prefetch da imagem do próximo slide com `<link rel=preload>` ou `loading=lazy` no anterior.

**Referência**: Swiper 11 (`swiper.js.com/demos`), Embla Carousel.

---

### 2.2 3D Coverflow / Ring Carousel

**Como funciona**
- Container com `perspective`.
- Track com `transform-style: preserve-3d` e `rotateY(--angle)`.
- Cada slide posicionado com `transform: rotateY(N * stepDeg) translateZ(radius)`.
- Mudar de slide = animar `--angle` para `-currentIndex * stepDeg`.

**Variações**
1. **Coverflow planar** (Apple Music) — slides na linha, slides laterais com `rotateY ±55deg` + `scale .8`.
2. **Ring 360°** — N slides distribuídos em círculo; útil para mostrar "categorias" rotacionando.
3. **Helicoidal** — adiciona `translateY(N * step)` para criar espiral (efeito futurista).
4. **Coverflow com reflexo** — pseudo-elemento `::after` com `transform: scaleY(-1)` e `mask-image: linear-gradient(transparent, black)`.

**Pitfalls** (importante)
- **NÃO usar `filter: blur/brightness`** em filhos de `preserve-3d` (quebra Chrome/Edge — itens somem). Para "deixar inativos opacos", use só `opacity`.
- `backface-visibility: hidden` se o slide só faz sentido visto pela frente.
- iOS Safari descarta `preserve-3d` com `overflow: hidden` — encapsular o ancestor sem overflow.

**Referência**: Awwwards SOTD "Ruinart Digital Fresco", Lusion experiments.

---

### 2.3 Marquee Infinito (continuous scroll)

**Como funciona**
- Track com conteúdo duplicado (A + A) ou triplicado.
- `animation: marquee 30s linear infinite` que move `translateX(0%)` → `translateX(-50%)`.
- Quando chega em -50%, está exatamente no início da segunda cópia → loop visualmente perfeito.

**Variações**
1. **Pause on hover** — `:hover { animation-play-state: paused }`.
2. **Reverse direction** — `animation-direction: reverse` ou translate de `-50%` para `0%`.
3. **Drag-to-scrub** — JS detecta drag e ajusta `animation-delay` negativo proporcional (efeito "espiar").
4. **Speed variable on scroll** — `animation-duration` muda baseado em `scrollVelocity` (Lenis): mais rápido quando rola rápido.
5. **Multilinha alternada** — duas linhas, uma normal outra reverse — sensação de painel ferroviário.

**Pitfall**: garantir que a soma da largura dos clones seja **exatamente** divisível pela quantidade de cópias. Use `width: max-content` + duplicação programática no JS para evitar gap.

---

### 2.4 Stack Cards (Tinder-like swipe)

**Como funciona**
- Cards absolutos no mesmo ponto, com `translateY(N * 8px) scale(1 - N*0.04)` para criar pilha.
- Pointer drag aplica `translateX + rotate(deltaX * 0.05deg)`.
- Threshold de 100px → fora da tela com `transition`; abaixo → snap back com elastic.
- Após exit, próximo card promove-se a topo (`N--` em todos).

**Variações**
1. **Scrub de info no drag** — opacity/escala de like/dislike badge cresce com `Math.abs(deltaX) / threshold`.
2. **Dois eixos** — drag-up = "super-like" (cor diferente).
3. **Persist físico** — usar Matter.js para colisão real entre cards.

---

## 3. Tipografia — Mecânica & Variações

### 3.1 Variable Fonts Kinetic

**Como funciona**
- Fonte variável expõe eixos (`wght` 100-900, `wdth` 50-200, `slnt` -15-0, custom como `MONO`, `CASL`).
- CSS `font-variation-settings: "wght" 400, "wdth" 100`.
- Animação interpolando os eixos via `@keyframes` ou GSAP (com `--wght: 400` e `font-variation-settings: "wght" var(--wght)`).

**Variações**
1. **Hover swell** — `wght` 300 → 800 em 0.4s.
2. **Scroll-driven weight** — `wght` cresce conforme `scrollTrigger.progress`.
3. **Word-by-word stagger** — split por palavras, animação de `wght` com 0.05s de delay cada.
4. **Audio-reactive** — `wght` ligado a `AnalyserNode.getByteFrequencyData()` (eixos pulsam com áudio).
5. **Mouse proximity** — `wght` cresce inversamente à distância do cursor (`weight = 300 + 500 * (1 - dist/maxDist)`).

**Melhorias**: declarar `@property --wght { syntax: '<number>'; inherits: false; initial-value: 400 }` para permitir transição CSS animada (sem JS).

**Referência**: Exat Microsite (Codrops 2026), v-fonts.com, Recursive (Arrow Type), Inter Variable.

---

### 3.2 Split Reveal (linha/palavra/letra)

**Como funciona**
- Bibliotecas: `SplitText` (GSAP, premium) ou vanilla — split por `<span>` envolvendo cada char/palavra.
- Container externo com `overflow: hidden`.
- Inner spans inicialmente em `translateY(100%)`; animação stagger `y: 0` com `ease: power3.out`.

**Variações**
1. **Reveal mask vertical** — char por char, ease elastic.
2. **Reveal mask horizontal** — `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` letter by letter.
3. **Wave** — `stagger: { each: 0.04, from: 'random' }` cria padrão orgânico.
4. **Reveal com blur** — junto do `y`, animar `filter: blur(20px)` → `blur(0)`. **Cuidado**: filter custa GPU; ok em headlines, evitar em parágrafos longos.
5. **Char shuffle** — antes de revelar, char passa por chars aleatórios (Scramble — GSAP plugin ou implementação manual com `Math.random()` em `requestAnimationFrame`).

---

### 3.3 Gradient Text Animado

**Como funciona**
- `background: linear-gradient(...)` com `background-size: 200% auto`.
- `-webkit-background-clip: text` recorta o gradient na forma das letras.
- `color: transparent` revela o gradient.
- Animação de `background-position` desliza o gradient.

**Variações**
1. **Conic shimmer** — `conic-gradient` rotacionando (com `@property --angle`).
2. **Gradient mask + grain** — overlay de SVG noise sobre o texto (mix-blend-mode: overlay).
3. **Progressive reveal** — `background-size: 0% 100%` → `100% 100%` (efeito "preencher com tinta").
4. **Hue shift** — usar `filter: hue-rotate(360deg)` no container, animado em loop.

**Pitfalls**
- Em Safari iOS, `background-clip: text` pode falhar com `filter` no parent. Aplicar filter em outro container.
- Prefira `text` para acessibilidade — não embutir gradient como SVG image.

---

### 3.4 Kinetic Typography (texto que reage)

**Como funciona**
- Cada letra como elemento independente.
- Loop RAF aplica `transform` baseado em força física (mouse/scroll/áudio).
- Padrão "magnetic letter": cada char calcula vetor até o cursor; se distância < threshold, translada parcialmente nessa direção.

**Variações**
1. **Letras em órbita do cursor** — gravidade simulada.
2. **Texto explodindo no clique** — partículas físicas usando Matter.js.
3. **Letras como cordas elásticas** — spring physics (constant + damping) entre posição original e cursor.
4. **Tipo morphing** — animar entre dois SVG paths via `morphSVG` (GSAP) — letras "viram" outras formas.

**Referência**: davidshq.com/animate-svg-text-paths, Bardo Industries (Awwwards), Active Theory works.

---

## 4. Transições & Micro-interações

### 4.1 View Transitions API (nativo)

**Como funciona**
- Browser API: `document.startViewTransition(() => updateDOM())`.
- Browser tira snapshot do estado atual, aplica mudanças, anima cross-fade entre snapshots.
- Customizar com `::view-transition-old(root)` e `::view-transition-new(root)`.
- Persistência de elementos: `view-transition-name: hero-img` em ambas as páginas → o browser anima o elemento entre rotas (FLIP nativo).

**Variações**
1. **Cross-fade default** — zero código adicional.
2. **Hero image morph** — adicionar `view-transition-name` a elemento compartilhado.
3. **Slide direcional** — keyframes customizadas em `::view-transition-old` (slide-out left) e `::view-transition-new` (slide-in right).
4. **Ripple from click** — `clip-path: circle(0% at clickX clickY)` → `circle(150%)` na nova página.

**Browser support**: Chrome 111+, Edge, Safari 18+. Fallback: cross-fade JS manual com GSAP.

**Astro**: `<ClientRouter />` integra automaticamente; declarativo com `transition:name="..."` em qualquer elemento.

---

### 4.2 FLIP (First-Last-Invert-Play)

**Como funciona**
- **First**: medir bounding rect do elemento antes da mudança (`getBoundingClientRect()`).
- **Last**: aplicar mudança DOM, medir novo rect.
- **Invert**: aplicar `transform: translate(dx, dy) scale(sx, sy)` que coloca o elemento visualmente onde estava.
- **Play**: animar `transform: none` — browser interpola da posição "fake" para a real.

**Por que importa**: anima reorder/resize sem `width/height` (que causam reflow). Apenas `transform`.

**Variações**
1. **Auto-FLIP grid** — usar `gsap.flip` plugin para reordenar grids com filtro/sort.
2. **Modal expand** — card de lista vira modal full-screen com `Flip.from(state, { duration: 0.6 })`.
3. **Shared element navigation** — combina com View Transitions.

---

### 4.3 Magnetic Hover

**Como funciona**
- Botão captura `mousemove` global quando cursor está dentro de raio de "atração" (ex: 100px).
- Calcula vetor do centro do botão até cursor; aplica `translate` proporcional (ex: 30% do delta).
- `mouseleave` (ou cursor fora do raio) → tween de retorno com `ease: elastic.out(1, 0.5)`.

**Variações**
1. **Magnetic com label** — texto interno se move *a mais* que o container (sensação de inércia diferente).
2. **Magnetic invertido** — cursor "repele" o botão (translate na direção oposta).
3. **Magnetic em grid** — vários elementos respondem a um único cursor; intensidade decresce com distância.
4. **Magnetic com glow** — combina com spotlight: cursor atrai o botão E ilumina-o.

---

### 4.4 Scroll-driven Animations (CSS nativas)

**Como funciona** (Chrome 115+, Edge 115+)
- `animation-timeline: scroll()` — timeline atrelada ao scroll do `<html>` em vez do tempo.
- `animation-timeline: view()` — timeline atrelada à entrada/saída do elemento na viewport.
- `animation-range: cover 0% cover 50%` define onde no scroll a animação ocorre.
- Sem JS: fade-in elementos com puro CSS.

**Vantagens vs ScrollTrigger**: zero JS, zero RAF, executado no compositor.

**Variações**
1. **Reveal ao entrar viewport** — `animation-range: entry 0% entry 100%`.
2. **Progress bar global** — barra com `transform-origin: left`, `scale-x: 0 → 1`, `animation-timeline: scroll(root)`.
3. **Sticky text scrub** — substituto CSS para sticky+scroll-pin sem JS.

**Fallback**: detectar com `@supports (animation-timeline: scroll())` e cair para Intersection Observer.

---

## 5. Scroll Avançado

### 5.1 Lenis Smooth Scroll

**Como funciona**
- Lenis intercepta o evento `wheel`/`touchmove`, previne o scroll nativo.
- Mantém posição "alvo" e posição "atual"; cada frame faz `current += (target - current) * lerp`.
- Aplica `transform: translateY(-current)` no `<body>` ou anima `window.scrollTo`.

**Configuração premium** (testada em pixelcodestudio):
```js
new Lenis({ lerp: 0.085, wheelMultiplier: 1.05, smoothWheel: true })
```

**Sincronizar com GSAP**:
```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

**Variações**
1. **Inversão direcional** — `direction: 'horizontal'` para sites de portfólio horizontais.
2. **Variable easing** — `easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (custom).
3. **Snap a sections** — combinar com `ScrollTrigger.snapDirectional`.

**Pitfall**: smooth scroll pode prejudicar acessibilidade. Ler `prefers-reduced-motion` e desabilitar com `lenis.stop()`.

---

### 5.2 Scroll-pinned Storytelling

**Como funciona**
- `ScrollTrigger.create({ pin: true, start: 'top top', end: '+=300%', scrub: true })`.
- Section fica visualmente fixa enquanto o scroll avança virtualmente o `end - start` em pixels.
- Timeline GSAP é controlada por `scrub` (progresso da timeline = progresso do scroll).

**Variações**
1. **Capítulos com âncoras** — `snap` para múltiplos pontos da timeline.
2. **Camadas paralaxe internas** — múltiplos `gsap.to` na mesma timeline com diferentes `yPercent` para fundo, mid, foreground.
3. **Reveal sequencial** — passos numerados aparecendo conforme `progress > 0.25`, `0.5`, `0.75`.

---

### 5.3 Distortion/Blur on Scroll Velocity

**Como funciona** (técnica avançada — 4WIDE, Awwwards)
- Lenis expõe `velocity` (px/frame).
- Shader fragment WebGL (Three.js + `EffectComposer`) recebe `uVelocity` como uniform.
- Fragment aplica deslocamento UV proporcional: `vec2 distortedUV = vUv + vec2(0, uVelocity * 0.001)`.
- Blur radial cresce com `abs(velocity)`.

**Stack mínima**: Three.js + postprocessing + Lenis. Custa ~200KB gz mas dá visual de cinema.

**Alternativa CSS-only barata**:
```js
let v = 0;
lenis.on('scroll', ({ velocity }) => { v = velocity; document.documentElement.style.setProperty('--vel', Math.min(20, Math.abs(velocity))); });
```
```css
img { filter: blur(calc(var(--vel) * 0.3px)); transition: filter .1s; }
```

---

## 6. 3D & WebGL (panorama)

### 6.1 Quando usar Three.js vs CSS 3D

| Critério | CSS 3D | Three.js |
|----------|--------|----------|
| Cenas com 5-15 elementos | ✅ | over-engineering |
| Iluminação dinâmica | ❌ | ✅ |
| Geometria custom | limitada | ✅ |
| Animação de rotação simples | ✅ | ok |
| Shaders procedurais | ❌ | ✅ |
| Bundle size | ~0KB | +150KB gz |
| Compatibilidade | universal | requer WebGL2 |

**Heurística**: comece em CSS 3D; migre para Three.js quando precisar de iluminação, post-processing ou >50 instâncias.

### 6.2 Setup Three.js mínimo (250 linhas, sem post)
- `Scene`, `PerspectiveCamera`, `WebGLRenderer({ antialias: true, alpha: true })`.
- `OrbitControls` opcional para debug.
- Loop RAF: `renderer.render(scene, camera)`.
- Resize listener: `camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h)`.

### 6.3 Padrões scroll-driven 3D
1. **Camera path** — câmera segue um `CatmullRomCurve3`; `progress` da curva = `scrollTrigger.progress`.
2. **Object reveal** — meshes com `material.opacity` animado por progresso; `material.transparent = true`.
3. **Morph targets** — geometria troca shapes com `morphTargetInfluences[i]` animado.
4. **Shader uniform timeline** — `uProgress` no fragment shader controla mix entre cores/displacement.

### 6.4 WebGPU 2026 (futuro próximo)
- TSL (Three.js Shading Language) escreve shaders em JS, transpila para WGSL/GLSL.
- Compute shaders viabilizam milhões de partículas (ver "False Earth" — Codrops Apr 2026).
- Suporte: Chrome 113+, Edge, Safari 18+ desktop. Fallback obrigatório para WebGL.

---

## 7. Performance — Regras de Ouro

| Regra | Detalhe |
|-------|---------|
| Anime **só** `transform` e `opacity` | Outras props causam reflow/repaint |
| `will-change` parcimoniosa | Aplique antes da animação, remova depois |
| `contain: layout paint` | Em cards/sections para isolar reflow |
| `content-visibility: auto` | Off-screen sections não renderizam |
| `font-display: swap` | Texto visível durante carregamento de fonte |
| `loading="lazy"` + `decoding="async"` em imgs | Padrão obrigatório |
| `prefers-reduced-motion: reduce` | Desabilitar animações non-essenciais |
| `Intersection Observer` > scroll listeners | RAF-friendly, nativo |
| Throttle pointermove a 60fps | Use `requestAnimationFrame` para coalescer |
| Bundle GSAP só plugins necessários | Tree-shake `ScrollTrigger`, `Flip` etc. |

**Lighthouse-target**: LCP < 2.5s, CLS < 0.1, INP < 200ms. Animações pesadas devem rodar **após** LCP.

---

## 8. Accessibility de Efeitos

- Todo efeito decorativo deve ter `aria-hidden="true"`.
- Animações infinitas (marquee, blob) → `prefers-reduced-motion` desliga ou pausa.
- Carrosséis precisam de `role="region"`, `aria-roledescription="carousel"`, controles próximos com `aria-label`.
- Cards interativos (tilt/spotlight) — verificar que conteúdo permanece legível e clicável; `tab` deve focar normalmente.
- Cursor customizado **NUNCA** esconde o cursor nativo em mobile/touch (`@media (hover: none) { custom-cursor { display: none } }`).
- Texto com `background-clip: text` precisa contraste do fallback `color` para fallback browsers.

---

## 9. Checklist de Auditoria de Site Awwwards-tier

- [ ] Tipografia variável + escala fluida (`clamp()`)
- [ ] Mínimo 1 efeito assinatura na hero (3D, shader, kinetic type, ou paralaxe rico)
- [ ] Cursor customizado coerente (não obrigatório, mas comum em SOTD)
- [ ] Smooth scroll (Lenis) sincronizado com animações
- [ ] Pelo menos 1 transição de página memorável (View Transitions ou GSAP)
- [ ] Hover states sofisticados em todos elementos clicáveis
- [ ] Loading state criativo (não só spinner)
- [ ] Microinterações em form fields, buttons, toggles
- [ ] Imagens com transição (clip-path reveal, scale, blur)
- [ ] Som opcional (mute por padrão; respeita autoplay policy)
- [ ] 100% responsivo com adaptação real (não só shrink)
- [ ] `prefers-reduced-motion` respeitado
- [ ] Lighthouse Performance > 80 (mesmo com efeitos)
- [ ] Easter egg ou detalhe inesperado (selo Awwwards)
- [ ] Tipografia com pelo menos 1 momento de "wow" (kinetic, morph, scramble)

---

## 10. Bibliotecas de Apoio (curadoria 2026)

| Lib | Uso | Bundle |
|-----|-----|--------|
| GSAP 3.12 + ScrollTrigger | Animações timeline, scroll-driven | ~70KB gz |
| GSAP Flip | FLIP automático | +5KB |
| Lenis 1.1 | Smooth scroll | ~6KB gz |
| Three.js | 3D / WebGL | ~150KB gz tree-shaken |
| Motion One | Alternativa leve ao GSAP (Web Animations API) | ~12KB |
| Lottie | Animações After Effects | ~50KB |
| Splitting.js | Split text simples | ~3KB |
| Hammer.js / Pointer events | Gestures | nativo |
| Embla Carousel | Carrossel headless | ~12KB |
| Swiper 11 | Carrossel completo | ~50KB |
| Matter.js | Física 2D | ~80KB |
| postprocessing | Pós-process Three.js | ~40KB |
| Unicorn Studio | Shaders embed | external |
| Spline | Cenas 3D no-code | external |

---

## Referências de Estudo (sites para clonar mentalmente)

**Awwwards SOTD recentes**: Ruinart Digital Fresco, Silent House, Detroit Paris, Wild Week Athens, Don Molinico, Shader Studio, Fourmula AI, Adcker, Studio375.

**Studios canônicos**: makemepulse, Active Theory, Lusion, Obys, Resn, Rhumb Studio, Malvah Studio, Hello Monday, Locomotive.

**Tutoriais profundos**: Codrops (`tympanus.net/codrops`), CSS Tricks, Smashing Magazine, GSAP docs, Three.js Journey (Bruno Simon), motion.dev.

**Inspiração curada**: awwwards.com/elements, godly.website, lapa.ninja, httpster.net, siteinspire.com.

