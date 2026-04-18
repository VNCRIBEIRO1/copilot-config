# Visual Effects Glossary — Quick Reference

> Decision aid: effect name → what it is → when to use → complexity

## Motion Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **Parallax** | Layers move at different speeds on scroll | Hero sections, depth illusion | CSS / Framer Motion |
| **Scroll-driven animation** | Elements animate as user scrolls (fade, slide, scale) | Section reveals, storytelling | Framer Motion `whileInView` / GSAP ScrollTrigger |
| **Scroll hijack** | Overrides native scroll to control pacing | Full-screen slide decks | GSAP ScrollTrigger `pin` |
| **Kinetic typography** | Text letters animate independently (stagger, wave) | Headlines, hero text | Framer Motion stagger |
| **Marquee / Ticker** | Continuous horizontal scroll of content | Logos, testimonials, news | CSS `@keyframes translateX` |
| **Magnetic cursor** | Element subtly follows cursor position | Buttons, CTAs | `onMouseMove` + transform |
| **Hover distortion** | Image warps/ripples on hover | Portfolio, image grids | CSS `filter` / WebGL |
| **Confetti / Particles** | Decorative particle burst on action | Celebrations, form success | canvas-confetti / tsparticles |
| **Page transitions** | Animated transition between routes | SPAs, portfolios | View Transitions API / Framer Motion |
| **Lottie animation** | Vector animation from After Effects JSON | Icons, illustrations, loading | lottie-react |

## Glass & Surface Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **Glassmorphism** | Semi-transparent frosted glass with blur | Cards, modals, navbars | `backdrop-filter: blur()` + rgba bg |
| **Frosted Glass** | Heavy blur variant of glassmorphism | Full overlays, hero overlays | `backdrop-filter: blur(20px+)` |
| **Neumorphism** | Soft extruded/inset look via dual shadows | Buttons, toggles, cards | `box-shadow` light + dark |
| **Claymorphism** | Rounded 3D clay/plastic look | Playful UI, dashboards | `border-radius` + inner shadow + bg |
| **Aurora / Northern Lights** | Animated gradient blobs that shift colors | Backgrounds, hero sections | CSS `@keyframes` + filter blur |
| **Gradient mesh** | Complex multi-point gradient background | Hero, section backgrounds | CSS `radial-gradient` layered |
| **Noise / Grain** | Film grain texture overlay | Hero sections, dark themes | CSS `url(noise.svg)` or SVG filter |
| **Backdrop blur** | Blur content behind an element | Sticky navs, modals | `backdrop-filter: blur()` |

## Depth & 3D Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **3D Card Tilt** | Card rotates to follow cursor | Product cards, portfolios | `onMouseMove` → `rotateX/Y` |
| **Perspective transforms** | CSS 3D space for child elements | Card flips, carousels | `perspective` + `transform-style: preserve-3d` |
| **Stacked / Fanned cards** | Cards overlapping with offset and rotation | Testimonials, features | CSS `nth-child` transforms |
| **Floating elements** | Elements with subtle up/down animation | Decorative icons, badges | CSS `@keyframes translateY` |
| **Drop shadow layers** | Multiple layered shadows for depth | Cards, elevated sections | Multiple `box-shadow` values |

## Text & Reveal Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **Text clip / mask** | Text filled with image or gradient | Headlines, hero | `background-clip: text` + `-webkit-text-fill-color: transparent` |
| **Gradient text** | Text with gradient color fill | Headings, accents | `background: linear-gradient` + text clip |
| **Typewriter** | Characters appear one by one | Landing pages, chatbots | CSS `steps()` or JS interval |
| **Text reveal** | Text slides/fades in from behind a mask | Section headings | Framer Motion `clipPath` |
| **SVG line draw** | SVG stroke animates from 0 to full | Icons, illustrations, logos | `stroke-dasharray` + `stroke-dashoffset` |
| **Highlight / underline** | Animated underline or highlight on scroll | Emphasis, inline CTAs | CSS `background-size` transition |

## Layout Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **Bento Grid** | Asymmetric grid with spanning cells | Feature showcases, dashboards | CSS Grid `span 2` |
| **Masonry** | Pinterest-style variable-height columns | Galleries, blogs | CSS `columns` or JS library |
| **Sticky sections** | Sections pin while content scrolls beside | Case studies, timelines | `position: sticky` |
| **Reveal on hover** | Content expands or morphs on hover | Team grids, portfolios | `clip-path` transition |
| **Accordion / Collapse** | Expandable content sections | FAQs, feature lists | Framer Motion `AnimatePresence` |
| **Tab switching** | Animated content swap | Features, pricing comparisons | `layoutId` (Framer Motion) |

## Color & Filter Effects

| Effect | Description | Best For | Impl |
|--------|------------|----------|------|
| **Dark mode** | Full theme inversion with CSS variables | Any site | CSS custom properties + `prefers-color-scheme` |
| **Duotone** | Two-color filter on images | Hero images, thumbnails | CSS `filter` + `mix-blend-mode` |
| **Grayscale → Color** | Image starts gray, colorizes on hover/scroll | Galleries, before/after | CSS `filter: grayscale()` transition |
| **Color shift** | Background color transitions on scroll | Section dividers | Intersection Observer + CSS transition |
| **Blend modes** | Layer blending (multiply, screen, overlay) | Decorative overlays | CSS `mix-blend-mode` |

## Choosing the Right Effect

```
Complexity ladder (simple → advanced):
─────────────────────────────────────
1. CSS transitions (hover, focus)                   ← Start here
2. CSS @keyframes (floating, marquee, aurora)
3. Framer Motion (enter/exit, scroll, layout)
4. CSS 3D transforms (card tilt, perspective)
5. GSAP ScrollTrigger (pinning, timelines)
6. WebGL / Canvas (particles, distortion)           ← Only if needed
```

## Performance Impact

| Level | Effects | Notes |
|-------|---------|-------|
| **Low** | Glassmorphism, gradients, shadows, text clip | Compositor-friendly |
| **Medium** | Framer Motion animations, parallax, 3D tilt | Repaint on scroll |
| **High** | GSAP scroll hijack, particles, heavy blur | Throttle & test on mobile |
| **Very High** | WebGL, canvas-heavy, Lottie (complex) | Lazy load, reduce on mobile |
