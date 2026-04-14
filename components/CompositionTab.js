'use client';
import { useState } from 'react';
import { LayoutGrid, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';

// Colour palette — consistent across chart and table
const SOURCES = [
  { key: 'from_w1',     pctKey: 'from_w1_pct',     label: 'Retained (W-1)',   color: '#6366f1', tailwind: 'bg-indigo-500' },
  { key: 'from_w2',     pctKey: 'from_w2_pct',     label: 'Back from W-2',    color: '#10b981', tailwind: 'bg-emerald-500' },
  { key: 'from_w3plus', pctKey: 'from_w3plus_pct', label: 'Back from W-3+',   color: '#f59e0b', tailwind: 'bg-amber-400' },
  { key: 'new_riders',  pctKey: 'new_pct',         label: 'New riders',        color: '#8b5cf6', tailwind: 'bg-violet-500' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[180px]">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {[...payload].reverse().map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: p.fill }} />
            <span className="text-gray-600">{p.name}</span>
          </div>
          <span className="font-semibold" style={{ color: p.fill }}>
            {p.value} <span className="text-gray-400 font-normal text-xs">
              ({total > 0 ? ((p.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </span>
        </div>
      ))}
      <div className="border-t border-gray-100 mt-2 pt-1.5 flex justify-between">
        <span className="text-gray-500">Total</span>
        <span className="font-bold text-gray-800">{total}</span>
      </div>
    </div>
  );
};

function CompositionChart({ rows }) {
  const data = rows.map((row) => ({
    week:        `W${row.user_week_number}`,
    'Retained (W-1)': parseInt(row.from_w1)     || 0,
    'Back from W-2':  parseInt(row.from_w2)     || 0,
    'Back from W-3+': parseInt(row.from_w3plus) || 0,
    'New riders':     parseInt(row.new_riders)  || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={50} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
        <Bar dataKey="Retained (W-1)" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
        <Bar dataKey="Back from W-2"  stackId="a" fill="#10b981" radius={[0,0,0,0]} />
        <Bar dataKey="Back from W-3+" stackId="a" fill="#f59e0b" radius={[0,0,0,0]} />
        <Bar dataKey="New riders"     stackId="a" fill="#8b5cf6" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CompositionTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="text-left px-4 py-3 font-semibold">Week</th>
            <th className="text-left px-4 py-3 font-semibold">Date</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">Total Active</th>
            <th className="text-right px-4 py-3 font-semibold text-indigo-600">Retained (W-1)</th>
            <th className="text-right px-4 py-3 font-semibold text-emerald-600">Back from W-2</th>
            <th className="text-right px-4 py-3 font-semibold text-amber-500">Back from W-3+</th>
            <th className="text-right px-4 py-3 font-semibold text-violet-600">New Riders</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const total = parseInt(row.total_active) || 0;
            function cell(val, pct, color) {
              const n = parseInt(val) || 0;
              if (!n) return <td className="px-4 py-3 text-right text-gray-300">—</td>;
              return (
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold ${color}`}>{n}</span>
                  <span className="text-xs text-gray-400 ml-1.5">{pct}%</span>
                </td>
              );
            }
            return (
              <tr key={row.week_start_date} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700 font-medium">W{row.user_week_number}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(row.week_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">{total}</td>
                {cell(row.from_w1,     row.from_w1_pct,     'text-indigo-600')}
                {cell(row.from_w2,     row.from_w2_pct,     'text-emerald-600')}
                {cell(row.from_w3plus, row.from_w3plus_pct, 'text-amber-500')}
                {cell(row.new_riders,  row.new_pct,         'text-violet-600')}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function CompositionTab({ data, loading, error }) {
  const [view, setView] = useState('chart'); // 'chart' | 'table'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Weekly Supply Composition</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Where each week's active riders came from · W1 2026 to present
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'chart' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart2 size={13} /> Chart
          </button>
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'table' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={13} /> Table
          </button>
        </div>
      </div>

      {/* Legend pills */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 flex-wrap">
        {SOURCES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm inline-block ${s.tailwind}`} />
            <span className="text-xs text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="p-4">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded" />
            ))}
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-red-400 py-10 text-sm">{error}</div>
        )}
        {!loading && !error && data && (
          view === 'chart'
            ? <CompositionChart rows={data} />
            : <CompositionTable rows={data} />
        )}
      </div>
    </div>
  );
}
