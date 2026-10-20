import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, ClipboardCheck, ClipboardX, AlertOctagon, User } from 'lucide-react';

export default function DriverLayout() {
  return (
    <div className="min-h-screen bg-[#040506] flex flex-col pb-24 md:pb-12 text-[#9c9c9d]">
      {/* Mobile-First Cockpit Header */}
      <header className="bg-[#07080a]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-2.5 sticky top-14 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-vipcar.png"
              alt="VIP CAR"
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="text-[10px] text-[#6a6b6c] leading-tight font-mono font-medium">[OPERATOR // ASIGNADO]</div>
              <div className="text-xs font-bold text-[#ffffff] font-sans">Carlos Huamán • Operación Toromocho</div>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-[#59d499]/15 border border-[#59d499]/30 text-[10px] font-mono font-bold text-[#59d499]">
            TURNO ACTIVO
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Touch-Friendly Bottom Bar for Drivers (Cockpit Titanium) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#07080a]/95 backdrop-blur-[48px] border-t border-white/[0.08] z-50 px-2 py-1.5 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <NavLink
            to="/conductor"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
                isActive
                  ? 'bg-white/[0.08] text-[#ffffff] font-bold border border-white/[0.15] shadow-sm'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-white/[0.03]'
              }`
            }
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-mono tracking-tight">Mi Unidad</span>
          </NavLink>

          <NavLink
            to="/conductor/checkin"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
                isActive
                  ? 'bg-white/[0.08] text-[#ffffff] font-bold border border-white/[0.15] shadow-sm'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-white/[0.03]'
              }`
            }
          >
            <ClipboardCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-mono tracking-tight">Check-in</span>
          </NavLink>

          <NavLink
            to="/conductor/checkout"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
                isActive
                  ? 'bg-white/[0.08] text-[#ffffff] font-bold border border-white/[0.15] shadow-sm'
                  : 'text-[#6a6b6c] hover:text-[#ffffff] hover:bg-white/[0.03]'
              }`
            }
          >
            <ClipboardX className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-mono tracking-tight">Check-out</span>
          </NavLink>

          <NavLink
            to="/conductor/averia"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
                isActive
                  ? 'bg-[#ff6363] text-white font-black shadow-lg ring-1 ring-[#ff6363]'
                  : 'text-[#ff6363] hover:bg-[#ff6363]/10'
              }`
            }
          >
            <AlertOctagon className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-mono tracking-tight font-bold">SOS Falla</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
