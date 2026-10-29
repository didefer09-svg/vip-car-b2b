import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrafficCone,
  Car,
  History,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Users,
  Wrench,
  FileCheck,
  ShieldCheck,
  Briefcase,
  ArrowRightLeft,
  Lock
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { vehicles, contratos, calcularSemaforo, bitacora, mantenimientos } = useFleet();
  const { user, logout, isTaller, isGerente, loginAsGerente, loginAsTaller } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/dashboard/login');
  };

  // Conmutador rápido de rol para presentación en vivo
  const handleSwitchRole = (newRole) => {
    if (newRole === 'TALLER') {
      loginAsTaller();
      navigate('/dashboard/mantenimiento', { replace: true });
    } else {
      loginAsGerente();
      navigate('/dashboard', { replace: true });
    }
  };

  // Redirección forzada si el rol TALLER intenta estar en /dashboard raíz
  useEffect(() => {
    if (user?.role === 'TALLER' && location.pathname === '/dashboard') {
      navigate('/dashboard/mantenimiento', { replace: true });
    }
  }, [user?.role, location.pathname, navigate]);

  const totalSosAlerts = (bitacora || []).filter((item) => {
    const tipo = (item?.tipoEvento || '').trim();
    const reg = (item?.tipoRegistro || '').toLowerCase();
    return (
      tipo === 'SOS' ||
      tipo === 'Avería' ||
      tipo === 'Averia' ||
      reg.includes('sos') ||
      reg.includes('avería') ||
      reg.includes('averia')
    );
  }).length;

  const stats = (vehicles || []).reduce(
    (acc, v) => {
      const s = calcularSemaforo(v?.odometroActual || 0);
      if (s?.estado === 'Rojo') acc.rojo++;
      if (s?.estado === 'Amarillo') acc.amarillo++;
      return acc;
    },
    { rojo: 0, amarillo: 0 }
  );

  const allNavLinks = [
    {
      to: '/dashboard',
      label: 'Panel Cockpit',
      icon: LayoutDashboard,
      end: true,
      badge: totalSosAlerts > 0 ? `🚨 ${totalSosAlerts} SOS` : null,
      badgeColor: 'bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/50 animate-pulse font-mono',
    },
    {
      to: '/dashboard/conductores',
      label: 'Control de Conductores',
      icon: Users,
    },
    {
      to: '/dashboard/mantenimiento',
      label: 'Mantenimiento',
      icon: Wrench,
      badge: (mantenimientos || []).length > 0 ? `${(mantenimientos || []).length}` : null,
      badgeColor: 'bg-[#1b1c1e] text-[#59d499] border border-[#59d499]/30',
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
      badge: `${(contratos || []).length} Activos`,
      badgeColor: 'bg-[#1b1c1e] text-[#59d499] border border-[#59d499]/30'
    },
    {
      to: '/dashboard/bitacora',
      label: 'Bitácora & Telemetría',
      icon: History
    }
  ];

  // Regla estricta RBAC:
  // - Rol 'TALLER': Solo ve la pestaña de 'Mantenimiento'
  // - Rol 'GERENTE': Acceso total a los 7 módulos
  const navLinks = isTaller
    ? allNavLinks.filter((link) => link.to === '/dashboard/mantenimiento')
    : allNavLinks;

  return (
    <div className="min-h-screen bg-[#040506] flex flex-col md:flex-row text-[#9c9c9d]">
      {/* Mobile Top Toggle */}
      <div className="md:hidden bg-[#07080a] border-b border-white/[0.08] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo-vipcar.png" alt="VIP CAR" className="h-7 w-auto object-contain" />
          <span className="font-bold text-xs text-white font-mono">
            {isTaller ? 'TALLER // PATIO' : 'COCKPIT // GERENCIAL'}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              isTaller
                ? 'bg-[#0f2e1b] text-[#59d499] border-[#59d499]/40'
                : 'bg-[#ff6363]/15 text-[#ff6363] border-[#ff6363]/40'
            }`}
          >
            {isTaller ? 'ROL TALLER' : 'ROL GERENTE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ff6363] text-[11px] transition-colors cursor-pointer font-mono"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px]">Salir</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation Titanium Cockpit */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#07080a] border-r border-white/[0.08] shrink-0 p-4 flex flex-col justify-between`}
      >
        <div className="space-y-5">
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src="/logo-vipcar.png" alt="VIP CAR" className="h-8 w-auto object-contain" />
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full border ${
                    isTaller
                      ? 'bg-[#0f2e1b] text-[#59d499] border-[#59d499]/40'
                      : 'bg-[#ff6363]/15 text-[#ff6363] border-[#ff6363]/40'
                  }`}
                >
                  {isTaller ? 'TALLER' : 'ROOT'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] text-[#6a6b6c] hover:text-[#ff6363] hover:bg-white/[0.03] border border-transparent hover:border-white/[0.1] transition-all cursor-pointer font-mono"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
            <h2 className="text-[11px] uppercase font-mono font-medium tracking-wider text-[#6a6b6c]">
              {isTaller ? 'Módulo de Patio' : 'Control de Operaciones'}
            </h2>
            <p className="text-[11px] text-[#5e6676] mt-0.5 font-mono">
              {isTaller ? 'Taller Junín • Flota Minera' : 'Supervisión de Telemetría • Junín'}
            </p>
          </div>

          {/* Badge informativo de Rol Activo */}
          <div
            className={`p-2.5 rounded-2xl border text-xs font-mono space-y-1 ${
              isTaller
                ? 'bg-[#0a1a10] border-[#59d499]/30 text-[#59d499]'
                : 'bg-[#180a0d] border-[#ff6363]/30 text-[#ff6363]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isTaller ? 'Perfil: Taller Mecánico' : 'Perfil: Gerencia General'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/[0.08] text-white">
                RBAC
              </span>
            </div>
            <p className="text-[10px] text-[#9c9c9d] leading-tight">
              {isTaller
                ? 'Acceso restringido únicamente a órdenes y registro de mantenimientos.'
                : 'Acceso irrestricto a los 7 módulos y auditoría general.'}
            </p>
          </div>

          {/* Menú de Navegación (Filtrado por Rol) */}
          <nav className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6a6b6c]">
              {isTaller ? 'Módulo Permitido' : 'Módulos del Sistema'}
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-full text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-white/[0.08] text-white border border-white/[0.15] font-bold shadow-sm'
                        : 'text-[#9c9c9d] hover:text-white hover:bg-white/[0.03] border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-[#6a6b6c]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Para Gerente: Quick Alert Box */}
          {!isTaller && stats.rojo > 0 && (
            <div className="p-3 rounded-2xl bg-[#ff6363]/10 border border-[#ff6363]/40 text-xs space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-[#ff6363] font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>[SYS // ALERTA CRÍTICA]</span>
              </div>
              <p className="text-[#9c9c9d] text-[11px] leading-relaxed">
                {stats.rojo} pickup(s) han superado el intervalo preventivo y requieren taller de inmediato.
              </p>
            </div>
          )}

          {/* Selector Rápido para Presentación en Vivo */}
          <div className="p-3 rounded-2xl bg-[#111214] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#6a6b6c]">
              <span className="flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span>Simulador de Roles:</span>
              </span>
              <span className="text-amber-400 text-[9px] font-bold">Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitchRole('GERENTE')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isGerente
                    ? 'bg-[#ff6363] text-black shadow-sm'
                    : 'bg-white/[0.04] text-[#9c9c9d] hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Cambiar a vista Gerente (Acceso Total)"
              >
                <span>Gerente</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('TALLER')}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isTaller
                    ? 'bg-[#59d499] text-black shadow-sm'
                    : 'bg-white/[0.04] text-[#9c9c9d] hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Cambiar a vista Taller (Solo Mantenimiento)"
              >
                <span>Taller</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Executive Profile & Sign Out */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl telemetry-well border border-white/[0.08]">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                isTaller
                  ? 'bg-[#59d499]/15 text-[#59d499] border-[#59d499]/40'
                  : 'bg-[#ff6363]/15 text-[#ff6363] border-[#ff6363]/40'
              }`}
            >
              {isTaller ? 'T' : 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {user?.displayName || (isTaller ? 'Téc. Marco Aurelio Quispe' : 'Ing. Carlos Mendoza')}
              </div>
              <div className="text-[10px] text-[#6a6b6c] truncate font-mono">
                {user?.cargo || (isTaller ? 'Jefe de Taller & Mantenimiento' : 'Director de Operaciones')}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full telemetry-well hover:bg-white/[0.05] text-[#9c9c9d] hover:text-[#ff6363] border border-white/[0.08] hover:border-[#ff6363]/40 text-xs font-mono transition-all cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>

          <div className="text-[10px] text-[#5e6676] space-y-0.5 hidden md:block font-mono">
            <div>Base: Huancayo / Junín</div>
            <div>RBAC: {isTaller ? 'Solo Mantenimiento' : 'Acceso Total'}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane over Void Background */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#040506]">
        {/* Top Executive Header Bar with Discreet Logout */}
        <div className="h-12 border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isTaller ? 'bg-[#59d499]' : 'bg-[#59d499]'
              }`}
            />
            <span className="text-[#6a6b6c] font-mono text-[11px] hidden sm:inline">
              [SYS // {isTaller ? 'TALLER ACTIVO' : 'GERENCIA ACTIVA'}]:
            </span>
            <span className="font-medium text-white text-[11px] truncate max-w-[220px]">
              {user?.displayName || (isTaller ? 'Jefe de Taller' : 'Gerencia General VIP CAR')}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden sm:inline ${
                isTaller
                  ? 'bg-[#0f2e1b] text-[#59d499] border-[#59d499]/30'
                  : 'bg-[#2d0e14] text-[#ff6363] border-[#ff6363]/30'
              }`}
            >
              {isTaller ? 'ROL: TALLER / MANTENIMIENTO' : 'ROL: GERENTE (TOTAL)'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-mono text-[#6a6b6c] hover:text-[#ff6363] hover:bg-white/[0.03] border border-white/[0.08] hover:border-[#ff6363]/40 transition-all cursor-pointer"
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
