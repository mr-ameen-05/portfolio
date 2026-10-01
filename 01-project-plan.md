# 🌌 MyFolio — Master Project Plan

## Production-Grade Portfolio: Anti-Gravity Orbits × High-Fashion Editorial × Pixel-Art Companion

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack Deep-Dive](#2-tech-stack-deep-dive)
3. [Architecture Flow](#3-architecture-flow)
4. [Directory & Build Structure](#4-directory--build-structure)
5. [Design System Specification](#5-design-system-specification)
6. [Section-by-Section Implementation Plan](#6-section-by-section-implementation-plan)
7. [Physics Engine Specification](#7-physics-engine-specification)
8. [Sprite Engine Specification](#8-sprite-engine-specification)
9. [Data Architecture](#9-data-architecture)
10. [Responsive Strategy](#10-responsive-strategy)
11. [Performance & Optimization](#11-performance--optimization)
12. [Deployment Pipeline](#12-deployment-pipeline)
13. [Phase Breakdown & Milestones](#13-phase-breakdown--milestones)

---

## 1. Executive Summary

MyFolio is a single-page portfolio web application that fuses **high-fashion editorial web design** with **interactive cosmic physics simulations** and a **retro pixel-art companion sprite**. It serves as a living resume, project showcase, learning journal, and technical blog for a professional spanning Cybersecurity, Systems Engineering, and Full-Stack Development.

### Core Differentiators
| Feature | Implementation |
|---|---|
| Dual-Galaxy Anti-Gravity Orbits | HTML5 Canvas 2D with parametric elliptical paths, mouse-repulsion physics, spring-damping restitution |
| Sci-Fi Portal Spawn | Canvas-rendered teleport door with particle effects spawning a 2D sprite |
| Passive Client OSINT | WebGL GPU fingerprinting, battery API, viewport telemetry → witty roast speech bubbles |
| Story Mode Dialogue Engine | Category-pill driven dialogue trees with typewriter rendering |
| High-Fashion Typography | Layered serif backdrops, condensed grotesk headlines, geometric sans body |
| Cinematic Scroll Animations | Framer Motion scroll-driven reveals, pinned viewports, parallax compression |

---

## 2. Tech Stack Deep-Dive

### Frontend Core

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Build Tool** | Vite | 5.x | Lightning-fast HMR, optimized production builds, tree-shaking |
| **Framework** | React | 18.3+ | Component architecture, Suspense, concurrent features |
| **Routing** | React Router v6 | 6.x | Hash-based smooth scroll + optional route-based blog pages |
| **Language** | TypeScript | 5.x | Type-safe props, canvas physics types, data models |

### Styling & Design

| Layer | Technology | Purpose |
|---|---|---|
| **Utility CSS** | Tailwind CSS v3.4 | Responsive design, dark mode, custom tokens |
| **Typography Plugin** | `@tailwindcss/typography` | Prose styling for blog/markdown content |
| **CSS Variables** | Custom Properties | Theme switching (light/cyber-dark), ambient glow values |
| **Fonts** | Google Fonts (self-hosted) | Cormorant Garamond, Bebas Neue, Plus Jakarta Sans, Press Start 2P |

### Animation & Physics

| Layer | Technology | Purpose |
|---|---|---|
| **UI Animation** | Framer Motion v11 | Scroll reveals, layout transitions, gesture interactions |
| **Canvas Physics** | HTML5 Canvas 2D (custom) | Anti-gravity orbits, particle effects, sprite rendering |
| **Scroll Orchestration** | Framer Motion `useScroll` + `useTransform` | Parallax, pinned sections, progress-driven animations |

### Icons & Assets

| Layer | Technology | Purpose |
|---|---|---|
| **Tech Icons** | `@iconify/react` | Unified SVG rendering for 100+ tech/tool icons |
| **UI Icons** | `lucide-react` | Consistent UI iconography (arrows, menus, links) |
| **Sprite Sheets** | Custom PNG sprite sheets | Pixel-art companion character animation frames |

### Data & Content

| Layer | Technology | Purpose |
|---|---|---|
| **Structured Data** | TypeScript const objects + JSON | Projects, experience, skills taxonomy |
| **Blog/Journal** | MDX or raw Markdown + `react-markdown` | Long-form content with syntax highlighting |
| **Syntax Highlighting** | `react-syntax-highlighter` (Prism) | Code blocks in blog posts and terminal snippets |

### Backend (Minimal / Optional)

| Layer | Technology | Purpose |
|---|---|---|
| **Contact Form** | Node.js Express micro-API or Formspree/Netlify Functions | Form submission handling |
| **Ping Widget** | WebSocket mock or Server-Sent Events | Interactive terminal ping simulation |
| **Deployment** | Vercel / Netlify / Cloudflare Pages | Edge-deployed SPA with CDN |

---

## 3. Architecture Flow

### High-Level Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER CLIENT                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Vite Dev Server / Build               │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────┐  │  │
│  │  │ React   │  │ Tailwind │  │  TypeScript      │  │  │
│  │  │ 18+ SPA │  │ CSS v3.4 │  │  Compiler        │  │  │
│  │  └────┬────┘  └────┬─────┘  └────────┬────────┘  │  │
│  │       │             │                  │           │  │
│  │  ┌────▼─────────────▼──────────────────▼────────┐ │  │
│  │  │           Component Tree                      │ │  │
│  │  │                                               │ │  │
│  │  │  ┌─────────────┐  ┌────────────────────────┐ │ │  │
│  │  │  │  App Shell   │  │  Theme Provider        │ │ │  │
│  │  │  │  (Layout)    │  │  (Light / Cyber Dark)  │ │ │  │
│  │  │  └──────┬───────┘  └───────────┬────────────┘ │ │  │
│  │  │         │                      │              │ │  │
│  │  │  ┌──────▼──────────────────────▼────────────┐ │ │  │
│  │  │  │           Section Components             │ │ │  │
│  │  │  │  ┌───────┐ ┌──────────┐ ┌────────────┐  │ │ │  │
│  │  │  │  │ Hero  │ │ Projects │ │ Experience │  │ │ │  │
│  │  │  │  │Canvas │ │ Grid     │ │ Timeline   │  │ │ │  │
│  │  │  │  └───┬───┘ └──────────┘ └────────────┘  │ │ │  │
│  │  │  │      │                                   │ │ │  │
│  │  │  │  ┌───▼────────────────────────────────┐  │ │ │  │
│  │  │  │  │  Canvas Subsystems                 │  │ │ │  │
│  │  │  │  │  ┌────────────┐ ┌───────────────┐  │  │ │ │  │
│  │  │  │  │  │ Orbit      │ │ Sprite        │  │  │ │ │  │
│  │  │  │  │  │ Physics    │ │ Engine        │  │  │ │ │  │
│  │  │  │  │  │ Engine     │ │ + Portal      │  │  │ │ │  │
│  │  │  │  │  └────────────┘ └───────────────┘  │  │ │ │  │
│  │  │  │  └────────────────────────────────────┘  │ │ │  │
│  │  │  │  ┌────────────┐ ┌─────────────────────┐ │ │ │  │
│  │  │  │  │ Journal    │ │ Blog / MDX Viewer   │ │ │ │  │
│  │  │  │  │ Bento Grid │ │ + Syntax Highlight  │ │ │ │  │
│  │  │  │  └────────────┘ └─────────────────────┘ │ │ │  │
│  │  │  │  ┌─────────────────────────────────────┐ │ │ │  │
│  │  │  │  │ Contact Hub + Terminal Ping Widget  │ │ │ │  │
│  │  │  │  └─────────────────────────────────────┘ │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  └───────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│              ┌───────────▼────────────┐                  │
│              │   Data Layer           │                  │
│              │   (Static JSON/MDX)    │                  │
│              └───────────┬────────────┘                  │
└──────────────────────────┼───────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Optional Backend API   │
              │  ┌──────────────────┐   │
              │  │ /api/contact     │   │
              │  │ /api/ping (WS)   │   │
              │  └──────────────────┘   │
              └─────────────────────────┘
```

### Rendering Pipeline (Per Frame)

```
requestAnimationFrame Loop
    │
    ├── 1. Clear Canvas
    ├── 2. Update Physics State
    │       ├── Calculate parametric elliptical positions (θ += ω·dt)
    │       ├── Apply mouse proximity repulsion vectors
    │       ├── Apply spring-damping restitution forces
    │       └── Integrate velocity → position (Verlet/Euler)
    ├── 3. Render Orbit Tracks (faint SVG-style ellipses)
    ├── 4. Render Orbiting Icons (with glow + shadow)
    ├── 5. Render Portal Effect (if active)
    │       ├── Neon vertical door frame
    │       ├── Particle sparks (radial burst)
    │       └── Dissolve animation (opacity fade)
    ├── 6. Render Floating Island
    │       ├── Platform with sine-wave bobbing
    │       └── Shadow projection
    ├── 7. Render Sprite Character
    │       ├── Current animation frame from sprite sheet
    │       ├── Speech bubble (if dialogue active)
    │       └── Idle breathing animation
    └── 8. Composite to Screen
```

### Scroll Orchestration Flow

```
Scroll Position (0% → 100%)
    │
    ├── 0%-15%:   Hero fully visible, orbits active, sprite interactive
    ├── 15%-25%:  Hero compresses (scale 1→0.85, opacity 1→0),
    │             sprite transitions to floating dock
    ├── 25%-45%:  Projects section reveals (staggered card entrance)
    ├── 45%-65%:  Experience timeline pins left column,
    │             right column scrolls through career cards
    ├── 65%-80%:  Learning Journal bento grid cascades in
    ├── 80%-90%:  Blog section editorial fade-in
    └── 90%-100%: Contact hub slides up, terminal ping widget activates
```

---

## 4. Directory & Build Structure

```
MyFolio/
├── index.html                          # Vite entry HTML
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.node.json                  # Node-specific TS config
├── vite.config.ts                      # Vite build configuration
├── tailwind.config.ts                  # Tailwind theme tokens
├── postcss.config.js                   # PostCSS (Tailwind + Autoprefixer)
├── .env.example                        # Environment variable template
├── .eslintrc.cjs                       # ESLint configuration
├── .prettierrc                         # Prettier formatting rules
├── README.md                           # Project documentation
├── ARCHITECTURE.md                     # Detailed architecture docs
├── DESIGN_SYSTEM.md                    # Design tokens & guidelines
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                    # Open Graph social preview
│   ├── robots.txt
│   ├── sitemap.xml
│   └── fonts/                          # Self-hosted Google Fonts (WOFF2)
│       ├── cormorant-garamond/
│       ├── bebas-neue/
│       ├── plus-jakarta-sans/
│       └── press-start-2p/
│
├── src/
│   ├── main.tsx                        # React DOM entry point
│   ├── App.tsx                         # Root component + router/scroll
│   ├── index.css                       # Tailwind directives + CSS vars
│   ├── vite-env.d.ts                   # Vite type declarations
│   │
│   ├── config/
│   │   ├── site.config.ts              # Site metadata (name, title, socials)
│   │   ├── theme.config.ts             # Theme CSS variable mappings
│   │   └── navigation.config.ts        # Section IDs & nav labels
│   │
│   ├── types/
│   │   ├── project.types.ts            # Project card data model
│   │   ├── experience.types.ts         # Career timeline data model
│   │   ├── journal.types.ts            # Learning journal entry model
│   │   ├── blog.types.ts               # Blog post metadata model
│   │   ├── sprite.types.ts             # Sprite animation state types
│   │   ├── orbit.types.ts              # Orbit physics body types
│   │   └── dialogue.types.ts           # Dialogue tree & OSINT types
│   │
│   ├── data/
│   │   ├── projects.data.ts            # Projects collection
│   │   ├── experience.data.ts          # Career timeline entries
│   │   ├── journal.data.ts             # Learning journal entries
│   │   ├── skills.data.ts              # Skills taxonomy (Red/Blue/Dev/DevOps)
│   │   ├── dialogue-trees.data.ts      # Sprite conversation scripts
│   │   └── blog/                       # Markdown blog posts
│   │       ├── _index.ts               # Blog post registry
│   │       ├── resilient-b2b-backends.md
│   │       ├── adversary-emulation-linux.md
│   │       └── weekend-tinkering-leds.md
│   │
│   ├── hooks/
│   │   ├── useTheme.ts                 # Light/Dark mode toggle
│   │   ├── useScrollProgress.ts        # Normalized scroll position
│   │   ├── useMousePosition.ts         # Debounced mouse coordinates
│   │   ├── useMediaQuery.ts            # Responsive breakpoint detection
│   │   ├── useCanvasResize.ts          # Canvas DPI-aware resizing
│   │   ├── useClientOSINT.ts           # GPU, battery, viewport telemetry
│   │   ├── useIntersection.ts          # Intersection Observer wrapper
│   │   └── useReducedMotion.ts         # prefers-reduced-motion respect
│   │
│   ├── contexts/
│   │   ├── ThemeContext.tsx             # Theme state provider
│   │   └── SpriteContext.tsx           # Global sprite state (dock/expand)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Fixed top nav with scroll progress
│   │   │   ├── Footer.tsx              # Minimal footer with GPG badge
│   │   │   ├── ScrollProgress.tsx      # Top progress bar indicator
│   │   │   └── SectionWrapper.tsx      # Reusable section container
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Base button variants
│   │   │   ├── Badge.tsx               # Tech/status badge component
│   │   │   ├── Pill.tsx                # Category pill (clickable)
│   │   │   ├── Card.tsx                # Base card with hover states
│   │   │   ├── Modal.tsx               # Overlay modal (blog reader/demo)
│   │   │   ├── Toast.tsx               # Notification toast system
│   │   │   ├── Tooltip.tsx             # Hover tooltip
│   │   │   ├── TerminalBlock.tsx       # Terminal-style code display
│   │   │   ├── MarkdownRenderer.tsx    # MDX/Markdown → React renderer
│   │   │   └── IconBadge.tsx           # Iconify-powered tech icon + label
│   │   │
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx         # Hero orchestrator (all layers)
│   │   │   ├── HeroCanvas.tsx          # Canvas element + RAF loop
│   │   │   ├── BackdropSerif.tsx       # "Hey, there." background text
│   │   │   ├── SubjectCutout.tsx       # Portrait with gradient mask
│   │   │   ├── HeadlineTypography.tsx  # "I AM [NAME]" headline block
│   │   │   └── SpriteIsland.tsx        # Floating island + sprite mount
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectsSection.tsx     # Section container + grid
│   │   │   ├── ProjectCard.tsx         # Individual project card
│   │   │   ├── ProjectModal.tsx        # Expanded project detail view
│   │   │   └── TechBadgeRow.tsx        # Iconify tech stack badges
│   │   │
│   │   ├── experience/
│   │   │   ├── ExperienceSection.tsx   # Split-screen sticky section
│   │   │   ├── StickyOverview.tsx      # Left column (domains + CV)
│   │   │   ├── TimelineCard.tsx        # Individual career entry
│   │   │   └── ExpandableWins.tsx      # Accordion for key wins
│   │   │
│   │   ├── journal/
│   │   │   ├── JournalSection.tsx      # Learning journal container
│   │   │   ├── JournalFilterBar.tsx    # Tag filter pills
│   │   │   ├── JournalCard.tsx         # Bento-style journal entry
│   │   │   └── TerminalSnippet.tsx     # Copy-able terminal block
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogSection.tsx         # Blog feed layout
│   │   │   ├── BlogPreviewCard.tsx     # Article preview card
│   │   │   ├── BlogReader.tsx          # Full article modal/route
│   │   │   └── ReadProgressBar.tsx     # Article read progress indicator
│   │   │
│   │   └── contact/
│   │       ├── ContactSection.tsx      # Contact hub container
│   │       ├── ContactForm.tsx         # Validated contact form
│   │       ├── QuickConnect.tsx        # Direct channel links
│   │       └── PingTerminal.tsx        # Interactive ping widget
│   │
│   ├── canvas/
│   │   ├── OrbitEngine.ts              # Dual-galaxy orbit physics core
│   │   ├── OrbitRenderer.ts            # Canvas draw calls for orbits
│   │   ├── OrbitBody.ts               # Individual orbiting body class
│   │   ├── GravityField.ts            # Mouse repulsion force field
│   │   ├── SpriteEngine.ts            # Pixel-art sprite state machine
│   │   ├── SpriteRenderer.ts          # Sprite sheet frame renderer
│   │   ├── PortalEffect.ts            # Teleport door + particles
│   │   ├── ParticleSystem.ts          # Reusable particle emitter
│   │   ├── FloatingIsland.ts          # Bobbing platform renderer
│   │   └── CanvasManager.ts           # RAF loop, resize, DPI manager
│   │
│   ├── lib/
│   │   ├── math.ts                     # Vector2D, lerp, clamp, easing
│   │   ├── osint.ts                    # Client telemetry collectors
│   │   ├── markdown.ts                 # Markdown parsing utilities
│   │   └── clipboard.ts               # Copy-to-clipboard helper
│   │
│   └── assets/
│       ├── images/
│       │   ├── portrait-cutout.png     # Developer portrait (alpha)
│       │   └── project-mockups/        # Project screenshots
│       ├── sprites/
│       │   ├── Pose.png                # 1792×786 — Idle/Back/Left/Right
│       │   ├── Actions.png             # 1792×743 — ThumbsUp/Wave/Smile/Jump
│       │   └── Runing.png              # 1792×695 — WalkFront×2/RunLeft/RunRight
│       └── icons/
│           └── orbit-icons/            # Pre-rendered orbit tool icons
│
├── server/                             # Optional Node.js backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                    # Express server entry
│   │   ├── routes/
│   │   │   ├── contact.route.ts        # POST /api/contact
│   │   │   └── ping.route.ts          # WS /api/ping
│   │   ├── middleware/
│   │   │   ├── rateLimit.ts            # Rate limiting
│   │   │   └── validation.ts          # Input sanitization
│   │   └── services/
│   │       ├── email.service.ts        # Email dispatch (Nodemailer/Resend)
│   │       └── ping.service.ts        # WebSocket ping handler
│   └── .env.example
│
└── docs/                               # Extended documentation
    ├── CONTRIBUTING.md
    ├── CHANGELOG.md
    └── diagrams/
        ├── component-tree.svg
        └── physics-flow.svg
```

---

## 5. Design System Specification

### Color Tokens

#### Light Theme

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#FFFDF7` | Page background |
| `--bg-secondary` | `#F4EBD9` | Card/section backgrounds |
| `--bg-tertiary` | `#EDE4D3` | Hover states, nested cards |
| `--text-primary` | `#111827` | Headlines, primary text |
| `--text-secondary` | `#4B5563` | Body text, descriptions |
| `--text-muted` | `#9CA3AF` | Captions, timestamps |
| `--border-subtle` | `rgba(212, 212, 216, 0.6)` | Card borders |
| `--accent-amber` | `#F59E0B` | Telemetry badges, highlights |
| `--accent-emerald` | `#10B981` | Status: shipped/online |
| `--accent-red` | `#EF4444` | Status: critical, Red Team |
| `--accent-cyan` | `#06B6D4` | Blue Team, systems accent |

#### Dark / Cyber Mode

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0B0F19` | Page background |
| `--bg-secondary` | `#111827` | Card backgrounds |
| `--bg-tertiary` | `#1E293B` | Nested elements |
| `--text-primary` | `#F9FAFB` | Headlines |
| `--text-secondary` | `#D1D5DB` | Body text |
| `--glow-amber` | `rgba(245, 158, 11, 0.08)` | Ambient radial glow |
| `--glow-cyan` | `rgba(6, 182, 212, 0.08)` | Ambient radial glow |
| `--border-subtle` | `rgba(148, 163, 184, 0.15)` | Card borders |

### Typography Scale

| Role | Font Family | Weight | Size (Desktop) | Size (Mobile) |
|---|---|---|---|---|
| Backdrop Serif | Cormorant Garamond | 300 | 12vw / 180px max | 20vw |
| Section Headers | Bebas Neue | 400 | 4rem (64px) | 2.5rem (40px) |
| Sub-Headers | Plus Jakarta Sans | 700 | 1.5rem (24px) | 1.25rem (20px) |
| Body | Plus Jakarta Sans | 400 | 1rem (16px) | 0.9375rem (15px) |
| Caption/Meta | Plus Jakarta Sans | 500 | 0.875rem (14px) | 0.8125rem (13px) |
| Terminal/Code | Press Start 2P | 400 | 0.625rem (10px) | 0.5rem (8px) |
| Telemetry Badge | JetBrains Mono | 500 | 0.75rem (12px) | 0.6875rem (11px) |

### Spacing Scale (Tailwind Extensions)

```
section-gap:     clamp(4rem, 8vw, 8rem)     // Between major sections
card-padding:    clamp(1.5rem, 3vw, 2.5rem) // Internal card padding
grid-gap:        clamp(1rem, 2vw, 1.5rem)   // Grid item gaps
```

### Elevation & Shadows

| Level | Shadow | Usage |
|---|---|---|
| Level 0 | None | Flat elements |
| Level 1 | `0 1px 3px rgba(0,0,0,0.08)` | Subtle cards |
| Level 2 | `0 4px 16px rgba(0,0,0,0.10)` | Elevated cards, modals |
| Level 3 | `0 8px 32px rgba(0,0,0,0.15)` | Floating elements, sprite island |
| Glow | `0 0 60px var(--glow-amber)` | Ambient background glows |

---

## 6. Section-by-Section Implementation Plan

### Section 1: Hero Landing Page

**Complexity**: ★★★★★ (Highest)

#### Layer Architecture

```
z-index stacking:
  Layer 0: Background Gradient + Orbit Tracks     (z-0)
  Layer 1: Canvas - Dual Galaxy Orbits             (z-10)
  Layer 2: Backdrop Serif ("Hey, there.")          (z-20)
  Layer 3: Subject Cutout (Portrait)               (z-30)
  Layer 4: Headline Typography                     (z-40)
  Layer 5: Floating Island + Sprite                (z-50)
```

#### Implementation Details

1. **Background Layer**: CSS radial gradient with animated opacity pulsing
2. **Canvas Layer**: Full-viewport `<canvas>` element, DPI-aware (2x/3x), running at 60fps
3. **Backdrop Serif**: Absolutely positioned, `mix-blend-mode: overlay`, subtle opacity
4. **Portrait**: `<img>` with CSS `mask-image` gradient (bottom fade to transparent)
5. **Headlines**: Positioned over portrait, Framer Motion entrance animation
6. **Sprite Island**: Canvas-rendered floating platform at bottom-right of hero

#### Anti-Gravity Orbit Specifications

- **Left Galaxy Center**: `(25vw, 50vh)` — Red Team & Core Tools
- **Right Galaxy Center**: `(75vw, 50vh)` — Blue Team, DevOps & Systems
- **Orbit Bodies**: 5-6 per galaxy, each with:
  - Parametric position: `x = cx + a·cos(θ)·cos(φ) − b·sin(θ)·sin(φ)`
  - `y = cy + a·cos(θ)·sin(φ) + b·sin(θ)·cos(φ)`
  - Where `φ` is orbit inclination angle, `a` and `b` are semi-axes
- **Mouse Repulsion**: When cursor within 150px radius, apply radial force `F = k / d²` capped at max force
- **Spring Return**: After mouse leaves, `F_spring = -k_s · (pos - target) - damping · velocity`

#### Portal Spawn Sequence (Timeline)

| Time | Event |
|---|---|
| 0.0s | Page load complete |
| 0.5s | Neon vertical rectangle fades in at sprite spawn point |
| 1.0s | Portal glow intensifies, particle sparks emit radially |
| 1.5s | Sprite walks out of portal onto floating island |
| 2.0s | Portal dissolves (opacity → 0, width → 0) |
| 2.5s | Sprite plays idle animation, first speech bubble appears |

---

### Section 2: Projects Showcase

**Complexity**: ★★★☆☆

#### Layout Specification

```
Desktop (≥1024px):
┌─────────────────────────────────────────┐
│  ┌──────────────────┐ ┌──────────────┐  │
│  │                  │ │              │  │
│  │   PROJECT 1      │ │  PROJECT 2   │  │
│  │   (large)        │ │  (medium)    │  │
│  │   col-span-2     │ │  col-span-1  │  │
│  └──────────────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌──────────────────┐  │
│  │              │ │                  │  │
│  │  PROJECT 3   │ │   PROJECT 4      │  │
│  │  (medium)    │ │   (large)        │  │
│  │  col-span-1  │ │   col-span-2     │  │
│  └──────────────┘ └──────────────────┘  │
└─────────────────────────────────────────┘
```

#### Card Animation Behavior
- **Scroll Entry**: `opacity: 0 → 1`, `translateY: 40px → 0`, staggered 100ms per card
- **Hover**: Scale 1.02, shadow elevation Level 2 → Level 3, border glow
- **Click**: Opens `ProjectModal` with full details and live demo iframe

---

### Section 3: Experience Timeline

**Complexity**: ★★★★☆

#### Sticky Split Layout

```
┌──────────────────┬──────────────────────┐
│                  │                      │
│  STICKY LEFT     │  SCROLLABLE RIGHT    │
│  ────────────    │  ──────────────────  │
│                  │                      │
│  Domain Icons    │  ┌────────────────┐  │
│  ┌──────────┐    │  │ Role Title     │  │
│  │ ⚔️ Offense │    │  │ Company • Date │  │
│  │ 🛡️ Defense │    │  │ Deliverables   │  │
│  │ 🔧 Systems │    │  │ ▸ Expand Wins  │  │
│  │ 📊 Monitor │    │  └────────────────┘  │
│  └──────────┘    │                      │
│                  │  ┌────────────────┐  │
│  Download CV     │  │ Role Title     │  │
│  GPG Verify      │  │ ...            │  │
│                  │  └────────────────┘  │
│  (position:      │                      │
│   sticky;        │  ┌────────────────┐  │
│   top: 5rem)     │  │ Role Title     │  │
│                  │  │ ...            │  │
└──────────────────┴──────────────────────┘
```

---

### Section 4: Learning Journal (Bento Grid)

**Complexity**: ★★★☆☆

#### Bento Layout

```
┌───────┬───────────────┬───────┐
│       │               │       │
│  1x1  │     2x1       │  1x1  │
│       │               │       │
├───────┼───────┬───────┼───────┤
│       │       │       │       │
│  1x1  │  1x1  │  1x1  │  1x1  │
│       │       │       │       │
├───────┴───────┼───────┴───────┤
│               │               │
│     2x1       │     2x1       │
│               │               │
└───────────────┴───────────────┘
```

---

### Section 5: Blog Feed

**Complexity**: ★★☆☆☆

- Multi-column magazine layout (3 cols desktop, 1 col mobile)
- Featured post spans full width at top
- Article reader: Modal overlay with read progress bar
- Syntax highlighting via `react-syntax-highlighter`

---

### Section 6: Contact Hub

**Complexity**: ★★★☆☆

- Form: Name, Email, Subject, Message with Zod validation
- Quick Connect: Icon grid (PGP, LinkedIn, GitHub, Email, Matrix)
- Ping Terminal: Simulated WebSocket handshake animation

---

## 7. Physics Engine Specification

### Core Classes

#### `Vector2D`
```typescript
class Vector2D {
  x: number;
  y: number;
  add(v: Vector2D): Vector2D;
  sub(v: Vector2D): Vector2D;
  scale(s: number): Vector2D;
  magnitude(): number;
  normalize(): Vector2D;
  distanceTo(v: Vector2D): number;
  static lerp(a: Vector2D, b: Vector2D, t: number): Vector2D;
}
```

#### `OrbitBody`
```typescript
interface OrbitBodyConfig {
  icon: string;            // Iconify icon identifier
  label: string;           // Display name
  semiMajor: number;       // Ellipse semi-major axis (px)
  semiMinor: number;       // Ellipse semi-minor axis (px)
  inclination: number;     // Orbit tilt angle (radians)
  angularVelocity: number; // Base rotation speed (rad/s)
  phase: number;           // Starting angle offset
  size: number;            // Rendered icon size (px)
  galaxy: 'left' | 'right';
}

class OrbitBody {
  position: Vector2D;      // Current world position
  velocity: Vector2D;      // Current velocity (for physics)
  targetPosition: Vector2D;// Parametric target (no perturbation)
  theta: number;           // Current angle in orbit
  isDragging: boolean;
  dragVelocity: Vector2D;
  
  update(dt: number, mousePos: Vector2D, mouseActive: boolean): void;
  applyRepulsion(mousePos: Vector2D, radius: number, strength: number): void;
  applySpringReturn(stiffness: number, damping: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}
```

#### Physics Constants

| Constant | Value | Description |
|---|---|---|
| `REPULSION_RADIUS` | 150px | Mouse influence radius |
| `REPULSION_STRENGTH` | 8000 | Force multiplier |
| `SPRING_STIFFNESS` | 0.03 | Return-to-orbit spring k |
| `SPRING_DAMPING` | 0.85 | Velocity damping factor |
| `MAX_FORCE` | 50 | Force cap per frame |
| `DRAG_THROW_DECAY` | 0.95 | Drag release momentum decay |

---

## 8. Sprite Engine Specification

### Animation State Machine (Mapped to Actual Assets)

```
                         ┌───────────────────┐
            ┌───────────►│   IDLE_FRONT       │◄────────────┐
            │            │   (Pose.png #0)    │             │
            │            └───────┬────────────┘             │
            │                    │                          │
       timeout(5s)          click / event              timeout(3s)
            │                    │                          │
            │       ┌────────────▼────────────┐             │
            │       │   State Router          │             │
            │       └─┬──────┬──────┬──────┬──┘             │
            │         │      │      │      │                │
            │    greet │  talk │  sys │  sec │               │
            │         │      │      │      │                │
     ┌──────┴──┐  ┌───▼──┐ ┌▼────┐ ┌▼────┐ ┌──────┐       │
     │  LOOK   │  │ WAVE │ │TALK │ │THINK│ │THUMBS│       │
     │  LEFT   │  │      │ │(big │ │(look│ │  UP  │───────┘
     │(Pose #2)│  │(Act  │ │smile│ │left)│ │(Act  │
     └────┬────┘  │ #1)  │ │Act  │ │Pose │ │ #0)  │
          │       └──┬───┘ │ #2) │ │ #2) │ └──────┘
     timeout(3s)     │     └──┬──┘ └──┬──┘
          │       timeout     │       │
          │          │     timeout  timeout
     ┌────▼────┐     │        │       │
     │  LOOK   │     └────────┴───────┘
     │  RIGHT  │              │
     │(Pose #3)│         ┌────▼────┐
     └────┬────┘         │IDLE_FRONT│
          │              └─────────┘
          └──────────────────┘

   ── Portal Spawn Sequence (on page load) ──

     ┌──────────┐    ┌──────────────┐    ┌──────────┐
     │ RUN_RIGHT│───►│ WALK_FRONT_A │───►│ IDLE_FRONT│
     │(Run #3)  │    │ (Run #0/#1   │    │(Pose #0)  │
     │ enter    │    │  alternating)│    │ settle    │
     └──────────┘    └──────────────┘    └──────────┘

   ── Dialogue Category → Animation Mapping ──

     🛰️ Systems       → THINK (Pose #2)  then THUMBS_UP (Act #0)
     🤖 AI & Models   → THINK (Pose #2)  then BIG_SMILE (Act #2)
     ⚔️ Sec           → LOOK_LEFT (Pose #2) then LOOK_RIGHT (Pose #3)
     ☕ Slice of Life  → WAVE (Act #1)   then JUMP (Act #3)
     🔍 Telemetry     → LOOK_LEFT (Pose #2) then THUMBS_UP (Act #0)
```

### Sprite Sheet Format (Actual Assets)

The sprite is a **chibi-cartoon character** (not pixel-art) — floral button-up shirt, sunglasses, watch, dark jeans, sneakers. High-res RGBA PNGs with transparent backgrounds.

All sheets are **horizontal strips of 4 frames** at 1792px total width.

| Sheet File | Dimensions | Frame Size | Frames | Description |
|---|---|---|---|---|
| `Pose.png` | 1792×786 | 448×786 | 4 | **Idle / Back / Left / Right** — directional standing poses |
| `Actions.png` | 1792×743 | 448×743 | 4 | **Thumbs-up / Wave / Big Smile / Jump** — expressive actions |
| `Runing.png` | 1792×695 | 448×695 | 4 | **Walk Front / Walk Front-Alt / Run Left / Run Right** — locomotion cycle |

#### Frame Index Maps

```typescript
// Pose.png frame indices
const POSE_FRAMES = {
  IDLE_FRONT: 0,    // Facing camera, neutral smile
  IDLE_BACK:  1,    // Back view
  IDLE_LEFT:  2,    // 3/4 left view, slight smile
  IDLE_RIGHT: 3,    // 3/4 right view, grin
} as const;

// Actions.png frame indices
const ACTION_FRAMES = {
  THUMBS_UP:  0,    // Thumbs up, confident pose
  WAVE:       1,    // Right hand wave greeting
  BIG_SMILE:  2,    // Arms at sides, wide grin
  JUMP:       3,    // Both arms raised, airborne, excited
} as const;

// Runing.png frame indices
const RUNNING_FRAMES = {
  WALK_FRONT_A: 0,  // Walking toward camera, left foot forward
  WALK_FRONT_B: 1,  // Walking toward camera, right foot forward
  RUN_LEFT:     2,  // Full sprint profile, facing left
  RUN_RIGHT:    3,  // Full sprint profile, facing right
} as const;
```

#### Rendering Notes
- Render size on screen: **~120–160px tall** (scaled down from 695–786px native)
- Canvas rendering: use `ctx.drawImage(sheet, frameIndex * frameWidth, 0, frameWidth, frameHeight, dx, dy, renderWidth, renderHeight)`
- Animation framerate: **6 FPS** (167ms per frame) for smooth chibi movement
- The varying heights (695–786px) mean each sheet needs its own `frameHeight` constant

### Speech Bubble System
- Max width: 240px
- Typewriter effect: 30ms per character
- Auto-dismiss: 5 seconds after complete
- Position: Above sprite, centered, with tail pointing down

---

## 9. Data Architecture

### Projects Data Model

```typescript
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  techStack: TechBadge[];
  challenges: string[];
  highlights: string[];
  mockupImage: string;
  architectureDiagram?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  gridSpan: 1 | 2;           // Column span in grid
  date: string;
}

type ProjectCategory = 
  | 'B2B SaaS' 
  | 'Clinic Management / PWA' 
  | 'Observability Pipeline' 
  | 'AI Voice Assistant'
  | 'Security Tooling'
  | 'Infrastructure';

interface TechBadge {
  name: string;
  icon: string;              // Iconify icon identifier
  color: string;             // Badge accent color
}
```

### Experience Data Model

```typescript
interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  platform?: string;
  startDate: string;
  endDate: string | 'Present';
  type: 'full-time' | 'contract' | 'freelance' | 'research';
  domain: ('offensive' | 'defensive' | 'systems' | 'monitoring')[];
  deliverables: string[];
  keyWins: string[];
  techUsed: string[];
}
```

### Learning Journal Entry Model

```typescript
interface JournalEntry {
  id: string;
  title: string;
  date: string;
  status: 'IN PROGRESS' | 'SHIPPED' | 'PROTOTYPE' | 'ARCHIVED';
  tags: JournalTag[];
  summary: string;
  terminalSnippet?: {
    language: string;
    code: string;
  };
  gridSpan?: { cols: 1 | 2; rows: 1 | 2 };
}

type JournalTag = 
  | 'Systems & Kernel' 
  | 'Hardware & Microcontrollers' 
  | 'AI & Local Models' 
  | 'CTF & Exploits';
```

### Blog Post Model

```typescript
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;           // Raw Markdown/MDX
  publishedDate: string;
  readTimeMinutes: number;
  category: string;
  tags: string[];
  featured: boolean;
  coverImage?: string;
}
```

---

## 10. Responsive Strategy

### Breakpoint System

| Breakpoint | Width | Adaptations |
|---|---|---|
| `xs` | < 480px | Single column everything, reduced sprite |
| `sm` | 480-639px | Compact cards, simplified orbit |
| `md` | 640-767px | Transitional layouts |
| `lg` | 768-1023px | Tablet: merged orbit halo |
| `xl` | 1024-1279px | Desktop: full dual-galaxy |
| `2xl` | ≥ 1280px | Wide desktop: maximum spacing |

### Mobile-Specific Adaptations (< 768px)

| Component | Desktop | Mobile |
|---|---|---|
| Orbits | Dual galaxies (L/R) | Single merged halo ring above portrait |
| Sprite | Bottom-right floating island | Toggleable FAB (bottom-right corner) |
| Projects | Asymmetric 3-col grid | Single-col swipeable cards |
| Experience | Split sticky layout | Stacked: overview → timeline |
| Journal | 4-col bento grid | 1-col stacked cards |
| Blog | 3-col magazine | 1-col feed |
| Contact | Side-by-side form + links | Stacked: form → quick connect |

### Touch Interaction Mapping

| Desktop | Mobile |
|---|---|
| Mouse hover → card elevation | Touch-and-hold → elevation |
| Mouse proximity → orbit repulsion | Touch point → orbit repulsion |
| Drag-and-throw orbit bodies | Touch-drag → throw |
| Scroll-driven pinned sections | Normal scroll (no pin on mobile) |

---

## 11. Performance & Optimization

### Canvas Performance

| Technique | Implementation |
|---|---|
| **DPI Scaling** | `canvas.width = rect.width * devicePixelRatio; ctx.scale(dpr, dpr)` |
| **Offscreen Buffers** | Pre-render static elements (orbit tracks, island) to offscreen canvas |
| **Icon Caching** | Render each tech icon once to ImageBitmap, reuse in draw loop |
| **RAF Cleanup** | `cancelAnimationFrame` on component unmount |
| **Reduced Motion** | Skip canvas animations if `prefers-reduced-motion: reduce` |
| **Visibility API** | Pause RAF loop when tab is not visible |
| **Frame Budget** | Target 16ms frame time; skip physics sub-steps if behind |

### Bundle Optimization

| Technique | Target |
|---|---|
| **Code Splitting** | Route-based lazy loading for Blog reader |
| **Tree Shaking** | Named imports from Iconify, Framer Motion |
| **Font Subsetting** | WOFF2 with Latin subset only (~20-40KB per font) |
| **Image Optimization** | WebP/AVIF with `<picture>` fallbacks |
| **Sprite Sheet Packing** | Single PNG atlas per animation set |

### Lighthouse Targets

| Metric | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TTI | < 3.5s |

---

## 12. Deployment Pipeline

### Build & Deploy Flow

```
Local Development
    │
    ├── `pnpm dev`         → Vite HMR dev server (port 5173)
    ├── `pnpm lint`        → ESLint + TypeScript checks
    ├── `pnpm build`       → Production bundle
    └── `pnpm preview`     → Local production preview
          │
          ▼
GitHub Repository
    │
    ├── Push to `main`     → Trigger CI/CD
    ├── PR to `main`       → Preview deployment
    │
    ▼
CI/CD Pipeline (GitHub Actions)
    │
    ├── Install dependencies (pnpm)
    ├── TypeScript type check
    ├── ESLint lint pass
    ├── Build production bundle
    ├── Lighthouse CI audit
    └── Deploy to hosting
          │
          ▼
Hosting (Vercel / Netlify / Cloudflare Pages)
    │
    ├── Edge CDN distribution
    ├── Automatic HTTPS
    ├── Preview URLs per PR
    └── Environment variables for API keys
```

---

## 13. Phase Breakdown & Milestones

### Phase 1: Foundation (Days 1-3)
- [x] Project scaffolding (Vite + React + TypeScript)
- [ ] Tailwind configuration with custom tokens
- [ ] Font loading and typography system
- [ ] Theme provider (light/dark)
- [ ] Layout shell (Navbar, Footer, SectionWrapper)
- [ ] Base UI components (Button, Badge, Card, Pill)

### Phase 2: Hero & Physics Engine (Days 4-8)
- [ ] Canvas setup with DPI-aware resizing
- [ ] Vector2D math library
- [ ] OrbitBody class with parametric elliptical motion
- [ ] Dual-galaxy orbit system (Left: Red Team, Right: Blue Team)
- [ ] Mouse repulsion physics
- [ ] Spring-damping restitution
- [ ] Drag-and-throw momentum
- [ ] Hero layer composition (backdrop, portrait, headlines)
- [ ] Portal spawn animation sequence
- [ ] Sprite engine state machine
- [ ] Speech bubble system + dialogue trees
- [ ] Client OSINT telemetry (GPU, battery, viewport)

### Phase 3: Content Sections (Days 9-12)
- [ ] Projects section: data, cards, grid, modal
- [ ] Experience section: sticky split layout, timeline cards
- [ ] Learning Journal: bento grid, filter system
- [ ] Blog section: feed layout, markdown reader
- [ ] Contact section: form, quick connect, ping terminal

### Phase 4: Animation & Polish (Days 13-15)
- [ ] Framer Motion scroll-driven reveals (all sections)
- [ ] Section transition animations
- [ ] Sprite dock/expand on scroll
- [ ] Micro-interactions (hover, click, focus states)
- [ ] Toast notification system
- [ ] Loading states and skeleton screens

### Phase 5: Responsive & Accessibility (Days 16-17)
- [ ] Mobile orbit merge (single halo ring)
- [ ] Sprite → FAB on mobile
- [ ] Touch interaction mapping
- [ ] Grid collapse for all sections
- [ ] `prefers-reduced-motion` support
- [ ] ARIA labels, keyboard navigation
- [ ] Screen reader testing

### Phase 6: Performance & Deploy (Days 18-20)
- [ ] Bundle analysis and optimization
- [ ] Font subsetting
- [ ] Image optimization (WebP/AVIF)
- [ ] Lighthouse audit and fixes
- [ ] CI/CD pipeline setup
- [ ] Production deployment
- [ ] Final QA pass

---

> [!IMPORTANT]
> This plan is designed as a **living document**. Each phase will produce working, deployable code. The architecture supports incremental enhancement — the site is fully functional after Phase 3, with Phases 4-6 adding progressive polish.
