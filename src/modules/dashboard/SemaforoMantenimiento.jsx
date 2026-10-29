import React, { useState, useEffect, useMemo } from 'react';
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
  Calendar,
  X,
  Plus
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function SemaforoMantenimiento() {
  const { vehicles: contextVehicles, calcularSemaforo, registrarMantenimiento } = useFleet();
  const [vehicles, setVehicles] = useState(contextVehicles);
  const [empresaFiltro, setEmpresaFiltro] = useState('todas');
  const [notif, setNotif] = useState('');

  // Estados para el Modal de Mantenimiento
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    placa: '',
    tipoMantenimiento: 'Preventivo 5,000 km',
    kilometraje: '',
    observaciones: '',
  });

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

  // Lista de las 30 unidades oficiales disponibles para el selector del modal
  const listaUnidades = useMemo(() => {
    return (vehicles || []).map((v) => ({
      placa: v?.placa || '',
      tipo: v?.tipo || 'Unidad 4x4',
      propietario: v?.propietario || 'VIP CAR',
      centroCosto: v?.centroCosto || '',
      odometroActual: v?.odometroActual || 0,
      marca: v?.marca || 'Toyota',
      modelo: v?.modelo || '',
    }));
  }, [vehicles]);

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

  // Abrir modal con la unidad preseleccionada y sugerir odómetro actual
  const handleAbrirModal = (veh = null, defaultTipo = null) => {
    const targetPlaca = veh?.placa || listaUnidades[0]?.placa || 'BHF-821';
    const targetVeh = (vehicles || []).find((v) => v?.placa === targetPlaca) || veh;
    const currentOdo = targetVeh?.odometroActual != null ? String(targetVeh.odometroActual) : '';

    let tipoSugerido = defaultTipo;
    if (!tipoSugerido) {
      const s = targetVeh?.semaforo?.estado || (typeof calcularSemaforo === 'function' ? calcularSemaforo(targetVeh?.odometroActual || 0)?.estado : null);
      tipoSugerido = s === 'Rojo' ? 'Correctivo Frenos' : 'Preventivo 5,000 km';
    }

    setFormData({
      placa: targetPlaca,
      tipoMantenimiento: tipoSugerido || 'Preventivo 5,000 km',
      kilometraje: currentOdo,
      observaciones: '',
    });
    setModalAbierto(true);
  };

  // Al cambiar la placa en el select del modal, actualizar odómetro sugerido
  const handlePlacaChange = (nuevaPlaca) => {
    const veh = (vehicles || []).find((v) => v?.placa === nuevaPlaca);
    setFormData((prev) => ({
      ...prev,
      placa: nuevaPlaca,
      kilometraje: veh?.odometroActual != null ? String(veh.odometroActual) : prev.kilometraje,
    }));
  };

  // Guardar en Firestore y cerrar modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.placa) return;

    setGuardando(true);
    try {
      if (typeof registrarMantenimiento === 'function') {
        await registrarMantenimiento({
          placa: formData.placa,
          tipoMantenimiento: formData.tipoMantenimiento,
          kilometraje: Number(formData.kilometraje) || 0,
          observaciones: formData.observaciones.trim() || 'Mantenimiento programado desde Semáforo Preventivo.',
        });
      }

      setNotif(`¡Mantenimiento para la unidad [${formData.placa}] guardado exitosamente en Firestore!`);
      setModalAbierto(false);
      setTimeout(() => setNotif(''), 4500);
    } catch (err) {
      console.error('Error al guardar mantenimiento en Firestore:', err);
      setNotif(`Error al guardar mantenimiento para [${formData.placa}].`);
      setTimeout(() => setNotif(''), 4500);
    } finally {
      setGuardando(false);
    }
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

          {/* Botón Acción Rápida Header */}
          <button
            type="button"
            onClick={() => handleAbrirModal(null, 'Preventivo 5,000 km')}
            className="btn-cockpit-action py-2 px-4 rounded-full flex items-center justify-center gap-1.5 text-xs font-mono font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ PROGRAMAR MANTENIMIENTO</span>
          </button>
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
                    onClick={() => handleAbrirModal(veh, 'Correctivo Frenos')}
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
                    onClick={() => handleAbrirModal(veh, 'Preventivo 5,000 km')}
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

      {/* Modal Obligatorio: Programar Taller / Registrar Mantenimiento */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="cockpit-panel rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto border border-white/[0.1] shadow-2xl">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/30">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Programar Taller Preventivo / Correctivo
                  </h3>
                  <p className="text-[11px] text-[#6a6b6c] font-mono mt-0.5">
                    Sincronización en tiempo real con Firestore y actualización de odómetro
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="p-1.5 rounded-full hover:bg-white/[0.08] text-[#9c9c9d] hover:text-white cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario estrictamente con los 4 campos solicitados */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {/* CAMPO 1: Placa (Menú desplegable con las 30 unidades oficiales, preseleccionada) */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
                  01 // Placa de la Unidad (30 Unidades Oficiales) *
                </label>
                <select
                  required
                  value={formData.placa}
                  onChange={(e) => handlePlacaChange(e.target.value)}
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
                >
                  {(listaUnidades || []).map((u, i) => (
                    <option key={u.placa} value={u.placa} className="bg-[#0c0e12] text-white">
                      {i + 1}. {u.placa} | {u.tipo} | {u.propietario} | {u.centroCosto} ({u.odometroActual.toLocaleString()} km)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#6a6b6c] mt-1 block">
                  Placa preseleccionada de la tarjeta donde se hizo clic. Cambiarla actualiza el odómetro sugerido.
                </span>
              </div>

              {/* CAMPO 2: Tipo de Mantenimiento (Menú desplegable) */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
                  02 // Tipo de Mantenimiento *
                </label>
                <select
                  required
                  value={formData.tipoMantenimiento}
                  onChange={(e) => setFormData({ ...formData, tipoMantenimiento: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
                >
                  <option value="Preventivo 5,000 km" className="bg-[#0c0e12]">Preventivo 5,000 km (Servicio Menor)</option>
                  <option value="Preventivo 10,000 km" className="bg-[#0c0e12]">Preventivo 10,000 km (Aceite, Filtros y Neumáticos)</option>
                  <option value="Preventivo 15,000 km" className="bg-[#0c0e12]">Preventivo 15,000 km</option>
                  <option value="Preventivo 20,000 km" className="bg-[#0c0e12]">Preventivo 20,000 km (Servicio Mayor de Altura)</option>
                  <option value="Correctivo Frenos" className="bg-[#0c0e12]">Correctivo Frenos (Pastillas / Discos / Líquido)</option>
                  <option value="Cambio de Aceite y Filtros" className="bg-[#0c0e12]">Cambio de Aceite y Filtros</option>
                  <option value="Alineamiento y Balanceo" className="bg-[#0c0e12]">Alineamiento y Balanceo Computarizado</option>
                  <option value="Suspensión y Dirección" className="bg-[#0c0e12]">Suspensión, Amortiguadores y Dirección</option>
                  <option value="Sistema Eléctrico / Luces Socavón" className="bg-[#0c0e12]">Sistema Eléctrico / Luces Socavón / Pértiga LED</option>
                  <option value="Revisión General Socavón" className="bg-[#0c0e12]">Revisión Técnica Integral para Garita Socavón</option>
                </select>
              </div>

              {/* CAMPO 3: Kilometraje actual (Campo numérico prellenado) */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
                  03 // Kilometraje Actual (km) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="500000"
                  value={formData.kilometraje}
                  onChange={(e) => setFormData({ ...formData, kilometraje: e.target.value })}
                  placeholder="Ej. 15000"
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#ff6363]"
                />
                <span className="text-[10px] text-[#6a6b6c] mt-1 block">
                  Prellenado con el odómetro actual reportado por telemetría.
                </span>
              </div>

              {/* CAMPO 4: Observaciones (Área de texto detallada) */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 uppercase tracking-wider">
                  04 // Observaciones Detalladas *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Detalle técnico de trabajos requeridos en taller, motivo del ingreso, repuestos o especificaciones de garita..."
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl p-3 text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] font-sans"
                />
              </div>

              {/* Botones de Cancelar y Guardar Mantenimiento */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-full telemetry-well text-xs font-mono text-[#9c9c9d] hover:text-white cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="btn-cockpit-action px-6 py-2.5 rounded-full text-xs font-mono font-bold text-black cursor-pointer shadow-lg disabled:opacity-50 transition-transform active:scale-98"
                >
                  {guardando ? 'Guardando en Firestore...' : 'Guardar Mantenimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
