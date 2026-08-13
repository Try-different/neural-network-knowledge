import DocPage from '../../components/DocPage'
import ForwardPassDemo from '../../components/ForwardPassDemo'

export default function ForwardBackprop() {
  return (
    <DocPage
      title="前向与反向传播"
      meta="神经网络的两条信息流 · 数据向前流动，梯度反向回传"
      refs={[
        <>Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). <em>Learning Representations by Back-propagating Errors</em>. Nature.</>,
        <a href="https://zh.d2l.ai/chapter_multilayer-perceptrons/backprop.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 反向传播</a>,
        <a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank" rel="noreferrer">3Blue1Brown：反向传播究竟在做什么</a>,
        <>Goodfellow, I., et al. (2016). <em>Deep Learning</em>, Chapter 6. <a href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noreferrer">deeplearningbook.org</a></>,
      ]}
    >
      <h2>前向传播：从输入到预测</h2>
      <p>
        <strong>前向传播</strong>指数据从输入层逐层经过运算得到输出的过程。对一个两层网络，记输入为 <code>x</code>：
      </p>
      <div className="math">
        z¹ = W¹x + b¹ &nbsp;→&nbsp; a¹ = f(z¹) &nbsp;→&nbsp; z² = W²a¹ + b² &nbsp;→&nbsp; ŷ = g(z²)
      </div>
      <p>
        每一层先做线性变换，再用激活函数引入非线性，最终得到预测值 <code>ŷ</code>，并与真实标签 <code>y</code> 计算损失 <code>L</code>。
      </p>

      <ForwardPassDemo />

      <h2>计算图与链式法则</h2>
      <p>
        神经网络可视为一张<strong>计算图</strong>：每个节点是一次运算，边表示数据的依赖。<strong>反向传播</strong>的本质，是沿着计算图从损失出发，用<strong>链式法则</strong>逐层计算每个参数的梯度。
      </p>
      <div className="math">
        ∂L/∂W¹ = (∂L/∂ŷ) · (∂ŷ/∂z²) · (∂z²/∂a¹) · (∂a¹/∂z¹) · (∂z¹/∂W¹)
      </div>
      <p>
        直觉上：先算损失对输出的梯度，再“反向”传给上一层，依次求出每一层参数的梯度。1986 年 Rumelhart 等人系统化提出这一算法，使多层网络训练成为可能。
      </p>

      <div className="callout">
        <div className="title">为什么是“反向”</div>
        因为梯度是从输出端开始、沿计算图逆向逐层计算的——前向算“结果”，反向算“责任（梯度）”。
      </div>

      <h2>代码示意：两层网络的一次前向 + 反向</h2>
      <pre><code>{`import numpy as np

# 两层网络：输入 2，隐藏 3，输出 1（回归）
W1 = np.random.randn(3, 2); b1 = np.zeros((3, 1))
W2 = np.random.randn(1, 3); b2 = np.zeros((1, 1))
relu = lambda z: np.maximum(0, z)

# —— 前向传播 ——
z1 = W1 @ x + b1
a1 = relu(z1)
y_hat = W2 @ a1 + b2
loss = np.mean((y_hat - y) ** 2)          # MSE

# —— 反向传播（MSE: dL/dy_hat = 2(y_hat-y)/m）——
dz2 = 2 * (y_hat - y) / m
dW2 = dz2 @ a1.T;  db2 = dz2.sum(1, keepdims=True)
da1 = W2.T @ dz2
dz1 = da1 * (z1 > 0)                       # ReLU 的导数
dW1 = dz1 @ x.T;   db1 = dz1.sum(1, keepdims=True)

# —— 参数更新（梯度下降）——
W1 -= lr * dW1;  b1 -= lr * db1
W2 -= lr * dW2;  b2 -= lr * db2`}
      </code></pre>

      <h2>梯度消失与梯度爆炸</h2>
      <p>
        当网络很深时，梯度在反向传播中会连乘多个因子。若每项绝对值都小于 1，梯度会迅速衰减到接近 0（<strong>梯度消失</strong>）；反之则可能指数放大（<strong>梯度爆炸</strong>）。这正是 ReLU、残差连接、归一化等技术要解决的核心难题。
      </p>
    </DocPage>
  )
}
