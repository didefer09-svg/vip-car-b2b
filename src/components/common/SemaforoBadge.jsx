import React from 'react';
import { calcularSemaforo } from '../../data/mockData';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SemaforoBadge({ odometro, compact = false }) {
  const semaforo = calcularSemaforo(odometro);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-xs font-medium font-mono border ${semaforo.color}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            semaforo.estado === 'Verde'
              ? 'bg-[#59d499]'
              : semaforo.estado === 'Amarillo'
              ? 'bg-[#f59e0b]'
              : 'bg-[#ff6363] animate-pulse'
          }`}
        />
        <span>{semaforo.estado}</span>
      </span>
    );
  }

  return (
    <div className={`p-2.5 rounded-[8px] border flex items-center justify-between gap-3 ${semaforo.color}`}>
      <div className="flex items-center gap-2.5">
        {semaforo.estado === 'Verde' && <CheckCircle className="w-4 h-4 text-[#59d499] shrink-0" />}
        {semaforo.estado === 'Amarillo' && <Clock className="w-4 h-4 text-[#f59e0b] shrink-0" />}
        {semaforo.estado === 'Rojo' && <AlertCircle className="w-4 h-4 text-[#ff6363] shrink-0" />}
        <div>
          <div className="text-xs font-medium uppercase font-mono tracking-wider">{semaforo.tag}</div>
          <div className="text-[11px] opacity-80 font-mono">
            {semaforo.kmRestantes > 0
              ? `Faltan ${semaforo.kmRestantes.toLocaleString()} km para servicio (${semaforo.siguienteServicio.toLocaleString()} km)`
              : `Excedido por ${Math.abs(semaforo.kmRestantes).toLocaleString()} km (servicio ${semaforo.siguienteServicio.toLocaleString()} km)`}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase font-mono tracking-wider ${
            semaforo.estado === 'Verde'
              ? 'bg-[#071f16] text-[#59d499] border border-[#59d499]/40'
              : semaforo.estado === 'Amarillo'
              ? 'bg-[#231908] text-[#f59e0b] border border-[#f59e0b]/40'
              : 'bg-[#ff6363] text-black font-black shadow-xs'
          }`}
        >
          {semaforo.estado}
        </span>
      </div>
    </div>
  );
}
