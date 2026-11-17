import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

/**
 * Diccionario de imágenes específicas y únicas por Marca y Modelo exacto.
 * Extraídas del portal oficial https://vipcarhuancayo.com/ y complementadas con
 * Wikimedia Commons / CDNs públicos estables para que ningún modelo repita fotografía.
 */
export const VEHICLE_IMAGE_DICTIONARY = {
  // === 1. GAMA TOYOTA HILUX (Imágenes reales verificadas: mineras equipadas y doble cabina estándar) ===
  'Toyota Hilux 4x4 SRV Minera':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-hilux-4x4-1.jpg',
  'Toyota Hilux 4x4 SR Minera':
    'https://vipcarhuancayo.com/wp-content/uploads/2022/05/WhatsApp-Image-2022-01-20-at-9.19.21-PM-1.jpeg',
  'Toyota Hilux 4x4 Doble Cabina Minera':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/07/toyota-hilux.jpg',
  'Toyota Hilux 4x4 DX Minera':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/portada-alquiler-4x4-1.jpg',
  'Toyota Hilux 4x4 SR 2.8L Minera':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Toyota_Hilux_Revo_4x4_Double-Cab_2.8_Rocco.jpg?width=800',
  'Toyota Hilux 4x4 Doble Cabina':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Toyota_Hilux_Revo_Z-Edition_Double-Cab_2.4_Mid.jpg?width=800',

  // === 2. OTRAS CAMIONETAS PICK-UP 4X4 Y SUVS ===
  'Toyota Fortuner 4x4 D-4D Minera':
    'https://vipcarhuancayo.com/wp-content/uploads/2022/05/WhatsApp-Image-2022-01-20-at-9.19.22-PM-3.jpeg',
  'Toyota Fortuner 4x4 D-4D':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/fortuner-4x4-1.jpg',
  'Mitsubishi L200 4x4 High Power':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fc4%2FMitsubishi_Triton_L200_%2528Brunei_2024%2529.jpg&w=900&q=85',
  'Mitsubishi L200 4x4 GLS Minera':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F75%2FMitsubishi_L200_Double_Cab.jpg&w=900&q=85',
  'Nissan Frontier PRO-4X 4x4':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Nissan_Frontier_2.3_Pro_4X_(Argentina).jpg?width=800',
  'Nissan Frontier 4x4 XE Minera':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Ff%2Ff4%2FNISSAN_NAVARA_D23_China.jpg&w=900&q=85',
  'Ford Ranger 4x4 XLT Biturbo':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F28%2FFord_Ranger_%2528T6%252C_P703%2529_Wildtrak_IMG_7320.jpg&w=900&q=85',

  // === 3. VANS, MINIVANS Y COMBIS (TOYOTA HIACE, HYUNDAI H1, STARIA, SPRINTER) ===
  'Mercedes-Benz Sprinter 516 CDI Pasajeros (19 Pax)':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mercedes-benz-sprinter-21.jpg',
  'Mercedes-Benz Sprinter Pasajeros':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mercedes-benz-sprinter.jpg',
  'Hyundai H1 Grand Miniván (11 Pax)':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/hyundai-h1.jpg',
  'Hyundai H-1 Minivan':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/hyundai-h1.jpg',
  'Toyota HiAce Commuter Miniván':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/10/toyota-hiace.jpg',
  'Toyota HiAce Minibús Pasajeros':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Toyota_HiAce_Commuter.jpg?width=800',
  'HiAce Minibús Pasajeros':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Toyota_HiAce_Commuter.jpg?width=800',
  'Hyundai Staria 2.2 CRDi Miniván':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F75%2FHyundai_Staria_1X7A0321.jpg&w=900&q=85',

  // === 4. MINIBUSES (COASTER vs COUNTY) Y BUSES (MERCEDES-BENZ vs SCANIA) ===
  'Toyota Coaster Minibús (28 Pax)':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/coaster-30-p.jpg',
  'Hyundai County Minibús (28 Pax)':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/coaster-hyundai.jpg',
  'Mercedes-Benz Bus Interurbano OF-1721':
    'https://vipcarhuancayo.com/wp-content/uploads/2020/11/bus-mercedez.jpg',
  'Mercedes-Benz Bus Interprovincial 45 Pax':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/bus-45-marcolopo-flota.jpg',
  'Scania Bus K360 Minero 4x2':
    'https://vipcarhuancayo.com/wp-content/uploads/2025/01/bus01.jpg',
  'Scania Bus Gran Turismo 50 Pax':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fe%2Fe5%2FK7TCT_Taylors_Coach_Travel_Scania_K410CB6_with_Irizar_i6s_bodywork.jpg&w=900&q=85',

  // === 5. RESPALDOS GENÉRICOS POR MARCA O TIPO DE CARROCERÍA ===
  'Mitsubishi L200':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fc%2Fc4%2FMitsubishi_Triton_L200_%2528Brunei_2024%2529.jpg&w=900&q=85',
  'Nissan Frontier':
    'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Nissan_Frontier_2.3_Pro_4X_(Argentina).jpg?width=800',
  'Ford Ranger':
    'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F28%2FFord_Ranger_%2528T6%252C_P703%2529_Wildtrak_IMG_7320.jpg&w=900&q=85',
  'Toyota HiAce':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/10/toyota-hiace.jpg',
  'Camioneta':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-hilux-4x4-1.jpg',
  'Camioneta Cerrada':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/fortuner-4x4-1.jpg',
  'Combi':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/10/toyota-hiace.jpg',
  'Minivan':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/hyundai-h1.jpg',
  'Minibus':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/coaster-30-p.jpg',
  'Sprinter':
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mercedes-benz-sprinter-21.jpg',
  'Bus':
    'https://vipcarhuancayo.com/wp-content/uploads/2020/11/bus-mercedez.jpg',
  DEFAULT:
    'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-hilux-4x4-1.jpg',
};

