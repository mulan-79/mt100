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
  throw new Error('authorizedUsers.json 은 비어 있지 않은 배열이어야 합니다.')
}

const emails = raw.map((e) => {
  if (typeof e === 'string') return String(e).trim().toLowerCase()
  if (e && typeof e.email === 'string') return String(e.email).trim().toLowerCase()
  throw new Error(`authorizedUsers.json 항목 형식 오류: ${JSON.stringify(e)}`)
})

const emailsInClause =
  '[' +
  emails
    .map((s) => {
      if (!s.includes('@')) throw new Error(`유효하지 않은 이메일: ${s}`)
      const escaped = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      return `'${escaped}'`
    })
    .join(', ') +
  ']'

/** journal_posts / mountains / gears 공통 댓글 서브컬렉션 */
const commentsSubcollectionRules = `
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.token.email != null
        && request.resource.data.keys().hasOnly(['text', 'authorName', 'authorEmail', 'createdAt'])
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 2000
        && request.resource.data.authorName is string
        && request.resource.data.authorName.size() > 0
        && request.resource.data.authorName.size() <= 100
        && request.resource.data.authorEmail is string
        && request.resource.data.authorEmail.lower() == request.auth.token.email.lower()
        && request.resource.data.createdAt is timestamp;
      allow update: if false;
      allow delete: if request.auth != null
        && request.auth.token.email != null
        && resource.data.authorEmail.lower() == request.auth.token.email.lower();
    }`

const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 정복기: 읽기는 공개. 쓰기는 기본 차단(관리자 콘솔·시드 스크립트는 Admin SDK 사용 권장).
    // VITE_FIREBASE_SEED_IF_EMPTY 사용 시: 잠시 allow write: true 후 배포하고, 시드 후 다시 잠그세요.
    match /mountains/{mountainId} {
      allow read: if true;
      allow write: if false;
${commentsSubcollectionRules}
    }

    // 사용자 정복기 글: 허용 이메일만 생성 (목록은 authorizedUsers.json → npm run sync:firebase-rules)
    match /journal_posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause}
        && request.resource.data.keys().hasOnly(['title', 'content', 'date', 'userEmail', 'imageUrl', 'dayGear'])
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
        && request.resource.data.imageUrl.size() > 0
        && request.resource.data.dayGear is string
        && request.resource.data.dayGear.size() <= 3000;
      allow update: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause}
        && request.auth.token.email.lower() == resource.data.userEmail.lower()
        && request.resource.data.userEmail == resource.data.userEmail
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['title', 'content', 'date', 'dayGear', 'imageUrl'])
        && request.resource.data.title is string
        && request.resource.data.title.size() > 0
        && request.resource.data.title.size() <= 200
        && request.resource.data.content is string
        && request.resource.data.content.size() > 0
        && request.resource.data.content.size() <= 10000
        && request.resource.data.date is string
        && request.resource.data.imageUrl is string
        && request.resource.data.imageUrl.size() > 0
        && request.resource.data.dayGear is string
        && request.resource.data.dayGear.size() <= 3000;
      allow delete: if false;
${commentsSubcollectionRules}
    }

    // 장비 소개 CMS: gears (authorizedUsers.json 동기화)
    match /gears/{gearId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause}
        && request.resource.data.keys().hasOnly(['name', 'category', 'description', 'imageUrl', 'author', 'createdAt'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 200
        && request.resource.data.category is string
        && request.resource.data.category in ['등산화', '배낭', '의류', '기타']
        && request.resource.data.description is string
        && request.resource.data.description.size() > 0
        && request.resource.data.description.size() <= 20000
        && request.resource.data.imageUrl is string
        && request.resource.data.imageUrl.size() > 0
        && request.resource.data.author is string
        && request.resource.data.author.lower() == request.auth.token.email.lower()
        && request.resource.data.createdAt is timestamp;
      allow update: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause}
        && request.resource.data.keys().hasOnly(['name', 'category', 'description', 'imageUrl', 'author', 'createdAt'])
        && request.resource.data.author == resource.data.author
        && request.resource.data.createdAt == resource.data.createdAt
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 200
        && request.resource.data.category is string
        && request.resource.data.category in ['등산화', '배낭', '의류', '기타']
        && request.resource.data.description is string
        && request.resource.data.description.size() > 0
        && request.resource.data.description.size() <= 20000
        && request.resource.data.imageUrl is string
        && request.resource.data.imageUrl.size() > 0;
      allow delete: if request.auth != null
        && request.auth.token.email != null
        && request.auth.token.email.lower() in ${emailsInClause};
${commentsSubcollectionRules}
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

    match /gear-images/{userId}/{allPaths=**} {
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
