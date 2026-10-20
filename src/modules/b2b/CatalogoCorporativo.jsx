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
  Lock
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import MiningClientsStrip from '../../components/b2b/MiningClientsStrip';
import { obtenerIdentificadorB2B } from '../../utils/plateMasker';

export default function CatalogoCorporativo() {
  const { vehicles } = useFleet();

  const [filtroTraccion, setFiltroTraccion] = useState('todos');
  const [filtroCertificacion, setFiltroCertificacion] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filteredVehicles = vehicles
    .map((veh, index) => ({
      ...veh,
      identificadorB2B: obtenerIdentificadorB2B(veh, index),
    }))
    .filter((v) => {
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

  return (
    <div className="space-y-8 text-[#9c9c9d]">
      {/* Banner de Privacidad */}
      <div className="p-3 rounded-[8px] bg-[#07080a] border border-[#363739] flex items-center justify-between text-xs text-[#6a6b6c]">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#ff6363] shrink-0" />
          <span>
            <strong className="text-white">Privacidad de Flota:</strong> Placas protegidas bajo formato de licitación. Asignación corporativa mediante código de <strong className="text-[#ff6363]">Unidad #</strong>.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-[4px] bg-[#111214] border border-[#363739] text-[10px] font-mono text-[#6a6b6c]">
          Portal Clientes
        </span>
      </div>

      {/* Barra de Filtros Raycast (Ink #07080a, Hairline #363739, 16px radius) */}
      <div className="raycast-card p-5 sm:p-6 rounded-[16px] space-y-4 bg-[#07080a] border border-[#363739]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#363739]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs uppercase font-mono tracking-[0.8px] text-white font-medium">
              Filtros de Requerimiento Minero
            </h2>
          </div>
          <span className="text-xs text-[#6a6b6c] font-mono">
            {filteredVehicles.length} unidades disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda (Obsidian #111214, 8px radius) */}
          <div>
            <label className="block text-[11px] font-medium text-[#6a6b6c] mb-1 font-mono uppercase">
              Modelo o Unidad
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6a6b6c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ej. Hilux, Unidad #01..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] pl-8 pr-3 py-2 text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] transition-colors"
              />
            </div>
          </div>

          {/* Tracción */}
          <div>
            <label className="block text-[11px] font-medium text-[#6a6b6c] mb-1 font-mono uppercase">
              Tipo de Tracción
            </label>
            <select
              value={filtroTraccion}
              onChange={(e) => setFiltroTraccion(e.target.value)}
              className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6363] transition-colors"
            >
              <option value="todos">Todas las tracciones (4x4 / 4x2)</option>
              <option value="4x4">Solo 4x4 (Pickups todo terreno)</option>
              <option value="4x2">4x2 (Urbano / Carretera)</option>
            </select>
          </div>

          {/* Certificación */}
          <div>
            <label className="block text-[11px] font-medium text-[#6a6b6c] mb-1 font-mono uppercase">
              Homologación
            </label>
            <select
              value={filtroCertificacion}
              onChange={(e) => setFiltroCertificacion(e.target.value)}
              className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6363] transition-colors"
            >
              <option value="todos">Todas las certificaciones</option>
              <option value="Socavón">Certificada Socavón (Mina Subterránea)</option>
              <option value="Superficie">Superficie / Obras Civiles</option>
            </select>
          </div>

          {/* CTA Raycast Mist Style */}
          <div className="flex items-end">
            <Link
              to="/b2b/cotizar"
              className="btn-raycast-primary w-full py-2.5 px-4 text-xs flex items-center justify-center gap-1.5 text-center active:scale-98 cursor-pointer"
            >
              <span>Solicitar Lote</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas Raycast (Ink #07080a, 16px radius, Key-Cap Shadow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((veh) => (
          <div
            key={veh.id}
            className="raycast-card rounded-[16px] overflow-hidden flex flex-col justify-between hover:border-white/[0.25] transition-all group bg-[#07080a] border border-[#363739]"
          >
            {/* Imagen del Vehículo */}
            <div className="relative h-48 bg-[#111214] overflow-hidden">
              <img
                src={veh.imagen}
                alt={veh.modelo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo-vipcar.png';
                }}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/30 to-black/30" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-[4px] bg-[#ff6363] text-white font-mono font-bold text-[10px]">
                  {veh.traccion}
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono border border-white/10">
                  {veh.anio}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-medium font-mono ${
                    veh.estadoOperativo === 'Disponible'
                      ? 'bg-[#071f16] text-[#59d499] border border-[#59d499]/30'
                      : 'bg-[#111214] text-[#9c9c9d] border border-[#363739]'
                  }`}
                >
                  {veh.estadoOperativo}
                </span>
              </div>

              {/* Título en la imagen en Pure White (#ffffff) */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                <div>
                  <h3 className="text-base font-medium text-white leading-tight">
                    {veh.marca} {veh.modelo}
                  </h3>
                  <div className="text-[11px] font-mono flex items-center gap-1.5 mt-0.5 text-[#9c9c9d]">
                    <span className="text-white font-bold bg-[#1b1c1e] px-1.5 py-0.2 rounded-[4px] border border-[#363739]">
                      {veh.identificadorB2B.codigo}
                    </span>
                    <span>• {veh.identificadorB2B.enmascarada}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white font-mono">
                    ${veh.tarifaDiariaUSD} <span className="text-[10px] font-normal text-[#6a6b6c]">/día</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido Técnico */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Capacidad y Tipo */}
                <div className="flex items-center justify-between text-xs bg-[#111214] px-2.5 py-1.5 rounded-[8px] border border-[#363739]">
                  <div className="flex items-center gap-1.5 text-[#9c9c9d]">
                    <Truck className="w-3.5 h-3.5 text-[#ff6363]" />
                    <span className="text-[11px] font-medium text-white">{veh.tipo}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#ff6363] font-bold">
                    {veh.capacidadCarga}
                  </span>
                </div>

                {/* Certificaciones */}
                <div className="flex items-center gap-1.5 text-xs text-[#9c9c9d]">
                  <Shield className="w-3.5 h-3.5 text-[#ff6363] shrink-0" />
                  <span className="font-medium text-[11px]">Homologación:</span>
                  <div className="flex gap-1">
                    {veh.certificaciones.map((c, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.2 rounded-[4px] text-[10px] font-mono bg-[#1b1c1e] text-white border border-[#363739]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipamiento Minero (Graphite #1b1c1e, Ash #9c9c9d, 6px radius) */}
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#6a6b6c] mb-1.5 font-medium">
                    Equipamiento Minero:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {veh.equipamiento.map((eq, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-[6px] text-[10px] bg-[#1b1c1e] text-[#9c9c9d] border border-[#363739] flex items-center gap-1"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-[#ff6363]" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Semáforo preventivo */}
                <div className="pt-2 border-t border-[#363739]">
                  <div className="flex items-center justify-between text-[11px] text-[#6a6b6c] mb-1">
                    <span>Odómetro actual:</span>
                    <span className="font-mono font-bold text-white">{veh.odometroActual.toLocaleString()} km</span>
                  </div>
                  <SemaforoBadge odometro={veh.odometroActual} compact={false} />
                </div>
              </div>

              {/* Botón Acción Raycast Secondary */}
              <div className="pt-3 border-t border-[#363739] mt-3">
                <Link
                  to={`/b2b/cotizar?modelo=${encodeURIComponent(veh.modelo)}`}
                  className="btn-raycast-secondary w-full py-2.5 px-4 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#6a6b6c]" />
                  <span>Solicitar {veh.identificadorB2B.codigo}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Franja de Clientes Mineros (Social Proof - Logo Strip) */}
      <MiningClientsStrip />
    </div>
  );
}
