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
          className="p-1.5 rounded-[8px] bg-[#07080a] border border-[#363739] text-[#9c9c9d] hover:text-[#ffffff]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-black text-[#ffffff]">Check-out de Turno</h1>
          <p className="text-xs text-[#6a6b6c]">Entrega de camioneta y cierre de guardia</p>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-[8px] bg-[#07080a] border border-[#59d499]/40 text-[#59d499] flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#59d499] shrink-0" />
          <div className="text-xs font-bold">
            ¡Turno cerrado con éxito! Kilómetros y consumo archivados en bitácora.
          </div>
        </div>
      )}

      {/* Info unidad */}
      <div className="bg-[#07080a] border border-[#363739] p-3.5 rounded-[12px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ff6363]" />
          <div>
            <div className="text-[10px] text-[#6a6b6c] uppercase font-bold">Entrega de Flota</div>
            <div className="text-xs font-bold text-[#ffffff]">{assignedVehicle.marca} {assignedVehicle.modelo}</div>
          </div>
        </div>
        <span className="font-mono font-bold text-xs text-[#ff6363] px-2.5 py-0.5 rounded-[6px] bg-[#111214] border border-[#363739]">
          {assignedVehicle.placa}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Odómetro final Sunken */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#ff6363]" />
              1. Odómetro Final (km) *
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
              className="w-full bg-[#111214] border border-[#363739] rounded-[8px] px-4 py-3 text-2xl font-mono font-black text-[#ffffff] text-center tracking-widest focus:outline-none focus:border-[#ff6363]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6a6b6c] font-bold font-mono">
              KM
            </span>
          </div>

          <div className="p-2.5 rounded-[8px] bg-[#111214] border border-[#363739] flex items-center justify-between">
            <span className="text-xs text-[#6a6b6c] font-medium">Recorrido del turno:</span>
            <span className="font-mono font-black text-[#ff6363] text-sm">
              + {kmRecorridos.toLocaleString()} km
            </span>
          </div>
        </div>

        {/* Combustible al entregar */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-[#59d499]" />
            2. Nivel de Combustible al Cierre *
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => setCombustible(pct)}
                className={`py-2 rounded-[8px] font-bold text-xs transition-all ${
                  combustible === pct
                    ? 'bg-[#e6e6e6] text-[#454647] font-black shadow-xs'
                    : 'bg-[#111214] text-[#9c9c9d] border border-[#363739] hover:bg-[#1b1c1e]'
                }`}
              >
                {pct === 100 ? 'Lleno' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Condición de Entrega */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#6a6b6c]">
            3. Condición de Entrega de la Unidad *
          </label>

          <div className="grid grid-cols-3 gap-2">
            {['Óptimo', 'Con observaciones', 'Requiere mantenimiento'].map((cond) => (
              <button
                type="button"
                key={cond}
                onClick={() => setEvaluacion(cond)}
                className={`p-2.5 rounded-[8px] text-xs font-bold transition-all text-center ${
                  evaluacion === cond
                    ? cond === 'Requiere mantenimiento'
                      ? 'bg-[#ff6363] text-white font-bold'
                      : 'bg-[#1b1c1e] text-[#ffffff] font-bold border border-[#363739]'
                    : 'bg-[#111214] text-[#9c9c9d] border border-[#363739] hover:bg-[#1b1c1e]'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Novedades */}
        <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px] space-y-1.5">
          <label className="text-xs font-bold text-[#6a6b6c] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#6a6b6c]" />
            Novedades del Turno
          </label>
          <textarea
            rows={2}
            value={novedades}
            onChange={(e) => setNovedades(e.target.value)}
            placeholder="Reporte de barro en carretera, desvío por obras o ruidos mecánicos..."
            className="w-full bg-[#111214] border border-[#363739] rounded-[8px] p-2 text-xs text-[#ffffff] focus:outline-none focus:border-[#ff6363]"
          />
        </div>

        {/* Botón de Cierre Raycast Mist */}
        <button
          type="submit"
          className="btn-raycast-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wide key-shadow rounded-[8px] active:scale-98 cursor-pointer"
        >
          <ClipboardX className="w-4 h-4 stroke-[2.5]" />
          <span>CERRAR Y REGISTRAR TURNO</span>
        </button>
      </form>
    </div>
  );
}
