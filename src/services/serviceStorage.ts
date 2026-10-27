import { Visit } from '@/context/VisitContext';
import { CreateVisitRequest } from './VisitService';

export type CachedVisit = Visit;

export interface QueueItem {
  localId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  serverId?: number;
  payload?: CreateVisitRequest;
}

const VISITS_KEY = '@pharma:cached_visits';
const QUEUE_KEY = '@pharma:sync_queue';

export const makeLocalId = (): string => 
  `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export async function getCachedVisits(): Promise<CachedVisit[]> {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(VISITS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function setCachedVisits(visits: CachedVisit[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
}

export async function upsertCachedVisit(visit: CachedVisit): Promise<void> {
  const current = await getCachedVisits();
  const index = current.findIndex(
    (v) => v.id === visit.id || (v.localId && v.localId === visit.localId)
  );
  if (index >= 0) {
    current[index] = visit;
  } else {
    current.unshift(visit);
  }
  await setCachedVisits(current);
}

export async function removeCachedVisit(id: number | string): Promise<void> {
  const current = await getCachedVisits();
  const filtered = current.filter((v) => v.id !== id);
  await setCachedVisits(filtered);
}

export async function replaceLocalIdWithServerId(
  localId: string,
  serverVisit: CachedVisit
): Promise<void> {
  const current = await getCachedVisits();
  const index = current.findIndex((v) => v.id === localId || v.localId === localId);
  if (index >= 0) {
    current[index] = serverVisit;
  } else {
    current.unshift(serverVisit);
  }
  await setCachedVisits(current);
}

/* Gestão de Fila Offline */

export async function getQueue(): Promise<QueueItem[]> {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function enqueue(item: QueueItem): Promise<void> {
  const queue = await getQueue();
  queue.push(item);
  if (typeof window !== 'undefined') {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
}

export async function removeFromQueue(localId: string): Promise<void> {
  const queue = await getQueue();
  const filtered = queue.filter((i) => i.localId !== localId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  }
}