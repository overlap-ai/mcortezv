# mcortezv — Portfolio Personal de Manuel Cortez

Portfolio personal con tema cinématico oscuro, animaciones GSAP y sección académica de papers.

## Stack

- **Framework**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v3 + CSS Custom Properties (variables de diseño en `src/index.css`)
- **Animaciones**: GSAP 3.12 (ScrollTrigger, SplitText, ScrollToPlugin) + `@gsap/react`
- **Routing**: React Router v6
- **Markdown**: `marked` (para render de papers)

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm run build      # build de producción
npm run preview    # previsualizar build
```

## Arquitectura

```
src/
├── App.tsx                     # BrowserRouter, Routes, grain overlay, cursor
├── main.tsx                    # Punto de entrada, registra GSAP plugins
├── index.css                   # Sistema de diseño: CSS variables, clases base
├── lib/
│   └── gsap.ts                 # Configura GSAP plugins, expone utilidades (scrollTo, animateIn, addMagneticEffect)
├── types/
│   └── index.ts                # Tipos: Paper, TechItem, Project, Achievement
├── data/
│   ├── personal.ts             # Datos personales, stack, proyectos, logros
│   └── papers.ts               # Papers mock con contenido markdown completo
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Navbar fija, blur on scroll, mobile menu animado
│   │   └── Footer.tsx          # Footer minimal
│   ├── ui/
│   │   ├── AnimatedText.tsx    # Componente de texto con GSAP SplitText
│   │   ├── Tag.tsx             # Badge/tag reutilizable
│   │   └── CustomCursor.tsx    # Cursor personalizado (dot + ring, oculto en touch)
│   ├── sections/
│   │   ├── Hero.tsx            # Hero full-screen, glow blobs, SplitText animation
│   │   ├── About.tsx           # Bio + terminal card + highlight grid
│   │   ├── Stack.tsx           # Grid de tech cards con categorías y nivel
│   │   ├── Experience.tsx      # Trabajo actual + logros + educación
│   │   ├── Projects.tsx        # Cards de proyectos con links externos
│   │   ├── Research.tsx        # Grid de papers (featured + rest)
│   │   └── Contact.tsx         # Links de contacto con animaciones
│   └── papers/
│       └── PaperCard.tsx       # Card de paper (variant: normal | featured)
└── pages/
    ├── HomePage.tsx            # Composición de todas las secciones
    └── PaperPage.tsx           # Detalle de paper (tema académico claro)
```

## Sistema de Diseño

### Variables CSS (en `src/index.css`)

**Tema oscuro (principal):**
- `--bg-base: #060606` — fondo base
- `--bg-surface: #0d0d0d` — fondos de secciones alternos
- `--bg-card: #111111` — fondo de cards
- `--accent: #22d3a5` — color principal (teal-green)
- `--accent-2: #8b5cf6` — color secundario (purple)
- `--accent-3: #f97316` — color terciario (orange)
- `--text: #ededed` — texto principal
- `--text-secondary: #888888` — texto secundario
- `--text-muted: #555555` — texto muted

**Tema académico (para paper pages `--paper-*`):**
- `--paper-bg: #f8f7f4` — fondo cálido off-white
- `--paper-ink: #111111` — texto principal

### Clases CSS clave

| Clase | Descripción |
|---|---|
| `.section` | Padding estándar de sección (responsive) |
| `.section-label` | Label pequeño verde con línea horizontal |
| `.text-display` | Tamaño hero: clamp(3.5rem, 9vw, 8rem) |
| `.text-h1` | Título sección: clamp(2rem, 4vw, 3.5rem) |
| `.card` | Card oscura con hover state |
| `.card-glow` | Card con glow de acento al hover |
| `.btn-primary` | Botón primario verde |
| `.btn-ghost` | Botón ghost con borde |
| `.tag` | Badge/etiqueta pequeña |
| `.dot-grid` | Background de puntos sutiles |
| `.grain-overlay` | Textura de grano cinematográfico (posición fixed) |
| `.paper-page` | Aplica tema claro académico a la página |
| `.paper-content` | Estilos de tipografía académica |

## Rutas

- `/` — Página principal (SPA con secciones)
- `/papers/:slug` — Detalle de paper (tema académico claro)

Los slugs disponibles: ver `src/data/papers.ts`

## Papers Mock

Los papers están en `src/data/papers.ts`. Cada paper tiene:
- `slug`, `title`, `abstract`, `category`, `categoryColor`
- `tags[]`, `date`, `readingTime`, `status`
- `citations`, `downloads`
- `content` (markdown string completo)

Para agregar un nuevo paper: añadir entrada al array `papers` en `src/data/papers.ts`.

## Animaciones GSAP

- **Hero**: SplitText word-by-word reveal con timeline
- **Secciones**: ScrollTrigger fade-in desde abajo (stagger en grids)
- **Navbar**: blur/border on scroll via ScrollTrigger
- **Mobile menu**: overlay fade + links slide-in
- **Cursor**: dot + ring con lag, efecto hover en elementos interactivos
- **Blobs**: CSS keyframes float lento en el hero
- **Grain**: CSS animation steps(1) para efecto film grain

## Notas de desarrollo

- Los plugins de GSAP se registran en `src/lib/gsap.ts` y se importan en `src/main.tsx`
- Usar `useGSAP` de `@gsap/react` en componentes React (maneja cleanup automático)
- El scope de `useGSAP` es siempre `containerRef` del componente para evitar conflictos
- El sistema `@/` resuelve a `./src/` (alias en vite.config.ts y tsconfig.app.json)

## Deploy

Configurado para Vercel (detecta Vite automáticamente). Comando build: `npm run build`. Output: `dist/`.

Para routing client-side en Vercel, agregar `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
