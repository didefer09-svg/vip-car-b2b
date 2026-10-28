/**
 * VIP CAR B2B - Flota Oficial Extraída de https://vipcarhuancayo.com/
 * Arrendamiento corporativo, minería, construcción y transporte en Junín y sierra central.
 * Placas reales protegidas en el portal B2B bajo el formato: Unidad #01 (W4E-***).
 */

export const INITIAL_VEHICLES = [
  {
    id: 'veh-01',
    placa: 'W4E-892', // Enmascarada en B2B: Unidad #01 (W4E-***)
    marca: 'Toyota',
    modelo: 'Hilux 4x4 Doble Cabina Minera',
    anio: 2024,
    tipo: 'Pickup 4x4',
    traccion: '4x4',
    motor: '2.8L Turbo Diesel 1GD-FTV (201 HP)',
    capacidadCarga: '1,000 kg (5 Asientos)',
    certificaciones: ['Socavón', 'Superficie'],
    equipamiento: [
      'Antena Pértiga LED 3m',
      'Circulina Ámbar Imantada',
      'Jaula de Protección Interna',
      'Barra Antivuelco Exterior',
      'Alarma de Retroceso',
      'Tacos de Ruedas de Madera',
      'Triángulos de Seguridad',
      'Extintor PQS 6kg',
      'Botiquín Primeros Auxilios',
      'Láminas de Seguridad',
      'Sensor GPS Satelital Dual',
      'Neblineros y Faro Pirata'
    ],
    odometroActual: 14750,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 250 km (AMARILLO)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Minera Chinalco Perú (Toromocho)',
    conductorActual: 'Carlos Huamán',
    nivelCombustible: 75,
    tarifaDiariaUSD: 110,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-hilux-4x4-1.jpg',
    documentos: {
      soat: 'Vigente hasta 12/2026 (Rimac)',
      poliza: 'Rimac Seguros Todo Riesgo Minero #982314',
      revisionTecnica: 'Aprobado MTC Junín 03/2026',
    }
  },
  {
    id: 'veh-02',
    placa: 'W2A-710', // Enmascarada en B2B: Unidad #02 (W2A-***)
    marca: 'Toyota',
    modelo: 'Fortuner 4x4 D-4D 7 Asientos',
    anio: 2024,
    tipo: 'SUV 4x4',
    traccion: '4x4',
    motor: '2.8L Turbo Diesel Intercooler (201 HP)',
    capacidadCarga: '750 kg (7 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Circulina Ámbar Imantada',
      'Botiquín Primeros Auxilios',
      'Extintor PQS 6kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Alarma de Retroceso',
      'Tacos de Ruedas',
      'A/C Climatizador Bi-zona'
    ],
    odometroActual: 20120,
    ultimoMantenimiento: 15000,
    intervaloMantenimiento: 5000, // Siguiente a 20,000 km -> Pasado por 120 km (ROJO)
    estadoOperativo: 'Mantenimiento Urgente',
    empresaAsignada: 'Volcan Compañía Minera (Yauli)',
    conductorActual: 'Marcos Mendoza',
    nivelCombustible: 40,
    tarifaDiariaUSD: 130,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/fortuner-4x4-1.jpg',
    documentos: {
      soat: 'Vigente hasta 08/2026 (Pacífico)',
      poliza: 'Pacífico Seguros Flota Corporativa #771209',
      revisionTecnica: 'Vencido - Requiere servicio preventivo',
    }
  },
  {
    id: 'veh-03',
    placa: 'W5B-441', // Enmascarada en B2B: Unidad #03 (W5B-***)
    marca: 'Toyota',
    modelo: 'Land Cruiser Prado TXL 4WD',
    anio: 2023,
    tipo: 'SUV 4x4',
    traccion: '4x4',
    motor: '3.0L Turbo Diesel D-4D 4WD',
    capacidadCarga: '800 kg (7 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Circulina Ámbar',
      'Botiquín Primeros Auxilios',
      'Extintor PQS 6kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Tacos de Ruedas',
      'Alarma de Retroceso',
      'A/C Climatizado'
    ],
    odometroActual: 8200,
    ultimoMantenimiento: 5000,
    intervaloMantenimiento: 5000, // Siguiente a 10,000 km -> Faltan 1,800 km (VERDE)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Constructora San Martín (Carretera Central)',
    conductorActual: 'Jorge Quispe',
    nivelCombustible: 90,
    tarifaDiariaUSD: 160,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/land-cruiser-prado.jpg',
    documentos: {
      soat: 'Vigente hasta 10/2026 (Rimac)',
      poliza: 'Rimac Flotas Ejecutivas #661244',
      revisionTecnica: 'Aprobado MTC 04/2026',
    }
  },
  {
    id: 'veh-04',
    placa: 'W1Z-390', // Enmascarada en B2B: Unidad #04 (W1Z-***)
    marca: 'Toyota',
    modelo: 'RAV4 2.0 AWD',
    anio: 2023,
    tipo: 'SUV',
    traccion: '4x2',
    motor: '2.0L Dual VVT-i (170 HP)',
    capacidadCarga: '550 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Triángulos de Seguridad',
      'Aire Acondicionado'
    ],
    odometroActual: 19850,
    ultimoMantenimiento: 15000,
    intervaloMantenimiento: 5000, // Siguiente a 20,000 km -> Faltan 150 km (AMARILLO)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Nexa Resources (El Porvenir)',
    conductorActual: 'Raúl Soto',
    nivelCombustible: 60,
    tarifaDiariaUSD: 85,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-rav-4.jpg',
    documentos: {
      soat: 'Vigente hasta 11/2026 (La Positiva)',
      poliza: 'La Positiva Flota #330198',
      revisionTecnica: 'Aprobado MTC 01/2026',
    }
  },
  {
    id: 'veh-05',
    placa: 'W3M-112', // Enmascarada en B2B: Unidad #05 (W3M-***)
    marca: 'Hyundai',
    modelo: 'Tucson 2.0 GL Automática',
    anio: 2024,
    tipo: 'SUV',
    traccion: '4x2',
    motor: '2.0L Nu MPI Automático (154 HP)',
    capacidadCarga: '500 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Alarma de Retroceso',
      'Aire Acondicionado'
    ],
    odometroActual: 3100,
    ultimoMantenimiento: 0,
    intervaloMantenimiento: 5000, // Siguiente a 5,000 km -> Faltan 1,900 km (VERDE)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Central Huancayo (Patio)',
    conductorActual: null,
    nivelCombustible: 100,
    tarifaDiariaUSD: 80,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/Hyundai-tucson.jpg',
    documentos: {
      soat: 'Vigente hasta 01/2027 (Rimac)',
      poliza: 'Rimac Flotas #889211',
      revisionTecnica: 'Exonerado por año nuevo 2024',
    }
  },
  {
    id: 'veh-06',
    placa: 'W4F-903', // Enmascarada en B2B: Unidad #06 (W4F-***)
    marca: 'Hyundai',
    modelo: 'Santa Fe 2.2 CRDi (3 Filas)',
    anio: 2023,
    tipo: 'SUV',
    traccion: '4x2',
    motor: '2.2L Turbo Diesel Intercooler (197 HP)',
    capacidadCarga: '700 kg (7 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 6kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Alarma de Retroceso',
      'Aire Acondicionado Doble Zona'
    ],
    odometroActual: 10450,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 4,550 km (VERDE)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base La Oroya',
    conductorActual: null,
    nivelCombustible: 85,
    tarifaDiariaUSD: 100,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/Hyundai-santa-fe.jpg',
    documentos: {
      soat: 'Vigente hasta 05/2026 (Mapfre)',
      poliza: 'Mapfre Corporativo #440021',
      revisionTecnica: 'Aprobado MTC 02/2026',
    }
  },
  {
    id: 'veh-07',
    placa: 'W6C-284', // Enmascarada en B2B: Unidad #07 (W6C-***)
    marca: 'Kia',
    modelo: 'Sportage 2.0 EX',
    anio: 2024,
    tipo: 'SUV',
    traccion: '4x2',
    motor: '2.0L MPI Gasolina (154 HP)',
    capacidadCarga: '520 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Aire Acondicionado Climatizado'
    ],
    odometroActual: 9600,
    ultimoMantenimiento: 5000,
    intervaloMantenimiento: 5000, // Siguiente a 10,000 km -> Faltan 400 km (AMARILLO)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Minera Corona (Yauricocha)',
    conductorActual: 'Gustavo Meza',
    nivelCombustible: 70,
    tarifaDiariaUSD: 85,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2025/01/kiasportage2.jpg',
    documentos: {
      soat: 'Vigente hasta 09/2026 (Pacífico)',
      poliza: 'Pacífico Seguros #551922',
      revisionTecnica: 'Aprobado MTC 02/2026',
    }
  },
  {
    id: 'veh-08',
    placa: 'W1T-553', // Enmascarada en B2B: Unidad #08 (W1T-***)
    marca: 'Toyota',
    modelo: 'HiAce Commuter Minibús (17 Pax)',
    anio: 2023,
    tipo: 'Van / Minibús',
    traccion: '4x2',
    motor: '2.8L Turbo Diesel 1GD (174 HP)',
    capacidadCarga: '1,400 kg (17 Pasajeros)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Circulina Ámbar',
      'Botiquín Primeros Auxilios',
      'Extintor 6kg',
      'Alarma de Retroceso',
      'Láminas de Seguridad',
      'GPS Satelital Dual',
      'Cinturones Certificados 3 Puntos',
      'Aire Acondicionado Frontal y Trasero'
    ],
    odometroActual: 24600,
    ultimoMantenimiento: 20000,
    intervaloMantenimiento: 5000, // Siguiente a 25,000 km -> Faltan 400 km (AMARILLO)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Minera Chinalco Perú (Toromocho)',
    conductorActual: 'Edwin Palomino',
    nivelCombustible: 80,
    tarifaDiariaUSD: 140,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/10/toyota-hiace.jpg',
    documentos: {
      soat: 'Vigente hasta 07/2026 (Rimac)',
      poliza: 'Rimac Seguros Transporte #223401',
      revisionTecnica: 'Aprobado MTC 03/2026',
    }
  },
  {
    id: 'veh-09',
    placa: 'W7H-192', // Enmascarada en B2B: Unidad #09 (W7H-***)
    marca: 'Hyundai',
    modelo: 'H1 Grand Miniván (12 Pax)',
    anio: 2024,
    tipo: 'Van / Minibús',
    traccion: '4x2',
    motor: '2.5L CRDi Turbo Diesel (170 HP)',
    capacidadCarga: '1,100 kg (12 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor 6kg',
      'Alarma de Retroceso',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Aire Acondicionado Bi-zona'
    ],
    odometroActual: 12100,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 2,900 km (VERDE)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Huancayo (Patio Central)',
    conductorActual: null,
    nivelCombustible: 95,
    tarifaDiariaUSD: 120,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/hyundai-h1.jpg',
    documentos: {
      soat: 'Vigente hasta 11/2026 (La Positiva)',
      poliza: 'La Positiva Pasajeros #778401',
      revisionTecnica: 'Exonerado por año 2024',
    }
  },
  {
    id: 'veh-10',
    placa: 'W3K-840', // Enmascarada en B2B: Unidad #10 (W3K-***)
    marca: 'Mercedes-Benz',
    modelo: 'Sprinter 515 CDI Minibús (21 Pax)',
    anio: 2023,
    tipo: 'Van / Minibús',
    traccion: '4x2',
    motor: '2.2L CDI Bi-Turbo Diesel (150 HP)',
    capacidadCarga: '2,200 kg (21 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Circulina Ámbar',
      'Botiquín Especial',
      'Extintor 6kg',
      'Alarma de Retroceso',
      'Láminas de Seguridad',
      'GPS Satelital Dual',
      'Tacógrafo Digital',
      'Salida de Emergencia',
      'Aire Acondicionado Central'
    ],
    odometroActual: 30150,
    ultimoMantenimiento: 25000,
    intervaloMantenimiento: 5000, // Siguiente a 30,000 km -> Pasado por 150 km (ROJO)
    estadoOperativo: 'Mantenimiento Urgente',
    empresaAsignada: 'Volcan Compañía Minera (Yauli)',
    conductorActual: 'Manuel Cárdenas',
    nivelCombustible: 35,
    tarifaDiariaUSD: 180,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mercedes-benz-sprinter.jpg',
    documentos: {
      soat: 'Vigente hasta 06/2026 (Rimac)',
      poliza: 'Rimac Seguros Flota Bus #902144',
      revisionTecnica: 'Vencido - Servicio de frenos requerido',
    }
  },
  {
    id: 'veh-11',
    placa: 'W2P-615', // Enmascarada en B2B: Unidad #11 (W2P-***)
    marca: 'Toyota',
    modelo: 'Coaster Transporte de Personal (33 Pax)',
    anio: 2023,
    tipo: 'Vehículo Pesado',
    traccion: '4x2',
    motor: '4.0L Turbo Diesel Intercooler (150 HP)',
    capacidadCarga: '3,200 kg (33 Pasajeros)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Circulina Ámbar',
      'Botiquín Industrial',
      'Extintor 9kg',
      'Alarma de Retroceso',
      'Cinturones Certificados',
      'GPS Satelital Canbus',
      'Salidas de Emergencia de Techo',
      'Aire Acondicionado'
    ],
    odometroActual: 18400,
    ultimoMantenimiento: 15000,
    intervaloMantenimiento: 5000, // Siguiente a 20,000 km -> Faltan 1,600 km (VERDE)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Minera Chinalco Perú (Toromocho)',
    conductorActual: 'Alberto Ramos',
    nivelCombustible: 85,
    tarifaDiariaUSD: 220,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/coaster-30-p.jpg',
    documentos: {
      soat: 'Vigente hasta 08/2026 (Mapfre)',
      poliza: 'Mapfre Seguro Colectivo #102944',
      revisionTecnica: 'Aprobado MTC 02/2026',
    }
  },
  {
    id: 'veh-12',
    placa: 'W5J-730', // Enmascarada en B2B: Unidad #12 (W5J-***)
    marca: 'Mercedes-Benz',
    modelo: 'Ómnibus Interurbano (46 Pax)',
    anio: 2024,
    tipo: 'Vehículo Pesado',
    traccion: '4x2',
    motor: 'OM 457 LA Diesel Euro V (360 HP)',
    capacidadCarga: '46 Pasajeros + Bodega 8m³',
    certificaciones: ['Superficie'],
    equipamiento: [
      'GPS Satelital Canbus',
      'Botiquín Industrial',
      'Extintor 12kg',
      'Tacógrafo Digital',
      'Cinturones de 3 Puntos',
      'Aire Acondicionado Climatizado Central',
      'Cámaras de Seguridad Internas'
    ],
    odometroActual: 14200,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 800 km (VERDE)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Consorcio Vial Junín',
    conductorActual: 'Pedro Vilchez',
    nivelCombustible: 90,
    tarifaDiariaUSD: 300,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2025/01/bus01.jpg',
    documentos: {
      soat: 'Vigente hasta 12/2026 (Rimac)',
      poliza: 'Rimac Transporte Personal #882199',
      revisionTecnica: 'Aprobado MTC 04/2026',
    }
  },
  {
    id: 'veh-13',
    placa: 'W4L-911', // Enmascarada en B2B: Unidad #13 (W4L-***)
    marca: 'Isuzu',
    modelo: 'Camión de Personal Minero 4x4',
    anio: 2024,
    tipo: 'Vehículo Pesado',
    traccion: '4x4',
    motor: '5.2L Turbo Diesel Intercooler 4x4 (190 HP)',
    capacidadCarga: '28 Pasajeros / 4.5 Toneladas',
    certificaciones: ['Socavón', 'Superficie'],
    equipamiento: [
      'Antena Pértiga LED',
      'Circulina Ámbar',
      'Jaula Antivuelco Estructural Minera',
      'Alarma de Retroceso',
      'Tacos de Ruedas de Seguridad',
      'Extintor 9kg',
      'Botiquín Minero de Trauma',
      'Sensor GPS Satelital Dual'
    ],
    odometroActual: 7900,
    ultimoMantenimiento: 5000,
    intervaloMantenimiento: 5000, // Siguiente a 10,000 km -> Faltan 2,100 km (VERDE)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Minera Chinalco Perú (Toromocho)',
    conductorActual: 'Dante Flores',
    nivelCombustible: 80,
    tarifaDiariaUSD: 240,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2025/01/camion02.jpg',
    documentos: {
      soat: 'Vigente hasta 10/2026 (Pacífico)',
      poliza: 'Pacífico Todo Riesgo Minero #441920',
      revisionTecnica: 'Aprobado MTC 01/2026',
    }
  },
  {
    id: 'veh-14',
    placa: 'W6X-320', // Enmascarada en B2B: Unidad #14 (W6X-***)
    marca: 'Hino',
    modelo: 'Camión Furgón Minero 5TN',
    anio: 2024,
    tipo: 'Vehículo Pesado',
    traccion: '4x2',
    motor: '4.0L Turbo Diesel Intercooler (150 HP)',
    capacidadCarga: '5 Toneladas',
    certificaciones: ['Socavón', 'Superficie'],
    equipamiento: [
      'Antena Pértiga LED',
      'Circulina Ámbar',
      'Alarma de Retroceso',
      'Tacos de Ruedas de Madera',
      'Extintor 9kg PQS',
      'Botiquín Minero',
      'Sensor GPS Satelital',
      'Cintas Reflectivas 3M Grado Diamante'
    ],
    odometroActual: 11100,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 3,900 km (VERDE)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Morococha',
    conductorActual: null,
    nivelCombustible: 90,
    tarifaDiariaUSD: 190,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2025/01/furg01.jpg',
    documentos: {
      soat: 'Vigente hasta 02/2027 (Rimac)',
      poliza: 'Rimac Transporte Carga Pesada #719204',
      revisionTecnica: 'Aprobado MTC 03/2026',
    }
  },
  {
    id: 'veh-15',
    placa: 'W2R-408', // Enmascarada en B2B: Unidad #15 (W2R-***)
    marca: 'Hino',
    modelo: 'Camión Cisterna de Combustible / Agua 3000 Gal',
    anio: 2023,
    tipo: 'Vehículo Pesado',
    traccion: '4x2',
    motor: '7.7L Turbo Diesel Intercooler (260 HP)',
    capacidadCarga: '3,000 Galones / 10 Toneladas',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Antena Pértiga LED',
      'Circulina Ámbar',
      'Parada de Emergencia',
      'Bomba de Descarga y Contador',
      'Extintor PQS 12kg',
      'Arresto de Chispas',
      'Sensor GPS Satelital'
    ],
    odometroActual: 25050,
    ultimoMantenimiento: 20000,
    intervaloMantenimiento: 5000, // Siguiente a 25,000 km -> Pasado por 50 km (ROJO)
    estadoOperativo: 'Mantenimiento Urgente',
    empresaAsignada: 'Nexa Resources (El Porvenir)',
    conductorActual: 'Víctor Romaní',
    nivelCombustible: 50,
    tarifaDiariaUSD: 260,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2025/01/cisterna.jpg',
    documentos: {
      soat: 'Vigente hasta 05/2026 (Rimac)',
      poliza: 'Rimac MATPEL / Materiales Peligrosos #338192',
      revisionTecnica: 'Vencido - Requiere inspección de válvula y cisterna',
    }
  },
  {
    id: 'veh-16',
    placa: 'W3Y-671', // Enmascarada en B2B: Unidad #16 (W3Y-***)
    marca: 'Toyota',
    modelo: 'Corolla 1.8 Sedan Ejecutivo',
    anio: 2023,
    tipo: 'Vehículo Ligero',
    traccion: '4x2',
    motor: '1.8L Dual VVT-i Automático (138 HP)',
    capacidadCarga: '450 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Aire Acondicionado'
    ],
    odometroActual: 14850,
    ultimoMantenimiento: 10000,
    intervaloMantenimiento: 5000, // Siguiente a 15,000 km -> Faltan 150 km (AMARILLO)
    estadoOperativo: 'En Servicio',
    empresaAsignada: 'Base Central Huancayo (Servicio Ejecutivo)',
    conductorActual: 'Jaime Cóndor',
    nivelCombustible: 80,
    tarifaDiariaUSD: 65,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/toyota-corolla.jpg',
    documentos: {
      soat: 'Vigente hasta 08/2026 (Pacífico)',
      poliza: 'Pacífico Flota Ligera #110294',
      revisionTecnica: 'Aprobado MTC 02/2026',
    }
  },
  {
    id: 'veh-17',
    placa: 'W1V-804', // Enmascarada en B2B: Unidad #17 (W1V-***)
    marca: 'Hyundai',
    modelo: 'Elantra 1.6 Automático',
    anio: 2024,
    tipo: 'Vehículo Ligero',
    traccion: '4x2',
    motor: '1.6L MPI Automático (126 HP)',
    capacidadCarga: '450 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Aire Acondicionado'
    ],
    odometroActual: 4800,
    ultimoMantenimiento: 0,
    intervaloMantenimiento: 5000, // Siguiente a 5,000 km -> Faltan 200 km (AMARILLO)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Central Huancayo',
    conductorActual: null,
    nivelCombustible: 95,
    tarifaDiariaUSD: 65,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/hyundai-elantra.jpg',
    documentos: {
      soat: 'Vigente hasta 12/2026 (Rimac)',
      poliza: 'Rimac Flotas #402911',
      revisionTecnica: 'Exonerado por año 2024',
    }
  },
  {
    id: 'veh-18',
    placa: 'W5T-229', // Enmascarada en B2B: Unidad #18 (W5T-***)
    marca: 'Mazda',
    modelo: 'CX-3 2.0 Skyactiv-G',
    anio: 2023,
    tipo: 'SUV',
    traccion: '4x2',
    motor: '2.0L Skyactiv-G Automático (148 HP)',
    capacidadCarga: '480 kg (5 Asientos)',
    certificaciones: ['Superficie'],
    equipamiento: [
      'Botiquín Primeros Auxilios',
      'Extintor PQS 4kg',
      'Láminas de Seguridad',
      'Sensor GPS Satelital',
      'Aire Acondicionado'
    ],
    odometroActual: 6200,
    ultimoMantenimiento: 5000,
    intervaloMantenimiento: 5000, // Siguiente a 10,000 km -> Faltan 3,800 km (VERDE)
    estadoOperativo: 'Disponible',
    empresaAsignada: 'Base Huancayo (Urb. La Merced)',
    conductorActual: null,
    nivelCombustible: 90,
    tarifaDiariaUSD: 80,
    imagen: 'https://vipcarhuancayo.com/wp-content/uploads/2021/08/mazda-cx3.jpg',
    documentos: {
      soat: 'Vigente hasta 04/2026 (Rimac)',
      poliza: 'Rimac Todo Riesgo #992100',
      revisionTecnica: 'Aprobado MTC 01/2026',
    }
  }
];

