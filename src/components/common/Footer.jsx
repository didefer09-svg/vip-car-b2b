import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CreditCard,
  Lock,
  Headphones,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] text-[#949aa6] text-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#ff6363]/5 to-transparent blur-3xl pointer-events-none" />
      {/* Contenedor Principal con Padding Generoso */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* ========================================================= */}
          {/* COLUMNA 1: Datos de Contacto                              */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <Link to="/b2b" className="inline-block group">
              <img
                src="/logo-vipcar.png"
                alt="VIP CAR"
                className="h-8 w-auto object-contain filter drop-shadow-md"
              />
            </Link>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              Contacto Operativo
            </h4>

            <div className="space-y-3 text-[11px]">
              {/* Teléfonos */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#ff6363] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#6a6b6c] text-[10px] uppercase font-mono">Central Telefónica:</div>
                  <div className="font-mono text-[#ffffff] font-semibold space-x-2">
                    <a href="tel:999461414" className="hover:text-white transition-colors">
                      999 461 414
                    </a>
                    <span className="text-[#6a6b6c]">/</span>
                    <a href="tel:982083835" className="hover:text-white transition-colors">
                      982 083 835
                    </a>
                  </div>
                </div>
              </div>

              {/* Correo */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#ff6363] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#6a6b6c] text-[10px] uppercase font-mono">Correo Corporativo:</div>
                  <a
                    href="mailto:reservas@vipcarhuancayo.com"
                    className="font-mono text-[#ffffff] hover:underline hover:text-white transition-colors block truncate"
                  >
                    reservas@vipcarhuancayo.com
                  </a>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff6363] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#6a6b6c] text-[10px] uppercase font-mono">Base Central:</div>
                  <div className="text-[#ffffff] leading-relaxed">
                    Av. Manuel Traverso 597 Urb. La Merced - Huancayo
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 2: Garantía y Homologación                       */}
          {/* ========================================================= */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              Garantía & Homologación
            </h4>

            {/* Badge Destacado EMPRESA HOMOLOGADA */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071f16] text-[#59d499] border border-[#59d499]/40 font-mono font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#59d499]" />
              <span>EMPRESA HOMOLOGADA</span>
            </div>

            <p className="text-[11px] text-[#9c9c9d] leading-relaxed">
              Certificación de homologación <strong className="text-[#ffffff]">SGS del Perú</strong> para trabajo en mina y construcción de alta exigencia operativa en socavón y superficie.
            </p>

            <div className="space-y-1.5 text-[10px] font-mono text-[#9c9c9d] pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#59d499] shrink-0" />
                <span>Normativa Minera DS 024-2016-EM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#59d499] shrink-0" />
                <span>Equipamiento: Pértiga 3m, Jaula y Circulina</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#59d499] shrink-0" />
                <span>Pólizas Todo Riesgo Minero Rimac</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 3: Pasarelas y Facturación B2B                   */}
          {/* ========================================================= */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              Facturación B2B & Pagos
            </h4>

            <p className="text-[11px] text-[#9c9c9d] leading-relaxed">
              Aceptación de <strong className="text-[#ffffff]">órdenes de compra corporativas</strong>, transferencias interbancarias directas y pago con tarjetas comerciales.
            </p>

            <div className="p-4 rounded-2xl bg-[#111214] border border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#ffffff] font-semibold text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-[#ff6363]" />
                <span>Medios de Pago Autorizados</span>
              </div>

              {/* Badges de Tarjetas */}
              <div className="grid grid-cols-2 gap-1.5 text-center font-mono font-bold text-[10px]">
                <span className="py-1 px-2.5 rounded-full bg-[#1b1c1e] text-[#ffffff] border border-white/[0.08]">
                  Visa
                </span>
                <span className="py-1 px-2.5 rounded-full bg-[#1b1c1e] text-[#ffffff] border border-white/[0.08]">
                  Mastercard
                </span>
                <span className="py-1 px-2.5 rounded-full bg-[#1b1c1e] text-[#ffffff] border border-white/[0.08]">
                  Amex
                </span>
                <span className="py-1 px-2.5 rounded-full bg-[#1b1c1e] text-[#ffffff] border border-white/[0.08]">
                  Diners Club
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#6a6b6c] font-mono">
              Facturación electrónica con RUC 20601289411
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA 4: Acceso Seguro & Soporte 24/7                  */}
          {/* ========================================================= */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              Acceso Seguro & Soporte
            </h4>

            {/* Enlace Rápido Discreto a Acceso Gerencial */}
            <Link
              to="/dashboard"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111214] hover:bg-[#1b1c1e] border border-white/[0.08] hover:border-white/[0.2] transition-all text-xs group"
              title="Panel de control para supervisión y telemetría"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ff6363] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-[#ffffff] group-hover:text-white">
                    Acceso Gerencial
                  </div>
                  <div className="text-[10px] text-[#6a6b6c] font-mono">
                    Cockpit de Mantenimiento
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6a6b6c] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Soporte Operativo 24/7 */}
            <div className="p-3.5 rounded-2xl bg-[#111214] border border-white/[0.08] space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59d499] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59d499]" />
                </span>
                <span className="font-bold text-[#ffffff]">Soporte Operativo 24/7</span>
              </div>
              <p className="text-[#9c9c9d] text-[10px] leading-relaxed">
                Asistencia de rescate mecánico y reemplazo de unidad en corredor minero Junín - Yauli - Pasco.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BARRA FINAL DE COPYRIGHT                                  */}
      {/* ========================================================= */}
      <div className="border-t border-[#363739] bg-[#040506] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] font-mono">
          <p className="text-[#9c9c9d]">
            &copy; 2026 VIP CAR RENTING. Todos los derechos reservados. Operaciones Mineras &amp; Construcci&oacute;n.
          </p>

          <div className="flex items-center gap-3 text-[#6a6b6c] text-[10px]">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59d499]" />
              Sistemas Activos
            </span>
            <span>•</span>
            <span>TLS 1.3 Cifrado</span>
            <span>•</span>
            <span>Junín, Perú</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
