import React from 'react';
import { Link } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  Truck,
  Gauge,
  Fuel,
  ShieldCheck,
  ClipboardCheck,
  ClipboardX,
  AlertOctagon,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  CloudUpload,
  WifiOff
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function DriverHome() {
  const { vehicles, bitacora, pendingSyncCount, sincronizarColaManual } = useFleet();

  const myVehicle = vehicles.find((v) => v.placa === 'W4E-892') || vehicles[0];
  const myLogs = bitacora.filter((b) => b.placa === myVehicle.placa).slice(0, 3);

  return (
    <div className="space-y-5 text-[#9c9c9d]">
      {/* Saludo y Operación */}
      <div className="bg-[#07080a] border border-[#363739] p-4 rounded-[16px]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#ff6363] font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Operación Toromocho • Junín</span>
          </div>
          <span className="text-[11px] text-[#6a6b6c] flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString('es-PE')}
          </span>
        </div>
        <h2 className="text-lg font-black text-[#ffffff]">
          Hola, <span className="text-[#ff6363]">Carlos Huamán</span>
        </h2>
        <p className="text-xs text-[#6a6b6c] mt-0.5">
          Recuerda registrar el odómetro inicial e inspección de pértiga/circulina antes de ingresar a socavón.
        </p>
      </div>

      {/* Alerta de Sincronización Pendiente desde Socavón */}
      {pendingSyncCount > 0 && (
        <div className="bg-[#231908] border border-[#f59e0b]/50 p-3.5 rounded-[14px] flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 text-[#f59e0b]">
            <CloudUpload className="w-5 h-5 animate-pulse shrink-0" />
            <div>
              <div className="font-bold">
                {pendingSyncCount} registro(s) de socavón pendientes
              </div>
              <div className="text-[11px] text-[#f59e0b]/80">
                Guardados localmente sin señal. Se sincronizarán automáticamente con Firestore.
              </div>
            </div>
          </div>
          {navigator.onLine && (
            <button
              onClick={sincronizarColaManual}
              className="px-3 py-1.5 rounded-[6px] bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs font-mono cursor-pointer transition-colors whitespace-nowrap"
            >
              Subir Ahora
            </button>
          )}
        </div>
      )}

      {/* Tarjeta de Unidad Asignada */}
      <div className="bg-[#07080a] border border-[#363739] rounded-[16px] overflow-hidden">
        <div className="p-3.5 bg-[#111214] border-b border-[#363739] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#1b1c1e] border border-[#363739] text-[#ff6363] flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#6a6b6c] font-bold uppercase tracking-wider">Unidad Asignada</div>
              <div className="text-sm font-extrabold text-[#ffffff]">{myVehicle.marca} {myVehicle.modelo}</div>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-[6px] bg-[#040506] border border-[#363739] text-[#ff6363] font-mono font-bold text-xs">
            {myVehicle.placa}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Odómetro y Combustible tipo Pozo Obsidian */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111214] border border-[#363739] p-3 rounded-[8px]">
              <div className="flex items-center gap-1.5 text-[#6a6b6c] text-xs mb-1">
                <Gauge className="w-3.5 h-3.5 text-[#ff6363]" />
                <span className="font-semibold text-[11px]">Odómetro</span>
              </div>
              <div className="text-xl font-mono font-black text-[#ffffff]">
                {myVehicle.odometroActual.toLocaleString()} <span className="text-xs font-normal text-[#6a6b6c]">km</span>
              </div>
            </div>

            <div className="bg-[#111214] border border-[#363739] p-3 rounded-[8px]">
              <div className="flex items-center gap-1.5 text-[#6a6b6c] text-xs mb-1">
                <Fuel className="w-3.5 h-3.5 text-[#59d499]" />
                <span className="font-semibold text-[11px]">Combustible</span>
              </div>
              <div className="text-xl font-mono font-black text-[#ffffff]">
                {myVehicle.nivelCombustible}%
              </div>
              <div className="w-full bg-[#040506] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#363739]">
                <div
                  className={`h-full ${myVehicle.nivelCombustible > 30 ? 'bg-[#59d499]' : 'bg-[#ff6363]'}`}
                  style={{ width: `${myVehicle.nivelCombustible}%` }}
                />
              </div>
            </div>
          </div>

          {/* Semáforo Preventivo */}
          <div>
            <div className="text-[11px] font-bold text-[#6a6b6c] mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6363]" />
              Estado de Mantenimiento Preventivo
            </div>
            <SemaforoBadge odometro={myVehicle.odometroActual} />
          </div>

          {/* Equipamiento Minero */}
          <div className="pt-2 border-t border-[#363739]">
            <div className="text-[10px] uppercase font-bold text-[#6a6b6c] mb-1.5">Equipamiento Minero Instalado:</div>
            <div className="flex flex-wrap gap-1">
              {myVehicle.equipamiento.map((eq, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[6px] text-[10px] bg-[#1b1c1e] text-[#9c9c9d] border border-[#363739]"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción Táctil Cockpit */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6a6b6c] px-1">
          Acciones de Turno
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/conductor/checkin"
            className="bg-[#07080a] border border-[#363739] hover:border-[#6a6b6c] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all text-center min-h-[96px] group active:scale-98"
          >
            <ClipboardCheck className="w-6 h-6 text-[#59d499] mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-black text-[#ffffff]">INICIAR TURNO</span>
            <span className="text-[10px] text-[#6a6b6c]">Check-in & Odómetro</span>
          </Link>

          <Link
            to="/conductor/checkout"
            className="bg-[#07080a] border border-[#363739] hover:border-[#6a6b6c] rounded-[12px] flex flex-col items-center justify-center p-4 transition-all text-center min-h-[96px] group active:scale-98"
          >
            <ClipboardX className="w-6 h-6 text-[#f59e0b] mb-1 group-hover:scale-105 transition-transform" />
            <span className="text-xs font-black text-[#ffffff]">FINALIZAR TURNO</span>
            <span className="text-[10px] text-[#6a6b6c]">Check-out & Entrega</span>
          </Link>
        </div>

        {/* Botón SOS en Rojo Racing */}
        <Link
          to="/conductor/averia"
          className="w-full flex items-center justify-between p-4 rounded-[12px] bg-[#ff6363] hover:bg-[#e11d48] text-white shadow-xs transition-colors min-h-[60px] active:scale-98"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-[8px] bg-black/25">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-wider">
                Reportar Avería o Choque (SOS)
              </div>
              <div className="text-[10px] text-white/90">
                Alerta inmediata con foto y telemetría GPS a base central
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>

      {/* Historial Reciente */}
      <div className="bg-[#07080a] border border-[#363739] rounded-[16px] p-4">
        <h3 className="text-[11px] font-bold text-[#6a6b6c] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#ff6363]" />
          Trazabilidad de Turnos Recientes
        </h3>

        <div className="space-y-1.5">
          {myLogs.length === 0 ? (
            <p className="text-xs text-[#6a6b6c] text-center py-2">No hay registros hoy</p>
          ) : (
            myLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-[8px] bg-[#111214] border border-[#363739] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#ffffff]">{log.tipoRegistro}</div>
                  <div className="text-[10px] text-[#6a6b6c]">{log.fechaHora} • {log.checklistEstado}</div>
                </div>
                <div className="text-right font-mono text-[#ff6363] font-bold text-xs">
                  {log.odometro?.toLocaleString()} km
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
