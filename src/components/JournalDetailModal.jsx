import { useEffect, useId, useRef } from 'react'
import {
  Calendar,
  Clock,
  CloudSun,
  Images,
  MapPin,
  X,
} from 'lucide-react'

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * @param {{ mountain: object | null, onClose: () => void }} props
 */
export function JournalDetailModal({ mountain, onClose }) {
  const titleId = useId()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!mountain) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [mountain])

  useEffect(() => {
    if (!mountain) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mountain, onClose])

  if (!mountain) return null

  const gallery = mountain.gallery ?? [{ src: mountain.image, alt: mountain.imageAlt ?? mountain.name }]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm transition"
        aria-label="상세 닫기"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-forest-200 bg-forest-50 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-forest-200 bg-white/90 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-forest-600">{mountain.region}</p>
            <h2
              id={titleId}
              className="mt-0.5 flex items-center gap-2 text-xl font-bold tracking-tight text-forest-900 sm:text-2xl"
            >
              <MapPin className="size-6 shrink-0 text-forest-500" aria-hidden />
              <span className="truncate">{mountain.name}</span>
            </h2>
            {mountain.status === 'pending' ? (
              <p className="mt-1 text-sm font-medium text-amber-700">등산예정</p>
            ) : (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-700">
                <Calendar className="size-4 shrink-0 text-forest-500" aria-hidden />
                <time dateTime={mountain.date}>{formatDate(mountain.date)}</time>
              </p>
            )}
            {mountain.userEmail ? (
              <p className="mt-1 text-xs text-forest-500">작성: {mountain.userEmail}</p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-forest-700 transition hover:bg-forest-100"
            aria-label="닫기"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-forest-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-forest-600">
                <CloudSun className="size-5 shrink-0" aria-hidden />
                <span className="text-sm font-semibold">날씨·현장 메모</span>
              </div>
              <p className="text-sm leading-relaxed text-forest-800/95">
                {mountain.weather}
              </p>
            </div>
            <div className="rounded-xl border border-forest-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-forest-600">
                <Clock className="size-5 shrink-0" aria-hidden />
                <span className="text-sm font-semibold">소요 시간</span>
              </div>
              <p className="text-sm leading-relaxed text-forest-800/95">
                {mountain.duration}
              </p>
            </div>
          </div>

          {mountain.status === 'completed' && mountain.reflection ? (
            <div className="mt-5 rounded-xl border border-forest-200 bg-white/80 p-4">
              <p className="text-sm font-semibold text-forest-800">소감</p>
              <p className="mt-2 text-sm leading-relaxed text-forest-800/95">
                {mountain.reflection}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-forest-800">
              <Images className="size-5 text-forest-600" aria-hidden />
              <span className="text-sm font-semibold">사진 갤러리</span>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {gallery.map((item, i) => (
                <li
                  key={`${item.src}-${i}`}
                  className="overflow-hidden rounded-xl border border-forest-200 bg-forest-100 shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full bg-forest-200">
                    <img
                      src={item.src}
                      alt={item.alt ?? `${mountain.name} 사진 ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
