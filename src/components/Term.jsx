import { useState } from 'react'
import { lookupTerm } from '../data/glossary'

// 内联术语组件：在正文中包裹术语，悬停/点击显示简短解释
// 用法：<Term>梯度</Term> 或 <Term name="learning rate">学习率</Term>
export default function Term({ children, name }) {
  const [show, setShow] = useState(false)
  const entry = lookupTerm(name || children)

  if (!entry) {
    // 术语表中暂无，原样返回不报错
    return <>{children}</>
  }

  return (
    <span
      className="term-inline"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((s) => !s)}
    >
      {children}
      {show && (
        <span className="term-tooltip" role="tooltip">
          <span className="term-tooltip-title">
            {entry.term}
            {entry.aliases.length > 0 && (
              <span className="term-tooltip-alias">（{entry.aliases.join(' / ')}）</span>
            )}
          </span>
          <span className="term-tooltip-def">{entry.def}</span>
          <span className="term-tooltip-cat">{entry.cat}</span>
        </span>
      )}
    </span>
  )
}
