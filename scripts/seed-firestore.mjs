/**
 * .env.local의 VITE_FIREBASE_* 로 Firestore `mountains` 컬렉션에 시드 업로드
 * Firestore 규칙에서 mountains 쓰기가 허용되어 있어야 합니다.
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  writeBatch,
} from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env.local') })
dotenv.config({ path: resolve(__dirname, '../.env') })

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    '오류: .env.local에 VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID가 필요합니다.',
  )
  process.exit(1)
}

const { MOUNTAIN_SEED_DATA } = await import('../src/data/mountainsSeed.js')

function mountainToFirestorePayload(mountain) {
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const col = collection(db, 'mountains')
const existing = await getDocs(col)

if (!existing.empty) {
  console.log(
    `이미 mountains 문서가 ${existing.size}개 있습니다. 시드를 건너뜁니다.`,
  )
  process.exit(0)
}

const batch = writeBatch(db)
for (const m of MOUNTAIN_SEED_DATA) {
  const ref = doc(db, 'mountains', m.id)
  const { id: _omit, ...rest } = m
  batch.set(ref, mountainToFirestorePayload(rest))
}
await batch.commit()
console.log(`완료: mountains 문서 ${MOUNTAIN_SEED_DATA.length}개 업로드`)
