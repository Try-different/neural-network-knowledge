import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { nav, flatTopics } from '../data/nav'

function Search() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    const hit = flatTopics.find((t) => t.title.toLowerCase().includes(q.trim().toLowerCase()))
    if (hit) navigate(hit.path)
  }
  return (
    <form className="search" onSubmit={submit}>
      <span className="icon">⌕</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索知识点，回车跳转…"
        aria-label="搜索"
      />
    </form>
  )
}

export default function Navbar({ onMenuClick, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <button className="menu-toggle" onClick={onMenuClick} aria-label="切换菜单">
        ≡
      </button>
      <NavLink to="/" className="brand">
        <span className="logo">◈</span>
        <span>神经网络知识库</span>
      </NavLink>
      <Search />
      <nav className="nav-links">
        {nav.map((g) => (
          <NavLink key={g.path} to={g.path}>
            {g.title}
          </NavLink>
        ))}
      </nav>
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="切换明暗"
        title={theme === 'dark' ? '切换到浅色' : '切换到深色'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </header>
  )
}
