'use client';
import { useState } from 'react';
import { LayoutGrid, LineChart as LineChartIcon, RefreshCw } from 'lucide-react';
import RetentionTable from './RetentionTable';
import RetentionChart from './RetentionChart';

export default function WeeklyTab({ data, updatedAt, loading, error, onRefresh }) {
  const [view, setView] = useState('table');

  const lastUpdated = updatedAt
    ? new Date(updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Weekly Live Data</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-gray-400">Last 3 weeks · Refreshes daily</p>
            {lastUpdated && (
              <p className="text-xs text-gray-300">· As of {lastUpdated}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
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
          </div>
        </div>
      </div>

      {/* Notice about current week */}
      <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
        <strong>Note:</strong> The current week (W{data?.[data.length - 1]?.user_week_number ?? '—'}) is in progress.
        W-1 and W-2 retention for it will populate as the following weeks complete.
      </div>

      {/* Body */}
      <div className="p-4">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded" />
            ))}
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-red-400 py-10 text-sm">{error}</div>
        )}
        {!loading && !error && data && (
          view === 'table'
            ? <RetentionTable rows={data} groupByMonth={false} />
            : <RetentionChart rows={data} />
        )}
      </div>
    </div>
  );
}
