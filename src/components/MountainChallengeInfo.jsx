import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ClipboardList,
  Mountain,
} from 'lucide-react'

const bgImage =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80'

const steps = [
  {
    id: 1,
    title: '도전 신청',
    description: '공식 채널에서 참가를 신청해요.',
    Icon: ClipboardList,
  },
  {
    id: 2,
    title: '정상 등반',
    description: '목표 봉우리를 직접 밟아 올라가요.',
    Icon: Mountain,
  },
  {
    id: 3,
    title: '인증샷 촬영',
    description: '정상에서 인증 사진을 남겨요.',
    Icon: Camera,
  },
  {
    id: 4,
    title: '앱·웹 인증',
    description: '앱 또는 웹으로 기록을 제출해요.',
    Icon: BadgeCheck,
  },
]

export function MountainChallengeInfo() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden"
      aria-labelledby="mountain-challenge-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
        role="presentation"
      />
      <div
        className="absolute inset-0 bg-black/60"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-black/20 to-black/50" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-14 xl:gap-16">
          <div className="flex flex-1 flex-col justify-center text-center lg:max-w-xl lg:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400/95">
              Black Yak Mountain 100
            </p>
            <h2
              id="mountain-challenge-heading"
              className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-tight"
            >
              블랙야크 명산 100이란?
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
              한반도 곳곳의 명산 100곳을 발로 직접 이어 가며, 숨 막히는 능선과
              정상의 바람 속에서 자연이 주는 고요와 생명력을 온몸으로 느끼는
              여정입니다. 산을 오르는 시간마다 우리가 지키고 싶은 가치를
              조금씩 더 선명하게 깨닫게 되는 프로그램이에요.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                to="/journal"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                도전하기
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-emerald-300/90 lg:text-left">
              도전 과정
            </p>
            <ol className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-nowrap lg:gap-2 xl:gap-3">
              {steps.map((step, index) => {
                const Icon = step.Icon
                const isLast = index === steps.length - 1
                return (
                  <li
                    key={step.id}
                    className="flex flex-1 flex-col lg:min-w-0 lg:flex-row lg:items-stretch"
                  >
                    <div className="flex flex-1 gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5 lg:flex-col lg:items-center lg:text-center">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-400/40 lg:mx-auto">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1 text-left lg:text-center">
                        <p className="text-xs font-medium text-emerald-200/90">
                          Step {step.id}
                        </p>
                        <p className="mt-0.5 font-semibold text-white">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm leading-snug text-white/75">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {!isLast ? (
                      <div
                        className="hidden items-center justify-center px-1 text-emerald-400/70 lg:flex lg:px-2"
                        aria-hidden
                      >
                        <ArrowRight className="size-5 shrink-0" />
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
