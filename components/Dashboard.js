'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchKPI, fetchMonthlyCohort, fetchWeeklyCohort, fetchFilters } from '@/lib/api';
import KPITiles from './KPITiles';
import Filters from './Filters';
import SummarySection from './SummarySection';
import MonthlyTab from './MonthlyTab';
import WeeklyTab from './WeeklyTab';

const DEFAULT_FILTERS = { fleetLevel: 'all', warehouseId: 'all', orderStatus: 'all' };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState(null);

  const [kpi, setKpi]         = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [weekly, setWeekly]   = useState(null);
  const [weeklyUpdatedAt, setWeeklyUpdatedAt] = useState(null);

  const [loadingKpi,     setLoadingKpi]     = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingWeekly,  setLoadingWeekly]  = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const [errorKpi,     setErrorKpi]     = useState(null);
  const [errorMonthly, setErrorMonthly] = useState(null);
  const [errorWeekly,  setErrorWeekly]  = useState(null);

  // Load filter options once
  useEffect(() => {
    fetchFilters()
      .then(setFilterOptions)
      .catch(() => {})
      .finally(() => setLoadingFilters(false));
  }, []);

  // Load all data when filters change
  const loadAll = useCallback(() => {
    setLoadingKpi(true);
    setLoadingMonthly(true);
    setLoadingWeekly(true);
    setErrorKpi(null);
    setErrorMonthly(null);
    setErrorWeekly(null);

    fetchKPI(filters)
      .then(setKpi)
      .catch((e) => setErrorKpi(e.message))
      .finally(() => setLoadingKpi(false));

    fetchMonthlyCohort(filters)
      .then((r) => setMonthly(r.data))
      .catch((e) => setErrorMonthly(e.message))
      .finally(() => setLoadingMonthly(false));

    fetchWeeklyCohort(filters)
      .then((r) => { setWeekly(r.data); setWeeklyUpdatedAt(r.updated_at); })
      .catch((e) => setErrorWeekly(e.message))
      .finally(() => setLoadingWeekly(false));
  }, [filters]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Refresh weekly only
  const refreshWeekly = () => {
    setLoadingWeekly(true);
    setErrorWeekly(null);
    fetchWeeklyCohort(filters)
      .then((r) => { setWeekly(r.data); setWeeklyUpdatedAt(r.updated_at); })
      .catch((e) => setErrorWeekly(e.message))
      .finally(() => setLoadingWeekly(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Retention Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Last Mile · 2026 · Mon–Sun weeks</p>
        </div>
        <span className="text-xs text-gray-300">bifrost_prod</span>
      </div>

      {/* KPI Tiles */}
      <KPITiles data={kpi} loading={loadingKpi} error={errorKpi} />

      {/* Filters */}
      <Filters
        filters={filters}
        onChange={setFilters}
        filterOptions={filterOptions}
        loading={loadingFilters}
      />

      {/* Summary — YTD aggregate stats */}
      <SummarySection data={monthly} loading={loadingMonthly} />

      {/* Detailed section label */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Detailed Cohort Analysis</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { id: 'monthly', label: 'Monthly Cohort' },
          { id: 'weekly',  label: 'Weekly Live' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'monthly' && (
        <MonthlyTab data={monthly} loading={loadingMonthly} error={errorMonthly} />
      )}
      {activeTab === 'weekly' && (
        <WeeklyTab
          data={weekly}
          updatedAt={weeklyUpdatedAt}
          loading={loadingWeekly}
          error={errorWeekly}
          onRefresh={refreshWeekly}
        />
      )}
    </div>
  );
}
