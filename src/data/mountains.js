/**
 * 정복기 도우미 (Firestore에서 받은 배열을 사용)
 * status: 'completed' | 'pending'
 * difficulty: 1(쉬움) ~ 5(어려움)
 */
export const MOUNTAIN_CHALLENGE_TOTAL = 100

/** 메인 화면 정복 진행률 — 이 이메일의 정복기(journal_posts)만 집계 */
export const HOME_PROGRESS_JOURNAL_EMAIL = 'rainym002@gmail.com'

/**
 * @param {Array} mountainsList
 * @param {string} authorEmail — 소문자 정규화된 이메일
 * @returns {Array} 해당 작성자의 정복기만
 */
export function filterJournalMountainsByEmail(mountainsList, authorEmail) {
  const email = String(authorEmail ?? '').trim().toLowerCase()
  if (!email) return []
  return (mountainsList ?? []).filter(
    (m) =>
      m.isJournalPost === true &&
      typeof m.userEmail === 'string' &&
      m.userEmail.trim().toLowerCase() === email,
  )
}

/** 정복기 제목 ↔ 명단 산 이름 비교용 */
export function normalizeMountainLabel(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * @param {Array} mountainsList — 병합 배열 (정복기 + 명단)
 * @param {Array} officialPeaksList — 집계 대상 명단 (id, name)
 * @param {string} authorEmail
 * @param {number | null} totalDenominator — 고정 분모(명산100=100). null이면 명단 고유 id 개수
 */
function computeChallengeProgressForOfficialList(
  mountainsList,
  officialPeaksList,
  authorEmail,
  totalDenominator,
) {
  const official = officialPeaksList ?? []
  const validIds = new Set()
  for (const m of official) {
    if (m?.id != null && m.id !== '') validIds.add(String(m.id))
  }

  const nameKeyToId = new Map()
  for (const m of official) {
    if (m?.id == null || m.id === '' || typeof m.name !== 'string') continue
    const key = normalizeMountainLabel(m.name)
    if (!key || nameKeyToId.has(key)) continue
    nameKeyToId.set(key, String(m.id))
  }

  const journals = filterJournalMountainsByEmail(mountainsList, authorEmail)
  const conqueredIds = new Set()
  for (const j of journals) {
    if (typeof j.name !== 'string') continue
    const id = nameKeyToId.get(normalizeMountainLabel(j.name))
    if (id && validIds.has(id)) conqueredIds.add(id)
  }

  const completed = conqueredIds.size
  const total =
    typeof totalDenominator === 'number' && totalDenominator > 0
      ? totalDenominator
      : validIds.size
  const percent =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0
  return { completed, total, percent }
}

/**
 * 명산 100 달성도: `mountains` 명단과 이름 일치 + 산(id)당 1회. 분모 100 고정.
 * @param {Array} mountainsList — MountainsContext `mountains`
 * @param {string} authorEmail
 */
export function getMountainChallengeProgressForEmail(mountainsList, authorEmail) {
  const list = mountainsList ?? []
  const official = list.filter((m) => !m.isJournalPost)
  return computeChallengeProgressForOfficialList(
    list,
    official,
    authorEmail,
    MOUNTAIN_CHALLENGE_TOTAL,
  )
}

/**
 * 명산 100+ 달성도: `mountains_100_plus` 명단과 동일 로직. 분모 = 명단 산 개수(고유 id).
 * @param {Array} mountainsList — MountainsContext `mountains`
 * @param {Array} officialPlusList — `mountains100Plus`
 * @param {string} authorEmail
 */
export function getMountainChallengePlusProgressForEmail(
  mountainsList,
  officialPlusList,
  authorEmail,
) {
  return computeChallengeProgressForOfficialList(
    mountainsList,
    officialPlusList ?? [],
    authorEmail,
    null,
  )
}

/**
 * 메인 화면 명산 100 정복률
 * @param {Array} mountainsList
 */
export function getHomeMountainChallengeProgress(mountainsList) {
  return getMountainChallengeProgressForEmail(
    mountainsList,
    HOME_PROGRESS_JOURNAL_EMAIL,
  )
}

/**
 * 메인 화면 명산 100+ 정복률
 * @param {Array} mountainsList
 * @param {Array} officialPlusList
 */
export function getHomeMountainChallengePlusProgress(
  mountainsList,
  officialPlusList,
) {
  return getMountainChallengePlusProgressForEmail(
    mountainsList,
    officialPlusList,
    HOME_PROGRESS_JOURNAL_EMAIL,
  )
}

export const MOUNTAIN_FILTER_REGIONS = [
  { id: 'all', label: '전체' },
  { id: '기록', label: '직접 기록' },
  { id: '강원', label: '강원' },
  { id: '경기', label: '경기' },
  { id: '충청', label: '충청' },
  { id: '전라', label: '전라' },
  { id: '경상', label: '경상' },
  { id: '제주', label: '제주' },
]
