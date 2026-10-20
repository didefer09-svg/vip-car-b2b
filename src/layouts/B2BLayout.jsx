import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Layers, FileSpreadsheet, FileCheck, ArrowRight } from 'lucide-react';
import Footer from '../components/common/Footer';

export default function B2BLayout() {
  return (
    <div className="min-h-screen bg-[#040506] flex flex-col text-[#9c9c9d]">
      {/* Hero Centrado Sobrio & Minimalista con Fondo de Malla Técnica */}
      <section className="relative bg-[#07080a] border-b border-[#363739] pt-12 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        {/* Fondo de Malla Técnica */}
        <div className="absolute inset-0 cockpit-grid opacity-35 pointer-events-none" />

        {/* Resplandor Ambiental Sutil Coral Pulse */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[320px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 99, 99, 0.08) 0%, rgba(4, 5, 6, 0) 70%)',
            filter: 'blur(70px)'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* 1. Logo Oficial de VIP CAR */}
          <img
            src="/logo-vipcar.png"
            alt="VIP CAR"
            className="h-10 sm:h-12 w-auto object-contain mx-auto mb-4 filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          />

          {/* 2. Título Monumental Sobrio (56px Inter 400) */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#ffffff] uppercase tracking-[0.04em] leading-none mb-6 font-sans">
            PORTAL CORPORATIVO
          </h1>

          {/* 3. Un Único Botón Principal Centrado (Estilo Raycast Mist #e6e6e6) */}
          <div className="mb-7">
            <Link
              to="/b2b/cotizar"
              className="btn-raycast-primary px-6 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center gap-2 rounded-[8px] cursor-pointer"
            >
              <span>Solicitar Lote de Flota</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4. Barra Segmentada con Pestañas de Navegación */}
          <div className="inline-flex p-1 rounded-[10px] bg-[#040506] border border-[#363739] shadow-inner gap-1">
            <NavLink
              to="/b2b"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-[7px] text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1b1c1e] text-[#ffffff] shadow-xs border border-[#363739]'
                    : 'text-[#9c9c9d] hover:text-[#ffffff] hover:bg-white/[0.04]'
                }`
              }
            >
              <Layers className="w-4 h-4 text-[#ff6363]" />
              <span>Catálogo de Flota 4x4</span>
            </NavLink>

            <NavLink
              to="/b2b/cotizar"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-[7px] text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1b1c1e] text-[#ffffff] shadow-xs border border-[#363739]'
                    : 'text-[#9c9c9d] hover:text-[#ffffff] hover:bg-white/[0.04]'
                }`
              }
            >
              <FileSpreadsheet className="w-4 h-4 text-[#ff6363]" />
              <span>Solicitud de Cotización</span>
            </NavLink>

            <NavLink
              to="/b2b/contratos"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-[7px] text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1b1c1e] text-[#ffffff] shadow-xs border border-[#363739]'
                    : 'text-[#9c9c9d] hover:text-[#ffffff] hover:bg-white/[0.04]'
                }`
              }
            >
              <FileCheck className="w-4 h-4 text-[#ff6363]" />
              <span>Gestión de Contratos</span>
            </NavLink>
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
