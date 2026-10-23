import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  if (!vehicle) return null;

  // Cálculo de Salud Mecánica Preventiva a intervalos de 5,000 km
  const siguienteServicio = Math.ceil((vehicle.odometroActual + 1) / 5000) * 5000;
  const kmRestantes = siguienteServicio - vehicle.odometroActual;
  const progreso = Math.min(100, Math.max(0, ((5000 - kmRestantes) / 5000) * 100));

  let progresoTexto = `Faltan ${kmRestantes.toLocaleString()} km para servicio`;
  let barraColor = '#59d499';
  let textoColor = 'text-zinc-400';

  if (kmRestantes <= 0) {
    progresoTexto = `Excedido por ${Math.abs(kmRestantes).toLocaleString()} km`;
    barraColor = '#ff6363';
    textoColor = 'text-[#ff6363]';
  } else if (kmRestantes <= 500) {
    progresoTexto = `Faltan ${kmRestantes.toLocaleString()} km para servicio`;
    barraColor = '#f59e0b';
    textoColor = 'text-[#f59e0b]';
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-700/50 hover:border-slate-600/60 transition-all duration-300 shadow-xl">
      {/* 1. Fotografía a sangre con gradiente sutil y badges flotantes */}
      <div className="relative h-52 bg-[#050608] overflow-hidden">
        <img
          src={vehicle.imagen}
          alt={vehicle.modelo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/logo-vipcar.png';
          }}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-[#080a0d]/20 to-transparent" />

        {/* Badges de cabecera flotantes */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 font-mono text-[10px]">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ff6363] font-bold border border-white/10">
            {vehicle.identificadorB2B?.codigo || vehicle.placa}
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-medium border border-white/10">
            {vehicle.traccion}
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 font-mono text-[10px]">
          <span
            className={`px-3 py-1 rounded-full font-bold backdrop-blur-md ${
              vehicle.estadoOperativo === 'Disponible'
                ? 'bg-[#59d499]/20 text-[#59d499] border border-[#59d499]/30'
                : 'bg-white/10 text-zinc-300 border border-white/10'
            }`}
          >
            {vehicle.estadoOperativo}
          </span>
        </div>

        {/* Placa protegida sutil */}
        <div className="absolute bottom-2.5 left-4 text-[11px] font-mono text-zinc-500">
          Placa: <span className="text-zinc-400">{vehicle.identificadorB2B?.enmascarada || vehicle.placa}</span>
        </div>
      </div>

      {/* 2. Cuerpo Editorial de la Ficha */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Título Principal y Subtítulo en Inter */}
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug font-sans">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-xs text-zinc-400 font-sans font-normal mt-0.5">
              {vehicle.anio} • {vehicle.tipo} • {vehicle.motor}
            </p>
          </div>

          {/* Especificaciones Técnicas (Números Tabulares Monospace Estricto) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-0.5">
                Capacidad Carga
              </span>
              <span className="text-white font-mono tabular-nums text-xs font-medium">
                {vehicle.capacidadCarga}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-0.5">
                Odómetro Actual
              </span>
              <span className="text-white font-mono tabular-nums text-xs font-medium">
                {vehicle.odometroActual.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* Certificaciones de Garita: Tags muy sutiles de fondo gris oscuro sin bordes chillones */}
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-1.5">
              Certificaciones de Garita
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vehicle.certificaciones?.map((cert, i) => (
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
              <span className={`font-mono tabular-nums text-xs font-medium ${textoColor}`}>
                {progresoTexto}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progreso}%`, backgroundColor: barraColor }}
              />
            </div>
          </div>

          {/* Lista de equipamiento limpia en grid-cols-2 sin bordes individuales */}
          <div className="pt-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-2">
              Equipamiento de Seguridad
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {vehicle.equipamiento?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300 font-sans font-normal">
                  <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Fila Inferior: Tarifa y Botón de Acción en Cápsula Completa (Rojo para móvil) */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/[0.04]">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans">
              Tarifa Corporativa
            </div>
            <div className="text-xl font-bold text-white font-mono tabular-nums leading-none mt-1">
              ${vehicle.tarifaDiariaUSD}{' '}
              <span className="text-[11px] font-normal text-zinc-500 font-sans">USD/día</span>
            </div>
          </div>

          <Link
            to={`/b2b/cotizar?modelo=${encodeURIComponent(vehicle.modelo)}`}
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/40 active:scale-98 font-sans"
          >
            <span>Cotizar {vehicle.identificadorB2B?.codigo || 'Unidad'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