// URLs descartadas, genéricas o erróneas (como la RAV4 roja, la SUV blanca o la Tacoma color arena)
// que pudieran haber quedado cacheadas en Firebase o localStorage
const DISCARDED_OR_GENERIC_URLS = new Set([
  'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-hilux-4x4-1.jpg',
  'https://vipcarhuancayo.com/wp-content/uploads/2021/10/toyota-hiace.jpg',
  'https://vipcarhuancayo.com/wp-content/uploads/2021/07/camioneta-inicio.jpg',
  'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mitsubishi-l200.jpg',
  'https://vipcarhuancayo.com/wp-content/uploads/2021/08/nissan-frontier.jpg',
  'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=900&q=80',
  'https://wsrv.nl/?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F4%2F49%2FToyota_HiLux_AN120-AN130_Crew_Cab.jpg&w=900&q=85',
  '/logo-vipcar.png',
  '/logo-vip.png',
]);

/**
 * Obtiene la URL exacta del diccionario según la marca, el modelo específico o el tipo de carrocería.
 */
export function obtenerImagenPorMarcaModelo(vehicle) {
  if (!vehicle) return VEHICLE_IMAGE_DICTIONARY.DEFAULT;

  const marca = (vehicle.marca || '').trim();
  const modelo = (vehicle.modelo || '').trim();
  const tipo = (vehicle.tipo || '').trim();
  const claveExacta = `${marca} ${modelo}`.trim();
  const nombreLower = `${claveExacta} ${tipo}`.toLowerCase();

  // 1. Coincidencia exacta por "Marca Modelo" o solo "Modelo"
  if (VEHICLE_IMAGE_DICTIONARY[claveExacta]) {
    return VEHICLE_IMAGE_DICTIONARY[claveExacta];
  }
  if (VEHICLE_IMAGE_DICTIONARY[modelo]) {
    return VEHICLE_IMAGE_DICTIONARY[modelo];
  }

  // 2. Prioridad para Vans / Combis / Minibuses Toyota HiAce (antes de evaluar otras reglas de Toyota)
  if (nombreLower.includes('hiace') || nombreLower.includes('combi')) {
    if (nombreLower.includes('pasajeros') || nombreLower.includes('minibús') || nombreLower.includes('minibus')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota HiAce Minibús Pasajeros'];
    }
    return VEHICLE_IMAGE_DICTIONARY['Toyota HiAce Commuter Miniván'];
  }

  // 3. Reglas específicas para variantes de Toyota Hilux
  if (nombreLower.includes('hilux')) {
    if (nombreLower.includes('srv')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 SRV Minera'];
    }
    if (nombreLower.includes('dx')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 DX Minera'];
    }
    if (nombreLower.includes('doble cabina minera')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 Doble Cabina Minera'];
    }
    if (nombreLower.includes('doble cabina')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 Doble Cabina'];
    }
    if (nombreLower.includes('sr 2.8')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 SR 2.8L Minera'];
    }
    if (nombreLower.includes('sr')) {
      return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 SR Minera'];
    }
    return VEHICLE_IMAGE_DICTIONARY['Toyota Hilux 4x4 SRV Minera'];
  }

  // 4. Reglas específicas para Mitsubishi L200 (High Power vs GLS)
  if (nombreLower.includes('l200') || nombreLower.includes('mitsubishi')) {
    if (nombreLower.includes('gls')) {
      return VEHICLE_IMAGE_DICTIONARY['Mitsubishi L200 4x4 GLS Minera'];
    }
    return VEHICLE_IMAGE_DICTIONARY['Mitsubishi L200 4x4 High Power'];
  }

  // 5. Reglas específicas para Nissan Frontier (PRO-4X vs XE)
  if (nombreLower.includes('frontier') || nombreLower.includes('nissan')) {
    if (nombreLower.includes('xe')) {
      return VEHICLE_IMAGE_DICTIONARY['Nissan Frontier 4x4 XE Minera'];
    }
    return VEHICLE_IMAGE_DICTIONARY['Nissan Frontier PRO-4X 4x4'];
  }

  // 6. Ford Ranger y Toyota Fortuner
  if (nombreLower.includes('ranger') || nombreLower.includes('ford')) {
    return VEHICLE_IMAGE_DICTIONARY['Ford Ranger 4x4 XLT Biturbo'];
  }
  if (nombreLower.includes('fortuner')) {
    return nombreLower.includes('minera')
      ? VEHICLE_IMAGE_DICTIONARY['Toyota Fortuner 4x4 D-4D Minera']
      : VEHICLE_IMAGE_DICTIONARY['Toyota Fortuner 4x4 D-4D'];
  }

  // 7. Minibuses y Vans (Coaster vs County vs Sprinter vs H1 vs Staria)
  if (nombreLower.includes('coaster')) {
    return VEHICLE_IMAGE_DICTIONARY['Toyota Coaster Minibús (28 Pax)'];
  }
  if (nombreLower.includes('county')) {
    return VEHICLE_IMAGE_DICTIONARY['Hyundai County Minibús (28 Pax)'];
  }
  if (nombreLower.includes('sprinter')) {
    return nombreLower.includes('516')
      ? VEHICLE_IMAGE_DICTIONARY['Mercedes-Benz Sprinter 516 CDI Pasajeros (19 Pax)']
      : VEHICLE_IMAGE_DICTIONARY['Mercedes-Benz Sprinter Pasajeros'];
  }
  if (nombreLower.includes('staria')) {
    return VEHICLE_IMAGE_DICTIONARY['Hyundai Staria 2.2 CRDi Miniván'];
  }
  if (nombreLower.includes('h1') || nombreLower.includes('h-1')) {
    return VEHICLE_IMAGE_DICTIONARY['Hyundai H1 Grand Miniván (11 Pax)'];
  }

  // 8. Buses (Mercedes-Benz OF-1721 vs Mercedes-Benz 45 Pax vs Scania K360 vs Scania Gran Turismo 50 Pax)
  if (nombreLower.includes('scania')) {
    return nombreLower.includes('gran turismo') || nombreLower.includes('50')
      ? VEHICLE_IMAGE_DICTIONARY['Scania Bus Gran Turismo 50 Pax']
      : VEHICLE_IMAGE_DICTIONARY['Scania Bus K360 Minero 4x2'];
  }
  if (nombreLower.includes('mercedes') && nombreLower.includes('bus')) {
    return nombreLower.includes('45') || nombreLower.includes('interprovincial')
      ? VEHICLE_IMAGE_DICTIONARY['Mercedes-Benz Bus Interprovincial 45 Pax']
      : VEHICLE_IMAGE_DICTIONARY['Mercedes-Benz Bus Interurbano OF-1721'];
  }

  // 9. Respaldo por Tipo de Unidad
  if (tipo && VEHICLE_IMAGE_DICTIONARY[tipo]) {
    return VEHICLE_IMAGE_DICTIONARY[tipo];
  }

  return VEHICLE_IMAGE_DICTIONARY.DEFAULT;
}

