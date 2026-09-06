# Digital Bahir Dar — Design System

> Generated via uiuxdesign skill · living document for product, engineering, and design.

---

## 1. Overview

| Field | Detail |
|---|---|
| **Product** | Digital Bahir Dar — smart-city tourism, navigation & AI travel for Bahir Dar, Ethiopia |
| **Audience** | First-time visitors, diaspora returnees, local explorers; EN + Amharic |
| **Value** | One place to know *where to go*, *what it costs*, and *how to get around* |
| **Platform** | Responsive PWA (Vite + React 19 + Tailwind v4); mobile-first |
| **Tone** | Clear, calm, practical — Ethiopian flag cues without loud patriotism |

---

## 2. Information architecture

```
Home
├── Stay          → Hotels
├── Eat           → Restaurants
├── Go            → Transport
└── See           → Today / Attractions

Primary nav: Home · Map · Hotels · Attractions · Today · Planner · Explore ▾
Quick bar: Restaurants · Transport · Discover · Events · AI Guide · Budget
Mobile tab bar: Home · Explore · Map · Trips · Profile
```

Supporting surfaces: Directory, City, Todo, Spend Guide, Business, Auth, Admin.

---

## 3. Page layout patterns

| Pattern | Use |
|---|---|
| **Hero + glass cards** | Home — full-bleed photo, dual CTAs, Stay/Eat/Go/See tiles |
| **Timeline day plan** | Today — vertical rail + period chips + cost pills |
| **Directory list** | Hotels / Restaurants / Attractions — search, chips, PlaceCards |
| **Map + sheet** | Map — Mapbox/Leaflet + bottom sheet / filters |
| **Chat / form** | AI Guide, Trip Planner, Auth |
| **Settings stack** | Profile, Budget, Expenses |

**Shell**
- Sticky header (desktop dual row; mobile compact + drawer)
- `main#main-content` with bottom padding for tab bar (`pb-nav-safe`)
- Safe-area insets for notched devices
- Skip-to-content link for a11y

---

## 4. UI components

### Primitives (`src/components/ui`)
- **Button** — `default` (flag green), `secondary` (Tana blue), `outline`, `ghost`, `destructive`; sizes `sm` / `default` / `lg` / `icon`; 44px min touch targets; `active:scale-[0.97]`
- **Card** — 20px radius, soft border, dual-layer shadow; dark: `#1c1c1e`

### Domain
- **PlaceCard** — cover image, localized name, category chip, rating/cost
- **PlaceBottomSheet** — map selection detail
- **GlobalSearch** — command-style search with keyboard shortcut affordance
- **InstallPrompt / OfflineBanner** — PWA chrome
- **ThemeLangControls** — light/dark + EN/አማ

### Layout
- Header, MobileNav, Layout (Outlet + SW + theme/lang sync)

---

## 5. Design tokens

Defined in `src/index.css` `@theme`:

### Color

| Token | Value | Role |
|---|---|---|
| `--color-ethio-green` | `#078930` | Primary CTA, active nav, success |
| `--color-ethio-green-dark` | `#056b24` | Hover / pressed green |
| `--color-ethio-gold` | `#f5c518` | Accent (Today badge, highlights) |
| `--color-ethio-gold-deep` | `#d4a017` | Gold text on light |
| `--color-ethio-red` | `#da121a` | Destructive / flag stripe |
| `--color-tana-blue` | `#0b6e99` | Secondary / water / Stay |
| `--color-tana-deep` | `#0a4d6e` | Deep blue gradients |
| `--color-coffee` | `#6f4e37` | Eat / warm accents |
| `--color-coffee-light` | `#c4a574` | Soft warm fills |
| `--color-injera` | `#f3e6c8` | Warm neutral surface |
| `--color-ios-bg` | `#f2f2f7` | App background (light) |
| `--color-ios-card` | `#ffffff` | Card surface |
| `--color-ios-label` | `#1c1c1e` | Primary text |
| `--color-ios-secondary` | `#8e8e93` | Secondary text |

**Dark mode:** body `#000000`, cards `#1c1c1e`, separators `white/8–12%`.

**Flag chrome:** thin top stripe green → yellow → red on header edge.

### Typography

| Context | Stack |
|---|---|
| Default | `-apple-system`, SF Pro Text, **Noto Sans Ethiopic**, Inter, system-ui |
| Amharic (`html.lang-am`) | Noto Sans Ethiopic first; line-height 1.55 body, 1.35 headings |

Scale (approximate):
- Display / hero: 2xl–4xl bold tracking-tight
- Page title: `text-2xl` / `sm:text-3xl` font-bold
- Body: 14–15px
- Meta / chips: 11–12px semibold

### Spacing & radius
- Page horizontal padding: `px-4` (16px)
- Section gaps: 24–32px
- Card radius: `1.25rem` (20px)
- Pills / buttons: full (`rounded-full`)
- Touch targets: ≥ 44×44px

### Elevation
```
Card: 0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.05)
Dark card: 0 4px 24px rgba(0,0,0,.35)
```

---

## 6. Responsive behavior

| Breakpoint | Behavior |
|---|---|
| **< lg** | Mobile header + hamburger drawer; bottom tab bar; stacked grids |
| **≥ lg** | Full primary nav + Explore dropdown; no tab bar; wider content max-widths |
| **Safe areas** | `pt-safe` / `pb-safe` / `pb-nav-safe` / FAB offsets |

Content max widths:
- Reading / forms: `max-w-2xl`
- Home / directories: full with responsive grids (`sm:grid-cols-2`, etc.)

---

## 7. Interaction patterns

| Pattern | Implementation |
|---|---|
| Press feedback | `active:scale-[0.97]` on buttons; `.ios-press` utility |
| Focus | `focus-visible:ring-2 ring-[#078930]/50` + offset |
| Route change | Mobile drawer closes; body scroll lock while open |
| Theme | Class on `html` (`dark`); meta theme-color updates |
| Language | `html.lang-am` + document lang; Noto Ethiopic stack |
| Reduced motion | Splash / card hover / press animations disabled |
| Offline | Banner; SW registration in Layout |
| PWA install | Soft prompt card |

---

## 8. Strengths

1. Clear **four-path** home mental model (Stay / Eat / Go / See)
2. Strong **Ethiopia-local palette** without kitsch
3. **iOS-like** density and glass chrome feels native on mobile
4. Real **bilingual** support (UI strings + place + Today plan content)
5. Practical tourism UX: costs, durations, map deep-links on every step

---

## 9. Recommended improvements

| Priority | Item |
|---|---|
| P0 | Prefer theme tokens (`bg-ethio-green`) over scattered hex in new code |
| P1 | Shared skeleton / empty-state components for list pages |
| P1 | Subtle page enter transition on `main` (respect reduced-motion) |
| P2 | Card hover lift utility for directory grids |
| P2 | Unify period/chip colors via token map (Today, filters) |
| P3 | Optional Framer Motion shared layout for tab transitions |
| P3 | Document Amharic line-length guidance for long place descriptions |

---

## 10. Component checklist (for new UI)

- [ ] Min 44px touch target
- [ ] Works in light + dark
- [ ] EN + Amharic copy (or data fields `*Am`)
- [ ] Focus-visible ring
- [ ] No motion if `prefers-reduced-motion`
- [ ] Safe-area aware if fixed to edges
- [ ] Uses Card / Button primitives before one-off styles

---

*Last updated: 2026-09-06 · matches live shell on bahirdar.sites.bd*
