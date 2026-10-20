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
  AlertTriangle
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import MiningClientsStrip from '../../components/b2b/MiningClientsStrip';
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

          {/* Encabezado HUD de la Unidad Insignia */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08] relative z-10">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">
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
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#626773] font-bold">
                  Especificaciones para Operación Minera:
                </div>

                {/* Grid 2x2 de Parámetros de Ingeniería */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="telemetry-well p-3.5 rounded-2xl space-y-0.5">
                    <span className="text-[9px] font-mono text-[#626773] uppercase block">Capacidad</span>
                    <span className="text-xs font-bold text-white font-mono">{flagshipVehicle.capacidadCarga}</span>
                  </div>

                  <div className="telemetry-well p-3.5 rounded-2xl space-y-0.5">
                    <span className="text-[9px] font-mono text-[#626773] uppercase block">Odómetro Actual</span>
                    <span className="text-xs font-bold text-white font-mono">{flagshipVehicle.odometroActual.toLocaleString()} km</span>
                  </div>

                  <div className="telemetry-well p-3.5 rounded-2xl space-y-0.5 col-span-2">
                    <span className="text-[9px] font-mono text-[#626773] uppercase block">Certificaciones de Garita</span>
                    <div className="flex gap-1.5 pt-0.5">
                      {flagshipVehicle.certificaciones.map((c, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-[10px] font-mono bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30">
                          {c} Homologado
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Semáforo Preventivo en Vivo */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#626773] mb-1">
                    <span>Salud Mecánica Preventiva:</span>
                    <span className="text-[#59d499] font-bold">Auditoría 5k / 10k / 20k</span>
                  </div>
                  <SemaforoBadge odometro={flagshipVehicle.odometroActual} compact={false} />
                </div>

                {/* Equipamiento Minero Especializado en Cápsulas */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#626773] block">
                    Equipamiento Instalado de Seguridad:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {flagshipVehicle.equipamiento.map((eq, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-[10px] font-mono telemetry-well border border-white/[0.08] text-[#949aa6] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#ff6363]" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Asignación Táctica - Píldora Prominente */}
              <div className="pt-2">
                <Link
                  to={`/b2b/cotizar?modelo=${encodeURIComponent(flagshipVehicle.modelo)}`}
                  className="btn-cockpit-action w-full py-4 px-6 text-sm font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-98 tracking-wide font-mono"
                >
                  <Truck className="w-4 h-4 text-black" />
                  <span>Asignar {flagshipVehicle.identificadorB2B.codigo} a Cotización</span>
                  <ChevronRight className="w-4 h-4 text-black" />
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
            <div
              key={veh.id}
              className="cockpit-panel rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/[0.08] hover:border-[#ff6363]/40 transition-all shadow-xl"
            >
              {/* Header Técnico de la Ficha */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#ff6363] bg-[#ff6363]/10 px-2.5 py-0.5 rounded-full border border-[#ff6363]/40">
                    {veh.identificadorB2B.codigo}
                  </span>
                  <span className="text-[#626773] text-[11px]">
                    PLACA: <strong className="text-white">{veh.identificadorB2B.enmascarada}</strong>
                  </span>
                </div>
                <span className="text-sm font-black text-white font-mono">
                  ${veh.tarifaDiariaUSD} <span className="text-[9px] font-normal text-[#626773]">/d</span>
                </span>
              </div>

              {/* Imagen Cinemática del Vehículo */}
              <div className="relative h-48 bg-[#050608] overflow-hidden">
                <img
                  src={veh.imagen}
                  alt={veh.modelo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo-vipcar.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[#ff6363] font-bold border border-white/10">
                    {veh.traccion}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-white border border-white/10">
                    {veh.anio}
                  </span>
                </div>

                <div className="absolute top-3 right-3 font-mono text-[9px]">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      veh.estadoOperativo === 'Disponible'
                        ? 'bg-[#59d499]/15 text-[#59d499] border border-[#59d499]/30'
                        : 'bg-white/10 text-[#949aa6] border border-white/10'
                    }`}
                  >
                    {veh.estadoOperativo}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight font-sans">
                    {veh.marca} {veh.modelo}
                  </h3>
                  <div className="text-[11px] font-mono text-[#949aa6]">
                    {veh.tipo} • {veh.motor}
                  </div>
                </div>
              </div>

              {/* Ficha Técnica & Telemetría */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Carga & Homologación */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="telemetry-well p-2.5 rounded-2xl">
                      <span className="text-[9px] text-[#626773] uppercase block">Capacidad</span>
                      <span className="text-white font-bold truncate block">{veh.capacidadCarga}</span>
                    </div>
                    <div className="telemetry-well p-2.5 rounded-2xl">
                      <span className="text-[9px] text-[#626773] uppercase block">Certificación</span>
                      <span className="text-[#59d499] font-bold truncate block">{veh.certificaciones.join(', ')}</span>
                    </div>
                  </div>

                  {/* Odómetro y Semáforo */}
                  <div className="pt-1 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#626773] mb-1">
                      <span>Odómetro actual:</span>
                      <strong className="text-white">{veh.odometroActual.toLocaleString()} km</strong>
                    </div>
                    <SemaforoBadge odometro={veh.odometroActual} compact={true} />
                  </div>

                  {/* Equipamiento Clave en Cápsulas */}
                  <div>
                    <div className="text-[9px] uppercase font-mono tracking-wider text-[#626773] mb-1.5">
                      Equipamiento:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {veh.equipamiento.slice(0, 4).map((eq, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-[9px] font-mono telemetry-well border border-white/[0.06] text-[#949aa6]"
                        >
                          {eq}
                        </span>
                      ))}
                      {veh.equipamiento.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/20">
                          +{veh.equipamiento.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de Cotizar - Cápsula Prominente Táctil para Móvil y Desktop */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <Link
                    to={`/b2b/cotizar?modelo=${encodeURIComponent(veh.modelo)}`}
                    className="btn-cockpit-action w-full py-3.5 sm:py-3 px-5 text-sm sm:text-xs font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer text-center shadow-lg active:scale-98 tracking-wide font-mono"
                  >
                    <Truck className="w-4 h-4 text-black" />
                    <span>Cotizar {veh.identificadorB2B.codigo}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-black" />
                  </Link>
                </div>
              </div>
            </div>
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
