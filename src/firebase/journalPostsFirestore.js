import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {
  getDb,
  getFirebaseAuth,
  getFirebaseStorage,
  isAuthorizedUserEmail,
} from './config'

const COLLECTION = 'journal_posts'

function normalizeDate(value) {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().slice(0, 10)
  }
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString().slice(0, 10)
  }
  if (typeof value?.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString().slice(0, 10)
  }
  return undefined
}

/**
 * journal_posts 문서 → 정복기 카드용 산 객체 형태
 * Firestore 필드: title, content, date, userEmail, imageUrl, dayGear, status(선택)
 */
function pickDayGear(data) {
  const v = data?.dayGear ?? data?.day_gear
  if (typeof v === 'string') return v
  if (v != null && typeof v !== 'object') return String(v)
  return ''
}

export function docJournalToMountain(docSnap) {
  const d = docSnap.data()
  if (!d || typeof d.title !== 'string') return null
  const status =
    d.status === 'pending' ? 'pending' : 'completed'
  return {
    id: docSnap.id,
    name: d.title,
    region: '기록',
    status,
    difficulty: 1,
    date: normalizeDate(d.date) ?? '',
    image: typeof d.imageUrl === 'string' ? d.imageUrl : '',
    reflection: typeof d.content === 'string' ? d.content : '',
    userEmail: typeof d.userEmail === 'string' ? d.userEmail : '',
    dayGear: pickDayGear(d),
    isJournalPost: true,
    weather: '',
    duration: '',
    gallery: [],
  }
}

/**
 * @param {(list: object[]) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void} unsubscribe
 */
export function subscribeJournalPosts(onData, onError) {
  const db = getDb()
  if (!db) {
    onData([])
    return () => {}
  }
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => docJournalToMountain(d)).filter(Boolean)
      onData(list)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

/**
 * 이미지 업로드 후 Firestore에 정복기 문서 추가.
 * userEmail은 현재 로그인 사용자 이메일로만 설정됩니다.
 * @param {{ title: string, content: string, date: string, dayGear?: string, imageFile: File }} payload
 */
export async function createJournalPost({
  title,
  content,
  date,
  dayGear = '',
  imageFile,
}) {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user?.email) throw new Error('로그인이 필요합니다.')
  if (!isAuthorizedUserEmail(user.email)) {
    throw new Error('글쓰기 권한이 없습니다.')
  }

  const t = String(title ?? '').trim()
  const c = String(content ?? '').trim()
  const d = String(date ?? '').trim()
  const g = String(dayGear ?? '').trim()
  if (!t || !c || !d) {
    throw new Error('산 이름, 소감, 등산 날짜를 모두 입력해 주세요.')
  }
  if (g.length > 3000) {
    throw new Error('당일 장비는 3,000자 이내로 입력해 주세요.')
  }
  if (!imageFile || !(imageFile instanceof Blob)) {
    throw new Error('사진을 선택해 주세요.')
  }

  const db = getDb()
  const storage = getFirebaseStorage()
  if (!db || !storage) throw new Error('Firebase가 설정되지 않았습니다.')

  const safeName = imageFile.name.replace(/[^\w.-]/g, '_') || 'photo'
  const path = `journal-images/${user.uid}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, imageFile, {
    contentType: imageFile.type || 'image/jpeg',
  })
  const imageUrl = await getDownloadURL(storageRef)

  const userEmail = user.email

  await addDoc(collection(db, COLLECTION), {
    title: t,
    content: c,
    date: d,
    userEmail,
    imageUrl,
    dayGear: g,
  })
}

/**
 * 정복기 수정 — 로그인 사용자가 문서의 userEmail과 일치할 때만 규칙상 허용.
 * @param {string} postId
 * @param {{ title: string, content: string, date: string, dayGear?: string, imageFile?: File | null }} payload
 */
export async function updateJournalPost(postId, { title, content, date, dayGear = '', imageFile }) {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user?.email) throw new Error('로그인이 필요합니다.')
  if (!isAuthorizedUserEmail(user.email)) {
    throw new Error('글쓰기 권한이 없습니다.')
  }

  const id = String(postId ?? '').trim()
  if (!id) throw new Error('잘못된 글입니다.')

  const t = String(title ?? '').trim()
  const c = String(content ?? '').trim()
  const d = String(date ?? '').trim()
  const g = String(dayGear ?? '').trim()
  if (!t || !c || !d) {
    throw new Error('산 이름, 소감, 등산 날짜를 모두 입력해 주세요.')
  }
  if (g.length > 3000) {
    throw new Error('당일 장비는 3,000자 이내로 입력해 주세요.')
  }

  const db = getDb()
  const storage = getFirebaseStorage()
  if (!db || !storage) throw new Error('Firebase가 설정되지 않았습니다.')

  const docRef = doc(db, COLLECTION, id)
  const updates = {
    title: t,
    content: c,
    date: d,
    dayGear: g,
  }

  if (imageFile && imageFile instanceof Blob) {
    const safeName = imageFile.name.replace(/[^\w.-]/g, '_') || 'photo'
    const path = `journal-images/${user.uid}/${Date.now()}_${safeName}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, imageFile, {
      contentType: imageFile.type || 'image/jpeg',
    })
    updates.imageUrl = await getDownloadURL(storageRef)
  }

  await updateDoc(docRef, updates)
}
