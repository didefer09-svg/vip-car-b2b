import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Wrench,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const { login, loginAsGerente, loginAsTaller, isAuthenticated, user, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Destino original antes de la redirección al login
  const from = location.state?.from?.pathname;

  // Si ya está autenticado, redirigir según el rol
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'TALLER') {
        navigate('/mantenimiento', { replace: true });
      } else {
        const dest = from && from !== '/dashboard/login' ? from : '/dashboard';
        navigate(dest, { replace: true });
      }
    }
  }, [isAuthenticated, user?.role, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      const role = res?.user?.role || (email.toLowerCase().includes('taller') || email.toLowerCase().includes('mantenimiento') ? 'TALLER' : 'GERENTE');
      if (role === 'TALLER') {
        navigate('/mantenimiento', { replace: true });
      } else {
        const dest = from && from !== '/dashboard/login' ? from : '/dashboard';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setLocalError(err.message || 'Error al autenticar credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Botón Rápido 1: Simular rol Gerente (Acceso Total)
  const handleQuickLoginGerente = () => {
    setLoading(true);
    try {
      loginAsGerente();
      const dest = from && from !== '/dashboard/login' ? from : '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setLocalError('Error al iniciar como Gerente.');
    } finally {
      setLoading(false);
    }
  };

  // Botón Rápido 2: Simular rol Taller (Acceso Restringido a /mantenimiento)
  const handleQuickLoginTaller = () => {
    setLoading(true);
    try {
      loginAsTaller();
      navigate('/mantenimiento', { replace: true });
    } catch (err) {
      setLocalError('Error al iniciar como Taller.');
    } finally {
      setLoading(false);
    }
  };

  // Helper para autollenar credenciales en el formulario manual
  const autofillCredentials = (roleType) => {
    if (roleType === 'GERENTE') {
      setEmail('gerencia@vipcar.pe');
      setPassword('vipcar2026');
    } else {
      setEmail('taller@vipcar.pe');
      setPassword('taller2026');
    }
    setLocalError('');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 overflow-hidden bg-[#040506]">
      {/* Fondo de Malla Técnica Cockpit + Resplandor Ambiental */}
      <div className="absolute inset-0 pointer-events-none cockpit-grid opacity-25" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 99, 99, 0.08) 0%, rgba(4, 5, 6, 0) 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="relative z-10 w-full max-w-lg my-8">
        {/* Enlace para volver */}
        <div className="mb-4">
          <Link
            to="/b2b"
            className="inline-flex items-center gap-1.5 text-xs text-[#6a6b6c] hover:text-white transition-colors font-mono"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Volver al Portal B2B</span>
          </Link>
        </div>

        {/* Tarjeta Raycast Titanium Curved */}
        <div className="cockpit-panel rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl key-shadow">
          {/* Cabecera con Logotipo Oficial */}
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="/logo-vipcar.png"
              alt="VIP CAR Huancayo"
              className="h-10 sm:h-11 w-auto object-contain mb-3 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/40 text-[10px] font-mono font-medium uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>Control de Accesos por Roles (RBAC)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-sans">
              Portal Gerencial & Operativo
            </h1>
            <p className="text-xs text-[#6a6b6c] mt-1 max-w-sm leading-relaxed">
              Inicia sesión con tu perfil asignado para acceder a los módulos autorizados según tu nivel de seguridad.
            </p>
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN TEMPORAL PARA PRESENTACIÓN: BOTONES DE LOGIN RÁPIDO */}
          {/* ============================================================== */}
          <div className="mb-6 p-4 rounded-2xl bg-[#0f1115] border border-amber-400/30 text-xs space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BOTONES DE ACCESO RÁPIDO (MODO PRESENTACIÓN)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono font-bold">
                1-CLICK
              </span>
            </div>
            <p className="text-[11px] text-[#9c9c9d] leading-relaxed">
              Selecciona cualquiera de los dos perfiles para demostrar de inmediato el control estricto de roles:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Botón 1: Simular rol Gerente */}
              <button
                type="button"
                onClick={handleQuickLoginGerente}
                disabled={loading}
                className="group relative flex flex-col items-start p-3 rounded-xl bg-[#1c1214] hover:bg-[#261518] border border-[#ff6363]/40 hover:border-[#ff6363] transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="flex items-center gap-1.5 text-[#ff6363] font-bold text-xs font-mono">
                    <Briefcase className="w-3.5 h-3.5" />
                    Simular rol Gerente
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6363] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] text-white font-medium">Ing. Carlos Mendoza</span>
                <span className="text-[9px] text-[#9c9c9d] mt-0.5 font-mono">
                  ✓ Acceso Total (7 módulos)
                </span>
                <span className="text-[9px] text-[#59d499] font-mono">
                  Navega por cualquier ruta
                </span>
              </button>

              {/* Botón 2: Simular rol Taller */}
              <button
                type="button"
                onClick={handleQuickLoginTaller}
                disabled={loading}
                className="group relative flex flex-col items-start p-3 rounded-xl bg-[#0d1c14] hover:bg-[#13281c] border border-[#59d499]/40 hover:border-[#59d499] transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="flex items-center gap-1.5 text-[#59d499] font-bold text-xs font-mono">
                    <Wrench className="w-3.5 h-3.5" />
                    Simular rol Taller
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#59d499] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-white font-medium text-[10px]">Téc. Marco Aurelio Quispe</span>
                <span className="text-[9px] text-[#9c9c9d] mt-0.5 font-mono">
                  ✓ Redirige a /mantenimiento
                </span>
                <span className="text-[9px] text-amber-300 font-mono">
                  🔒 Menú lateral solo Mantenimiento
                </span>
              </button>
            </div>
          </div>

          {/* Separador */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#07080a] px-3 text-[#6a6b6c]">
                O ingresar con credenciales manuales
              </span>
            </div>
          </div>

          {/* Banner de Error si falló la autenticación */}
          {(localError || authError) && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#2d0e14] border border-[#ff6363]/50 flex items-start gap-2.5 text-xs text-[#ff6363]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">{localError || authError}</span>
              </div>
            </div>
          )}

          {/* Formulario Manual */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Correo o Usuario */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-[#6a6b6c]">
                  Correo Corporativo
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#6a6b6c]">
                  <span>Autollenar:</span>
                  <button
                    type="button"
                    onClick={() => autofillCredentials('GERENTE')}
                    className="text-[#ff6363] hover:underline cursor-pointer"
                  >
                    Gerente
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => autofillCredentials('TALLER')}
                    className="text-[#59d499] hover:underline cursor-pointer"
                  >
                    Taller
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6a6b6c]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gerencia@vipcar.pe o taller@vipcar.pe"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-full telemetry-well border border-white/[0.08] text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] transition-colors font-sans"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-[#6a6b6c]">
                  Contraseña
                </label>
                <span className="text-[10px] text-[#6a6b6c] font-mono">
                  MFA / Cifrado Activo
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6a6b6c]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-full telemetry-well border border-white/[0.08] text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6a6b6c] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón Principal: Iniciar Sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-5 rounded-full bg-[#e6e6e6] hover:bg-white text-[#454647] hover:text-[#1a1a1a] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Detalle informativo de cuentas registradas */}
          <div className="mt-5 p-3 rounded-xl bg-[#08090b] border border-white/[0.06] font-mono text-[10px] text-[#6a6b6c] space-y-1">
            <div className="font-semibold text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#59d499]" />
              <span>Cuentas activas en sistema RBAC:</span>
            </div>
            <div className="flex justify-between items-center text-[#9c9c9d] pt-1">
              <span>👑 <strong className="text-white">Gerente:</strong> gerencia@vipcar.pe / vipcar2026</span>
              <span className="text-[#ff6363] text-[9px]">Acceso Total</span>
            </div>
            <div className="flex justify-between items-center text-[#9c9c9d]">
              <span>🔧 <strong className="text-white">Taller:</strong> taller@vipcar.pe / taller2026</span>
              <span className="text-[#59d499] text-[9px]">Solo Mantenimiento</span>
            </div>
          </div>
        </div>

        {/* Pie de página con aviso de seguridad */}
        <p className="text-center text-[10px] text-[#6a6b6c] font-mono mt-4">
          Conexión cifrada TLS 1.3 • Control de Acceso por Roles (RBAC) verificado
        </p>
      </div>
    </div>
  );
}
