import { useEffect, useId, useRef, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { updateJournalPost } from '../firebase/journalPostsFirestore'

function toDateInputValue(iso) {
  const s = String(iso ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

/**
 * @param {{ open: boolean, mountain: object | null, onClose: () => void }} props
 */
export function JournalEditModal({ open, mountain, onClose }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dayGear, setDayGear] = useState('')
  const [date, setDate] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [blobPreviewUrl, setBlobPreviewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if (!imageFile) {
      setBlobPreviewUrl(null)
      return
    }
    const u = URL.createObjectURL(imageFile)
    setBlobPreviewUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [imageFile])

  useEffect(() => {
    if (!open || !mountain) return
    setTitle(mountain.name ?? '')
    setContent(mountain.reflection ?? '')
    setDayGear(mountain.dayGear ?? '')
    setDate(toDateInputValue(mountain.date))
    setImageFile(null)
    setFormError(null)
  }, [open, mountain])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, submitting])

  useEffect(() => {
    if (!open) {
      setSubmitting(false)
    }
  }, [open])

  if (!open || !mountain?.id) return null

  const previewSrc = blobPreviewUrl || mountain.image || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await updateJournalPost(mountain.id, {
        title,
        content,
        date,
        dayGear,
        imageFile: imageFile ?? null,
      })
      onClose()
    } catch (err) {
      setFormError(err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[115] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm transition"
        aria-label="닫기"
        disabled={submitting}
        onClick={() => !submitting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-forest-200 bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-forest-200 px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="text-lg font-bold tracking-tight text-forest-900"
          >
            정복기 수정
          </h2>
          <button
            ref={closeRef}
            type="button"
            disabled={submitting}
            onClick={() => !submitting && onClose()}
            className="shrink-0 rounded-lg p-2 text-forest-700 transition hover:bg-forest-100 disabled:opacity-50"
            aria-label="닫기"
          >
            <X className="size-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5"
        >
          {formError ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
              role="alert"
            >
              {formError}
            </p>
          ) : null}

          <div>
            <label
              htmlFor="journal-edit-title"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              산 이름
            </label>
            <input
              id="journal-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              disabled={submitting}
              className="w-full rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
          </div>

          <div>
            <label
              htmlFor="journal-edit-date"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              등산 날짜
            </label>
            <input
              id="journal-edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={submitting}
              className="w-full rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
          </div>

          <div>
            <label
              htmlFor="journal-edit-content"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              소감
            </label>
            <textarea
              id="journal-edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              maxLength={8000}
              disabled={submitting}
              className="w-full resize-y rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
          </div>

          <div>
            <label
              htmlFor="journal-edit-day-gear"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              당일 장비
            </label>
            <textarea
              id="journal-edit-day-gear"
              value={dayGear}
              onChange={(e) => setDayGear(e.target.value)}
              rows={3}
              maxLength={3000}
              disabled={submitting}
              placeholder="예: 폴·접지스틱, 경량 패딩…"
              className="w-full resize-y rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
            <p className="mt-1 text-xs text-forest-500">
              비워 두어도 저장됩니다. ({dayGear.length}/3000)
            </p>
          </div>

          <div>
            <label
              htmlFor="journal-edit-image"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              사진 (바꾸려면 새 파일 선택)
            </label>
            {previewSrc ? (
              <div className="mb-2 overflow-hidden rounded-xl border border-forest-200 bg-forest-100">
                <img
                  src={previewSrc}
                  alt=""
                  className="max-h-40 w-full object-cover object-center"
                />
              </div>
            ) : null}
            <input
              id="journal-edit-image"
              type="file"
              accept="image/*"
              disabled={submitting}
              onChange={(e) => {
                const f = e.target.files?.[0]
                setImageFile(f ?? null)
              }}
              className="w-full text-sm text-forest-800 file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-forest-800"
            />
          </div>

          <div className="mt-auto flex flex-col-reverse gap-2 border-t border-forest-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={() => !submitting && onClose()}
              className="rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-800 transition hover:bg-forest-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  저장 중…
                </>
              ) : (
                '수정 저장'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
