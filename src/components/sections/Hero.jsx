import { Link } from 'react-router-dom'
import { CalendarRange, ChevronDown, Compass } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-forest-200 bg-gradient-to-br from-forest-50 via-forest-100/80 to-earth-100"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-forest-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-earth-300/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-24">
        <div className="flex-1 text-left">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/70 px-3 py-1 text-xs font-medium text-forest-700 shadow-sm">
            <Compass className="size-3.5" aria-hidden />
            Black Yak 명산 100과 함께하는 여정
          </p>
          <h1 className="text-balance font-bold tracking-tight text-forest-900 text-4xl sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            한국 명산 100,
            <br />
            <span className="text-forest-600">한 걸음씩 정복하는 기록</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest-800/90 sm:text-lg">
            능선 위 바람과 정상의 일출. 100개의 산이 들려주는 이야기를 모아,
            당신만의 등산 일지를 남겨보세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/journal"
              className="inline-flex items-center justify-center rounded-xl bg-forest-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-forest-700"
            >
              정복기 보러가기
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl border border-earth-600/40 bg-white/60 px-5 py-3 text-sm font-semibold text-earth-800 transition hover:bg-white"
            >
              명산 100 소개
            </Link>
            <Link
              to="/#faq-3year-plan"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest-600/35 bg-white/60 px-5 py-3 text-sm font-semibold text-forest-800 transition hover:bg-white"
            >
              <CalendarRange className="size-4 shrink-0 text-forest-600" aria-hidden />
              정복 3년 계획
            </Link>
          </div>
        </div>

        <div className="relative flex flex-1 justify-center lg:justify-end">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-forest-200/80 bg-[#f5f2eb] shadow-xl">
            <img
              src="/images/bac-ajae-club-hero.png"
              alt="BAC 아재산악회 로고"
              className="h-full w-full object-contain object-center"
              width={800}
              height={800}
              decoding="async"
            />
          </div>
        </div>
      </div>

      <Link
        to="/about"
        className="mx-auto mb-6 flex w-fit flex-col items-center gap-1 text-forest-600/80 no-underline transition hover:text-forest-800"
        aria-label="명산 100 소개 페이지로 이동"
      >
        <span className="text-xs font-medium">명산 100 소개</span>
        <ChevronDown className="size-5 animate-bounce" aria-hidden />
      </Link>
    </section>
  )
}
