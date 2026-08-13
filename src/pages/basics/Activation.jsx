import DocPage from '../../components/DocPage'
import ActivationChart from '../../components/ActivationChart'

export default function Activation() {
  return (
    <DocPage
      title="激活函数"
      meta="引入非线性的关键组件 · Sigmoid / Tanh / ReLU / GELU"
      refs={[
        <>Nair, V., & Hinton, G. E. (2010). <em>Rectified Linear Units Improve Restricted Boltzmann Machines</em>. ICML.</>,
        <>Hendrycks, D., & Gimpel, K. (2016). <em>Gaussian Error Linear Units (GELU)</em>. arXiv:1606.08415.</>,
        <a href="https://zh.d2l.ai/chapter_multilayer-perceptrons/mlp.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 激活函数</a>,
        <a href="https://cs231n.github.io/neural-networks-1/" target="_blank" rel="noreferrer">CS231n：Commonly used activation functions</a>,
      ]}
    >
      <h2>为什么需要激活函数</h2>
      <p>
        如果神经网络每一层都只做线性变换 <code>z = Wx + b</code>，那么无论叠加多少层，整体仍可化简为一次线性变换，无法拟合非线性关系。激活函数对线性组合结果施加<strong>非线性变换</strong>，是网络具备强大表达能力的前提。
      </p>

      <ActivationChart />

      <h2>常见激活函数</h2>

      <h3>Sigmoid</h3>
      <div className="math">σ(x) = 1 / (1 + e⁻ˣ) &nbsp;&nbsp;∈ (0, 1)</div>
      <p>
        将任意实数压缩到 (0, 1)，常用于输出层表示概率。缺点：两端梯度趋于 0（<strong>梯度消失</strong>），且输出非零中心，收敛较慢。
      </p>

      <h3>Tanh</h3>
      <div className="math">tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ) &nbsp;&nbsp;∈ (−1, 1)</div>
      <p>
        零中心化，比 Sigmoid 更受隐藏层青睐，但同样存在梯度消失问题。
      </p>

      <h3>ReLU（修正线性单元）</h3>
      <div className="math">ReLU(x) = max(0, x)</div>
      <p>
        计算极简，正区间梯度恒为 1，有效缓解梯度消失，是现代深度网络隐藏层的<strong>默认选择</strong>。缺点：负输入梯度为 0，可能导致<strong>神经元死亡</strong>（永久不激活）。
      </p>

      <h3>Leaky ReLU</h3>
      <div className="math">LeakyReLU(x) = x &nbsp;(x &gt; 0)；&nbsp; αx &nbsp;(x ≤ 0)</div>
      <p>
        为负区间引入一个小的斜率（如 0.01），避免神经元完全死亡。
      </p>

      <h3>GELU</h3>
      <div className="math">GELU(x) ≈ 0.5x(1 + tanh[√(2/π)(x + 0.044715x³)])</div>
      <p>
        结合了 ReLU 的稀疏性与概率平滑性，在 Transformer、BERT、GPT 等模型中被广泛采用。
      </p>

      <h2>如何选择</h2>
      <table>
        <thead>
          <tr><th>场景</th><th>推荐</th></tr>
        </thead>
        <tbody>
          <tr><td>隐藏层（通用）</td><td>ReLU（默认）/ GELU</td></tr>
          <tr><td>Transformer 类模型</td><td>GELU</td></tr>
          <tr><td>二分类输出</td><td>Sigmoid</td></tr>
          <tr><td>多分类输出</td><td>Softmax</td></tr>
          <tr><td>存在神经元死亡问题时</td><td>Leaky ReLU</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <div className="title">实践建议</div>
        除非有特殊理由，隐藏层优先尝试 ReLU；若使用 Transformer 架构则用 GELU。尽量避免在深层隐藏层使用 Sigmoid，以免梯度消失。
      </div>
    </DocPage>
  )
}
