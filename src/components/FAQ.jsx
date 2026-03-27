import { useId, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

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
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
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
                      <p className="pl-8 text-sm leading-relaxed text-forest-800/95 sm:pl-9">
                        {item.answer}
                      </p>
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
