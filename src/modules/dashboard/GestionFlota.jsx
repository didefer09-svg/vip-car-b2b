import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  Car,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle,
  Building
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';

export default function GestionFlota() {
  const { vehicles, agregarVehiculo, eliminarVehiculo } = useFleet();
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [alerta, setAlerta] = useState('');

  const [nuevo, setNuevo] = useState({
    placa: '',
    marca: 'Toyota',
    modelo: 'Hilux 4x4 SRV Minera',
    anio: 2024,
    tipo: 'Pickup 4x4',
    traccion: '4x4',
    motor: '2.8L Turbo Diesel',
    capacidadCarga: '1,000 kg',
    certificaciones: ['Socavón', 'Superficie'],
    equipamiento: ['Pértiga LED', 'Circulina Ámbar', 'Jaula Antivuelco Certificada', 'Botiquín Minero', 'Tacos de Seguridad', 'Sensor GPS'],
    odometroActual: 0,
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Huancayo (Patio Central)',
    conductorActual: '',
    tarifaDiariaUSD: 110,
    imagen: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
  });

  const term = (busqueda || '').toLowerCase().trim();
  const filtrados = (vehicles || []).filter(
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

  const handleCrear = (e) => {
    e.preventDefault();
    if (!nuevo.placa) return;

    agregarVehiculo(nuevo);
    setAlerta(`Unidad con placa [${nuevo.placa.toUpperCase()}] incorporada a la flota.`);
    setModalAbierto(false);
    setNuevo({
      placa: '',
      marca: 'Toyota',
      modelo: 'Hilux 4x4 SRV Minera',
      anio: 2024,
      tipo: 'Pickup 4x4',
      traccion: '4x4',
      motor: '2.8L Turbo Diesel',
      capacidadCarga: '1,000 kg',
      certificaciones: ['Socavón', 'Superficie'],
      equipamiento: ['Pértiga LED', 'Circulina Ámbar', 'Jaula Antivuelco Certificada', 'Botiquín Minero', 'Tacos de Seguridad', 'Sensor GPS'],
      odometroActual: 0,
      estadoOperativo: 'Disponible',
      empresaAsignada: 'Base Huancayo (Patio Central)',
      conductorActual: '',
      tarifaDiariaUSD: 110,
      imagen: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    });
    setTimeout(() => setAlerta(''), 3000);
  };

  const handleEliminar = (id, placa) => {
    if (confirm(`¿Confirma dar de baja la unidad ${placa}?`)) {
      eliminarVehiculo(id);
      setAlerta(`Unidad ${placa} removida.`);
      setTimeout(() => setAlerta(''), 3000);
    }
  };

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            [DISP // INVENTARIO HOMOLOGADO MTC]
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white flex items-center gap-2 font-sans tracking-tight">
            <Car className="w-6 h-6 text-[#ff6363]" />
            Gestión y Control de Flota
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5 font-mono">
            Inventario, asignación a proyectos mineros y control de telemetría de unidades 4x4.
          </p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="btn-cockpit-action py-2.5 px-5 rounded-full flex items-center justify-center gap-2 text-xs font-mono font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ REGISTRAR UNIDAD</span>
        </button>
      </div>

      {alerta && (
        <div className="p-3.5 rounded-full bg-[#071f16] border border-[#59d499]/40 text-[#59d499] text-xs font-medium flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-[#59d499] shrink-0" />
          <span>{alerta}</span>
        </div>
      )}

      {/* Buscador Telemetry */}
      <div className="px-4 py-2.5 rounded-full telemetry-well border border-white/[0.08] flex items-center gap-2.5">
        <Search className="w-4 h-4 text-[#6a6b6c]" />
        <input
          type="text"
          placeholder="Buscar por placa completa, modelo, proyecto / operación o empresa asignada..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-[#6a6b6c] focus:outline-none font-mono"
        />
      </div>

      {/* Tabla de Flota Cockpit */}
      <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-3.5 px-4">Placa / Modelo</th>
                <th className="py-3.5 px-4">Proyecto / Operación</th>
                <th className="py-3.5 px-4">Odómetro</th>
                <th className="py-3.5 px-4">Semáforo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(filtrados || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6a6b6c] font-mono text-xs">
                    No se encontraron unidades que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                (filtrados || []).map((veh) => (
                  <tr key={veh?.id || veh?.placa} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white text-xs">
                        {veh?.marca || 'Toyota'} {veh?.modelo || 'Hilux'}
                      </div>
                      <div className="font-mono text-[#6a6b6c] text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <strong className="text-[#ff6363]">{veh?.placa}</strong>
                        <span>•</span>
                        <span>{veh?.traccion || '4x4'}</span>
                        <span>•</span>
                        <span>{veh?.tipo || 'Unidad'}</span>
                        {veh?.centroCosto && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-white/10 text-slate-300 font-mono">
                            CC: {veh.centroCosto}
                          </span>
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
                        <span>{veh?.empresaAsignada || 'Flota Central Huancayo'}</span>
                      </div>
                      <div className="text-[10px] text-[#6a6b6c] font-mono">
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
                        onClick={() => handleEliminar(veh?.id, veh?.placa)}
                        className="p-1.5 rounded-full hover:bg-[#ff6363]/15 text-[#6a6b6c] hover:text-[#ff6363] transition-colors cursor-pointer"
                        title="Dar de baja de flota"
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

      {/* Modal Agregar Unidad */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="cockpit-panel rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-white/[0.1] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-medium text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-[#ff6363]" />
                Registrar Unidad 4x4 en Flota
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-1.5 rounded-full text-[#6a6b6c] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrear} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6a6b6c] mb-1">
                    Placa Real (Ej. W4E-892)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="W4E-892"
                    value={nuevo.placa}
                    onChange={(e) => setNuevo({ ...nuevo, placa: e.target.value.toUpperCase() })}
                    className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-white uppercase font-mono focus:outline-none focus:border-[#ff6363]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6a6b6c] mb-1">
                    Marca y Modelo
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevo.modelo}
                    onChange={(e) => setNuevo({ ...nuevo, modelo: e.target.value })}
                    className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-white focus:outline-none focus:border-[#ff6363]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6a6b6c] mb-1">
                    Año de Fabricación
                  </label>
                  <input
                    type="number"
                    value={nuevo.anio}
                    onChange={(e) => setNuevo({ ...nuevo, anio: parseInt(e.target.value) || 2024 })}
                    className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-white font-mono focus:outline-none focus:border-[#ff6363]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6a6b6c] mb-1">
                    Odómetro Inicial (km)
                  </label>
                  <input
                    type="number"
                    value={nuevo.odometroActual}
                    onChange={(e) => setNuevo({ ...nuevo, odometroActual: parseInt(e.target.value) || 0 })}
                    className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-white font-mono focus:outline-none focus:border-[#ff6363]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#6a6b6c] mb-1">
                  Proyecto / Obra o Empresa Asignada
                </label>
                <input
                  type="text"
                  value={nuevo.empresaAsignada}
                  onChange={(e) => setNuevo({ ...nuevo, empresaAsignada: e.target.value })}
                  className="w-full telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-white focus:outline-none focus:border-[#ff6363]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="btn-cockpit-secondary px-4 py-2 rounded-full text-xs font-mono cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-cockpit-action px-5 py-2 rounded-full text-xs font-mono font-bold cursor-pointer"
                >
                  Confirmar e Incorporar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
