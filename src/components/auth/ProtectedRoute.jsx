import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-[12px] bg-[#15181e] border border-white/[0.08] shadow-2xl max-w-sm text-center">
          <div className="relative flex items-center justify-center w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-[#e11d48]/20 border-t-[#e11d48] animate-spin" />
            <img src="/logo-vipcar.png" alt="VIP CAR" className="h-6 w-auto object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#f1f2f6]">Cockpit Gerencial VIP CAR</h3>
            <p className="text-xs text-[#8a92a3] mt-1 font-mono">
              Verificando credenciales de seguridad...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login de gerencia preservando la ruta previa
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />;
  }

  return children;
}
