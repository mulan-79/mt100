import { Calendar, MapPin } from 'lucide-react'
import { mountains } from '../data/mountains'

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function ReviewList() {
  return (
    <section
      id="journal"
      className="scroll-mt-20 border-b border-forest-200 bg-white/60 py-16 sm:py-20"
      aria-labelledby="journal-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
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
            오른 산의 풍경과 그날의 기분을 짧게 남긴 기록입니다.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mountains.map((m) => (
            <li key={m.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest-200 bg-forest-50/80 shadow-sm transition hover:border-forest-300 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-200">
                  <img
                    src={m.image}
                    alt={`${m.name} 풍경 사진`}
                    className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 font-semibold text-white drop-shadow-sm">
                      <MapPin className="size-4 shrink-0 opacity-90" aria-hidden />
                      {m.name}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <p className="flex items-center gap-2 text-sm text-forest-700/90">
                    <Calendar className="size-4 shrink-0 text-forest-500" aria-hidden />
                    <time dateTime={m.date}>{formatDate(m.date)}</time>
                  </p>
                  <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-forest-800/95">
                    {m.reflection}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
