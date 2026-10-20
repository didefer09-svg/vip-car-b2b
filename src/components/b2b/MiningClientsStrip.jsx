import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
    <section className="py-10 border-t border-[#363739] bg-[#07080a] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Título Discreto: Geist/Inter 12px uppercase tracking-widest text-[#6a6b6c] */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h3 className="text-[12px] uppercase tracking-widest text-[#6a6b6c] font-sans font-medium">
            CONFIAN EN NUESTRA FLOTA
          </h3>
        </div>

        {/* Grid / Franja Horizontal de Logos y Clientes Mineros en Grayscale */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 items-stretch justify-center">
          {CLIENTS.map((client, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-[8px] bg-[#111214] hover:bg-[#1b1c1e] border border-[#363739] hover:border-white/[0.2] transition-all duration-300 cursor-default shadow-xs"
            >
              {/* Resplandor sutil al hover */}
              <div className="absolute inset-0 rounded-[8px] bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Nombre Principal Monocromático con Brillo Sutil al Hover */}
              <span className="font-bold text-xs sm:text-sm tracking-tight text-[#9c9c9d] group-hover:text-[#ffffff] group-hover:brightness-125 transition-all duration-200 text-center font-sans">
                {client.name}
              </span>

              {/* Tag Secundario Monospace */}
              <span className="text-[10px] font-mono text-[#6a6b6c] group-hover:text-[#9c9c9d] mt-1 transition-colors text-center truncate max-w-full">
                {client.sector}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
