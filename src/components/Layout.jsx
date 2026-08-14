import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import GlossaryPanel from './GlossaryPanel'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light'
  )
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }
  return (
    <div className="app-shell">
      <Navbar
        onMenuClick={() => setSidebarOpen((o) => !o)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onGlossaryClick={() => setGlossaryOpen(true)}
      />
      <div className="body-area">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}
