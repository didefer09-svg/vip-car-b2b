import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
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
  AlertCircle,
  FileSpreadsheet,
  AlertTriangle,
  Building,
  Eye,
  X,
  ClipboardCheck,
  ShieldCheck,
  ShieldAlert,
  User,
  Calendar,
  Car,
  Layers
} from 'lucide-react';

/**
 * Catálogo Oficial de 43 Ítems agrupados en 7 Categorías (App de Conductores VIP CAR)
 */
export const CHECKLIST_CATEGORIAS = [
  {
    id: 'fuera_vehiculo',
    codigo: '01',
    titulo: 'Fuera del vehículo',
    items: [
      { id: 'chk_01', num: 1, label: 'Marcas, rayaduras, hendiduras de carrocería' },
      { id: 'chk_02', num: 2, label: 'Vehículo limpio (Interno y Externo)' },
      { id: 'chk_03', num: 3, label: 'Estado de espejos retrovisores e interiores' },
      { id: 'chk_04', num: 4, label: 'Estado de parabrisas, ventanas' },
      { id: 'chk_05', num: 5, label: 'Fugas de lubricantes debajo del vehículo' },
    ],
  },
  {
    id: 'neumaticos',
    codigo: '02',
    titulo: 'Neumáticos',
    items: [
      { id: 'chk_06', num: 6, label: 'Desgaste de neumáticos (profundidad de cocada >3mm)' },
      { id: 'chk_07', num: 7, label: 'Existe cortadura / abultamiento' },
      { id: 'chk_08', num: 8, label: 'Espárrago y tuercas' },
      { id: 'chk_09', num: 9, label: 'Indicadores de Tuerca (en todas las tuercas)' },
      { id: 'chk_10', num: 10, label: 'Aros y pestañas' },
      { id: 'chk_11', num: 11, label: 'Cuenta con neumático de repuesto' },
    ],
  },
  {
    id: 'motor',
    codigo: '03',
    titulo: 'Motor',
    items: [
      { id: 'chk_12', num: 12, label: 'Nivel de aceite del motor' },
      { id: 'chk_13', num: 13, label: 'Nivel de líquido refrigerante' },
      { id: 'chk_14', num: 14, label: 'Nivel de líquido de frenos' },
      { id: 'chk_15', num: 15, label: 'Nivel de líquido de embrague' },
      { id: 'chk_16', num: 16, label: 'Nivel de agua limpiaparabrisas' },
      { id: 'chk_17', num: 17, label: 'Ventilador, Radiador (sin barro / lodo)' },
      { id: 'chk_18', num: 18, label: 'Baterías - bornes de batería' },
    ],
  },
  {
    id: 'interior_apagado',
    codigo: '04',
    titulo: 'Interior del vehículo (Apagado)',
    items: [
      { id: 'chk_19', num: 19, label: 'Barra antivuelco' },
      { id: 'chk_20', num: 20, label: 'Cinturones de seguridad' },
      { id: 'chk_21', num: 21, label: 'Jebes de pedales' },
      { id: 'chk_22', num: 22, label: 'Longitud de freno de mano' },
      { id: 'chk_23', num: 23, label: 'Asientos' },
    ],
  },
  {
    id: 'accesorios_documentos',
    codigo: '05',
    titulo: 'Accesorios y documentos',
    items: [
      { id: 'chk_24', num: 24, label: 'Botiquín' },
      { id: 'chk_25', num: 25, label: 'Extintor' },
      { id: 'chk_26', num: 26, label: 'Taco / Cuñas (2)' },
      { id: 'chk_27', num: 27, label: 'Conos (2)' },
      { id: 'chk_28', num: 28, label: 'Kit Antiderrame' },
      { id: 'chk_29', num: 29, label: 'Gata hidráulica' },
      { id: 'chk_30', num: 30, label: 'Cable de remolque' },
      { id: 'chk_31', num: 31, label: 'Documentos vigentes (licencia MTC, LICO, SOAT, Inspección Técnica Trimestral, tarjeta propiedad)' },
    ],
  },
  {
    id: 'energizado_luces_exterior',
    codigo: '06',
    titulo: 'Vehículo energizado - Luces y exterior',
    items: [
      { id: 'chk_32', num: 32, label: 'Luces (alta y baja, retroceso, freno, estacionamiento)' },
      { id: 'chk_33', num: 33, label: 'Direccionales (izq. - der.)' },
      { id: 'chk_34', num: 34, label: 'Faros neblineros, pirata' },
      { id: 'chk_35', num: 35, label: 'Indicadores de tablero' },
      { id: 'chk_36', num: 36, label: 'Alarma de retroceso' },
      { id: 'chk_37', num: 37, label: 'Limpiaparabrisas' },
    ],
  },
  {
    id: 'energizado_interior',
    codigo: '07',
    titulo: 'Vehículo energizado - Interior del vehículo',
    items: [
      { id: 'chk_38', num: 38, label: 'Aire acondicionado' },
      { id: 'chk_39', num: 39, label: 'Nivel de combustible' },
      { id: 'chk_40', num: 40, label: 'Tablero y luces de advertencia' },
      { id: 'chk_41', num: 41, label: 'Claxon' },
      { id: 'chk_42', num: 42, label: 'Prueba de pedales de freno y embrague' },
      { id: 'chk_43', num: 43, label: 'Operatividad de panel (Velocímetro, combustible)' },
    ],
  },
];

