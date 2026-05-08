---
name: nextjs-expert
description: "Expert-level Next.js development with authority-grade visual design for political campaigns, institutional sites, and premium landing pages. Advanced animations (Framer Motion, GSAP, scroll-driven), visual effects (glassmorphism, gradient mesh, noise, cinematic overlays), authority UI patterns (dark themes, gold accents, institutional grids, bento layouts), campaign-specific design (bandeiras, hero overlaps, CTA sections), performance optimization (Core Web Vitals), SEO (structured data, dynamic OG images), responsive design systems, micro-interactions. Use when: building Next.js sites, designing institutional/authority UIs, creating campaign sites, building dark theme premium UIs, refactoring childish flat designs into professional layouts, implementing advanced visual effects."
argument-hint: "Descreva o componente, efeito ou tom visual (ex: 'cards com autoridade', 'hero cinematic', 'grid institucional')"
---

# Next.js Expert — Authority-Grade Web Design & Advanced Effects

Specialist skill for building **production-ready Next.js applications** with:
- **Authority-grade visual design** (institutional, serious, premium)
- **Advanced visual effects** (glassmorphism, gradient mesh, cinematic overlays)
- **Campaign-specific patterns** (political, military, institutional sites)
- **Optimized performance** (Core Web Vitals, ISR, SSG)

> **Awwwards-tier refs:** Para efeitos vencedores 2024-2026 (R3F sticky-scrub, image trail, magnetic, distortion shaders, View Transitions, bento grid premium), consulte [`../web-design-mastery/references/awwwards-effects-2026.md`](../web-design-mastery/references/awwwards-effects-2026.md) e [`../web-design-mastery/references/gsap-cookbook.md`](../web-design-mastery/references/gsap-cookbook.md).
>
> **Stack canon Next.js 2026:** Next 15 (App Router) + GSAP 3.12 + Lenis + `@react-three/fiber` + `@react-three/drei` + `motion.dev` + Tailwind 4 + View Transitions API.

## Stack Base

- **Framework**: Next.js 14–16+ (App Router)
- **React**: 18/19 (Server Components + Client Components)
- **Styling**: Tailwind CSS v3/v4, CSS Variables, CSS Modules
- **Animations**: Framer Motion, GSAP, CSS Animations, View Transitions API
- **UI Libraries**: shadcn/ui, Radix UI, Headless UI (when requested)
- **Icons**: Lucide React, Heroicons, React Icons
- **Fonts**: next/font (Google Fonts, local fonts)
- **Images**: next/image with blur placeholders, AVIF/WebP

## When to Use

- Building or refactoring Next.js websites
- **Designing authority/institutional UIs** (campaigns, law firms, defense, gov)
- **Refactoring flat/childish designs** into serious professional layouts
- Creating advanced animations and visual effects
- Building dark-theme premium sites with gold/accent touches
- Setting up design systems with CSS variables / Tailwind themes
- Optimizing Core Web Vitals (LCP, FID, CLS, INP)
- Creating dynamic OG images with `ImageResponse`
- Implementing dark mode, scroll-driven effects, micro-interactions

## Core Principles

1. **Server-first**: Default to Server Components. Only add `"use client"` when state, effects, or browser APIs are needed
2. **Authority by Design**: UI must convey **competence, seriousness, and trust** — NEVER childish flat-color blocks, rainbow cards, or playful bouncy animations. See [campaign-ui-patterns.md](./references/campaign-ui-patterns.md) for detailed patterns.
3. **Progressive Enhancement**: Effects must degrade gracefully — content accessible without JS
4. **Performance Budget**: LCP < 2.5s, CLS < 0.1, INP < 200ms — never sacrifice metrics for aesthetics
5. **Accessibility**: WCAG 2.1 AA minimum — `prefers-reduced-motion`, focus management, semantic HTML, ARIA
6. **Type Safety**: Full TypeScript — no `any`, proper interfaces for props and data
7. **Mobile-first**: All layouts start mobile, scale up with `md:`, `lg:`, `xl:`
8. **60-30-10 Color Rule**: 60% base (dark), 30% surface, 5% accent, 3% prestige, 2% white — see color application rules in campaign-ui-patterns

## ⚠️ Visual Authority Check (MANDATORY)

Before delivering ANY UI component, verify against these anti-patterns:

