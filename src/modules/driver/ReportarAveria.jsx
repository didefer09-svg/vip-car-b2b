import React, { useState, useEffect } from 'react';
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
  Upload,
  Radio,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function ReportarAveria() {
  const navigate = useNavigate();
  const { vehicles, reportarAveriaEmergencia } = useFleet();

  const assignedVehicle = vehicles.find((v) => v.placa === 'W4E-892') || vehicles[0];

  const [tipoEvento, setTipoEvento] = useState('Avería'); // 'Avería' o 'SOS'
  const [tipoFalla, setTipoFalla] = useState('Falla mecánica');
  const [severidad, setSeveridad] = useState('Grave');
  const [descripcion, setDescripcion] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [coords, setCoords] = useState({ lat: -11.6083, lng: -76.1294, precision: 8 });
  const [obteniendoGPS, setObteniendoGPS] = useState(false);

  const capturarGPS = () => {
    if ('geolocation' in navigator) {
      setObteniendoGPS(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            precision: Math.round(pos.coords.accuracy) || 5,
          });
          setObteniendoGPS(false);
        },
        (err) => {
          console.warn('GPS no disponible:', err);
          setObteniendoGPS(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  useEffect(() => {
    capturarGPS();
  }, []);

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
      severidad: tipoEvento === 'SOS' ? 'Crítica' : severidad,
      descripcion: descripcion.trim() || (tipoEvento === 'SOS' ? 'SEÑAL DE AUXILIO SOS INMEDIATO EN OPERACIÓN' : 'Reporte de avería'),
      conductor: 'Carlos Huamán',
      operador: 'Carlos Huamán',
      foto: fotoPreview,
      latitud: coords.lat,
      longitud: coords.lng,
      tipoEvento,
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
            Reporte de Avería & Alerta SOS
          </h1>
          <p className="text-xs text-[#6a6b6c] font-mono">Notificación prioritaria de incidencias en campo hacia Cockpit</p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-full bg-[#ff6363] text-white flex items-center gap-3 shadow-lg font-mono">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-bold">
            ¡ALERTA TRANSMITIDA EN TIEMPO REAL! Cockpit y auxilio mecánico han sido notificados con su ubicación GPS.
          </div>
        </div>
      )}

      {/* Selector de Modo: Avería vs SOS */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setTipoEvento('Avería')}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-mono ${
            tipoEvento === 'Avería'
              ? 'bg-[#231908] border-[#f59e0b] text-[#f59e0b] font-bold shadow-lg'
              : 'telemetry-well border-white/[0.08] text-[#6a6b6c] hover:text-white'
          }`}
        >
          <div className="text-xs font-bold flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
            <span>Reporte de Avería</span>
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">Falla mecánica o técnica</div>
        </button>

        <button
          type="button"
          onClick={() => {
            setTipoEvento('SOS');
            setSeveridad('Grave');
          }}
          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-mono ${
            tipoEvento === 'SOS'
              ? 'bg-[#2d0e14] border-[#ff6363] text-[#ff6363] font-black shadow-lg animate-pulse ring-1 ring-[#ff6363]'
              : 'telemetry-well border-white/[0.08] text-[#6a6b6c] hover:text-[#ff6363]'
          }`}
        >
          <div className="text-xs font-bold flex items-center justify-center gap-1.5">
            <Radio className="w-4 h-4 text-[#ff6363] animate-ping" />
            <span>Señal SOS Emergencia</span>
          </div>
          <div className="text-[10px] opacity-75 mt-0.5">Auxilio inmediato en ruta</div>
        </button>
      </div>

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
          href="tel:983592452"
          className="text-xs font-bold text-[#ff6363] hover:underline font-mono"
        >
          983592452
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
            <option value="Derrumbe o bloqueo de vía en socavón/ruta">Derrumbe o bloqueo de vía en socavón/ruta</option>
            <option value="Otro incidente">Otro incidente</option>
          </select>
        </div>

        {/* Severidad */}
        {tipoEvento === 'Avería' && (
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
        )}

        {/* Detalle */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c]">
            {tipoEvento === 'SOS' ? '02 // Descripción de la Novedad / Emergencia *' : '03 // Detalle de la Avería *'}
          </label>
          <textarea
            required
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder={
              tipoEvento === 'SOS'
                ? 'Indique motivo de la emergencia SOS, puntos de referencia y si requiere rescate...'
                : 'Describa el ruido, rotura, impacto, fuga o motivo del paro...'
            }
            className="w-full telemetry-well border border-white/[0.08] rounded-2xl p-2.5 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono"
          />
        </div>

        {/* Foto de Evidencia */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#ff6363]" />
            {tipoEvento === 'SOS' ? '03 // Foto o Evidencia (Opcional)' : '04 // Foto de Evidencia'}
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

        {/* Coordenadas GPS en Vivo */}
        <div className="p-3.5 telemetry-well border border-[#ff6363]/40 rounded-3xl flex items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#ff6363] shrink-0" />
            <div>
              <div className="font-bold text-[#ffffff] text-[11px] flex items-center gap-2">
                <span>Coordenadas GPS Satelital</span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  ±{coords.precision}m
                </span>
              </div>
              <div className="text-[10px] text-cyan-300">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={capturarGPS}
            disabled={obteniendoGPS}
            className="px-2.5 py-1 rounded-xl telemetry-well border border-white/10 hover:border-white/30 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Refrescar coordenadas satelitales"
          >
            <RefreshCw className={`w-3 h-3 ${obteniendoGPS ? 'animate-spin' : ''}`} />
            <span>{obteniendoGPS ? 'Fijando...' : 'Fijar GPS'}</span>
          </button>
        </div>

        {/* Botón de Emergencia Rojo Racing */}
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-[#ff6363] hover:bg-[#e11d48] text-white font-black text-sm shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-98 cursor-pointer font-mono"
        >
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span>
            {tipoEvento === 'SOS' ? 'TRANSMITIR SEÑAL SOS EN VIVO' : 'ENVIAR REPORTE DE AVERÍA'}
          </span>
        </button>
      </form>
    </div>
  );
}
