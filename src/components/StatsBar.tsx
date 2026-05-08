interface Props {
  total:    number
  allPaid:  number
  totalOwed: number
  totalPaid: number
  inAbuja:  number
}

export function StatsBar({ total, allPaid, totalOwed, totalPaid, inAbuja }: Props) {
  const outstanding = totalOwed - totalPaid
  const pctPaid     = total > 0 ? Math.round((allPaid / total) * 100) : 0

  const stats = [
    {
      label: 'Groomsmen',
      value: total.toString(),
      sub:   `${allPaid} fully paid`,
      accent: false,
    },
    {
      label: 'Total Collected',
      value: `₦${totalPaid.toLocaleString()}`,
      sub:   `of ₦${totalOwed.toLocaleString()} owed`,
      accent: false,
    },
    {
      label: 'Outstanding',
      value: `₦${outstanding.toLocaleString()}`,
      sub:   outstanding === 0 ? 'All settled ✓' : `${100 - pctPaid}% remaining`,
      accent: outstanding > 0,
    },
    {
      label: 'In Abuja',
      value: `${inAbuja} / ${total}`,
      sub:   inAbuja === total && total > 0 ? 'Everyone arrived ✓' : 'clothes delivered',
      accent: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="card p-5">
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-1 font-body">
            {s.label}
          </p>
          <p className={`font-display text-2xl font-bold ${
            s.accent ? 'text-red-600' : 'text-navy-800'
          }`}>
            {s.value}
          </p>
          <p className="text-xs text-navy-400 mt-0.5 font-body">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}