export const INITIAL_CONTRATOS = [
  {
    id: 'CTR-2026-081',
    cliente: 'Minera Chinalco Perú S.A.',
    ruc: '20519842101',
    minaProyecto: 'Toromocho - Junín',
    unidadesAsignadas: 6,
    placas: ['W4E-892', 'W1T-553', 'W2P-615', 'W4L-911', 'W4E-896', 'W4E-897'],
    fechaInicio: '2026-01-15',
    fechaFin: '2026-12-31',
    montoMensualUSD: 19800,
    estado: 'Vigente',
    contacto: 'Ing. Fernando Barreto (Superintendente de Logística)'
  },
  {
    id: 'CTR-2026-044',
    cliente: 'Volcan Compañía Minera S.A.A.',
    ruc: '20100113612',
    minaProyecto: 'Unidad Yauli - Carahuacra',
    unidadesAsignadas: 4,
    placas: ['W2A-710', 'W3K-840', 'W2A-712', 'W2A-713'],
    fechaInicio: '2025-06-01',
    fechaFin: '2026-06-30',
    montoMensualUSD: 12600,
    estado: 'Próximo a Renovar',
    contacto: 'Lic. Patricia Alanya (Jefa de Operaciones Flota)'
  },
  {
    id: 'CTR-2026-102',
    cliente: 'Constructora San Martín S.A.',
    ruc: '20108920111',
    minaProyecto: 'Tramo Carretera Tarma - Chanchamayo',
    unidadesAsignadas: 3,
    placas: ['W5B-441', 'W5J-730', 'W5B-443'],
    fechaInicio: '2026-03-01',
    fechaFin: '2026-09-30',
    montoMensualUSD: 10350,
    estado: 'Vigente',
    contacto: 'Ing. Roberto Canchari (Residente de Obra)'
  }
];

