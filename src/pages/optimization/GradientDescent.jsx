import DocPage from '../../components/DocPage'
import GradientDescentViz from '../../components/GradientDescentViz'

export default function GradientDescent() {
  return (
    <DocPage
      title="梯度下降"
      meta="最基本的优化算法 · 沿负梯度方向逐步逼近最小值"
      refs={[
        <a href="https://zh.d2l.ai/chapter_optimization/gd.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 梯度下降与随机梯度下降</a>,
        <>Robbins, H., & Monro, S. (1951). <em>A Stochastic Approximation Method</em>. Annals of Mathematical Statistics.</>,
        <a href="https://cs231n.github.io/optimization-1/" target="_blank" rel="noreferrer">CS231n：Optimization</a>,
      ]}
    >
      <h2>核心思想</h2>
      <p>
        损失函数 <code>L(θ)</code> 描述了参数 <code>θ</code> 的好坏。梯度 <code>∇L</code> 指向损失上升最快的方向，那么<strong>沿负梯度方向走一小步</strong>，损失就会下降。这就是梯度下降：
      </p>
      <div className="math">θ ← θ − η · ∇L(θ)</div>
      <p>其中 <code>η</code> 为<strong>学习率</strong>，控制每步的步长。</p>

      <h2>三种变体</h2>
      <table>
        <thead><tr><th>名称</th><th>每次使用的数据</th><th>特点</th></tr></thead>
        <tbody>
          <tr><td>批量梯度下降 BGD</td><td>全部训练集</td><td>梯度准，但慢、内存大</td></tr>
          <tr><td>随机梯度下降 SGD</td><td>单个样本</td><td>快、有噪声、利于跳出局部最优</td></tr>
          <tr><td>小批量 SGD</td><td>一小批样本</td><td>兼顾速度与稳定性，实际最常用</td></tr>
        </tbody>
      </table>

      <pre><code>{`# 小批量梯度下降
for epoch in range(num_epochs):
    np.random.shuffle(data)
    for batch in get_batches(data, batch_size):
        grad = compute_gradient(loss, batch, params)
        for k in params:
            params[k] -= lr * grad[k]`}
      </code></pre>

      <h2>学习率的影响</h2>
      <ul>
        <li><strong>过大</strong>：振荡甚至发散，损失不降反升。</li>
        <li><strong>过小</strong>：收敛缓慢，易陷入局部最优。</li>
        <li><strong>合适</strong>：稳定下降至最小值附近。</li>
      </ul>

      <GradientDescentViz />

      <div className="callout">
        <div className="title">学习率调度</div>
        训练中常让学习率随时间衰减（如 Step、Cosine 退火），或采用预热（warmup）——前期小学习率避免发散，后期减小以精细收敛。Transformer 训练几乎都使用 warmup + cosine 调度。
      </div>

      <h2>梯度下降的挑战</h2>
      <ul>
        <li>对学习率敏感，需反复调试。</li>
        <li>在病态曲率（如狭长山谷）区域振荡、收敛慢。</li>
        <li>容易停在鞍点或局部最优。</li>
      </ul>
      <p>这些正是各种<strong>自适应优化器</strong>（Momentum、Adam 等）要解决的问题，见下一节。</p>
    </DocPage>
  )
}
