# Typography Pairing Reference

## Classic Pairings (Google Fonts)

### Elegant / Professional
- **Playfair Display** (heading) + **Source Sans 3** (body)
- **Fraunces** (heading) + **Inter** (body)
- **Cormorant Garamond** (heading) + **Proza Libre** (body)
- **Libre Baskerville** (heading) + **Open Sans** (body)

### Modern / Clean
- **Montserrat** (heading) + **Open Sans** (body)
- **Poppins** (heading) + **Roboto** (body)
- **Raleway** (heading) + **Lato** (body)
- **DM Sans** (heading) + **Inter** (body)

### Bold / Creative
- **Oswald** (heading) + **Merriweather** (body)
- **Anton** (heading) + **Work Sans** (body)
- **Bebas Neue** (heading) + **Source Sans 3** (body)
- **Space Grotesk** (heading) + **Space Mono** (body)

### Luxury / High-End
- **Cormorant** (heading) + **Montserrat** (body, light weight)
- **Playfair Display** (heading) + **Lato** (body)
- **Didot** (heading) + **Helvetica Neue** (body)
- **Fraunces** (heading) + **Commissioner** (body)

### Tech / Startup
- **Inter** (heading, bold) + **Inter** (body, regular)
- **Geist** (heading) + **Geist Mono** (code)
- **Plus Jakarta Sans** (heading) + **IBM Plex Sans** (body)
- **Sora** (heading) + **DM Sans** (body)

## Type Scale (Major Third — 1.250)

| Level | Size (px) | Size (rem) | Use |
|-------|----------|------------|-----|
| xs | 12px | 0.75rem | Captions, labels |
| sm | 14px | 0.875rem | Small text, metadata |
| base | 16px | 1rem | Body text |
| lg | 18px | 1.125rem | Large body, lead text |
| xl | 20px | 1.25rem | H6 / small heading |
| 2xl | 25px | 1.563rem | H5 |
| 3xl | 31px | 1.953rem | H4 |
| 4xl | 39px | 2.441rem | H3 |
| 5xl | 49px | 3.052rem | H2 |
| 6xl | 61px | 3.815rem | H1 |
| 7xl | 76px | 4.768rem | Display / Hero |

## CSS Font Stack Templates

```css
/* System Font Stack (fastest) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             Oxygen, Ubuntu, Cantarell, sans-serif;

/* Serif Stack */
font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;

/* Monospace Stack */
font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 
             'SF Mono', Consolas, monospace;

/* Responsive Type Scale with clamp() */
h1 { font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem); }
h2 { font-size: clamp(2rem, 4vw + 0.5rem, 3.5rem); }
h3 { font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem); }
p  { font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem); }
```

## Line Height & Spacing Rules

| Element | Line Height | Letter Spacing | Margin Bottom |
|---------|------------|----------------|---------------|
| H1 Hero | 1.0 – 1.1 | -0.02em – -0.03em | 1rem |
| H1-H2 | 1.1 – 1.2 | -0.01em – -0.02em | 0.75rem |
| H3-H4 | 1.2 – 1.3 | 0 – -0.01em | 0.5rem |
| Body | 1.5 – 1.7 | 0 – 0.01em | 1rem |
| Small/Caption | 1.4 – 1.5 | 0.02em – 0.05em | 0.5rem |
| All Caps | — | 0.05em – 0.15em | — |