| NEVER ❌ | ALWAYS ✓ |
|----------|----------|
| Flat saturated colored cards (bg-red-500, bg-pink-600) | Dark glass cards with subtle accent borders/icons |
| Rainbow color scheme (each card different color) | Monochromatic palette with ONE accent + ONE prestige color |
| Large colored blocks without texture | Gradient mesh, noise overlay, subtle patterns |
| Bouncy/spring/wobble hover animations | Precise 300ms transitions, subtle elevation, glow |
| Equal-size flat grids (5 identical boxes) | Hierarchical bento layouts, feature spotlight + thumbnails |
| Bright text on bright backgrounds | Dark bg + light text, proper contrast ratios |
| Children's app aesthetic | Bloomberg/government/law firm aesthetic |

For complete reference with code examples: **[campaign-ui-patterns.md](./references/campaign-ui-patterns.md)**

## Architecture Patterns

### Component Organization
```
src/
├── app/                    # Routes (Server Components by default)
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Theme variables + base styles
│   ├── opengraph-image.tsx # Dynamic OG image (Edge Runtime)
│   └── [slug]/page.tsx     # Dynamic routes
├── components/
│   ├── ui/                 # Primitives (Button, Card, Badge)
│   ├── layout/             # Header, Footer, Navigation
│   ├── sections/           # Page sections (Hero, CTA, Features)
│   └── effects/            # Animation wrappers (FadeIn, Parallax, Reveal)
├── lib/
│   ├── constants.ts        # Site-wide constants, metadata
│   ├── utils.ts            # Utility functions (cn, formatDate)
│   └── fonts.ts            # Font configuration
└── hooks/                  # Custom hooks (useInView, useScrollProgress)
```

### Client/Server Split
```tsx
// Server Component (default) — data fetching, static content
export default async function Page() {
  const data = await getData()
  return <ClientSection data={data} />
}

// Client Component — interactivity, animations
"use client"
export function ClientSection({ data }: Props) {
  const [state, setState] = useState()
  return <motion.div>{/* interactive content */}</motion.div>
}
```

## Procedures

### 1. Visual Effects Implementation

When asked to create visual effects, follow this decision tree:

| Effect | Implementation | Performance Impact |
|--------|---------------|-------------------|
| Fade/slide in on scroll | Framer Motion `useInView` + `motion.div` | Low — use `once: true` |
| Parallax scrolling | CSS `transform: translateY()` with scroll listener or `scroll-timeline` | Medium — use `will-change` sparingly |
| Glassmorphism | `backdrop-blur` + semi-transparent bg | Low — GPU-accelerated |
| Gradient animations | CSS `@keyframes` on `background-position` | Low — use `background-size: 200%` |
| Noise/grain texture | CSS `background-image: url(noise.svg)` or inline SVG filter | Low — static overlay |
| Text reveal / typewriter | Framer Motion `variants` with stagger | Low — limit to viewport |
| Particle effects | Canvas API or CSS `@keyframes` on pseudo-elements | High — limit particle count |
| Scroll-driven animations | CSS `animation-timeline: scroll()` or Framer `useScroll` | Low — native CSS preferred |
| Page transitions | View Transitions API or Framer `AnimatePresence` | Medium — keep transitions < 300ms |
| Magnetic cursor | `onMouseMove` + `motion.div` with spring physics | Medium — throttle events |
| Morphing shapes | SVG `<animate>` or Framer Motion `pathLength` | Low |
| Counter/number animation | Framer Motion `useMotionValue` + `useTransform` | Low |
| Neumorphism | `box-shadow` inset + outset on same-color bg | Low — no blur layer |
| Claymorphism | `box-shadow` multi-layer + border-radius + bg blur | Low |
| Aurora / Northern Lights | Animated `radial-gradient` blobs with `filter: blur()` | Medium — GPU composite |
| 3D card tilt | `perspective` + `rotateX/Y` on `onMouseMove` or Framer `useTransform` | Medium — throttle |
| Text clip / mask | `background-clip: text` + image/video as bg | Low — GPU-accelerated |
| Reveal on hover (image) | `clip-path` transition or `mask-image` with gradient | Low |
| Frosted glass | `backdrop-filter: blur() saturate()` (like Glassmorphism but heavier blur + saturation) | Low-Medium |
| SVG line draw | Framer `pathLength` or CSS `stroke-dasharray` + `stroke-dashoffset` animation | Low |
| Stacked/fanned cards | CSS `transform: rotate()` + `nth-child` offsets | Low |
| Bento grid layout | CSS Grid with `grid-row: span 2` + varying sizes | Low — no JS needed |
| Gradient mesh | Multiple overlapping `radial-gradient` layers | Low — static paint |
| Kinetic typography | Framer Motion `variants` with per-letter/word stagger | Medium — limit text length |
| Hover distortion | CSS `filter: url(#turbulence)` SVG filter on hover | Medium |
| Page scroll hijack | `scroll-snap-type` + full-viewport sections | Low — CSS only |
| GSAP ScrollTrigger | GSAP `gsap.to()` with `ScrollTrigger` plugin | Medium — tree-shake GSAP |
| View Transitions API | `document.startViewTransition()` for page-level morph | Low — native browser |
| Confetti / celebration | Canvas particles triggered on event | High — fire once, destroy |

