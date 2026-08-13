import { NavLink } from 'react-router-dom'
import { nav } from '../data/nav'

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} onClick={onClose}>
      {nav.map((g) => (
        <div className="group" key={g.id}>
          <div className="group-title">
            <span className="ic">{g.icon}</span>
            {g.title}
          </div>
          {g.children.map((t) => (
            <NavLink
              key={t.path}
              to={t.path}
              className={({ isActive }) => `topic ${isActive ? 'active' : ''}`}
            >
              {t.title}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}
