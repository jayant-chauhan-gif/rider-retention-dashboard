'use client';
import { Users, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function Tile({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4`}>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function TrendBadge({ value, prev }) {
  if (prev == null || value == null) return null;
  const diff = (value - prev).toFixed(1);
  const positive = diff >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      {positive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {Math.abs(diff)}%
    </span>
  );
}

export default function KPITiles({ data, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-gray-400 text-sm">
          Failed to load KPIs
        </div>
      </div>
    );
  }

  const retention = data.current_week_retention_pct != null
    ? `${data.current_week_retention_pct}%`
    : '—';

  const retentionSub = data.retained_riders != null && data.prev_week_riders != null
    ? `${data.retained_riders} of ${data.prev_week_riders} prev-week riders returned`
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Tile
        icon={TrendingUp}
        label="Current Week Retention"
        value={retention}
        sub={retentionSub}
        color="bg-indigo-500"
      />
      <Tile
        icon={Users}
        label="Total Active Riders This Week"
        value={data.total_active_riders ?? '—'}
        sub="Riders with ≥1 trip since Monday"
        color="bg-emerald-500"
      />
    </div>
  );
}
