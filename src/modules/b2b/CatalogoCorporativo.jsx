import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  Filter,
  CheckCircle,
  Truck,
  Shield,
  ArrowRight,
  Search,
  Lock,
  Gauge,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Check
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import MiningClientsStrip from '../../components/b2b/MiningClientsStrip';
import VehicleCard from '../../components/b2b/VehicleCard';
import { obtenerIdentificadorB2B } from '../../utils/plateMasker';

export default function CatalogoCorporativo() {
  const { vehicles } = useFleet();

  const [filtroTraccion, setFiltroTraccion] = useState('todos');
  const [filtroCertificacion, setFiltroCertificacion] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const enrichedVehicles = vehicles.map((veh, index) => ({
    ...veh,
    identificadorB2B: obtenerIdentificadorB2B(veh, index),
  }));

  const filteredVehicles = enrichedVehicles.filter((v) => {
    const term = busqueda.toLowerCase().trim();
    const matchesBusqueda =
      !term ||
      v.modelo.toLowerCase().includes(term) ||
      v.marca.toLowerCase().includes(term) ||
      v.identificadorB2B.codigo.toLowerCase().includes(term) ||
      v.identificadorB2B.enmascarada.toLowerCase().includes(term);

    const matchesTraccion =
      filtroTraccion === 'todos' || v.traccion === filtroTraccion;

    const matchesCert =
      filtroCertificacion === 'todos' ||
      v.certificaciones.includes(filtroCertificacion);

    return matchesBusqueda && matchesTraccion && matchesCert;
  });

  // Unidad Insignia Destacada para el Bento Showcase (vehículo 0 o primer resultado)
  const flagshipVehicle = filteredVehicles[0] || null;
  const remainingVehicles = filteredVehicles.slice(1);

  // Salud mecánica preventiva para unidad insignia
  const flagshipSiguiente = flagshipVehicle ? Math.ceil((flagshipVehicle.odometroActual + 1) / 5000) * 5000 : 0;
  const flagshipKmRestantes = flagshipVehicle ? flagshipSiguiente - flagshipVehicle.odometroActual : 0;
  const flagshipProgreso = Math.min(100, Math.max(0, ((5000 - flagshipKmRestantes) / 5000) * 100));

  let flagshipProgresoTexto = `Faltan ${flagshipKmRestantes.toLocaleString()} km para servicio`;
  let flagshipBarraColor = '#59d499';
  let flagshipTextoColor = 'text-zinc-400';

  if (flagshipKmRestantes <= 0) {
    flagshipProgresoTexto = `Excedido por ${Math.abs(flagshipKmRestantes).toLocaleString()} km`;
    flagshipBarraColor = '#ff6363';
    flagshipTextoColor = 'text-[#ff6363]';
  } else if (flagshipKmRestantes <= 500) {
    flagshipProgresoTexto = `Faltan ${flagshipKmRestantes.toLocaleString()} km para servicio`;
    flagshipBarraColor = '#f59e0b';
    flagshipTextoColor = 'text-[#f59e0b]';
  }

  return (
    <div className="space-y-10 text-[#949aa6]">
      {/* ========================================================================= */}
      {/* 1. BANNER PROTOCOLO DE SEGURIDAD PATRIMONIAL                              */}
      {/* ========================================================================= */}
      <div className="cockpit-panel rounded-full px-5 py-3 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 flex items-center justify-center shrink-0">
            <Lock className="w-3 h-3" />
          </div>
          <span>
            <strong className="text-white">PROTOCOLO DE PRIVACIDAD B2B:</strong> Unidades gestionadas bajo identificador corporativo <strong className="text-[#ff6363]">Unidad #</strong> con placas enmascaradas para licitación.
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto text-[10px] text-[#626773]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#59d499]" />
          <span>Homologación Minera Vigente</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONSOLA DE FILTRADO & DESPACHO TÁCTICO (INSTRUMENT CLUSTER)            */}
      {/* ========================================================================= */}
      <div className="cockpit-panel rounded-3xl p-5 sm:p-7 border border-white/[0.08] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6363] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.12em] text-white font-bold">
              Consola de Despacho & Filtro de Flota
            </span>
          </div>
          <div className="text-xs font-mono text-[#59d499] flex items-center gap-1.5">
            <span className="text-[#626773]">Resultado:</span>
            <span className="rounded-full bg-[#59d499]/10 text-[#59d499] px-3 py-0.5 border border-[#59d499]/30 font-bold">
              {filteredVehicles.length} unidades activas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Búsqueda Táctica Cápsula */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-[#626773] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por modelo, chasis o código (ej. Hilux, Unidad #01)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full telemetry-well border border-white/[0.08] rounded-full pl-11 pr-4 py-2.5 text-xs font-mono text-white placeholder-[#626773] focus:outline-none focus:border-[#ff6363] transition-colors"
            />
          </div>

          {/* Selector de Tracción Segmentado en Cápsula */}
          <div className="lg:col-span-4 flex items-center gap-1 telemetry-well p-1 rounded-full border border-white/[0.08]">
            <button
              onClick={() => setFiltroTraccion('todos')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroTraccion === 'todos'
                  ? 'btn-cockpit-action text-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroTraccion('4x4')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroTraccion === '4x4'
                  ? 'bg-[#ff6363] text-white font-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              Solo 4x4
            </button>
            <button
              onClick={() => setFiltroTraccion('4x2')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroTraccion === '4x2'
                  ? 'btn-cockpit-action text-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              4x2
            </button>
          </div>

          {/* Selector de Homologación Minera en Cápsula */}
          <div className="lg:col-span-3 flex items-center gap-1 telemetry-well p-1 rounded-full border border-white/[0.08]">
            <button
              onClick={() => setFiltroCertificacion('todos')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroCertificacion === 'todos'
                  ? 'btn-cockpit-action text-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              Cualquiera
            </button>
            <button
              onClick={() => setFiltroCertificacion('Socavón')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroCertificacion === 'Socavón'
                  ? 'bg-[#59d499] text-black font-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              Socavón
            </button>
            <button
              onClick={() => setFiltroCertificacion('Superficie')}
              className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                filtroCertificacion === 'Superficie'
                  ? 'btn-cockpit-action text-black shadow-sm'
                  : 'text-[#626773] hover:text-white'
              }`}
            >
              Superficie
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENTO SHOWCASE: UNIDAD INSIGNIA DESTACADA (PORSCHE/RIVIAN COCKPIT)     */}
      {/* ========================================================================= */}
      {flagshipVehicle && (
        <div className="cockpit-panel rounded-3xl p-6 lg:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden group">
          {/* Luz ambiental sutil */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-gradient-to-b from-[#ff6363]/10 to-transparent blur-3xl pointer-events-none" />

          {/* Encabezado Limpio y Editorial */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 relative z-10">
            <div className="flex items-center gap-3">
              <span className="telemetry-badge bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 font-bold rounded-full px-3 py-1">
                UNIDAD INSIGNIA • {flagshipVehicle.identificadorB2B.codigo}
              </span>
              <span className="text-xs font-mono text-[#626773]">
                PLACA: <strong className="text-white">{flagshipVehicle.identificadorB2B.enmascarada}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#59d499] bg-[#59d499]/10 px-3 py-1 rounded-full border border-[#59d499]/30 font-bold">
                {flagshipVehicle.estadoOperativo}
              </span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  ${flagshipVehicle.tarifaDiariaUSD}
                </span>
                <span className="text-[10px] text-[#626773] font-mono"> USD/día</span>
              </div>
            </div>
          </div>

          {/* Cuerpo Asimétrico del Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 relative z-10">
            {/* Visual Cinemático del Vehículo con Rim Light */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1218] via-[#090b0e] to-[#040506] border border-white/[0.08] h-64 sm:h-80 flex items-center justify-center group-hover:border-white/[0.2] transition-all">
                <img
                  src={flagshipVehicle.imagen}
                  alt={flagshipVehicle.modelo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo-vipcar.png';
                  }}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-103 transition-transform duration-500"
                />
                {/* Degradado para fundir la imagen cinematográficamente con el panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#090b0e]/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e]/50 via-transparent to-[#090b0e]/50" />

                {/* Overlays de Telemetría sobre la imagen en Cápsulas */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-mono text-[10px]">
                  <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-bold">
                    TRACCIÓN {flagshipVehicle.traccion}
                  </span>
                  <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[#59d499]">
                    AÑO {flagshipVehicle.anio}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight font-sans">
                      {flagshipVehicle.marca} {flagshipVehicle.modelo}
                    </h3>
                    <p className="text-xs text-[#949aa6] font-mono mt-0.5">
                      {flagshipVehicle.motor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instrumentación Técnica & Especificaciones */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-4">
                {/* Especificaciones Técnicas (Números Tabulares Monospace Estricto) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-0.5">
                      Capacidad Carga
                    </span>
                    <span className="text-white font-mono tabular-nums text-xs font-medium">
                      {flagshipVehicle.capacidadCarga}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-0.5">
                      Odómetro Actual
                    </span>
                    <span className="text-white font-mono tabular-nums text-xs font-medium">
                      {flagshipVehicle.odometroActual.toLocaleString()} km
                    </span>
                  </div>
                </div>

                {/* Certificaciones de Garita: Tags sutiles fondo gris oscuro sin borde verde chillón */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-1.5">
                    Certificaciones de Garita
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {flagshipVehicle.certificaciones?.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-zinc-800/90 text-zinc-300"
                      >
                        {cert} Homologado
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salud Mecánica Preventiva: Barra delgada y elegante con indicador ámbar tenue (#f59e0b) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans">
                      Salud Mecánica Preventiva
                    </span>
                    <span className={`font-mono tabular-nums text-xs font-medium ${flagshipTextoColor}`}>
                      {flagshipProgresoTexto}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${flagshipProgreso}%`, backgroundColor: flagshipBarraColor }}
                    />
                  </div>
                </div>

                {/* Lista de equipamiento limpia en cuadrícula de 2 columnas */}
                <div className="pt-1">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-2">
                    Equipamiento de Seguridad ({flagshipVehicle.equipamiento.length} ítems)
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {flagshipVehicle.equipamiento.map((eq, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 font-sans font-normal">
                        <Check className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Acción: Cápsula Completa en Mist #e6e6e6 y texto oscuro */}
              <div className="pt-2">
                <Link
                  to={`/b2b/cotizar?modelo=${encodeURIComponent(flagshipVehicle.modelo)}`}
                  className="w-full py-3.5 px-6 rounded-full bg-[#e6e6e6] hover:bg-white text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-none active:scale-98 font-sans"
                >
                  <span>Asignar {flagshipVehicle.identificadorB2B.codigo} a Cotización</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-900" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CUADRÍCULA TÉCNICA COCKPIT: FLOTA RESTANTE                             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs uppercase font-mono tracking-[0.12em] text-white font-bold">
              Unidades Homologadas Disponibles en Flota
            </h2>
          </div>
          <span className="text-xs font-mono text-[#626773]">
            Tarifa corporativa con seguro Rimac & SOAT incluidos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingVehicles.map((veh) => (
            <VehicleCard key={veh.id} vehicle={veh} />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FRANJA DE CONFIANZA MINERA (SOCIAL PROOF CON ESTILO INDUSTRIAL)        */}
      {/* ========================================================================= */}
      <MiningClientsStrip />
    </div>
  );
}
