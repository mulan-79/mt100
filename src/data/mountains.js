/**
 * 정복기 도우미 (Firestore에서 받은 배열을 인자로 사용)
 * status: 'completed' | 'pending'
 * difficulty: 1(쉬움) ~ 5(어려움)
 */
export const MOUNTAIN_CHALLENGE_TOTAL = 100

/** 메인 화면 정복 진행률 — 이 이메일의 정복기(journal_posts)만 집계 */
export const HOME_PROGRESS_JOURNAL_EMAIL = 'rainym002@gmail.com'

/**
 * @param {Array} mountainsList — MountainsContext의 mountains (정복기 + 명단 병합)
 * @returns {Array} 해당 작성자의 정복기 항목만 (진행률 계산용)
 */
export function filterMountainsForHomeProgress(mountainsList) {
  const email = HOME_PROGRESS_JOURNAL_EMAIL.trim().toLowerCase()
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
 * 메인 화면 정복률: Firestore `mountains` 명단(블랙야크 명산 100)에 오른 산만,
 * 지정 이메일 정복기 제목과 이름이 일치할 때만 인정하고, 같은 산은 id 기준 1번만 집계.
 * @param {Array} mountainsList — MountainsContext 병합 배열
 */
export function getHomeMountainChallengeProgress(mountainsList) {
  const list = mountainsList ?? []
  const official = list.filter((m) => !m.isJournalPost)
  /** @type {Map<string, string>} 정규화 이름 → 공식 산 id (동일 이름이 여러 id면 첫 id만 사용) */
  const nameKeyToId = new Map()
  for (const m of official) {
    if (m?.id == null || m.id === '' || typeof m.name !== 'string') continue
    const key = normalizeMountainLabel(m.name)
    if (!key || nameKeyToId.has(key)) continue
    nameKeyToId.set(key, String(m.id))
  }

  const journals = filterMountainsForHomeProgress(list)
  const conqueredIds = new Set()
  for (const j of journals) {
    if (typeof j.name !== 'string') continue
    const id = nameKeyToId.get(normalizeMountainLabel(j.name))
    if (id) conqueredIds.add(id)
  }

  const completed = conqueredIds.size
  const total = MOUNTAIN_CHALLENGE_TOTAL
  const percent = Math.min(100, Math.round((completed / total) * 100))
  return { completed, total, percent }
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