/**
 * Resuelve la imagen final del vehículo:
 * Utiliza el mapeo verificado por modelo para garantizar que el tipo de carrocería
 * coincida estrictamente con el nombre del modelo, incluso si en Firebase o localStorage
 * había quedado guardada una URL antigua o vacía.
 */
export function obtenerImagenVehiculo(vehicle) {
  const dictionaryImg = obtenerImagenPorMarcaModelo(vehicle);
  const rawImg = typeof vehicle?.imagen === 'string' ? vehicle.imagen.trim() : '';

  if (!rawImg || DISCARDED_OR_GENERIC_URLS.has(rawImg)) {
    return dictionaryImg;
  }

  // Si el vehículo coincide con un modelo específico de nuestro diccionario, priorizar la foto verificada del modelo
  if (dictionaryImg && dictionaryImg !== VEHICLE_IMAGE_DICTIONARY.DEFAULT) {
    return dictionaryImg;
  }

  return rawImg;
}

export default function VehicleCard({ vehicle }) {
  if (!vehicle) return null;

  const imagenResuelta = obtenerImagenVehiculo(vehicle);
  const imagenFallback = obtenerImagenPorMarcaModelo(vehicle);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-700/50 hover:border-slate-600/60 transition-all duration-300 shadow-xl">
      {/* 1. Fotografía a sangre con gradiente sutil y badges flotantes */}
      <div className="relative h-52 bg-[#050608] overflow-hidden">
        <img
          src={imagenResuelta}
          alt={`${vehicle.marca || ''} ${vehicle.modelo || 'Unidad'}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              e.target.src !== imagenFallback
                ? imagenFallback
                : VEHICLE_IMAGE_DICTIONARY.DEFAULT;
          }}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-[#080a0d]/20 to-transparent" />

        {/* Badges de cabecera flotantes */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 font-mono text-[10px]">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ff6363] font-bold border border-white/10">
            {vehicle.identificadorB2B?.codigo || 'Unidad'}
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-medium border border-white/10">
            {vehicle.traccion}
          </span>
        </div>

        <div className="absolute top-3.5 right-3.5 font-mono text-[10px]">
          <span
            className={`px-3 py-1 rounded-full font-bold backdrop-blur-md ${
              vehicle.estadoOperativo === 'Disponible'
                ? 'bg-[#59d499]/20 text-[#59d499] border border-[#59d499]/30'
                : 'bg-white/10 text-zinc-300 border border-white/10'
            }`}
          >
            {vehicle.estadoOperativo}
          </span>
        </div>
      </div>

      {/* 2. Cuerpo Editorial de la Ficha */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Título Principal y Subtítulo en Inter */}
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug font-sans">
              {vehicle.marca} {vehicle.modelo}
            </h3>
            <p className="text-xs text-zinc-400 font-sans font-normal mt-0.5">
              {vehicle.anio} • {vehicle.tipo} • {vehicle.motor}
            </p>
          </div>

          {/* Especificaciones Técnicas: Capacidad de Carga & Certificaciones de Garita */}
          <div className="grid grid-cols-2 gap-3 pt-1 items-start">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-1">
                Capacidad de Carga
              </span>
              <span className="text-white font-mono tabular-nums text-xs font-semibold">
                {vehicle.capacidadCarga}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-1.5">
                Certificaciones de Garita
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.certificaciones?.map((cert, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium bg-zinc-800/90 text-zinc-300"
                  >
                    {cert} Homologado
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de equipamiento limpia en grid-cols-2 sin bordes individuales */}
          <div className="pt-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans block mb-2">
              Equipamiento de Seguridad
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {vehicle.equipamiento?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300 font-sans font-normal">
                  <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Fila Inferior: Tarifa y Botón de Acción en Cápsula Completa (Rojo para móvil) */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/[0.04]">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium font-sans">
              Tarifa Corporativa
            </div>
            <div className="text-xl font-bold text-white font-mono tabular-nums leading-none mt-1">
              S/ {Math.round((vehicle.tarifaDiariaUSD || 0) * 3.765)}{' '}
              <span className="text-[11px] font-normal text-zinc-500 font-sans">/día</span>
            </div>
          </div>

          <Link
            to={`/b2b/cotizar?modelo=${encodeURIComponent(vehicle.modelo)}`}
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer shadow-lg shadow-red-950/40 active:scale-98 font-sans"
          >
            <span>Cotizar {vehicle.identificadorB2B?.codigo || 'Unidad'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
