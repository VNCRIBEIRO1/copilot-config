# CSS Effects — Advanced Recipes

Complete copy-paste recipes for advanced visual effects in Next.js + Tailwind.

## Glassmorphism Card

```tsx
<div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-lg">
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
  <div className="relative z-10">{/* content */}</div>
</div>
```

```css
/* Pure CSS alternative */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
}
```

## Animated Gradient Border

```tsx
<div className="relative rounded-xl p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient">
  <div className="rounded-[10px] bg-black p-6">
    {/* content */}
  </div>
</div>
```

```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient {
  animation: gradient 3s ease infinite;
}
```

## Noise/Grain Texture Overlay

```css
/* Apply to any section or body */
.noise::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}
```

```tsx
// React component
function NoiseOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}
```

## Glow Effects

### Text Glow
```css
.text-glow {
  text-shadow: 0 0 10px rgba(99, 102, 241, 0.5),
               0 0 40px rgba(99, 102, 241, 0.3),
               0 0 80px rgba(99, 102, 241, 0.1);
}
```

### Button Glow
```tsx
<button className="relative rounded-lg bg-indigo-600 px-6 py-3 text-white transition-shadow hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
  Click me
</button>
```

### Card Glow on Hover
```tsx
<div className="group relative rounded-xl bg-gray-900 p-6 transition-all duration-300">
  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur transition-opacity group-hover:opacity-75" />
  <div className="relative z-10">{/* content */}</div>
</div>
```

## Animated Text Gradient

```tsx
<h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
  Gradient Text
</h1>
```

## Infinite Marquee / Ticker

```tsx
"use client"
function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children} {/* Duplicate for seamless loop */}
      </div>
    </div>
  )
}
```

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee linear infinite;
}
```

## Scroll Progress Indicator

```tsx
"use client"
import { motion, useScroll } from "framer-motion"

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-indigo-500"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
```

## Morphing Blob Background

```css
.blob {
  width: 400px;
  height: 400px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3));
  filter: blur(60px);
  animation: morph 8s ease-in-out infinite;
}

@keyframes morph {
  0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
  50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
  75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
}
```

## Spotlight / Cursor Follow

```tsx
"use client"
import { useRef, useState } from "react"

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gray-900 p-6"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

## Shimmer Loading Skeleton

```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`} />
  )
}
```

```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}
```

## Floating / Levitating Element

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

## Magnetic Hover Button

```tsx
"use client"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="rounded-lg bg-indigo-600 px-8 py-4 text-white font-semibold"
    >
      {children}
    </motion.button>
  )
}
```

## Before/After Comparison Slider

```tsx
"use client"
import { useState, useRef } from "react"
import Image from "next/image"

function CompareSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video cursor-col-resize overflow-hidden rounded-xl select-none"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <Image src={after} alt="After" fill className="object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <Image src={before} alt="Before" fill className="object-cover" />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg">
          ↔
        </div>
      </div>
    </div>
  )
}
```

## Scroll-Driven CSS Animations (No JS)

```css
/* Native CSS scroll-driven animation — Chrome 115+ */
@keyframes reveal {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}

/* Horizontal scroll progress bar */
.scroll-bar {
  animation: grow-width linear;
  animation-timeline: scroll(root);
}

@keyframes grow-width {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

## Diagonal Stripe Pattern

```css
.stripe-pattern {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    rgba(255, 215, 0, 0.03) 10px,
    rgba(255, 215, 0, 0.03) 12px
  );
}
```

## Mesh Gradient Background

```css
.mesh-gradient {
  background-color: #0a0a0a;
  background-image:
    radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
}
```

## Neumorphism Card

```css
/* Requires same-colored background (e.g. bg-gray-200) */
.neumorphic {
  background: #e0e0e0;
  border-radius: 1rem;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.15),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
}
.neumorphic-inset {
  box-shadow:
    inset 4px 4px 8px rgba(0, 0, 0, 0.12),
    inset -4px -4px 8px rgba(255, 255, 255, 0.7);
}
/* Dark neumorphism */
.neumorphic-dark {
  background: #2a2a2a;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.4),
    -8px -8px 16px rgba(60, 60, 60, 0.3);
}
```

## Claymorphism Card

```css
.clay {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2rem;
  box-shadow:
    8px 8px 24px rgba(0, 0, 0, 0.08),
    inset -4px -4px 12px rgba(0, 0, 0, 0.05),
    inset 4px 4px 12px rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}
```

## Aurora / Northern Lights Background

```css
.aurora {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}
.aurora::before,
.aurora::after {
  content: "";
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: aurora-drift 10s ease-in-out infinite alternate;
}
.aurora::before {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%);
  top: -20%;
  left: -10%;
}
.aurora::after {
  background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent 70%);
  bottom: -20%;
  right: -10%;
  animation-delay: -5s;
}
@keyframes aurora-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(50px, 30px) scale(1.1); }
}
```

## 3D Card Tilt on Hover

```tsx
"use client"
import { useRef, useState } from "react"

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({})

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(800px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    })
  }

  const handleMouseLeave = () => {
    setStyle({ transform: "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)", transition: "transform 0.4s ease-out" })
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={style} className="rounded-xl bg-gray-900 p-6">
      {children}
    </div>
  )
}
```

## Text Clip / Mask with Image

```css
.text-mask {
  background-image: url("/images/texture.jpg");
  background-size: cover;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
/* Animated version — video/gradient behind text */
.text-mask-gradient {
  background: linear-gradient(90deg, #6366f1, #ec4899, #6366f1);
  background-size: 200%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradient 3s linear infinite;
}
```

## Reveal on Hover (Clip-Path)

```css
.reveal-card {
  position: relative;
  overflow: hidden;
}
.reveal-card .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 0.5s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reveal-card:hover .overlay {
  clip-path: circle(75% at 50% 50%);
}
```

## SVG Line Draw Animation

```css
.line-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease-out forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
```

```tsx
// Framer Motion version
<motion.path
  d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
  stroke="currentColor"
  strokeWidth={2}
  fill="none"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  transition={{ duration: 2, ease: "easeInOut" }}
/>
```

## Stacked / Fanned Cards

```css
.card-stack {
  position: relative;
  width: 280px;
  height: 360px;
}
.card-stack .card {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}
.card-stack .card:nth-child(1) { transform: rotate(-3deg) translateY(0); z-index: 3; }
.card-stack .card:nth-child(2) { transform: rotate(2deg) translateY(8px); z-index: 2; }
.card-stack .card:nth-child(3) { transform: rotate(-1deg) translateY(16px); z-index: 1; }
.card-stack:hover .card:nth-child(1) { transform: rotate(-8deg) translateX(-20px); }
.card-stack:hover .card:nth-child(3) { transform: rotate(6deg) translateX(20px); }
```

## Frosted Glass (Heavy Blur)

```css
.frosted-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
}
```

## Kinetic Typography (Per-Letter Stagger)

```tsx
"use client"
import { motion } from "framer-motion"

function KineticText({ text }: { text: string }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}
```

## Bento Grid Layout

```tsx
export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
      {children}
    </div>
  )
}

// Usage: vary spans for bento effect
<div className="col-span-2 row-span-2 rounded-xl bg-gray-900 p-6">Large featured</div>
<div className="rounded-xl bg-gray-800 p-4">Small</div>
<div className="rounded-xl bg-gray-800 p-4">Small</div>
<div className="col-span-2 rounded-xl bg-gray-900 p-6">Wide</div>
```
