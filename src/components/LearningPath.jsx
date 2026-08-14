import { Link } from 'react-router-dom'
import { nav, flatTopics, LEVELS } from '../data/nav'
import DifficultyBadge from './DifficultyBadge'

// 按难度分组的学习路线推荐
export default function LearningPath() {
  const groups = [1, 2, 3].map((lv) => ({
    level: lv,
    info: LEVELS[lv],
    topics: flatTopics.filter((t) => t.level === lv),
  }))

  return (
    <div className="learning-path">
      <h2>新手学习路线</h2>
      <p className="lp-intro">
        建议按难度递进学习：先打牢基础，再理解经典架构与优化方法，最后探索前沿进展。
        每个知识点都配有交互演示，动手调参加深理解。
      </p>
      <div className="lp-stages">
        {groups.map((g, gi) => (
          <div key={g.level} className="lp-stage">
            <div className="lp-stage-head">
              <span className="lp-num" style={{ color: g.info.color }}>
                {['一', '二', '三'][gi]}
              </span>
              <div>
                <div className="lp-stage-title">
                  第{['一', '二', '三'][gi]}阶段 · {g.info.label}
                </div>
                <div className="lp-stage-desc">{g.info.desc}</div>
              </div>
            </div>
            <div className="lp-topics">
              {g.topics.map((t, ti) => (
                <Link key={t.path} className="lp-topic" to={t.path}>
                  <span className="lp-step">{ti + 1}</span>
                  <span className="lp-ttitle">{t.title}</span>
                  <DifficultyBadge level={t.level} />
                </Link>
              ))}
            </div>
            {gi < groups.length - 1 && <div className="lp-arrow">↓</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
