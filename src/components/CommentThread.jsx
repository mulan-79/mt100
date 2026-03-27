import { useEffect, useMemo, useState } from 'react'
import { Loader2, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured } from '../firebase/config'
import {
  addComment,
  deleteComment,
  subscribeComments,
} from '../firebase/commentsFirestore'

function formatCommentTime(ts) {
  if (!ts) return ''
  try {
    const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return ''
  }
}

/**
 * @param {{
 *   parentCollection: 'journal_posts' | 'gears' | 'mountains',
 *   parentId: string,
 *   disabledHint?: string | null,
 * }} props
 */
export function CommentThread({ parentCollection, parentId, disabledHint }) {
  const { user, isEnabled } = useAuth()
  const [remoteComments, setRemoteComments] = useState([])
  const [listReady, setListReady] = useState(false)
  const [error, setError] = useState(null)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const firebaseOn = isFirebaseConfigured()
  const canUseRemote = Boolean(
    firebaseOn && parentId && !disabledHint,
  )

  useEffect(() => {
    if (!canUseRemote) return undefined

    let cancelled = false
    const unsub = subscribeComments(
      parentCollection,
      parentId,
      (list) => {
        if (cancelled) return
        setError(null)
        setRemoteComments(list)
        setListReady(true)
      },
      (err) => {
        if (cancelled) return
        console.error('[comments]', err)
        setError(err?.message ?? String(err))
        setRemoteComments([])
        setListReady(true)
      },
    )
    return () => {
      cancelled = true
      unsub()
    }
  }, [parentCollection, parentId, canUseRemote])

  const comments = useMemo(
    () => (canUseRemote ? remoteComments : []),
    [canUseRemote, remoteComments],
  )
  const loading = canUseRemote && !listReady

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !canUseRemote) return
    const trimmed = text.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      const authorName =
        user.displayName?.trim() ||
        user.email?.split('@')[0] ||
        '사용자'
      await addComment(parentCollection, parentId, {
        text: trimmed,
        authorName,
        authorEmail: user.email ?? '',
      })
      setText('')
    } catch (err) {
      window.alert(err?.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId, authorEmail) => {
    if (!user) return
    if (user.email?.toLowerCase() !== authorEmail?.toLowerCase()) return
    if (!window.confirm('이 댓글을 삭제할까요?')) return
    try {
      await deleteComment(parentCollection, parentId, commentId)
    } catch (err) {
      window.alert(err?.message ?? String(err))
    }
  }

  return (
    <div className="mt-8 border-t border-forest-200 pt-6">
      <div className="mb-4 flex items-center gap-2 text-forest-800">
        <MessageCircle className="size-5 text-forest-600" aria-hidden />
        <h3 className="text-sm font-semibold">댓글</h3>
      </div>

      {disabledHint ? (
        <p className="rounded-lg border border-forest-200 bg-forest-50/80 px-3 py-2 text-sm text-forest-600">
          {disabledHint}
        </p>
      ) : null}

      {!disabledHint && !firebaseOn ? (
        <p className="text-sm text-forest-500">
          Firebase에 연결되면 댓글을 사용할 수 있습니다.
        </p>
      ) : null}

      {canUseRemote && isEnabled && user ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <label htmlFor={`comment-${parentCollection}-${parentId}`} className="sr-only">
            댓글 입력
          </label>
          <textarea
            id={`comment-${parentCollection}-${parentId}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="댓글을 입력하세요."
            disabled={submitting}
            className="w-full resize-y rounded-xl border border-forest-200 bg-white px-3 py-2.5 text-sm text-forest-900 outline-none ring-forest-500/30 focus:border-forest-400 focus:ring-2 disabled:bg-forest-50"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  등록 중…
                </>
              ) : (
                '등록'
              )}
            </button>
          </div>
        </form>
      ) : null}

      {canUseRemote && isEnabled && !user ? (
        <p className="mb-6 rounded-lg border border-forest-200 bg-white/80 px-3 py-2 text-sm text-forest-600">
          댓글을 작성하려면 상단에서 로그인해 주세요.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          댓글을 불러오지 못했습니다. ({error})
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-forest-600">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          불러오는 중…
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const isOwn =
              user?.email &&
              c.authorEmail?.toLowerCase() === user.email.toLowerCase()
            return (
              <li
                key={c.id}
                className="rounded-xl border border-forest-200 bg-white/90 px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-forest-600">
                      <span className="text-forest-800">{c.authorName}</span>
                      {c.authorEmail ? (
                        <span className="ml-1.5 text-forest-400">
                          ({c.authorEmail})
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-forest-800/95">
                      {c.text}
                    </p>
                    <p className="mt-2 text-xs text-forest-400">
                      {formatCommentTime(c.createdAt)}
                    </p>
                  </div>
                  {isOwn ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.authorEmail)}
                      className="shrink-0 rounded-lg p-2 text-forest-500 transition hover:bg-red-50 hover:text-red-700"
                      aria-label="댓글 삭제"
                      title="삭제"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {!loading && canUseRemote && comments.length === 0 ? (
        <p className="py-2 text-sm text-forest-500">아직 댓글이 없습니다.</p>
      ) : null}
    </div>
  )
}
