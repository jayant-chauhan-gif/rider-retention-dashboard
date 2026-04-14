'use client';
import { TrendingUp, TrendingDown, Award, AlertTriangle, RefreshCw, Zap } from 'lucide-react';

function avg(rows, key) {
  const valid = rows.filter(r => parseFloat(r[key]) > 0);
  if (!valid.length) return null;
  return (valid.reduce((s, r) => s + parseFloat(r[key]), 0) / valid.length).toFixed(1);
}

function best(rows, key) {
  const valid = rows.filter(r => parseFloat(r[key]) > 0);
  if (!valid.length) return null;
  return valid.reduce((best, r) => parseFloat(r[key]) > parseFloat(best[key]) ? r : best, valid[0]);
}

function worst(rows, key) {
  const valid = rows.filter(r => parseFloat(r[key]) > 0);
  if (!valid.length) return null;
  return valid.reduce((w, r) => parseFloat(r[key]) < parseFloat(w[key]) ? r : w, valid[0]);
}

function pctColor(val) {
  const n = parseFloat(val);
  if (n >= 80) return 'text-green-600';
  if (n >= 65) return 'text-yellow-600';
  return 'text-red-500';
}

function StatCard({ icon: Icon, iconColor, label, value, sub, valueColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={iconColor} />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${valueColor || 'text-gray-900'}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function SummarySection({ data, loading }) {
  if (loading || !data?.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  // Only use completed weeks (where W-1 data exists) for averages
  const completedRows = data.filter(r => parseFloat(r.w1_pct) > 0);

  const avgW1     = avg(completedRows, 'w1_pct');
  const avgW2     = avg(completedRows, 'w2_pct');
  const avgReact  = avg(completedRows, 'reactivation_pct');
  const bestW1    = best(completedRows, 'w1_pct');
  const worstW1   = worst(completedRows, 'w1_pct');

  // Week-on-week trend: last completed vs previous
  const last2 = completedRows.slice(-2);
  let trend = null;
  if (last2.length === 2) {
    trend = (parseFloat(last2[1].w1_pct) - parseFloat(last2[0].w1_pct)).toFixed(1);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">2026 Year-to-Date Summary</span>
        <span className="text-xs text-gray-400">· {completedRows.length} complete weeks</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={TrendingUp}
          iconColor="text-indigo-500"
          label="Avg W-1 Retention"
          value={avgW1 ? `${avgW1}%` : '—'}
          sub="Across all complete weeks"
          valueColor={avgW1 ? pctColor(avgW1) : ''}
        />
        <StatCard
          icon={TrendingUp}
          iconColor="text-emerald-500"
          label="Avg W-2 Retention"
          value={avgW2 ? `${avgW2}%` : '—'}
          sub="2 weeks after cohort"
          valueColor={avgW2 ? pctColor(avgW2) : ''}
        />
        <StatCard
          icon={Zap}
          iconColor="text-amber-500"
          label="Avg Reactivation"
          value={avgReact ? `${avgReact}%` : '—'}
          sub="Skipped W+1, returned W+2"
          valueColor="text-amber-600"
        />
        <StatCard
          icon={Award}
          iconColor="text-green-500"
          label="Best Week (W-1)"
          value={bestW1 ? `${bestW1.w1_pct}%` : '—'}
          sub={bestW1 ? `W${bestW1.user_week_number} · ${bestW1.week_start_date}` : null}
          valueColor="text-green-600"
        />
        <StatCard
          icon={AlertTriangle}
          iconColor="text-red-400"
          label="Worst Week (W-1)"
          value={worstW1 ? `${worstW1.w1_pct}%` : '—'}
          sub={worstW1 ? `W${worstW1.user_week_number} · ${worstW1.week_start_date}` : null}
          valueColor="text-red-500"
        />
        <StatCard
          icon={trend >= 0 ? TrendingUp : TrendingDown}
          iconColor={trend >= 0 ? 'text-green-500' : 'text-red-400'}
          label="WoW Trend"
          value={trend !== null ? `${trend > 0 ? '+' : ''}${trend}%` : '—'}
          sub="vs prior complete week"
          valueColor={trend >= 0 ? 'text-green-600' : 'text-red-500'}
        />
      </div>
    </div>
  );
}
