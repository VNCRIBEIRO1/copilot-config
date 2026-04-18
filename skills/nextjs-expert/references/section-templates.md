# Section Templates — Ready-to-Use Components

Production-ready section components for Next.js + Tailwind. Copy, customize colors/content, and ship.

## Hero — Full-Screen with Overlay

```tsx
import Image from "next/image"
import Link from "next/link"

export function HeroFullScreen() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Headline Principal
        </h1>
        <p className="mt-6 text-lg text-white/80 sm:text-xl md:text-2xl">
          Subtítulo com descrição breve e impactante.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="#" className="rounded-lg bg-accent px-8 py-4 font-semibold text-white transition hover:brightness-110">
            CTA Principal
          </Link>
          <Link href="#" className="rounded-lg border-2 border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
            CTA Secundário
          </Link>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  )
}
```

## Hero — Split Layout

```tsx
import Image from "next/image"

export function HeroSplit() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="mx-auto grid min-h-[80vh] max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Content */}
        <div className="flex flex-col justify-center px-6 py-20 lg:px-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Badge / Categoria
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Título Principal
          </h1>
          <p className="mt-6 text-lg text-white/70">
            Descrição detalhada do conteúdo ou proposta.
          </p>
          <div className="mt-8">
            <a href="#" className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-white">
              Saiba Mais →
            </a>
          </div>
        </div>
        {/* Image */}
        <div className="relative min-h-[400px] lg:min-h-0">
          <Image src="/images/hero-split.jpg" alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent lg:block" />
        </div>
      </div>
    </section>
  )
}
```

## Feature Grid — Icons + Text

```tsx
import { Shield, Zap, Heart, Users } from "lucide-react"

const features = [
  { icon: Shield, title: "Segurança", description: "Proteção avançada para sua família." },
  { icon: Zap, title: "Rapidez", description: "Respostas em tempo real." },
  { icon: Heart, title: "Cuidado", description: "Atenção personalizada." },
  { icon: Users, title: "Comunidade", description: "Juntos somos mais fortes." },
]

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Nossos Diferenciais</h2>
          <p className="mt-4 text-lg text-muted">O que nos torna únicos.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Zigzag — Alternating Image/Text

```tsx
import Image from "next/image"

interface ZigzagItem {
  title: string
  description: string
  image: string
}

