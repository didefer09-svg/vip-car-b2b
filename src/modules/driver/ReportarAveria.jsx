import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  AlertOctagon,
  Camera,
  MapPin,
  ArrowLeft,
  Truck,
  Phone,
  CheckCircle2,
  Upload
} from 'lucide-react';

export default function ReportarAveria() {
  const navigate = useNavigate();
  const { vehicles, reportarAveriaEmergencia } = useFleet();

  const assignedVehicle = vehicles.find((v) => v.placa === 'W4E-892') || vehicles[0];

  const [tipoFalla, setTipoFalla] = useState('Falla mecánica');
  const [severidad, setSeveridad] = useState('Grave');
  const [descripcion, setDescripcion] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    reportarAveriaEmergencia({
      placa: assignedVehicle.placa,
      tipoFalla,
      severidad,
      descripcion,
      conductor: 'Carlos Huamán',
      foto: fotoPreview,
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/conductor');
    }, 2000);
  };

  return (
    <div className="space-y-4 text-[#9c9c9d]">
      {/* Header SOS */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/conductor')}
          className="p-1.5 rounded-[8px] bg-[#07080a] border border-[#363739] text-[#9c9c9d] hover:text-[#ffffff]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#ff6363] flex items-center gap-1.5">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            Reporte de Avería SOS
          </h1>
          <p className="text-xs text-[#6a6b6c]">Notificación prioritaria de averías en operación</p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-[8px] bg-[#ff6363] text-white flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-bold">
            ¡ALERTA TRANSMITIDA! Supervisión de flota y auxilio mecánico han sido notificados.
          </div>
        </div>
      )}

      {/* Unidad Afectada */}
      <div className="bg-[#1b1c1e] border border-[#ff6363]/40 p-3.5 rounded-[12px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ff6363]" />
          <div>
            <div className="text-[10px] text-[#ff6363] uppercase font-bold">Unidad Afectada</div>
            <div className="text-xs font-bold text-[#ffffff]">{assignedVehicle.marca} {assignedVehicle.modelo}</div>
          </div>
        </div>
        <span className="font-mono font-bold text-xs text-[#ff6363] px-2 py-0.5 rounded-[6px] bg-[#07080a] border border-[#ff6363]/40">
          {assignedVehicle.placa}
        </span>
      </div>

      {/* Teléfono de Asistencia */}
      <div className="p-3 bg-[#07080a] border border-[#363739] rounded-[8px] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#6a6b6c]">
          <Phone className="w-3.5 h-3.5 text-[#ff6363]" />
          <span className="text-[11px]">Auxilio Mecánico Junín 24/7:</span>
        </div>
        <a
          href="tel:954123456"
          className="text-xs font-bold text-[#ff6363] hover:underline"
        >
          954 123 456
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de falla */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c]">
            1. Tipo de Falla o Incidente *
          </label>
          <select
            value={tipoFalla}
            onChange={(e) => setTipoFalla(e.target.value)}
            className="w-full bg-[#111214] border border-[#363739] rounded-[8px] p-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-semibold"
          >
            <option value="Falla mecánica (Motor / Caja / Tracción)">Falla mecánica (Motor / Caja / Tracción)</option>
            <option value="Falla en sistema de frenos">Falla en sistema de frenos</option>
            <option value="Neumático reventado / pinchado">Neumático reventado / pinchado</option>
            <option value="Accidente / Choque en operación o ruta">Accidente / Choque en operación o ruta</option>
            <option value="Falla eléctrica / Pértiga / Circulina">Falla eléctrica / Pértiga / Circulina</option>
            <option value="Fuga de refrigerante o aceite">Fuga de refrigerante o aceite</option>
            <option value="Otro incidente">Otro incidente</option>
          </select>
        </div>

        {/* Severidad */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c]">
            2. Nivel de Severidad *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Leve', desc: 'Continúa operativo' },
              { id: 'Moderada', desc: 'Requiere taller' },
              { id: 'Grave', desc: 'Inhabilitada' },
            ].map((sev) => (
              <button
                type="button"
                key={sev.id}
                onClick={() => setSeveridad(sev.id)}
                className={`p-2.5 rounded-[8px] border text-center transition-all ${
                  severidad === sev.id
                    ? 'bg-[#ff6363] text-white font-bold border-[#ff6363] shadow-xs'
                    : 'bg-[#111214] text-[#9c9c9d] border-[#363739] hover:bg-[#1b1c1e]'
                }`}
              >
                <div className="text-xs font-bold">{sev.id}</div>
                <div className="text-[10px] opacity-80">{sev.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c]">
            3. Detalle de la Avería *
          </label>
          <textarea
            required
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa el ruido, rotura, impacto o motivo del paro..."
            className="w-full bg-[#111214] border border-[#363739] rounded-[8px] p-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
          />
        </div>

        {/* Foto de Evidencia */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#ff6363]" />
            4. Foto de Evidencia
          </label>

          <label className="cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed border-[#363739] hover:border-[#6a6b6c] rounded-[8px] bg-[#111214] transition-colors">
            {fotoPreview ? (
              <div className="space-y-1.5 text-center">
                <img
                  src={fotoPreview}
                  alt="Evidencia"
                  className="max-h-36 rounded-[8px] mx-auto object-cover border border-[#363739]"
                />
                <span className="text-[10px] text-[#ff6363] font-bold">Cambiar foto</span>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-[8px] bg-[#1b1c1e] border border-[#363739] text-[#9c9c9d] flex items-center justify-center mx-auto">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#ffffff]">Tomar foto o subir archivo</div>
                <div className="text-[10px] text-[#6a6b6c]">JPG, PNG directa de cámara</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFotoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Coordenadas GPS */}
        <div className="p-3 bg-[#07080a] border border-[#363739] rounded-[8px] flex items-center gap-2.5 text-xs">
          <MapPin className="w-4 h-4 text-[#ff6363] shrink-0" />
          <div>
            <div className="font-bold text-[#ffffff] text-[11px]">Ubicación GPS Satelital</div>
            <div className="text-[10px] text-[#6a6b6c] font-mono">
              -11.6167, -76.1333 • Toromocho (4,500 msnm)
            </div>
          </div>
        </div>

        {/* Botón de Emergencia Rojo Racing */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-[8px] bg-[#ff6363] hover:bg-[#e11d48] text-white font-black text-sm shadow-xs transition-colors flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>ENVIAR REPORTE DE EMERGENCIA</span>
        </button>
      </form>
    </div>
  );
}
