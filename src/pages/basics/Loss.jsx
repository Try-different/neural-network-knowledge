import DocPage from '../../components/DocPage'
import LossViz from '../../components/LossViz'
import SoftmaxViz from '../../components/SoftmaxViz'

export default function Loss() {
  return (
    <DocPage
      title="损失函数"
      meta="衡量预测与真实差距的度量 · 回归用 MSE，分类用交叉熵"
      refs={[
        <a href="https://zh.d2l.ai/chapter_linear-networks/softmax-regression.html" target="_blank" rel="noreferrer">《动手学深度学习》—— softmax 回归与交叉熵</a>,
        <>Goodfellow, I., et al. (2016). <em>Deep Learning</em>, Chapter 5.5–5.6. <a href="https://www.deeplearningbook.org/contents/ml.html" target="_blank" rel="noreferrer">deeplearningbook.org</a></>,
        <a href="https://cs231n.github.io/neural-networks-2/" target="_blank" rel="noreferrer">CS231n：Loss Functions</a>,
      ]}
    >
      <h2>损失函数的作用</h2>
      <p>
        <strong>损失函数（Loss Function）</strong>量化模型预测 <code>ŷ</code> 与真实标签 <code>y</code> 之间的差距。训练的目标就是<strong>最小化</strong>训练集上的平均损失。不同任务类型对应不同的损失函数。
      </p>

      <h2>回归任务：MSE 与 MAE</h2>
      <h3>均方误差 MSE</h3>
      <div className="math">L = (1/n) Σ (yᵢ − ŷᵢ)²</div>
      <p>
        对大误差惩罚更重（平方放大），梯度处处可导，是回归任务最常用的损失。缺点是对离群点敏感。
      </p>
      <h3>平均绝对误差 MAE</h3>
      <div className="math">L = (1/n) Σ |yᵢ − ŷᵢ|</div>
      <p>对离群点更鲁棒，但在零点不可导，收敛较慢。</p>

      <LossViz />

      <h2>分类任务：交叉熵</h2>
      <p>
        交叉熵衡量两个概率分布的差异。预测分布越接近真实分布，交叉熵越小。
      </p>

      <h3>二元交叉熵（BCE）</h3>
      <div className="math">L = −[y · log ŷ + (1 − y) · log(1 − ŷ)]</div>
      <p>用于二分类，输出层配合 Sigmoid。</p>

      <h3>多类交叉熵（Categorical Cross-Entropy）</h3>
      <div className="math">L = − Σᵢ yᵢ · log ŷᵢ</div>
      <p>用于多分类，输出层配合 Softmax。由于真实标签通常是 one-hot 向量，只有正确类别的项非零。</p>

      <SoftmaxViz />

      <h2>Softmax 与交叉熵的配合</h2>
      <p>
        <strong>Softmax</strong> 将 logits 转换为概率分布：
      </p>
      <div className="math">pᵢ = e^(zᵢ) / Σⱼ e^(zⱼ)</div>
      <p>
        将 Softmax 与交叉熵合并后，梯度形式非常简洁：<code>∂L/∂zᵢ = pᵢ − yᵢ</code>（预测概率减去真实标签），这正是它成为分类标配的原因。
      </p>

      <pre><code>{`import numpy as np

def softmax(z):
    z = z - z.max(axis=1, keepdims=True)   # 数值稳定，防溢出
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)

def cross_entropy(logits, y):
    m = y.shape[0]
    p = softmax(logits)
    loss = -np.mean(np.log(p[range(m), y] + 1e-8))
    # 梯度：(p - one_hot(y)) / m
    grad = p.copy()
    grad[range(m), y] -= 1
    return loss, grad / m`}
      </code></pre>

      <div className="callout warn">
        <div className="title">为什么分类不用 MSE？</div>
        将 MSE 用于分类（配合 Sigmoid/Softmax）时，梯度中会多出一个激活函数导数项，当预测饱和时梯度趋近于 0，导致学习极其缓慢；交叉熵与对数似然等价，梯度形式更优，收敛更快。
      </div>

      <h2>选择速查</h2>
      <table>
        <thead><tr><th>任务</th><th>输出层</th><th>损失函数</th></tr></thead>
        <tbody>
          <tr><td>回归</td><td>线性</td><td>MSE</td></tr>
          <tr><td>二分类</td><td>Sigmoid</td><td>BCE</td></tr>
          <tr><td>多分类（互斥）</td><td>Softmax</td><td>交叉熵</td></tr>
          <tr><td>多标签分类</td><td>Sigmoid</td><td>BCE（每类独立）</td></tr>
        </tbody>
      </table>
    </DocPage>
  )
}
