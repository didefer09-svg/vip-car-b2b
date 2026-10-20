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
  ChevronLeft
} from 'lucide-react';

export default function Login() {
  const { login, loginAsDemo, isAuthenticated, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Destino original antes de la redirección al login
  const from = location.state?.from?.pathname || '/dashboard';

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password) {
      setLocalError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Error al autenticar credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setLoading(true);
    try {
      loginAsDemo();
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError('Error al iniciar con credenciales demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 overflow-hidden bg-[#040506]">
      {/* Fondo de Malla Técnica Cockpit + Resplandor Ambiental Coral Pulse */}
      <div className="absolute inset-0 pointer-events-none cockpit-grid opacity-25" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 99, 99, 0.1) 0%, rgba(4, 5, 6, 0) 70%)',
          filter: 'blur(70px)'
        }}
      />

      <div className="relative z-10 w-full max-w-md">
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

        {/* Tarjeta Raycast Titanium Curved (24px radius rounded-3xl) */}
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
              <span>Acceso Restringido • Gerencia</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-sans">
              Acceso Gerencial
            </h1>
            <p className="text-xs text-[#6a6b6c] mt-1 max-w-xs leading-relaxed">
              Supervisión de telemetría de flotas mineras, semáforo preventivo y auditoría de odómetros.
            </p>
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Correo o Usuario */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#6a6b6c] mb-1.5">
                Correo o Usuario Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6a6b6c]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gerencia@vipcar.pe"
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

            {/* Botón Principal Raycast Mist Capsule: Iniciar Sesión */}
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

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#07080a] px-3 text-[#6a6b6c]">
                Acceso de Demostración & Auditoría
              </span>
            </div>
          </div>

          {/* Caja de Acceso Rápido para Demostración */}
          <div className="p-4 rounded-2xl bg-[#111214] border border-white/[0.08] text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Credenciales de Gerencia</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono">
                Bypass Operación
              </span>
            </div>

            <div className="font-mono text-[11px] text-[#9c9c9d] bg-[#07080a] p-2.5 rounded-xl border border-white/[0.08] space-y-0.5">
              <div className="flex justify-between">
                <span className="text-[#6a6b6c]">Usuario:</span>
                <span className="text-white">gerencia@vipcar.pe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6a6b6c]">Contraseña:</span>
                <span className="text-white">vipcar2026</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={loading}
              className="btn-raycast-secondary w-full py-2.5 px-4 rounded-full text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Autocompletar e Ingresar como Gerencia</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pie de página con aviso de seguridad */}
        <p className="text-center text-[10px] text-[#6a6b6c] font-mono mt-4">
          Conexión cifrada TLS 1.3 • Sincronización en tiempo real con Firestore
        </p>
      </div>
    </div>
  );
}