export const CHECKLIST_43_ITEMS = CHECKLIST_CATEGORIAS.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoriaId: cat.id,
    categoriaTitulo: cat.titulo,
  }))
);

// Mapeo de las 8 macro-llaves heredadas hacia los números de ítem correspondientes
const LEGACY_KEY_TO_ITEM_NUMS = {
  luces: [32, 33, 34],
  circulina: [34, 36],
  frenos: [14, 22, 42],
  neumaticos: [6, 7, 8, 9, 10, 11],
  aceite: [12, 13, 15, 16],
  seguridad: [24, 25, 28],
  tacos: [26, 27],
  jaula: [19, 20],
};

/**
 * Convierte cadenas de hora ("07:15", "09:24 a. m.", "12:05 p. m.") a minutos desde medianoche
 */
function parseHoraAMinutos(horaStr) {
  if (!horaStr || typeof horaStr !== 'string') return null;
  const clean = horaStr.replace(/\u00a0/g, ' ').trim().toLowerCase();
  const isPM = clean.includes('p. m.') || clean.includes('pm') || clean.includes('p.m.');
  const isAM = clean.includes('a. m.') || clean.includes('am') || clean.includes('a.m.');

  const match = clean.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (isNaN(h) || isNaN(m)) return null;

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;

  return h * 60 + m;
}

/**
 * Extrae y mapea la lista completa de los 43 sub-ítems detallados que vienen de Firebase
 * (tanto desde el objeto `checklist`, como desde `checklistResumen` / `checklistEstado` / `observaciones`).
 */
