import { useMemo, useState } from 'react'
import { Calendar, History, LayoutGrid, MapPin, Search } from 'lucide-react'
import { useMountains } from '../context/MountainsContext'
import { JournalDetailModal } from './JournalDetailModal'
import { MOUNTAIN_FILTER_REGIONS } from '../data/mountains'

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

function normalizeForSearch(str) {
  return str.trim().toLowerCase()
}

/** 완료 산은 등반일 오름차순(과거→최근), 이후 예정 산은 난이도 순 */
function sortForTimeline(list) {
  const completed = list.filter((m) => m.status === 'completed')
  const pending = list.filter((m) => m.status === 'pending')
  completed.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  pending.sort((a, b) => a.difficulty - b.difficulty)
  return [...completed, ...pending]
}

function JournalCardContent({ m, variant }) {
  const isTimeline = variant === 'timeline'
  return (
    <>
      <div
        className={
          isTimeline
            ? 'relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-forest-200 sm:aspect-auto sm:h-40 sm:w-48 sm:shrink-0'
            : 'relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-forest-200'
        }
      >
        <img
          src={m.image}
          alt={m.imageAlt ?? `${m.name} 풍경 사진`}
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/55 to-transparent sm:bg-gradient-to-r sm:from-black/25 sm:to-transparent" />
        <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {m.region}
        </span>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-auto sm:left-3 sm:top-1/2 sm:right-auto sm:-translate-y-1/2">
          <span className="flex items-center gap-1.5 font-semibold text-white drop-shadow-md">
            <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
            {m.name}
          </span>
        </div>
      </div>
      <div
        className={
          isTimeline
            ? 'flex min-w-0 flex-1 flex-col gap-2 p-4 sm:justify-center sm:py-4 sm:pl-4 sm:pr-5'
            : 'flex flex-1 flex-col gap-3 p-4 sm:p-5'
        }
      >
        {m.status === 'pending' ? (
          <p className="flex items-center gap-2 text-sm font-medium text-forest-600">
            <Calendar className="size-4 shrink-0 text-forest-500" aria-hidden />
            등산예정
          </p>
        ) : (
          <>
            <p className="flex items-center gap-2 text-sm text-forest-700/90">
              <Calendar className="size-4 shrink-0 text-forest-500" aria-hidden />
              <time dateTime={m.date}>{formatDate(m.date)}</time>
            </p>
            <p
              className={
                isTimeline
                  ? 'line-clamp-3 text-sm leading-relaxed text-forest-800/95'
                  : 'line-clamp-4 flex-1 text-sm leading-relaxed text-forest-800/95'
              }
            >
              {m.reflection}
            </p>
          </>
        )}
        <span className="text-xs font-medium text-forest-500">
          탭하여 상세 보기
        </span>
      </div>
    </>
  )
}