export const INITIAL_BITACORA = [
  {
    id: 'bit-001',
    fechaHora: '2026-10-19 07:15',
    conductor: 'Carlos Huamán',
    operador: 'Carlos Huamán',
    placa: 'W4E-892',
    tipoRegistro: 'Check-in Turno Mañana',
    tipoEvento: 'Check-in',
    odometro: 14750,
    nivelCombustible: '75%',
    combustible: 75,
    checklistEstado: 'Aprobado sin incidencias',
    observaciones: 'Aprobado sin incidencias',
    descripcion: 'Aprobado sin incidencias',
    proyecto: 'Toromocho - Chinalco',
    estado: 'OK',
    latitud: -11.6167,
    longitud: -76.1333,
    timestamp: '2026-10-19T07:15:00.000Z'
  },
  {
    id: 'bit-002',
    fechaHora: '2026-10-18 19:30',
    conductor: 'Carlos Huamán',
    operador: 'Carlos Huamán',
    placa: 'W4E-892',
    tipoRegistro: 'Check-out Turno Noche',
    tipoEvento: 'Check-out',
    odometro: 14750,
    nivelCombustible: '75%',
    combustible: 75,
    checklistEstado: 'Entrega en campamento',
    observaciones: 'Entrega en campamento',
    descripcion: 'Entrega en campamento',
    proyecto: 'Toromocho - Chinalco',
    estado: 'OK',
    latitud: -11.6420,
    longitud: -76.1150,
    timestamp: '2026-10-18T19:30:00.000Z'
  },
  {
    id: 'bit-003',
    fechaHora: '2026-10-18 14:10',
    conductor: 'Marcos Mendoza',
    operador: 'Marcos Mendoza',
    placa: 'W2A-710',
    tipoRegistro: 'SOS: Falla de Frenos en Rampa',
    tipoEvento: 'SOS',
    odometro: 20120,
    nivelCombustible: '40%',
    combustible: 40,
    checklistEstado: 'Pérdida de presión en pedal de freno en rampa de acceso',
    observaciones: 'Pérdida súbita de presión en pedal de freno en rampa de acceso minero. Unidad acuñada y con luces de emergencia encendidas.',
    descripcion: 'Pérdida súbita de presión en pedal de freno en rampa de acceso minero. Unidad acuñada y con luces de emergencia encendidas.',
    proyecto: 'Yauli - Volcan',
    estado: 'Alerta',
    latitud: -11.6215,
    longitud: -76.1402,
    timestamp: '2026-10-18T14:10:00.000Z'
  },
  {
    id: 'bit-004',
    fechaHora: '2026-10-18 06:45',
    conductor: 'Jorge Quispe',
    operador: 'Jorge Quispe',
    placa: 'W5B-441',
    tipoRegistro: 'Check-in Turno',
    tipoEvento: 'Check-in',
    odometro: 8200,
    nivelCombustible: '90%',
    combustible: 90,
    checklistEstado: 'Pértiga y circulina verificadas',
    observaciones: 'Pértiga y circulina verificadas',
    descripcion: 'Pértiga y circulina verificadas',
    proyecto: 'Carretera San Martín',
    estado: 'OK',
    latitud: -12.0651,
    longitud: -75.2049,
    timestamp: '2026-10-18T06:45:00.000Z'
  },
  {
    id: 'bit-005',
    fechaHora: '2026-10-27 18:40',
    conductor: 'Carlos Huamán',
    operador: 'Carlos Huamán',
    placa: 'W4E-892',
    tipoRegistro: 'Reporte de Avería: Sobrecalentamiento de Motor',
    tipoEvento: 'Avería',
    odometro: 14780,
    nivelCombustible: '68%',
    combustible: 68,
    checklistEstado: 'Fuga visible de refrigerante y alta temperatura',
    observaciones: 'Fuga visible de refrigerante en manguera superior de radiador y temperatura en zona roja en Km 124 Carretera Central. Unidad detenida en berma segura.',
    descripcion: 'Fuga visible de refrigerante en manguera superior de radiador y temperatura en zona roja en Km 124 Carretera Central. Unidad detenida en berma segura.',
    proyecto: 'Toromocho - Chinalco',
    estado: 'Alerta',
    latitud: -11.6083,
    longitud: -76.1294,
    timestamp: '2026-10-27T18:40:00.000Z'
  }
];

