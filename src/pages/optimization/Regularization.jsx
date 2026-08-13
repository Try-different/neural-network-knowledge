import DocPage from '../../components/DocPage'
import OverfittingDemo from '../../components/OverfittingDemo'
import DropoutViz from '../../components/DropoutViz'

export default function Regularization() {
  return (
    <DocPage
      title="正则化"
      meta="抑制过拟合、提升泛化能力的手段集合"
      refs={[
        <>Srivastava, N., et al. (2014). <em>Dropout: A Simple Way to Prevent Neural Networks from Overfitting</em>. JMLR. arXiv:1207.0580.</>,
        <a href="https://zh.d2l.ai/chapter_multilayer-perceptrons/weight-decay.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 权重衰减与 Dropout</a>,
        <a href="https://cs231n.github.io/neural-networks-2/#reg" target="_blank" rel="noreferrer">CS231n：Regularization</a>,
      ]}
    >
      <h2>过拟合：训练好却不通用</h2>
      <p>
        当模型容量过大而数据不足时，网络可能把训练集“死记硬背”下来，训练损失很低但在新数据上表现差——这就是<strong>过拟合</strong>。正则化的目标，是限制模型复杂度，使其学到<strong>可泛化</strong>的规律。
      </p>

      <h2>L1 / L2 权重衰减</h2>
      <p>在损失中加入参数范数惩罚，使权重趋向更小的值：</p>
      <div className="math">L_total = L_data + λ · R(W)</div>
      <ul>
        <li><strong>L2（权重衰减）</strong>：<code>R = ½‖W‖²</code>，权重整体缩小，是最常用的正则项。</li>
        <li><strong>L1</strong>：<code>R = ‖W‖₁</code>，倾向于产生稀疏权重（部分参数归零），自带特征选择效果。</li>
      </ul>

      <OverfittingDemo />

      <h2>Dropout</h2>
      <p>
        训练时按概率 <code>p</code> 随机将部分神经元输出置零，迫使网络不依赖任何单个神经元，相当于训练了一个庞大的子网络集成。推理时不dropout，但输出按 <code>(1−p)</code> 缩放（或训练时已做反向缩放）。
      </p>

      <DropoutViz />
      <pre><code>{`# 训练时
mask = (np.random.rand(*h.shape) > p) / (1 - p)  # inverted dropout
h = h * mask
# 推理时：直接使用，无需操作`}
      </code></pre>

      <h2>早停 Early Stopping</h2>
      <p>
        在验证集损失不再下降（甚至上升）时提前终止训练，避免模型继续拟合训练集噪声。简单而有效，几乎是标配。
      </p>

      <h2>数据增强 Data Augmentation</h2>
      <p>
        通过对训练数据施加合理变换扩充样本量。图像：翻转、裁剪、旋转、颜色抖动；文本：同义词替换、回译。数据增强往往比改模型更划算，是提升泛化的第一手段。
      </p>

      <div className="callout">
        <div className="title">组合使用</div>
        实践中通常组合多种正则手段：权重衰减 + 早停 + 数据增强，必要时加 Dropout。Transformer 中常用 Dropout 配合权重衰减（AdamW 即把 L2 解耦为权重衰减）。
      </div>

      <h2>正则化方法对照</h2>
      <table>
        <thead><tr><th>方法</th><th>作用方式</th><th>额外开销</th></tr></thead>
        <tbody>
          <tr><td>L2 权重衰减</td><td>约束权重大小</td><td>几乎无</td></tr>
          <tr><td>Dropout</td><td>随机失活神经元</td><td>训练稍慢</td></tr>
          <tr><td>早停</td><td>限制训练轮数</td><td>需验证集</td></tr>
          <tr><td>数据增强</td><td>扩充有效数据</td><td>预处理成本</td></tr>
        </tbody>
      </table>
    </DocPage>
  )
}
