# Performance Guide — Core Web Vitals Optimization

Deep-dive into optimizing Next.js applications for maximum performance scores.

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Image Optimization

### next/image Best Practices

```tsx
// LCP image — ALWAYS add priority
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority              // Disables lazy loading, adds preload
  sizes="100vw"         // Full viewport width
  className="object-cover"
  quality={85}          // Default 75, bump for hero
/>

// Below-fold images — lazy load with blur
import heroBlur from "@/public/images/hero.jpg" // Static import for blurDataURL

<Image
  src="/gallery/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // Or use static import
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Image Format Strategy

```ts
// next.config.ts
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"], // AVIF first (smaller), WebP fallback
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
  },
}
```

### Responsive `sizes` Cheatsheet

| Layout | sizes value |
|--------|-------------|
| Full width | `100vw` |
| Full width with padding | `calc(100vw - 2rem)` |
| Max-width container | `(max-width: 1280px) 100vw, 1280px` |
| 2-column grid | `(max-width: 768px) 100vw, 50vw` |
| 3-column grid | `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw` |
| Sidebar + main | `(max-width: 1024px) 100vw, 75vw` |
| Thumbnail | `(max-width: 768px) 33vw, 150px` |

## Font Optimization

```tsx
// src/lib/fonts.ts
import { Montserrat, Open_Sans } from "next/font/google"

export const heading = Montserrat({
  subsets: ["latin"],
  display: "swap",          // Prevent FOIT
  variable: "--font-heading",
  weight: ["600", "700", "800"],
})

export const body = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "600"],
})

// layout.tsx
<body className={`${heading.variable} ${body.variable} font-sans`}>
```

**Key rules:**
- Always use `display: "swap"` to prevent invisible text during load
- Subset to `latin` unless you need extended characters
- Only load weights you actually use
- Use CSS variables (`variable` prop) for flexibility

## Dynamic Imports (Code Splitting)

```tsx
import dynamic from "next/dynamic"

// Heavy below-fold components
const HeavyCarousel = dynamic(() => import("@/components/HeavyCarousel"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-200 rounded-xl" />,
  ssr: false, // Only if component uses browser APIs
})

// Conditional imports
const AdminPanel = dynamic(() => import("@/components/AdminPanel"), {
  ssr: false,
})

// Library-level splitting
const Chart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
  loading: () => <Skeleton className="h-64" />,
})
```

## Script Loading

```tsx
import Script from "next/script"

// Analytics — load after page is fully interactive
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="lazyOnload"
/>

// Critical third-party — load after hydration
<Script src="/scripts/widget.js" strategy="afterInteractive" />

// Inline script — executed before page becomes interactive (use sparingly)
<Script id="theme-check" strategy="beforeInteractive">
  {`document.documentElement.classList.toggle('dark', localStorage.theme === 'dark')`}
</Script>
```

## Rendering Strategies

### Static (SSG) — Default for pages without dynamic data
```tsx
// app/about/page.tsx — automatically static
export default function About() {
  return <div>Static content</div>
}
```

### ISR (Incremental Static Regeneration)
```tsx
// Revalidate every 60 seconds
export const revalidate = 60

export default async function Blog() {
  const posts = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 },
  }).then((r) => r.json())
  return <PostList posts={posts} />
}
```

### Streaming with Suspense
```tsx
import { Suspense } from "react"

export default function Page() {
  return (
    <>
      <HeroSection /> {/* Renders immediately */}
      <Suspense fallback={<Skeleton className="h-96" />}>
        <SlowDataSection /> {/* Streams in when ready */}
      </Suspense>
    </>
  )
}
```

## CLS Prevention

```tsx
// Always specify dimensions for images
<Image width={800} height={600} />  // ✅
<img src="/photo.jpg" />            // ❌ No dimensions

// Reserve space for dynamic content
<div className="min-h-[400px]">     // ✅ Prevents shift
  <DynamicContent />
</div>

// Font display swap + size-adjust
@font-face {
  font-family: "Custom";
  src: url("/fonts/custom.woff2");
  font-display: swap;
  size-adjust: 100.5%;              // Fine-tune to match fallback metrics
}

// Avoid layout-shifting animations
// ✅ Use transform/opacity (compositor only)
.animate { transform: translateY(20px); opacity: 0; }
// ❌ Avoid animating width, height, margin, padding
```

## Bundle Analysis

```bash
# Install
npm i -D @next/bundle-analyzer

# next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer"

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  // ... next config
})

export default config

# Run
ANALYZE=true npm run build
```

**Common bundle bloat fixes:**
| Library | Size | Fix |
|---------|------|-----|
| `moment.js` | 300KB | Replace with `date-fns` (tree-shakeable) |
| `lodash` | 70KB | Use `lodash-es` or individual imports |
| `framer-motion` | 70KB | Use `motion` from `framer-motion/m` for tree-shaking |
| Icon libraries | 50KB+ | Import individual icons: `import { Shield } from "lucide-react"` |
| `chart.js` | 60KB | Dynamic import, only on pages that need it |

## Caching Headers

```ts
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*).woff2",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}
```

## Lighthouse Audit Checklist

Run before every deploy:

- [ ] LCP < 2.5s on mobile 3G
- [ ] INP < 200ms on low-end device
- [ ] CLS < 0.1
- [ ] Performance score ≥ 90
- [ ] No render-blocking resources
- [ ] All images have explicit `sizes`
- [ ] No unused JavaScript > 20KB
- [ ] First-party fonts with `display: swap`
- [ ] `<meta name="viewport">` present
- [ ] HTTP/2 or HTTP/3 enabled
- [ ] GZIP/Brotli compression active
