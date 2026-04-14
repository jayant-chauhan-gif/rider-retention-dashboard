const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ngrok free tier shows an interstitial page — this header bypasses it
const HEADERS = { 'ngrok-skip-browser-warning': '1' };

function buildParams(filters = {}) {
  const params = new URLSearchParams();
  if (filters.fleetLevel && filters.fleetLevel !== 'all') params.set('fleet_level', filters.fleetLevel);
  if (filters.warehouseId && filters.warehouseId !== 'all') params.set('warehouse_id', filters.warehouseId);
  if (filters.orderStatus && filters.orderStatus !== 'all') params.set('order_status', filters.orderStatus);
  return params.toString();
}

export async function fetchKPI(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/kpi${qs ? '?' + qs : ''}`, { headers: HEADERS });
  if (!res.ok) throw new Error('KPI fetch failed');
  return res.json();
}

export async function fetchMonthlyCohort(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/cohort/monthly${qs ? '?' + qs : ''}`, { headers: HEADERS });
  if (!res.ok) throw new Error('Monthly cohort fetch failed');
  return res.json();
}

export async function fetchWeeklyCohort(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/cohort/weekly${qs ? '?' + qs : ''}`, { headers: HEADERS });
  if (!res.ok) throw new Error('Weekly cohort fetch failed');
  return res.json();
}

export async function fetchFilters() {
  const res = await fetch(`${BASE_URL}/api/filters`, { headers: HEADERS });
  if (!res.ok) throw new Error('Filters fetch failed');
  return res.json();
}

export async function fetchComposition(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/composition${qs ? '?' + qs : ''}`, { headers: HEADERS });
  if (!res.ok) throw new Error('Composition fetch failed');
  return res.json();
}
