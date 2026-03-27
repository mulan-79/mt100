import { useEffect, useId, useRef } from 'react'
import { Package, X } from 'lucide-react'
import { CommentThread } from './CommentThread'
import { isFirebaseConfigured, journalAuthorLabelForEmail } from '../firebase/config'

function authorCaption(email) {
  if (!email) return null
  const label = journalAuthorLabelForEmail(email)
  return label ? `${label} · ${email}` : email
}

/**
 * @param {{ gear: object | null, onClose: () => void }} props
 */
export function GearDetailModal({ gear, onClose }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const firebaseOn = isFirebaseConfigured()

  useEffect(() => {
    if (!gear) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [gear])

  useEffect(() => {
    if (!gear) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gear, onClose])

  if (!gear) return null

  const commentsActive = !gear.isSample && firebaseOn
  const commentDisabled = commentsActive
    ? null
    : 'Firestore에 등록된 장비에서만 댓글을 달 수 있습니다.'

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
            <p className="text-xs font-medium text-forest-600">{gear.category}</p>
            <h2
              id={titleId}
              className="mt-0.5 flex items-center gap-2 text-xl font-bold tracking-tight text-forest-900 sm:text-2xl"
            >
              <Package className="size-6 shrink-0 text-forest-500" aria-hidden />
              <span className="truncate">{gear.name}</span>
            </h2>
            {gear.author ? (
              <p className="mt-1 text-xs text-forest-500">
                추천: {authorCaption(gear.author)}
              </p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-forest-700 transition hover:bg-forest-100"
            aria-label="닫기"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          {gear.imageUrl ? (
            <div className="overflow-hidden rounded-xl border border-forest-200 bg-forest-100 shadow-sm">
              <img
                src={gear.imageUrl}
                alt=""
                className="max-h-80 w-full object-cover object-center sm:max-h-96"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-forest-200 bg-white/80 p-4">
            <p className="text-sm font-semibold text-forest-800">설명</p>
            <p className="mt-2 text-sm leading-relaxed text-forest-800/95">
              {gear.description}
            </p>
          </div>

          <CommentThread
            key={`gears-${gear.id}`}
            parentCollection="gears"
            parentId={commentsActive ? gear.id : ''}
            disabledHint={commentDisabled}
          />
        </div>
      </div>
    </div>
  )
}
