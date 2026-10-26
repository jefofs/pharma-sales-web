const VISITS_KEY = '@pharma:cached_visits';

export async function getCachedVisits() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(VISITS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function setCachedVisits(visits: any[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
}

export async function upsertCachedVisit(visit: any) {
  const current = await getCachedVisits();
  const index = current.findIndex((v: any) => v.id === visit.id);
  if (index >= 0) {
    current[index] = visit;
  } else {
    current.unshift(visit);
  }
  await setCachedVisits(current);
}

export async function removeCachedVisit(id: number | string) {
  const current = await getCachedVisits();
  const filtered = current.filter((v: any) => v.id !== id);
  await setCachedVisits(filtered);
}

export async function replaceLocalIdWithServerId(localId: string, serverVisit: any) {
  const current = await getCachedVisits();
  const index = current.findIndex((v: any) => v.id === localId || v.localId === localId);
  if (index >= 0) {
    current[index] = serverVisit;
  } else {
    current.unshift(serverVisit);
  }
  await setCachedVisits(current);
}