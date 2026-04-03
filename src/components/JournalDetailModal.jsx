import { useEffect, useId, useRef } from 'react'
import {
  Backpack,
  Calendar,
  Clock,
  CloudSun,
  Images,
  MapPin,
  PencilLine,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CommentThread } from './CommentThread'

function normalizeEmail(str) {
  return String(str ?? '').trim().toLowerCase()
}

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
 * @param {{ mountain: object | null, onClose: () => void, onEditRequest?: (m: object) => void }} props
 */
export function JournalDetailModal({ mountain, onClose, onEditRequest }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const { user } = useAuth()

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

  const commentCollection = mountain.isJournalPost ? 'journal_posts' : 'mountains'
  const commentParentId = mountain.id != null && mountain.id !== '' ? String(mountain.id) : ''

  /** journal_posts는 Firestore에서 gallery: [] 로 오므로, 비어 있으면 imageUrl(→ image)로 폴백 */
  const gallery = (() => {
    const fromDoc = Array.isArray(mountain.gallery) ? mountain.gallery : []
    if (fromDoc.length > 0) return fromDoc
    const src = mountain.image
    if (typeof src === 'string' && src.trim()) {
      return [{ src: src.trim(), alt: mountain.imageAlt ?? mountain.name }]
    }
    return []
  })()

  const canEditJournal =
    mountain.isJournalPost &&
    onEditRequest &&
    user?.email &&
    normalizeEmail(user.email) === normalizeEmail(mountain.userEmail)

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
          <div className="flex shrink-0 items-center gap-1">
            {canEditJournal ? (
              <button
                type="button"
                onClick={() => {
                  onEditRequest(mountain)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <PencilLine className="size-4" aria-hidden />
                수정
              </button>
            ) : null}
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-10 sm:px-6">
          {gallery[0]?.src ? (
            <div className="mb-5 overflow-hidden rounded-2xl border border-forest-200 bg-forest-100 shadow-sm">
              <div className="relative aspect-[16/10] w-full max-h-[min(52vh,420px)] bg-forest-200 sm:aspect-[2/1]">
                <img
                  src={gallery[0].src}
                  alt={
                    gallery[0].alt ?? `${mountain.name} 대표 사진`
                  }
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          ) : null}

          {mountain.isJournalPost ? (
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 shadow-sm ring-1 ring-emerald-100/80">
              <div className="mb-2 flex items-center gap-2 text-emerald-900">
                <Backpack className="size-5 shrink-0 text-emerald-700" aria-hidden />
                <span className="text-sm font-semibold">당일 장비</span>
              </div>
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  mountain.dayGear?.trim()
                    ? 'text-forest-800/95'
                    : 'text-forest-500 italic'
                }`}
              >
                {mountain.dayGear?.trim()
                  ? mountain.dayGear
                  : '기록된 당일 장비가 없습니다.'}
              </p>
            </div>
          ) : null}

          <div
            className={`grid gap-4 sm:grid-cols-2 ${
              mountain.isJournalPost ? 'mt-4' : ''
            }`}
          >
            <div className="rounded-xl border border-forest-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-forest-600">
                <CloudSun className="size-5 shrink-0" aria-hidden />
                <span className="text-sm font-semibold">날씨·현장 메모</span>
              </div>
              <p className="text-sm leading-relaxed text-forest-800/95">
                {mountain.weather || (
                  <span className="text-forest-400">—</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-forest-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-forest-600">
                <Clock className="size-5 shrink-0" aria-hidden />
                <span className="text-sm font-semibold">소요 시간</span>
              </div>
              <p className="text-sm leading-relaxed text-forest-800/95">
                {mountain.duration || (
                  <span className="text-forest-400">—</span>
                )}
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

          <CommentThread
            key={`${commentCollection}-${mountain.id}`}
            parentCollection={commentCollection}
            parentId={commentParentId}
          />

          {gallery.length > 1 ? (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 text-forest-800">
                <Images className="size-5 text-forest-600" aria-hidden />
                <span className="text-sm font-semibold">추가 사진</span>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {gallery.slice(1).map((item, i) => (
                  <li
                    key={`${item.src}-${i}`}
                    className="overflow-hidden rounded-xl border border-forest-200 bg-forest-100 shadow-sm"
                  >
                    <div className="relative aspect-[4/3] w-full bg-forest-200">
                      <img
                        src={item.src}
                        alt={item.alt ?? `${mountain.name} 사진 ${i + 2}`}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : gallery.length === 0 ? (
            <div className="mt-6">
              <p className="rounded-xl border border-dashed border-forest-300 bg-white/60 px-4 py-8 text-center text-sm text-forest-500">
                등록된 사진이 없습니다.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
