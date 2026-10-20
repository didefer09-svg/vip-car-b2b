import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrafficCone,
  Car,
  History,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { vehicles, contratos, calcularSemaforo } = useFleet();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/dashboard/login');
  };

  const stats = vehicles.reduce(
    (acc, v) => {
      const s = calcularSemaforo(v.odometroActual);
      if (s.estado === 'Rojo') acc.rojo++;
      if (s.estado === 'Amarillo') acc.amarillo++;
      return acc;
    },
    { rojo: 0, amarillo: 0 }
  );

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Panel Cockpit',
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/dashboard/semaforo',
      label: 'Semáforo Preventivo',
      icon: TrafficCone,
      badge: stats.rojo > 0 ? `${stats.rojo} Críticos` : stats.amarillo > 0 ? `${stats.amarillo} Próx.` : null,
      badgeColor: stats.rojo > 0 ? 'bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/40' : 'bg-[#231908] text-[#f59e0b] border border-[#f59e0b]/40'
    },
    {
      to: '/dashboard/flota',
      label: 'Gestión de Flota (CRUD)',
      icon: Car
    },
    {
      to: '/dashboard/contratos',
      label: 'Contratos Corporativos',
      icon: FileCheck,
      badge: `${contratos.length} Activos`,
      badgeColor: 'bg-[#1b1c1e] text-[#59d499] border border-[#59d499]/30'
    },
    {
      to: '/dashboard/bitacora',
      label: 'Bitácora & Telemetría',
      icon: History
    }
  ];

  return (
    <div className="min-h-screen bg-[#040506] flex flex-col md:flex-row text-[#9c9c9d]">
      {/* Mobile Top Toggle */}
      <div className="md:hidden bg-[#07080a] border-b border-[#363739] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo-vipcar.png" alt="VIP CAR" className="h-7 w-auto object-contain" />
          <span className="font-bold text-xs text-white">Cockpit Gerencial</span>
          {stats.rojo > 0 && (
            <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/40 font-mono font-bold">
              {stats.rojo} Urgentes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#111214] border border-[#363739] text-[#9c9c9d] hover:text-[#ff6363] text-[11px] transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px]">Salir</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-[4px] bg-[#111214] border border-[#363739] text-[#9c9c9d]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation Titanium Cockpit (Ink #07080a, Hairline #363739) */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#07080a] border-r border-[#363739] shrink-0 p-4 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src="/logo-vipcar.png" alt="VIP CAR" className="h-8 w-auto object-contain" />
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded-[4px] bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/40">
                  ADMIN
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] text-[11px] text-[#6a6b6c] hover:text-[#ff6363] hover:bg-[#111214] border border-transparent hover:border-[#363739] transition-all cursor-pointer font-medium"
                title="Cerrar sesión gerencial"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
            <h2 className="text-[11px] uppercase font-mono font-medium tracking-wider text-[#6a6b6c]">
              Control de Operaciones
            </h2>
            <p className="text-[11px] text-[#5e6676] mt-0.5 font-mono">
              Supervisión de Telemetría • Junín
            </p>
          </div>

          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1b1c1e] text-white border border-[#363739] shadow-xs'
                        : 'text-[#9c9c9d] hover:text-white hover:bg-[#111214] border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-[#6a6b6c]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-[4px] ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Alert Box */}
          {stats.rojo > 0 && (
            <div className="p-3 rounded-[8px] bg-[#2d0e14] border border-[#ff6363]/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#ff6363] font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta Preventiva Crítica</span>
              </div>
              <p className="text-[#9c9c9d] text-[11px] leading-relaxed">
                {stats.rojo} pickup(s) han superado el intervalo de 5k/10k/20k km y requieren taller preventivo inmediato.
              </p>
            </div>
          )}
        </div>

        {/* Footer Executive Profile & Sign Out */}
        <div className="pt-4 border-t border-[#363739] space-y-3">
          <div className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#111214] border border-[#363739]">
            <div className="w-8 h-8 rounded-full bg-[#2d0e14] border border-[#ff6363]/40 flex items-center justify-center text-[#ff6363] font-bold text-xs shrink-0 font-mono">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {user?.displayName || 'Gerencia VIP CAR'}
              </div>
              <div className="text-[10px] text-[#6a6b6c] truncate font-mono">
                {user?.cargo || user?.email || 'Director de Operaciones'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#ff6363] border border-[#363739] hover:border-[#ff6363]/40 text-xs font-medium transition-all cursor-pointer"
            title="Cerrar sesión gerencial"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>

          <div className="text-[10px] text-[#5e6676] space-y-0.5 hidden md:block font-mono">
            <div>Proyectos / Operaciones: Toromocho, Yauli, Nexa</div>
            <div>Sincronización: Cloud Firestore</div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane over Void Background */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#040506]">
        {/* Top Executive Header Bar with Discreet Logout */}
        <div className="h-12 border-b border-[#363739] bg-[#07080a] px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#59d499] animate-pulse" />
            <span className="text-[#6a6b6c] font-mono text-[11px] hidden sm:inline">Sesión Gerencial:</span>
            <span className="font-medium text-white text-[11px] truncate max-w-[200px]">
              {user?.displayName || 'Gerencia General VIP CAR'}
            </span>
            <span className="text-[10px] font-mono text-[#6a6b6c] hidden md:inline">• Base Huancayo / Operaciones</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-[8px] text-xs text-[#6a6b6c] hover:text-[#ff6363] hover:bg-[#111214] border border-[#363739] hover:border-[#ff6363]/40 transition-all font-medium cursor-pointer"
            title="Cerrar sesión y volver al login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
