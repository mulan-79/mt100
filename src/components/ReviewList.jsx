import { useMemo, useState } from 'react'
import { Calendar, MapPin, Search } from 'lucide-react'
import { JournalDetailModal } from './JournalDetailModal'
import {
  MOUNTAIN_FILTER_REGIONS,
  mountains,
} from '../data/mountains'

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

export function ReviewList() {
  const [query, setQuery] = useState('')
  const [regionId, setRegionId] = useState('all')
  const [detailMountain, setDetailMountain] = useState(null)

  const filtered = useMemo(() => {
    const q = normalizeForSearch(query)
    return mountains.filter((m) => {
      const nameOk =
        q === '' || normalizeForSearch(m.name).includes(q)
      const regionOk =
        regionId === 'all' || m.region === regionId
      return nameOk && regionOk
    })
  }, [query, regionId])

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
            볼 수 있어요.
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

          <div>
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
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-forest-300 bg-forest-50/80 px-6 py-14 text-center text-forest-700">
            조건에 맞는 정복기가 없습니다. 검색어나 지역을 바꿔 보세요.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <li key={m.id} className="min-h-0">
                <button
                  type="button"
                  onClick={() => setDetailMountain(m)}
                  className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-forest-200 bg-forest-50/80 text-left shadow-sm transition hover:border-forest-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-forest-200">
                    <img
                      src={m.image}
                      alt={m.imageAlt ?? `${m.name} 풍경 사진`}
                      className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {m.region}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-semibold text-white drop-shadow-sm">
                        <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
                        {m.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
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
                        <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-forest-800/95">
                          {m.reflection}
                        </p>
                      </>
                    )}
                    <span className="text-xs font-medium text-forest-500">
                      탭하여 상세 보기
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
