import { Mountain } from 'lucide-react'
import { getMountainChallengeProgress } from '../../data/mountains'

export function MountainProgressBar() {
  const { completed, total, percent } = getMountainChallengeProgress()

  return (
    <section
      className="border-b border-forest-200 bg-gradient-to-b from-forest-50 to-white px-4 py-6 sm:px-6 sm:py-8"
      aria-labelledby="progress-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest-500/10 text-forest-600 ring-1 ring-forest-200">
              <Mountain className="size-5" aria-hidden />
            </span>
            <div>
              <h2
                id="progress-heading"
                className="text-sm font-semibold tracking-wide text-forest-800 sm:text-base"
              >
                명산 100 정복 진행률
              </h2>
              <p className="text-xs text-forest-600/90 sm:text-sm">
                블랙야크 명산 100 — 정상을 밟은 산만 집계해요
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 sm:text-right">
            <span className="text-2xl font-bold tabular-nums tracking-tight text-forest-900 sm:text-3xl">
              {percent}%
            </span>
            <span className="text-sm tabular-nums text-forest-600">
              {completed} / {total} 완료
            </span>
          </div>
        </div>

        <div
          className="relative h-4 overflow-hidden rounded-full bg-forest-200/80 shadow-inner ring-1 ring-forest-300/40 sm:h-5"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`명산 정복 ${percent}퍼센트, ${completed}개 완료`}
        >
          <div
            className="progress-bar-fill relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 via-forest-500 to-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            <span
              className="progress-bar-shimmer absolute inset-y-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent motion-reduce:hidden"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  )
}