export function ReviewList() {
  const { mountains: allMountains, loading, error, source } = useMountains()
  const [query, setQuery] = useState('')
  const [regionId, setRegionId] = useState('all')
  const [detailMountain, setDetailMountain] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const filtered = useMemo(() => {
    const q = normalizeForSearch(query)
    return allMountains.filter((m) => {
      const nameOk =
        q === '' || normalizeForSearch(m.name).includes(q)
      const regionOk =
        regionId === 'all' || m.region === regionId
      return nameOk && regionOk
    })
  }, [query, regionId, allMountains])

  const timelineList = useMemo(() => sortForTimeline(filtered), [filtered])

  return (
    <section
      id="journal"
      className="scroll-mt-20 border-b border-forest-200 bg-white/60 py-16 sm:py-20"
      aria-labelledby="journal-heading"
    >
      <JournalDetailModal
        mountain={detailMountain}
        onClose={() => setDetailMountain(null)}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-forest-600">
            Journal
          </p>
          <h2
            id="journal-heading"
            className="text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl"
          >
            정복기
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest-800/85">
            오른 산의 풍경과 그날의 기분을 짧게 남긴 기록입니다. 카드를 누르면 상세 정보를
            볼 수 있어요. 타임라인 보기에서는 등반일 기준으로 과거부터 최근 순으로 정렬됩니다.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-forest-500"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="산 이름 검색 (예: 한라산, 설악)"
              aria-label="산 이름 검색"
              className="w-full rounded-xl border border-forest-200 bg-white py-3 pl-11 pr-4 text-sm text-forest-900 shadow-sm outline-none ring-forest-500/30 transition placeholder:text-forest-400 focus:border-forest-400 focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-medium text-forest-600">지역</p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="지역 필터"
              >
                {MOUNTAIN_FILTER_REGIONS.map((r) => {
                  const selected = regionId === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegionId(r.id)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                        selected
                          ? 'border-forest-600 bg-forest-600 text-white shadow-sm'
                          : 'border-forest-200 bg-white/90 text-forest-800 hover:border-forest-400 hover:bg-forest-50'
                      }`}
                      aria-pressed={selected}
                    >
                      {r.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-forest-600">보기</p>
              <div
                className="inline-flex rounded-xl border border-forest-200 bg-white p-1 shadow-sm"
                role="group"
                aria-label="정복기 보기 방식"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                    viewMode === 'grid'
                      ? 'bg-forest-600 text-white shadow-sm'
                      : 'text-forest-700 hover:bg-forest-50'
                  }`}
                >
                  <LayoutGrid className="size-4 shrink-0" aria-hidden />
                  그리드
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  aria-pressed={viewMode === 'timeline'}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                    viewMode === 'timeline'
                      ? 'bg-forest-600 text-white shadow-sm'
                      : 'text-forest-700 hover:bg-forest-50'
                  }`}
                >
                  <History className="size-4 shrink-0" aria-hidden />
                  타임라인
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'timeline' ? (
            <p className="text-xs text-forest-600">
              <strong>타임라인</strong>: 완료 산은 등반일 <strong>오름차순</strong>(과거 → 최근),
              그 다음 <strong>등산 예정</strong> 산은 난이도 순입니다.
            </p>
          ) : null}

          {error && source === 'local-seed-fallback' ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Firestore에 연결하지 못해 로컬 샘플 데이터를 표시합니다. (
              {error})
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-forest-200 bg-forest-50/80 py-20">
            <div
              className="size-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-600"
              aria-hidden
            />
            <p className="text-sm font-medium text-forest-700">
              정복기 데이터를 불러오는 중…
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-forest-300 bg-forest-50/80 px-6 py-14 text-center text-forest-700">
            조건에 맞는 정복기가 없습니다. 검색어나 지역을 바꿔 보세요.
          </p>
        ) : viewMode === 'grid' ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <li key={m.id} className="min-h-0">
                <button
                  type="button"
                  onClick={() => setDetailMountain(m)}
                  className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-forest-200 bg-forest-50/80 text-left shadow-sm transition hover:border-forest-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
                >
                  <JournalCardContent m={m} variant="grid" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative max-w-3xl">
            <div
              className="absolute bottom-0 left-[15px] top-3 w-0.5 bg-gradient-to-b from-forest-400 via-forest-300 to-forest-200"
              aria-hidden
            />
            <ol className="relative m-0 list-none space-y-0 p-0">
              {timelineList.map((m, index) => {
                const isPending = m.status === 'pending'
                const isLast = index === timelineList.length - 1
                return (
                  <li
                    key={m.id}
                    className={`relative flex gap-4 pl-1 ${isLast ? 'pb-0' : 'pb-10 sm:pb-12'}`}
                  >
                    <div
                      className="relative z-[1] flex w-8 shrink-0 flex-col items-center pt-1"
                      aria-hidden
                    >
                      <span
                        className={`mt-4 size-3.5 shrink-0 rounded-full border-[3px] border-white shadow-md ${
                          isPending
                            ? 'bg-amber-400 ring-2 ring-amber-100'
                            : 'bg-forest-600 ring-2 ring-forest-100'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest-500">
                        {isPending ? (
                          <>예정 · 난이도 {m.difficulty}/5</>
                        ) : (
                          <time dateTime={m.date}>{formatDate(m.date)}</time>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setDetailMountain(m)}
                        className="group flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-forest-200 bg-white text-left shadow-sm transition hover:border-forest-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 sm:flex-row"
                      >
                        <JournalCardContent m={m} variant="timeline" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