**Always apply:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2. Animation Wrapper Components

Standard reusable animation components to offer:

```tsx
// FadeIn — scroll-triggered entrance
"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface FadeInProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, direction = "up", delay = 0, duration = 0.5, className }: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directionOffset = {
    up: { y: 40 }, down: { y: -40 },
    left: { x: 40 }, right: { x: -40 }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

```tsx
// Parallax — depth effect on scroll
"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface ParallaxProps {
  children: React.ReactNode
  speed?: number // -1 to 1, negative = opposite direction
  className?: string
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
```

```tsx
// StaggerContainer — staggered children entrance
"use client"
import { motion } from "framer-motion"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>
}
```

### 3. Template Sections

When building pages, compose from these section patterns. See [./references/section-templates.md](./references/section-templates.md).

**Hero variants:**
- Full-screen video/image with overlay + animated text
- Split (image left/right + content)
- Carousel/slider with auto-play
- Gradient mesh background with floating elements
- Particle/canvas background

**Content sections:**
- Feature grid (2/3/4 columns, icons + text)
- Alternating image/text rows (zigzag)
- Stats/counter bar with animated numbers
- Testimonials carousel or masonry
- Timeline (vertical or horizontal)
- Pricing cards with hover effects
- FAQ accordion
- CTA banner (full-width gradient + action button)
- Team/people grid with hover reveal
- Logo ticker/marquee (infinite scroll)
- Before/after comparison slider
- Tabbed content with animated transitions

### 4. Performance Optimization Checklist

Apply these in every project:

- [ ] **Images**: `next/image` with `sizes`, `priority` on LCP image, `placeholder="blur"`, AVIF format
- [ ] **Fonts**: `next/font` with `display: "swap"`, subset to `latin`
- [ ] **Components**: `dynamic(() => import())` for below-fold heavy components
- [ ] **Metadata**: Full `generateMetadata()` with canonical, alternates, OG
- [ ] **Scripts**: `next/script` with `strategy="lazyOnload"` for analytics
- [ ] **CSS**: Purge unused styles, prefer Tailwind utilities over custom CSS
- [ ] **Animations**: Compositor-only properties (`transform`, `opacity`), `will-change` only when animating
- [ ] **Bundle**: Analyze with `@next/bundle-analyzer`, split large dependencies
- [ ] **Rendering**: ISR/SSG for content pages, streaming for dynamic pages
- [ ] **Cache**: `revalidate` on fetch, `unstable_cache` for expensive computations

### 5. SEO & Metadata

```tsx
// app/layout.tsx — Full metadata template
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: { default: "Site Name", template: "%s | Site Name" },
  description: "Site description for search engines",
  keywords: ["keyword1", "keyword2"],
  authors: [{ name: "Author" }],
  creator: "Creator",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Site Name",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
}
```

```tsx
// Dynamic OG Image (app/opengraph-image.tsx)
import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Site Name"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex",
        background: "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
        color: "white", fontFamily: "sans-serif",
        alignItems: "center", justifyContent: "center",
      }}>
        <h1 style={{ fontSize: 64 }}>Site Title</h1>
      </div>
    ),
    { ...size }
  )
}
```

### 6. Design System Setup

```css
/* globals.css — Theme with CSS Variables + Tailwind v4 */
@import "tailwindcss";

@theme inline {
  --color-primary: #0a0a0a;
  --color-secondary: #1a1a2e;
  --color-accent: #6366f1;
  --color-accent-light: #818cf8;
  --color-surface: #ffffff;
  --color-surface-dark: #111111;
  --color-text: #0a0a0a;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-heading: "Cal Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 20px rgba(99,102,241,0.3);
}

