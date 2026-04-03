import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { MOUNTAIN_SEED_DATA } from '../data/mountainsSeed'
import { getDb } from './config'

const COLLECTION = 'mountains'
const COLLECTION_100_PLUS = 'mountains_100_plus'

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

/** Firestore 문서 → 앱에서 쓰는 산 객체 */
export function docToMountain(docSnap) {
  const d = docSnap.data()
  if (!d || !d.name) return null
  return {
    id: docSnap.id,
    name: d.name,
    region: d.region ?? '',
    status: d.status === 'completed' ? 'completed' : 'pending',
    difficulty: Number(d.difficulty) || 1,
    date: normalizeDate(d.date),
    image: d.image ?? '',
    imageAlt: d.imageAlt ?? undefined,
    reflection: d.reflection ?? undefined,
    weather: d.weather ?? '',
    duration: d.duration ?? '',
    gallery: Array.isArray(d.gallery) ? d.gallery : [],
  }
}

/** 저장용 페이로드 (undefined 제거) */
export function mountainToFirestorePayload(mountain) {
  const payload = {
    name: mountain.name,
    region: mountain.region,
    status: mountain.status === 'completed' ? 'completed' : 'pending',
    difficulty: Number(mountain.difficulty) || 1,
    image: mountain.image ?? '',
    weather: mountain.weather ?? '',
    duration: mountain.duration ?? '',
    gallery: Array.isArray(mountain.gallery) ? mountain.gallery : [],
  }
  if (mountain.date) payload.date = mountain.date
  if (mountain.imageAlt != null) payload.imageAlt = mountain.imageAlt
  if (mountain.reflection != null) payload.reflection = mountain.reflection
  return payload
}

/**
 * 실시간 구독. 문서는 `mountains` 컬렉션, 문서 ID는 고유 문자열(예: hallasan).
 * @param {(list: object[]) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void} unsubscribe
 */
function subscribeMountainCollection(collectionName, onData, onError) {
  const db = getDb()
  if (!db) {
    onData([])
    return () => {}
  }
  const q = query(collection(db, collectionName))
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => docToMountain(d))
        .filter(Boolean)
      onData(list)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

/**
 * 블랙야크 명산 100 명단 (`mountains`)
 */
export function subscribeMountains(onData, onError) {
  return subscribeMountainCollection(COLLECTION, onData, onError)
}

/**
 * 명산 100+ 확장 명단 (`mountains_100_plus`) — 문서 스키마는 `mountains`와 동일
 */
export function subscribeMountains100Plus(onData, onError) {
  return subscribeMountainCollection(COLLECTION_100_PLUS, onData, onError)
}

/** 컬렉션이 비어 있을 때 시드 데이터 일괄 쓰기 (개발·초기 세팅용) */
export async function seedMountainsFromDefaultsIfEmpty() {
  const db = getDb()
  if (!db) return
  const col = collection(db, COLLECTION)
  const snap = await getDocs(col)
  if (!snap.empty) return
  const batch = writeBatch(db)
  for (const m of MOUNTAIN_SEED_DATA) {
    const ref = doc(db, COLLECTION, m.id)
    const { id: _id, ...rest } = m
    batch.set(ref, mountainToFirestorePayload(rest))
  }
  await batch.commit()
}

/**
 * 단일 산 문서 저장(덮어쓰기). 관리·추후 폼에서 사용.
 * @param {object} mountain id 필수
 */
export async function saveMountainToFirestore(mountain) {
  const db = getDb()
  if (!db) throw new Error('Firebase가 설정되지 않았습니다.')
  const id = mountain.id
  if (!id) throw new Error('mountain.id가 필요합니다.')
  const ref = doc(db, COLLECTION, id)
  await setDoc(ref, mountainToFirestorePayload(mountain))
}
