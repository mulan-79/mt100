import { useEffect, useId, useRef, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { GEAR_FIRESTORE_CATEGORIES } from '../data/gear'
import { createGear, updateGear } from '../firebase/gearsFirestore'

/**
 * @param {{ open: boolean, onClose: () => void, editingGear: object | null }} props
 */
export function GearFormModal({ open, onClose, editingGear }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const isEdit = Boolean(editingGear?.id)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(GEAR_FIRESTORE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

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
      setName('')
      setCategory(GEAR_FIRESTORE_CATEGORIES[0])
      setDescription('')
      setImageFile(null)
      setFormError(null)
      setSubmitting(false)
      return
    }
    if (editingGear) {
      setName(editingGear.name ?? '')
      setCategory(
        GEAR_FIRESTORE_CATEGORIES.includes(editingGear.category)
          ? editingGear.category
          : GEAR_FIRESTORE_CATEGORIES[0],
      )
      setDescription(editingGear.description ?? '')
      setImageFile(null)
    } else {
      setName('')
      setCategory(GEAR_FIRESTORE_CATEGORIES[0])
      setDescription('')
      setImageFile(null)
    }
  }, [open, editingGear])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateGear(editingGear.id, {
          name,
          category,
          description,
          imageFile,
          existingImageUrl: editingGear.imageUrl ?? '',
        })
      } else {
        await createGear({ name, category, description, imageFile })
      }
      onClose()
    } catch (err) {
      setFormError(err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-4"
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
        className="relative flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-forest-200 bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-forest-200 px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="text-lg font-bold tracking-tight text-forest-900"
          >
            {isEdit ? '장비 수정' : '장비 추가'}
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
              htmlFor="gear-name"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              장비명
            </label>
            <input
              id="gear-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
              disabled={submitting}
              className="w-full rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
          </div>

          <div>
            <label
              htmlFor="gear-category"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              카테고리
            </label>
            <select
              id="gear-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={submitting}
              className="w-full rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            >
              {GEAR_FIRESTORE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="gear-desc"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              설명
            </label>
            <textarea
              id="gear-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              maxLength={20000}
              disabled={submitting}
              className="w-full resize-y rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
            />
          </div>

          <div>
            <label
              htmlFor="gear-image"
              className="mb-1.5 block text-sm font-medium text-forest-800"
            >
              사진 {isEdit ? '(바꾸지 않으려면 비워 두세요)' : ''}
            </label>
            <input
              id="gear-image"
              type="file"
              accept="image/*"
              required={!isEdit}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-700 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  저장 중…
                </>
              ) : (
                '저장'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
