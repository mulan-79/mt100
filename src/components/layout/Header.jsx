import { useState } from 'react'
import { LogIn, LogOut, Menu, Mountain, ShieldCheck, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { navItems } from '../../data/navigation'

function navClassName({ isActive }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-medium no-underline transition',
    isActive
      ? 'bg-forest-200/90 text-forest-900'
      : 'text-forest-800 hover:bg-forest-100 hover:text-forest-900',
  ].join(' ')
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading, isAuthorized, isEnabled, signInWithGoogle, logout } =
    useAuth()

  const authButton = user ? (
    <button
      type="button"
      onClick={logout}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm font-medium text-forest-800 transition hover:bg-forest-50"
    >
      <LogOut className="size-4" aria-hidden />
      로그아웃
    </button>
  ) : (
    <button
      type="button"
      onClick={signInWithGoogle}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={loading || !isEnabled}
      title={
        !isEnabled
          ? 'Cloudflare Pages 빌드에 VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID 등 환경 변수를 넣고 재배포하세요.'
          : undefined
      }
    >
      <LogIn className="size-4" aria-hidden />
      구글 로그인
    </button>
  )

  const authDisabledHint = !isEnabled ? (
    <p
      className="max-w-xs text-xs leading-snug text-amber-800"
      title="Vite는 빌드 시점에만 VITE_* 변수를 넣습니다. 저장 후 Deployments에서 재배포하세요."
    >
      Firebase 미연결: Pages <strong className="font-semibold">Production</strong> 환경 변수에{' '}
      <code className="rounded bg-amber-100/80 px-1">VITE_FIREBASE_*</code> 전부 넣은 뒤{' '}
      <strong className="font-semibold">재배포</strong>가 필요합니다.
    </p>
  ) : null

  return (
    <header className="sticky top-0 z-50 border-b border-forest-200/80 bg-forest-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 text-forest-900 no-underline"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest-500 text-white shadow-sm transition group-hover:bg-forest-700">
            <Mountain className="size-5" aria-hidden />
          </span>
          <span className="font-semibold tracking-tight">
            한국 명산 100 정복기
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-1" aria-label="주요 메뉴">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/'}
                className={navClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {user ? (
            <div className="hidden items-center gap-2 rounded-lg border border-forest-200 bg-white/80 px-3 py-2 text-xs text-forest-700 lg:flex">
              <span className="truncate max-w-44">{user.email}</span>
              {isAuthorized ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  글쓰기 권한
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="flex min-w-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
            {authDisabledHint}
            {authButton}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-forest-800 transition hover:bg-forest-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-forest-200 bg-forest-50 px-4 py-3 md:hidden"
          aria-label="모바일 메뉴"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-3 py-2.5 text-sm font-medium no-underline',
                      isActive
                        ? 'bg-forest-200/90 text-forest-900'
                        : 'text-forest-800 hover:bg-forest-100',
                    ].join(' ')
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-forest-200 pt-3">
            {authDisabledHint ? (
              <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                {authDisabledHint}
              </div>
            ) : null}
            {user ? (
              <div className="mb-2 rounded-lg border border-forest-200 bg-white px-3 py-2 text-xs text-forest-700">
                <p className="truncate">{user.email}</p>
                {isAuthorized ? (
                  <p className="mt-1 font-medium text-emerald-700">글쓰기 권한 있음</p>
                ) : null}
              </div>
            ) : null}

            <div onClick={() => setOpen(false)}>{authButton}</div>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
