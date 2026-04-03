/**
 * Admin SDK로 `mountains_100_plus` 시드 (규칙과 무관하게 쓰기 가능)
 *
 * 필요:
 *   - Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 JSON 저장
 *   - 아래 중 하나:
 *       FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/key.json  (.env.local 권장)
 *       GOOGLE_APPLICATION_CREDENTIALS=./path/to/key.json
 *
 * 비어 있을 때만 업로드합니다. 이미 문서가 있으면 건너뜁니다.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import admin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
dotenv.config({ path: resolve(root, '.env.local') })
dotenv.config({ path: resolve(root, '.env') })

const keyPathRaw =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!keyPathRaw || !String(keyPathRaw).trim()) {
  console.log(
    '[seed 100+] 건너뜀: FIREBASE_SERVICE_ACCOUNT_PATH 또는 GOOGLE_APPLICATION_CREDENTIALS 가 없습니다.',
  )
  console.log(
    '  → 콘솔: https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk',
  )
  console.log('  → 비공개 키 JSON 저장 후 .env.local 에 경로를 넣으면 배포 시 자동 시드됩니다.')
  process.exit(0)
}

const keyPath = resolve(root, keyPathRaw.trim())
if (!existsSync(keyPath)) {
  console.error(`[seed 100+] 서비스 계정 파일을 찾을 수 없습니다: ${keyPath}`)
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
const projectId =
  serviceAccount.project_id || process.env.VITE_FIREBASE_PROJECT_ID
if (!projectId) {
  console.error('[seed 100+] project_id 를 알 수 없습니다.')
  process.exit(1)
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  })
}

const db = admin.firestore()
const COLLECTION = 'mountains_100_plus'

const { MOUNTAIN_100_PLUS_SEED_DATA } = await import(
  '../src/data/mountains100PlusSeed.js'
)

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

const snap = await db.collection(COLLECTION).limit(1).get()
if (!snap.empty) {
  console.log(
    `[seed 100+] 이미 ${COLLECTION} 에 문서가 있어 시드를 건너뜁니다.`,
  )
  process.exit(0)
}

const batch = db.batch()
for (const m of MOUNTAIN_100_PLUS_SEED_DATA) {
  const ref = db.collection(COLLECTION).doc(m.id)
  const { id: _omit, ...rest } = m
  batch.set(ref, mountainToFirestorePayload(rest))
}
await batch.commit()
console.log(
  `[seed 100+] 완료: ${COLLECTION} 문서 ${MOUNTAIN_100_PLUS_SEED_DATA.length}개 업로드`,
)
process.exit(0)