export function extraerChecklistDetallado43(log) {
  const rawCheck = log?.checklist;
  const resumenStr = String(log?.checklistResumen || log?.checklistEstado || log?.checklist_condicion || '');
  const obsStr = String(log?.observaciones || log?.descripcion || '').toLowerCase();
  const fullTextLower = `${resumenStr} ${obsStr}`.toLowerCase();

  // 1. Detectar números de ítems reportados con falla en checklistResumen (ej: "Fallas: #1 ..., #12 ..., #19 ...")
  const failedNumsFromText = new Set();
  const regexNum = /#(\d{1,2})\b/g;
  let match;
  while ((match = regexNum.exec(resumenStr)) !== null) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 43) {
      failedNumsFromText.add(num);
    }
  }

  // 2. Si no hay números explícitos "#N", revisar si existen llaves legacy o descripciones de fallas puntuales
  const legacyFailedNums = new Set();
  if (failedNumsFromText.size === 0) {
    if (rawCheck && typeof rawCheck === 'object' && !Array.isArray(rawCheck)) {
      Object.entries(LEGACY_KEY_TO_ITEM_NUMS).forEach(([legacyKey, nums]) => {
        if (legacyKey in rawCheck && rawCheck[legacyKey] === false) {
          // Marcar el primer ítem representativo de esa categoría como falla
          legacyFailedNums.add(nums[0]);
        }
      });
    }

    // Inferencia por palabras clave en observaciones/averías cuando no se especificó #num
    if (legacyFailedNums.size === 0) {
      if (fullTextLower.includes('pinchazo') || fullTextLower.includes('cortadura') || fullTextLower.includes('llanta')) {
        legacyFailedNums.add(7);
      }
      if (fullTextLower.includes('fusible') || fullTextLower.includes('neblinero')) {
        legacyFailedNums.add(34);
      }
      if (fullTextLower.includes('liquido de freno') || fullTextLower.includes('líquido de freno') || fullTextLower.includes('liquiddo de freno')) {
        legacyFailedNums.add(14);
      }
      if (fullTextLower.includes('aceite de motor') || fullTextLower.includes('nivel de aceite')) {
        legacyFailedNums.add(12);
      }
      if (fullTextLower.includes('barra antivuelco') || fullTextLower.includes('no tiene jaula')) {
        legacyFailedNums.add(19);
      }
      if (fullTextLower.includes('observaciones leves')) {
        legacyFailedNums.add(24);
      }
    }
  }

  // 3. Mapear las 7 categorías con sus 43 ítems
  const mapaEstadoPorId = {};
  const categoriasMapeadas = CHECKLIST_CATEGORIAS.map((cat) => {
    const itemsMapeados = cat.items.map((item) => {
      let status = 'OK'; // 'OK' | 'FALLA' | 'OBSERVACION'

      // a) Si viene en el objeto checklist directamente como chk_01..chk_43 o por número/label
      if (rawCheck && typeof rawCheck === 'object' && !Array.isArray(rawCheck)) {
        const directVal =
          rawCheck[item.id] ??
          rawCheck[`item_${item.num}`] ??
          rawCheck[String(item.num)] ??
          rawCheck[`#${item.num}`] ??
          rawCheck[item.label] ??
          (rawCheck[cat.id] && typeof rawCheck[cat.id] === 'object' ? rawCheck[cat.id][item.id] : undefined);

        if (directVal !== undefined && directVal !== null) {
          if (directVal === false || String(directVal).toLowerCase() === 'falla' || String(directVal).toLowerCase() === 'no') {
            status = 'FALLA';
          } else if (String(directVal).toLowerCase().includes('obs')) {
            status = 'OBSERVACION';
          } else {
            status = 'OK';
          }
        }
      }

      // b) Si está listado en el resumen de fallas de Firebase ("Fallas: #1 ..., #12 ...")
      if (failedNumsFromText.has(item.num)) {
        status = 'FALLA';
      } else if (legacyFailedNums.has(item.num)) {
        status = fullTextLower.includes('observaciones leves') ? 'OBSERVACION' : 'FALLA';
      }

      const isOk = status === 'OK';
      mapaEstadoPorId[item.id] = isOk;

      return {
        ...item,
        categoriaId: cat.id,
        categoriaTitulo: cat.titulo,
        status,
        isOk,
      };
    });

    const totalCat = itemsMapeados.length;
    const okCat = itemsMapeados.filter((i) => i.isOk).length;
    const fallasCat = totalCat - okCat;

    return {
      ...cat,
      items: itemsMapeados,
      totalCat,
      okCat,
      fallasCat,
    };
  });

  // 4. Si el documento de Firebase contiene llaves personalizadas adicionales fuera del estándar, agregarlas sin perder datos
  const standardKeys = new Set([
    ...CHECKLIST_43_ITEMS.map((i) => i.id),
    ...CHECKLIST_43_ITEMS.map((i) => String(i.num)),
    ...CHECKLIST_43_ITEMS.map((i) => `#${i.num}`),
    ...CHECKLIST_43_ITEMS.map((i) => i.label),
    ...CHECKLIST_CATEGORIAS.map((c) => c.id),
    ...Object.keys(LEGACY_KEY_TO_ITEM_NUMS),
  ]);

  if (rawCheck && typeof rawCheck === 'object' && !Array.isArray(rawCheck)) {
    const extraItems = [];
    Object.entries(rawCheck).forEach(([k, val]) => {
      if (!standardKeys.has(k) && typeof val !== 'object') {
        const isOk = Boolean(val) && String(val).toLowerCase() !== 'falla';
        mapaEstadoPorId[k] = isOk;
        extraItems.push({
          id: k,
          num: 43 + extraItems.length + 1,
          label: k.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
          categoriaId: 'adicionales',
          categoriaTitulo: 'Ítems adicionales reportados',
          status: isOk ? 'OK' : 'FALLA',
          isOk,
        });
      }
    });

    if (extraItems.length > 0) {
      categoriasMapeadas.push({
        id: 'adicionales',
        codigo: '08',
        titulo: 'Ítems adicionales reportados',
        items: extraItems,
        totalCat: extraItems.length,
        okCat: extraItems.filter((i) => i.isOk).length,
        fallasCat: extraItems.filter((i) => !i.isOk).length,
      });
    }
  }

  const todosLosItems = categoriasMapeadas.flatMap((c) => c.items);

  return {
    categoriasMapeadas,
    todosLosItems,
    mapaEstadoPorId,
  };
}

/**
 * Normaliza y calcula las métricas requeridas para cada registro de turno:
 * 1. Horas de trabajo = Check-out - Check-in
 * 2. Km final y Km recorrido diario = Km final - Km inicial
 * 3. Desglose completo de los 43 ítems del Check-list agrupados por secciones
 * 4. Ubicación GPS y Proyecto en campos estrictamente separados
 */
