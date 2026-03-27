import { useState } from 'react'
import { Menu, Mountain, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
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

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주요 메뉴"
        >
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
        </nav>
      ) : null}
    </header>
  )
}
