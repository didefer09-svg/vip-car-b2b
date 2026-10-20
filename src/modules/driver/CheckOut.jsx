import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  ClipboardX,
  Gauge,
  Fuel,
  ArrowLeft,
  Truck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function CheckOut() {
  const navigate = useNavigate();
  const { vehicles, registrarCheckOut } = useFleet();

  const assignedVehicle = vehicles.find((v) => v.placa === 'W4E-892') || vehicles[0];

  const [odometro, setOdometro] = useState(assignedVehicle.odometroActual + 65);
  const [combustible, setCombustible] = useState(65);
  const [novedades, setNovedades] = useState('');
  const [evaluacion, setEvaluacion] = useState('Óptimo');
  const [success, setSuccess] = useState(false);

  const kmRecorridos = Math.max(0, Number(odometro) - assignedVehicle.odometroActual);

  const handleSubmit = (e) => {
    e.preventDefault();

    registrarCheckOut({
      placa: assignedVehicle.placa,
      odometro: Number(odometro),
      combustible,
      novedades: novedades.trim(),
      evaluacion,
      conductor: 'Carlos Huamán',
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/conductor');
    }, 1500);
  };

  return (
    <div className="space-y-4 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/conductor')}
          className="p-2 rounded-full telemetry-well border border-white/[0.08] text-[#9c9c9d] hover:text-[#ffffff] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#ffffff] font-sans">Check-out de Turno</h1>
          <p className="text-xs text-[#6a6b6c] font-mono">Entrega de camioneta y cierre de guardia</p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-full bg-[#071f16] border border-[#59d499]/40 text-[#59d499] flex items-center gap-2.5 font-mono">
          <CheckCircle2 className="w-5 h-5 text-[#59d499] shrink-0" />
          <div className="text-xs font-bold">
            ¡Turno cerrado con éxito! Kilómetros y consumo archivados en bitácora.
          </div>
        </div>
      )}

      {/* Info unidad */}
      <div className="cockpit-panel border border-white/[0.08] p-3.5 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ff6363]" />
          <div>
            <div className="text-[10px] text-[#6a6b6c] uppercase font-mono font-bold">Entrega de Flota</div>
            <div className="text-xs font-bold text-[#ffffff]">{assignedVehicle.marca} {assignedVehicle.modelo}</div>
          </div>
        </div>
        <span className="font-mono font-bold text-xs text-[#ff6363] px-2.5 py-0.5 rounded-full telemetry-well border border-[#ff6363]/30">
          {assignedVehicle.placa}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Odómetro final Sunken */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#ff6363]" />
              01 // Odómetro Final (km) *
            </label>
            <span className="text-[10px] text-[#6a6b6c] font-mono">Inicial: {assignedVehicle.odometroActual} km</span>
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
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6a6b6c] font-bold font-mono">
              KM
            </span>
          </div>

          <div className="p-2.5 rounded-2xl telemetry-well border border-white/[0.08] flex items-center justify-between font-mono">
            <span className="text-xs text-[#6a6b6c] font-medium">Recorrido del turno:</span>
            <span className="font-mono font-black text-[#ff6363] text-sm">
              + {kmRecorridos.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Combustible al entregar */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-[#59d499]" />
            02 // Nivel de Combustible al Cierre *
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

        {/* Condición de Entrega */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#6a6b6c]">
            03 // Condición de Entrega de la Unidad *
          </label>

          <div className="grid grid-cols-3 gap-2">
            {['Óptimo', 'Con observaciones', 'Requiere mantenimiento'].map((cond) => (
              <button
                type="button"
                key={cond}
                onClick={() => setEvaluacion(cond)}
                className={`p-2.5 rounded-full text-xs font-bold transition-all text-center cursor-pointer ${
                  evaluacion === cond
                    ? cond === 'Requiere mantenimiento'
                      ? 'bg-[#ff6363] text-white font-bold'
                      : 'btn-cockpit-action text-white font-bold'
                    : 'telemetry-well text-[#9c9c9d] border border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Novedades */}
        <div className="cockpit-panel border border-white/[0.08] p-4.5 rounded-3xl space-y-1.5">
          <label className="text-xs font-mono font-bold text-[#6a6b6c] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#6a6b6c]" />
            Novedades del Turno
          </label>
          <textarea
            rows={2}
            value={novedades}
            onChange={(e) => setNovedades(e.target.value)}
            placeholder="Reporte de barro en carretera, desvío por obras o ruidos mecánicos..."
            className="w-full telemetry-well border border-white/[0.08] rounded-2xl p-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363] font-mono"
          />
        </div>

        {/* Botón de Cierre Cockpit Action */}
        <button
          type="submit"
          className="btn-cockpit-action w-full py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-wide rounded-full font-mono font-bold active:scale-98 cursor-pointer"
        >
          <ClipboardX className="w-4 h-4 stroke-[2.5]" />
          <span>CERRAR Y REGISTRAR TURNO</span>
        </button>
      </form>
    </div>
  );
}
