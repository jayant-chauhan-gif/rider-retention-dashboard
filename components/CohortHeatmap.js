'use client';

function getColor(val) {
  const n = parseFloat(val);
  if (isNaN(n) || n === 0) return { bg: 'bg-gray-100', text: 'text-gray-300', label: '—' };
  if (n >= 85) return { bg: 'bg-green-600',  text: 'text-white',      label: `${n}%` };
  if (n >= 75) return { bg: 'bg-green-400',  text: 'text-white',      label: `${n}%` };
  if (n >= 65) return { bg: 'bg-yellow-300', text: 'text-yellow-900', label: `${n}%` };
  if (n >= 55) return { bg: 'bg-orange-300', text: 'text-orange-900', label: `${n}%` };
  return          { bg: 'bg-red-400',    text: 'text-white',      label: `${n}%` };
}

function Cell({ val }) {
  const { bg, text, label } = getColor(val);
  return (
    <td className={`px-2 py-2.5 text-center text-xs font-semibold ${bg} ${text} border border-white`}>
      {label}
    </td>
  );
}

export default function CohortHeatmap({ rows }) {
  if (!rows || rows.length === 0) {
    return <div className="text-center text-gray-400 py-10 text-sm">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Scale:</span>
        {[
          { bg: 'bg-red-400',    label: '< 55%' },
          { bg: 'bg-orange-300', label: '55–64%' },
          { bg: 'bg-yellow-300', label: '65–74%' },
          { bg: 'bg-green-400',  label: '75–84%' },
          { bg: 'bg-green-600',  label: '≥ 85%' },
          { bg: 'bg-gray-100',   label: 'No data' },
        ].map(({ bg, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${bg} border border-gray-200`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100 w-24">
              Week
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100 w-24">
              Date
            </th>
            <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100">
              Active (W0)
            </th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-indigo-50 border border-gray-100">
              W+1 Retention
            </th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50 border border-gray-100">
              W+2 Retention
            </th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide bg-amber-50 border border-gray-100">
              Reactivation
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.week_start_date} className="hover:brightness-95 transition-all">
              <td className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-100">
                W{row.user_week_number}
              </td>
              <td className="px-3 py-2.5 text-xs text-gray-500 bg-gray-50 border border-gray-100">
                {new Date(row.week_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </td>
              <td className="px-3 py-2.5 text-xs text-right font-medium text-gray-700 bg-gray-50 border border-gray-100">
                {row.active_riders}
              </td>
              <Cell val={row.w1_pct} />
              <Cell val={row.w2_pct} />
              <Cell val={row.reactivation_pct} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
