import { useMemo } from 'react'
import { Mountain, MountainSnow } from 'lucide-react'
import { useMountains } from '../../context/MountainsContext'
import {
  getHomeMountainChallengePlusProgress,
  getHomeMountainChallengeProgress,
} from '../../data/mountains'

function ProgressBlock({
  iconSlot,
  iconClass,
  ringClass,
  title,
  subtitle,
  loading,
  percent,
  completed,
  total,
  progressId,
  emptyHint,
}) {
  const showEmptyHint = !loading && total === 0 && emptyHint

  return (
    <div className="rounded-2xl border border-forest-200/80 bg-white/50 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-10 items-center justify-center rounded-xl ring-1 ${ringClass} ${iconClass}`}
          >
            {iconSlot}
          </span>
          <div>
            <h2
              id={progressId}
              className="text-sm font-semibold tracking-wide text-forest-800 sm:text-base"
            >
              {title}
            </h2>
            <p className="text-xs text-forest-600/90 sm:text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 sm:text-right">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-forest-900 sm:text-3xl">
            {loading ? '—' : showEmptyHint ? '—' : `${percent}%`}
          </span>
          <span className="text-sm tabular-nums text-forest-600">
            {loading
              ? '불러오는 중…'
              : showEmptyHint
                ? '명단 없음'
                : `${completed} / ${total} 완료`}
          </span>
        </div>
      </div>

      {showEmptyHint ? (
        <p className="text-xs text-forest-500">{emptyHint}</p>
      ) : (
        <div
          className="relative h-4 overflow-hidden rounded-full bg-forest-200/80 shadow-inner ring-1 ring-forest-300/40 sm:h-5"
          role="progressbar"
          aria-labelledby={progressId}
          aria-valuenow={loading ? 0 : percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} ${percent}퍼센트, ${completed}개 완료`}
        >
          <div
            className="progress-bar-fill relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 via-forest-500 to-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.35)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: loading ? '0%' : `${percent}%` }}
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
            <span
              className="progress-bar-shimmer absolute inset-y-0 w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent motion-reduce:hidden"
              aria-hidden
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function MountainProgressBar() {
  const { mountains, mountains100Plus, loading } = useMountains()
  const progress100 = useMemo(
    () => getHomeMountainChallengeProgress(mountains),
    [mountains],
  )
  const progressPlus = useMemo(
    () => getHomeMountainChallengePlusProgress(mountains, mountains100Plus),
    [mountains, mountains100Plus],
  )

  return (
    <section
      className="border-b border-forest-200 bg-gradient-to-b from-forest-50 to-white px-4 py-6 sm:px-6 sm:py-8"
      aria-label="명산 정복 진행률"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <ProgressBlock
          iconSlot={<Mountain className="size-5" aria-hidden />}
          iconClass="bg-forest-500/10 text-forest-600"
          ringClass="ring-forest-200"
          title="명산 100 정복 진행률"
          subtitle="명산 100 명단과 이름이 같은 기록만, 산마다 한 번만 집계해요"
          loading={loading}
          percent={progress100.percent}
          completed={progress100.completed}
          total={progress100.total}
          progressId="progress-heading-100"
        />
        <ProgressBlock
          iconSlot={<MountainSnow className="size-5" aria-hidden />}
          iconClass="bg-sky-500/10 text-sky-700"
          ringClass="ring-sky-200"
          title="명산 100+ 정복 진행률"
          subtitle="100+ 확장 명단과 이름이 같은 기록만, 산마다 한 번만 집계해요"
          loading={loading}
          percent={progressPlus.percent}
          completed={progressPlus.completed}
          total={progressPlus.total}
          progressId="progress-heading-100plus"
          emptyHint="Firebase에 `mountains_100_plus` 컬렉션에 산 문서를 추가하면 달성도가 집계됩니다."
        />
      </div>
    </section>
  )
}
