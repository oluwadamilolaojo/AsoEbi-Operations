import type { Groomsman } from '@/types'
import { TAILORING_STEPS } from '@/types'

export function TailoringProgress({ groomsmen }: { groomsmen: Groomsman[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-start gap-0 min-w-max">
        {TAILORING_STEPS.map((step, i) => {
          const count    = groomsmen.filter(g => g.tailoring_status === step).length
          const isLast   = i === TAILORING_STEPS.length - 1
          const isDone   = step === 'In Abuja ✓'
          const pct      = groomsmen.length > 0
            ? Math.round((count / groomsmen.length) * 100) : 0

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center w-32">
                {/* Step circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                 font-display font-bold text-sm border-2 transition-all ${
                  count > 0
                    ? isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-navy-700 border-navy-700 text-white'
                    : 'bg-white border-navy-200 text-navy-300'
                }`}>
                  {count > 0 ? count : i + 1}
                </div>

                {/* Label */}
                <p className={`text-center text-xs mt-2 leading-tight font-body px-1 ${
                  count > 0 ? 'text-navy-700 font-medium' : 'text-navy-300'
                }`}>
                  {step}
                </p>

                {/* Count badge */}
                {count > 0 && (
                  <span className="mt-1 text-xs font-semibold text-gold-600 font-body">
                    {pct}%
                  </span>
                )}

                {/* Names */}
                {count > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {groomsmen
                      .filter(g => g.tailoring_status === step)
                      .map(g => (
                        <p key={g.id} className="text-xs text-navy-500 text-center font-body">
                          {g.name.split(' ')[0]}
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Connector */}
              {!isLast && (
                <div className={`h-0.5 w-8 -mt-10 transition-colors ${
                  count > 0 ? 'bg-navy-400' : 'bg-navy-100'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
