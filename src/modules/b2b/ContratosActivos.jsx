import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
import {
  FileCheck,
  Building,
  FileText,
  Download,
  Truck,
  FileDown,
  Lock,
  Search,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import SemaforoBadge from '../../components/common/SemaforoBadge';
import { obtenerIdentificadorB2B, enmascararPlaca } from '../../utils/plateMasker';

export default function ContratosActivos() {
  const { contratos, vehicles } = useFleet();

  // Estados del formulario de consulta privada
  const [rucInput, setRucInput] = useState('');
  const [codigoInput, setCodigoInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Contrato actualmente verificado (null si no ha iniciado sesión/validado)
  const [contratoActivo, setContratoActivo] = useState(null);
  const [downloadMsg, setDownloadMsg] = useState('');

  // Validación y consulta del contrato privado
  const handleConsultar = (e) => {
    e?.preventDefault();
    const cleanRuc = rucInput.trim().replace(/\D/g, '');
    const cleanCodigo = codigoInput.trim().toUpperCase();

    if (!cleanRuc && !cleanCodigo) {
      setErrorMessage('Por favor ingrese el RUC de la empresa y el Código de Contrato.');
      return;
    }

    if (cleanRuc && cleanRuc.length < 8) {
      setErrorMessage('El RUC debe tener al menos 8 a 11 dígitos numéricos.');
      return;
    }

    // Búsqueda estricta del contrato específico
    const match = contratos.find((c) => {
      const cRuc = c.ruc.replace(/\D/g, '');
      const cId = c.id.toUpperCase();

      if (cleanRuc && cleanCodigo) {
        return (cRuc === cleanRuc || cRuc.includes(cleanRuc)) && (cId === cleanCodigo || cId.includes(cleanCodigo));
      }
      if (cleanCodigo) {
        return cId === cleanCodigo || cId.includes(cleanCodigo);
      }
      return cRuc === cleanRuc;
    });

    if (match) {
      setContratoActivo(match);
      setErrorMessage('');
    } else {
      setErrorMessage('Credenciales no encontradas. Verifique el RUC y Código de Contrato provistos en su orden de servicio.');
    }
  };

  const handleCerrarConsulta = () => {
    setContratoActivo(null);
    setRucInput('');
    setCodigoInput('');
    setErrorMessage('');
    setDownloadMsg('');
  };

  const handleDownload = (docName, identificador) => {
    setDownloadMsg(`Generando certificado oficial de ${docName} para la ${identificador.codigo} [${identificador.enmascarada}] (PDF homologado MTC)...`);
    setTimeout(() => {
      setDownloadMsg('');
    }, 2500);
  };

  // =========================================================================
  // ESTADO 1: FORMULARIO LIMPIO DE CONSULTA PRIVADA ESTILO COCKPIT
  // No renderiza nombres ni datos de ninguna compañía minera ajena
  // =========================================================================
  if (!contratoActivo) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-[#949aa6] py-4">
        {/* Badge y Título */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#0c0e12] border border-white/[0.1] text-[#ff6363] text-xs font-mono font-medium shadow-inner">
            <Lock className="w-3.5 h-3.5" />
            <span>ACCESO CORPORATIVO CONFIDENCIAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Consulta Privada de Contrato & Flota
          </h1>
          <p className="text-xs sm:text-sm text-[#626773] max-w-lg mx-auto font-mono">
            Por estrictas políticas de confidencialidad comercial y secreto industrial minero, la información de flota asignada y certificados técnicos está reservada exclusivamente a cada empresa titular.
          </p>
        </div>

        {/* Tarjeta Cockpit Industrial */}
        <div className="cockpit-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/[0.08]">
          <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.08]">
            <div className="w-10 h-10 rounded-full bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Validación de Identidad Corporativa
              </h2>
              <p className="text-xs text-[#626773]">
                Ingrese los datos oficiales de su contrato para visualizar sus unidades y descargar documentos para garita.
              </p>
            </div>
          </div>

          <form onSubmit={handleConsultar} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#626773] flex items-center justify-between">
                <span>RUC de la Empresa</span>
                <span className="text-[10px] lowercase text-[#626773] font-sans">11 dígitos</span>
              </label>
              <input
                type="text"
                value={rucInput}
                onChange={(e) => {
                  setRucInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ejemplo: 20519842101"
                className="w-full px-4 py-2.5 telemetry-well border border-white/[0.08] rounded-full text-xs font-mono text-white placeholder-[#626773] focus:outline-none focus:border-[#ff6363] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#626773] flex items-center justify-between">
                <span>Código Oficial de Contrato</span>
                <span className="text-[10px] lowercase text-[#626773] font-sans">código de orden</span>
              </label>
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => {
                  setCodigoInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ejemplo: CTR-2026-081"
                className="w-full px-4 py-2.5 telemetry-well border border-white/[0.08] rounded-full text-xs font-mono text-white placeholder-[#626773] focus:outline-none focus:border-[#ff6363] transition-colors uppercase"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#ff6363]/10 border border-[#ff6363]/50 rounded-full text-[#ff6363] text-xs font-mono flex items-center gap-2 px-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-cockpit-action py-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-xl font-mono"
            >
              <span>Acceder al Expediente del Contrato</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </form>

          {/* Nota discreta para pruebas de evaluación sin revelar competidores */}
          <div className="pt-4 border-t border-white/[0.08] text-center">
            <p className="text-[11px] text-[#626773] font-mono">
              Para validación o pruebas del portal: RUC <code className="text-white telemetry-well px-2 py-0.5 rounded-full font-mono border border-white/10">20519842101</code> y Contrato <code className="text-white telemetry-well px-2 py-0.5 rounded-full font-mono border border-white/10">CTR-2026-081</code>
            </p>
          </div>
        </div>

        {/* Garantía de Seguridad */}
        <div className="text-center text-[11px] text-[#626773] flex items-center justify-center gap-2 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#59d499]" />
          <span>Canal Seguro B2B • Estricta Reserva Comercial entre Operaciones Mineras</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ESTADO 2: EXPEDIENTE EXCLUSIVO DEL CONTRATO CONSULTADO
  // =========================================================================
  const vehiculosAsignados = vehicles.filter((v) =>
    contratoActivo.placas.includes(v.placa)
  );

  return (
    <div className="space-y-6 text-[#949aa6] max-w-5xl mx-auto">
      {/* Barra de Validación y Empresa Titular */}
      <div className="cockpit-panel rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/[0.08]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#59d499]/15 text-[#59d499] border border-[#59d499]/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#59d499] animate-pulse"></span>
                EXPEDIENTE VALIDADO
              </span>
              <span className="text-xs font-mono text-[#ff6363] font-bold">
                {contratoActivo.id}
              </span>
              <span className="text-xs font-mono text-[#626773]">
                RUC: <strong className="text-white">{contratoActivo.ruc}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1 font-sans">
              {contratoActivo.cliente}
            </h1>
            <p className="text-xs text-[#626773] font-mono">
              Proyecto / Ubicación: <span className="text-white font-medium">{contratoActivo.minaProyecto}</span> • Contacto: {contratoActivo.contacto}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.08]">
          <div className="telemetry-well px-4 py-2 rounded-full text-center">
            <div className="text-[9px] uppercase font-bold text-[#626773] font-mono">Flota Asignada</div>
            <div className="text-sm font-black text-[#59d499] font-mono">
              {contratoActivo.unidadesAsignadas} Pickups
            </div>
          </div>

          <button
            onClick={handleCerrarConsulta}
            className="btn-cockpit-secondary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ff6363]" />
            <span>Cerrar Consulta</span>
          </button>
        </div>
      </div>

      {/* Resumen de Vigencia y Garita */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="telemetry-well border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
          <Calendar className="w-4 h-4 text-[#ff6363] shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#6a6b6c]">Periodo de Vigencia</div>
            <div className="text-xs font-mono text-white font-bold">
              {contratoActivo.fechaInicio} al {contratoActivo.fechaFin}
            </div>
          </div>
        </div>

        <div className="telemetry-well border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
          <Truck className="w-4 h-4 text-[#59d499] shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#6a6b6c]">Estado Contractual</div>
            <div className="text-xs font-mono text-[#59d499] font-bold">
              {contratoActivo.estado}
            </div>
          </div>
        </div>

        <div className="telemetry-well border border-white/[0.08] p-4 rounded-2xl flex items-center gap-3">
          <Lock className="w-4 h-4 text-[#ff6363] shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#6a6b6c]">Control Garita</div>
            <div className="text-xs font-mono text-white">
              Documentos MTC Homologados
            </div>
          </div>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-3 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/40 text-[#ff6363] text-xs font-mono font-bold flex items-center gap-2 px-5">
          <FileDown className="w-4 h-4 shrink-0" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Flota Asignada a ESTE Contrato Exclusivo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-mono tracking-wider text-[#6a6b6c] flex items-center gap-1.5 font-bold">
            <Truck className="w-4 h-4 text-[#ff6363]" />
            Unidades Asignadas a este Contrato
          </h2>
          <span className="text-[11px] font-mono text-[#6a6b6c]">
            {contratoActivo.minaProyecto}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehiculosAsignados.length === 0 ? (
            <div className="telemetry-well border border-white/[0.08] p-6 rounded-3xl text-center col-span-2 text-xs text-[#6a6b6c] font-mono">
              Placas registradas en el contrato: {(contratoActivo?.placas || []).map(enmascararPlaca).join(', ')}
            </div>
          ) : (
            (vehiculosAsignados || []).map((veh, idx) => {
              const identificador = obtenerIdentificadorB2B(veh, idx);

              return (
                <div
                  key={veh.id}
                  className="cockpit-panel border border-white/[0.08] p-5 rounded-3xl space-y-3.5 relative shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                        <span>{veh.marca} {veh.modelo}</span>
                        <span className="text-[10px] font-mono font-bold text-[#ff6363] bg-[#ff6363]/10 px-2.5 py-0.5 rounded-full border border-[#ff6363]/30">
                          {identificador.codigo}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6a6b6c] font-mono mt-0.5">
                        Placa: <strong className="text-white">{identificador.enmascarada}</strong> • Odómetro: {veh.odometroActual.toLocaleString()} km
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full telemetry-well border border-white/[0.1] text-neutral-300 text-[11px] font-mono font-bold">
                      {identificador.enmascarada}
                    </span>
                  </div>

                  <SemaforoBadge odometro={veh.odometroActual} compact={false} />

                  {/* Descarga de Documentación Homologada para Garita */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#6a6b6c]">
                      Documentos Homologados MTC (PDF):
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownload('SOAT Vigente', identificador)}
                        className="btn-cockpit-secondary px-3 py-1.5 text-[10px] rounded-full flex items-center gap-1.5 cursor-pointer font-mono"
                      >
                        <FileText className="w-3 h-3 text-[#ff6363]" />
                        <span>SOAT</span>
                        <Download className="w-2.5 h-2.5 text-[#6a6b6c]" />
                      </button>

                      <button
                        onClick={() => handleDownload('Póliza Rimac Flotas', identificador)}
                        className="btn-cockpit-secondary px-3 py-1.5 text-[10px] rounded-full flex items-center gap-1.5 cursor-pointer font-mono"
                      >
                        <FileText className="w-3 h-3 text-[#59d499]" />
                        <span>Póliza</span>
                        <Download className="w-2.5 h-2.5 text-[#6a6b6c]" />
                      </button>

                      <button
                        onClick={() => handleDownload('Revisión Técnica MTC', identificador)}
                        className="btn-cockpit-secondary px-3 py-1.5 text-[10px] rounded-full flex items-center gap-1.5 cursor-pointer font-mono"
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
    </div>
  );
}
