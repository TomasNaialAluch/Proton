# Proton — SoundSystem Redesign

> **Portfolio project** — Frontend redesign of [Proton Radio](https://www.protonradio.com/) and [SoundSystem](https://soundsystem.protonradio.com/), built as a demonstration piece for a **Junior Frontend Developer** position.

**Author:** Tomás Naial Aluch — Electronic music producer on Proton Radio. The redesign is based on first-hand experience using the platform as an artist, which provides real insight into the pain points and UX opportunities that a regular developer wouldn't have.

This project combines a **B2B admin dashboard** (artist management, contracts, royalties) with a **B2C streaming platform** (radio, shows, charts). Built with a modern stack focused on performance, code quality, and scalability.

---

## What this project demonstrates

| Skill | How it's shown |
|---|---|
| **Next.js App Router** | Route groups `(public)` and `(dashboard)`, SSR for artist profiles |
| **TypeScript** | Typed data models for tracks, royalties, contracts |
| **Component architecture** | Reusable UI components with clear separation of concerns |
| **Design system** | Custom token-based palette and typography applied consistently |
| **State management** | Zustand for the global audio player |
| **Data fetching** | TanStack Query for dashboard metrics and tables |
| **Real-world context** | Redesign based on actual usage as a Proton Radio artist |

---

## Stack Tecnológico

### Core

| Tecnología | Rol | Por qué |
|---|---|---|
| **Next.js** (App Router) | Framework principal | SSR nativo, SEO para perfiles públicos de artistas, routing eficiente |
| **TypeScript** | Lenguaje | Seguridad de tipos crítica para el manejo de regalías y contratos |
| **Tailwind CSS** | Estilos | Design system consistente, dark mode, desarrollo responsive mobile-first |

### Data & Estado

| Tecnología | Rol | Por qué |
|---|---|---|
| **TanStack Query** | Server state | Caching automático para contratos y métricas; evita refetches innecesarios |
| **Zustand** | Client state | Estado global del reproductor de audio; liviano, sin interrupciones al navegar |

### UI & Visualización

| Tecnología | Rol | Por qué |
|---|---|---|
| **Lucide React** | Íconos | Minimalistas, livianos, optimizados para dark mode |
| **Recharts / Tremor** | Gráficos | Métricas de performance estilo "Spotify for Artists", fácil personalización |

---

## Sitios de Referencia

| Sitio | URL | Descripción |
|---|---|---|
| **Proton Radio** (actual) | [protonradio.com](https://www.protonradio.com/) | Área pública — radio en vivo, shows, charts |
| **SoundSystem** (actual) | [soundsystem.protonradio.com](https://soundsystem.protonradio.com/) | Dashboard privado de artistas — subida de tracks, contratos, regalías |

> El rediseño **unifica ambos sitios** bajo un único dominio y sistema de autenticación compartido.

---

## Estructura de Páginas

> **Idioma:** La plataforma es 100% en **inglés** — Proton Radio es una comunidad internacional de música electrónica.

### Public Area — `proton.radio` (Radio B2C)
Accessible to listeners and fans without an account. SSR-optimized for SEO.

| Route | Page | Status | Description |
|---|---|---|---|
| `/` | Home | ⬜ Blank | Live player + latest news and recent episodes |
| `/shows` | Shows | ⬜ Blank | Schedule grid and episode archive |
| `/charts` | Charts | ⬜ Blank | Top 100 tracks by genre (Melodic, Progressive, etc.) |
| `/labels` | Labels | ⬜ Blank | Directory of labels associated with Proton |
| `/[artist-name]` | Artist Profile | ⬜ Blank | Public bio + discography (e.g. `/naial`) |

---

### Private Area — `/dashboard` (SoundSystem B2B)
Requires authentication. Management panel for artists and producers.

| Route | Page | Status | Description |
|---|---|---|---|
| `/dashboard` | Home | ⬜ Blank | Artist profile, circular photo, quick access (Upload, Mixes) |
| `/dashboard/performance` | Performance | ⬜ Blank | Stream graphs, sales and listener heatmap |
| `/dashboard/releases` | Releases | ⬜ Blank | Uploaded tracks list with publication status |
| `/dashboard/contracts` | Contracts | ⬜ Blank | Signing timeline and pending contracts |
| `/dashboard/royalties` | Royalties | ⬜ Blank | Accumulated balance, payment history and payout settings |
| `/dashboard/settings` | Settings | ⬜ Blank | Personal details, contact info and account preferences |

---

### Global Components (Site-wide)

| Component | Description | Applies to |
|---|---|---|
| **Navbar** | Adapts based on context: public radio or private dashboard. Includes a **"For Artists"** button that links to `/login` → `/dashboard` | Entire site |
| **Global Player** | Persistent player — never interrupted while navigating | Entire site |
| **Auth Module** | Single login for listeners and artists | `/login`, `/register` |

---

## Arquitectura del Proyecto (Next.js App Router)

```
proton/
├── app/
│   ├── (public)/                   # Grupo: área pública de la radio
│   │   ├── page.tsx                # / — Home con reproductor en vivo
│   │   ├── shows/
│   │   │   └── page.tsx            # /shows
│   │   ├── charts/
│   │   │   └── page.tsx            # /charts
│   │   ├── labels/
│   │   │   └── page.tsx            # /labels
│   │   └── [artist-name]/
│   │       └── page.tsx            # /naial — Perfil público del artista
│   │
│   ├── (dashboard)/                # Grupo: panel privado (requiere auth)
│   │   ├── layout.tsx              # Layout con sidebar del dashboard
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # /dashboard — Inicio y perfil
│   │   │   ├── performance/
│   │   │   │   └── page.tsx        # /dashboard/performance
│   │   │   ├── releases/
│   │   │   │   └── page.tsx        # /dashboard/releases
│   │   │   ├── contracts/
│   │   │   │   └── page.tsx        # /dashboard/contracts
│   │   │   ├── royalties/
│   │   │   │   └── page.tsx        # /dashboard/royalties
│   │   │   └── settings/
│   │   │       └── page.tsx        # /dashboard/settings
│   │
│   ├── layout.tsx                  # Root layout (Global Player + Auth)
│   └── globals.css
│
├── components/
│   ├── ui/                         # Componentes base del Design System
│   ├── public/                     # Navbar pública, cards de shows, etc.
│   ├── dashboard/                  # Sidebar, métricas, tablas de releases
│   └── player/                     # Global Player (Zustand)
│
├── lib/
│   ├── api/                        # Fetchers con TanStack Query
│   └── store/                      # Stores de Zustand (player, auth)
│
├── types/                          # Tipos TypeScript globales
│   ├── artist.ts
│   ├── track.ts
│   ├── contract.ts
│   └── royalty.ts
│
└── public/
```

---

## Módulos Principales

### B2C — Radio Pública
- [ ] Home con reproductor en vivo (`/`)
- [ ] Archivo de shows y grilla de horarios (`/shows`)
- [ ] Charts por género (`/charts`)
- [ ] Directorio de labels (`/labels`)
- [ ] Perfil público del artista con SSR/SEO (`/[artist-name]`)

### B2B — Dashboard SoundSystem
- [ ] Página de inicio con perfil del artista (`/dashboard`)
- [ ] Métricas de performance y mapas de calor (`/dashboard/performance`)
- [ ] Gestión de releases y estado de tracks (`/dashboard/releases`)
- [ ] Timeline de contratos (`/dashboard/contracts`)
- [ ] Sistema de regalías y configuración de cobro (`/dashboard/royalties`)
- [ ] Configuración de cuenta (`/dashboard/settings`)

### Componentes Transversales
- [ ] Navbar adaptativa (pública / privada)
- [ ] Global Player persistente (Zustand)
- [ ] Sistema de autenticación unificado (`/login`, `/register`)

---

## Design System

- **Modo:** Dark mode como estándar — "High Contrast Dark Mode" para reducir la fatiga visual de productores que trabajan largas sesiones frente al monitor
- **Referencia visual:** Diseño en Figma *(link pendiente)*

### Paleta de Colores

#### Deep Studio (Paleta Principal)
Inspirada en la interfaz de un DAW (Ableton) y el ambiente de un club oscuro.

| Token | Hex | Uso |
|---|---|---|
| `background` | `#0B0E14` | Fondo principal — negro azulado profundo (no negro puro) |
| `surface` | `#181C25` | Cards y paneles — genera efecto de "flotación" sobre el fondo |
| `accent` | `#E67E22` | Proton Orange — botones, estados activos, highlights (color principal de marca) |
| `text-primary` | `#FFFFFF` | Títulos y nombres de artista |
| `text-secondary` | `#94A3B8` | Metadata, descripciones — gris azulado de alta legibilidad |

#### Colores Legacy (Acentos de Marca)
Heredados de la versión anterior. Se mantienen como acentos sutiles para preservar el ADN visual de Proton.

| Elemento | Hex | Módulo |
|---|---|---|
| **Orange** | `#E67E22` | Shows / Uploads |
| **Teal** | `#1ABC9C` | Labels / Management |
| **Purple** | `#9B59B6` | DJ Mixes |
| **Green** | `#27AE60` | Account / Royalties |

---

### Tipografía

#### Display & Títulos — Plus Jakarta Sans
Geométrica, moderna, de terminación limpia. Referencia al diseño industrial de equipos de audio (Teenage Engineering).

| Estilo | Especificación | Uso |
|---|---|---|
| **H1 - Artist Name** | Bold Italic / 32px | Nombre del artista — el ángulo da dinamismo sin verse anticuado |
| **H2 - Section Title** | SemiBold / 18px / Uppercase / letter-spacing 5% | Títulos de sección — look premium |

#### UI & Data — Inter
Estándar de la industria para dashboards. Legibilidad insuperable en tamaños pequeños (12–14px) en mobile.

| Estilo | Especificación | Uso |
|---|---|---|
| **Metric Value** | Medium / 24px | Números de métricas (12 tracks, 0 mixes) |
| **Label / Metadata** | Regular / 12px | Textos del sidebar y etiquetas |

---

### Efectos y Componentes Visuales

**Borde de perfil (foto de artista)**
```css
/* Efecto "glow LED de estudio" */
border: 3px solid transparent;
background: linear-gradient(#181C25, #181C25) padding-box,
            linear-gradient(135deg, #00FF9D, transparent) border-box;
```

**Cards / Superficies**
```css
/* Borde de "cristal" — sin sombras negras */
border: 1px solid rgba(255, 255, 255, 0.05);
background: #181C25;
```

> Configurar estos estilos como **Text Styles** y **Color Styles** en Figma para un handoff a desarrollo limpio y ordenado.

---

## Decisiones Técnicas Clave

> **¿Por qué Next.js y no Vite/React puro?**
> El streaming de audio y las listas de tracks cargan significativamente más rápido con SSR. Además, si los perfiles de artistas necesitan ser indexados por Google en el futuro, Next.js lo gestiona de forma nativa sin configuración adicional.

> **¿Por qué TypeScript?**
> En una plataforma que maneja dinero (regalías) y contratos legales, los errores de tipo como tratar un `null` como un `number` pueden tener consecuencias reales. TypeScript es la primera línea de defensa.

> **¿Por qué Zustand y no Redux?**
> El reproductor de audio necesita estado global liviano. Redux añade overhead innecesario para este caso de uso; Zustand resuelve lo mismo con mucho menos boilerplate.

---

## Roadmap

- [ ] Configuración inicial del proyecto (Next.js + TypeScript + Tailwind)
- [ ] Setup de TanStack Query y Zustand
- [ ] Implementación del Design System base
- [ ] Módulo de gestión de artistas
- [ ] Módulo de contratos y regalías
- [ ] Reproductor de audio global
- [ ] Perfiles públicos de artistas
- [ ] Métricas y gráficos de performance
- [ ] Deploy

---

## Estado del Proyecto

| Área | Estado |
|---|---|
| Documentación / README | 🟡 En construcción |
| Design System (Figma) | 🟡 En progreso |
| Configuración del proyecto | ⬜ Pendiente |
| Páginas en blanco (scaffolding) | ⬜ Pendiente |
| Componentes UI base | ⬜ Pendiente |
| Integración de datos reales | ⬜ Pendiente |

> **Próximo paso:** crear el proyecto Next.js y generar todas las páginas en blanco con su estructura de rutas, para tener el scaffolding completo listo para diseñar e implementar módulo por módulo.