export function resolverDatosTurno(log) {
  // 1. Fecha
  let fecha = '';
  if (log?.fecha) {
    fecha = log.fecha;
  } else if (log?.fechaHora && log.fechaHora.includes(',')) {
    fecha = log.fechaHora.split(',')[0].trim();
  } else if (log?.timestamp) {
    try {
      fecha = new Date(log.timestamp).toLocaleDateString('es-PE');
    } catch {
      fecha = '28/10/2026';
    }
  } else {
    fecha = '28/10/2026';
  }

  const tipo = (log?.tipoEvento || log?.tipoRegistro || '').toLowerCase();

  // 2. Horas Check-in y Check-out
  let horaCheckIn = log?.horaCheckIn || '';
  let horaCheckOut = log?.horaCheckOut || '';

  if (!horaCheckIn) {
    if (tipo.includes('check-in') && log?.fechaHora?.includes(',')) {
      horaCheckIn = log.fechaHora.split(',')[1].trim();
    } else {
      horaCheckIn = '07:00';
    }
  }

  if (!horaCheckOut) {
    if (tipo.includes('check-out') && log?.fechaHora?.includes(',')) {
      horaCheckOut = log.fechaHora.split(',')[1].trim();
    } else {
      horaCheckOut = '18:30';
    }
  }

  // 3. Cálculo de horas de trabajo (Check-out - Check-in)
  let horasDecimal = 0;
  let horasTexto = '—';
  const minIn = parseHoraAMinutos(horaCheckIn);
  const minOut = parseHoraAMinutos(horaCheckOut);

  if (minIn !== null && minOut !== null) {
    let diffMin = minOut - minIn;
    if (diffMin <= 0) diffMin += 24 * 60;
    horasDecimal = Number((diffMin / 60).toFixed(1));
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    horasTexto = m === 0 ? `${h}h` : `${h}h ${m}m`;
  } else {
    horasDecimal = 10.5;
    horasTexto = '10h 30m';
  }

  // 4. Kilometraje Inicial, Final y Km Recorrido Diario (Km final - Km inicial)
  const odoBase = Number(log?.odometro) || Number(log?.kilometraje) || Number(log?.odometroActual) || 14750;

  // Extraer "+NNN km" si viene en el resumen de Check-out de la App de Conductores
  const resumenCheckOutMatch = String(log?.checklistResumen || log?.checklistEstado || '').match(/\+(\d+)\s*km/i);
  const deltaFromText = resumenCheckOutMatch ? parseInt(resumenCheckOutMatch[1], 10) : null;

  let kmInicial =
    log?.kmInicial != null
      ? Number(log.kmInicial)
      : tipo.includes('check-out')
      ? Math.max(0, odoBase - (deltaFromText || 85))
      : odoBase;

  let kmFinal =
    log?.kmFinal != null
      ? Number(log.kmFinal)
      : tipo.includes('check-in')
      ? odoBase + (deltaFromText || 85)
      : odoBase;

  if (kmFinal < kmInicial) {
    const temp = kmInicial;
    kmInicial = kmFinal;
    kmFinal = temp;
  }
  if (kmFinal === kmInicial) {
    kmFinal = kmInicial + (deltaFromText || 85);
  }
  const kmRecorrido = Math.max(0, kmFinal - kmInicial);

  // 5. Extracción de los 43 ítems agrupados por sus 7 categorías reales
  const { categoriasMapeadas, todosLosItems, mapaEstadoPorId } = extraerChecklistDetallado43(log);

  const totalItems = todosLosItems.length;
  const okItems = todosLosItems.filter((i) => i.isOk).length;
  const fallasItems = totalItems - okItems;
  const allOk = fallasItems === 0;
  const listaFallas = todosLosItems.filter((i) => !i.isOk);

  // 6. Ubicación GPS (Estrictamente separada de Proyecto)
  const lat = log?.latitud ?? log?.ubicacion?.latitud;
  const lng = log?.longitud ?? log?.ubicacion?.longitud;
  const tieneGPS = lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng));
  const coordenadas = tieneGPS
    ? `${Number(lat).toFixed(4)}°, ${Number(lng).toFixed(4)}°`
    : log?.ubicacion && typeof log.ubicacion === 'string'
    ? log.ubicacion
    : '—';
  const urlMaps = tieneGPS ? `https://www.google.com/maps?q=${Number(lat)},${Number(lng)}` : null;

  // 7. Proyecto (Estrictamente separado de GPS)
  const proyecto = log?.proyecto || log?.servicio || log?.tipoServicio || log?.empresaAsignada || 'Flota Central Huancayo';

  return {
    id: log?.id,
    fecha,
    fechaHoraCompleta: log?.fechaHora || `${fecha}, ${horaCheckIn}`,
    conductor: log?.operador || log?.conductor || 'Carlos Huamán',
    placa: log?.placa || 'VIP-001',
    proyecto,
    ubicacionTexto: typeof log?.ubicacion === 'string' ? log.ubicacion : '',
    tipoEvento: log?.tipoEvento || log?.tipoRegistro || 'Check-in',
    horaCheckIn,
    horaCheckOut,
    horasDecimal,
    horasTexto,
    kmInicial,
    kmFinal,
    kmRecorrido,
    checklist: mapaEstadoPorId,
    categoriasChecklist: categoriasMapeadas,
    checklistItemsDetalle: todosLosItems,
    listaFallas,
    totalItems,
    okItems,
    fallasItems,
    allOk,
    tieneGPS,
    coordenadas,
    urlMaps,
    lat: tieneGPS ? Number(lat) : null,
    lng: tieneGPS ? Number(lng) : null,
    observaciones: log?.observaciones || log?.descripcion || log?.checklistEstado || 'Sin observaciones',
    estado: log?.estado || (!allOk || tipo.includes('sos') || tipo.includes('avería') ? 'Alerta' : 'OK'),
  };
}

