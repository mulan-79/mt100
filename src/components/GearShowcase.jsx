import { useMemo, useState } from 'react'
import { Backpack, Footprints, Package, Shirt } from 'lucide-react'
import { gearCategories, gearItems } from '../data/gear'

const categoryIcon = {
  footwear: Footprints,
  clothing: Shirt,
  backpack: Backpack,
  other: Package,
}

export function GearShowcase() {
  const [active, setActive] = useState(gearCategories[0].id)

  const filtered = useMemo(
    () => gearItems.filter((item) => item.category === active),
    [active],
  )

  const tabId = (catId) => `gear-tab-${catId}`
  const panelId = 'gear-panel'

  return (
    <section
      id="gear"
      className="scroll-mt-20 border-b border-forest-200 bg-gradient-to-b from-forest-50 to-earth-100/40 py-16 sm:py-20"
      aria-labelledby="gear-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-forest-600">
            Gear
          </p>
          <h2
            id="gear-heading"
            className="text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl"
          >
            장비 소개
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest-800/85">
            코스와 계절에 맞춰 고른 추천 장비입니다. 탭을 바꿔 카테고리별로
            살펴보세요.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="장비 카테고리"
          className="mb-8 flex flex-wrap gap-2"
        >
          {gearCategories.map((cat) => {
            const selected = active === cat.id
            const Icon = categoryIcon[cat.id]
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                id={tabId(cat.id)}
                aria-selected={selected}
                aria-controls={panelId}
                onClick={() => setActive(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                  selected
                    ? 'border-forest-600 bg-forest-600 text-white shadow-md'
                    : 'border-forest-200 bg-white/80 text-forest-800 hover:border-forest-400 hover:bg-forest-50'
                }`}
              >
                {Icon ? (
                  <Icon className="size-4 shrink-0" aria-hidden />
                ) : null}
                {cat.label}
              </button>
            )
          })}
        </div>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
        >
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-forest-300 bg-white/60 px-6 py-12 text-center text-forest-700">
              이 카테고리에 등록된 장비가 없습니다.
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <li key={item.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-forest-200 bg-white/85 p-5 shadow-sm transition hover:border-earth-300/80 hover:shadow-md">
                    <h3 className="text-lg font-semibold tracking-tight text-forest-900">
                      {item.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-forest-800/90">
                      {item.summary}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
