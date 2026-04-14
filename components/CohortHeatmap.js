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

function getReactColor(val) {
  const n = parseFloat(val);
  if (isNaN(n) || n === 0) return { bg: 'bg-gray-100', text: 'text-gray-300', label: '—' };
  if (n >= 15) return { bg: 'bg-amber-600', text: 'text-white',      label: `${n}%` };
  if (n >= 10) return { bg: 'bg-amber-400', text: 'text-white',      label: `${n}%` };
  if (n >= 5)  return { bg: 'bg-amber-200', text: 'text-amber-900',  label: `${n}%` };
  return          { bg: 'bg-amber-100', text: 'text-amber-700',  label: `${n}%` };
}

function Cell({ val, colorFn }) {
  const { bg, text, label } = (colorFn || getColor)(val);
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
      {/* Retention scale legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Retention scale:</span>
        {[
          { bg: 'bg-red-400',    label: '< 55%' },
          { bg: 'bg-orange-300', label: '55–64%' },
          { bg: 'bg-yellow-300', label: '65–74%' },
          { bg: 'bg-green-400',  label: '75–84%' },
          { bg: 'bg-green-600',  label: '≥ 85%' },
          { bg: 'bg-gray-100',   label: 'No data', border: true },
        ].map(({ bg, label, border }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${bg} ${border ? 'border border-gray-300' : ''}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
        <span className="text-xs text-gray-300 mx-1">|</span>
        <span className="text-xs text-gray-500 font-medium">Reactivation scale:</span>
        {[
          { bg: 'bg-amber-100', label: '< 5%' },
          { bg: 'bg-amber-200', label: '5–9%' },
          { bg: 'bg-amber-400', label: '10–14%' },
          { bg: 'bg-amber-600', label: '≥ 15%' },
        ].map(({ bg, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${bg}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100 w-16">Week</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100 w-20">Date</th>
            <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-100">Active (W0)</th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-indigo-50 border border-gray-100">W+1</th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50 border border-gray-100">W+2</th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-violet-600 uppercase tracking-wide bg-violet-50 border border-gray-100">W+3</th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-pink-600 uppercase tracking-wide bg-pink-50 border border-gray-100">W+4</th>
            <th className="text-center px-3 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide bg-amber-50 border border-gray-100">Reactivation</th>
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
              <Cell val={row.w3_pct} />
              <Cell val={row.w4_pct} />
              <Cell val={row.reactivation_pct} colorFn={getReactColor} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
