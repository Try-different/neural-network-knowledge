import { Link } from 'react-router-dom'
import { flatTopics, LEVELS } from '../data/nav'

// 树状图学习路线：HTML 节点 + CSS 连线，可读性优先
export default function LearningPath() {
  const groups = [1, 2, 3].map((lv) => ({
    level: lv,
    info: LEVELS[lv],
    topics: flatTopics.filter((t) => t.level === lv),
  }))

  return (
    <div className="learning-path-tree">
      <h2 className="section-title">
        <span className="section-bar" />
        学习路线
      </h2>
      <p className="lp-intro">
        按难度递进，从基础概念出发，逐步深入经典架构与优化方法，最终探索前沿进展。点击节点跳转对应知识点。
      </p>

      <div className="lp-tree">
        {groups.map((g, gi) => (
          <div className="lp-layer" key={g.level}>
            {/* 阶段标签 */}
            <div className="lp-layer-label" style={{ '--lc': g.info.color }}>
              <span className="lp-layer-num">{['一', '二', '三'][gi]}</span>
              <span className="lp-layer-text">
                {g.info.label}
                <small>{g.info.desc}</small>
              </span>
            </div>

            {/* 节点行 */}
            <div className="lp-nodes">
              {g.topics.map((t, ti) => (
                <Link
                  key={t.path}
                  className="lp-node"
                  to={t.path}
                  style={{ '--nc': g.info.color }}
                >
                  <span className="lp-node-idx">{ti + 1}</span>
                  <span className="lp-node-title">{t.title}</span>
                </Link>
              ))}
            </div>

            {/* 层间连线 */}
            {gi < groups.length - 1 && (
              <div className="lp-connector">
                <div className="lp-conn-line" />
                <div className="lp-conn-arrow">↓</div>
                <div className="lp-conn-label">进入{LEVELS[g.level + 1].label}</div>
                <div className="lp-conn-line" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
