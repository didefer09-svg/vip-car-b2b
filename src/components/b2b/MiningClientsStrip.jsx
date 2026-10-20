import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

const CLIENTS = [
  {
    name: 'NEXA Resources',
    sector: 'Minería Polimetálica',
    tag: 'El Porvenir / Atacocha'
  },
  {
    name: 'SGS del Perú',
    sector: 'Inspección & Homologación',
    tag: 'Certificación Minera'
  },
  {
    name: 'Cía. Minera KOLPA',
    sector: 'Mina Subterránea',
    tag: 'Huachocolpa Uno'
  },
  {
    name: 'REDRILSA Drilling',
    sector: 'Perforación Diamantina',
    tag: 'Trabajo en Mina & Altura'
  },
  {
    name: 'CONGEMIN JH',
    sector: 'Contratista Minero',
    tag: 'Obras y Túneles'
  },
  {
    name: 'TRAFIGURA',
    sector: 'Logística de Concentrados',
    tag: 'Trading & Transporte'
  }
];

export default function MiningClientsStrip() {
  return (
    <section className="py-12 border-t border-white/[0.08] bg-[#06080b] select-none relative overflow-hidden">
      {/* Luz sutil de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#ff6363]/5 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Técnica de la Franja */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ff6363]" />
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#626773] font-mono font-bold">
              CONFIAN EN NUESTRA FLOTA // OPERACIONES ACTIVAS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#59d499] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#59d499] animate-pulse" />
            Homologación Minera Aprobada
          </span>
        </div>

        {/* Módulos de Clientes con Estilo Cockpit Orgánico */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 items-stretch justify-center">
          {CLIENTS.map((client, idx) => (
            <div
              key={idx}
              className="cockpit-panel group relative flex flex-col items-center justify-center p-4.5 rounded-2xl border border-white/[0.08] hover:border-[#ff6363]/40 transition-all duration-300 cursor-default shadow-md"
            >
              {/* Esquinas técnicas HUD */}
              <div className="absolute top-2 left-2 text-[8px] font-mono text-white/20 group-hover:text-[#ff6363]/60 transition-colors">
                +
              </div>
              <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 group-hover:text-[#ff6363]/60 transition-colors">
                +
              </div>

              {/* Nombre Principal Monocromático */}
              <span className="font-bold text-xs sm:text-sm tracking-tight text-white group-hover:text-[#ff6363] transition-colors text-center font-sans">
                {client.name}
              </span>

              {/* Tag Secundario Monospace en Cápsula */}
              <span className="text-[9px] font-mono text-[#626773] group-hover:text-[#949aa6] mt-1.5 transition-colors text-center truncate max-w-full px-2 py-0.5 rounded-full telemetry-well border border-white/[0.06]">
                {client.sector}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
