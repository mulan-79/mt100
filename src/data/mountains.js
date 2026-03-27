/**
 * 정복기 도우미 (Firestore에서 받은 배열을 인자로 사용)
 * status: 'completed' | 'pending'
 * difficulty: 1(쉬움) ~ 5(어려움)
 */
export const MOUNTAIN_CHALLENGE_TOTAL = 100

/** @param {Array} mountainsList */
export function getMountainChallengeProgress(mountainsList) {
  const list = mountainsList ?? []
  const completed = list.filter((m) => m.status === 'completed').length
  const total = MOUNTAIN_CHALLENGE_TOTAL
  const percent = Math.min(100, Math.round((completed / total) * 100))
  return { completed, total, percent }
}

/** @param {Array} mountainsList */
export function getRecommendedPendingPeaks(mountainsList, limit = 3) {
  const list = mountainsList ?? []
  return [...list]
    .filter((m) => m.status === 'pending')
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, limit)
}

export function getDifficultyLabel(level) {
  const map = {
    1: '입문',
    2: '쉬움',
    3: '보통',
    4: '어려움',
    5: '상급',
  }
  return map[level] ?? '보통'
}

export const MOUNTAIN_FILTER_REGIONS = [
  { id: 'all', label: '전체' },
  { id: '강원', label: '강원' },
  { id: '경기', label: '경기' },
  { id: '충청', label: '충청' },
  { id: '전라', label: '전라' },
  { id: '경상', label: '경상' },
  { id: '제주', label: '제주' },
]
