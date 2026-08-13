import DocPage from '../../components/DocPage'
import ConvolutionDemo from '../../components/ConvolutionDemo'

export default function CNN() {
  return (
    <DocPage
      title="卷积神经网络 CNN"
      meta="处理网格数据（图像）的利器 · 局部连接 + 权重共享"
      refs={[
        <>LeCun, Y., et al. (1998). <em>Gradient-Based Learning Applied to Document Recognition</em>. Proceedings of the IEEE.</>,
        <>Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). <em>ImageNet Classification with Deep CNNs</em>. NeurIPS.</>,
        <>He, K., et al. (2016). <em>Deep Residual Learning for Image Recognition</em>. CVPR. arXiv:1512.03385.</>,
        <a href="https://zh.d2l.ai/chapter_convolutional-neural-networks/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 卷积神经网络</a>,
        <a href="https://cs231n.github.io/convolutional-networks/" target="_blank" rel="noreferrer">CS231n：Convolutional Neural Networks</a>,
      ]}
    >
      <h2>为什么要用卷积</h2>
      <p>
        全连接网络处理图像时，每个像素都连到下一层每个神经元，参数量爆炸且忽略了对图像至关重要的<strong>局部空间结构</strong>。卷积神经网络（CNN）借鉴视觉皮层机制，用两个核心思想大幅减少参数并保留空间信息：
      </p>
      <ul>
        <li><strong>局部连接</strong>：每个神经元只看输入的一小块区域（感受野）。</li>
        <li><strong>权重共享</strong>：同一卷积核在整张图上滑动，共享参数，平移等变。</li>
      </ul>

      <h2>卷积运算</h2>
      <p>
        一个<strong>卷积核（filter）</strong>在输入上滑动，逐位置做元素级乘加，得到<strong>特征图（feature map）</strong>。输出尺寸由下式决定：
      </p>
      <div className="math">W_out = ⌊(W + 2P − K) / S⌋ + 1</div>
      <p>其中 <code>K</code> 为卷积核大小，<code>P</code> 为填充（padding），<code>S</code> 为步长（stride）。</p>

      <pre><code>{`import numpy as np

def conv2d(x, k):
    """简易二维卷积（无 padding，stride=1）"""
    h, w = x.shape
    kh, kw = k.shape
    out = np.zeros((h - kh + 1, w - kw + 1))
    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            out[i, j] = np.sum(x[i:i+kh, j:j+kw] * k)
    return out`}
      </code></pre>

      <ConvolutionDemo />

      <h2>池化层</h2>
      <p>
        池化对特征图下采样，降低尺寸并带来一定平移不变性。最常用<strong>最大池化</strong>（取窗口内最大值），也有平均池化。池化无可学习参数。
      </p>

      <h2>感受野</h2>
      <p>
        某个输出位置能“看到”的原始输入区域大小称为<strong>感受野</strong>。层数越深、卷积核越大，感受野越大，网络就能捕捉更大尺度的结构。多层小卷积（如两层 3×3）可在更少参数下达到与单层大卷积（7×7）相同的感受野，这是 VGG 的关键洞察。
      </p>

      <h2>经典架构演进</h2>
      <table>
        <thead><tr><th>年份</th><th>网络</th><th>关键贡献</th></tr></thead>
        <tbody>
          <tr><td>1998</td><td>LeNet-5</td><td>首个成功的 CNN，用于手写数字识别</td></tr>
          <tr><td>2012</td><td>AlexNet</td><td>ReLU + GPU 训练，引爆深度学习</td></tr>
          <tr><td>2014</td><td>VGG</td><td>堆叠小卷积（3×3），结构统一</td></tr>
          <tr><td>2015</td><td>ResNet</td><td>残差连接，训练超深网络（上百层）</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <div className="title">残差连接（ResNet）</div>
        通过让某层学习<strong>残差 F(x)</strong> 而非完整映射，并引入跳跃连接 <code>h(x) = F(x) + x</code>，梯度可经捷径直接回传，使上百层的网络也能训练。残差思想后来被广泛用于 Transformer 等架构。
      </div>
    </DocPage>
  )
}
