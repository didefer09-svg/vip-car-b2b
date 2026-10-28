import React from 'react';
import { Link } from 'react-router-dom';
import { useFleet } from '../../context/FleetContext';
import {
  Car,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrafficCone,
  FileText,
  ArrowUpRight,
  ShieldAlert,
  Wrench
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import AlertaCriticaCockpit from '../../components/dashboard/AlertaCriticaCockpit';

export default function DashboardHome() {
  const { vehicles, bitacora, averias, calcularSemaforo } = useFleet();

  const totalVehicles = vehicles.length;
  const enServicio = vehicles.filter((v) => v.estadoOperativo === 'En Servicio').length;
  const disponibles = vehicles.filter((v) => v.estadoOperativo === 'Disponible').length;

  const semaforoStats = vehicles.reduce(
    (acc, v) => {
      const s = calcularSemaforo(v.odometroActual);
      if (s.estado === 'Rojo') acc.rojo++;
      if (s.estado === 'Amarillo') acc.amarillo++;
      if (s.estado === 'Verde') acc.verde++;
      return acc;
    },
    { verde: 0, amarillo: 0, rojo: 0 }
  );

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            CONTROL OPERATIVO • TELEMETRÍA DE FLOTA
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight font-sans">
            Dashboard Cockpit Gerencial
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5">
            Supervisión técnica de pickups en Junín • Semáforo preventivo a 5k, 10k y 20k km
          </p>
        </div>

        <Link
          to="/dashboard/semaforo"
          className="btn-raycast-primary self-start md:self-auto py-2.5 px-5 rounded-full flex items-center gap-1.5 text-xs active:scale-98 cursor-pointer"
        >
          <TrafficCone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ver Semáforo Preventivo</span>
        </Link>
      </div>

      {/* Apartado & Modal de Alerta Crítica (SOS & Averías) */}
      <AlertaCriticaCockpit />

      {/* Alerta Crítica en Coral Pulse */}
      {(semaforoStats.rojo > 0 || averias.length > 0) && (
        <div className="p-5 rounded-3xl bg-[#2d0e14] border border-[#ff6363]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#ff6363] text-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#ff6363] uppercase tracking-wide font-mono">
                Atención Mecánica Requerida
              </div>
              <div className="text-xs text-[#9c9c9d] mt-0.5">
                {semaforoStats.rojo} unidad(es) con servicio vencido y {averias.length} reporte(s) de avería activos en operación.
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/semaforo"
            className="px-4 py-2 rounded-full bg-[#ff6363] hover:bg-[#ff4d4d] text-black font-bold text-xs self-start sm:self-auto transition-colors font-mono cursor-pointer"
          >
            Revisar Unidades
          </Link>
        </div>
      )}

      {/* KPI Cards: Industrial Cockpit Cluster */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Flota Total */}
        <div className="cockpit-panel p-5 rounded-3xl space-y-1 border border-white/[0.1] shadow-xl">
          <div className="flex items-center justify-between text-[#626773]">
            <span className="text-[10px] font-mono uppercase tracking-[1px]">Flota Total</span>
            <Car className="w-4 h-4 text-[#ff6363]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalVehicles}</div>
          <div className="text-[11px] text-[#626773] flex items-center gap-1 font-mono">
            <span className="text-[#59d499] font-bold">{enServicio} en servicio</span> • {disponibles} disp.
          </div>
        </div>

        {/* KPI 2: Verde */}
        <div className="cockpit-panel p-5 rounded-3xl space-y-1 bg-[#071f16]/30 border border-[#59d499]/35 shadow-xl">
          <div className="flex items-center justify-between text-[#59d499]">
            <span className="text-[10px] font-mono uppercase tracking-[1px]">Óptimas</span>
            <CheckCircle className="w-4 h-4 text-[#59d499]" />
          </div>
          <div className="text-3xl font-black text-[#59d499] font-mono">{semaforoStats.verde}</div>
          <div className="text-[11px] text-[#626773] font-mono">
            &gt; 500 km para servicio
          </div>
        </div>

        {/* KPI 3: Amarillo */}
        <div className="cockpit-panel p-5 rounded-3xl space-y-1 bg-[#231908]/30 border border-[#f59e0b]/35 shadow-xl">
          <div className="flex items-center justify-between text-[#f59e0b]">
            <span className="text-[10px] font-mono uppercase tracking-[1px]">Próximas</span>
            <Clock className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-3xl font-black text-[#f59e0b] font-mono">{semaforoStats.amarillo}</div>
          <div className="text-[11px] text-[#626773] font-mono">
            &lt; 500 km (Programar taller)
          </div>
        </div>

        {/* KPI 4: Rojo */}
        <div className="cockpit-panel p-5 rounded-3xl space-y-1 bg-[#2d0e14]/40 border border-[#ff6363]/40 shadow-xl">
          <div className="flex items-center justify-between text-[#ff6363]">
            <span className="text-[10px] font-mono uppercase tracking-[1px]">Vencidas</span>
            <AlertTriangle className="w-4 h-4 text-[#ff6363] animate-pulse" />
          </div>
          <div className="text-3xl font-black text-[#ff6363] font-mono">{semaforoStats.rojo}</div>
          <div className="text-[11px] text-[#ff6363] font-medium font-mono">
            Inhabilitación preventiva
          </div>
        </div>
      </div>

      {/* 2 Columnas: Odómetro / Alertas + Bitácora en vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Izquierda: Odómetro */}
        <div className="cockpit-panel p-6 rounded-3xl space-y-4 border border-white/[0.1] shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#ff6363]" />
              <h2 className="text-xs uppercase font-mono tracking-[1px] text-white font-bold">
                Control de Odómetro & Preventivo
              </h2>
            </div>
            <Link
              to="/dashboard/semaforo"
              className="text-xs text-[#ff6363] hover:underline flex items-center gap-1 font-mono font-medium"
            >
              Semáforo <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {vehicles.slice(0, 4).map((veh) => (
              <div
                key={veh.id}
                className="telemetry-well p-3.5 rounded-2xl space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white font-sans">{veh.marca} {veh.modelo}</span>
                    <div className="text-[11px] text-[#626773] font-mono">
                      {veh.empresaAsignada}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ff6363] px-2.5 py-0.5 rounded-full bg-[#0c0e12] border border-[#ff6363]/40">
                    {veh.placa}
                  </span>
                </div>
                <SemaforoBadge odometro={veh.odometroActual} compact={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Derecha: Bitácora reciente */}
        <div className="cockpit-panel p-6 rounded-3xl space-y-4 border border-white/[0.1] shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#363739]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff6363]" />
              <h2 className="text-xs uppercase font-mono tracking-[0.8px] text-white font-medium">
                Telemetría en Vivo de Choferes
              </h2>
            </div>
            <Link
              to="/dashboard/bitacora"
              className="text-xs text-[#ff6363] hover:underline flex items-center gap-1 font-mono font-medium"
            >
              Bitácora <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {bitacora.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-[#111214] border border-[#363739] flex items-center justify-between text-xs hover:bg-[#1b1c1e] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white">{log.tipoRegistro}</span>
                    <span className="font-mono text-[10px] text-[#6a6b6c] font-bold bg-[#07080a] px-2 py-0.5 rounded-full border border-[#363739]">
                      {log.placa}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6a6b6c] font-mono">
                    {log.conductor} • {log.fechaHora}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-white">
                    {log.odometro?.toLocaleString()} km
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      log.estado === 'Alerta'
                        ? 'bg-[#2d0e14] text-[#ff6363] border border-[#ff6363]/40'
                        : 'bg-[#071f16] text-[#59d499] border border-[#59d499]/35'
                    }`}
                  >
                    {log.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
