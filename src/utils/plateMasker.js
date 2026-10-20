/**
 * VIP CAR B2B - Utilidades de Privacidad y Enmascaramiento de Placas
 * En el portal B2B corporativo y catálogo para clientes mineros/constructores,
 * las placas se enmascaran (ej. W4E-***) y se identifican como 'Unidad #01'.
 * Las placas completas solo son visibles para Administradores y Conductores asignados.
 */

/**
 * Enmascara una placa vehicular peruana manteniendo únicamente el prefijo.
 * Ejemplo: 'W4E-892' -> 'W4E-***'
 * @param {string} placa
 * @returns {string}
 */
export function enmascararPlaca(placa) {
  if (!placa) return '***-***';
  const clean = placa.trim();
  const partes = clean.split('-');

  if (partes.length >= 2) {
    return `${partes[0]}-***`;
  }

  if (clean.length >= 3) {
    return `${clean.substring(0, 3)}-***`;
  }

  return '***-***';
}

/**
 * Genera el identificador comercial anónimo para clientes del portal B2B.
 * Ejemplo: { codigo: 'Unidad #01', enmascarada: 'W4E-***', completo: 'Unidad #01 (W4E-***)' }
 * @param {Object} vehiculo
 * @param {number} [indice]
 * @returns {{ codigo: string, enmascarada: string, completo: string }}
 */
export function obtenerIdentificadorB2B(vehiculo, indice) {
  // Extrae número de unidad a partir del índice o del id veh-01 -> 01
  let numeroStr = '01';
  if (indice !== undefined && indice !== null) {
    numeroStr = String(indice + 1).padStart(2, '0');
  } else if (vehiculo?.id) {
    const match = vehiculo.id.match(/\d+/);
    if (match) {
      numeroStr = match[0].padStart(2, '0');
    }
  }

  const codigo = `Unidad #${numeroStr}`;
  const enmascarada = enmascararPlaca(vehiculo?.placa);

  return {
    codigo,
    enmascarada,
    completo: `${codigo} (${enmascarada})`
  };
}
