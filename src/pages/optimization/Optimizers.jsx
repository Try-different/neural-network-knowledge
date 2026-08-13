import DocPage from '../../components/DocPage'

export default function Optimizers() {
  return (
    <DocPage
      title="优化器家族"
      meta="在 SGD 之上引入动量与自适应学习率 · Momentum → Adam"
      refs={[
        <>Kingma, D. P., & Ba, J. (2014). <em>Adam: A Method for Stochastic Optimization</em>. ICLR 2015. arXiv:1412.6980.</>,
        <>Duchi, J., Hazan, E., & Singer, Y. (2011). <em>Adaptive Subgradient Methods</em>. JMLR.</>,
        <a href="https://zh.d2l.ai/chapter_optimization/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 优化算法</a>,
        <>Ruder, S. (2016). <em>An overview of gradient descent optimization algorithms</em>. arXiv:1609.04747.</>,
      ]}
    >
      <h2>为什么需要更好的优化器</h2>
      <p>
        原始 SGD 在病态曲率下震荡严重、对学习率敏感。改进方向有两条：<strong>动量</strong>（累积历史梯度方向）与<strong>自适应学习率</strong>（按参数维度自动调整步长）。
      </p>

      <h2>动量法 Momentum</h2>
      <p>引入一个按指数衰减的梯度累积量 <code>v</code>，相当于给更新加上了“惯性”：</p>
      <div className="math">vₜ = β·vₜ₋₁ + ∇L &nbsp;&nbsp;→&nbsp;&nbsp; θ ← θ − η·vₜ</div>
      <p>动量能加速在一致方向上的移动、抑制在震荡方向上的来回，更快穿过狭长山谷。</p>

      <h2>AdaGrad</h2>
      <p>为每个参数维护历史梯度平方和 <code>r</code>，步长除以其平方根，频繁更新的参数步长变小：</p>
      <div className="math">rₜ = rₜ₋₁ + ∇L² &nbsp;&nbsp;→&nbsp;&nbsp; θ ← θ − η·∇L / (√rₜ + ε)</div>
      <p>缺点：累积量单调递增，学习率会持续衰减直至过早趋零。</p>

      <h2>RMSProp</h2>
      <p>改用<strong>指数移动平均</strong>替代平方和累加，只关注近期梯度，解决了 AdaGrad 衰减过早的问题：</p>
      <div className="math">rₜ = ρ·rₜ₋₁ + (1−ρ)·∇L²</div>

      <h2>Adam：动量 + 自适应</h2>
      <p>Adam 同时维护梯度的一阶矩（动量）与二阶矩（自适应学习率），并做偏差修正：</p>
      <div className="math">
        mₜ = β₁·mₜ₋₁ + (1−β₁)·gₜ &nbsp;&nbsp;（一阶矩）<br/>
        vₜ = β₂·vₜ₋₁ + (1−β₂)·gₜ² &nbsp;（二阶矩）<br/>
        m̂ₜ = mₜ/(1−β₁ᵗ), &nbsp; v̂ₜ = vₜ/(1−β₂ᵗ) &nbsp;（偏差修正）<br/>
        θ ← θ − η·m̂ₜ / (√v̂ₜ + ε)
      </div>
      <p>Adam 凭借收敛快、调参少的特点，成为深度学习最常用的优化器（默认 β₁=0.9, β₂=0.999, ε=1e-8）。</p>

      <h2>对比速查</h2>
      <table>
        <thead><tr><th>优化器</th><th>动量</th><th>自适应学习率</th><th>适用</th></tr></thead>
        <tbody>
          <tr><td>SGD</td><td>✗</td><td>✗</td><td>配调度可达到最佳泛化</td></tr>
          <tr><td>SGD+Momentum</td><td>✓</td><td>✗</td><td>CV 任务经典选择</td></tr>
          <tr><td>RMSProp</td><td>✗</td><td>✓</td><td>RNN / 非稳态目标</td></tr>
          <tr><td>Adam</td><td>✓</td><td>✓</td><td>通用默认，NLP 常用</td></tr>
        </tbody>
      </table>

      <div className="callout warn">
        <div className="title">泛化之争</div>
        研究表明，SGD（+ Momentum）在图像分类等任务上往往泛化更好，而 Adam 收敛更快。后续的 AdamW、Lookahead、SAM 等试图兼顾二者。Transformer 类模型目前普遍使用 AdamW。
      </div>
    </DocPage>
  )
}
