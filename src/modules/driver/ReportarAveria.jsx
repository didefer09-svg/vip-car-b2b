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
          className="p-2 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ffffff] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#ff6363] flex items-center gap-1.5 font-sans">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            Reporte de Avería SOS
          </h1>
          <p className="text-xs text-[#6a6b6c] font-mono">Notificación prioritaria de averías en operación</p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-full bg-[#ff6363] text-white flex items-center gap-3 shadow-lg font-mono">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-bold">
            ¡ALERTA TRANSMITIDA! Supervisión de flota y auxilio mecánico han sido notificados.
          </div>
        </div>
      )}

      {/* Unidad Afectada */}
      <div className="cockpit-panel border border-[#ff6363]/40 p-3.5 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ff6363]" />
          <div>
            <div className="text-[10px] text-[#ff6363] uppercase font-mono font-bold">Unidad Afectada</div>
            <div className="text-xs font-bold text-[#ffffff]">{assignedVehicle.marca} {assignedVehicle.modelo}</div>
          </div>
        </div>
        <span className="font-mono font-bold text-xs text-[#ff6363] px-2.5 py-0.5 rounded-full telemetry-well border border-[#ff6363]/40">
          {assignedVehicle.placa}
        </span>
      </div>

      {/* Teléfono de Asistencia */}
      <div className="p-3 telemetry-well border border-white/[0.08] rounded-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#6a6b6c]">
          <Phone className="w-3.5 h-3.5 text-[#ff6363]" />
          <span className="text-[11px] font-mono">Auxilio Mecánico Junín 24/7:</span>
        </div>
        <a
          href="tel:954123456"
          className="text-xs font-bold text-[#ff6363] hover:underline font-mono"
        >
          954 123 456
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de falla */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c]">
            01 // Tipo de Falla o Incidente *
          </label>
          <select
            value={tipoFalla}
            onChange={(e) => setTipoFalla(e.target.value)}
            className="w-full telemetry-well border border-white/[0.08] rounded-full p-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono cursor-pointer"
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
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c]">
            02 // Nivel de Severidad *
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
                className={`p-2.5 rounded-full border text-center transition-all cursor-pointer ${
                  severidad === sev.id
                    ? 'bg-[#ff6363] text-white font-bold border-[#ff6363] shadow-xs'
                    : 'telemetry-well text-[#9c9c9d] border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <div className="text-xs font-mono font-bold">{sev.id}</div>
                <div className="text-[10px] opacity-80 font-mono">{sev.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c]">
            03 // Detalle de la Avería *
          </label>
          <textarea
            required
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa el ruido, rotura, impacto o motivo del paro..."
            className="w-full telemetry-well border border-white/[0.08] rounded-2xl p-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono"
          />
        </div>

        {/* Foto de Evidencia */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#ff6363]" />
            04 // Foto de Evidencia
          </label>

          <label className="cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed border-white/[0.15] hover:border-white/[0.3] rounded-3xl telemetry-well transition-colors">
            {fotoPreview ? (
              <div className="space-y-1.5 text-center">
                <img
                  src={fotoPreview}
                  alt="Evidencia"
                  className="max-h-36 rounded-2xl mx-auto object-cover border border-white/[0.1]"
                />
                <span className="text-[10px] text-[#ff6363] font-mono font-bold">Cambiar foto</span>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full telemetry-well border border-white/[0.1] text-[#9c9c9d] flex items-center justify-center mx-auto">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#ffffff]">Tomar foto o subir archivo</div>
                <div className="text-[10px] text-[#6a6b6c] font-mono">JPG, PNG directa de cámara</div>
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
        <div className="p-3 telemetry-well border border-white/[0.08] rounded-3xl flex items-center gap-2.5 text-xs font-mono">
          <MapPin className="w-4 h-4 text-[#ff6363] shrink-0" />
          <div>
            <div className="font-bold text-[#ffffff] text-[11px]">Ubicación GPS Satelital</div>
            <div className="text-[10px] text-[#6a6b6c]">
              -11.6167, -76.1333 • Toromocho (4,500 msnm)
            </div>
          </div>
        </div>

        {/* Botón de Emergencia Rojo Racing */}
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-[#ff6363] hover:bg-[#e11d48] text-white font-black text-sm shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-98 cursor-pointer font-mono"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>ENVIAR REPORTE DE EMERGENCIA</span>
        </button>
      </form>
    </div>
  );
}
