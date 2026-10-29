import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import { useAuth } from '../../context/AuthContext';
import {
  History,
  Search,
  Filter,
  MapPin,
  ExternalLink,
  Trash2,
  Inbox,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Bitacora() {
  const { bitacora, limpiarBitacora } = useFleet();
  const { isGerente, user } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [limpiando, setLimpiando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState(null);

  // El botón 'Limpiar Bitácora' solo debe ser visible para usuarios con rol 'Gerente'
  const userIsGerente = isGerente || user?.role === 'GERENTE';

  const handleLimpiarBitacora = async () => {
    if (!userIsGerente) return;

    // Alerta de confirmación previa requerida
    const confirmado = window.confirm('¿Seguro que deseas borrar todo el historial?');
    if (!confirmado) return;

    setLimpiando(true);
    try {
      await limpiarBitacora();
      setMensajeEstado({
        tipo: 'exito',
        texto: 'La bitácora de conductores ha sido vaciada exitosamente.'
      });
      setTimeout(() => setMensajeEstado(null), 4000);
    } catch (err) {
      console.error('Error al vaciar la bitácora:', err);
      setMensajeEstado({
        tipo: 'error',
        texto: 'Hubo un inconveniente al vaciar la bitácora. Inténtalo de nuevo.'
      });
    } finally {
      setLimpiando(false);
    }
  };

  const filtrados = (bitacora || []).filter((item) => {
    const term = busqueda.toLowerCase().trim();
    const matchesBusqueda =
      !term ||
      (item.conductor || item.operador || '').toLowerCase().includes(term) ||
      (item.placa || '').toLowerCase().includes(term) ||
      (item.tipoRegistro || item.tipoEvento || '').toLowerCase().includes(term) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(term)) ||
      (item.observaciones && item.observaciones.toLowerCase().includes(term));

    const tipo = (item.tipoEvento || '').trim();
    const reg = (item.tipoRegistro || '').toLowerCase();

    const matchesTipo =
      filtroTipo === 'todos' ||
      (filtroTipo === 'Check-in' && (tipo === 'Check-in' || reg.includes('check-in'))) ||
      (filtroTipo === 'Check-out' && (tipo === 'Check-out' || reg.includes('check-out'))) ||
      (filtroTipo === 'SOS' && (
        tipo === 'SOS' ||
        tipo === 'Avería' ||
        tipo === 'Averia' ||
        reg.includes('sos') ||
        reg.includes('avería') ||
        reg.includes('averia') ||
        reg.includes('emergencia') ||
        item.estado === 'Alerta'
      ));

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

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Botón superior alternativo de Limpiar Bitácora para Gerente */}
          {userIsGerente && (
            <button
              type="button"
              onClick={handleLimpiarBitacora}
              disabled={limpiando || (bitacora || []).length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-bold text-[#ff6363] hover:text-white bg-[#ff6363]/10 hover:bg-[#ff6363]/25 border border-[#ff6363]/30 hover:border-[#ff6363]/60 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-98"
              title="Vaciar todos los registros de la bitácora (Solo Gerente)"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#ff6363]" />
              <span>{limpiando ? 'Vaciando...' : 'Limpiar Bitácora'}</span>
            </button>
          )}

          <div className="cockpit-panel px-4 py-2 rounded-full text-center border border-white/[0.08]">
            <div className="text-[10px] uppercase font-mono text-[#6a6b6c]">[SYS // EVENTOS]</div>
            <div className="text-base font-bold text-white font-mono">{(bitacora || []).length}</div>
          </div>
        </div>
      </div>

      {/* Banner de Notificación de Estado */}
      {mensajeEstado && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in ${
            mensajeEstado.tipo === 'exito'
              ? 'bg-[#071f16] border border-[#59d499]/40 text-[#59d499]'
              : 'bg-[#2d0e14] border border-[#ff6363]/40 text-[#ff6363]'
          }`}
        >
          {mensajeEstado.tipo === 'exito' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{mensajeEstado.texto}</span>
        </div>
      )}

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
            <option value="SOS">Señales SOS / Averías</option>
          </select>
        </div>
      </div>

      {/* Tabla Bitácora Cockpit */}
      <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
        {/* Barra superior de la tabla con botón de acción para Gerente */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#07080a]/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#59d499] animate-pulse" />
            <span className="text-xs font-mono font-medium text-white">Eventos de Operación en Turno</span>
            <span className="text-[10px] font-mono text-[#6a6b6c] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {filtrados.length} {filtrados.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Botón Limpiar Bitácora - Visible exclusivamente para rol Gerente */}
          {userIsGerente && (
            <button
              type="button"
              onClick={handleLimpiarBitacora}
              disabled={limpiando || (bitacora || []).length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-[#ff6363] hover:text-white bg-[#ff6363]/10 hover:bg-[#ff6363]/25 border border-[#ff6363]/40 hover:border-[#ff6363]/70 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-auto shadow-xs active:scale-98"
              title="Vaciar todos los registros de la bitácora (Exclusivo Gerente)"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#ff6363]" />
              <span>{limpiando ? 'Vaciando...' : 'Limpiar Bitácora'}</span>
            </button>
          )}
        </div>

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
                <th className="py-3.5 px-4">Ubicación GPS</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {(!filtrados || filtrados.length === 0) ? (
                /* Fila corporativa de tabla vacía sin colapsar el diseño */
                <tr>
                  <td colSpan={8} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-[#111214] border border-white/[0.08] flex items-center justify-center text-[#6a6b6c] shadow-inner">
                        <Inbox className="w-6 h-6 text-[#6a6b6c]" />
                      </div>
                      <p className="text-sm font-medium text-white font-sans">
                        No hay eventos registrados en este turno
                      </p>
                      <p className="text-xs text-[#6a6b6c] font-mono leading-relaxed">
                        La bitácora se encuentra limpia. Los nuevos check-ins, check-outs y señales satelitales aparecerán aquí en tiempo real.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtrados.map((log) => {
                  const lat = log.latitud ?? log.ubicacion?.latitud;
                  const lng = log.longitud ?? log.ubicacion?.longitud;
                  const hasCoords = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#6a6b6c]">
                        {log.fechaHora}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-white">{log.operador || log.conductor}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-white px-2.5 py-0.5 rounded-full telemetry-well border border-white/[0.1]">
                          {log.placa}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.tipoEvento === 'SOS' || log.tipoRegistro?.includes('SOS')
                              ? 'bg-[#ff6363]/15 text-[#ff6363] border-[#ff6363]/40'
                              : log.tipoEvento === 'Avería' || log.tipoRegistro?.includes('Avería')
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                              : 'bg-white/[0.05] text-slate-300 border-white/10'
                          }`}
                        >
                          {log.tipoEvento || log.tipoRegistro}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {log?.odometro?.toLocaleString?.() || log?.odometro || 0} km
                      </td>

                      <td className="py-3.5 px-4 text-[#9c9c9d] text-[11px] max-w-xs truncate">
                        {log.descripcion || log.observaciones || log.checklistEstado || log.proyecto || 'Sin observaciones'}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {hasCoords ? (
                          <a
                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                            title="Abrir en Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{Number(lat).toFixed(3)}°, {Number(lng).toFixed(3)}°</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[#6a6b6c]">{log.proyecto || '—'}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            log.estado === 'Alerta' || log.tipoEvento === 'SOS' || log.tipoEvento === 'Avería'
                              ? 'bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/40'
                              : 'bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/35'
                          }`}
                        >
                          {log.estado || 'OK'}
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
    </div>
  );
}
