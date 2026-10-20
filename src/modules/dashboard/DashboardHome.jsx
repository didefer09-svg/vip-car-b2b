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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
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
          className="btn-raycast-primary self-start md:self-auto py-2 px-3.5 flex items-center gap-1.5 text-xs active:scale-98 cursor-pointer"
        >
          <TrafficCone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ver Semáforo Preventivo</span>
        </Link>
      </div>

      {/* Alerta Crítica en Coral Pulse */}
      {(semaforoStats.rojo > 0 || averias.length > 0) && (
        <div className="p-4 rounded-[16px] bg-[#2d0e14] border border-[#ff6363]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[8px] bg-[#ff6363] text-black">
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
            className="px-3 py-1.5 rounded-[8px] bg-[#ff6363] hover:bg-[#ff4d4d] text-black font-bold text-xs self-start sm:self-auto transition-colors font-mono cursor-pointer"
          >
            Revisar Unidades
          </Link>
        </div>
      )}

      {/* KPI Cards: Ink #07080a, Hairline #363739, 16px radius, Pure White text */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Flota Total */}
        <div className="raycast-card p-5 rounded-[16px] space-y-1 bg-[#07080a] border border-[#363739]">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[11px] font-mono uppercase tracking-[0.8px]">Flota Total</span>
            <Car className="w-4 h-4 text-[#ff6363]" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalVehicles}</div>
          <div className="text-[11px] text-[#6a6b6c] flex items-center gap-1">
            <span className="text-[#59d499] font-medium">{enServicio} en servicio</span> • {disponibles} disponibles
          </div>
        </div>

        {/* KPI 2: Verde */}
        <div className="raycast-card p-5 rounded-[16px] space-y-1 bg-[#071f16]/30 border border-[#59d499]/35">
          <div className="flex items-center justify-between text-[#59d499]">
            <span className="text-[11px] font-mono uppercase tracking-[0.8px]">Óptimas</span>
            <CheckCircle className="w-4 h-4 text-[#59d499]" />
          </div>
          <div className="text-3xl font-bold text-[#59d499] font-mono">{semaforoStats.verde}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">
            &gt; 500 km para servicio
          </div>
        </div>

        {/* KPI 3: Amarillo */}
        <div className="raycast-card p-5 rounded-[16px] space-y-1 bg-[#231908]/30 border border-[#f59e0b]/35">
          <div className="flex items-center justify-between text-[#f59e0b]">
            <span className="text-[11px] font-mono uppercase tracking-[0.8px]">Próximas</span>
            <Clock className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-3xl font-bold text-[#f59e0b] font-mono">{semaforoStats.amarillo}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">
            &lt; 500 km (Programar taller)
          </div>
        </div>

        {/* KPI 4: Rojo */}
        <div className="raycast-card p-5 rounded-[16px] space-y-1 bg-[#2d0e14]/40 border border-[#ff6363]/40">
          <div className="flex items-center justify-between text-[#ff6363]">
            <span className="text-[11px] font-mono uppercase tracking-[0.8px]">Vencidas</span>
            <AlertTriangle className="w-4 h-4 text-[#ff6363] animate-pulse" />
          </div>
          <div className="text-3xl font-bold text-[#ff6363] font-mono">{semaforoStats.rojo}</div>
          <div className="text-[11px] text-[#ff6363] font-medium font-mono">
            Inhabilitación preventiva
          </div>
        </div>
      </div>

      {/* 2 Columnas: Odómetro / Alertas + Bitácora en vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Izquierda: Odómetro */}
        <div className="raycast-card p-6 rounded-[16px] space-y-4 bg-[#07080a] border border-[#363739]">
          <div className="flex items-center justify-between pb-3 border-b border-[#363739]">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#ff6363]" />
              <h2 className="text-xs uppercase font-mono tracking-[0.8px] text-white font-medium">
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
                className="p-3 bg-[#111214] rounded-[8px] border border-[#363739] space-y-2 hover:bg-[#1b1c1e] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white">{veh.marca} {veh.modelo}</span>
                    <div className="text-[11px] text-[#6a6b6c] font-mono">
                      {veh.empresaAsignada}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ff6363] px-2 py-0.5 rounded-[4px] bg-[#07080a] border border-[#363739]">
                    {veh.placa}
                  </span>
                </div>
                <SemaforoBadge odometro={veh.odometroActual} compact={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Derecha: Bitácora reciente */}
        <div className="raycast-card p-6 rounded-[16px] space-y-4 bg-[#07080a] border border-[#363739]">
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
                className="p-2.5 rounded-[8px] bg-[#111214] border border-[#363739] flex items-center justify-between text-xs hover:bg-[#1b1c1e] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white">{log.tipoRegistro}</span>
                    <span className="font-mono text-[10px] text-[#6a6b6c] font-bold bg-[#07080a] px-1.5 py-0.2 rounded-[4px] border border-[#363739]">
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
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-[4px] ${
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
