import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { AboutPage } from './pages/AboutPage'
import { GearPage } from './pages/GearPage'
import { HomePage } from './pages/HomePage'
import { JournalPage } from './pages/JournalPage'
import { QAPage } from './pages/QAPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-forest-50 text-forest-900 antialiased">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/gear" element={<GearPage />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
