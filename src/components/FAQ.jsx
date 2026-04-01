import { useId, useState } from 'react'
import {
  Calendar,
  Car,
  ChevronDown,
  HelpCircle,
  MapPin,
  Mountain,
  Target,
} from 'lucide-react'

function CheckList({ items }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((line, i) => (
        <li key={`${i}-${line}`} className="flex gap-2.5 text-forest-800/95">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500"
            aria-hidden
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }) {
  return (
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest-800/95 marker:text-forest-600">
      {items.map((line) => (
        <li key={line} className="pl-1">
          {line}
        </li>
      ))}
    </ol>
  )
}

function SeasonBlock({ title, peaks }) {
  return (
    <div className="rounded-xl border border-forest-200/90 bg-white/60 p-3 sm:p-4">
      <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-forest-900">
        <span className="flex size-6 items-center justify-center rounded-lg bg-forest-100 text-xs text-forest-700">
          ◆
        </span>
        {title}
      </h5>
      <ul className="flex flex-wrap gap-1.5">
        {peaks.map((p, i) => (
          <li
            key={`${title}-${i}-${p}`}
            className="rounded-lg bg-forest-50/90 px-2.5 py-1 text-xs font-medium text-forest-800 ring-1 ring-forest-200/70"
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GoalCallout({ children }) {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-forest-50/50 px-4 py-3 sm:px-5">
      <p className="flex items-start gap-2 text-sm font-semibold text-forest-900">
        <Target
          className="mt-0.5 size-4 shrink-0 text-emerald-600"
          aria-hidden
        />
        <span>{children}</span>
      </p>
    </div>
  )
}

function YearPlanCard({ yearLabel, subtitle, count, seasons, goal }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-forest-200 bg-gradient-to-b from-white to-forest-50/40 shadow-sm ring-1 ring-forest-100/80">
      <div className="border-b border-forest-200/80 bg-forest-600/5 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-baseline gap-2">
          <Mountain className="size-5 text-forest-600" aria-hidden />
          <h4 className="text-base font-bold text-forest-900 sm:text-lg">
            {yearLabel}
          </h4>
          <span className="rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-semibold text-forest-800">
            {count}
          </span>
        </div>
        {subtitle ? (
          <p className="mt-1.5 text-xs text-forest-700 sm:text-sm">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-5">
        {seasons.map((s) => (
          <SeasonBlock key={s.title} title={s.title} peaks={s.peaks} />
        ))}
      </div>
      <div className="border-t border-forest-200/80 px-3 pb-4 pt-3 sm:px-5 sm:pb-5">
        <GoalCallout>{goal}</GoalCallout>
      </div>
    </article>
  )
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-forest-200 bg-white/70">
      <table className="w-full min-w-[280px] text-left text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-forest-200 bg-forest-600/8">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 font-semibold text-forest-900 sm:px-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-100 text-forest-800/95">
          {rows.map((cells, ri) => (
            <tr key={ri} className="hover:bg-forest-50/50">
              {cells.map((c, ci) => (
                <td key={ci} className="px-3 py-2.5 sm:px-4">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ThreeYearPlanContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-forest-200 bg-white/80 p-4 shadow-sm sm:p-6">
        <h4 className="flex items-center gap-2 text-base font-bold text-forest-900">
          <MapPin className="size-5 text-forest-600" aria-hidden />
          기본 전략 (서울 기준)
        </h4>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
              전제 조건
            </p>
            <CheckList
              items={[
                '출발지: 서울',
                '이동: 자차 또는 대중교통',
                '평일 산행 없음',
                '연 2회 정도 1박2일 허용 (제주·남부권용)',
                '월 평균 2~3개',
              ]}
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
              운영 원칙
            </p>
            <NumberedList
              items={[
                '1년차 = 수도권·강원 남부 집중',
                '2년차 = 영남·호남 묶음 원정',
                '3년차 = 고난도·원거리 정리',
                '같은 지역은 1박2일로 2~3개 묶기',
              ]}
            />
          </div>
        </div>
      </section>

      <YearPlanCard
        yearLabel="1년차 (서울·경기·강원·충청 중심)"
        count="32개"
        subtitle="이동 부담 적은 산 위주 / 당일치기 중심"
        seasons={[
          {
            title: '봄 (3~5월)',
            peaks: [
              '북한산',
              '도봉산',
              '수락산',
              '관악산',
              '청계산',
              '소요산',
              '운악산',
              '유명산',
            ],
          },
          {
            title: '여름 (6~8월)',
            peaks: [
              '치악산',
              '오대산',
              '태백산',
              '월악산',
              '속리산',
              '계룡산',
              '덕유산',
            ],
          },
          {
            title: '가을 (9~11월)',
            peaks: [
              '설악산',
              '치악산 종주',
              '민주지산',
              '마이산',
              '내장산',
              '소백산',
            ],
          },
          {
            title: '겨울 (12~2월)',
            peaks: [
              '광교산',
              '축령산',
              '계방산',
              '함백산',
              '변산',
              '팔봉산',
            ],
          },
        ]}
        goal="1년차 목표 → 당일 15km 이상 산행 5회 이상"
      />

      <YearPlanCard
        yearLabel="2년차 (강원 북부 + 영남권 원정)"
        count="34개"
        subtitle="서울에서 3~4시간권 위주 + 연 2회 1박2일"
        seasons={[
          {
            title: '봄',
            peaks: [
              '가야산',
              '주왕산',
              '팔공산',
              '황매산',
              '금정산',
              '가지산',
            ],
          },
          {
            title: '여름',
            peaks: [
              '한라산 (1박2일)',
              '설악 공룡능선',
              '지리산 (당일)',
              '두타산',
              '방태산',
            ],
          },
          {
            title: '가을',
            peaks: [
              '지리산 종주 (1박2일)',
              '무등산',
              '월출산',
              '천관산',
              '조계산',
              '내연산',
            ],
          },
          {
            title: '겨울',
            peaks: [
              '태백산 설산',
              '신불산',
              '운문산',
              '계방산 재도전',
              '덕항산',
            ],
          },
        ]}
        goal="2년차 목표 → 1박2일 3회 · 1,500m 이상 10회 이상"
      />

      <YearPlanCard
        yearLabel="3년차 (원거리 정리 + 고난도 완성)"
        count="34개"
        subtitle="남은 전남·경남·경북·울릉도 정리"
        seasons={[
          {
            title: '봄',
            peaks: ['황석산', '백운산', '도락산', '희양산', '청량산'],
          },
          {
            title: '여름',
            peaks: [
              '울릉도 성인봉 (2박3일 추천)',
              '한라산 다른 코스',
              '오대산 종주',
              '설악 대청봉 종주',
            ],
          },
          {
            title: '가을',
            peaks: [
              '소백산 종주',
              '덕유산 종주',
              '지리산 성중종주',
              '금원산',
              '두위봉',
            ],
          },
          {
            title: '겨울',
            peaks: [
              '치악산 설경',
              '태백산 재도전',
              '명지산',
              '운문산 재도전',
            ],
          },
        ]}
        goal="3년차 목표 → 20km 이상 5회 · 고난도 암릉코스 3회"
      />

      <section className="rounded-2xl border border-forest-200 bg-white/80 p-4 sm:p-6">
        <h4 className="flex items-center gap-2 text-base font-bold text-forest-900">
          <Calendar className="size-5 text-forest-600" aria-hidden />
          주말 운영 방식
        </h4>
        <ul className="mt-3 space-y-2 text-sm text-forest-800/95">
          <li className="flex gap-2">
            <span className="font-semibold text-forest-700">토요일</span>
            <span>장거리·주산</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-forest-700">일요일</span>
            <span>근거리 회복산행 or 휴식</span>
          </li>
        </ul>
        <div className="mt-4 rounded-xl border border-dashed border-forest-300/80 bg-forest-50/50 px-4 py-3 text-sm text-forest-800/95">
          <p className="text-xs font-semibold text-forest-600">예시</p>
          <p className="mt-1">
            <span className="font-medium text-forest-900">토</span>: 치악산
          </p>
          <p>
            <span className="font-medium text-forest-900">일</span>: 원주 근교
            낮은 산 or 완전 휴식
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-forest-200 bg-white/80 p-4 sm:p-6">
        <h4 className="flex items-center gap-2 text-base font-bold text-forest-900">
          <Car className="size-5 text-forest-600" aria-hidden />
          지역 묶음 전략 (서울 기준)
        </h4>
        <div className="mt-4">
          <SimpleTable
            headers={['지역', '묶기 전략']}
            rows={[
              ['강원 영동', '설악 + 오대 1박'],
              ['지리산권', '지리 + 덕유 묶음'],
              ['전남권', '월출 + 무등 + 천관 (2박)'],
              ['제주', '한라 1박2일'],
              ['울릉도', '2박3일 전용'],
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-forest-200 bg-white/80 p-4 sm:p-6">
        <h4 className="text-base font-bold text-forest-900">체력 로드맵</h4>
        <div className="mt-4">
          <SimpleTable
            headers={['단계', '목표']}
            rows={[
              ['1년차', '10~15km 적응'],
              ['2년차', '20km 가능'],
              ['3년차', '종주·암릉 안정화'],
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 sm:p-6">
        <h4 className="text-base font-bold text-forest-900">
          성공 확률 높이는 팁
        </h4>
        <CheckList
          items={[
            '여름 고산 / 겨울 짧게',
            '설악·지리는 여러 번 나눠서',
            'SNS·블로그 기록 유지 (동기 유지용)',
            '등산 모임 1~2개 활용',
          ]}
        />
      </section>
    </div>
  )
}

const faqItems = [
  {
    id: 'faq-1',
    question: '명산 100은 어떤 프로그램인가요?',
    answer:
      '블랙야크가 제안하는 대표 봉우리 100곳을 정복하며 기록을 남기는 챌린지형 프로그램입니다. 공식 인증 절차는 시즌마다 안내되니 홈페이지 공지를 확인해 주세요.',
  },
  {
    id: 'faq-2',
    question: '등산 일정은 어떻게 짜는 것이 좋나요?',
    answer:
      '체력과 날씨를 기준으로 난이도를 섞어 배치하고, 비·눈 예보가 불안하면 일정을 미루는 편이 안전합니다. 처음에는 당일 코스부터 익숙해지는 것을 권장합니다.',
  },
  {
    id: 'faq-3',
    question: '장비는 최소 무엇을 챙겨야 하나요?',
    answer:
      '등산화·배낭·수분·간단한 보온·우천 대비 겉옷·헤드램프·지도(또는 내비)를 기본으로 준비하세요. 겨울에는 아이젠·핫팩 등 안전 장비를 추가합니다.',
  },
  {
    id: 'faq-4',
    question: '사진 인증은 어디에 올리면 되나요?',
    answer:
      '이 사이트의 정복기 섹션에 올리거나, 개인 블로그·SNS에 해시태그와 함께 남기는 방식 모두 가능합니다. 프로그램 공식 채널이 있다면 해당 가이드를 따르시면 됩니다.',
  },
  {
    id: 'faq-3year-plan',
    question: '명산100 정복 3년계획',
    answer: <ThreeYearPlanContent />,
  },
]

export function FAQ() {
  const baseId = useId()
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="qa"
      className="scroll-mt-20 border-b border-forest-200 bg-white/70 py-16 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:text-left">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-forest-600">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl"
          >
            자주 묻는 질문
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest-800/85">
            명산 100과 사이트 이용에 관해 자주 받는 질문을 모았습니다.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id
            const panelId = `${baseId}-${item.id}-panel`
            const buttonId = `${baseId}-${item.id}-button`
            const isStringAnswer = typeof item.answer === 'string'

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-forest-200 bg-forest-50/80 shadow-sm transition hover:border-forest-300"
              >
                <h3 className="text-base font-semibold leading-snug text-forest-900">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 sm:px-5 sm:py-4"
                  >
                    <HelpCircle
                      className="mt-0.5 size-5 shrink-0 text-forest-500"
                      aria-hidden
                    />
                    <span className="flex-1">{item.question}</span>
                    <ChevronDown
                      className={`mt-0.5 size-5 shrink-0 text-forest-600 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0">
                    <div className="border-t border-forest-200/80 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                      {isStringAnswer ? (
                        <p className="pl-8 text-sm leading-relaxed text-forest-800/95 sm:pl-9">
                          {item.answer}
                        </p>
                      ) : (
                        <div className="max-h-[min(85vh,56rem)] overflow-y-auto pl-2 pr-1 pt-2 sm:pl-3">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
