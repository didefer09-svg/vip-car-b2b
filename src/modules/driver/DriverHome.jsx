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
  WifiOff,
  Radio,
  Zap,
  Phone
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function DriverHome() {
  const { vehicles, bitacora, pendingSyncCount, sincronizarColaManual } = useFleet();

  const fallbackVehicle = {
    placa: 'W4E-892',
    marca: 'Toyota',
    modelo: 'Hilux 4x4',
    tipo: 'Pickup 4x4',
    traccion: '4x4',
    empresaAsignada: 'VIP CAR Huancayo',
    odometroActual: 45280,
    nivelCombustible: 85,
    equipamiento: ['Jaula Antivuelco', 'Pértiga LED', 'GPS Satelital', 'Extintor 6kg'],
  };
  const myVehicle = (vehicles || []).find((v) => v?.placa === 'W4E-892') || vehicles?.[0] || fallbackVehicle;
  const myLogs = (bitacora || []).filter((b) => b?.placa === myVehicle?.placa).slice(0, 3);

  return (
    <div className="space-y-5 text-[#949aa6]">
      {/* Saludo y Operación Cockpit Industrial */}
      <div className="cockpit-panel rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#ff6363] font-bold font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>TERMINAL CONDUCCIÓN // TOROMOCHO</span>
          </div>
          <span className="text-[10px] text-[#626773] flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3" />
            {new Date().toLocaleDateString('es-PE')}
          </span>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight font-sans">
          Operador <span className="text-[#ff6363]">Carlos Huamán</span>
        </h2>
        <p className="text-xs text-[#626773] font-mono mt-0.5">
          Verifica pértiga LED, tacos de rueda y odómetro inicial antes de descender a socavón.
        </p>
      </div>

      {/* Alerta de Sincronización Pendiente desde Socavón */}
      {pendingSyncCount > 0 && (
        <div className="bg-[#231908] border border-[#f59e0b]/50 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 text-[#f59e0b]">
            <CloudUpload className="w-5 h-5 animate-pulse shrink-0" />
            <div>
              <div className="font-bold font-mono">
                {pendingSyncCount} registro(s) de socavón pendientes
              </div>
              <div className="text-[11px] text-[#f59e0b]/80">
                Guardados localmente en el dispositivo. Se subirán a Firestore automáticamente.
              </div>
            </div>
          </div>
          {navigator.onLine && (
            <button
              onClick={sincronizarColaManual}
              className="px-4 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs font-mono cursor-pointer transition-colors whitespace-nowrap shadow-md"
            >
              Subir Ahora
            </button>
          )}
        </div>
      )}

      {/* Tarjeta Cockpit de Unidad Asignada */}
      <div className="cockpit-panel rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ff6363]/15 border border-[#ff6363]/40 text-[#ff6363] flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-[#626773] font-bold uppercase tracking-wider font-mono">Unidad Asignada</div>
              <div className="text-sm font-black text-white font-sans">{myVehicle.marca} {myVehicle.modelo}</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full telemetry-well border border-[#ff6363]/30 text-[#ff6363] font-mono font-bold text-xs">
            {myVehicle.placa}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Instrumentos de Odómetro y Combustible tipo Telemetry Wells */}
          <div className="grid grid-cols-2 gap-3">
            <div className="telemetry-well p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-[#626773] text-xs mb-1 font-mono">
                <Gauge className="w-3.5 h-3.5 text-[#ff6363]" />
                <span className="font-bold text-[10px] uppercase">Odómetro</span>
              </div>
              <div className="text-2xl font-mono font-black text-white">
                {myVehicle.odometroActual.toLocaleString()} <span className="text-xs font-normal text-[#626773]">km</span>
              </div>
            </div>

            <div className="telemetry-well p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-[#626773] text-xs mb-1 font-mono">
                <Fuel className="w-3.5 h-3.5 text-[#59d499]" />
                <span className="font-bold text-[10px] uppercase">Combustible</span>
              </div>
              <div className="text-2xl font-mono font-black text-white">
                {myVehicle.nivelCombustible}%
              </div>
              <div className="w-full bg-[#040506] h-1.5 rounded-full mt-1.5 overflow-hidden border border-white/10">
                <div
                  className={`h-full ${myVehicle.nivelCombustible > 30 ? 'bg-[#59d499]' : 'bg-[#ff6363]'}`}
                  style={{ width: `${myVehicle.nivelCombustible}%` }}
                />
              </div>
            </div>
          </div>

          {/* Semáforo Preventivo */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#626773] mb-1.5 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6363]" />
              Semáforo Preventivo de Mantenimiento:
            </div>
            <SemaforoBadge odometro={myVehicle.odometroActual} />
          </div>

          {/* Equipamiento Minero en Cápsulas */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="text-[9px] uppercase font-mono tracking-wider text-[#626773] mb-1.5 font-bold">
              Equipamiento Instalado para Socavón:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(myVehicle?.equipamiento || []).map((eq, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono telemetry-well text-[#949aa6] border border-white/[0.08]"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controladores Táctiles de Turno en Cápsula */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#626773] px-1 font-bold">
          Controladores de Turno
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/conductor/checkin"
            className="cockpit-panel rounded-3xl flex flex-col items-center justify-center p-4 transition-all text-center min-h-[96px] group active:scale-98 border border-white/[0.08] hover:border-[#59d499]/60 shadow-lg cursor-pointer"
          >
            <ClipboardCheck className="w-6 h-6 text-[#59d499] mb-1 group-hover:scale-108 transition-transform" />
            <span className="text-xs font-black text-white font-mono">INICIAR TURNO</span>
            <span className="text-[10px] text-[#626773] font-mono">Check-in & Odómetro</span>
          </Link>

          <Link
            to="/conductor/checkout"
            className="cockpit-panel rounded-3xl flex flex-col items-center justify-center p-4 transition-all text-center min-h-[96px] group active:scale-98 border border-white/[0.08] hover:border-[#f59e0b]/60 shadow-lg cursor-pointer"
          >
            <ClipboardX className="w-6 h-6 text-[#f59e0b] mb-1 group-hover:scale-108 transition-transform" />
            <span className="text-xs font-black text-white font-mono">FINALIZAR TURNO</span>
            <span className="text-[10px] text-[#626773] font-mono">Check-out & Entrega</span>
          </Link>
        </div>

        {/* Botón SOS Cápsula Prominente con Enlace Telefónico */}
        <div className="space-y-2.5">
          <Link
            to="/conductor/averia"
            className="w-full flex items-center justify-between p-4 px-6 rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#ff6363] hover:to-[#e11d48] text-white shadow-xl transition-all min-h-[60px] active:scale-98 border border-white/20 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-black/30">
                <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left font-mono">
                <div className="text-xs font-black uppercase tracking-wider">
                  REPORTAR AVERÍA O CHOQUE (SOS)
                </div>
                <div className="text-[10px] text-white/80">
                  Alerta inmediata con foto y telemetría a Base Huancayo
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white" />
          </Link>

          {/* Enlace directo para llamada de emergencia telefónica */}
          <div className="p-3 telemetry-well border border-white/[0.08] rounded-full flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#9c9c9d]">
              <Phone className="w-3.5 h-3.5 text-[#ff6363]" />
              <span className="text-[11px]">Central de Emergencia 24/7:</span>
            </div>
            <a
              href="tel:983592452"
              className="text-xs font-bold text-[#ff6363] hover:text-[#ff8080] hover:underline transition-colors"
              title="Llamar al 983592452"
            >
              983592452
            </a>
          </div>
        </div>
      </div>

      {/* Historial Reciente */}
      <div className="cockpit-panel rounded-3xl p-5 border border-white/[0.08]">
        <h3 className="text-[10px] font-mono font-bold text-[#626773] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#ff6363]" />
          Bitácora de Turnos Recientes
        </h3>

        <div className="space-y-2.5">
          {myLogs.length === 0 ? (
            <p className="text-xs text-[#626773] text-center py-3 font-mono">Sin registros previos.</p>
          ) : (
            (myLogs || []).map((log) => (
              <div
                key={log.id}
                className="telemetry-well p-3 rounded-2xl flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-white font-bold">{log.tipoRegistro}</div>
                  <div className="text-[10px] text-[#626773]">{log.fechaHora} • {log.proyecto}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{log.odometro?.toLocaleString()} km</div>
                  <span className="text-[9px] text-[#59d499]">{log.checklistEstado}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
