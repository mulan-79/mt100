import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { useMountains } from '../../context/MountainsContext'
import {
  getDifficultyLabel,
  getRecommendedPendingPeaks,
} from '../../data/mountains'

export function NextRecommendedPeaks() {
  const { mountains, loading } = useMountains()
  const picks = getRecommendedPendingPeaks(mountains, 3)

  if (loading || picks.length === 0) return null

  return (
    <section
      id="recommended-peaks"
      className="scroll-mt-20 border-b border-forest-200 bg-gradient-to-b from-white to-forest-50/80 py-14 sm:py-20"
      aria-labelledby="recommended-peaks-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-600">
              <Sparkles className="size-4" aria-hidden />
              Next challenge
            </p>
            <h2
              id="recommended-peaks-heading"
              className="text-2xl font-bold tracking-tight text-forest-900 sm:text-3xl"
            >
              다음 도전 추천 명산
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-700 sm:text-base">
              아직 정복 전인 산 중 난이도가 낮은 순으로 세 곳을 골랐어요. 첫 걸음을
              옮기기 좋은 코스예요.
            </p>
          </div>
          <Link
            to="/journal"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest-600 no-underline transition hover:text-forest-800"
          >
            정복기 전체 보기
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid gap-5 sm:grid-cols-3">
          {picks.map((m, index) => (
            <li key={m.id} className="min-h-0">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-forest-200 bg-white shadow-sm transition hover:border-emerald-300/80 hover:shadow-md">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-forest-200">
                  <img
                    src={m.image}
                    alt={m.imageAlt ?? `${m.name} 풍경`}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                      추천 {index + 1}
                    </span>
                    <span className="rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      난이도 {getDifficultyLabel(m.difficulty)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-lg font-semibold text-forest-900">{m.name}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-forest-600">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {m.region}
                  </p>
                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-forest-600/95 sm:text-sm">
                    {m.duration}
                  </p>
                  <Link
                    to="/journal"
                    className="mt-1 inline-flex items-center justify-center rounded-lg border border-forest-200 bg-forest-50 py-2 text-xs font-semibold text-forest-800 no-underline transition hover:bg-forest-100 sm:text-sm"
                  >
                    정복기에서 보기
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
