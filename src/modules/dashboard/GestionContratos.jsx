import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  FileCheck,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  Truck,
  User,
  ShieldCheck,
  FileDown,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import { obtenerIdentificadorB2B } from '../../utils/plateMasker';

export default function GestionContratos() {
  const { contratos, vehicles } = useFleet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [expandedId, setExpandedId] = useState(contratos[0]?.id || null);
  const [downloadMsg, setDownloadMsg] = useState('');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = (docName, placa, vehiculo) => {
    setDownloadMsg(`Generando descarga de ${docName} para la unidad ${placa} (${vehiculo?.marca} ${vehiculo?.modelo})...`);
    setTimeout(() => {
      setDownloadMsg('');
    }, 2500);
  };

  // Filtrado de contratos
  const contratosFiltrados = contratos.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.cliente.toLowerCase().includes(term) ||
      c.ruc.includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.minaProyecto.toLowerCase().includes(term);

    const matchesEstado =
      filtroEstado === 'todos' ||
      (filtroEstado === 'vigente' && c.estado === 'Vigente') ||
      (filtroEstado === 'renovar' && c.estado === 'Próximo a Renovar');

    return matchesSearch && matchesEstado;
  });

  // Métricas Gerenciales Agregadas
  const totalContratos = contratos.length;
  const totalPickupsAsignadas = contratos.reduce((acc, c) => acc + c.unidadesAsignadas, 0);
  const facturacionTotalUSD = contratos.reduce((acc, c) => acc + (c.montoMensualUSD || 0), 0);
  const contratosProximosRenovar = contratos.filter((c) => c.estado === 'Próximo a Renovar').length;

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header Gerencial */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#2d0e14] text-[#ff6363] text-[10px] font-mono font-medium mb-1 border border-[#ff6363]/40">
            ADMINISTRACIÓN CENTRAL • ACCESO EXCLUSIVO GERENCIA
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight font-sans flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-[#ff6363]" />
            Control Gerencial de Contratos Corporativos
          </h1>
          <p className="text-xs text-[#6a6b6c] mt-0.5">
            Supervisión integral de acuerdos comerciales, facturación mensual, asignación de pickups y homologaciones con mineras y contratistas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-[8px] bg-[#07080a] border border-[#363739] text-xs font-mono">
            <span className="text-[#6a6b6c]">Total Facturación: </span>
            <span className="text-[#59d499] font-bold font-mono">
              ${facturacionTotalUSD.toLocaleString()} USD/mes
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards: Raycast Dark Palette */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="raycast-card p-4 rounded-[16px] space-y-1 bg-[#07080a] border border-[#363739]">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">Contratos Totales</span>
            <FileText className="w-4 h-4 text-[#ff6363]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalContratos}</div>
          <div className="text-[11px] text-[#6a6b6c]">
            {contratos.filter((c) => c.estado === 'Vigente').length} contratos vigentes
          </div>
        </div>

        <div className="raycast-card p-4 rounded-[16px] space-y-1 bg-[#07080a] border border-[#363739]">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">Flota en Arriendo</span>
            <Truck className="w-4 h-4 text-[#59d499]" />
          </div>
          <div className="text-2xl font-bold text-[#59d499] font-mono">{totalPickupsAsignadas}</div>
          <div className="text-[11px] text-[#6a6b6c]">Pickups 4x4 y vehículos pesados</div>
        </div>

        <div className="raycast-card p-4 rounded-[16px] space-y-1 bg-[#07080a] border border-[#363739]">
          <div className="flex items-center justify-between text-[#6a6b6c]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">Ingresos Mensuales</span>
            <DollarSign className="w-4 h-4 text-[#59d499]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${(facturacionTotalUSD / 1000).toFixed(1)}k <span className="text-xs text-[#6a6b6c]">USD</span>
          </div>
          <div className="text-[11px] text-[#59d499]">Recurrente garantizado</div>
        </div>

        <div className="raycast-card p-4 rounded-[16px] space-y-1 bg-[#231908]/30 border border-[#f59e0b]/35">
          <div className="flex items-center justify-between text-[#f59e0b]">
            <span className="text-[10px] font-mono uppercase tracking-[0.8px]">Por Renovar</span>
            <Clock className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-[#f59e0b] font-mono">
            {contratosProximosRenovar}
          </div>
          <div className="text-[11px] text-[#6a6b6c]">Próximos 60 días</div>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-3 rounded-[8px] bg-[#1b1c1e] border border-[#ff6363]/40 text-[#ff6363] text-xs font-bold flex items-center gap-2">
          <FileDown className="w-4 h-4 shrink-0" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-[#07080a] border border-[#363739] p-3.5 rounded-[12px] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, RUC, código o proyecto..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#111214] border border-[#363739] rounded-[8px] text-xs font-mono text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#ff6363]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-[#6a6b6c] uppercase font-mono">Estado:</span>
          <div className="inline-flex p-0.5 rounded-[8px] bg-[#111214] border border-[#363739]">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-all ${
                filtroEstado === 'todos'
                  ? 'bg-[#1b1c1e] text-white font-bold'
                  : 'text-[#6a6b6c] hover:text-white'
              }`}
            >
              Todos ({contratos.length})
            </button>
            <button
              onClick={() => setFiltroEstado('vigente')}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-all ${
                filtroEstado === 'vigente'
                  ? 'bg-[#1b1c1e] text-[#59d499] font-bold'
                  : 'text-[#6a6b6c] hover:text-white'
              }`}
            >
              Vigentes
            </button>
            <button
              onClick={() => setFiltroEstado('renovar')}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-mono transition-all ${
                filtroEstado === 'renovar'
                  ? 'bg-[#1b1c1e] text-[#f59e0b] font-bold'
                  : 'text-[#6a6b6c] hover:text-white'
              }`}
            >
              Por Renovar
            </button>
          </div>
        </div>
      </div>

      {/* Lista General de Contratos */}
      <div className="space-y-4">
        {contratosFiltrados.length === 0 ? (
          <div className="bg-[#07080a] border border-[#363739] rounded-[16px] p-8 text-center text-[#6a6b6c] text-xs">
            No se encontraron contratos que coincidan con los criterios de búsqueda.
          </div>
        ) : (
          contratosFiltrados.map((contrato) => {
            const isExpanded = expandedId === contrato.id;
            const assignedVehs = vehicles.filter((v) =>
              contrato.placas.includes(v.placa)
            );

            return (
              <div
                key={contrato.id}
                className="bg-[#07080a] border border-[#363739] rounded-[16px] overflow-hidden transition-all shadow-md"
              >
                {/* Cabecera del Contrato */}
                <div
                  onClick={() => toggleExpand(contrato.id)}
                  className="p-4 bg-[#07080a] hover:bg-[#111214] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#1b1c1e] text-[#ff6363] flex items-center justify-center shrink-0 border border-[#363739]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#ff6363] font-bold">
                          {contrato.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold ${
                            contrato.estado === 'Vigente'
                              ? 'bg-[#040506] text-[#59d499] border border-[#59d499]/30'
                              : 'bg-[#040506] text-[#f59e0b] border border-[#f59e0b]/30'
                          }`}
                        >
                          {contrato.estado}
                        </span>
                        <span className="text-[11px] font-mono text-[#6a6b6c]">
                          RUC: <strong className="text-white">{contrato.ruc}</strong>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {contrato.cliente}
                      </h3>
                      <p className="text-xs text-[#6a6b6c]">
                        Proyecto: <span className="text-white font-medium">{contrato.minaProyecto}</span> • Contacto: {contrato.contacto}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-2.5 md:pt-0 border-[#363739]">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-[#6a6b6c]">Flota Asignada</div>
                      <div className="text-xs font-black text-white font-mono">
                        {contrato.unidadesAsignadas} Unidades
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase font-bold text-[#6a6b6c]">Facturación</div>
                      <div className="text-xs font-bold text-[#59d499] font-mono">
                        ${contrato.montoMensualUSD?.toLocaleString()} USD/m
                      </div>
                    </div>

                    <div className="text-left md:text-right hidden lg:block">
                      <div className="text-[10px] uppercase font-bold text-[#6a6b6c]">Vigencia</div>
                      <div className="text-xs font-mono text-[#9c9c9d]">
                        {contrato.fechaInicio} al {contrato.fechaFin}
                      </div>
                    </div>

                    <button className="p-1.5 rounded-[8px] bg-[#111214] border border-[#363739] text-[#9c9c9d] hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Acordeón Expandido: Unidades Asignadas & Auditoría de Documentos */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#363739] space-y-4 bg-[#040506]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6a6b6c] flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#ff6363]" />
                        Auditoría de Unidades Asignadas ({assignedVehs.length} vehículos en servicio)
                      </h4>
                      <span className="text-[11px] text-[#6a6b6c] font-mono">
                        Contacto Operativo: {contrato.contacto}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignedVehs.length === 0 ? (
                        <p className="text-xs text-[#6a6b6c] col-span-2 py-4 text-center">
                          Placas registradas en el contrato: {contrato.placas.join(', ')}
                        </p>
                      ) : (
                        assignedVehs.map((veh, idx) => {
                          const identificador = obtenerIdentificadorB2B(veh, idx);

                          return (
                            <div
                              key={veh.id}
                              className="bg-[#07080a] border border-[#363739] p-4 rounded-[12px] space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{veh.marca} {veh.modelo}</span>
                                    <span className="text-[10px] font-mono font-bold text-[#ff6363] bg-[#1b1c1e] px-1.5 py-0.5 rounded-[4px] border border-[#ff6363]/40">
                                      {identificador.codigo}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#6a6b6c] font-mono mt-0.5">
                                    Placa Oficial: <strong className="text-white">{veh.placa}</strong> • Odómetro: {veh.odometroActual.toLocaleString()} km
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-[6px] bg-[#111214] border border-[#363739] text-[#59d499] text-[11px] font-mono font-bold">
                                  {veh.placa}
                                </span>
                              </div>

                              <SemaforoBadge odometro={veh.odometroActual} compact={false} />

                              <div className="text-[11px] text-[#6a6b6c] flex items-center justify-between border-t border-[#363739] pt-2">
                                <span>Conductor: <strong className="text-white">{veh.conductorActual || 'No asignado'}</strong></span>
                                <span>Combustible: <strong className="text-white">{veh.nivelCombustible}%</strong></span>
                              </div>

                              {/* Descarga / Visualización de Documentos Oficiales */}
                              <div className="pt-2 border-t border-[#363739] space-y-1.5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6a6b6c]">
                                  Descarga de Certificaciones Oficiales:
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  <button
                                    onClick={() => handleDownload('SOAT Vigente', veh.placa, veh)}
                                    className="btn-raycast-secondary px-2.5 py-1 text-[10px] rounded-[6px] flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3 text-[#ff6363]" />
                                    <span>SOAT</span>
                                    <Download className="w-2.5 h-2.5 text-[#6a6b6c]" />
                                  </button>

                                  <button
                                    onClick={() => handleDownload('Póliza Todo Riesgo Rimac', veh.placa, veh)}
                                    className="btn-raycast-secondary px-2.5 py-1 text-[10px] rounded-[6px] flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3 text-[#59d499]" />
                                    <span>Póliza</span>
                                    <Download className="w-2.5 h-2.5 text-[#6a6b6c]" />
                                  </button>

                                  <button
                                    onClick={() => handleDownload('Revisión Técnica MTC', veh.placa, veh)}
                                    className="btn-raycast-secondary px-2.5 py-1 text-[10px] rounded-[6px] flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3 text-sky-400" />
                                    <span>Rev. Técnica</span>
                                    <Download className="w-2.5 h-2.5 text-[#6a6b6c]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
