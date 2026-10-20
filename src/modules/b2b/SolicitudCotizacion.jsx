import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
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
    minaDestino: 'Mina Toromocho - Morococha, Junín',
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
    comentarios: 'Se requiere entrega con homologación vigente para ingreso a garita de control.',
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
        <div className="bg-[#07080a] border border-[#363739] p-6 rounded-[16px] space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#363739]">
            <Building2 className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff]">
              1. Datos de la Empresa Minera / Constructora
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Razón Social *
              </label>
              <input
                type="text"
                required
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                RUC (11 dígitos) *
              </label>
              <input
                type="text"
                required
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] font-mono focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Contacto Responsable / Cargo *
              </label>
              <input
                type="text"
                required
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Email Corporativo *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>
          </div>
        </div>

        {/* 2. Requerimiento Técnico */}
        <div className="bg-[#07080a] border border-[#363739] p-6 rounded-[16px] space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#363739]">
            <Truck className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff]">
              2. Requerimiento de Flota
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Cantidad de Pickups *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={formData.cantidadVehiculos}
                onChange={(e) => setFormData({ ...formData, cantidadVehiculos: Number(e.target.value) })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs font-bold text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Gama / Modelo *
              </label>
              <select
                value={formData.modeloPreferido}
                onChange={(e) => setFormData({ ...formData, modeloPreferido: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              >
                <option value="Toyota Hilux 4x4 SRV Minera">Toyota Hilux 4x4 SRV Minera</option>
                <option value="Ford Ranger 4x4 XLT Biturbo">Ford Ranger 4x4 XLT Biturbo</option>
                <option value="Mitsubishi L200 4x4 High Power">Mitsubishi L200 4x4 High Power</option>
                <option value="Nissan Frontier PRO-4X">Nissan Frontier PRO-4X</option>
                <option value="Isuzu D-Max 4x4 Crew Cab">Isuzu D-Max 4x4 Crew Cab</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Certificación *
              </label>
              <select
                value={formData.tipoAmbiente}
                onChange={(e) => setFormData({ ...formData, tipoAmbiente: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              >
                <option value="Socavón & Superficie">Socavón & Superficie</option>
                <option value="Solo Superficie / Obras">Solo Superficie / Obras Civiles</option>
                <option value="Transporte de Personal">Transporte de Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Ubicación del Servicio / Proyecto *
              </label>
              <input
                type="text"
                required
                value={formData.minaDestino}
                onChange={(e) => setFormData({ ...formData, minaDestino: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Fecha Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
                Fecha Fin *
              </label>
              <input
                type="date"
                required
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-3 py-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
              />
            </div>
          </div>
        </div>

        {/* 3. Equipamiento Minero */}
        <div className="bg-[#07080a] border border-[#363739] p-6 rounded-[16px] space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#363739]">
            <ShieldCheck className="w-4 h-4 text-[#ff6363]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffffff]">
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
                className={`flex items-center gap-2 p-2.5 rounded-[8px] border cursor-pointer text-xs transition-colors ${
                  formData.equipamiento[item.key]
                    ? 'bg-[#1b1c1e] border-[#ff6363]/50 text-[#ffffff] font-semibold'
                    : 'bg-[#111214] border-[#363739] text-[#9c9c9d] hover:border-[#6a6b6c]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.equipamiento[item.key]}
                  onChange={() => {}}
                  className="rounded-[4px] border-[#363739] text-[#ff6363] focus:ring-0"
                />
                <span className="text-[11px]">{item.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6a6b6c] mb-1">
              Notas Técnicas Adicionales
            </label>
            <textarea
              rows={2}
              value={formData.comentarios}
              onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
              className="w-full bg-[#111214] border border-[#363739] rounded-[8px] p-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
            />
          </div>
        </div>

        {/* Botón Submit Raycast Mist */}
        <button
          type="submit"
          className="btn-raycast-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wide key-shadow rounded-[8px] active:scale-98"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
          <span>ENVIAR REQUERIMIENTO CORPORATIVO</span>
        </button>
      </form>
    </div>
  );
}
