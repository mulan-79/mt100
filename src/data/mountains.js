/**
 * 정복기 카드용 명산 데이터
 * planned: true 이면 날짜·소감 대신 «등산예정»만 표시
 */
export const mountains = [
  {
    id: 'hallasan',
    name: '한라산',
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
    planned: true,
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  },
  {
    id: 'jirisan',
    name: '지리산',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  },
  {
    id: 'songnisan',
    name: '속리산',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1511497584787-3d1b2c5c0e0e?w=800&q=80',
  },
  {
    id: 'deogyusan',
    name: '덕유산',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  },
  {
    id: 'gyeongju',
    name: '토함산',
    planned: true,
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
]
