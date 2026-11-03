import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Car,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle,
  Building,
  Briefcase,
  Layers,
  MapPin,
  Tag
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function GestionFlota() {
  const {
    vehicles,
    servicios,
    agregarVehiculo,
    eliminarVehiculo,
    agregarServicio,
    eliminarServicio
  } = useFleet();

  // Vista activa: 'unidades' o 'servicios'
  const [vistaActiva, setVistaActiva] = useState('unidades');
  const [busqueda, setBusqueda] = useState('');
  const [alerta, setAlerta] = useState('');

  // Modales
  const [modalUnidadAbierto, setModalUnidadAbierto] = useState(false);
  const [modalServicioAbierto, setModalServicioAbierto] = useState(false);

  // Formulario Nueva Unidad: Tipo de Vehículo (Combi, Camioneta, etc.) y Placa
  const [unidadForm, setUnidadForm] = useState({
    tipo: 'Camioneta',
    tipoPersonalizado: '',
    placa: '',
    proyecto: '',
  });

  // Formulario Nuevo Servicio/Proyecto: Nombre de la empresa o ruta
  const [servicioForm, setServicioForm] = useState({
    nombreEmpresaRuta: '',
    tipoServicio: 'Transporte de Personal',
    sede: 'Huancayo / Junín',
  });

  // Filtros de búsqueda
  const term = (busqueda || '').toLowerCase().trim();

  const unidadesFiltradas = (vehicles || []).filter(
    (v) =>
      !term ||
      v?.placa?.toLowerCase()?.includes(term) ||
      v?.modelo?.toLowerCase()?.includes(term) ||
      v?.marca?.toLowerCase()?.includes(term) ||
      v?.tipo?.toLowerCase()?.includes(term) ||
      v?.propietario?.toLowerCase()?.includes(term) ||
      v?.centroCosto?.toLowerCase()?.includes(term) ||
      v?.empresaAsignada?.toLowerCase()?.includes(term) ||
      v?.conductorActual?.toLowerCase()?.includes(term)
  );

  const serviciosFiltrados = (servicios || []).filter(
    (s) =>
      !term ||
      s?.cliente?.toLowerCase()?.includes(term) ||
      s?.servicio?.toLowerCase()?.includes(term) ||
      s?.sede?.toLowerCase()?.includes(term) ||
      s?.area?.toLowerCase()?.includes(term) ||
      s?.centroCosto?.toLowerCase()?.includes(term)
  );

  // Guardar Nueva Unidad
  const handleGuardarUnidad = async (e) => {
    e.preventDefault();
    if (!unidadForm.placa.trim()) return;

    const placaLimpia = unidadForm.placa.trim().toUpperCase();
    const tipoFinal = unidadForm.tipo === 'Otro' && unidadForm.tipoPersonalizado.trim()
      ? unidadForm.tipoPersonalizado.trim()
      : unidadForm.tipo;

    // Mapear marca y modelo acorde al tipo seleccionado
    let marca = 'Toyota';
    let modelo = 'Hilux 4x4 SRV Minera';
    let traccion = '4x4';
    let capacidad = '1,000 kg (5 Asientos)';

    if (tipoFinal === 'Combi') {
      marca = 'Toyota';
      modelo = 'HiAce Minibús Pasajeros';
      traccion = '4x2';
      capacidad = '14 Pasajeros';
    } else if (tipoFinal === 'Minivan') {
      marca = 'Hyundai';
      modelo = 'H-1 Minivan';
      traccion = '4x2';
      capacidad = '8 Pasajeros';
    } else if (tipoFinal === 'Bus') {
      marca = 'Mercedes-Benz';
      modelo = 'Sprinter Pasajeros';
      traccion = '4x2';
      capacidad = '24 Pasajeros';
    } else if (tipoFinal === 'Camioneta Cerrada') {
      marca = 'Toyota';
      modelo = 'Fortuner 4x4 D-4D';
      traccion = '4x4';
      capacidad = '7 Asientos';
    }

    const nuevaUnidad = {
      placa: placaLimpia,
      tipo: tipoFinal,
      marca,
      modelo,
      anio: 2024,
      traccion,
      capacidadCarga: capacidad,
      motor: '2.8L Turbo Diesel',
      odometroActual: 0,
      ultimoMantenimiento: 0,
      intervaloMantenimiento: 5000,
      estadoOperativo: 'Disponible',
      empresaAsignada: unidadForm.proyecto || 'Base Huancayo (Patio Central)',
      conductorActual: 'Por Asignar',
      propietario: 'VIP CAR',
      centroCosto: 'UM-01',
      tarifaDiariaUSD: 110,
      certificaciones: ['Socavón', 'Superficie'],
      equipamiento: ['Pértiga LED', 'Circulina Ámbar', 'Jaula Antivuelco Certificada', 'GPS Satelital'],
    };

    await agregarVehiculo(nuevaUnidad);

    setAlerta(`Unidad [${placaLimpia}] (${tipoFinal}) registrada e incorporada a la flota correctamente.`);
    setModalUnidadAbierto(false);
    setVistaActiva('unidades');
    setUnidadForm({
      tipo: 'Camioneta',
      tipoPersonalizado: '',
      placa: '',
      proyecto: '',
    });

    setTimeout(() => setAlerta(''), 4000);
  };

  // Guardar Nuevo Servicio/Proyecto
  const handleGuardarServicio = async (e) => {
    e.preventDefault();
    if (!servicioForm.nombreEmpresaRuta.trim()) return;

    const nombreLimpio = servicioForm.nombreEmpresaRuta.trim().toUpperCase();

    const nuevoServicio = {
      cliente: nombreLimpio,
      servicio: servicioForm.tipoServicio.trim().toUpperCase() || 'TRANSPORTE CORPORATIVO',
      area: 'OPERACIONES',
      sede: servicioForm.sede.trim().toUpperCase() || 'HUANCAYO / REGIONAL',
      centroCosto: `TP-${Math.floor(10 + Math.random() * 89)}`,
      activo: true,
      fechaRegistro: new Date().toLocaleDateString('es-PE'),
    };

    await agregarServicio(nuevoServicio);

    setAlerta(`Servicio / Proyecto [${nombreLimpio}] registrado con éxito en la base de datos.`);
    setModalServicioAbierto(false);
    setVistaActiva('servicios');
    setServicioForm({
      nombreEmpresaRuta: '',
      tipoServicio: 'Transporte de Personal',
      sede: 'Huancayo / Junín',
    });

    setTimeout(() => setAlerta(''), 4000);
  };

  const handleEliminarUnidad = (id, placa) => {
    if (confirm(`¿Confirma dar de baja la unidad ${placa}?`)) {
      eliminarVehiculo(id);
      setAlerta(`Unidad ${placa} dada de baja.`);
      setTimeout(() => setAlerta(''), 3000);
    }
  };

  const handleEliminarServicio = (id, cliente) => {
    if (confirm(`¿Confirma retirar el servicio / proyecto ${cliente}?`)) {
      eliminarServicio(id);
      setAlerta(`Servicio ${cliente} retirado.`);
      setTimeout(() => setAlerta(''), 3000);
    }
  };

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header con Botones de Acción Rápida para Gerencia */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            [SYS // GESTIÓN GERENCIAL DE FLOTA Y PROYECTOS]
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white flex items-center gap-2.5 font-sans tracking-tight">
            <Car className="w-6 h-6 text-[#ff6363]" />
            Gestión y Control de Flota
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5 font-mono">
            Registro simplificado de unidades, proyectos mineros y control de telemetría operativa.
          </p>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setModalUnidadAbierto(true)}
            className="btn-cockpit-action py-2.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff6363]/20"
            title="Registrar nueva unidad (Combi, Camioneta, etc.) y placa"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Unidad</span>
          </button>

          <button
            onClick={() => setModalServicioAbierto(true)}
            className="py-2.5 px-4 sm:px-5 rounded-full bg-[#121c2e] hover:bg-[#1a2942] border border-sky-500/40 text-sky-300 flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-sky-950/40"
            title="Registrar nuevo servicio o proyecto minero / ruta"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-sky-400" />
            <span>Nuevo Servicio/Proyecto</span>
          </button>
        </div>
      </div>

      {/* Alerta de Éxito Reactiva */}
      {alerta && (
        <div className="p-3.5 rounded-full bg-[#071f16] border border-[#59d499]/40 text-[#59d499] text-xs font-medium flex items-center gap-2 font-mono shadow-md animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-[#59d499] shrink-0" />
          <span>{alerta}</span>
        </div>
      )}

      {/* Pestañas de Vista Cockpit: Unidades vs Servicios */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVistaActiva('unidades')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              vistaActiva === 'unidades'
                ? 'bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 shadow-xs'
                : 'text-[#6a6b6c] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Unidades de Flota ({vehicles?.length || 0})</span>
          </button>

          <button
            onClick={() => setVistaActiva('servicios')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              vistaActiva === 'servicios'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-xs'
                : 'text-[#6a6b6c] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Servicios y Proyectos ({servicios?.length || 0})</span>
          </button>
        </div>

        {/* Buscador Telemetry */}
        <div className="px-4 py-2 rounded-full telemetry-well border border-white/[0.08] flex items-center gap-2.5 sm:w-80">
          <Search className="w-4 h-4 text-[#6a6b6c]" />
          <input
            type="text"
            placeholder={
              vistaActiva === 'unidades'
                ? 'Buscar por placa, tipo, proyecto...'
                : 'Buscar por empresa, ruta, sede...'
            }
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-[#6a6b6c] focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Vista 1: Tabla de Unidades de Flota */}
      {vistaActiva === 'unidades' && (
        <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="py-3.5 px-4">Placa / Modelo / Tipo</th>
                  <th className="py-3.5 px-4">Proyecto / Operación</th>
                  <th className="py-3.5 px-4">Odómetro</th>
                  <th className="py-3.5 px-4">Semáforo</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {unidadesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6a6b6c] font-mono text-xs">
                      No se encontraron unidades registradas con ese criterio.
                    </td>
                  </tr>
                ) : (
                  unidadesFiltradas.map((veh) => (
                    <tr key={veh?.id || veh?.placa} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white text-xs flex items-center gap-2">
                          <span>{veh?.marca || 'Toyota'} {veh?.modelo || 'Hilux'}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                            veh?.tipo === 'Combi'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : veh?.tipo === 'Bus'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : veh?.tipo === 'Minivan'
                              ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                              : 'bg-white/5 text-[#9c9c9d] border-white/10'
                          }`}>
                            {veh?.tipo || 'Camioneta'}
                          </span>
                        </div>
                        <div className="font-mono text-[#6a6b6c] text-[11px] mt-1 flex items-center gap-1.5 flex-wrap">
                          <strong className="text-[#ff6363] text-xs font-bold">{veh?.placa}</strong>
                          <span>•</span>
                          <span>{veh?.traccion || '4x4'}</span>
                          {veh?.centroCosto && (
                            <>
                              <span>•</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-white/10 text-slate-300 font-mono">
                                CC: {veh.centroCosto}
                              </span>
                            </>
                          )}
                          {veh?.propietario && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-sm font-mono font-bold ${
                              veh.propietario === 'VIP CAR' ? 'text-[#ff6363] bg-[#ff6363]/10' : 'text-sky-300 bg-sky-950/40'
                            }`}>
                              {veh.propietario}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium flex items-center gap-1.5 text-xs">
                          <Building className="w-3.5 h-3.5 text-[#6a6b6c]" />
                          <span>{veh?.empresaAsignada || 'Base Huancayo (Patio Central)'}</span>
                        </div>
                        <div className="text-[10px] text-[#6a6b6c] font-mono mt-0.5">
                          Chofer: {veh?.conductorActual || 'No asignado'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {veh?.odometroActual?.toLocaleString?.() || veh?.odometroActual || 0} km
                      </td>

                      <td className="py-3.5 px-4">
                        <SemaforoBadge odometro={veh?.odometroActual || 0} compact={true} />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            veh?.estadoOperativo === 'En Servicio'
                              ? 'bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30'
                              : veh?.estadoOperativo === 'Disponible'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                              : 'bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/40'
                          }`}
                        >
                          {veh?.estadoOperativo || 'Disponible'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleEliminarUnidad(veh?.id, veh?.placa)}
                          className="p-1.5 rounded-full hover:bg-[#ff6363]/15 text-[#6a6b6c] hover:text-[#ff6363] transition-colors cursor-pointer"
                          title="Dar de baja de la flota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista 2: Tabla de Servicios y Proyectos */}
      {vistaActiva === 'servicios' && (
        <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="py-3.5 px-4">Empresa / Proyecto / Ruta</th>
                  <th className="py-3.5 px-4">Servicio / Área</th>
                  <th className="py-3.5 px-4">Sede Operativa</th>
                  <th className="py-3.5 px-4">Centro de Costo</th>
                  <th className="py-3.5 px-4">Unidades Asignadas</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {serviciosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6a6b6c] font-mono text-xs">
                      No hay proyectos o servicios registrados.
                    </td>
                  </tr>
                ) : (
                  serviciosFiltrados.map((srv) => {
                    const unidadesAsignadasCount = (vehicles || []).filter(
                      (v) =>
                        v?.empresaAsignada?.toLowerCase()?.includes(srv.cliente.toLowerCase()) ||
                        (srv.servicio && srv.servicio !== '-' && v?.empresaAsignada?.toLowerCase()?.includes(srv.servicio.toLowerCase()))
                    ).length;

                    return (
                      <tr key={srv.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{srv.cliente}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[#9c9c9d] text-xs">
                            {srv.servicio && srv.servicio !== '-' ? srv.servicio : 'General'} • {srv.area || 'Operaciones'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-[#9c9c9d]">
                            <MapPin className="w-3.5 h-3.5 text-[#6a6b6c]" />
                            <span>{srv.sede || 'HUANCAYO'}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white font-bold text-[11px]">
                            {srv.centroCosto || 'CC-01'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            unidadesAsignadasCount > 0
                              ? 'bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30'
                              : 'bg-white/5 text-[#6a6b6c] border border-white/10'
                          }`}>
                            {unidadesAsignadasCount} unidad(es)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleEliminarServicio(srv.id, srv.cliente)}
                            className="p-1.5 rounded-full hover:bg-[#ff6363]/15 text-[#6a6b6c] hover:text-[#ff6363] transition-colors cursor-pointer"
                            title="Eliminar servicio o proyecto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: NUEVA UNIDAD (Tipo de Vehículo y Placa)
          ======================================================== */}
      {modalUnidadAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="cockpit-panel rounded-3xl max-w-md w-full p-6 space-y-4 border border-white/[0.1] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#2d0e14] border border-[#ff6363]/30 text-[#ff6363]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Nueva Unidad
                  </h3>
                  <p className="text-[10px] text-[#6a6b6c] font-mono">
                    Registro de unidad en flota corporativa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalUnidadAbierto(false)}
                className="p-1.5 rounded-full text-[#6a6b6c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardarUnidad} className="space-y-4 text-xs font-mono">
              {/* Campo 1: Tipo de Vehículo */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Tipo de Vehículo <span className="text-[#ff6363]">*</span>
                </label>
                <select
                  value={unidadForm.tipo}
                  onChange={(e) => setUnidadForm({ ...unidadForm, tipo: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#ff6363] bg-[#0c0f17]"
                  required
                >
                  <option value="Camioneta">Camioneta (Pick-up 4x4)</option>
                  <option value="Combi">Combi (Pasajeros / Minibús)</option>
                  <option value="Minivan">Minivan (H-1 / VAN)</option>
                  <option value="Bus">Bus / Coaster Interurbano</option>
                  <option value="Camioneta Cerrada">Camioneta Cerrada (SUV 4x4)</option>
                  <option value="Otro">Otro Tipo de Vehículo...</option>
                </select>

                {unidadForm.tipo === 'Otro' && (
                  <input
                    type="text"
                    required
                    placeholder="Escriba el tipo (ej. Furgoneta, Camión)"
                    value={unidadForm.tipoPersonalizado}
                    onChange={(e) => setUnidadForm({ ...unidadForm, tipoPersonalizado: e.target.value })}
                    className="mt-2 w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#ff6363]"
                  />
                )}
              </div>

              {/* Campo 2: Placa */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Placa <span className="text-[#ff6363]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. W4E-892 o BHF-821"
                  value={unidadForm.placa}
                  onChange={(e) => setUnidadForm({ ...unidadForm, placa: e.target.value.toUpperCase() })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white uppercase font-mono text-sm tracking-wider focus:outline-none focus:border-[#ff6363] placeholder-[#4d4f53]"
                />
                <p className="text-[10px] text-[#6a6b6c] mt-1 font-mono">
                  Formato de 6 caracteres alfanuméricos con guion.
                </p>
              </div>

              {/* Proyecto / Operación Asignada */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Proyecto / Empresa Asignada
                </label>
                <select
                  value={unidadForm.proyecto}
                  onChange={(e) => setUnidadForm({ ...unidadForm, proyecto: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#ff6363] bg-[#0c0f17]"
                >
                  <option value="Base Huancayo (Patio Central)">Base Huancayo (Patio Central)</option>
                  {(servicios || []).map((s) => (
                    <option key={s.id} value={`${s.cliente}${s.sede ? ` (${s.sede})` : ''}`}>
                      {s.cliente} {s.sede ? `• ${s.sede}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones del Modal */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalUnidadAbierto(false)}
                  className="btn-cockpit-secondary px-4 py-2 rounded-full text-xs font-mono cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-cockpit-action px-6 py-2 rounded-full text-xs font-mono font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: NUEVO SERVICIO / PROYECTO (Empresa o Ruta)
          ======================================================== */}
      {modalServicioAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="cockpit-panel rounded-3xl max-w-md w-full p-6 space-y-4 border border-white/[0.1] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-400">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Nuevo Servicio/Proyecto
                  </h3>
                  <p className="text-[10px] text-[#6a6b6c] font-mono">
                    Alta de proyecto minero, empresa o ruta
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalServicioAbierto(false)}
                className="p-1.5 rounded-full text-[#6a6b6c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardarServicio} className="space-y-4 text-xs font-mono">
              {/* Campo: Nombre de la Empresa o Ruta */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Nombre de la Empresa o Ruta <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Minera Chinalco - Toromocho o Ruta Huancayo - Lima"
                  value={servicioForm.nombreEmpresaRuta}
                  onChange={(e) => setServicioForm({ ...servicioForm, nombreEmpresaRuta: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 placeholder-[#4d4f53]"
                  autoFocus
                />
              </div>

              {/* Tipo de Servicio */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Tipo de Servicio / Área
                </label>
                <input
                  type="text"
                  placeholder="Ej. Transporte de Personal Minero, Ruta Expresa, etc."
                  value={servicioForm.tipoServicio}
                  onChange={(e) => setServicioForm({ ...servicioForm, tipoServicio: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 placeholder-[#4d4f53]"
                />
              </div>

              {/* Sede Operativa */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9c9c9d] mb-1.5 font-bold">
                  Sede Operativa / Destino
                </label>
                <input
                  type="text"
                  placeholder="Ej. Toromocho, Cobriza, Huancayo, Lima"
                  value={servicioForm.sede}
                  onChange={(e) => setServicioForm({ ...servicioForm, sede: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.1] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 placeholder-[#4d4f53]"
                />
              </div>

              {/* Botones del Modal */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalServicioAbierto(false)}
                  className="btn-cockpit-secondary px-4 py-2 rounded-full text-xs font-mono cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-sky-900/40"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
