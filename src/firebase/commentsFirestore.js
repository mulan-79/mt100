import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { getDb, getFirebaseAuth } from './config'

/**
 * @param {import('firebase/firestore').DocumentData} d
 * @param {string} commentDocId
 */
export function docToComment(d, commentDocId) {
  if (!d || typeof d.text !== 'string') return null
  return {
    id: commentDocId,
    text: d.text,
    authorName: typeof d.authorName === 'string' ? d.authorName : '',
    authorEmail: typeof d.authorEmail === 'string' ? d.authorEmail : '',
    createdAt: d.createdAt,
  }
}

/**
 * @param {'journal_posts' | 'gears' | 'mountains'} parentCollection
 * @param {string} parentId
 * @param {(list: object[]) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void}
 */
export function subscribeComments(parentCollection, parentId, onData, onError) {
  const db = getDb()
  if (!db || !parentId) {
    onData([])
    return () => {}
  }
  const colRef = collection(db, parentCollection, parentId, 'comments')
  const q = query(colRef, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => docToComment(d.data(), d.id))
        .filter(Boolean)
      onData(list)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

/**
 * @param {'journal_posts' | 'gears' | 'mountains'} parentCollection
 * @param {string} parentId
 * @param {{ text: string, authorName: string, authorEmail: string }} payload
 */
export async function addComment(parentCollection, parentId, { text, authorName, authorEmail }) {
  const auth = getFirebaseAuth()
  if (!auth?.currentUser?.email) throw new Error('로그인이 필요합니다.')

  const t = String(text ?? '').trim()
  const name = String(authorName ?? '').trim()
  const email = String(authorEmail ?? '').trim().toLowerCase()
  if (!t) throw new Error('댓글 내용을 입력해 주세요.')
  if (!name) throw new Error('이름을 확인할 수 없습니다.')
  if (email !== auth.currentUser.email.trim().toLowerCase()) {
    throw new Error('작성자 이메일이 로그인 정보와 일치하지 않습니다.')
  }

  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')

  await addDoc(collection(db, parentCollection, parentId, 'comments'), {
    text: t.slice(0, 2000),
    authorName: name.slice(0, 100),
    authorEmail: email,
    createdAt: serverTimestamp(),
  })
}

/**
 * @param {'journal_posts' | 'gears' | 'mountains'} parentCollection
 * @param {string} parentId
 * @param {string} commentId
 */
export async function deleteComment(parentCollection, parentId, commentId) {
  const auth = getFirebaseAuth()
  if (!auth?.currentUser?.email) throw new Error('로그인이 필요합니다.')

  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')

  await deleteDoc(doc(db, parentCollection, parentId, 'comments', commentId))
}
