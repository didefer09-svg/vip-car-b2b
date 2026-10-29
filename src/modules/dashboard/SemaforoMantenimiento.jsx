import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { subscribeToVehiculos } from '../../services/firestoreService';
import { isConfigured } from '../../config/firebase';
import {
  TrafficCone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Wrench,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function SemaforoMantenimiento() {
  const { vehicles: contextVehicles, calcularSemaforo } = useFleet();
  const [vehicles, setVehicles] = useState(contextVehicles);
  const [empresaFiltro, setEmpresaFiltro] = useState('todas');
  const [notif, setNotif] = useState('');

  // Sincronizar con el estado global de la flota
  useEffect(() => {
    setVehicles(contextVehicles);
  }, [contextVehicles]);

  // Suscripción onSnapshot directa en tiempo real a la colección 'vehiculos'
  useEffect(() => {
    if (!isConfigured) return;

    const unsub = subscribeToVehiculos(
      (liveData) => {
        if (liveData && liveData.length > 0) {
          setVehicles(liveData);
        }
      },
      (err) => {
        console.warn('Listener onSnapshot en Semáforo:', err);
      }
    );

    return () => unsub();
  }, []);

  const safeVehicles = vehicles || [];
  const categorized = safeVehicles.reduce(
    (acc, v) => {
      const empresa = v?.empresaAsignada || '';
      if (empresaFiltro !== 'todas' && !empresa.includes(empresaFiltro)) {
        return acc;
      }
      const s = (typeof calcularSemaforo === 'function' ? calcularSemaforo(v?.odometroActual || 0) : null) || {
        estado: 'Verde',
        kmRestantes: 5000,
        siguienteServicio: 10000,
      };
      if (s?.estado === 'Rojo') acc.rojo.push({ ...v, semaforo: s });
      else if (s?.estado === 'Amarillo') acc.amarillo.push({ ...v, semaforo: s });
      else acc.verde.push({ ...v, semaforo: s });
      return acc;
    },
    { rojo: [], amarillo: [], verde: [] }
  );

  const handleProgramarMantenimiento = (veh) => {
    setNotif(`Orden de taller preventivo generada para [${veh.placa}] en Taller Central Huancayo.`);
    setTimeout(() => setNotif(''), 3500);
  };

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            [CYCLE // INTERVALOS PREVENTIVOS: 5K / 10K / 20K KM]
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white flex items-center gap-2 font-sans tracking-tight">
            <TrafficCone className="w-6 h-6 text-[#ff6363]" />
            Semáforo de Mantenimiento Preventivo
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5 font-mono">
            Monitoreo proactivo de telemetría para evitar paradas no programadas en operaciones mineras de altura.
          </p>
        </div>

        {/* Filtros e Indicador onSnapshot */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge onSnapshot en Vivo */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full telemetry-well border border-white/[0.08] text-[11px] font-mono shadow-xs"
            title="Suscripción onSnapshot conectada a la colección 'vehiculos' en Cloud Firestore"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#59d499] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#59d499]"></span>
            </span>
            <span className="text-[#59d499] font-medium">onSnapshot Vivo</span>
            <span className="text-[#6a6b6c]">•</span>
            <span className="text-[#9c9c9d] font-mono">{vehicles.length} unidades</span>
          </div>

          {/* Filtro Proyecto / Operación */}
          <div className="flex items-center gap-2 telemetry-well border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <Filter className="w-3.5 h-3.5 text-[#6a6b6c]" />
            <select
              value={empresaFiltro}
              onChange={(e) => setEmpresaFiltro(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none pr-3 font-mono cursor-pointer"
            >
              <option value="todas" className="bg-[#07080a]">Todos los Proyectos / Operaciones</option>
              <option value="Chinalco" className="bg-[#07080a]">Minera Chinalco (Toromocho)</option>
              <option value="Volcan" className="bg-[#07080a]">Volcan Compañía Minera</option>
              <option value="San Martín" className="bg-[#07080a]">Constructora San Martín</option>
              <option value="Nexa" className="bg-[#07080a]">Nexa Resources</option>
            </select>
          </div>
        </div>
      </div>

      {notif && (
        <div className="p-3.5 rounded-full bg-[#2d0e14] border border-[#ff6363]/50 text-[#ff6363] text-xs font-medium flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notif}</span>
        </div>
      )}

      {/* Resumen Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rojo: Crítico Coral #ff6363 */}
        <div className="cockpit-panel border border-[#ff6363]/40 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6363]/15 border border-[#ff6363]/40 text-[#ff6363] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#ff6363] uppercase tracking-wider">[SYS // VENCIDAS]</div>
              <div className="text-[11px] text-[#6a6b6c] font-mono">Límite superado o inhabilitadas</div>
            </div>
          </div>
          <span className="text-3xl font-black text-[#ff6363] font-mono">
            {categorized.rojo.length}
          </span>
        </div>

        {/* Amarillo: #f59e0b */}
        <div className="cockpit-panel border border-[#f59e0b]/40 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider">[SYS // PRÓXIMAS]</div>
              <div className="text-[11px] text-[#6a6b6c] font-mono">&lt; 500 km para servicio</div>
            </div>
          </div>
          <span className="text-3xl font-black text-[#f59e0b] font-mono">
            {categorized.amarillo.length}
          </span>
        </div>

        {/* Verde: #59d499 */}
        <div className="cockpit-panel border border-[#59d499]/35 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#59d499]/15 border border-[#59d499]/40 text-[#59d499] flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#59d499] uppercase tracking-wider">[SYS // ÓPTIMAS]</div>
              <div className="text-[11px] text-[#6a6b6c] font-mono">&gt; 500 km restantes</div>
            </div>
          </div>
          <span className="text-3xl font-black text-[#59d499] font-mono">
            {categorized.verde.length}
          </span>
        </div>
      </div>

      {/* Tablero 3 Columnas Cockpit Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA 1: ROJO */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#ff6363]/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6363] animate-ping" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff6363]">
                01 // Mantenimiento Vencido ({categorized.rojo.length})
              </h3>
            </div>
            <span className="text-[10px] text-[#ff6363] font-mono font-bold bg-[#ff6363]/10 px-2.5 py-0.5 rounded-full border border-[#ff6363]/40">
              URGENTE
            </span>
          </div>

          <div className="space-y-3">
            {(categorized?.rojo || []).length === 0 ? (
              <div className="p-6 rounded-3xl cockpit-panel border border-white/[0.08] text-center text-xs text-[#6a6b6c] font-mono">
                No hay unidades con mantenimiento vencido.
              </div>
            ) : (
              (categorized?.rojo || []).map((veh) => (
                <div
                  key={veh?.id || veh?.placa}
                  className="cockpit-panel border border-[#ff6363]/40 p-5 rounded-3xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">{veh?.marca} {veh?.modelo}</div>
                      <div className="text-[10px] text-[#6a6b6c] flex items-center gap-1 mt-0.5 font-mono">
                        <Building className="w-3 h-3 text-[#ff6363]" />
                        <span>{veh?.empresaAsignada || 'Flota General'}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#ff6363] px-2.5 py-0.5 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/40">
                      {veh?.placa}
                    </span>
                  </div>

                  <div className="telemetry-well p-3.5 rounded-2xl space-y-1 text-xs border border-white/[0.08]">
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Odómetro actual:</span>
                      <span className="font-bold text-white">{veh?.odometroActual?.toLocaleString?.() || veh?.odometroActual || 0} km</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Límite de servicio:</span>
                      <span className="font-bold text-[#ff6363]">{veh?.semaforo?.siguienteServicio?.toLocaleString?.() || 0} km</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/[0.06] text-[#ff6363] font-bold text-[11px] font-mono">
                      <span>Exceso de kilometraje:</span>
                      <span>+ {Math.abs(veh?.semaforo?.kmRestantes || 0).toLocaleString()} km</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProgramarMantenimiento(veh)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#ff6363] hover:bg-[#ff4d4d] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98 font-mono cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Inhabilitar y Ordenar Taller</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA 2: AMARILLO */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#f59e0b]/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#f59e0b]">
                02 // Mantenimiento Próximo ({categorized.amarillo.length})
              </h3>
            </div>
            <span className="text-[10px] text-[#f59e0b] font-mono font-bold bg-[#f59e0b]/10 px-2.5 py-0.5 rounded-full border border-[#f59e0b]/40">
              &lt; 500 KM
            </span>
          </div>

          <div className="space-y-3">
            {(categorized?.amarillo || []).length === 0 ? (
              <div className="p-6 rounded-3xl cockpit-panel border border-white/[0.08] text-center text-xs text-[#6a6b6c] font-mono">
                No hay unidades próximas a servicio.
              </div>
            ) : (
              (categorized?.amarillo || []).map((veh) => (
                <div
                  key={veh?.id || veh?.placa}
                  className="cockpit-panel border border-[#f59e0b]/40 p-5 rounded-3xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">{veh?.marca} {veh?.modelo}</div>
                      <div className="text-[10px] text-[#6a6b6c] flex items-center gap-1 mt-0.5 font-mono">
                        <Building className="w-3 h-3 text-[#f59e0b]" />
                        <span>{veh?.empresaAsignada || 'Flota General'}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#f59e0b] px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40">
                      {veh?.placa}
                    </span>
                  </div>

                  <div className="telemetry-well p-3.5 rounded-2xl space-y-1 text-xs border border-white/[0.08]">
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Odómetro actual:</span>
                      <span className="font-bold text-white">{veh?.odometroActual?.toLocaleString?.() || veh?.odometroActual || 0} km</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Siguiente servicio:</span>
                      <span className="font-bold text-[#f59e0b]">{veh?.semaforo?.siguienteServicio?.toLocaleString?.() || 0} km</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/[0.06] text-[#f59e0b] font-bold text-[11px] font-mono">
                      <span>Margen restante:</span>
                      <span>{(veh?.semaforo?.kmRestantes || 0).toLocaleString()} km</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleProgramarMantenimiento(veh)}
                    className="btn-cockpit-secondary w-full py-2.5 px-4 rounded-full text-xs flex items-center justify-center gap-1.5 text-[#f59e0b] hover:text-white border-[#f59e0b]/40 active:scale-98 font-mono cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Programar Taller Preventivo</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA 3: VERDE */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#59d499]/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#59d499]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#59d499]">
                03 // Estado Óptimo ({(categorized?.verde || []).length})
              </h3>
            </div>
            <span className="text-[10px] text-[#59d499] font-mono font-bold bg-[#59d499]/10 px-2.5 py-0.5 rounded-full border border-[#59d499]/35">
              OPERATIVO
            </span>
          </div>

          <div className="space-y-3">
            {(categorized?.verde || []).length === 0 ? (
              <div className="p-6 rounded-3xl cockpit-panel border border-white/[0.08] text-center text-xs text-[#6a6b6c] font-mono">
                No hay unidades registradas en estado óptimo.
              </div>
            ) : (
              (categorized?.verde || []).map((veh) => (
                <div
                  key={veh?.id || veh?.placa}
                  className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">{veh?.marca} {veh?.modelo}</div>
                      <div className="text-[10px] text-[#6a6b6c] flex items-center gap-1 mt-0.5 font-mono">
                        <Building className="w-3 h-3 text-[#6a6b6c]" />
                        <span>{veh?.empresaAsignada || 'Flota General'}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white px-2.5 py-0.5 rounded-full telemetry-well border border-white/[0.1]">
                      {veh?.placa}
                    </span>
                  </div>

                  <div className="telemetry-well p-3.5 rounded-2xl space-y-1 text-xs border border-white/[0.08]">
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Odómetro actual:</span>
                      <span className="font-bold text-white">{veh?.odometroActual?.toLocaleString?.() || veh?.odometroActual || 0} km</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-[#6a6b6c] text-[11px]">Próximo servicio a:</span>
                      <span className="font-bold text-[#6a6b6c]">{veh?.semaforo?.siguienteServicio?.toLocaleString?.() || 0} km</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/[0.06] text-[#59d499] font-bold text-[11px] font-mono">
                      <span>Margen operativo:</span>
                      <span>{(veh?.semaforo?.kmRestantes || 0).toLocaleString()} km restantes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6a6b6c] font-mono">
                    <span>Chofer: {veh?.conductorActual || 'En patio'}</span>
                    <span className="text-[#59d499] font-medium">100% Conforme</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
