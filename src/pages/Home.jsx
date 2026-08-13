import { Link } from 'react-router-dom'
import { nav } from '../data/nav'

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <span className="badge">机器学习 · 深度学习</span>
        <h1>神经网络知识库</h1>
        <p className="lead">
          系统梳理神经网络的核心概念、经典架构、训练优化与前沿进展，配合可交互的可视化，让抽象原理变得直观。
        </p>
        <div className="cta">
          <Link className="primary" to="/basics/neuron">开始学习 →</Link>
          <Link className="ghost" to="/architectures/transformer">查看架构</Link>
        </div>
      </div>

      <h2>知识模块</h2>
      <div className="module-grid">
        {nav.map((g) => (
          <Link key={g.id} className="module-card" to={g.path}>
            <div className="mc-head">
              <div className="mc-icon">{g.icon}</div>
              <div className="mc-title">{g.title}</div>
            </div>
            <p className="mc-desc">{g.desc}</p>
            <div className="mc-tags">
              {g.children.map((c) => (
                <span key={c.path}>{c.title}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="feature-row">
        <div className="feature">
          <div className="ft-ic" style={{ color: 'var(--accent)' }}>▦</div>
          <h3>交互可视化</h3>
          <p>结构图、前向传播动画、激活函数曲线，动手调节参数理解原理。</p>
        </div>
        <div className="feature">
          <div className="ft-ic" style={{ color: 'var(--accent-2)' }}>❖</div>
          <h3>权威来源</h3>
          <p>每个知识点附经典教材与论文出处，便于深入溯源。</p>
        </div>
        <div className="feature">
          <div className="ft-ic" style={{ color: 'var(--accent)' }}>◐</div>
          <h3>深色优先</h3>
          <p>护眼深色界面，自适应浅色，移动端友好阅读。</p>
        </div>
      </div>
    </div>
  )
}
