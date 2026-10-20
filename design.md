# VIP CAR B2B — Design & Architecture Document

> Midnight command center, coral racing neon — High-performance fleet cockpit.

**Theme:** dark

## 1. Tokens de Estilo Oficiales (Raycast Cockpit Language)

### Colores

- **Void Black (`#040506`):** Canvas principal de toda la aplicación.
- **Ink (`#07080a`):** Superficie de tarjetas de vehículos, paneles y métricas elevadas.
- **Obsidian (`#111214`):** Pozos de entrada, inputs de odómetro y campos de formulario.
- **Graphite (`#1b1c1e`):** Superficies de badges densos, tags de equipamiento y fondos neutros.
- **Smoke (`#6a6b6c`):** Texto secundario, etiquetas de telemetría y metadatos.
- **Ash (`#9c9c9d`):** Subtítulos, captions y textos sobre fondos oscuros.
- **Pure White (`#ffffff`):** Títulos de vehículos, métricas numéricas y textos de máximo contraste.
- **Mist (`#e6e6e6`):** Relleno neutro para botones de acción principal (con texto Iron `#454647`).
- **Coral Pulse / Racing Red (`#ff6363` / `#e11d48`):** Acento exclusivo del logo VIP CAR, badges de alerta crítica y glow en el hero.

### Tipografía & Escala

- **Principal:** Inter (400 para textos y títulos principales, 500 para navegación y botones).
- **Monospace:** GeistMono o JetBrains Mono (para odómetro, códigos de unidad y placas).
- **Eyebrow:** 11px, mayúsculas, tracking amplio (`+0.8px`), color `#6a6b6c`.
- **Headings:** 32px a 56px en peso 400–500, con tracking neutro o sutilmente positivo.

### Bordes, Sombras & Acabado Táctil

- **Hairline Border:** 1px sólido en `#363739` para separar componentes y divisiones.
- **Key-Cap Shadow (Efecto Raycast):**
  `rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset`
- **Radios estrictos:**
  - `8px` para botones, inputs y buscador de flota.
  - `16px` para tarjetas de vehículos y paneles del dashboard.
  - `6px` para badges de equipamiento minero.

---

## 2. Especificaciones de Módulos VIP CAR

### A. Portal B2B Corporativo (Mineras & Constructoras)

- **Glass Navigation Bar:** Barra flotante centrada con `backdrop-blur(48px)`, borde 1px `#363739`, fondo `#040506cc`. Logo oficial de VIP CAR a la izquierda y botón de acción neutro en Mist (`#e6e6e6`) a la derecha.
- **Hero Minimalista:** Título sobrio 'PORTAL CORPORATIVO' (56px Inter 400), fondo con malla técnica sutil y botón único 'Solicitar Lote de Flota →' (Mist `#e6e6e6`).
- **Catálogo de Flota:** Tarjetas con radio de 16px sobre `#07080a` con el efecto key-shadow.
  - Título del vehículo en Pure White (`#ffffff`).
  - Placa enmascarada para clientes (`W4E-***`) y código `Unidad #01` en fuente mono.
  - Badges de equipamiento minero (Pértiga, Jaula, Circulina) con fondo `#1b1c1e` y texto Ash.
- **Franja de Clientes Mineros & Footer Oficial:**
  - Logo strip monocromático: Nexa, SGS, Kolpa, Redrilsa, Congemin JH, Trafigura.
  - Datos de contacto: 999 461 414 / 982 083 835 | reservas@vipcarhuancayo.com | Huancayo.

### B. Módulo de Conductores (Campo / Mobile-First)

- Contenedor centrado (`max-w-md`), fondo Void Black (`#040506`).
- Odómetro: Campo tipo pozo en Obsidian (`#111214`), dígitos grandes en tipografía mono.
- Checklist táctil con filas separadas por bordes `#363739`. Placa completa visible.

### C. Dashboard Gerencial & Semáforo Preventivo (Ruta Protegida)

- Pantalla de Login ejecutiva antes de ingresar al panel.
- Cockpit oscuro con KPIs en tarjetas de 16px.
- Semáforo de mantenimiento por kilometraje (Verde `#59d499`, Amarillo `#f59e0b`, Crítico Coral `#ff6363`).
