import DocPage from '../../components/DocPage'
import NeuralNetworkViz from '../../components/NeuralNetworkViz'
import XORDemo from '../../components/XORDemo'
import Term from '../../components/Term'

export default function Neuron() {
  return (
    <DocPage
      title="神经元与感知机"
      meta="人工神经元的基本模型 · MP 神经元 → 感知机 → 多层感知机"
      refs={[
        <>McCulloch, W. S., & Pitts, W. (1943). <em>A Logical Calculus of the Ideas Immanent in Nervous Activity</em>. Bulletin of Mathematical Biology.</>,
        <>Rosenblatt, F. (1958). <em>The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain</em>. Psychological Review.</>,
        <>Minsky, M., & Papert, S. (1969). <em>Perceptrons: An Introduction to Computational Geometry</em>. MIT Press.</>,
        <a href="https://zh.d2l.ai/chapter_multilayer-perceptrons/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 多层感知机（d2l.ai）</a>,
        <a href="https://www.3blue1brown.com/topics/neural-networks" target="_blank" rel="noreferrer">3Blue1Brown：神经网络系列</a>,
      ]}
    >
      <h2>从生物神经元到数学模型</h2>
      <p>
        生物神经元通过树突接收来自其他神经元的信号，在细胞体内汇总；当总信号超过一定阈值时，神经元被“激活”，沿轴突向下游输出。1943 年，McCulloch 与 Pitts 将这一过程抽象为第一个<strong>人工神经元模型（MP 神经元）</strong>：对输入加权求和，再通过一个阈值函数决定输出。
      </p>

      <div className="math">z = Σᵢ wᵢ · xᵢ + b &nbsp;&nbsp;→&nbsp;&nbsp; a = f(z)</div>

      <p>
        其中 <code>xᵢ</code> 是输入，<code>wᵢ</code> 是对应的<Term>权重</Term>（衡量该输入的重要性），<code>b</code> 是<Term>偏置</Term>（调节激活阈值），<code>f</code> 是<Term>激活函数</Term>。权重和偏置就是神经网络需要从数据中学习的参数。
      </p>

      <div className="callout">
        <div className="title">直觉理解</div>
        把神经元想象成一个“加权投票器”：每个输入是一张选票，权重是票的分量，偏置是放票箱的高低——只有当加权和越过门槛，神经元才会“投赞成票”。
      </div>

      <h2>感知机：第一个可学习的神经元</h2>
      <p>
        1958 年，Rosenblatt 提出<strong>感知机（Perceptron）</strong>，在 MP 神经元基础上引入了参数学习规则。感知机是一个二分类器，输出：
      </p>
      <div className="math">ŷ = sign(w · x + b)</div>
      <p>
        当预测错误时，按 <code>w ← w + η(y − ŷ)x</code> 更新权重。可以证明，若数据线性可分，感知机必能收敛。
      </p>

      <h3>感知机的局限：异或问题</h3>
      <p>
        1969 年，Minsky 与 Papert 在《Perceptrons》一书中指出：单层感知机无法表达<strong>异或（XOR）</strong>这类线性不可分函数。这一结论一度让神经网络研究陷入低谷，直到多层网络与反向传播算法的提出才打破僵局。
      </p>

      <XORDemo />

      <h2>多层感知机（MLP）</h2>
      <p>
        在输入层与输出层之间加入一个或多个<strong>隐藏层</strong>，并用非线性激活函数，网络就能逼近任意复杂的函数关系（通用近似定理）。下图展示了一个全连接网络的结构，可以交互调节层数与每层神经元数。
      </p>

      <NeuralNetworkViz initial={[3, 4, 4, 2]} />

      <div className="callout warn">
        <div className="title">关键点</div>
        若所有层之间都只用线性变换、没有非线性激活，那么无论叠加多少层，整体仍等价于一个线性模型——这正是激活函数不可或缺的原因。
      </div>

      <h2>本章小结</h2>
      <ul>
        <li>神经元 = 加权求和 + 偏置 + 激活函数。</li>
        <li>权重与偏置是可学习参数；感知机是最早的可学习神经元。</li>
        <li>单层感知机只能解决线性可分问题；多层 + 非线性激活才能处理复杂任务。</li>
      </ul>
    </DocPage>
  )
}
