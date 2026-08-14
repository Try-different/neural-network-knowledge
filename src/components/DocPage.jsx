import { useLocation, Link } from 'react-router-dom'
import { nav, flatTopics } from '../data/nav'
import DifficultyBadge from './DifficultyBadge'

// 文档页通用布局：面包屑 + 标题 + 内容 + 参考来源 + 上下页导航
export default function DocPage({ title, meta, refs, children }) {
  const loc = useLocation()
  const idx = flatTopics.findIndex((t) => t.path === loc.pathname)
  const prev = idx > 0 ? flatTopics[idx - 1] : null
  const next = idx >= 0 && idx < flatTopics.length - 1 ? flatTopics[idx + 1] : null
  const group = nav.find((g) => g.children.some((c) => c.path === loc.pathname))
  const current = idx >= 0 ? flatTopics[idx] : null

  return (
    <article className="doc-page">
      <div className="breadcrumb">
        <Link to="/">首页</Link>
        <span className="sep">/</span>
        {group && (
          <>
            <Link to={group.path}>{group.title}</Link>
            <span className="sep">/</span>
          </>
        )}
        <span>{title}</span>
      </div>
      <h1 className="doc-title">
        {title}
        {current && <DifficultyBadge level={current.level} size="md" />}
      </h1>
      {meta && <div className="doc-meta">{meta}</div>}
      {children}
      {refs && refs.length > 0 && (
        <div className="refs">
          <h3>参考来源</h3>
          <ol>
            {refs.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>
      )}
      <div className="pager">
        {prev ? (
          <Link to={prev.path}>
            <div className="dir">← 上一节</div>
            <div className="ttl">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={next.path} className="next">
            <div className="dir">下一节 →</div>
            <div className="ttl">{next.title}</div>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  )
}
