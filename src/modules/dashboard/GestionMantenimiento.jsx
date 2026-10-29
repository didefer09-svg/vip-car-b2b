import React, { useState, useMemo } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Truck,
  Filter,
  X,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity
} from 'lucide-react';

export default function GestionMantenimiento() {
  const { vehicles, mantenimientos, registrarMantenimiento } = useFleet();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPropietario, setFiltroPropietario] = useState('todos');
  const [notif, setNotif] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Formulario con estrictamente los 4 campos solicitados por Gerencia:
  // 1. Placa (lista desplegable con las 30 unidades)
  // 2. Tipo de Mantenimiento
  // 3. Kilometraje actual
  // 4. Observaciones detalladas
  const [formData, setFormData] = useState({
    placa: '',
    tipoMantenimiento: 'Preventivo 5,000 km',
    kilometraje: '',
    observaciones: '',
  });

  // Lista de las 30 unidades oficiales disponibles para el selector
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

  // Al abrir el modal, inicializar placa por defecto si está vacía
  const handleAbrirModal = () => {
    const primeraPlaca = listaUnidades[0]?.placa || 'BHF-821';
    const veh = listaUnidades.find((v) => v.placa === primeraPlaca);
    setFormData({
      placa: primeraPlaca,
      tipoMantenimiento: 'Preventivo 5,000 km',
      kilometraje: veh?.odometroActual ? String(veh.odometroActual) : '15000',
      observaciones: '',
    });
    setModalAbierto(true);
  };

  // Cuando cambia la placa en el selector, sugerir odómetro actual del vehículo
  const handlePlacaChange = (nuevaPlaca) => {
    const veh = listaUnidades.find((v) => v.placa === nuevaPlaca);
    setFormData((prev) => ({
      ...prev,
      placa: nuevaPlaca,
      kilometraje: veh?.odometroActual ? String(veh.odometroActual) : prev.kilometraje,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.placa) return;

    setGuardando(true);
    try {
      await registrarMantenimiento({
        placa: formData.placa,
        tipoMantenimiento: formData.tipoMantenimiento,
        kilometraje: Number(formData.kilometraje) || 0,
        observaciones: formData.observaciones.trim() || 'Servicio de mantenimiento registrado por gerencia.',
      });

      setNotif(`¡Mantenimiento para [${formData.placa}] registrado y sincronizado en tiempo real con Firebase!`);
      setModalAbierto(false);
      setTimeout(() => setNotif(''), 4000);
    } catch (err) {
      console.error('Error al registrar mantenimiento:', err);
    } finally {
      setGuardando(false);
    }
  };

  // Filtrado de la tabla de historial
  const historialFiltrado = useMemo(() => {
    const term = (busqueda || '').toLowerCase().trim();

    return (mantenimientos || []).filter((mnt) => {
      const matchBusqueda =
        !term ||
        (mnt?.placa || '').toLowerCase().includes(term) ||
        (mnt?.tipoMantenimiento || '').toLowerCase().includes(term) ||
        (mnt?.observaciones || '').toLowerCase().includes(term) ||
        (mnt?.registradoPor || '').toLowerCase().includes(term);

      const tipo = (mnt?.tipoMantenimiento || '').toLowerCase();
      const matchTipo =
        filtroTipo === 'todos' ||
        (filtroTipo === 'preventivo' && tipo.includes('preventivo')) ||
        (filtroTipo === 'correctivo' && (tipo.includes('correctivo') || tipo.includes('frenos') || tipo.includes('eléctrico') || tipo.includes('reparación'))) ||
        (filtroTipo === 'aceite' && (tipo.includes('aceite') || tipo.includes('filtros')));

      const matchProp =
        filtroPropietario === 'todos' ||
        (mnt?.propietario || '').toLowerCase() === filtroPropietario.toLowerCase();

      return matchBusqueda && matchTipo && matchProp;
    });
  }, [mantenimientos, busqueda, filtroTipo, filtroPropietario]);

  // KPIs
  const totalMantenimientos = (mantenimientos || []).length;
  const preventivosCount = (mantenimientos || []).filter((m) =>
    (m?.tipoMantenimiento || '').toLowerCase().includes('preventivo')
  ).length;
  const correctivosCount = (mantenimientos || []).filter((m) => {
    const t = (m?.tipoMantenimiento || '').toLowerCase();
    return t.includes('correctivo') || t.includes('frenos') || t.includes('eléctrico');
  }).length;
  const unidadesAtendidas = new Set((mantenimientos || []).map((m) => m?.placa)).size;

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header Ejecutivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            [SUPERVISIÓN TÉCNICA // TALLER CENTRAL HUANCAYO]
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight font-sans flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-[#ff6363]" />
            Gestión de Mantenimiento de Flota
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5 font-mono">
            Control gerencial de servicios preventivos, correctivos y trazabilidad de kilometrajes en 30 unidades.
          </p>
        </div>

        {/* Botón Principal "+ Registrar Mantenimiento" */}
        <button
          onClick={handleAbrirModal}
          className="btn-cockpit-action py-3 px-6 rounded-full flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-pointer self-start sm:self-auto shadow-xl active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ REGISTRAR MANTENIMIENTO</span>
        </button>
      </div>

      {/* Alerta de Notificación */}
      {notif && (
        <div className="p-3.5 rounded-full bg-[#071f16] border border-[#59d499]/40 text-[#59d499] text-xs font-medium flex items-center gap-2 font-mono animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#59d499] shrink-0" />
          <span>{notif}</span>
        </div>
      )}

      {/* KPI Cluster */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cockpit-panel p-5 rounded-3xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">[TOTAL SERVICIOS]</span>
            <FileText className="w-4 h-4 text-[#ff6363]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalMantenimientos}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">Historial acumulado en base</div>
        </div>

        <div className="cockpit-panel p-5 rounded-3xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">[PREVENTIVOS 5K / 10K]</span>
            <ShieldCheck className="w-4 h-4 text-[#59d499]" />
          </div>
          <div className="text-2xl font-bold text-[#59d499] font-mono">{preventivosCount}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">Protocolo de altura Junín</div>
        </div>

        <div className="cockpit-panel p-5 rounded-3xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">[CORRECTIVOS FRENOS]</span>
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-[#f59e0b] font-mono">{correctivosCount}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">Atenciones por desgaste</div>
        </div>

        <div className="cockpit-panel p-5 rounded-3xl border border-white/[0.08] space-y-1">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">[UNIDADES ATENDIDAS]</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{unidadesAtendidas} / {listaUnidades.length}</div>
          <div className="text-[11px] text-[#6a6b6c] font-mono">Cobertura de flota oficial</div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="cockpit-panel p-4 rounded-3xl flex flex-col md:flex-row gap-3 border border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por placa (ej. BHF-821), tipo de mantenimiento u observaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full telemetry-well border border-white/[0.08] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#6a6b6c]" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff6363] font-mono cursor-pointer"
          >
            <option value="todos">Todos los Tipos</option>
            <option value="preventivo">Solo Preventivos</option>
            <option value="correctivo">Solo Correctivos (Frenos/Elect.)</option>
            <option value="aceite">Cambio de Aceite & Filtros</option>
          </select>

          <select
            value={filtroPropietario}
            onChange={(e) => setFiltroPropietario(e.target.value)}
            className="telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff6363] font-mono cursor-pointer"
          >
            <option value="todos">Todos los Propietarios</option>
            <option value="VIP CAR">VIP CAR (UM)</option>
            <option value="PROVEEDOR">PROVEEDOR (UT)</option>
          </select>
        </div>
      </div>

      {/* Tabla en Tiempo Real de Historial de Mantenimientos */}
      <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6363] animate-pulse" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Historial de Mantenimientos Sincronizado en Tiempo Real
            </h2>
          </div>
          <span className="text-[11px] text-[#6a6b6c] font-mono">
            {historialFiltrado.length} registro(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-3.5 px-4">Placa / Unidad</th>
                <th className="py-3.5 px-4">Tipo de Mantenimiento</th>
                <th className="py-3.5 px-4 text-center">Kilometraje Actual</th>
                <th className="py-3.5 px-4">Fecha / Hora</th>
                <th className="py-3.5 px-4">Observaciones Detalladas</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {historialFiltrado.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-[#6a6b6c] font-mono">
                    No se encontraron registros de mantenimiento con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                historialFiltrado.map((item, idx) => {
                  const isPreventivo = (item?.tipoMantenimiento || '').toLowerCase().includes('preventivo');
                  const isCorrectivo = (item?.tipoMantenimiento || '').toLowerCase().includes('correctivo') || (item?.tipoMantenimiento || '').toLowerCase().includes('frenos');

                  return (
                    <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors">
                      {/* Placa y datos de unidad */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full telemetry-well border border-[#ff6363]/40 text-[#ff6363] font-mono font-bold text-xs">
                            {item?.placa || 'N/A'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6a6b6c] font-mono mt-0.5">
                          {item?.propietario || 'VIP CAR'} • {item?.centroCosto || 'Flota Oficial'}
                        </div>
                      </td>

                      {/* Tipo de Mantenimiento */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold inline-flex items-center gap-1 ${
                            isPreventivo
                              ? 'bg-[#59d499]/15 text-[#59d499] border border-[#59d499]/30'
                              : isCorrectivo
                              ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'
                              : 'bg-white/[0.08] text-white border border-white/[0.15]'
                          }`}
                        >
                          <Wrench className="w-3 h-3" />
                          <span>{item?.tipoMantenimiento || 'General'}</span>
                        </span>
                      </td>

                      {/* Kilometraje */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white text-xs">
                        {item?.kilometraje != null ? `${item.kilometraje.toLocaleString()} km` : '-'}
                      </td>

                      {/* Fecha / Hora */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#9c9c9d] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6a6b6c]" />
                          <span>{item?.fechaHora || 'Reciente'}</span>
                        </div>
                      </td>

                      {/* Observaciones detalladas */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                          {item?.observaciones || 'Sin observaciones.'}
                        </p>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#59d499]/15 text-[#59d499] border border-[#59d499]/30">
                          {item?.estado || 'Completado'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL "+ REGISTRAR MANTENIMIENTO" (ESTRICTAMENTE LOS 4 CAMPOS SOLICITADOS) */}
      {/* ========================================================================= */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="cockpit-panel w-full max-w-xl rounded-3xl border border-white/[0.15] shadow-2xl overflow-hidden bg-[#0a0d14]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#ff6363]/15 border border-[#ff6363]/40 text-[#ff6363] flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Registrar Mantenimiento de Flota
                  </h2>
                  <p className="text-[11px] text-[#6a6b6c] font-mono">
                    Formulario oficial gerencial con sincronización en tiempo real
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-1.5 rounded-full hover:bg-white/[0.08] text-[#9c9c9d] hover:text-white cursor-pointer transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* CAMPO 1: Placa (lista desplegable con las 30 unidades) */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 font-mono uppercase tracking-wider">
                  01 // Placa de la Unidad (30 Equipos) *
                </label>
                <select
                  required
                  value={formData.placa}
                  onChange={(e) => handlePlacaChange(e.target.value)}
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff6363] cursor-pointer"
                >
                  {listaUnidades.map((u, i) => (
                    <option key={u.placa} value={u.placa} className="bg-[#0c0e12] text-white">
                      {i + 1}. {u.placa} | {u.tipo} | {u.propietario} | {u.centroCosto} ({u.odometroActual.toLocaleString()} km)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#6a6b6c] font-mono mt-1 block">
                  Selecciona una de las 30 unidades oficiales de VIP CAR y Proveedores.
                </span>
              </div>

              {/* CAMPO 2: Tipo de Mantenimiento */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 font-mono uppercase tracking-wider">
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

              {/* CAMPO 3: Kilometraje actual */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 font-mono uppercase tracking-wider">
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
              </div>

              {/* CAMPO 4: Observaciones detalladas */}
              <div>
                <label className="block text-[11px] font-bold text-white mb-1.5 font-mono uppercase tracking-wider">
                  04 // Observaciones Detalladas *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Detalle técnico de trabajos realizados, repuestos sustituidos (marca, código), estado de neumáticos, observaciones para garita minera..."
                  className="w-full telemetry-well border border-white/[0.1] rounded-2xl p-3 text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] font-sans"
                />
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-full telemetry-well text-xs font-mono text-[#9c9c9d] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="btn-cockpit-action px-6 py-2.5 rounded-full text-xs font-mono font-bold text-black cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {guardando ? 'Guardando en Firebase...' : 'GUARDAR MANTENIMIENTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
