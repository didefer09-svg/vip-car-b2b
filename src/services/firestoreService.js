import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import { db, isConfigured } from '../config/firebase';
import { INITIAL_VEHICLES, INITIAL_CONTRATOS, INITIAL_BITACORA, INITIAL_MANTENIMIENTOS } from '../data/mockData';
import { obtenerIdentificadorB2B } from '../utils/plateMasker';

export const COLLECTIONS = {
  VEHICULOS: 'vehiculos',
  REGISTROS_ODOMETRO: 'registros_odometro',
  CONTRATOS: 'contratos',
  BITACORA: 'bitacora',
  COTIZACIONES: 'cotizaciones',
  AVERIAS: 'averias',
  MANTENIMIENTOS: 'mantenimientos',
};

/**
 * 2. Si la colección 'vehiculos' en Firestore está vacía, realiza una siembra inicial (seed)
 * con la flota actual respetando las reglas de placas enmascaradas.
 */
export async function seedVehiculosIfEmpty() {
  if (!isConfigured || !db) return false;

  try {
    const vehSnapshot = await getDocs(query(collection(db, COLLECTIONS.VEHICULOS), limit(1)));
    if (vehSnapshot.empty) {
      console.log('🌱 Sembrando colección oficial \'vehiculos\' en Firestore...');
      for (let i = 0; i < INITIAL_VEHICLES.length; i++) {
        const veh = INITIAL_VEHICLES[i];
        const idB2B = obtenerIdentificadorB2B(veh, i);
        const docData = {
          ...veh,
          identificadorB2B: idB2B,
          codigoUnidad: idB2B.codigo,
          placaEnmascarada: idB2B.enmascarada,
          placaCompletaProtegida: veh.placa,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, COLLECTIONS.VEHICULOS, veh.id), docData);
      }
      console.log('✅ Siembra completada: 18 vehículos de VIP CAR creados en la colección \'vehiculos\'.');
    }

    // Sembrado opcional de soporte si contratos está vacío
    const conSnapshot = await getDocs(query(collection(db, COLLECTIONS.CONTRATOS), limit(1)));
    if (conSnapshot.empty) {
      for (const con of INITIAL_CONTRATOS) {
        await setDoc(doc(db, COLLECTIONS.CONTRATOS, con.id), {
          ...con,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Sembrado de bitácora
    const bitSnapshot = await getDocs(query(collection(db, COLLECTIONS.BITACORA), limit(1)));
    if (bitSnapshot.empty) {
      for (const bit of INITIAL_BITACORA) {
        await setDoc(doc(db, COLLECTIONS.BITACORA, bit.id), {
          ...bit,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Sembrado de mantenimientos
    const mntSnapshot = await getDocs(query(collection(db, COLLECTIONS.MANTENIMIENTOS), limit(1)));
    if (mntSnapshot.empty) {
      for (const mnt of INITIAL_MANTENIMIENTOS) {
        await setDoc(doc(db, COLLECTIONS.MANTENIMIENTOS, mnt.id), {
          ...mnt,
          timestamp: mnt.timestamp || new Date().toISOString(),
        });
      }
    }

    return true;
  } catch (error) {
    console.warn('⚠️ Nota sobre siembra en Firestore (verificar reglas de seguridad si da permiso denegado):', error);
    return false;
  }
}

/**
 * 4. Suscripción en tiempo real (onSnapshot) a la colección 'vehiculos'
 */
export function subscribeToVehiculos(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.VEHICULOS),
    (snapshot) => {
      if (!snapshot.empty) {
        const vehiclesList = snapshot.docs.map((docSnap, index) => {
          const data = docSnap.data();
          const identificadorB2B = data.identificadorB2B || obtenerIdentificadorB2B(data, index);
          return {
            id: docSnap.id,
            ...data,
            identificadorB2B,
          };
        });
        // Ordenar por ID ascendente para mantener consistencia
        vehiclesList.sort((a, b) => a.id.localeCompare(b.id));
        onSuccess(vehiclesList);
      }
    },
    (error) => {
      console.warn('Error en listener onSnapshot de vehiculos:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * 3. Guarda el registro de odómetro en la colección 'registros_odometro'
 * y actualiza el odómetro actual del vehículo en la colección 'vehiculos'.
 */
export async function registrarOdometroFirestore({
  placa,
  vehiculoId,
  odometro,
  combustible,
  conductor,
  checklist,
  observaciones,
  operacion,
}) {
  if (!isConfigured || !db) return null;

  try {
    const odoNum = Number(odometro);
    const fechaHora = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
    const timestamp = new Date().toISOString();
    const opName = operacion || 'Toromocho - Junín';

    // 1. Actualizar el vehículo en 'vehiculos'
    if (vehiculoId) {
      const vehRef = doc(db, COLLECTIONS.VEHICULOS, vehiculoId);
      await updateDoc(vehRef, {
        odometroActual: odoNum,
        nivelCombustible: Number(combustible) || 75,
        conductorActual: conductor || 'Carlos Huamán',
        estadoOperativo: 'En Servicio',
        ultimoCheckIn: timestamp,
        updatedAt: timestamp,
      });
    }

    // 2. Crear documento real en 'registros_odometro'
    const registroId = `odo-${Date.now()}`;
    const registroDoc = {
      id: registroId,
      placa,
      vehiculoId: vehiculoId || '',
      odometro: odoNum,
      nivelCombustible: Number(combustible) || 75,
      conductor: conductor || 'Carlos Huamán',
      checklistConforme: Boolean(checklist),
      observaciones: observaciones || 'Sin observaciones',
      operacion: opName,
      fechaHora,
      createdAt: timestamp,
    };

    await setDoc(doc(db, COLLECTIONS.REGISTROS_ODOMETRO, registroId), registroDoc);

    // 3. Registrar en bitácora para trazabilidad general
    const logId = `bit-${Date.now()}`;
    await setDoc(doc(db, COLLECTIONS.BITACORA, logId), {
      id: logId,
      fechaHora,
      conductor: conductor || 'Carlos Huamán',
      placa,
      tipoRegistro: 'Check-in Turno (Odómetro)',
      odometro: odoNum,
      nivelCombustible: `${combustible}%`,
      checklistEstado: checklist ? 'Checklist 100% Conforme' : 'Con observaciones',
      proyecto: opName,
      observaciones: observaciones || 'Sin novedades',
      estado: 'OK',
      timestamp,
    });

    console.log(`✅ Registro de odómetro guardado en 'registros_odometro' y unidad [${placa}] actualizada a ${odoNum} km.`);
    return registroDoc;
  } catch (error) {
    console.warn('⚠️ Error al registrar odómetro en Firestore:', error);
    return null;
  }
}

/**
 * Suscripción en tiempo real a 'registros_odometro'
 */
export function subscribeToRegistrosOdometro(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.REGISTROS_ODOMETRO),
    (snapshot) => {
      const registros = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(registros);
    },
    (error) => {
      console.warn('Error en listener de registros_odometro:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Suscripciones a contratos, bitácora, cotizaciones y averías
 */
export function subscribeToContratos(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.CONTRATOS),
    (snapshot) => {
      const contratosList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(contratosList);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export function subscribeToBitacora(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.BITACORA),
    (snapshot) => {
      const bitacoraList = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const conductor = data.conductor || data.operador || 'Conductor no asignado';
        const tipoEvento = data.tipoEvento || (
          data.tipoRegistro?.toLowerCase().includes('check-in') ? 'Check-in' :
          data.tipoRegistro?.toLowerCase().includes('check-out') ? 'Check-out' :
          data.tipoRegistro?.toLowerCase().includes('avería') || data.tipoRegistro?.toLowerCase().includes('averia') ? 'Avería' :
          data.tipoRegistro?.toLowerCase().includes('sos') || data.tipoRegistro?.toLowerCase().includes('emergencia') ? 'SOS' :
          data.tipoRegistro || 'Operativo'
        );
        const lat = data.latitud ?? data.ubicacion?.latitud ?? null;
        const lng = data.longitud ?? data.ubicacion?.longitud ?? null;

        return {
          id: docSnap.id,
          ...data,
          conductor,
          operador: conductor,
          tipoEvento,
          tipoRegistro: data.tipoRegistro || tipoEvento,
          descripcion: data.descripcion || data.observaciones || data.checklistEstado || '',
          observaciones: data.observaciones || data.descripcion || data.checklistEstado || '',
          latitud: lat != null ? Number(lat) : null,
          longitud: lng != null ? Number(lng) : null,
          fechaHora: data.fechaHora || (data.timestamp ? new Date(data.timestamp).toLocaleString('es-PE') : 'Reciente'),
        };
      });

      bitacoraList.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) return timeB - timeA;
        return (b.id || '').localeCompare(a.id || '');
      });

      onSuccess(bitacoraList);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export function subscribeToCotizaciones(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.COTIZACIONES),
    (snapshot) => {
      const cotizacionesList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(cotizacionesList);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export function subscribeToAverias(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.AVERIAS),
    (snapshot) => {
      const averiasList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(averiasList);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export function subscribeToMantenimientos(onSuccess, onError) {
  if (!isConfigured || !db) return () => {};

  return onSnapshot(
    collection(db, COLLECTIONS.MANTENIMIENTOS),
    (snapshot) => {
      const mantenimientosList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Ordenar por timestamp descendente
      mantenimientosList.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
      });

      onSuccess(mantenimientosList);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

/**
 * Operaciones adicionales sincronizadas
 */
export async function firestoreSyncCheckOut({ vehicleId, vehicleUpdates, logEntry }) {
  if (!isConfigured || !db) return;

  try {
    if (vehicleId) {
      await updateDoc(doc(db, COLLECTIONS.VEHICULOS, vehicleId), {
        ...vehicleUpdates,
        updatedAt: new Date().toISOString(),
      });
    }
    if (logEntry) {
      await setDoc(doc(db, COLLECTIONS.BITACORA, logEntry.id), {
        ...logEntry,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('Error al guardar Check-out en Firestore:', error);
  }
}

export async function firestoreSyncAveria({ vehicleId, averiaEntry, logEntry }) {
  if (!isConfigured || !db) return;

  try {
    if (averiaEntry) {
      await setDoc(doc(db, COLLECTIONS.AVERIAS, averiaEntry.id), {
        ...averiaEntry,
        timestamp: new Date().toISOString(),
      });
    }
    if (vehicleId) {
      await updateDoc(doc(db, COLLECTIONS.VEHICULOS, vehicleId), {
        estadoOperativo: 'Inhabilitado por Avería',
        updatedAt: new Date().toISOString(),
      });
    }
    if (logEntry) {
      await setDoc(doc(db, COLLECTIONS.BITACORA, logEntry.id), {
        ...logEntry,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('Error al reportar avería en Firestore:', error);
  }
}

export async function firestoreSyncCotizacion(cotizacion) {
  if (!isConfigured || !db) return;

  try {
    await setDoc(doc(db, COLLECTIONS.COTIZACIONES, cotizacion.id), {
      ...cotizacion,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Error al registrar cotización en Firestore:', error);
  }
}

export async function firestoreSyncAddVehiculo(vehiculo) {
  if (!isConfigured || !db) return;

  try {
    await setDoc(doc(db, COLLECTIONS.VEHICULOS, vehiculo.id), {
      ...vehiculo,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Error al agregar vehículo en Firestore:', error);
  }
}

export async function firestoreSyncDeleteVehiculo(vehiculoId) {
  if (!isConfigured || !db) return;

  try {
    await deleteDoc(doc(db, COLLECTIONS.VEHICULOS, vehiculoId));
  } catch (error) {
    console.warn('Error al eliminar vehículo en Firestore:', error);
  }
}

export async function firestoreSyncMantenimiento({ mantenimiento, vehicleId, vehicleUpdates, logEntry }) {
  if (!isConfigured || !db) return;

  try {
    if (mantenimiento) {
      await setDoc(doc(db, COLLECTIONS.MANTENIMIENTOS, mantenimiento.id), {
        ...mantenimiento,
        timestamp: mantenimiento.timestamp || new Date().toISOString(),
      });
    }

    if (vehicleId && vehicleUpdates) {
      await updateDoc(doc(db, COLLECTIONS.VEHICULOS, vehicleId), {
        ...vehicleUpdates,
        updatedAt: new Date().toISOString(),
      });
    }

    if (logEntry) {
      await setDoc(doc(db, COLLECTIONS.BITACORA, logEntry.id), {
        ...logEntry,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('Error al sincronizar mantenimiento en Firestore:', error);
  }
}

/**
 * Elimina todos los registros de la colección 'bitacora' en Firestore
 */
export async function firestoreClearBitacora() {
  if (!isConfigured || !db) return;

  try {
    const snap = await getDocs(collection(db, COLLECTIONS.BITACORA));
    const deletePromises = snap.docs.map((docSnap) =>
      deleteDoc(doc(db, COLLECTIONS.BITACORA, docSnap.id))
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.warn('Error al vaciar colección bitácora en Firestore:', error);
    throw error;
  }
}
