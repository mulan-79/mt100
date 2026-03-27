import { useEffect, useMemo, useState } from 'react'
import {
  Backpack,
  Footprints,
  ImageOff,
  Package,
  PencilLine,
  Plus,
  Shirt,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { gearCategories, getStaticGearFallback } from '../data/gear'
import { isFirebaseConfigured, journalAuthorLabelForEmail } from '../firebase/config'
import { deleteGear, subscribeGears } from '../firebase/gearsFirestore'
import { GearFormModal } from './GearFormModal'

const categoryIcon = {
  등산화: Footprints,
  배낭: Backpack,
  의류: Shirt,
  기타: Package,
}

function authorCaption(email) {
  if (!email) return null
  const label = journalAuthorLabelForEmail(email)
  return label ? `${label} · ${email}` : email
}

export function GearShowcase() {
  const { user, isAuthorized, isEnabled } = useAuth()
  const [active, setActive] = useState(gearCategories[0].id)
  const [remoteGears, setRemoteGears] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingGear, setEditingGear] = useState(null)

  const firebaseOn = isFirebaseConfigured()
  const [gearsReady, setGearsReady] = useState(() => !firebaseOn)
  const loading = firebaseOn && !gearsReady

  useEffect(() => {
    if (!firebaseOn) return undefined

    let cancelled = false
    const unsub = subscribeGears(
      (list) => {
        if (cancelled) return
        setLoadError(null)
        setRemoteGears(list)
        setGearsReady(true)
      },
      (err) => {
        if (cancelled) return
        console.error('[gears]', err)
        setLoadError(err?.message ?? String(err))
        setRemoteGears([])
        setGearsReady(true)
      },
    )
    return () => {
      cancelled = true
      unsub()
    }
  }, [firebaseOn])

  const gears = useMemo(() => {
    if (!firebaseOn) return getStaticGearFallback()
    return remoteGears
  }, [firebaseOn, remoteGears])

  const filtered = useMemo(
    () => gears.filter((item) => item.category === active),
    [gears, active],
  )

  const openAdd = () => {
    if (!isAuthorized) {
      window.alert('장비를 등록할 수 있는 권한이 없습니다. 허용된 Google 계정으로 로그인해 주세요.')
      return
    }
    if (!firebaseOn) {
      window.alert(
        'Firebase가 연결되지 않았습니다. 배포 환경의 VITE_FIREBASE_* 환경 변수를 확인해 주세요.',
      )
      return
    }
    setEditingGear(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    if (item.isSample) return
    setEditingGear(item)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingGear(null)
  }

  const handleDelete = async (item) => {
    if (item.isSample) return
    if (!window.confirm(`「${item.name}」장비를 삭제할까요?`)) return
    try {
      await deleteGear(item.id)
    } catch (e) {
      window.alert(e?.message ?? String(e))
    }
  }

  const tabId = (catId) => `gear-tab-${catId}`
  const panelId = 'gear-panel'

  return (
    <section
      id="gear"
      className="scroll-mt-20 border-b border-forest-200 bg-gradient-to-b from-forest-50 to-earth-100/40 py-16 sm:py-20"
      aria-labelledby="gear-heading"
    >
      <GearFormModal
        open={formOpen}
        onClose={closeForm}
        editingGear={editingGear}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
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
              코스와 계절에 맞춰 고른 추천 장비입니다. 탭으로 카테고리를 바꿔 보세요.
              {firebaseOn
                ? ' 권한이 있는 멤버가 직접 장비를 추가·수정할 수 있습니다.'
                : ' Firebase에 연결되면 팀이 장비를 등록·관리할 수 있습니다.'}
            </p>
            {loadError && firebaseOn ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                장비 목록을 불러오지 못했습니다. ({loadError})
              </p>
            ) : null}
          </div>

          {isEnabled ? (
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  window.alert(
                    '상단 메뉴에서 구글 로그인한 뒤, 허용된 계정이면 장비를 등록할 수 있습니다.',
                  )
                  return
                }
                openAdd()
              }}
              title={
                !user
                  ? '로그인 후 이용할 수 있습니다.'
                  : !isAuthorized
                    ? '허용된 작성 권한 계정으로 로그인해 주세요.'
                    : !firebaseOn
                      ? 'Firebase 설정(VITE_FIREBASE_*)을 확인해 주세요.'
                      : '새 장비 등록'
              }
              className="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-forest-300 bg-white px-4 py-2.5 text-sm font-semibold text-forest-800 shadow-sm transition hover:border-forest-500 hover:bg-forest-50 hover:text-forest-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 sm:w-auto"
            >
              <Plus className="size-4 text-forest-600" aria-hidden />
              장비 추가하기
            </button>
          ) : null}
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

        <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)}>
          {loading && firebaseOn ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-forest-200 bg-white/60 py-16">
              <div
                className="size-10 animate-spin rounded-full border-2 border-forest-200 border-t-forest-600"
                aria-hidden
              />
              <p className="text-sm font-medium text-forest-700">
                장비 목록을 불러오는 중…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-forest-300 bg-white/60 px-6 py-12 text-center text-forest-700">
              이 카테고리에 등록된 장비가 없습니다.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <li key={item.id}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-forest-200 bg-white/90 shadow-sm transition hover:border-earth-300/80 hover:shadow-md">
                    <div className="relative aspect-[4/3] w-full shrink-0 bg-forest-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-forest-500">
                          <ImageOff className="size-10 opacity-60" aria-hidden />
                          <span className="text-xs font-medium">샘플 · 이미지 없음</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold tracking-tight text-forest-900">
                        {item.name}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-forest-800/90">
                        {item.description}
                      </p>
                      {item.author ? (
                        <p className="mt-3 text-xs text-forest-500">
                          추천: {authorCaption(item.author)}
                        </p>
                      ) : item.isSample ? (
                        <p className="mt-3 text-xs text-forest-400">샘플 데이터</p>
                      ) : null}

                      {isAuthorized && !item.isSample ? (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-forest-100 pt-4">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-forest-200 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:bg-forest-50"
                          >
                            <PencilLine className="size-3.5" aria-hidden />
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            삭제
                          </button>
                        </div>
                      ) : null}
                    </div>
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
