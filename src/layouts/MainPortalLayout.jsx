import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

/**
 * Layout Principal para todo el Portal B2B y Dashboard Gerencial.
 * Mantiene el Header y la barra de navegación superior intactos
 * en todas las vistas corporativas (Dashboard, Semáforo, Bitácora, Flota, Contratos, etc.).
 */
export default function MainPortalLayout() {
  return (
    <div className="min-h-screen bg-[#040506] text-[#9c9c9d] flex flex-col font-sans selection:bg-[#ff6363] selection:text-white">
      {/* Barra de Navegación Superior / Header Corporativo Intacto */}
      <Navbar />

      {/* Contenedor Principal de Vistas B2B y Cockpit */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