export function Zigzag({ items }: { items: ZigzagItem[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl space-y-24 px-4">
        {items.map((item, i) => (
          <div key={item.title} className={`flex flex-col items-center gap-12 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold sm:text-3xl">{item.title}</h3>
              <p className="text-lg text-muted">{item.description}</p>
            </div>
            <div className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

## Stats Counter Bar

```tsx
"use client"
import { useInView, motion } from "framer-motion"
import { useRef } from "react"

const stats = [
  { value: 500, suffix: "+", label: "Projetos" },
  { value: 98, suffix: "%", label: "Satisfação" },
  { value: 24, suffix: "/7", label: "Suporte" },
  { value: 15, suffix: "+", label: "Anos de Experiência" },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={0}
        animate={isInView ? value : 0}
        transition={{ duration: 2, ease: "easeOut" }}
        // @ts-expect-error — Framer motion number animation
        children={undefined}
        style={{ display: "inline-block" }}
      />
      {isInView ? `${value}${suffix}` : `0${suffix}`}
    </motion.span>
  )
}

export function StatsBar() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl font-bold text-accent sm:text-5xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

## Testimonials Carousel

```tsx
"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Testimonial {
  name: string
  role: string
  avatar: string
  content: string
}

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold">O que dizem sobre nós</h2>
        <div className="relative mt-12 min-h-[200px]">
          {items.map((t, i) => (
            <div
              key={t.name}
              className={`absolute inset-0 transition-all duration-500 ${
                i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <blockquote className="text-xl italic text-muted">"{t.content}"</blockquote>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
                <div className="text-left">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-accent" : "w-2 bg-border"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

## CTA Banner — Full Width

```tsx
import Link from "next/link"

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-accent to-indigo-700 py-20">
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Pronto para começar?</h2>
        <p className="mt-4 text-lg text-white/80">
          Junte-se a centenas de pessoas que já transformaram sua vida.
        </p>
        <div className="mt-8">
          <Link href="#" className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-accent transition hover:bg-white/90">
            Comece Agora
          </Link>
        </div>
      </div>
    </section>
  )
}
```

## FAQ Accordion

```tsx
"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem { question: string; answer: string }

export function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-bold">Perguntas Frequentes</h2>
        <div className="mt-12 space-y-4">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold"
              >
                {item.question}
                <ChevronDown className={`h-5 w-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all ${open === i ? "max-h-96 pb-4" : "max-h-0"}`}>
                <p className="px-6 text-muted">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Logo Ticker / Infinite Marquee

```tsx
import Image from "next/image"

const logos = [
  { src: "/logos/1.svg", alt: "Company 1" },
  { src: "/logos/2.svg", alt: "Company 2" },
  { src: "/logos/3.svg", alt: "Company 3" },
  { src: "/logos/4.svg", alt: "Company 4" },
  { src: "/logos/5.svg", alt: "Company 5" },
]

export function LogoTicker() {
  return (
    <section className="overflow-hidden border-y border-border py-12">
      <div className="flex animate-marquee gap-16">
        {[...logos, ...logos].map((logo, i) => (
          <Image key={i} src={logo.src} alt={logo.alt} width={120} height={40} className="h-10 w-auto opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0" />
        ))}
      </div>
    </section>
  )
}
```

## Timeline Section

```tsx
interface TimelineItem {
  year: string
  title: string
  description: string
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-3xl font-bold">Nossa Trajetória</h2>
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2" />
          <div className="space-y-12">
            {items.map((item, i) => (
              <div key={item.year} className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-accent md:left-1/2" />
                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <span className="text-sm font-bold text-accent">{item.year}</span>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

## Pricing Cards

```tsx
import { Check } from "lucide-react"

interface Plan {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
  cta: string
}

export function PricingCards({ plans }: { plans: Plan[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold">Planos</h2>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-accent bg-accent/5 shadow-xl ring-2 ring-accent"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
                  Mais Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted">/{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg py-3 font-semibold transition ${
                  plan.popular
                    ? "bg-accent text-white hover:brightness-110"
                    : "border border-border hover:bg-surface-dark"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Team Grid with Hover Reveal

```tsx
import Image from "next/image"

interface TeamMember {
  name: string
  role: string
  image: string
  social?: { linkedin?: string; twitter?: string }
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold">Nossa Equipe</h2>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <div key={m.name} className="group relative overflow-hidden rounded-xl">
              <div className="aspect-[3/4] relative">
                <Image src={m.image} alt={m.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 text-white transition-transform group-hover:translate-y-0">
                  <p className="font-bold text-lg">{m.name}</p>
                  <p className="text-sm text-white/70">{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Tabbed Content

```tsx
"use client"
import { useState } from "react"

interface Tab { label: string; content: React.ReactNode }

export function TabbedContent({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex gap-1 rounded-xl bg-surface-dark p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                i === active ? "bg-accent text-white shadow-md" : "text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {tabs.map((tab, i) => (
            <div key={tab.label} className={`transition-all duration-300 ${i === active ? "opacity-100" : "hidden opacity-0"}`}>
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Bento Grid Section

```tsx
import Image from "next/image"

interface BentoItem {
  title: string
  description?: string
  image?: string
  span?: "wide" | "tall" | "large" | "default"
}

const spanClasses = {
  default: "",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  large: "md:col-span-2 md:row-span-2",
}

export function BentoGridSection({ items, title }: { items: BentoItem[]; title: string }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold">{title}</h2>
        <div className="mt-16 grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent ${spanClasses[item.span ?? "default"]}`}
            >
              {item.image && (
                <Image src={item.image} alt={item.title} fill className="object-cover opacity-20 transition-opacity group-hover:opacity-30" />
              )}
              <div className="relative z-10 flex h-full flex-col justify-end">
                <h3 className="text-lg font-bold">{item.title}</h3>
                {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Hero — Video Background

```tsx
export function HeroVideo() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="text-5xl font-bold md:text-7xl">Headline</h1>
        <p className="mt-6 text-xl text-white/80">Subtítulo impactante.</p>
      </div>
    </section>
  )
}
```
