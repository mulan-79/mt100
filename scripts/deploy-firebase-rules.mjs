/**
 * 규칙 동기화 후 Firebase 배포.
 * - 대화형 로그인: 한 번 `npx firebase-tools login` 후 같은 터미널에서 실행
 * - 비대화형: .env.firebase 에 FIREBASE_TOKEN (login:ci 로 발급)
 */
import { execSync } from 'node:child_process'
import { config } from 'dotenv'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

config({ path: resolve(root, '.env.firebase') })
config({ path: resolve(root, '.env.local') })
config({ path: resolve(root, '.env') })

execSync('node scripts/sync-firebase-security-rules.mjs', {
  cwd: root,
  stdio: 'inherit',
})

execSync(
  'npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage --non-interactive',
  {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  },
)

// 서비스 계정 경로가 있으면 mountains_100_plus 비어 있을 때만 시드
try {
  execSync('node scripts/seed-mountains-100-plus-admin.mjs', {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
} catch {
  console.warn(
    '[deploy] seed-mountains-100-plus-admin.mjs 실패(무시 가능). 서비스 계정·네트워크를 확인하세요.',
  )
}
