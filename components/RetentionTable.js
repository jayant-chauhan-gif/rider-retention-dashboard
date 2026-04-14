'use client';

function pctCell(val) {
  if (val == null || val === '0.0' || val === 0) return <span className="text-gray-300">—</span>;
  const n = parseFloat(val);
  const color =
    n >= 80 ? 'text-green-700 bg-green-50' :
    n >= 65 ? 'text-yellow-700 bg-yellow-50' :
              'text-red-700 bg-red-50';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-semibold ${color}`}>
      {n}%
    </span>
  );
}

export default function RetentionTable({ rows, groupByMonth = false }) {
  if (!rows || rows.length === 0) {
    return <div className="text-center text-gray-400 py-10 text-sm">No data available</div>;
  }

  if (groupByMonth) {
    // Group rows by month of week_start_date
    const groups = {};
    const groupOrder = [];
    rows.forEach((row) => {
      const d = new Date(row.week_start_date);
      const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) {
        groups[key] = [];
        groupOrder.push(key);
      }
      groups[key].push(row);
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Month</th>
              <th className="text-left px-4 py-3 font-semibold">Week</th>
              <th className="text-left px-4 py-3 font-semibold">Week Start</th>
              <th className="text-right px-4 py-3 font-semibold">Active Riders (W0)</th>
              <th className="text-right px-4 py-3 font-semibold">Retained W-1</th>
              <th className="text-center px-4 py-3 font-semibold">W-1 Retention</th>
              <th className="text-right px-4 py-3 font-semibold">Retained W-2</th>
              <th className="text-center px-4 py-3 font-semibold">W-2 Retention</th>
            </tr>
          </thead>
          <tbody>
            {groupOrder.map((month) =>
              groups[month].map((row, i) => (
                <tr key={row.week_of_year} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  {i === 0 ? (
                    <td
                      rowSpan={groups[month].length}
                      className="px-4 py-3 font-semibold text-gray-700 align-top border-r border-gray-100"
                    >
                      {month}
                    </td>
                  ) : null}
                  <td className="px-4 py-3 text-gray-700 font-medium">W{row.user_week_number}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(row.week_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{row.active_riders}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{row.retained_w1 || '—'}</td>
                  <td className="px-4 py-3 text-center">{pctCell(row.w1_pct)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{parseFloat(row.retained_w2) > 0 ? row.retained_w2 : '—'}</td>
                  <td className="px-4 py-3 text-center">{pctCell(row.w2_pct)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Flat table (for weekly tab)
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="text-left px-4 py-3 font-semibold">Week</th>
            <th className="text-left px-4 py-3 font-semibold">Week Start</th>
            <th className="text-right px-4 py-3 font-semibold">Active Riders (W0)</th>
            <th className="text-right px-4 py-3 font-semibold">Retained W-1</th>
            <th className="text-center px-4 py-3 font-semibold">W-1 Retention</th>
            <th className="text-right px-4 py-3 font-semibold">Retained W-2</th>
            <th className="text-center px-4 py-3 font-semibold">W-2 Retention</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.week_of_year} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-700 font-medium">W{row.user_week_number}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(row.week_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-800">{row.active_riders}</td>
              <td className="px-4 py-3 text-right text-gray-600">{row.retained_w1 || '—'}</td>
              <td className="px-4 py-3 text-center">{pctCell(row.w1_pct)}</td>
              <td className="px-4 py-3 text-right text-gray-600">{parseFloat(row.retained_w2) > 0 ? row.retained_w2 : '—'}</td>
              <td className="px-4 py-3 text-center">{pctCell(row.w2_pct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
