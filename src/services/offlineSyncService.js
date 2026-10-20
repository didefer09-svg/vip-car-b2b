/**
 * VIP CAR B2B - Servicio de Sincronización Offline para Operaciones en Socavón
 * Permite registrar odómetros, checklists y cierres de turno sin señal 4G dentro de la mina,
 * almacenando en cola local y sincronizando automáticamente con Cloud Firestore al recuperar conexión.
 */

import {
  registrarOdometroFirestore,
  firestoreSyncCheckOut,
  firestoreSyncAveria
} from './firestoreService';
import { isConfigured } from '../config/firebase';

const QUEUE_STORAGE_KEY = 'vipcar_socavon_offline_queue';

/**
 * Obtiene la cola de registros pendientes de sincronización
 * @returns {Array}
 */
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error al leer cola offline de socavón:', err);
    return [];
  }
}

/**
 * Guarda la cola actualizada en localStorage
 * @param {Array} queue 
 */
function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    // Dispara evento para actualizar interfaces de usuario en tiempo real
    window.dispatchEvent(new CustomEvent('vipcar-queue-updated', { detail: { count: queue.length } }));
  } catch (err) {
    console.error('Error al guardar cola offline:', err);
  }
}

/**
 * Registra una acción offline en la cola
 * @param {'CHECK_IN'|'CHECK_OUT'|'AVERIA'} tipo 
 * @param {Object} data 
 * @returns {Object} item de cola creado
 */
export function enqueueOfflineAction(tipo, data) {
  const queue = getOfflineQueue();
  const queueItem = {
    id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    tipo,
    data,
    creadoEn: new Date().toISOString(),
    reintentos: 0,
    estado: 'pendiente_socavon'
  };

  queue.push(queueItem);
  saveOfflineQueue(queue);

  console.log(`📡 [Socavón Offline] Acción ${tipo} encolada localmente (${queue.length} pendientes).`);

  // Intenta registrar Background Sync en el Service Worker si el navegador lo soporta
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.sync.register('sync-driver-socavon').catch(() => {});
    });
  }

  return queueItem;
}

/**
 * Cuenta cuántos registros están pendientes de sincronizar
 * @returns {number}
 */
export function getPendingQueueCount() {
  return getOfflineQueue().length;
}

/**
 * Sincroniza todos los registros pendientes con Cloud Firestore
 * @returns {Promise<{synced: number, remaining: number}>}
 */
export async function syncOfflineQueueWithFirestore() {
  if (!navigator.onLine) {
    console.log('📡 [Socavón Offline] Aún sin conexión. Sincronización pospuesta.');
    return { synced: 0, remaining: getPendingQueueCount() };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { synced: 0, remaining: 0 };
  }

  console.log(`🔄 [Socavón Sync] Iniciando sincronización de ${queue.length} registro(s) con Firestore...`);
  const remaining = [];
  let syncedCount = 0;

  for (const item of queue) {
    let success = false;

    try {
      if (item.tipo === 'CHECK_IN') {
        if (isConfigured) {
          const res = await registrarOdometroFirestore(item.data);
          success = Boolean(res);
        } else {
          // Si Firestore no está configurado en demo, se da por sincronizado
          success = true;
        }
      } else if (item.tipo === 'CHECK_OUT') {
        if (isConfigured) {
          const res = await firestoreSyncCheckOut(item.data);
          success = Boolean(res);
        } else {
          success = true;
        }
      } else if (item.tipo === 'AVERIA') {
        if (isConfigured) {
          const res = await firestoreSyncAveria(item.data);
          success = Boolean(res);
        } else {
          success = true;
        }
      }
    } catch (err) {
      console.warn(`⚠️ [Socavón Sync] Fallo al sincronizar registro ${item.id}:`, err);
      success = false;
    }

    if (success) {
      syncedCount++;
    } else {
      item.reintentos = (item.reintentos || 0) + 1;
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);

  if (syncedCount > 0) {
    console.log(`✅ [Socavón Sync] ${syncedCount} registro(s) sincronizados exitosamente con Firestore.`);
    window.dispatchEvent(
      new CustomEvent('vipcar-sync-completed', {
        detail: { synced: syncedCount, remaining: remaining.length }
      })
    );
  }

  return { synced: syncedCount, remaining: remaining.length };
}
