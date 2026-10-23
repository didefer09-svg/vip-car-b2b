import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Smartphone, BarChart3, Bell, CheckCircle2, Plus, Lock, LogOut, Download, X } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { useAuth } from '../../context/AuthContext';
import { usePWA } from '../../context/PWAContext';

export default function Navbar() {
  const { averias, cloudStatus } = useFleet();
  const { isAuthenticated, user, logout } = useAuth();
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const alertCount = averias.length;

  const handleLogout = async () => {
    await logout();
    if (location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard/login');
    }
  };

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none transition-all space-y-2">
      {/* Banner discreto 'Instalar App' cuando el navegador detecta que es instalable */}
      {isInstallable && !isInstalled && !bannerDismissed && (
        <div className="cockpit-panel rounded-full px-4 py-2 border border-[#ff6363]/40 flex items-center justify-between text-xs shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6363] animate-pulse shrink-0"></span>
            <span className="text-[#9c9c9d] text-[11px] sm:text-xs">
              <strong className="text-white">VIP CAR B2B</strong> está disponible para instalar como aplicación en este dispositivo.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={installApp}
              className="btn-cockpit-action px-3.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3 h-3" />
              <span>Instalar App</span>
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-[#6a6b6c] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              title="Cerrar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="cockpit-panel rounded-full border border-white/[0.08] shadow-2xl px-4 sm:px-5 h-14 flex items-center justify-between">
        {/* Brand Logo: VIP CAR Official Logo */}
        <Link to="/b2b" className="flex items-center group">
          <img
            src="/logo-vipcar.png"
            alt="VIP CAR"
            className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-102 transition-transform"
          />
        </Link>

          {/* Module Switcher Tabs (Cockpit Segmented Control en Cápsula) */}
          <nav className="flex items-center gap-1 telemetry-well p-1 rounded-full border border-white/[0.08]">
            <NavLink
              to="/b2b"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'btn-cockpit-action text-black shadow-sm'
                    : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Portal B2B</span>
              <span className="md:hidden">B2B</span>
            </NavLink>

            <NavLink
              to="/conductor"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'btn-cockpit-action text-black shadow-sm'
                    : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">App Conductor</span>
              <span className="md:hidden">Chofer</span>
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all relative cursor-pointer ${
                  isActive
                    ? 'btn-cockpit-action text-black shadow-sm'
                    : 'text-[#626773] hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cockpit Gerencial</span>
              <span className="md:hidden">Gerencia</span>
              {!isAuthenticated ? (
                <Lock className="w-2.5 h-2.5 text-[#626773]" title="Acceso restringido con autenticación" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#59d499]" title="Sesión ejecutiva activa" />
              )}
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff6363] rounded-full animate-pulse" />
              )}
            </NavLink>
          </nav>

          {/* Right Actions: Cápsulas & CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cloud Firestore Status Badge */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full telemetry-well border border-white/[0.08] text-[11px] font-mono transition-colors"
              title={
                cloudStatus === 'connected'
                  ? 'Conectado a Firebase Firestore en tiempo real'
                  : cloudStatus === 'syncing'
                  ? 'Sincronizando con Firestore...'
                  : 'Modo local sin conexión (operativo en operación)'
              }
            >
              {cloudStatus === 'connected' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59d499] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59d499]"></span>
                  </span>
                  <span className="text-[#59d499] font-medium">Firestore Cloud</span>
                </>
              ) : cloudStatus === 'syncing' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400">Sincronizando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-[#6a6b6c]" />
                  <span className="text-[#6a6b6c]">Modo Local</span>
                </>
              )}
            </div>

            {/* Botón Discreto 'Instalar App' Cápsula */}
            {isInstallable && !isInstalled && (
              <button
                onClick={installApp}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full telemetry-well border border-[#ff6363]/50 text-[#ff6363] text-xs font-mono font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                title="Instalar VIP CAR B2B en este dispositivo"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instalar App</span>
                <span className="sm:hidden text-[11px]">Instalar</span>
              </button>
            )}

            {/* Primary Action Button Cápsula */}
            <Link
              to="/b2b/cotizar"
              className="btn-cockpit-action hidden sm:inline-flex items-center gap-1.5 py-2 px-4 rounded-full font-mono font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Solicitar Flota</span>
            </Link>

            {/* Notification Bell Cápsula */}
            <Link
              to="/dashboard/semaforo"
              className="relative p-2 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ffffff] hover:border-white/[0.2] transition-colors"
              title="Alertas de Mantenimiento"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] bg-[#ff6363] text-white rounded-full flex items-center justify-center font-bold">
                  {alertCount}
                </span>
              )}
            </Link>

            {/* Executive Auth Indicator / Quick Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-white/[0.08]">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full telemetry-well border border-white/[0.08] hover:border-white/[0.2] text-xs transition-colors"
                  title={`Conectado como: ${user?.displayName || 'Gerencia'}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 flex items-center justify-center font-bold text-[10px] font-mono">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
                  </span>
                  <span className="text-[11px] font-medium text-[#ffffff] hidden xl:inline max-w-[90px] truncate">
                    {user?.displayName || 'Gerencia'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ff6363] hover:border-[#ff6363]/40 transition-colors cursor-pointer"
                  title="Cerrar sesión gerencial"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/dashboard/login"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full telemetry-well border border-white/[0.08] hover:border-white/[0.2] text-[#9c9c9d] hover:text-[#ffffff] text-xs font-medium transition-colors"
                title="Acceso restringido para gerencia y supervisores"
              >
                <Lock className="w-3 h-3 text-[#ff6363]" />
                <span className="text-[11px] font-mono">Acceso Gerencia</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    );
}
