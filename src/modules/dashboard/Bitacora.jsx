import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  History,
  Search,
  Filter
} from 'lucide-react';

export default function Bitacora() {
  const { bitacora } = useFleet();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const filtrados = bitacora.filter((item) => {
    const term = busqueda.toLowerCase().trim();
    const matchesBusqueda =
      !term ||
      item.conductor.toLowerCase().includes(term) ||
      item.placa.toLowerCase().includes(term) ||
      item.tipoRegistro.toLowerCase().includes(term) ||
      (item.observaciones && item.observaciones.toLowerCase().includes(term));

    const matchesTipo =
      filtroTipo === 'todos' ||
      item.tipoRegistro.toLowerCase().includes(filtroTipo.toLowerCase());

    return matchesBusqueda && matchesTipo;
  });

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            TRAZABILIDAD DE ODÓMETROS & OPERACIONES
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white flex items-center gap-2 font-sans">
            <History className="w-6 h-6 text-[#ff6363]" />
            Bitácora Histórica de Conducción
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5">
            Registro cronológico inmutable de qué conductor operó cada camioneta, kilometrajes y revisiones técnicas.
          </p>
        </div>

        <div className="cockpit-panel px-4 py-2 rounded-full text-center self-start sm:self-auto border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono text-[#6a6b6c]">[SYS // EVENTOS]</div>
          <div className="text-base font-bold text-white font-mono">{bitacora.length}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="cockpit-panel p-4 rounded-3xl flex flex-col sm:flex-row gap-3 border border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por chofer, placa (ej. W4E-892) o tipo de evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full telemetry-well border border-white/[0.08] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363] transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#6a6b6c]" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="telemetry-well border border-white/[0.08] rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-[#ff6363] font-mono cursor-pointer"
          >
            <option value="todos">Todos los eventos</option>
            <option value="Check-in">Solo Check-in (Ingresos)</option>
            <option value="Check-out">Solo Check-out (Salidas)</option>
            <option value="EMERGENCIA">Alertas de Emergencia SOS</option>
          </select>
        </div>
      </div>

      {/* Tabla Bitácora Cockpit */}
      <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Conductor Responsable</th>
                <th className="py-3.5 px-4">Placa</th>
                <th className="py-3.5 px-4">Tipo de Evento</th>
                <th className="py-3.5 px-4">Odómetro</th>
                <th className="py-3.5 px-4">Detalle / Novedades</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtrados.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6a6b6c]">
                    {log.fechaHora}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-white">{log.conductor}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-white px-2.5 py-0.5 rounded-full telemetry-well border border-white/[0.1]">
                      {log.placa}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-white font-mono">
                    {log.tipoRegistro}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {log.odometro?.toLocaleString()} km
                  </td>

                  <td className="py-3.5 px-4 text-[#9c9c9d] text-[11px]">
                    {log.proyecto || log.observaciones || log.checklistEstado || 'Sin observaciones'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        log.estado === 'Alerta' || log.tipoRegistro?.includes('Avería')
                          ? 'bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/40'
                          : 'bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/35'
                      }`}
                    >
                      {log.estado || 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
