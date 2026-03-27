import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import authorizedUsersRaw from './authorizedUsers.json'

/** @typedef {{ email: string, label: string }} AuthorizedUserEntry */
const authorizedEntries = authorizedUsersRaw.map((entry) =>
  typeof entry === 'string'
    ? { email: entry.trim(), label: entry.split('@')[0] }
    : {
        email: String(entry.email).trim(),
        label: String(entry.label ?? entry.email.split('@')[0]).trim(),
      },
)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const AUTHORIZED_USERS = authorizedEntries.map((e) => e.email)

/** 글쓰기 권한자 전용: 직접 기록(isJournalPost) 작성자 필터 옵션 */
export const JOURNAL_AUTHOR_FILTER_OPTIONS = [
  { id: 'all', label: '직접 기록 전체' },
  ...authorizedEntries.map((e) => ({
    id: e.email.toLowerCase(),
    label: e.label,
  })),
]

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

export function isAuthorizedUserEmail(email) {
  const normalized = String(email ?? '').trim().toLowerCase()
  return AUTHORIZED_USERS.some((allowed) => allowed.toLowerCase() === normalized)
}

/** 직접 기록 카드 배지 등에 사용 */
export function journalAuthorLabelForEmail(email) {
  const n = String(email ?? '').trim().toLowerCase()
  const found = authorizedEntries.find((e) => e.email.toLowerCase() === n)
  return found?.label ?? null
}

let appInstance = null
let dbInstance = null
let storageInstance = null
let authInstance = null
let googleProviderInstance = null

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null
  if (!appInstance) {
    appInstance = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  }
  return appInstance
}

export function getDb() {
  if (!isFirebaseConfigured()) return null
  if (!dbInstance) {
    const app = getFirebaseApp()
    if (!app) return null
    dbInstance = getFirestore(app)
  }
  return dbInstance
}

export function getFirebaseStorage() {
  if (!isFirebaseConfigured()) return null
  if (!storageInstance) {
    const app = getFirebaseApp()
    if (!app) return null
    storageInstance = getStorage(app)
  }
  return storageInstance
}

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) return null
  if (!authInstance) {
    const app = getFirebaseApp()
    if (!app) return null
    authInstance = getAuth(app)
  }
  return authInstance
}

export function getGoogleAuthProvider() {
  if (!isFirebaseConfigured()) return null
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider()
    googleProviderInstance.setCustomParameters({
      prompt: 'select_account',
    })
  }
  return googleProviderInstance
}
