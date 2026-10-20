# VIP CAR B2B — Design & Architecture Document (Smooth Capsule & Organic Cockpit)

> Fluid dark titanium canvas, frosted glass curves, racing red accents, full-capsule actions.

**Theme:** dark-smooth

## 1. Tokens de Estilo (Curved & Capsule System)

- **Canvas:** Void Black suave (`#050608`).
- **Tarjetas y Superficies:** Titanio translúcido (`#0f1117`) con `backdrop-blur-xl`.
- **Bordes:** Curvas continuas suaves con bordes tenues `rgba(255, 255, 255, 0.08)`.
- **Border Radius:**
  - Botones y Chips de acción: Cápsula total (`rounded-full` / 9999px).
  - Tarjetas de vehículos y paneles: `rounded-3xl` (24px a 28px).
  - Inputs y buscadores: `rounded-2xl` (16px) o cápsula (`rounded-full`).
  - Badges y tags: Cápsula compacta (`rounded-full` con padding 4px 12px).
- **Botones de Cotización:**
  - Estilo Cápsula: Fondo gris perla / Mist suave (`#f1f2f4`) o degradado sutil titanio con texto `#09090b`, hover con escala suave (`scale-[1.02]`).
  - Botón SOS / Crítico: Cápsula en rojo racing (`#e11d48`).

## 2. Pautas para el Celular

- **Catálogo:** Tarjetas con esquinas muy redondeadas (24px), imágenes con curva interior integrada y botón 'Cotizar Unidad' abajo como una cápsula centrada y táctil.
- **Conductor:** Contenedor tipo tarjeta flotante curva, input de odómetro centrado con esquinas suaves y botones de confirmación tipo píldora.
