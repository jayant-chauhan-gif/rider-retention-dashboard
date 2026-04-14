const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function buildParams(filters = {}) {
  const params = new URLSearchParams();
  if (filters.fleetLevel && filters.fleetLevel !== 'all') params.set('fleet_level', filters.fleetLevel);
  if (filters.warehouseId && filters.warehouseId !== 'all') params.set('warehouse_id', filters.warehouseId);
  if (filters.orderStatus && filters.orderStatus !== 'all') params.set('order_status', filters.orderStatus);
  return params.toString();
}

export async function fetchKPI(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/kpi${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('KPI fetch failed');
  return res.json();
}

export async function fetchMonthlyCohort(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/cohort/monthly${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('Monthly cohort fetch failed');
  return res.json();
}

export async function fetchWeeklyCohort(filters) {
  const qs = buildParams(filters);
  const res = await fetch(`${BASE_URL}/api/cohort/weekly${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('Weekly cohort fetch failed');
  return res.json();
}

export async function fetchFilters() {
  const res = await fetch(`${BASE_URL}/api/filters`);
  if (!res.ok) throw new Error('Filters fetch failed');
  return res.json();
}
