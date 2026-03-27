import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { GEAR_FIRESTORE_CATEGORIES } from '../data/gear'
import {
  getDb,
  getFirebaseAuth,
  getFirebaseStorage,
  isAuthorizedUserEmail,
} from './config'

const COLLECTION = 'gears'

function assertCategory(value) {
  if (!GEAR_FIRESTORE_CATEGORIES.includes(value)) {
    throw new Error('카테고리가 올바르지 않습니다.')
  }
}

export function docToGear(docSnap) {
  const d = docSnap.data()
  if (!d || typeof d.name !== 'string') return null
  return {
    id: docSnap.id,
    name: d.name,
    category: d.category,
    description: typeof d.description === 'string' ? d.description : '',
    imageUrl: typeof d.imageUrl === 'string' ? d.imageUrl : '',
    author: typeof d.author === 'string' ? d.author : '',
    createdAt: d.createdAt,
  }
}

/**
 * @param {(list: object[]) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void}
 */
export function subscribeGears(onData, onError) {
  const db = getDb()
  if (!db) {
    onData([])
    return () => {}
  }
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => docToGear(d)).filter(Boolean)
      onData(list)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

async function uploadGearImage(user, imageFile) {
  const storage = getFirebaseStorage()
  if (!storage) throw new Error('Firebase Storage가 설정되지 않았습니다.')
  const safeName = imageFile.name.replace(/[^\w.-]/g, '_') || 'photo'
  const path = `gear-images/${user.uid}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, imageFile, {
    contentType: imageFile.type || 'image/jpeg',
  })
  return getDownloadURL(storageRef)
}

/**
 * @param {{ name: string, category: string, description: string, imageFile: File }} payload
 */
export async function createGear({ name, category, description, imageFile }) {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user?.email) throw new Error('로그인이 필요합니다.')
  if (!isAuthorizedUserEmail(user.email)) {
    throw new Error('장비를 등록할 권한이 없습니다.')
  }

  const n = String(name ?? '').trim()
  const c = String(category ?? '').trim()
  const desc = String(description ?? '').trim()
  assertCategory(c)
  if (!n) throw new Error('장비명을 입력해 주세요.')
  if (!desc) throw new Error('설명을 입력해 주세요.')
  if (!imageFile || !(imageFile instanceof Blob)) {
    throw new Error('사진을 선택해 주세요.')
  }

  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')

  const imageUrl = await uploadGearImage(user, imageFile)
  const author = user.email.trim().toLowerCase()

  await addDoc(collection(db, COLLECTION), {
    name: n,
    category: c,
    description: desc,
    imageUrl,
    author,
    createdAt: serverTimestamp(),
  })
}

/**
 * @param {string} gearId
 * @param {{ name: string, category: string, description: string, imageFile?: File | null, existingImageUrl: string }} payload
 */
export async function updateGear(
  gearId,
  { name, category, description, imageFile, existingImageUrl },
) {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user?.email) throw new Error('로그인이 필요합니다.')
  if (!isAuthorizedUserEmail(user.email)) {
    throw new Error('장비를 수정할 권한이 없습니다.')
  }
  if (!gearId) throw new Error('장비 ID가 없습니다.')

  const n = String(name ?? '').trim()
  const c = String(category ?? '').trim()
  const desc = String(description ?? '').trim()
  assertCategory(c)
  if (!n) throw new Error('장비명을 입력해 주세요.')
  if (!desc) throw new Error('설명을 입력해 주세요.')

  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')

  let imageUrl = existingImageUrl
  if (imageFile && imageFile instanceof Blob) {
    imageUrl = await uploadGearImage(user, imageFile)
  }
  if (!imageUrl) throw new Error('이미지가 필요합니다.')

  const refDoc = doc(db, COLLECTION, gearId)
  await updateDoc(refDoc, {
    name: n,
    category: c,
    description: desc,
    imageUrl,
  })
}

export async function deleteGear(gearId) {
  const auth = getFirebaseAuth()
  const user = auth?.currentUser
  if (!user?.email) throw new Error('로그인이 필요합니다.')
  if (!isAuthorizedUserEmail(user.email)) {
    throw new Error('장비를 삭제할 권한이 없습니다.')
  }
  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')
  await deleteDoc(doc(db, COLLECTION, gearId))
}