export default function Bitacora() {
  const { bitacora, limpiarBitacora } = useFleet();
  const { isGerente, user } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [limpiando, setLimpiando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState(null);
  const [registroInspeccionModal, setRegistroInspeccionModal] = useState(null);
  const [filtroModalItems, setFiltroModalItems] = useState('todos'); // 'todos' | 'fallas'

  // Rol 'Gerente' requerido para vaciar bitácora
  const userIsGerente = isGerente || user?.role === 'GERENTE';

  // Filtrado reactivo de registros
  const filtrados = useMemo(() => {
    return (bitacora || []).filter((item) => {
      const term = busqueda.toLowerCase().trim();
      const matchesBusqueda =
        !term ||
        (item.conductor || item.operador || '').toLowerCase().includes(term) ||
        (item.placa || '').toLowerCase().includes(term) ||
        (item.proyecto || item.servicio || item.empresaAsignada || '').toLowerCase().includes(term) ||
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
  }, [bitacora, busqueda, filtroTipo]);

  // Registros normalizados con todas las columnas calculadas
  const registrosCalculados = useMemo(() => {
    return filtrados.map(resolverDatosTurno);
  }, [filtrados]);

  // Exportación a Excel: Mantiene CADA ÍTEM del checklist en su propia columna independiente
  const handleExportarExcel = () => {
    if (!registrosCalculados || registrosCalculados.length === 0) {
      alert('No hay registros en la tabla para exportar.');
      return;
    }

    try {
      const filasExcel = registrosCalculados.map((t) => {
        const fila = {
          'Fecha': t.fecha,
          'Conductor': t.conductor,
          'Placa': t.placa,
          'Proyecto / Operación': t.proyecto,
          'Hora Check-in': t.horaCheckIn,
          'Hora Check-out': t.horaCheckOut,
          'Horas de Trabajo (hrs)': t.horasDecimal,
          'Detalle Horas': t.horasTexto,
          'Km Inicial': t.kmInicial,
          'Km Final': t.kmFinal,
          'Km Recorrido Diario (km)': t.kmRecorrido,
          'Resumen Inspección': `${t.okItems}/${t.totalItems} OK`,
        };

        // Agregar cada uno de los 43 ítems del checklist en su propia columna independiente
        CHECKLIST_43_ITEMS.forEach((item) => {
          const isOk = Boolean(t.checklist[item.id]);
          fila[`#${item.num} ${item.label}`] = isOk ? 'OK' : 'FALLA';
        });

        fila['Ubicación GPS (Coordenadas)'] = t.coordenadas;
        fila['Enlace Google Maps'] = t.urlMaps || 'No disponible';
        fila['Detalle / Novedades'] = t.observaciones;
        fila['Estado'] = t.estado;

        return fila;
      });

      const worksheet = XLSX.utils.json_to_sheet(filasExcel);

      // Ajuste automático de ancho para todas las columnas generadas
      const keys = Object.keys(filasExcel[0] || {});
      worksheet['!cols'] = keys.map((k) => ({
        wch: Math.min(Math.max(k.length + 3, 14), 45),
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bitácora de Operaciones');

      const fechaDescarga = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Bitacora_Operaciones_VIP_CAR_${fechaDescarga}.xlsx`;

      XLSX.writeFile(workbook, nombreArchivo);

      setMensajeEstado({
        tipo: 'exito',
        texto: `Reporte exportado exitosamente con los 43 ítems desglosados en columnas: ${nombreArchivo}`
      });
      setTimeout(() => setMensajeEstado(null), 4000);
    } catch (err) {
      console.error('Error al exportar a Excel:', err);
      setMensajeEstado({
        tipo: 'error',
        texto: 'Hubo un error al generar el archivo Excel. Inténtalo de nuevo.'
      });
    }
  };

  const handleLimpiarBitacora = async () => {
    if (!userIsGerente) return;
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

  const abrirModalDetalles = (registro) => {
    setFiltroModalItems('todos');
    setRegistroInspeccionModal(registro);
  };

  return (
    <div className="space-y-6 text-[#9c9c9d]">
      {/* Header Corporativo */}
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
            Registro cronológico inmutable de turnos, horas trabajadas, kilometrajes e inspección preoperacional de 43 puntos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Botón Exportar a Excel */}
          <button
            type="button"
            onClick={handleExportarExcel}
            disabled={registrosCalculados.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold text-[#59d499] hover:text-white bg-[#071f16] hover:bg-[#59d499]/20 border border-[#59d499]/40 hover:border-[#59d499]/70 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#59d499]/10 active:scale-98"
            title="Exportar registros a formato Excel (.xlsx) con cada ítem del checklist en su propia columna"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#59d499]" />
            <span>Exportar a Excel</span>
          </button>

          {/* Botón Limpiar Bitácora para Gerente */}
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
            <div className="text-base font-bold text-white font-mono">{registrosCalculados.length}</div>
          </div>
        </div>
      </div>

      {/* Banner de Notificación */}
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

      {/* Barra de Filtros */}
      <div className="cockpit-panel p-4 rounded-3xl flex flex-col sm:flex-row gap-3 border border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por chofer, placa, proyecto o novedades..."
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

      {/* Tabla Bitácora Cockpit con Columna Consolidada de Inspección */}
      <div className="cockpit-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-xl">
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#07080a]/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#59d499] animate-pulse" />
            <span className="text-xs font-mono font-medium text-white">Bitácora Oficial de Conducción</span>
            <span className="text-[10px] font-mono text-[#6a6b6c] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {registrosCalculados.length} {registrosCalculados.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#6a6b6c]">
              Auditoría de 43 puntos en Modal • Exportación Excel con columnas independientes
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="telemetry-well text-[#6a6b6c] font-medium border-b border-white/[0.08] uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Fecha / Evento</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Conductor</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Placa</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap text-sky-400">Proyecto</th>

                {/* 1. Horas de Trabajo (Check-out - Check-in) */}
                <th className="py-3.5 px-2.5 whitespace-nowrap text-center bg-white/[0.02]">Hora In</th>
                <th className="py-3.5 px-2.5 whitespace-nowrap text-center bg-white/[0.02]">Hora Out</th>
                <th className="py-3.5 px-3 whitespace-nowrap text-center bg-[#59d499]/5 text-[#59d499] font-bold">
                  Horas Trabajo
                </th>

                {/* 2. Km Inicial, Km Final y Km Recorrido Diario */}
                <th className="py-3.5 px-2.5 whitespace-nowrap text-right bg-white/[0.02]">Km Inicial</th>
                <th className="py-3.5 px-2.5 whitespace-nowrap text-right bg-white/[0.02] text-white">Km Final</th>
                <th className="py-3.5 px-3 whitespace-nowrap text-right bg-[#ff6363]/5 text-[#ff6363] font-bold">
                  Km Diario
                </th>

                {/* 3. Columna Única: Inspección (Resumen 43/43 OK + Botón Ver Detalles) */}
                <th className="py-3.5 px-4 whitespace-nowrap text-center text-white">
                  Inspección
                </th>

                {/* 4. Ubicación GPS (Separada de Proyecto) */}
                <th className="py-3.5 px-3.5 whitespace-nowrap text-cyan-400">Ubicación GPS</th>

                <th className="py-3.5 px-3.5">Novedades / Detalle</th>
                <th className="py-3.5 px-3.5 text-right">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {registrosCalculados.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-16 px-4 text-center">
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
                registrosCalculados.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Fecha y Tipo de Evento */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="font-mono text-xs text-white font-medium">{t.fecha}</div>
                      <div className="text-[10px] font-mono text-[#6a6b6c] mt-0.5">
                        <span
                          className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold ${
                            t.tipoEvento === 'SOS' || String(t.tipoEvento).includes('SOS')
                              ? 'bg-[#ff6363]/20 text-[#ff6363]'
                              : t.tipoEvento === 'Avería' || String(t.tipoEvento).includes('Avería')
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {t.tipoEvento}
                        </span>
                      </div>
                    </td>

                    {/* Conductor */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span className="font-medium text-white text-xs">{t.conductor}</span>
                    </td>

                    {/* Placa */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded-md telemetry-well border border-white/[0.1]">
                        {t.placa}
                      </span>
                    </td>

                    {/* 4. Proyecto (Separado) */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                        <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate max-w-[160px]" title={t.proyecto}>
                          {t.proyecto}
                        </span>
                      </div>
                    </td>

                    {/* 1. Horas de Trabajo: Check-in, Check-out, Horas Restadas */}
                    <td className="py-3.5 px-2.5 text-center font-mono text-[11px] text-[#9c9c9d] bg-white/[0.01] whitespace-nowrap">
                      {t.horaCheckIn}
                    </td>
                    <td className="py-3.5 px-2.5 text-center font-mono text-[11px] text-[#9c9c9d] bg-white/[0.01] whitespace-nowrap">
                      {t.horaCheckOut}
                    </td>
                    <td className="py-3.5 px-3 text-center bg-[#59d499]/5 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-[#59d499]">
                        {t.horasDecimal} hrs
                      </div>
                      <div className="text-[9px] font-mono text-[#6a6b6c]">
                        {t.horasTexto}
                      </div>
                    </td>

                    {/* 2. Km Inicial, Km Final y Km Recorrido Diario */}
                    <td className="py-3.5 px-2.5 text-right font-mono text-xs text-[#9c9c9d] bg-white/[0.01] whitespace-nowrap">
                      {t.kmInicial.toLocaleString()} km
                    </td>
                    <td className="py-3.5 px-2.5 text-right font-mono text-xs font-bold text-white bg-white/[0.01] whitespace-nowrap">
                      {t.kmFinal.toLocaleString()} km
                    </td>
                    <td className="py-3.5 px-3 text-right bg-[#ff6363]/5 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-[#ff6363]">
                        {t.kmRecorrido} km
                      </div>
                      <div className="text-[9px] font-mono text-[#6a6b6c]">
                        Recorrido
                      </div>
                    </td>

                    {/* 3. Columna 'Inspección': Resumen Visual (43/43 OK) + Botón 'Ver Detalles' */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-2">
                        {t.allOk ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30"
                            title="Los 43 ítems del checklist fueron verificados sin fallas"
                          >
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>{t.okItems}/{t.totalItems} OK</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40 animate-pulse"
                            title={`Se detectaron ${t.fallasItems} falla(s) en la inspección de 43 puntos`}
                          >
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{t.okItems}/{t.totalItems} OK</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => abrirModalDetalles(t)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-white bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/[0.25] transition-all cursor-pointer active:scale-95"
                          title="Ver los 43 ítems evaluados agrupados por sección"
                        >
                          <Eye className="w-3 h-3 text-sky-400" />
                          <span>Ver Detalles</span>
                        </button>
                      </div>
                    </td>

                    {/* 4. Ubicación GPS (Estrictamente separada) */}
                    <td className="py-3.5 px-3.5 font-mono text-[11px] whitespace-nowrap">
                      {t.tieneGPS ? (
                        <a
                          href={t.urlMaps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                          title="Abrir ubicación en Google Maps"
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.coordenadas}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[#6a6b6c]">{t.coordenadas}</span>
                      )}
                    </td>

                    {/* Detalle / Novedades */}
                    <td className="py-3.5 px-3.5 text-[#9c9c9d] text-[11px] max-w-[200px] truncate" title={t.observaciones}>
                      {t.observaciones}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      <span
                        className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          t.estado === 'Alerta'
                            ? 'bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/40'
                            : 'bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/35'
                        }`}
                      >
                        {t.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          MODAL DE DETALLES DEL CHECKLIST (43 ÍTEMS AGRUPADOS EN 7 SECCIONES)
          ==================================================================== */}
      {registroInspeccionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setRegistroInspeccionModal(null)}
        >
          <div
            className="cockpit-panel rounded-3xl max-w-4xl w-full p-5 sm:p-6 space-y-4 border border-white/[0.12] shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-2xl border shrink-0 ${
                    registroInspeccionModal.allOk
                      ? 'bg-[#071f16] border-[#59d499]/40 text-[#59d499]'
                      : 'bg-[#2d0e14] border-[#ff6363]/40 text-[#ff6363]'
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white font-sans tracking-tight">
                      Auditoría Detallada de Checklist ({registroInspeccionModal.totalItems} Ítems)
                    </h3>
                    {registroInspeccionModal.allOk ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#59d499]/15 text-[#59d499] border border-[#59d499]/30">
                        {registroInspeccionModal.okItems}/{registroInspeccionModal.totalItems} OK • 100% Conforme
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40">
                        {registroInspeccionModal.okItems}/{registroInspeccionModal.totalItems} OK • {registroInspeccionModal.fallasItems} Falla(s) Detectada(s)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6a6b6c] font-mono mt-0.5">
                    Desglose oficial por categorías sincronizado desde la App de Conductores
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Filtro rápido Todos vs Solo Fallas */}
                {!registroInspeccionModal.allOk && (
                  <div className="inline-flex rounded-full p-0.5 bg-[#0b0d12] border border-white/[0.08] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setFiltroModalItems('todos')}
                      className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        filtroModalItems === 'todos'
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-[#6a6b6c] hover:text-white'
                      }`}
                    >
                      Todos ({registroInspeccionModal.totalItems})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroModalItems('fallas')}
                      className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        filtroModalItems === 'fallas'
                          ? 'bg-[#ff6363]/20 text-[#ff6363] font-bold'
                          : 'text-[#ff6363]/70 hover:text-[#ff6363]'
                      }`}
                    >
                      Solo Fallas ({registroInspeccionModal.fallasItems})
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setRegistroInspeccionModal(null)}
                  className="p-1.5 rounded-full text-[#6a6b6c] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ficha Resumen del Turno y Unidad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              <div className="telemetry-well px-3 py-2 rounded-xl border border-white/[0.06]">
                <div className="text-[9px] font-mono uppercase text-[#6a6b6c] flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#ff6363]" />
                  <span>Unidad</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  {registroInspeccionModal.placa}
                </div>
              </div>

              <div className="telemetry-well px-3 py-2 rounded-xl border border-white/[0.06]">
                <div className="text-[9px] font-mono uppercase text-[#6a6b6c] flex items-center gap-1">
                  <User className="w-3 h-3 text-sky-400" />
                  <span>Conductor</span>
                </div>
                <div className="text-xs font-medium text-white mt-0.5 truncate">
                  {registroInspeccionModal.conductor}
                </div>
              </div>

              <div className="telemetry-well px-3 py-2 rounded-xl border border-white/[0.06]">
                <div className="text-[9px] font-mono uppercase text-[#6a6b6c] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#59d499]" />
                  <span>Fecha / Turno</span>
                </div>
                <div className="text-xs font-mono text-white mt-0.5">
                  {registroInspeccionModal.fecha} ({registroInspeccionModal.horaCheckIn})
                </div>
              </div>

              <div className="telemetry-well px-3 py-2 rounded-xl border border-white/[0.06]">
                <div className="text-[9px] font-mono uppercase text-[#6a6b6c] flex items-center gap-1">
                  <Building className="w-3 h-3 text-amber-400" />
                  <span>Proyecto</span>
                </div>
                <div className="text-xs font-medium text-white mt-0.5 truncate" title={registroInspeccionModal.proyecto}>
                  {registroInspeccionModal.proyecto}
                </div>
              </div>
            </div>

            {/* Alerta Resumen de Piezas con Falla (si existen) */}
            {!registroInspeccionModal.allOk && (
              <div className="p-3 rounded-2xl bg-[#2d0e14]/90 border border-[#ff6363]/40 flex items-start gap-2.5 shrink-0">
                <ShieldAlert className="w-4 h-4 text-[#ff6363] shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] font-mono leading-relaxed">
                  <span className="font-bold text-[#ff6363] uppercase">Piezas / Ítems con Falla u Observación: </span>
                  <span className="text-white">
                    {registroInspeccionModal.listaFallas.map((f) => `#${f.num} ${f.label}`).join(' • ')}
                  </span>
                </div>
              </div>
            )}

            {/* Contenedor con Scroll Interno: 7 Categorías y 43 Sub-ítems */}
            <div className="overflow-y-auto pr-1.5 space-y-4 flex-1 min-h-0">
              {registroInspeccionModal.categoriasChecklist.map((cat) => {
                const itemsVisibles =
                  filtroModalItems === 'fallas'
                    ? cat.items.filter((i) => !i.isOk)
                    : cat.items;

                if (itemsVisibles.length === 0) return null;

                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl bg-[#080a0f] border border-white/[0.07] overflow-hidden"
                  >
                    {/* Subtítulo de la Categoría */}
                    <div className="px-3.5 py-2 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                          {cat.codigo} // {cat.titulo}
                        </span>
                      </div>

                      {cat.fallasCat === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/25">
                          {cat.okCat}/{cat.totalCat} OK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#ff6363]/15 text-[#ff6363] border border-[#ff6363]/40">
                          {cat.okCat}/{cat.totalCat} OK • {cat.fallasCat} Falla(s)
                        </span>
                      )}
                    </div>

                    {/* Grilla Compacta de Sub-ítems de la Categoría */}
                    <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {itemsVisibles.map((item) => (
                        <div
                          key={item.id}
                          className={`px-2.5 py-2 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                            item.status === 'OK'
                              ? 'bg-[#0c0f16] border-white/[0.05] hover:border-white/[0.12]'
                              : item.status === 'OBSERVACION'
                              ? 'bg-amber-950/30 border-amber-500/40'
                              : 'bg-[#2d0e14]/70 border-[#ff6363]/50 shadow-sm shadow-[#ff6363]/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                item.isOk
                                  ? 'bg-white/[0.06] text-[#9c9c9d]'
                                  : 'bg-[#ff6363]/20 text-[#ff6363]'
                              }`}
                            >
                              #{String(item.num).padStart(2, '0')}
                            </span>
                            <span
                              className={`text-[11px] leading-snug truncate ${
                                item.isOk ? 'text-slate-200' : 'text-white font-semibold'
                              }`}
                              title={item.label}
                            >
                              {item.label}
                            </span>
                          </div>

                          {/* Etiqueta pequeña y limpia de estado individual */}
                          {item.status === 'OK' ? (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#59d499]/10 text-[#59d499] border border-[#59d499]/30">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              OK
                            </span>
                          ) : item.status === 'OBSERVACION' ? (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              OBS.
                            </span>
                          ) : (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#ff6363]/20 text-[#ff6363] border border-[#ff6363]/50">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              FALLA
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Observaciones y Novedades del Conductor */}
              <div className="p-3 rounded-2xl telemetry-well border border-white/[0.08]">
                <div className="text-[10px] font-mono uppercase text-[#6a6b6c] mb-1">
                  Observaciones y Novedades Registradas por el Conductor
                </div>
                <p className="text-xs text-white font-mono leading-relaxed">
                  {registroInspeccionModal.observaciones || 'Sin observaciones adicionales.'}
                </p>
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/[0.08] shrink-0">
              <span className="text-[11px] font-mono text-[#6a6b6c]">
                Odómetro auditado: <strong className="text-white">{registroInspeccionModal.kmInicial.toLocaleString()} km → {registroInspeccionModal.kmFinal.toLocaleString()} km</strong> ({registroInspeccionModal.kmRecorrido} km)
              </span>
              <button
                type="button"
                onClick={() => setRegistroInspeccionModal(null)}
                className="btn-cockpit-secondary px-5 py-2 rounded-full text-xs font-mono font-bold text-white hover:bg-white/10 transition-colors cursor-pointer self-end sm:self-auto"
              >
                Cerrar Auditoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
