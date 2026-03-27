/**
 * 정복기 카드용 명산 데이터
 * planned: true 이면 날짜·소감 대신 «등산예정»만 표시
 * weather, duration, gallery: 상세 모달용 (gallery: { src, alt }[])
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
    weather:
      '정상 부근 안개·영하권, 돌풍이 강했습니다. 방풍 재킷·장갑· 핫팩이 있으면 체감이 한결 나아져요.',
    duration: '왕복 약 8시간 30분 (휴식·사진 포함, 겨울 코스 기준)',
    gallery: [
      {
        src: '/images/hallasan.png',
        alt: '백록담 비석 앞 인증 사진',
      },
      {
        src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
        alt: '눈 덮인 산 능선 풍경',
      },
      {
        src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
        alt: '고산 안개 속 산 풍경',
      },
    ],
  },
  {
    id: 'seoraksan',
    name: '설악산',
    region: '강원',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    weather:
      '등산 예정 — 봄·가을은 대체로 쾌청, 여름엔 소나기·안개 가능성이 큽니다. 당일 기상을 꼭 확인하세요.',
    duration: '코스에 따라 상이함. 대략 당일 왕복 6~10시간 범위를 참고하세요.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
        alt: '설악산 능선 풍경',
      },
    ],
  },
  {
    id: 'jirisan',
    name: '지리산',
    region: '전라',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    weather:
      '등산 예정 — 고지대는 일교차가 크고 안개가 잦습니다. 우천 시 능선 미끄럼에 주의하세요.',
    duration: '구간별 편차가 큼. 천왕봉 일출 코스는 전날 출발 등 장시간 동선이 많습니다.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
        alt: '지리산 숲과 산 풍경',
      },
      {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
        alt: '산악 전경',
      },
    ],
  },
  {
    id: 'songnisan',
    name: '속리산',
    region: '충청',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1511497584787-3d1b2c5c0e0e?w=800&q=80',
    weather:
      '등산 예정 — 계곡·숲 구간은 습도가 높을 수 있어 여름 장마철 우산·방수 준비를 권장합니다.',
    duration: '당일 왕복 위주로 4~7시간 전후가 많습니다(코스별 상이).',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1511497584787-3d1b2c5c0e0e?w=1200&q=80',
        alt: '속리산 숲길',
      },
    ],
  },
  {
    id: 'deogyusan',
    name: '덕유산',
    region: '전라',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    weather:
      '등산 예정 — 단풍·설악 시즌에는 기온 변화가 크고 정상 부근은 바람이 셉니다.',
    duration: '케이블카·코스 조합에 따라 3~8시간까지 다양합니다.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
        alt: '덕유산 단풍 시즌 풍경',
      },
      {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
        alt: '숲이 우거진 산길',
      },
    ],
  },
  {
    id: 'gyeongju',
    name: '토함산',
    region: '경상',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    weather:
      '등산 예정 — 비교적 난이도가 낮지만 여름철에는 더위·소나기를 대비하세요.',
    duration: '왕복 2~4시간 내외인 코스가 많습니다.',
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
        alt: '토함산 일대 숲',
      },
    ],
  },
]