export const THRESHOLDS = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000];

/**
 * Calcula el estado de semáforo preventivo para una unidad
 * Reglas de diseño:
 * - Verde: > 500 km restantes para el siguiente mantenimiento
 * - Amarillo: <= 500 km restantes (Mantenimiento Próximo)
 * - Rojo: <= 0 km (Mantenimiento Vencido o Inhabilitada)
 */
export function calcularSemaforo(odometroActual) {
  // Encuentra el siguiente múltiplo de 5000
  const siguienteServicio = Math.ceil((odometroActual + 1) / 5000) * 5000;
  const kmRestantes = siguienteServicio - odometroActual;

  if (kmRestantes <= 0) {
    return {
      estado: 'Rojo',
      color: 'bg-[#2d0e14] text-[#ff6363] border-[#ff6363]/40',
      tag: 'Mantenimiento Vencido',
      siguienteServicio,
      kmRestantes,
      prioridad: 1
    };
  } else if (kmRestantes <= 500) {
    return {
      estado: 'Amarillo',
      color: 'bg-[#231908] text-[#f59e0b] border-[#f59e0b]/40',
      tag: 'Mantenimiento Próximo',
      siguienteServicio,
      kmRestantes,
      prioridad: 2
    };
  } else {
    return {
      estado: 'Verde',
      color: 'bg-[#071f16] text-[#59d499] border-[#59d499]/40',
      tag: 'Óptimo',
      siguienteServicio,
      kmRestantes,
      prioridad: 3
    };
  }
}
