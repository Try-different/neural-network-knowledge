import { Link } from 'react-router-dom'
import { nav } from '../data/nav'
import DifficultyBadge from './DifficultyBadge'

// 模块索引页：展示某模块下所有主题卡片
export default function ModuleIndex({ moduleId }) {
  const g = nav.find((n) => n.id === moduleId)
  return (
    <div className="module-index">
      <div className="mi-hero">
        <div className="breadcrumb">
          <Link to="/">首页</Link>
          <span className="sep">/</span>
          <span>{g.title}</span>
        </div>
        <h1>{g.title}</h1>
        <p className="doc-meta">{g.desc}</p>
      </div>
      <div className="mi-grid">
        {g.children.map((c, i) => (
          <Link key={c.path} className="topic-card" to={c.path}>
            <div className="num">{String(i + 1).padStart(2, '0')}</div>
            <div className="ttl">{c.title}</div>
            <DifficultyBadge level={c.level} />
            <div className="dsc">{c.dsc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
