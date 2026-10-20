import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FleetProvider } from './context/FleetContext';
import { PWAProvider } from './context/PWAContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';

// Layouts
import B2BLayout from './layouts/B2BLayout';
import DriverLayout from './layouts/DriverLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Módulo 1: App de Campo para Conductores
import DriverHome from './modules/driver/DriverHome';
import CheckIn from './modules/driver/CheckIn';
import CheckOut from './modules/driver/CheckOut';
import ReportarAveria from './modules/driver/ReportarAveria';

// Módulo 2: Portal Corporativo B2B
import CatalogoCorporativo from './modules/b2b/CatalogoCorporativo';
import SolicitudCotizacion from './modules/b2b/SolicitudCotizacion';
import ContratosActivos from './modules/b2b/ContratosActivos';

// Módulo 3: Dashboard de Gerencia & Semáforo
import Login from './modules/dashboard/Login';
import DashboardHome from './modules/dashboard/DashboardHome';
import SemaforoMantenimiento from './modules/dashboard/SemaforoMantenimiento';
import GestionFlota from './modules/dashboard/GestionFlota';
import GestionContratos from './modules/dashboard/GestionContratos';
import Bitacora from './modules/dashboard/Bitacora';

export default function App() {
  return (
    <PWAProvider>
      <AuthProvider>
        <FleetProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#040506] text-[#9c9c9d] flex flex-col font-sans selection:bg-[#ff6363] selection:text-white">
              {/* Notificación de Instalación PWA y Alerta Offline */}
              <PWAInstallPrompt />

              {/* Barra Superior con Selector de Módulos (Portal B2B / Conductor / Gerencia) */}
              <Navbar />

          {/* Rutas de la Aplicación */}
          <div className="flex-1">
            <Routes>
              {/* Ruta Principal: Redirección al Portal B2B */}
              <Route path="/" element={<Navigate to="/b2b" replace />} />

              {/* MÓDULO 2: Portal Corporativo B2B (Mineras & Constructoras) */}
              <Route path="/b2b" element={<B2BLayout />}>
                <Route index element={<CatalogoCorporativo />} />
                <Route path="cotizar" element={<SolicitudCotizacion />} />
                <Route path="contratos" element={<ContratosActivos />} />
              </Route>

              {/* MÓDULO 1: App de Campo para Conductores (Mobile-First) */}
              <Route path="/conductor" element={<DriverLayout />}>
                <Route index element={<DriverHome />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="checkout" element={<CheckOut />} />
                <Route path="averia" element={<ReportarAveria />} />
              </Route>

              {/* MÓDULO 3: Autenticación & Acceso Gerencial Restringido */}
              <Route path="/login" element={<Navigate to="/dashboard/login" replace />} />
              <Route path="/dashboard/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="semaforo" element={<SemaforoMantenimiento />} />
                <Route path="flota" element={<GestionFlota />} />
                <Route path="contratos" element={<GestionContratos />} />
                <Route path="bitacora" element={<Bitacora />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/b2b" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </FleetProvider>
  </AuthProvider>
</PWAProvider>
);
}
