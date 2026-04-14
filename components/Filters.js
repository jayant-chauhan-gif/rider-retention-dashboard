'use client';
import { Filter } from 'lucide-react';

function Select({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[160px]"
      >
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function Filters({ filters, onChange, filterOptions, loading }) {
  const warehouseOptions = (filterOptions?.warehouses || []).map((w) => ({
    value: w.warehouse_id,
    label: w.name,
  }));

  const fleetOptions = filterOptions?.fleetLevels || [];

  const statusOptions = (filterOptions?.orderStatuses || []).map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
  }));

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={15} className="text-gray-400" />
        <span className="text-sm font-semibold text-gray-600">Filters</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <Select
          label="Fleet Level"
          value={filters.fleetLevel}
          onChange={(v) => onChange({ ...filters, fleetLevel: v })}
          options={fleetOptions}
          allLabel="All Levels"
        />
        <Select
          label="Warehouse"
          value={filters.warehouseId}
          onChange={(v) => onChange({ ...filters, warehouseId: v })}
          options={warehouseOptions}
          allLabel="All Warehouses"
        />
        <Select
          label="Order Status"
          value={filters.orderStatus}
          onChange={(v) => onChange({ ...filters, orderStatus: v })}
          options={statusOptions}
          allLabel="All Statuses"
        />
        {(filters.fleetLevel !== 'all' || filters.warehouseId !== 'all' || filters.orderStatus !== 'all') && (
          <div className="flex flex-col gap-1 justify-end">
            <button
              onClick={() => onChange({ fleetLevel: 'all', warehouseId: 'all', orderStatus: 'all' })}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2 border border-indigo-200 rounded-lg"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
