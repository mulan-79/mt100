/**
 * 정복기 카드용 명산 데이터
 * planned: true 이면 날짜·소감 대신 «등산예정»만 표시
 */
export const MOUNTAIN_CHALLENGE_TOTAL = 100

/** 완료: planned 가 아닌 항목 수 / 명산 100 목표 */
export function getMountainChallengeProgress() {
  const completed = mountains.filter((m) => !m.planned).length
  const total = MOUNTAIN_CHALLENGE_TOTAL
  const percent = Math.min(100, Math.round((completed / total) * 100))
  return { completed, total, percent }
}

/** 정복기 필터용 지역 (전체 + 권역) */
export const MOUNTAIN_FILTER_REGIONS = [
  { id: 'all', label: '전체' },
  { id: '강원', label: '강원' },
  { id: '경기', label: '경기' },
  { id: '충청', label: '충청' },
  { id: '전라', label: '전라' },
  { id: '경상', label: '경상' },
  { id: '제주', label: '제주' },
]

export const mountains = [
  {
    id: 'hallasan',
    name: '한라산',
    region: '제주',
    planned: false,
    date: '2025-12-29',
    image: '/images/hallasan.png',
    imageAlt:
      '한라산 백록담 정상 비석 앞에서 찍은 겨울 인증 사진',
    reflection:
      '백록담 비석 앞에서 찍은 인증샷. 겨울 안개 속 정상이 더 기억에 남았어요.',
  },
  {
    id: 'seoraksan',
    name: '설악산',
    region: '강원',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
  {
    id: 'jirisan',
    name: '지리산',
    region: '전라',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  },
  {
    id: 'songnisan',
    name: '속리산',
    region: '충청',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1511497584787-3d1b2c5c0e0e?w=800&q=80',
  },
  {
    id: 'deogyusan',
    name: '덕유산',
    region: '전라',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  },
  {
    id: 'gyeongju',
    name: '토함산',
    region: '경상',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
]
