/** Firestore `category` 값과 탭 id (한글) */
export const GEAR_FIRESTORE_CATEGORIES = ['등산화', '배낭', '의류', '기타']

export const gearCategories = GEAR_FIRESTORE_CATEGORIES.map((id) => ({
  id,
  label: id,
}))

const legacyToKo = {
  footwear: '등산화',
  backpack: '배낭',
  clothing: '의류',
  other: '기타',
}

/** Firebase 미설정 시 샘플 카드 (기존 시드) */
const legacyGearItems = [
  {
    id: 'g-boot-1',
    category: 'footwear',
    name: '미드컷 고어텍스 등산화',
    summary:
      '방수·투습 멤브레인과 비브람 솔로 젖은 바위에서도 미끄럼을 줄입니다.',
  },
  {
    id: 'g-boot-2',
    category: 'footwear',
    name: '경량 트레일 러닝 슈즈',
    summary: '장거리 능선 코스에 맞춘 쿠셔닝과 통기성 메시 갑피.',
  },
  {
    id: 'g-boot-3',
    category: 'footwear',
    name: '알파인 부츠',
    summary: '눈·빙판 대비 전용 아웃솔과 하드 셸 갑피로 보호력을 높였습니다.',
  },
  {
    id: 'g-cloth-1',
    category: 'clothing',
    name: '소프트쉘 재킷',
    summary:
      '바람을 막고 활동량에 맞춰 신축되는 레이어로 봄·가을에 적합합니다.',
  },
  {
    id: 'g-cloth-2',
    category: 'clothing',
    name: '경량 다운 패딩',
    summary: '정지 휴식 시 체온 유지용으로 배낭에 넣기 좋은 압축 부피.',
  },
  {
    id: 'g-cloth-3',
    category: 'clothing',
    name: '흡습 속건 베이스레이어',
    summary: '땀을 빠르게 밖으로 보내 차가운 땀 냄새와 체온 저하를 완화합니다.',
  },
  {
    id: 'g-bag-1',
    category: 'backpack',
    name: '30L 데이팩',
    summary: '당일 코스에 맞는 수납과 등판 통풍 채널, 허리벨트 부하 분산.',
  },
  {
    id: 'g-bag-2',
    category: 'backpack',
    name: '45L 멀티데이 팩',
    summary: '1박 2일 캠핑형 산행용 본체·상단·힙벨트 포켓 구성.',
  },
  {
    id: 'g-bag-3',
    category: 'backpack',
    name: '경량 접이식 배낭',
    summary: '하산 후 도심 이동 시 접어 보관할 수 있는 서브 가방.',
  },
  {
    id: 'g-other-1',
    category: 'other',
    name: '카본 트레킹 폴',
    summary:
      '내리막 무릎 부담을 줄이고, 길이 조절로 지형에 맞춰 사용할 수 있습니다.',
  },
  {
    id: 'g-other-2',
    category: 'other',
    name: '충전식 LED 헤드램프',
    summary: '일출 전·일몰 후 암벽 구간을 위해 손을 비우고 주변을 비춥니다.',
  },
  {
    id: 'g-other-3',
    category: 'other',
    name: '보온 스테인리스 보틀',
    summary:
      '겨울 산행 시 뜨거운 음료를 오래 유지하고, 뚜껑 잠금으로 흘림을 방지합니다.',
  },
]

/**
 * @returns {Array<{ id: string, name: string, category: string, description: string, imageUrl: string, author: string, createdAt: null, isSample: true }>}
 */
export function getStaticGearFallback() {
  return legacyGearItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: legacyToKo[item.category],
    description: item.summary,
    imageUrl: '',
    author: '',
    createdAt: null,
    isSample: true,
  }))
}

export function isValidGearCategory(value) {
  return GEAR_FIRESTORE_CATEGORIES.includes(value)
}
