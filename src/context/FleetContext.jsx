import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_VEHICLES, INITIAL_CONTRATOS, INITIAL_BITACORA, calcularSemaforo } from '../data/mockData';
import { isConfigured } from '../config/firebase';
import {
  seedVehiculosIfEmpty,
  subscribeToVehiculos,
  subscribeToContratos,
  subscribeToBitacora,
  subscribeToCotizaciones,
  subscribeToAverias,
  registrarOdometroFirestore,
  firestoreSyncCheckOut,
  firestoreSyncAveria,
  firestoreSyncCotizacion,
  firestoreSyncAddVehiculo,
  firestoreSyncDeleteVehiculo,
} from '../services/firestoreService';
import {
  enqueueOfflineAction,
  getPendingQueueCount,
  syncOfflineQueueWithFirestore
} from '../services/offlineSyncService';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
  // Persistencia local para modo offline en operación minera
  const FLEET_STORAGE_VERSION = 'v3_vipcar_fleet_sos_alerts';

  const [vehicles, setVehicles] = useState(() => {
    try {
      const ver = localStorage.getItem('vipcar_fleet_version');
      if (ver !== FLEET_STORAGE_VERSION) {
        localStorage.setItem('vipcar_fleet_version', FLEET_STORAGE_VERSION);
        localStorage.setItem('vipcar_vehicles', JSON.stringify(INITIAL_VEHICLES));
        localStorage.setItem('vipcar_bitacora', JSON.stringify(INITIAL_BITACORA));
        return INITIAL_VEHICLES;
      }
      const saved = localStorage.getItem('vipcar_vehicles');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [contratos, setContratos] = useState(() => {
    try {
      const saved = localStorage.getItem('vipcar_contratos');
      return saved ? JSON.parse(saved) : INITIAL_CONTRATOS;
    } catch {
      return INITIAL_CONTRATOS;
    }
  });

  const [bitacora, setBitacora] = useState(() => {
    try {
      const ver = localStorage.getItem('vipcar_fleet_version');
      if (ver !== FLEET_STORAGE_VERSION) {
        return INITIAL_BITACORA;
      }
      const saved = localStorage.getItem('vipcar_bitacora');
      return saved ? JSON.parse(saved) : INITIAL_BITACORA;
    } catch {
      return INITIAL_BITACORA;
    }
  });

  const [cotizaciones, setCotizaciones] = useState(() => {
    try {
      const saved = localStorage.getItem('vipcar_cotizaciones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [averias, setAverias] = useState(() => {
    try {
      const saved = localStorage.getItem('vipcar_averias');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estado de sincronización Cloud Firestore
  const [cloudStatus, setCloudStatus] = useState(() => (isConfigured ? 'syncing' : 'offline'));

  // Contador de registros pendientes guardados en socavón (offline)
  const [pendingSyncCount, setPendingSyncCount] = useState(() => getPendingQueueCount());

  // Escuchadores de reconexión y sincronización de registros de socavón
  useEffect(() => {
    const updateCount = () => setPendingSyncCount(getPendingQueueCount());
    window.addEventListener('vipcar-queue-updated', updateCount);
    window.addEventListener('vipcar-sync-completed', updateCount);

    const handleAutoSync = async () => {
      console.log('📡 [Socavón] Conexión detectada: Sincronizando registros pendientes con Firestore...');
      await syncOfflineQueueWithFirestore();
      updateCount();
    };

    window.addEventListener('online', handleAutoSync);

    const handleSwMessage = (event) => {
      if (event.data?.type === 'TRIGGER_OFFLINE_SYNC') {
        handleAutoSync();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    if (navigator.onLine && getPendingQueueCount() > 0) {
      handleAutoSync();
    }

    return () => {
      window.removeEventListener('vipcar-queue-updated', updateCount);
      window.removeEventListener('vipcar-sync-completed', updateCount);
      window.removeEventListener('online', handleAutoSync);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, []);

  // Conexión y suscripciones en tiempo real con Cloud Firestore
  useEffect(() => {
    if (!isConfigured) {
      setCloudStatus('offline');
      return;
    }

    let unsubVehiculos = () => {};
    let unsubContratos = () => {};
    let unsubBitacora = () => {};
    let unsubCotizaciones = () => {};
    let unsubAverias = () => {};

    const initCloud = async () => {
      try {
        setCloudStatus('syncing');

        // 2. Si la colección 'vehiculos' en Firestore está vacía, realiza siembra inicial (seed)
        await seedVehiculosIfEmpty();

        // 4. Suscripción en tiempo real (onSnapshot) a 'vehiculos'
        unsubVehiculos = subscribeToVehiculos(
          (cloudVehicles) => {
            if (cloudVehicles && cloudVehicles.length > 0) {
              setVehicles(cloudVehicles);
              setCloudStatus('connected');
            }
          },
          (err) => {
            console.warn('Fallo en sync de vehículos, usando almacenamiento local:', err);
            setCloudStatus('offline');
          }
        );

        unsubContratos = subscribeToContratos((cloudContratos) => {
          if (cloudContratos && cloudContratos.length > 0) {
            setContratos(cloudContratos);
          }
        });

        unsubBitacora = subscribeToBitacora((cloudBitacora) => {
          if (cloudBitacora && cloudBitacora.length > 0) {
            setBitacora(cloudBitacora);
          }
        });

        unsubCotizaciones = subscribeToCotizaciones((cloudCotizaciones) => {
          if (cloudCotizaciones) {
            setCotizaciones(cloudCotizaciones);
          }
        });

        unsubAverias = subscribeToAverias((cloudAverias) => {
          if (cloudAverias) {
            setAverias(cloudAverias);
          }
        });
      } catch (error) {
        console.warn('Error inicializando listeners de Firestore:', error);
        setCloudStatus('offline');
      }
    };

    initCloud();

    return () => {
      unsubVehiculos();
      unsubContratos();
      unsubBitacora();
      unsubCotizaciones();
      unsubAverias();
    };
  }, []);

  // Guardar en localStorage como soporte sin conexión en operación
  useEffect(() => {
    try {
      localStorage.setItem('vipcar_vehicles', JSON.stringify(vehicles));
    } catch (e) {
      console.warn('Error saving vehicles to localStorage', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem('vipcar_bitacora', JSON.stringify(bitacora));
    } catch (e) {
      console.warn('Error saving bitacora to localStorage', e);
    }
  }, [bitacora]);

  useEffect(() => {
    try {
      localStorage.setItem('vipcar_cotizaciones', JSON.stringify(cotizaciones));
    } catch (e) {
      console.warn('Error saving cotizaciones to localStorage', e);
    }
  }, [cotizaciones]);

  useEffect(() => {
    try {
      localStorage.setItem('vipcar_averias', JSON.stringify(averias));
    } catch (e) {
      console.warn('Error saving averias to localStorage', e);
    }
  }, [averias]);

  /**
   * 3. Conecta el formulario del conductor (CheckIn.jsx) para que al guardar el kilometraje
   * cree un registro real en la colección 'registros_odometro' y actualice el kilometraje actual
   * del vehículo en la colección 'vehiculos'.
   */
  const registrarCheckIn = async ({ placa, vehiculoId, odometro, combustible, checklist, conductor, observaciones, operacion }) => {
    const odoNum = Number(odometro);
    const targetVeh = vehicles.find((v) => v.placa === placa || v.id === vehiculoId);
    const targetId = vehiculoId || targetVeh?.id || 'veh-01';

    const vehicleUpdates = {
      odometroActual: odoNum,
      nivelCombustible: Number(combustible) || targetVeh?.nivelCombustible || 75,
      conductorActual: conductor || targetVeh?.conductorActual || 'Carlos Huamán',
      estadoOperativo: 'En Servicio',
      updatedAt: new Date().toISOString(),
    };

    // Actualización reactiva inmediata
    setVehicles((prev) =>
      prev.map((veh) => {
        if (veh.placa === placa || veh.id === targetId) {
          return {
            ...veh,
            ...vehicleUpdates,
          };
        }
        return veh;
      })
    );

    const nuevoLog = {
      id: `bit-${Date.now()}`,
      fechaHora: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      conductor: conductor || 'Carlos Huamán',
      placa,
      tipoRegistro: 'Check-in Turno (Odómetro)',
      odometro: odoNum,
      nivelCombustible: `${combustible}%`,
      checklistEstado: checklist ? 'Checklist 100% Conforme' : 'Con observaciones',
      proyecto: operacion || targetVeh?.empresaAsignada || 'Toromocho - Chinalco',
      observaciones: observaciones || 'Sin novedades',
      estado: 'OK',
    };

    setBitacora((prev) => [nuevoLog, ...prev]);

    // Persistir en Firestore o Encolar en Socavón Offline
    const checkInData = {
      placa,
      vehiculoId: targetId,
      odometro: odoNum,
      combustible: Number(combustible) || 75,
      conductor: conductor || 'Carlos Huamán',
      checklist,
      observaciones,
      operacion: operacion || targetVeh?.empresaAsignada || 'Toromocho - Junín',
    };

    let guardadoEnSocavon = false;

    if (!navigator.onLine || !isConfigured) {
      enqueueOfflineAction('CHECK_IN', checkInData);
      guardadoEnSocavon = true;
    } else {
      try {
        const res = await registrarOdometroFirestore(checkInData);
        if (!res) {
          enqueueOfflineAction('CHECK_IN', checkInData);
          guardadoEnSocavon = true;
        }
      } catch (err) {
        console.warn('⚠️ Fallo de red en mina, encolando check-in localmente:', err);
        enqueueOfflineAction('CHECK_IN', checkInData);
        guardadoEnSocavon = true;
      }
    }

    return { ...nuevoLog, guardadoEnSocavon };
  };

  const registrarCheckOut = async ({ placa, odometro, combustible, novedades, evaluacion, conductor }) => {
    const odoNum = Number(odometro);
    const targetVeh = vehicles.find((v) => v.placa === placa);

    const vehicleUpdates = {
      odometroActual: odoNum,
      nivelCombustible: Number(combustible) || targetVeh?.nivelCombustible || 75,
      estadoOperativo: evaluacion === 'Requiere mantenimiento' ? 'En Mantenimiento' : 'Disponible',
      updatedAt: new Date().toISOString(),
    };

    setVehicles((prev) =>
      prev.map((veh) => {
        if (veh.placa === placa) {
          return {
            ...veh,
            ...vehicleUpdates,
          };
        }
        return veh;
      })
    );

    const nuevoLog = {
      id: `bit-${Date.now()}`,
      fechaHora: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }),
      conductor: conductor || 'Carlos Huamán',
      placa,
      tipoRegistro: 'Check-out Turno',
      odometro: odoNum,
      nivelCombustible: `${combustible}%`,
      checklistEstado: evaluacion,
      proyecto: targetVeh?.empresaAsignada || 'Campamento Central',
      observaciones: novedades || 'Cierre de turno normal',
      estado: evaluacion === 'Requiere mantenimiento' ? 'Alerta' : 'OK',
    };

    setBitacora((prev) => [nuevoLog, ...prev]);

    const checkOutData = {
      vehicleId: targetVeh?.id,
      vehicleUpdates,
      logEntry: nuevoLog,
    };

    let guardadoEnSocavon = false;

    if (!navigator.onLine || !isConfigured) {
      enqueueOfflineAction('CHECK_OUT', checkOutData);
      guardadoEnSocavon = true;
    } else {
      try {
        const res = await firestoreSyncCheckOut(checkOutData);
        if (!res) {
          enqueueOfflineAction('CHECK_OUT', checkOutData);
          guardadoEnSocavon = true;
        }
      } catch (err) {
        enqueueOfflineAction('CHECK_OUT', checkOutData);
        guardadoEnSocavon = true;
      }
    }

    return { ...nuevoLog, guardadoEnSocavon };
  };

  const reportarAveriaEmergencia = async ({
    placa,
    tipoFalla,
    severidad,
    descripcion,
    conductor,
    operador,
    foto,
    latitud,
    longitud,
    tipoEvento
  }) => {
    const targetVeh = vehicles.find((v) => v.placa === placa);
    const conductorNombre = conductor || operador || targetVeh?.conductorActual || 'Carlos Huamán';
    const eventoTipo = tipoEvento || (severidad === 'Crítica' || tipoFalla?.toLowerCase().includes('sos') ? 'SOS' : 'Avería');
    const now = new Date();
    const fechaHora = now.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' });
    const lat = latitud != null && !isNaN(latitud) ? Number(latitud) : -11.6083;
    const lng = longitud != null && !isNaN(longitud) ? Number(longitud) : -76.1294;

    const nuevaAveria = {
      id: `avr-${Date.now()}`,
      fechaHora,
      placa,
      tipoFalla: tipoFalla || 'Incidente mecánico en ruta',
      severidad: severidad || 'Grave',
      descripcion: descripcion || 'Reporte de novedad en operación',
      conductor: conductorNombre,
      operador: conductorNombre,
      fotoUrl: foto || null,
      estado: 'Pendiente de Asistencia Mecánica',
      tipoEvento: eventoTipo,
      latitud: lat,
      longitud: lng,
    };

    setAverias((prev) => [nuevaAveria, ...prev]);

    setVehicles((prev) =>
      prev.map((v) => (v.placa === placa ? { ...v, estadoOperativo: 'Inhabilitado por Avería' } : v))
    );

    const nuevoLog = {
      id: `bit-${Date.now()}`,
      fechaHora,
      conductor: conductorNombre,
      operador: conductorNombre,
      placa,
      tipoEvento: eventoTipo, // 'SOS' o 'Avería'
      tipoRegistro: `${eventoTipo}: ${tipoFalla || 'Incidente en ruta'} (${severidad || 'Urgente'})`,
      odometro: targetVeh?.odometroActual || 0,
      nivelCombustible: `${targetVeh?.nivelCombustible || 'N/A'}%`,
      combustible: targetVeh?.nivelCombustible || 75,
      checklistEstado: `${eventoTipo} ${severidad || 'Grave'}`,
      proyecto: targetVeh?.empresaAsignada || 'Toromocho - Junín',
      observaciones: descripcion || 'Sin observaciones adicionales',
      descripcion: descripcion || 'Sin observaciones adicionales',
      estado: 'Alerta',
      latitud: lat,
      longitud: lng,
      timestamp: now.toISOString(),
    };

    setBitacora((prev) => [nuevoLog, ...prev]);

    const averiaData = {
      vehicleId: targetVeh?.id,
      averiaEntry: nuevaAveria,
      logEntry: nuevoLog,
    };

    let guardadoEnSocavon = false;

    if (!navigator.onLine || !isConfigured) {
      enqueueOfflineAction('AVERIA', averiaData);
      guardadoEnSocavon = true;
    } else {
      try {
        const res = await firestoreSyncAveria(averiaData);
        if (!res) {
          enqueueOfflineAction('AVERIA', averiaData);
          guardadoEnSocavon = true;
        }
      } catch (err) {
        console.warn('Error en sync averia:', err);
        enqueueOfflineAction('AVERIA', averiaData);
        guardadoEnSocavon = true;
      }
    }

    return { ...nuevaAveria, guardadoEnSocavon };
  };

  const emitirAlertaCritica = async ({
    placa = 'W4E-892',
    operador = 'Carlos Huamán',
    tipoEvento = 'SOS',
    novedad = 'Señal de auxilio reportada por el operador.',
    latitud = -11.6083,
    longitud = -76.1294,
    severidad = 'Crítica'
  }) => {
    return reportarAveriaEmergencia({
      placa,
      tipoFalla: tipoEvento === 'SOS' ? 'Auxilio Inmediato SOS' : 'Avería Mecánica en Operación',
      severidad,
      descripcion: novedad,
      conductor: operador,
      operador,
      latitud,
      longitud,
      tipoEvento,
    });
  };

  const agregarCotizacion = async (solicitud) => {
    const nueva = {
      id: `COT-${Date.now().toString().slice(-5)}`,
      fecha: new Date().toLocaleDateString('es-PE'),
      ...solicitud,
      estado: 'En Evaluación Técnica',
    };
    setCotizaciones((prev) => [nueva, ...prev]);

    if (isConfigured) {
      await firestoreSyncCotizacion(nueva);
    }

    return nueva;
  };

  const agregarVehiculo = async (nuevoVehiculo) => {
    const veh = {
      id: `veh-${Date.now()}`,
      ...nuevoVehiculo,
      odometroActual: Number(nuevoVehiculo.odometroActual) || 0,
      documentos: {
        soat: 'Vigente 2026',
        poliza: 'Póliza Rimac Flotas',
        revisionTecnica: 'Aprobado MTC',
      },
    };
    setVehicles((prev) => [veh, ...prev]);

    if (isConfigured) {
      await firestoreSyncAddVehiculo(veh);
    }

    return veh;
  };

  const eliminarVehiculo = async (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    if (isConfigured) {
      await firestoreSyncDeleteVehiculo(id);
    }
  };

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        contratos,
        bitacora,
        cotizaciones,
        averias,
        cloudStatus,
        isCloudReady: cloudStatus === 'connected',
        registrarCheckIn,
        registrarCheckOut,
        reportarAveriaEmergencia,
        emitirAlertaCritica,
        agregarCotizacion,
        agregarVehiculo,
        eliminarVehiculo,
        calcularSemaforo,
        pendingSyncCount,
        sincronizarColaManual: syncOfflineQueueWithFirestore,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const ctx = useContext(FleetContext);
  if (!ctx) {
    throw new Error('useFleet debe ser utilizado dentro de un FleetProvider');
  }
  return ctx;
}
