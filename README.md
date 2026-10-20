# VIP CAR B2B - Plataforma de Flotas Mineras & Mantenimiento Preventivo

Plataforma y aplicación integral (PWA / Web App responsiva) para **VIP CAR**, especializada en alquiler de flotas corporativas (pickups 4x4 y vehículos pesados/ligeros) para empresas mineras y constructoras en Junín / Perú (Toromocho, Yauli, Nexa, Carretera Central).

---

## 🏗️ Módulos Implementados

### 1. App de Campo para Conductores (`/conductor`)
*Diseño Mobile-First / TUI amigable con botones táctiles de gran tamaño para operadores en operación minera.*
- **Mi Unidad (`/conductor`):** Resumen de camioneta asignada (Toyota Hilux 4x4), odómetro actual, nivel de combustible y estado preventivo.
- **Check-in Diario de Turno (`/conductor/checkin`):**
  - Registro rápido de odómetro con teclado/input de alta legibilidad.
  - Selector táctil de nivel de combustible (25%, 50%, 75%, Lleno).
  - Checklist preoperacional minero (luces, pértiga LED, circulina, neumáticos, frenos, niveles de aceite/refrigerante, botiquín, extintor, tacos y jaula).
- **Check-out de Turno (`/conductor/checkout`):**
  - Kilometraje de entrega con cálculo automático de km recorridos en el turno.
  - Nivel de combustible final y evaluación de estado de la unidad.
  - Registro de novedades e incidencias mecánicas.
- **Reporte Rápido de Averías SOS (`/conductor/averia`):**
  - Botón prominente de emergencia con alta visibilidad.
  - Selector de severidad y tipo de falla mecánica/choque.
  - Captura y previsualización de fotografía de evidencia.
  - Geolocalización satelital simulada de operación minera en altura (4,500 msnm).

### 2. Portal Corporativo B2B (`/b2b`)
*Diseñado para superintendentes de logística de mineras y constructoras.*
- **Catálogo Corporativo (`/b2b`):**
  - Pickups 4x4 equipadas con jaula antivuelco, pértiga, tacos, circulina y GPS.
  - Filtros dinámicos por tracción (4x4 / 4x2) y certificación para socavón o superficie.
- **Solicitud de Cotización por Lote (`/b2b/cotizar`):**
  - Envío de requerimientos corporativos indicando cantidad de camionetas, operación de destino, fechas de inicio/fin y checkboxes de equipamiento de seguridad minera.
- **Gestión de Contratos Activos (`/b2b/contratos`):**
  - Visualización de unidades asignadas actualmente por empresa (Chinalco, Volcan, Constructora San Martín).
  - Descarga de documentos técnicos obligatorios para garita (SOAT, póliza todo riesgo minero y revisión técnica del MTC).

### 3. Dashboard Gerencial & Semáforo Preventivo (`/dashboard`)
*Supervisión administrativa y de taller central en Huancayo.*
- **Semáforo de Mantenimiento Preventivo (`/dashboard/semaforo`):**
  - Reglas de alertas automáticas según odómetro acumulado a los 5,000 km, 10,000 km y 20,000 km.
  - 🟢 **Verde (Óptimo):** Margen mayor a 500 km para el siguiente servicio.
  - 🟡 **Amarillo (Mantenimiento Próximo):** Menos de 500 km restantes (permite programar taller preventivo).
  - 🔴 **Rojo (Vencido / Inhabilitado):** Kilometraje superado o avería reportada (inhabilitación operativa inmediata).
- **Gestión de Flota CRUD (`/dashboard/flota`):**
  - Alta, edición y baja de camionetas, asignación de proyectos mineros y conductores.
- **Bitácora y Trazabilidad (`/dashboard/bitacora`):**
  - Histórico cronológico de qué operador condujo cada vehículo, km registrados y novedades de checklists.

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 19 + Vite 8
- **Estilos:** Tailwind CSS v4 con paleta industrial ejecutiva (Carbón `#0F172A`, Oro `#EAB308`, Semáforo `#22C55E`, `#FACC15`, `#EF4444`)
- **Iconografía:** Lucide React
- **Ruteo:** React Router DOM v7
- **Backend / Persistencia:** Firebase (Firestore + Auth) + `localStorage` para modo offline en socavón/operación sin señal.

---

## 🚀 Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de Firebase (Opcional):**
   Copiar `.env.example` a `.env` y configurar las claves de tu proyecto Firebase:
   ```bash
   cp .env.example .env
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
