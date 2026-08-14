import { NavLink } from 'react-router-dom'
import { nav } from '../data/nav'
import DifficultyBadge from './DifficultyBadge'
import ModuleIcon from './ModuleIcon'

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} onClick={onClose}>
      {nav.map((g) => (
        <div className="group" key={g.id}>
          <div className="group-title">
            <span className="ic"><ModuleIcon id={g.id} /></span>
            {g.title}
          </div>
          {g.children.map((t) => (
            <NavLink
              key={t.path}
              to={t.path}
              className={({ isActive }) => `topic ${isActive ? 'active' : ''}`}
            >
              <span className="topic-label">{t.title}</span>
              <DifficultyBadge level={t.level} />
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}
