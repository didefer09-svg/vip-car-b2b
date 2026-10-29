import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import { OFICIAL_SERVICIOS } from '../../data/mockData';
import {
  FileSpreadsheet,
  Building2,
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Send
} from 'lucide-react';

export default function SolicitudCotizacion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { agregarCotizacion } = useFleet();

  const modeloParam = searchParams.get('modelo') || 'Toyota Hilux 4x4 SRV Minera';

  const [formData, setFormData] = useState({
    empresa: 'Minera Chinalco Perú S.A.',
    ruc: '20519842101',
    contacto: 'Ing. Carlos Mendoza (Superintendente de Logística)',
    email: 'cmendoza@chinalco.com.pe',
    telefono: '964 892 100',
    minaDestino: 'OCP - COBRIZA (TP-01)',
    tipoAmbiente: 'Socavón & Superficie',
    cantidadVehiculos: 4,
    modeloPreferido: modeloParam,
    fechaInicio: '2026-11-01',
    fechaFin: '2027-04-30',
    incluyeConductor: false,
    equipamiento: {
      pertiga: true,
      circulina: true,
      jaulaAntivuelco: true,
      botiquin: true,
      tacosSeguridad: true,
      gpsSatelital: true,
      cinturones4Puntos: true,
    },
    comentarios: 'Se requiere entrega con homologación técnica minera vigente para ingreso a garita de control.',
  });

  const [enviado, setEnviado] = useState(false);

  const toggleEquip = (key) => {
    setFormData((prev) => ({
      ...prev,
      equipamiento: { ...prev.equipamiento, [key]: !prev.equipamiento[key] },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarCotizacion(formData);
    setEnviado(true);
    setTimeout(() => {
      navigate('/b2b/contratos');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#9c9c9d]">
      <div>
        <h1 className="text-2xl font-black text-[#ffffff] flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-[#ff6363]" />
          Solicitud de Cotización por Lote
        </h1>
        <p className="text-xs text-[#6a6b6c] mt-1">
          Formulario técnico oficial para arriendo de pickups 4x4 mineras en Junín y operaciones de altura.
        </p>
      </div>

      {enviado && (
        <div className="p-4 rounded-[8px] bg-[#07080a] border border-[#59d499]/40 text-[#59d499] flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#59d499] shrink-0" />
          <div>
            <div className="text-sm font-bold">¡Requerimiento recibido con éxito!</div>
            <div className="text-xs text-[#59d499]/80">
              El departamento comercial emitirá la propuesta con tarifas preferenciales por lote en menos de 2 horas.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Datos Empresa */}
        <div className="cockpit-panel p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.08]">
            <Building2 className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              1. Datos de la Empresa Minera / Constructora
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                Razón Social *
              </label>
              <input
                type="text"
                required
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                RUC (11 dígitos) *
              </label>
              <input
                type="text"
                required
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                Contacto Responsable / Cargo *
              </label>
              <input
                type="text"
                required
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                Email Corporativo *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>
          </div>
        </div>

        {/* 2. Requerimiento Técnico */}
        <div className="cockpit-panel p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.08]">
            <Truck className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              2. Requerimiento de Flota
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1 font-mono uppercase">
                Cantidad de Pickups *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={formData.cantidadVehiculos}
                onChange={(e) => setFormData({ ...formData, cantidadVehiculos: Number(e.target.value) })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs font-bold text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1 font-mono uppercase">
                Gama / Tipo de Unidad *
              </label>
              <select
                value={formData.modeloPreferido}
                onChange={(e) => setFormData({ ...formData, modeloPreferido: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
              >
                <option value="Camioneta 4x4 Doble Cabina Minera (Toyota Hilux)" className="bg-[#0c0e12]">Camioneta 4x4 Doble Cabina (Toyota Hilux)</option>
                <option value="Camioneta Cerrada 4x4 (Toyota Fortuner D-4D)" className="bg-[#0c0e12]">Camioneta Cerrada 4x4 (Toyota Fortuner)</option>
                <option value="Sprinter Pasajeros (Mercedes-Benz 516 CDI)" className="bg-[#0c0e12]">Sprinter Pasajeros (Mercedes-Benz 516 CDI)</option>
                <option value="Minivan Corporativa (Toyota HiAce / Hyundai H1)" className="bg-[#0c0e12]">Minivan Corporativa (HiAce / H1 / Staria)</option>
                <option value="Minibus 28 Pax (Toyota Coaster / Hyundai County)" className="bg-[#0c0e12]">Minibus 28 Pax (Coaster / County)</option>
                <option value="Bus Interurbano 45-50 Pax (Scania / Mercedes-Benz)" className="bg-[#0c0e12]">Bus Interurbano 45-50 Pax (Scania / Mercedes)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1 font-mono uppercase">
                Certificación *
              </label>
              <select
                value={formData.tipoAmbiente}
                onChange={(e) => setFormData({ ...formData, tipoAmbiente: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
              >
                <option value="Socavón & Superficie" className="bg-[#0c0e12]">Socavón & Superficie (Pértiga LED, Tacos, Jaula)</option>
                <option value="Solo Superficie / Obras" className="bg-[#0c0e12]">Solo Superficie / Obras Civiles</option>
                <option value="Transporte de Personal" className="bg-[#0c0e12]">Transporte de Personal Interurbano</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1 font-mono uppercase">
                Servicio / Cliente Oficial (16 Servicios) *
              </label>
              <select
                value={formData.minaDestino}
                onChange={(e) => setFormData({ ...formData, minaDestino: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
              >
                {(OFICIAL_SERVICIOS || []).map((s) => (
                  <option key={s.id} value={`${s.cliente} | ${s.sede} (${s.centroCosto})`} className="bg-[#0c0e12]">
                    {s.cliente} - {s.sede} [{s.centroCosto}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                Fecha Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
                Fecha Fin *
              </label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363]"
              />
            </div>
          </div>
        </div>

        {/* 3. Equipamiento Minero */}
        <div className="cockpit-panel p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.08]">
            <ShieldCheck className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff] font-mono">
              3. Equipamiento de Seguridad Requerido para el Proyecto / Obra
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { key: 'pertiga', label: 'Pértiga LED luminosa (3.6m)' },
              { key: 'circulina', label: 'Circulina estroboscópica ámbar' },
              { key: 'jaulaAntivuelco', label: 'Jaula antivuelco certificada' },
              { key: 'botiquin', label: 'Botiquín para altura y trauma' },
              { key: 'tacosSeguridad', label: '2 Tacos de seguridad y cuñas' },
              { key: 'gpsSatelital', label: 'Monitoreo GPS Satelital 24/7' },
              { key: 'cinturones4Puntos', label: 'Cinturones de 4 puntos' },
            ].map((item) => (
              <label
                key={item.key}
                onClick={() => toggleEquip(item.key)}
                className={`flex items-center gap-2 p-3 rounded-full border cursor-pointer text-xs font-mono transition-colors ${
                  formData.equipamiento[item.key]
                    ? 'bg-[#ff6363]/15 border-[#ff6363]/60 text-[#ffffff] font-bold shadow-sm'
                    : 'telemetry-well border-white/[0.08] text-[#949aa6] hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.equipamiento[item.key]}
                  onChange={() => {}}
                  className="rounded-full border-white/20 text-[#ff6363] focus:ring-0 ml-1"
                />
                <span className="text-[11px]">{item.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#626773] mb-1 font-mono uppercase">
              Notas Técnicas Adicionales
            </label>
            <textarea
              rows={2}
              value={formData.comentarios}
              onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
              className="w-full telemetry-well border border-white/[0.08] rounded-2xl p-3 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono"
            />
          </div>
        </div>

        {/* Botón Submit Cockpit Action en Cápsula */}
        <button
          type="submit"
          className="btn-cockpit-action w-full py-4 px-6 flex items-center justify-center gap-2 text-sm uppercase font-bold tracking-wider rounded-full active:scale-98 cursor-pointer shadow-xl font-mono"
        >
          <Send className="w-4 h-4 text-black stroke-[2.5]" />
          <span>ENVIAR REQUERIMIENTO CORPORATIVO</span>
        </button>
      </form>
    </div>
  );
}
