import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  Layers,
  FileSpreadsheet,
  FileCheck,
  ArrowRight,
  Compass
} from 'lucide-react';
import Footer from '../components/common/Footer';

export default function B2BLayout() {
  return (
    <div className="min-h-screen bg-[#040506] flex flex-col text-[#949aa6] selection:bg-[#ff6363] selection:text-white">
      {/* ========================================================================= */}
      {/* COCKPIT HERO: ARQUITECTURA ASIMÉTRICA TIPO RIVIAN FLEETOS / PORSCHE DIGITAL */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#090b0e] via-[#050608] to-[#040506] border-b border-white/[0.08] pt-8 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        {/* Atmósfera de Iluminación Rim Light & Resplandor Coral */}
        <div
          className="absolute -top-32 left-1/4 w-[540px] h-[360px] rounded-full pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255, 99, 99, 0.18) 0%, rgba(4, 5, 6, 0) 70%)',
            filter: 'blur(80px)'
          }}
        />

        <div
          className="absolute top-1/2 right-10 w-[420px] h-[280px] rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(4, 5, 6, 0) 70%)',
            filter: 'blur(75px)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* Mando Operativo Corporativo */}
          <div className="max-w-3xl space-y-5">
            {/* Telemetry Status Bar */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full telemetry-well border border-white/[0.08] text-xs font-mono shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59d499] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59d499]"></span>
              </span>
              <span className="text-[#59d499] font-bold tracking-wider text-[10px]">
                SYS // FLEET-OS v2.6
              </span>
              <span className="text-white/20">|</span>
              <span className="text-[#949aa6] text-[10px] tracking-widest hidden sm:inline">
                RED REGIONAL JUNÍN • 4,380 MSNM
              </span>
            </div>

            {/* Título Monumental & Emblema VIP CAR */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-vipcar.png"
                  alt="VIP CAR"
                  className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,99,99,0.2)]"
                />
                <div className="h-6 w-[1px] bg-white/15" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#ff6363] uppercase font-bold">
                  Operaciones Mineras
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] font-sans">
                PORTAL CORPORATIVO
              </h1>
              <p className="text-xs sm:text-sm text-[#949aa6] font-mono max-w-xl leading-relaxed">
                Sistema centralizado de arriendo, telemetría y homologación técnica de camionetas 4x4 para operaciones mineras y construcción en alta montaña.
              </p>
            </div>

            {/* Botón de Acción Principal Cockpit en Cápsula + Métricas Rápidas */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/b2b/cotizar"
                className="btn-cockpit-action px-7 py-3.5 text-xs sm:text-sm font-bold rounded-full inline-flex items-center gap-2.5 cursor-pointer shadow-xl active:scale-98 font-mono"
              >
                <span>Solicitar Lote de Flota</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </Link>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full telemetry-well border border-white/[0.08] text-[11px] font-mono text-[#626773]">
                <Compass className="w-3.5 h-3.5 text-[#ff6363]" />
                <span>Base Central: Huancayo • Junín</span>
              </div>
            </div>
          </div>

          {/* Selector Segmentado de Modos de Consola en Cápsula (Avionics Strip) */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]">
            <div className="inline-flex p-1.5 rounded-full telemetry-well border border-white/[0.08] shadow-2xl gap-1.5 w-full sm:w-auto">
              <NavLink
                to="/b2b"
                end
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all flex-1 sm:flex-none cursor-pointer ${
                    isActive
                      ? 'btn-cockpit-action text-black shadow-lg'
                      : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="tracking-wider">01 // CATÁLOGO TÉCNICO</span>
              </NavLink>

              <NavLink
                to="/b2b/cotizar"
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all flex-1 sm:flex-none cursor-pointer ${
                    isActive
                      ? 'btn-cockpit-action text-black shadow-lg'
                      : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="tracking-wider">02 // LICITACIÓN & LOTE</span>
              </NavLink>

              <NavLink
                to="/b2b/contratos"
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all flex-1 sm:flex-none cursor-pointer ${
                    isActive
                      ? 'btn-cockpit-action text-black shadow-lg'
                      : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span className="tracking-wider">03 // EXPEDIENTE & GARITA</span>
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#626773]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59d499]" />
              <span>Flota 4x4 en arriendo continuo para minería</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer Corporativo Oficial */}
      <Footer />
    </div>
  );
}