/* Dark mode override */
.dark {
  --color-surface: #0a0a0a;
  --color-surface-dark: #000000;
  --color-text: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
}
```

### 7. Dark Mode Implementation

```tsx
// ThemeProvider.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "system", setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    root.classList.toggle("dark", isDark)
    localStorage.setItem("theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
```

### 8. Advanced CSS Effects Recipes

See [./references/css-effects.md](./references/css-effects.md) for complete recipes including:
- Glassmorphism cards
- Animated gradient borders
- Noise/grain texture overlay
- Glow effects (text, buttons, cards)
- Magnetic hover effect
- Infinite marquee/ticker
- Scroll-driven progress indicator
- Morphing blob backgrounds
- Spotlight/cursor follow effect
- Text gradient with animation
- Shimmer loading skeleton
- Floating/levitating elements

### 9. Responsive Design Patterns

```tsx
// Responsive container with max-width steps
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

// Responsive grid — 1 col mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Hide/show by breakpoint
<div className="hidden lg:block">  {/* Desktop only */}
<div className="lg:hidden">        {/* Mobile/tablet only */}

// Responsive typography
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">

// Container queries (Tailwind v4)
<div className="@container">
  <div className="@md:flex @md:gap-6">
```

### 10. Code Quality Standards

When generating code:
- **TypeScript strict mode** — no `any`, define interfaces for all props
- **Named exports** — `export function Component()` not `export default`
- **Descriptive names** — `HeroSection` not `Hero`, `useScrollProgress` not `useScroll`
- **Consistent spacing** — 2-space indentation, blank line between logical blocks
- **Import order** — React → Next.js → external libs → internal → types → styles
- **Error boundaries** — wrap interactive sections with error boundaries in production
- **Loading states** — `loading.tsx` for route segments, Suspense for components
- **Key prop** — always meaningful keys in lists, never array index

### 11. GSAP Integration

When Framer Motion isn't enough (complex timelines, pinning, scrubbing), use GSAP:

```tsx
"use client"
import { useRef, useLayoutEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function PinnedSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        x: "-300%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: "+=3000",
        },
      })
    }, sectionRef)

    return () => ctx.revert() // Cleanup on unmount
  }, [])

  return (
    <div ref={sectionRef} className="h-screen overflow-hidden">
      <div ref={contentRef} className="flex h-full w-[400%]">
        {/* 4 horizontal panels */}
      </div>
    </div>
  )
}
```

**GSAP rules:**
- Always `gsap.registerPlugin()` at module level
- Always use `gsap.context()` + `ctx.revert()` for cleanup in React
- Use `useLayoutEffect` (not `useEffect`) for DOM measurements
- Dynamic import GSAP if not used on every page: `dynamic(() => import("./GsapSection"), { ssr: false })`

### 12. View Transitions API

For smooth page-to-page morphing animations (Next.js App Router):

```tsx
"use client"
import { useRouter } from "next/navigation"

export function TransitionLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!document.startViewTransition) {
      router.push(href)
      return
    }
    document.startViewTransition(() => router.push(href))
  }

  return <a href={href} onClick={handleClick}>{children}</a>
}
```

```css
/* globals.css — View Transition styles */
::view-transition-old(root) {
  animation: fade-out 200ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 200ms ease-in;
}
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }

/* Named transitions for shared elements */
.hero-image { view-transition-name: hero; }
```

## Reference Files

- **[Campaign UI Patterns](./references/campaign-ui-patterns.md)** — Authority design, institutional grids, dark theme palettes, card anti-patterns, political campaign UIs, military/police candidates, typography for authority, micro-interactions, bento layouts
- [Section Templates](./references/section-templates.md) — Complete section component templates
- [CSS Effects](./references/css-effects.md) — Advanced CSS/animation recipes
- [Performance Guide](./references/performance.md) — Core Web Vitals optimization deep-dive
- [Effects Glossary](./references/effects-glossary.md) — What each effect IS, categories, and when to use

## Workflow for Campaign / Institutional Sites

1. **Read [campaign-ui-patterns.md](./references/campaign-ui-patterns.md)** FIRST when building ANY campaign or institutional UI
2. Verify current design against the Visual Authority Check table above
3. Apply 60-30-10 color rule: base dark → surface → accent sparse → prestige (gold) → white text
4. Use glassmorphism cards with subtle borders, NOT flat colored blocks
5. Choose bento/hierarchical grid, NOT equal flat grid
6. Apply authority micro-interactions (300ms, subtle elevation, glow) NOT bouncy/spring
7. Add texture layers (noise overlay, gradient mesh, diagonal lines)
8. Validate WCAG contrast and responsive breakpoints
9. Build with Framer Motion `useInView` for scroll reveals (use `once: true`)
10. Test on mobile — authority must persist at small screens
