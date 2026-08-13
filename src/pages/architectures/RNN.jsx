import DocPage from '../../components/DocPage'
import RNNViz from '../../components/RNNViz'

export default function RNN() {
  return (
    <DocPage
      title="循环神经网络 RNN"
      meta="处理序列数据的模型 · 用隐状态记忆历史"
      refs={[
        <>Elman, J. L. (1990). <em>Finding Structure in Time</em>. Cognitive Science.</>,
        <a href="https://zh.d2l.ai/chapter_recurrent-neural-networks/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 循环神经网络</a>,
        <>Goodfellow, I., et al. (2016). <em>Deep Learning</em>, Chapter 10. <a href="https://www.deeplearningbook.org/contents/rnn.html" target="_blank" rel="noreferrer">deeplearningbook.org</a></>,
      ]}
    >
      <h2>为什么要循环</h2>
      <p>
        前馈网络对每个输入独立处理，无法利用序列中的<strong>时序依赖</strong>。循环神经网络（RNN）通过一个随时间传递的<strong>隐状态</strong> <code>hₜ</code>，将过去的信息带入当前计算，天然适合文本、语音、时序信号等序列数据。
      </p>

      <h2>核心公式</h2>
      <div className="math">hₜ = tanh(Wₓ xₜ + Wₕ hₜ₋₁ + b)</div>
      <div className="math">yₜ = W_y hₜ + b_y</div>
      <p>
        同一组参数 <code>Wₓ, Wₕ, W_y</code> 在<strong>所有时间步共享</strong>，这与 CNN 的权重共享思想一致，使模型能处理变长序列。
      </p>

      <div className="callout">
        <div className="title">展开视角</div>
        沿时间维度展开后，RNN 可看作一个深度网络——每个时间步相当于一层。因此“层数”等于序列长度，这也埋下了梯度问题的伏笔。
      </div>

      <RNNViz />

      <h2>反向传播随时间（BPTT）</h2>
      <p>
        RNN 的训练算法称为<strong>Backpropagation Through Time (BPTT)</strong>：将网络按时间展开后，沿时间步反向传播梯度。由于梯度需连乘多步 <code>Wₕ</code>：
      </p>
      <ul>
        <li>若 <code>Wₕ</code> 的特征值小于 1，连乘导致梯度指数衰减 → <strong>梯度消失</strong>，难以学习长程依赖。</li>
        <li>若大于 1，则梯度指数增长 → <strong>梯度爆炸</strong>（可用梯度裁剪缓解）。</li>
      </ul>

      <h2>几种常见结构</h2>
      <ul>
        <li><strong>一对一</strong>：序列到单个标签（如情感分类）。</li>
        <li><strong>一对多</strong>：单个输入生成序列（如音乐生成）。</li>
        <li><strong>多对一</strong>：序列到标签。</li>
        <li><strong>多对多</strong>：序列到序列（如机器翻译）。</li>
      </ul>

      <div className="callout warn">
        <div className="title">局限</div>
        标准 RNN 在长序列上很难记住相隔较远的信息。门控结构（LSTM、GRU）正是为缓解这一问题而提出——见下一节。
      </div>

      <h2>代码示意：单步前向</h2>
      <pre><code>{`import numpy as np

def rnn_step(x_t, h_prev, Wx, Wh, b):
    h_t = np.tanh(Wx @ x_t + Wh @ h_prev + b)
    return h_t

# 沿时间步迭代
h = np.zeros(hidden_dim)
for x_t in sequence:        # sequence: [x_1, x_2, ..., x_T]
    h = rnn_step(x_t, h, Wx, Wh, b)`}
      </code></pre>
    </DocPage>
  )
}
