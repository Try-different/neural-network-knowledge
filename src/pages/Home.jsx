import { Link } from 'react-router-dom'
import { nav } from '../data/nav'
import LearningPath from '../components/LearningPath'
import NeuralBackground from '../components/NeuralBackground'
import Reveal from '../components/Reveal'
import ModuleIcon from '../components/ModuleIcon'

export default function Home() {
  return (
    <div className="home">
      {/* Hero 区：动态神经网络背景 */}
      <div className="hero">
        <NeuralBackground />
        <div className="hero-content">
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
      </div>

      <Reveal>
        <h2 className="section-title">
          <span className="section-bar" />
          知识模块
        </h2>
        <div className="module-rows">
          {nav.map((g, i) => (
            <Reveal key={g.id} delay={i * 60}>
              <div className="module-row">
                <Link className="mr-left" to={g.path}>
                  <div className="mr-icon"><ModuleIcon id={g.id} /></div>
                  <div className="mr-info">
                    <div className="mr-title">{g.title}</div>
                    <div className="mr-desc">{g.desc}</div>
                  </div>
                </Link>
                <div className="mr-topics">
                  {g.children.map((c) => (
                    <Link key={c.path} className="mr-topic" to={c.path}>
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <LearningPath />
      </Reveal>

      <Reveal delay={100}>
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
      </Reveal>
    </div>
  )
}
