'use client';
import { useState } from 'react';
import { LayoutGrid, LineChart as LineChartIcon, Grid } from 'lucide-react';
import RetentionTable from './RetentionTable';
import RetentionChart from './RetentionChart';
import CohortHeatmap from './CohortHeatmap';

export default function MonthlyTab({ data, loading, error }) {
  const [view, setView] = useState('table'); // 'table' | 'chart' | 'heatmap'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Monthly Cohort — 2026</h2>
          <p className="text-xs text-gray-400 mt-0.5">W1 (Jan 5) through current week · Grouped by month</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'table' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={13} /> Table
          </button>
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'chart' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LineChartIcon size={13} /> Chart
          </button>
          <button
            onClick={() => setView('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'heatmap' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Grid size={13} /> Heatmap
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded" />
            ))}
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-red-400 py-10 text-sm">{error}</div>
        )}
        {!loading && !error && data && (
          view === 'table'   ? <RetentionTable rows={data} groupByMonth={true} /> :
          view === 'chart'   ? <RetentionChart rows={data} /> :
                               <CohortHeatmap rows={data} />
        )}
      </div>
    </div>
  );
}
