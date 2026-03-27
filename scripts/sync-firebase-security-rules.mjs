/**
 * src/firebase/authorizedUsers.json → firestore.rules, storage.rules 의 허용 이메일 목록 반영
 * 규칙 문구를 바꿀 때는 이 파일의 템플릿을 수정하세요.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const usersPath = join(root, 'src', 'firebase', 'authorizedUsers.json')

const raw = JSON.parse(readFileSync(usersPath, 'utf8'))
if (!Array.isArray(raw) || raw.length === 0) {
  throw new Error('authorizedUsers.json 은 비어 있지 않은 문자열 배열이어야 합니다.')
}

const emailsInClause =
  '[' +
  raw
    .map((e) => {
      const s = String(e).trim().toLowerCase()
      if (!s.includes('@')) throw new Error(`유효하지 않은 이메일: ${e}`)
      const escaped = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      return `'${escaped}'`
    })
    .join(', ') +
  ']'

const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 정복기: 읽기는 공개. 쓰기는 기본 차단(관리자 콘솔·시드 스크립트는 Admin SDK 사용 권장).
    // VITE_FIREBASE_SEED_IF_EMPTY 사용 시: 잠시 allow write: true 후 배포하고, 시드 후 다시 잠그세요.
    match /mountains/{mountainId} {
      allow read: if true;
      allow write: if false;
    }

    // 사용자 정복기 글: 허용 이메일만 생성 (목록은 authorizedUsers.json → npm run sync:firebase-rules)
    match /journal_posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause}
        && request.resource.data.keys().hasOnly(['title', 'content', 'date', 'userEmail', 'imageUrl'])
        && request.resource.data.title is string
        && request.resource.data.title.size() > 0
        && request.resource.data.title.size() <= 200
        && request.resource.data.content is string
        && request.resource.data.content.size() > 0
        && request.resource.data.content.size() <= 10000
        && request.resource.data.date is string
        && request.resource.data.userEmail is string
        && request.resource.data.userEmail.lower() == request.auth.token.email.lower()
        && request.resource.data.imageUrl is string
        && request.resource.data.imageUrl.size() > 0;
      allow update, delete: if false;
    }
  }
}
`

const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // journalPostsFirestore.js 경로: journal-images/{uid}/...
    match /journal-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause};
    }
  }
}
`

writeFileSync(join(root, 'firestore.rules'), firestoreRules, 'utf8')
writeFileSync(join(root, 'storage.rules'), storageRules, 'utf8')

console.log('firestore.rules, storage.rules 갱신 완료 (허용 이메일 %d명)', raw.length)
