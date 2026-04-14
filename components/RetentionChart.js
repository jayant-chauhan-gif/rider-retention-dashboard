'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value != null ? `${p.value}%` : '—'}
        </p>
      ))}
    </div>
  );
};

export default function RetentionChart({ rows }) {
  if (!rows || rows.length === 0) {
    return <div className="text-center text-gray-400 py-10 text-sm">No data available</div>;
  }

  const data = rows.map((row) => ({
    week: `W${row.user_week_number}`,
    'W-1 Retention': row.w1_pct != null ? parseFloat(row.w1_pct) || null : null,
    'W-2 Retention': row.w2_pct != null ? parseFloat(row.w2_pct) || null : null,
    active: row.active_riders,
  }));

  // Null out 0s for current/incomplete week so lines don't drop to zero
  data.forEach((d) => {
    if (d['W-1 Retention'] === 0) d['W-1 Retention'] = null;
    if (d['W-2 Retention'] === 0) d['W-2 Retention'] = null;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
        />
        <ReferenceLine y={70} stroke="#e5e7eb" strokeDasharray="4 4" label={{ value: '70%', position: 'insideTopRight', fontSize: 11, fill: '#9ca3af' }} />
        <Line
          type="monotone"
          dataKey="W-1 Retention"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#6366f1' }}
          activeDot={{ r: 6 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="W-2 Retention"
          stroke="#10b981"
          strokeWidth={2.5}
          strokeDasharray="5 3"
          dot={{ r: 4, fill: '#10b981' }}
          activeDot={{ r: 6 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
