import React, { useState, useMemo } from 'react';
import {
  AlertOctagon,
  MapPin,
  ExternalLink,
  User,
  Clock,
  Phone,
  Radio,
  CheckCircle2,
  Copy,
  Check,
  X,
  Navigation,
  Car,
  Wrench,
  Maximize2
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

/**
 * Apartado & Modal de Alerta Crítica en Dashboard Cockpit
 * Destinado exclusivamente a las señales SOS y reportes de avería.
 * Filtrado automático desde la colección 'bitacora' cuando tipoEvento es "SOS" o "Avería".
 * Muestra en tiempo real:
 *  - Nombre del operador
 *  - Placa de la unidad
 *  - Fecha y hora exacta
 *  - Descripción de la novedad
 *  - Botón con acceso directo a la ubicación en Google Maps usando las coordenadas
 */
export default function AlertaCriticaCockpit() {
  const { bitacora, emitirAlertaCritica, vehicles } = useFleet();

  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos' | 'SOS' | 'Avería'
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [simulando, setSimulando] = useState(false);

  // 1. Filtrado automático desde la colección bitacora cuando tipoEvento es "SOS" o "Avería"
  const alertasCriticas = useMemo(() => {
    return (bitacora || []).filter((item) => {
      const tipo = (item.tipoEvento || '').trim();
      const tipoReg = (item.tipoRegistro || '').trim().toLowerCase();

      const esSos =
        tipo === 'SOS' ||
        tipoReg.startsWith('sos') ||
        tipoReg.includes('sos ') ||
        tipoReg.includes('emergencia');

      const esAveria =
        tipo === 'Avería' ||
        tipo === 'Averia' ||
        tipoReg.startsWith('avería') ||
        tipoReg.startsWith('averia') ||
        tipoReg.includes('avería') ||
        tipoReg.includes('averia');

      return esSos || esAveria;
    });
  }, [bitacora]);

  // Filtrado de pestañas dentro del panel crítico
  const alertasFiltradas = useMemo(() => {
    if (filtroTipo === 'todos') return alertasCriticas;
    return alertasCriticas.filter((a) => {
      const t = (a.tipoEvento || '').trim();
      const tr = (a.tipoRegistro || '').toLowerCase();
      if (filtroTipo === 'SOS') {
        return t === 'SOS' || tr.includes('sos') || tr.includes('emergencia');
      }
      if (filtroTipo === 'Avería') {
        return t === 'Avería' || t === 'Averia' || tr.includes('avería') || tr.includes('averia');
      }
      return true;
    });
  }, [alertasCriticas, filtroTipo]);

  const totalSos = useMemo(() => {
    return alertasCriticas.filter((a) => {
      const t = (a.tipoEvento || '').trim();
      const tr = (a.tipoRegistro || '').toLowerCase();
      return t === 'SOS' || tr.includes('sos') || tr.includes('emergencia');
    }).length;
  }, [alertasCriticas]);

  const totalAverias = useMemo(() => {
    return alertasCriticas.filter((a) => {
      const t = (a.tipoEvento || '').trim();
      const tr = (a.tipoRegistro || '').toLowerCase();
      return t === 'Avería' || t === 'Averia' || tr.includes('avería') || tr.includes('averia');
    }).length;
  }, [alertasCriticas]);

  const getCoordenadas = (item) => {
    const lat = item.latitud ?? item.ubicacion?.latitud;
    const lng = item.longitud ?? item.ubicacion?.longitud;
    const valido = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
    return {
      lat: valido ? Number(lat) : -11.6083,
      lng: valido ? Number(lng) : -76.1294,
      valido,
    };
  };

  const getGoogleMapsUrl = (item) => {
    const { lat, lng } = getCoordenadas(item);
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  const handleOpenModal = (alert) => {
    setSelectedAlert(alert || alertasCriticas[0]);
    setModalAbierto(true);
  };

  const handleCopiarCoords = (item) => {
    const { lat, lng } = getCoordenadas(item);
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleSimularAlerta = async () => {
    if (simulando || !emitirAlertaCritica) return;
    setSimulando(true);
    try {
      const placasDemo = ['W4E-892', 'W2A-710', 'W5B-441', 'W1T-780'];
      const operadoresDemo = ['Carlos Huamán', 'Marcos Mendoza', 'Jorge Quispe', 'Edgar Cóndor'];
      const tipos = ['SOS', 'Avería'];
      const fallas = [
        'Falla de frenos y bloqueo de rueda posterior en rampa de socavón',
        'Sobrecalentamiento crítico de motor con fuga de refrigerante en Km 132',
        'Neumático reventado e impacto contra berma de seguridad en carretera',
        'Pérdida de tracción 4x4 y caída de presión de aceite de motor',
      ];
      const randomIdx = Math.floor(Math.random() * placasDemo.length);
      const chosenTipo = tipos[Math.floor(Math.random() * tipos.length)];

      await emitirAlertaCritica({
        placa: placasDemo[randomIdx],
        operador: operadoresDemo[randomIdx],
        tipoEvento: chosenTipo,
        novedad: fallas[randomIdx],
        latitud: Number((-11.6083 + (Math.random() - 0.5) * 0.05).toFixed(5)),
        longitud: Number((-76.1294 + (Math.random() - 0.5) * 0.05).toFixed(5)),
        severidad: 'Crítica',
      });
    } finally {
      setSimulando(false);
    }
  };

  return (
    <section className="space-y-3.5">
      {/* Barra de Título y Estado Crítico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0f14] p-4 rounded-3xl border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center shrink-0">
            {alertasCriticas.length > 0 ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-[#ff6363] animate-ping opacity-75" />
                <span className="absolute w-2.5 h-2.5 rounded-full bg-[#ff6363]" />
              </>
            ) : (
              <span className="w-3 h-3 rounded-full bg-[#59d499]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-[#ff6363]" />
                <span>Panel de Alerta Crítica // Señales SOS & Reportes de Avería</span>
              </h2>
              <span className="text-[10px] font-mono text-[#6a6b6c] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                Colección bitacora • Filtrado Automático
              </span>
            </div>
            <p className="text-[11px] text-[#6a6b6c] font-mono mt-0.5">
              Recepción satelital en tiempo real con geolocalización y telemetría de campo
            </p>
          </div>
        </div>

        {/* Acciones Rápidas y Contador de Alertas */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {alertasCriticas.length > 0 && (
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setFiltroTipo('todos')}
                className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                  filtroTipo === 'todos'
                    ? 'bg-[#ff6363] text-black font-bold'
                    : 'text-[#9c9c9d] hover:text-white'
                }`}
              >
                Todos ({alertasCriticas.length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo('SOS')}
                className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                  filtroTipo === 'SOS'
                    ? 'bg-[#ff6363] text-black font-bold'
                    : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                🚨 SOS ({totalSos})
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo('Avería')}
                className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                  filtroTipo === 'Avería'
                    ? 'bg-[#f59e0b] text-black font-bold'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                🔧 Averías ({totalAverias})
              </button>
            </div>
          )}

          {alertasCriticas.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenModal(alertasCriticas[0])}
              className="px-3 py-1.5 rounded-2xl bg-[#ff6363] hover:bg-[#ff4d4d] text-black text-[11px] font-mono font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="Abrir el Modal de Alerta Crítica a pantalla completa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Abrir Modal Crítico</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSimularAlerta}
            disabled={simulando}
            className="px-3 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Genera una señal de prueba SOS o Avería en tiempo real para verificar el flujo"
          >
            <Radio className={`w-3.5 h-3.5 text-[#ff6363] ${simulando ? 'animate-spin' : ''}`} />
            <span>{simulando ? 'Transmitiendo...' : 'Simular Alerta'}</span>
          </button>

          <span
            className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-2xl border ${
              alertasCriticas.length > 0
                ? 'bg-[#2d0e14] text-[#ff6363] border-[#ff6363]/50 animate-pulse'
                : 'bg-[#071f16] text-[#59d499] border-[#59d499]/30'
            }`}
          >
            {alertasCriticas.length > 0
              ? `🚨 ${alertasCriticas.length} ALERTA(S) SOS / AVERÍA`
              : '🟢 0 ALERTAS CRÍTICAS'}
          </span>
        </div>
      </div>

      {/* Grid de Alertas Críticas Filtradas */}
      {alertasCriticas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alertasFiltradas.map((alert) => {
            const { lat, lng, valido } = getCoordenadas(alert);
            const operador = alert.operador || alert.conductor || 'Operador en ruta';
            const placa = alert.placa || 'UNIDAD';
            const fechaHora = alert.fechaHora || (alert.timestamp ? new Date(alert.timestamp).toLocaleString('es-PE') : 'En curso');
            const descripcion = alert.descripcion || alert.observaciones || alert.checklistEstado || alert.tipoRegistro || 'Reporte de emergencia emitido por el operador sin detalles adicionales.';
            const tipo = (alert.tipoEvento || '').trim();
            const esSos = tipo === 'SOS' || (alert.tipoRegistro || '').toLowerCase().includes('sos');
            const vehiculoInfo = vehicles.find((v) => v.placa === placa);

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border-2 transition-all relative overflow-hidden shadow-2xl flex flex-col justify-between ${
                  esSos
                    ? 'bg-[#18080b] border-[#ff6363]/70 hover:border-[#ff6363]'
                    : 'bg-[#181106] border-[#f59e0b]/70 hover:border-[#f59e0b]'
                }`}
              >
                {/* Glow decorativo de fondo */}
                <div
                  className={`absolute -right-16 -top-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 ${
                    esSos ? 'bg-[#ff6363]' : 'bg-[#f59e0b]'
                  }`}
                />

                <div className="space-y-3 relative z-10">
                  {/* Fila Superior: Tipo, Placa, Operador y Hora */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl shrink-0 text-black font-black flex items-center justify-center ${
                          esSos ? 'bg-[#ff6363] animate-pulse' : 'bg-[#f59e0b]'
                        }`}
                      >
                        {esSos ? <AlertOctagon className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* 1. Placa de la Unidad */}
                          <span
                            className={`font-mono text-xs font-black px-2.5 py-0.5 rounded-full border ${
                              esSos
                                ? 'bg-black/60 text-[#ff6363] border-[#ff6363]/50'
                                : 'bg-black/60 text-[#f59e0b] border-[#f59e0b]/50'
                            }`}
                          >
                            {placa}
                          </span>

                          {/* Badge de Tipo de Evento */}
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              esSos
                                ? 'bg-[#ff6363]/20 text-[#ff6363] border border-[#ff6363]/40'
                                : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                            }`}
                          >
                            {esSos ? '🚨 SEÑAL SOS' : '🔧 REPORTE AVERÍA'}
                          </span>

                          {vehiculoInfo && (
                            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                              {vehiculoInfo.marca} {vehiculoInfo.modelo}
                            </span>
                          )}
                        </div>

                        {/* 2. Nombre del Operador */}
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-1 font-sans">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[#ffffff]">Operador: {operador}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400 font-mono font-normal">
                            {alert.proyecto || vehiculoInfo?.empresaAsignada || 'En Operación'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Fecha y Hora Exacta */}
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono font-semibold text-white flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{fechaHora}</span>
                      </div>
                      <div className="text-[10px] font-mono text-rose-300 font-bold mt-0.5">
                        {esSos ? 'Prioridad Crítica' : 'Atención Mecánica'}
                      </div>
                    </div>
                  </div>

                  {/* 4. Descripción de la Novedad */}
                  <div
                    className={`p-3.5 rounded-2xl border text-xs font-sans leading-relaxed ${
                      esSos
                        ? 'bg-black/50 border-[#ff6363]/30 text-rose-100'
                        : 'bg-black/50 border-[#f59e0b]/30 text-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          esSos ? 'text-[#ff6363]' : 'text-[#f59e0b]'
                        }`}
                      >
                        Descripción de la Novedad:
                      </span>
                      {alert.checklistEstado && (
                        <span className="text-[9px] font-mono text-slate-400">
                          {alert.checklistEstado}
                        </span>
                      )}
                    </div>
                    <p className="font-normal">{descripcion}</p>
                  </div>
                </div>

                {/* 5. Pie de Tarjeta: Coordenadas + Botón con acceso directo a Google Maps */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 mt-3 border-t border-white/[0.08] relative z-10">
                  {/* Coordenadas Satelitales */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      GPS: {lat.toFixed(5)}°, {lng.toFixed(5)}°
                    </span>
                    {!valido && <span className="text-[9px] text-slate-500">(Terminal)</span>}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    {/* Botón directo a Google Maps usando las coordenadas enviadas por el conductor */}
                    <a
                      href={getGoogleMapsUrl(alert)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:text-white"
                      title="Abrir ubicación exacta en Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ver en Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                    </a>

                    {/* Botón para abrir el Modal de Alerta Crítica */}
                    <button
                      type="button"
                      onClick={() => handleOpenModal(alert)}
                      className={`px-3 py-1.5 rounded-xl text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md ${
                        esSos
                          ? 'bg-[#ff6363] hover:bg-[#ff4d4d]'
                          : 'bg-[#f59e0b] hover:bg-[#fbbf24]'
                      }`}
                      title="Ver modal detallado con mapa embebido y asistencia mecánica"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Ficha Crítica</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Sin Alertas Activas */
        <div className="p-4 rounded-3xl bg-[#071f16]/50 border border-[#59d499]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-md">
          <div className="flex items-center gap-2.5 text-[#59d499]">
            <CheckCircle2 className="w-5 h-5 text-[#59d499] shrink-0" />
            <div>
              <span className="font-bold text-white">Flota Monitoreada & Segura:</span>{' '}
              <span>No hay señales SOS ni reportes de avería activos en la bitácora. Todas las unidades operan con normalidad.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSimularAlerta}
            className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-[#59d499]/15 hover:bg-[#59d499]/25 text-[#59d499] border border-[#59d499]/30 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Simular Señal de Prueba</span>
          </button>
        </div>
      )}

      {/* MODAL DE ALERTA CRÍTICA DESTINADO EXCLUSIVAMENTE A SOS Y AVERÍAS */}
      {modalAbierto && selectedAlert && (() => {
        const { lat, lng } = getCoordenadas(selectedAlert);
        const operador = selectedAlert.operador || selectedAlert.conductor || 'Operador en ruta';
        const placa = selectedAlert.placa || 'UNIDAD';
        const fechaHora = selectedAlert.fechaHora || (selectedAlert.timestamp ? new Date(selectedAlert.timestamp).toLocaleString('es-PE') : 'En curso');
        const descripcion = selectedAlert.descripcion || selectedAlert.observaciones || selectedAlert.checklistEstado || selectedAlert.tipoRegistro || 'Reporte de emergencia emitido sin notas adicionales.';
        const tipo = (selectedAlert.tipoEvento || '').trim();
        const esSos = tipo === 'SOS' || (selectedAlert.tipoRegistro || '').toLowerCase().includes('sos');
        const vehiculo = vehicles.find((v) => v.placa === placa);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
            onClick={() => setModalAbierto(false)}
          >
            <div
              className={`max-w-2xl w-full p-6 sm:p-7 rounded-3xl bg-[#090b10] border-2 shadow-2xl space-y-5 text-white my-auto animate-in zoom-in-95 ${
                esSos ? 'border-[#ff6363] shadow-[#ff6363]/20' : 'border-[#f59e0b] shadow-[#f59e0b]/20'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabecera del Modal */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-3.5 rounded-2xl text-black font-black shrink-0 ${
                      esSos ? 'bg-[#ff6363] animate-pulse' : 'bg-[#f59e0b]'
                    }`}
                  >
                    {esSos ? <AlertOctagon className="w-7 h-7" /> : <Wrench className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                          esSos
                            ? 'bg-[#ff6363]/20 text-[#ff6363] border border-[#ff6363]/40'
                            : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
                        }`}
                      >
                        {esSos ? '🚨 ALERTA CRÍTICA SOS' : '🔧 REPORTE DE AVERÍA'}
                      </span>
                      <span className="text-[10px] font-mono text-[#6a6b6c]">
                        ID: {selectedAlert.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white font-sans mt-1">
                      Emergencia en Operación: Unidad {placa}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-400 hover:text-white border border-white/10 cursor-pointer transition-colors"
                  title="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selector de Alertas si hay más de una */}
              {alertasCriticas.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                  <span className="text-[#6a6b6c] text-[10px] uppercase font-bold shrink-0">Ver unidad:</span>
                  {alertasCriticas.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedAlert(item)}
                      className={`px-3 py-1 rounded-xl border text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        selectedAlert.id === item.id
                          ? 'bg-[#ff6363] text-black border-[#ff6363]'
                          : 'bg-white/[0.05] text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {item.placa} ({item.tipoEvento || 'Alerta'})
                    </button>
                  ))}
                </div>
              )}

              {/* Cluster de Datos Principales: Operador, Placa, Fecha/Hora, Odómetro */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="bg-[#11131a] p-3 rounded-2xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#6a6b6c] uppercase block font-bold">Operador</span>
                  <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                    <User className="w-3.5 h-3.5 text-[#ff6363] shrink-0" />
                    <span className="truncate">{operador}</span>
                  </div>
                </div>

                <div className="bg-[#11131a] p-3 rounded-2xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#6a6b6c] uppercase block font-bold">Unidad Flota</span>
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-[#ff6363]">{placa}</span>
                  </div>
                </div>

                <div className="bg-[#11131a] p-3 rounded-2xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#6a6b6c] uppercase block font-bold">Fecha / Hora</span>
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {fechaHora}
                  </div>
                </div>

                <div className="bg-[#11131a] p-3 rounded-2xl border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-[#6a6b6c] uppercase block font-bold">Odómetro / Fuel</span>
                  <div className="text-xs font-semibold text-slate-200">
                    {selectedAlert.odometro?.toLocaleString() || vehiculo?.odometroActual?.toLocaleString() || '14,750'} km • {selectedAlert.combustible != null ? `${selectedAlert.combustible}%` : '75%'}
                  </div>
                </div>
              </div>

              {/* Novedad Reportada */}
              <div
                className={`p-4 rounded-2xl border space-y-1 ${
                  esSos
                    ? 'bg-[#240a0e] border-[#ff6363]/40'
                    : 'bg-[#221606] border-[#f59e0b]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                      esSos ? 'text-[#ff6363]' : 'text-[#f59e0b]'
                    }`}
                  >
                    Descripción Detallada de la Novedad / Falla:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedAlert.proyecto || vehiculo?.empresaAsignada || 'Junín Minero'}
                  </span>
                </div>
                <p className="text-xs text-slate-100 font-sans leading-relaxed pt-1">
                  {descripcion}
                </p>
              </div>

              {/* Visor Satelital Google Maps Embebido */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <strong>Coordenadas GPS del Conductor:</strong> {lat.toFixed(5)}°, {lng.toFixed(5)}°
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopiarCoords(selectedAlert)}
                    className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    {copiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiado ? 'Copiado' : 'Copiar Coordenadas'}</span>
                  </button>
                </div>

                <div className="w-full h-48 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#07090e] relative shadow-inner">
                  <iframe
                    title="Ubicación satelital del conductor en Google Maps"
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
                  />
                </div>
              </div>

              {/* Botonera de Acciones Inmediatas */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+51964000111"
                    className="px-3.5 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#59d499]" />
                    <span>Llamar Operador</span>
                  </a>

                  <a
                    href="tel:954123456"
                    className="px-3.5 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auxilio Junín 24/7</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {/* Botón Principal a Google Maps usando las coordenadas enviadas por el conductor */}
                  <a
                    href={getGoogleMapsUrl(selectedAlert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-black flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Abrir en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="px-4 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
