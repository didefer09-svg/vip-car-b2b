import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, ClipboardCheck, ClipboardX, AlertOctagon, User } from 'lucide-react';

export default function DriverLayout() {
  return (
    <div className="min-h-screen bg-[#040506] flex flex-col pb-24 md:pb-12 text-[#9c9c9d]">
      {/* Mobile-First Cockpit Header */}
      <header className="bg-[#07080a] border-b border-[#363739] px-4 py-2.5 sticky top-14 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-vipcar.png"
              alt="VIP CAR"
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="text-[10px] text-[#6a6b6c] leading-tight font-medium">Operador Asignado</div>
              <div className="text-xs font-bold text-[#ffffff]">Carlos Huamán • Operación Toromocho</div>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-[6px] bg-[#1b1c1e] border border-[#363739] text-[10px] font-mono font-bold text-[#59d499]">
            TURNO ACTIVO
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Touch-Friendly Bottom Bar for Drivers (Cockpit Titanium) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#07080a]/95 backdrop-blur-[48px] border-t border-[#363739] z-50 px-2 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <NavLink
            to="/conductor"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-[8px] transition-all ${
                isActive
                  ? 'bg-[#1b1c1e] text-[#ffffff] font-bold border border-[#363739]'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-[#111214]'
              }`
            }
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] tracking-tight">Mi Unidad</span>
          </NavLink>

          <NavLink
            to="/conductor/checkin"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-[8px] transition-all ${
                isActive
                  ? 'bg-[#1b1c1e] text-[#ffffff] font-bold border border-[#363739]'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-[#111214]'
              }`
            }
          >
            <ClipboardCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] tracking-tight">Check-in</span>
          </NavLink>

          <NavLink
            to="/conductor/checkout"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-[8px] transition-all ${
                isActive
                  ? 'bg-[#1b1c1e] text-[#ffffff] font-bold border border-[#363739]'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-[#111214]'
              }`
            }
          >
            <ClipboardX className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] tracking-tight">Check-out</span>
          </NavLink>

          <NavLink
            to="/conductor/averia"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-[8px] transition-all ${
                isActive
                  ? 'bg-[#ff6363] text-white font-black shadow-xs ring-1 ring-[#ff6363]'
                  : 'text-[#ff6363] hover:bg-[#1b1c1e]'
              }`
            }
          >
            <AlertOctagon className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] tracking-tight font-bold">SOS Falla</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
