import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  ClipboardCheck,
  Gauge,
  Fuel,
  Check,
  AlertTriangle,
  ArrowLeft,
  Truck,
  WifiOff,
  CloudUpload
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

const PREOPERATIONAL_ITEMS = [
  { id: 'luces', label: 'Luces frontales, posteriores y direccionales', obligatorio: true },
  { id: 'circulina', label: 'Circulina ámbar y pértiga LED operativa', obligatorio: true },
  { id: 'frenos', label: 'Frenos de servicio y freno de mano', obligatorio: true },
  { id: 'neumaticos', label: 'Neumáticos (presión y cocada adecuada)', obligatorio: true },
  { id: 'aceite', label: 'Nivel de aceite de motor y refrigerante', obligatorio: true },
  { id: 'seguridad', label: 'Extintor vigente (PQS 6kg) y botiquín minero', obligatorio: true },
  { id: 'tacos', label: '2 Tacos de seguridad y llanta de repuesto', obligatorio: true },
  { id: 'jaula', label: 'Jaula antivuelco interna/externa sin fisuras', obligatorio: true },
];

export default function CheckIn() {
  const navigate = useNavigate();
  const { vehicles, registrarCheckIn } = useFleet();

  const assignedVehicle = vehicles.find((v) => v.placa === 'W4E-892') || vehicles[0];

  const [odometro, setOdometro] = useState(assignedVehicle?.odometroActual || 14750);
  const [combustible, setCombustible] = useState(assignedVehicle?.nivelCombustible || 75);
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    luces: true,
    circulina: true,
    frenos: true,
    neumaticos: true,
    aceite: true,
    seguridad: true,
    tacos: true,
    jaula: true,
  });
  const [success, setSuccess] = useState(false);

  // Sincronizar si el vehículo se actualiza desde Firestore
  React.useEffect(() => {
    if (assignedVehicle?.odometroActual && !loading) {
      setOdometro(assignedVehicle.odometroActual);
    }
  }, [assignedVehicle?.odometroActual]);

  const toggleCheck = (id) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const [isOfflineRecord, setIsOfflineRecord] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registrarCheckIn({
        placa: assignedVehicle.placa,
        vehiculoId: assignedVehicle.id,
        odometro: Number(odometro),
        combustible: Number(combustible),
        checklist: allChecked,
        conductor: 'Carlos Huamán',
        observaciones: observaciones.trim(),
        operacion: assignedVehicle.empresaAsignada || 'Toromocho - Junín',
      });

      setIsOfflineRecord(Boolean(!navigator.onLine || res?.guardadoEnSocavon));
      setSuccess(true);
      setTimeout(() => {
        navigate('/conductor');
      }, 1600);
    } catch (err) {
      console.error('Error al guardar Check-in:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/conductor')}
          className="p-2 rounded-[10px] telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ffffff] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#ffffff] font-sans">Check-in de Turno</h1>
          <p className="text-xs text-[#6a6b6c] font-mono">Inspección preoperacional obligatoria</p>
        </div>
      </div>

      {/* Alerta de Operación en Socavón (Offline) */}
      {!navigator.onLine && (
        <div className="p-3 rounded-[10px] bg-[#231908] border border-[#f59e0b]/40 text-[#f59e0b] flex items-center gap-2 text-xs font-mono">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>Modo Socavón (Sin Señal 4G):</strong> Tu registro se guardará localmente en el dispositivo y se sincronizará con Firestore automáticamente al salir a superficie.
          </span>
        </div>
      )}

      {success && (
        <div className={`p-3.5 rounded-[10px] border flex items-center gap-2.5 ${
          isOfflineRecord
            ? 'bg-[#231908] border-[#f59e0b]/50 text-[#f59e0b]'
            : 'bg-[#071f16] border-[#59d499]/40 text-[#59d499]'
        }`}>
          {isOfflineRecord ? (
            <CloudUpload className="w-5 h-5 text-[#f59e0b] shrink-0 animate-bounce" />
          ) : (
            <ClipboardCheck className="w-5 h-5 text-[#59d499] shrink-0" />
          )}
          <div className="text-xs font-bold font-mono">
            {isOfflineRecord
              ? `¡Check-in guardado en Socavón! Odómetro de la unidad [${assignedVehicle.placa}] registrado localmente. Se subirá a Firestore automáticamente al detectar señal.`
              : `¡Check-in registrado! Odómetro guardado en la colección 'registros_odometro' y unidad [${assignedVehicle.placa}] sincronizada en Firestore.`}
          </div>
        </div>
      )}

      {/* Info Unidad */}
      <div className="cockpit-panel border border-white/[0.08] p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ff6363]" />
          <div>
            <div className="text-[10px] text-[#6a6b6c] uppercase font-mono font-bold">Unidad Asignada</div>
            <div className="text-xs font-bold text-[#ffffff] font-sans">{assignedVehicle.marca} {assignedVehicle.modelo}</div>
          </div>
        </div>
        <span className="font-mono font-bold text-xs text-[#ff6363] px-3 py-1 rounded-full telemetry-well border border-[#ff6363]/30">
          {assignedVehicle.placa}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Odómetro Sunken con Monospace Blanco */}
        <div className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#ff6363]" />
              01 // Registro de Odómetro (km) *
            </label>
            <span className="text-[10px] text-[#6a6b6c] font-mono">Último: {assignedVehicle.odometroActual} km</span>
          </div>

          <div className="relative">
            <input
              type="number"
              required
              min={assignedVehicle.odometroActual}
              value={odometro}
              onChange={(e) => setOdometro(e.target.value)}
              className="w-full telemetry-well border border-white/[0.1] rounded-full px-4 py-3 text-2xl font-mono font-black text-[#ffffff] text-center tracking-widest focus:outline-none focus:border-[#ff6363]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6a6b6c] font-bold font-mono">
              KM
            </span>
          </div>

          {/* Semáforo en vivo */}
          <div className="mt-1">
            <SemaforoBadge odometro={Number(odometro) || assignedVehicle.odometroActual} />
          </div>
        </div>

        {/* Nivel de Combustible */}
        <div className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-[#59d499]" />
            02 // Nivel de Combustible *
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => setCombustible(pct)}
                className={`py-2.5 rounded-full font-mono font-bold text-xs transition-all cursor-pointer ${
                  combustible === pct
                    ? 'btn-cockpit-action shadow-xs'
                    : 'telemetry-well text-[#9c9c9d] border border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                {pct === 100 ? 'Lleno' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Preoperacional */}
        <div className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-[#ff6363]" />
              03 // Checklist de Seguridad Minera
            </label>
            <button
              type="button"
              onClick={() => {
                const markAll = !allChecked;
                const next = {};
                PREOPERATIONAL_ITEMS.forEach((i) => (next[i.id] = markAll));
                setChecklist(next);
              }}
              className="text-[10px] text-[#ff6363] font-mono font-bold hover:underline cursor-pointer"
            >
              {allChecked ? 'Desmarcar' : 'Marcar todo'}
            </button>
          </div>

          <div className="space-y-1.5">
            {PREOPERATIONAL_ITEMS.map((item) => {
              const isChecked = checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-full border flex items-center justify-between cursor-pointer transition-colors px-4 ${
                    isChecked
                      ? 'telemetry-well border-white/[0.08] text-[#ffffff]'
                      : 'bg-[#ff6363]/10 border-[#ff6363]/40 text-[#ff6363]'
                  }`}
                >
                  <span className="text-[11px] font-medium pr-2 font-sans">{item.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-[#59d499] text-black font-bold'
                        : 'bg-[#07080a] border border-[#ff6363] text-[#ff6363]'
                    }`}
                  >
                    {isChecked ? <Check className="w-3 h-3 stroke-[3]" /> : <AlertTriangle className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Observaciones */}
        <div className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#6a6b6c]">
            Observaciones Adicionales
          </label>
          <textarea
            rows={2}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Reporte de barro, presión de llantas u observaciones de ingreso..."
            className="w-full telemetry-well border border-white/[0.08] rounded-2xl p-3 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono"
          />
        </div>

        {/* Botón Cockpit Action Cápsula */}
        <button
          type="submit"
          disabled={loading || success}
          className="btn-cockpit-action w-full py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-wide rounded-full font-mono font-bold active:scale-98 disabled:opacity-50 cursor-pointer shadow-xl"
        >
          <ClipboardCheck className="w-4 h-4 stroke-[2.5]" />
          <span>{loading ? 'SINCRONIZANDO EN FIRESTORE...' : 'CONFIRMAR CHECK-IN DE TURNO'}</span>
        </button>
      </form>
    </div>
  );
}
