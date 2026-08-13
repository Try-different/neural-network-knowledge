import DocPage from '../../components/DocPage'
import BatchNormViz from '../../components/BatchNormViz'

export default function BatchNorm() {
  return (
    <DocPage
      title="批归一化 BatchNorm"
      meta="对每层激活做标准化 · 稳定并加速深度网络训练"
      refs={[
        <>Ioffe, S., & Szegedy, C. (2015). <em>Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift</em>. ICML. arXiv:1502.03167.</>,
        <>Santurkar, S., et al. (2018). <em>How Does Batch Normalization Help Optimization?</em>. NeurIPS.</>,
        <a href="https://zh.d2l.ai/chapter_convolutional-modern/batch-norm.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 批量归一化</a>,
      ]}
    >
      <h2>问题与动机</h2>
      <p>
        深层网络中，前一层参数的更新会改变后一层的输入分布，这种现象被 Ioffe 与 Szegedy 称为<strong>内部协变量偏移（Internal Covariate Shift）</strong>。BatchNorm 通过在每个小批量的维度上对激活做标准化，来稳定这种分布。
      </p>

      <h2>计算公式</h2>
      <p>对某层在一个小批量 <code>B = {'{x₁, …, xₘ}'}</code> 上计算：</p>
      <div className="math">
        μ_B = (1/m) Σ xᵢ &nbsp;&nbsp;（批量均值）<br/>
        σ²_B = (1/m) Σ (xᵢ − μ_B)² &nbsp;（批量方差）<br/>
        x̂ᵢ = (xᵢ − μ_B) / √(σ²_B + ε) &nbsp;（标准化）<br/>
        yᵢ = γ · x̂ᵢ + β &nbsp;&nbsp;（可学习的缩放与平移）
      </div>
      <p>
        <code>γ, β</code> 是可学习参数，让网络在需要时可恢复任意分布，保证归一化不损失表达能力。
      </p>

      <BatchNormViz />

      <h2>训练 vs 推理</h2>
      <ul>
        <li><strong>训练</strong>：使用当前小批量的均值/方差。</li>
        <li><strong>推理</strong>：使用训练期间累积的<strong>移动平均</strong>统计量，保证输出确定。</li>
      </ul>
      <div className="callout warn">
        <div className="title">注意</div>
        正因依赖批量统计，BatchNorm 在批量过小或在线学习（batch=1）、序列长度可变等场景下表现不佳，这也是 Transformer 普遍改用 <strong>LayerNorm</strong> 的原因。
      </div>

      <h2>它真正起作用的原因</h2>
      <p>
        后续研究（Santurkar 等，2018）表明，BatchNum 减缓协变量偏移的解释并不充分；其真正贡献在于<strong>平滑优化地形</strong>——使损失函数对参数更不敏感、梯度更可预测，从而允许使用更大学习率、加快收敛，并带来轻微的正则化效果（批统计引入的噪声）。
      </p>

      <h2>归一化方法家族</h2>
      <table>
        <thead><tr><th>方法</th><th>归一化维度</th><th>典型场景</th></tr></thead>
        <tbody>
          <tr><td>BatchNorm</td><td>批量维度</td><td>CNN / 图像</td></tr>
          <tr><td>LayerNorm</td><td>特征维度</td><td>RNN / Transformer</td></tr>
          <tr><td>InstanceNorm</td><td>每个样本</td><td>风格迁移</td></tr>
          <tr><td>GroupNorm</td><td>特征分组</td><td>小批量 CNN</td></tr>
        </tbody>
      </table>

      <pre><code>{`# BatchNorm 前向（训练）
mu = x.mean(axis=0)
var = x.var(axis=0)
x_hat = (x - mu) / np.sqrt(var + eps)
out = gamma * x_hat + beta
# 维护移动平均供推理使用
running_mean = momentum * running_mean + (1-momentum) * mu`}
      </code></pre>
    </DocPage>
  )
}
