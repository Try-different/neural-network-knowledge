import { useState, useMemo } from 'react'
import { glossary, glossaryByCat } from '../data/glossary'

// 浮层术语速查面板：从导航栏按钮打开，可搜索浏览所有术语
export default function GlossaryPanel({ open, onClose }) {
  const [q, setQ] = useState('')
  const [activeCat, setActiveCat] = useState('全部')

  const cats = ['全部', ...Object.keys(glossaryByCat)]

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    let list = glossary
    if (activeCat !== '全部') list = list.filter((g) => g.cat === activeCat)
    if (query) {
      list = list.filter(
        (g) =>
          g.term.toLowerCase().includes(query) ||
          g.def.toLowerCase().includes(query) ||
          g.aliases.some((a) => a.toLowerCase().includes(query))
      )
    }
    return list
  }, [q, activeCat])

  if (!open) return null

  return (
    <div className="glossary-overlay" onClick={onClose}>
      <div className="glossary-panel" onClick={(e) => e.stopPropagation()}>
        <div className="gp-head">
          <h3>术语速查</h3>
          <button className="gp-close" onClick={onClose} aria-label="关闭">✕</button>
        </div>
        <input
          className="gp-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索术语（中英文均可）…"
          autoFocus
        />
        <div className="gp-cats">
          {cats.map((c) => (
            <button
              key={c}
              className={activeCat === c ? 'active' : ''}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="gp-list">
          {filtered.length === 0 && (
            <div className="gp-empty">未找到匹配的术语</div>
          )}
          {filtered.map((g, i) => (
            <div className="gp-item" key={i}>
              <div className="gp-item-head">
                <span className="gp-term">{g.term}</span>
                {g.aliases.length > 0 && (
                  <span className="gp-alias">{g.aliases.join(' · ')}</span>
                )}
                <span className="gp-cat">{g.cat}</span>
              </div>
              <div className="gp-def">{g.def}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
