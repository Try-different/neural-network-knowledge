import DocPage from '../../components/DocPage'

export default function Transformer() {
  return (
    <DocPage
      title="Transformer"
      meta="完全基于注意力的并行序列模型 · 当代大模型的基石"
      refs={[
        <>Vaswani, A., et al. (2017). <em>Attention Is All You Need</em>. NeurIPS. arXiv:1706.03762.</>,
        <a href="https://jalammar.github.io/illustrated-transformer/" target="_blank" rel="noreferrer">Jay Alammar：The Illustrated Transformer</a>,
        <a href="https://nlp.seas.harvard.edu/annotated-transformer/" target="_blank" rel="noreferrer">The Annotated Transformer（哈佛 NLP 组）</a>,
        <a href="https://zh.d2l.ai/chapter_attention-mechanisms-and-transformers/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 注意力机制与 Transformer</a>,
      ]}
    >
      <h2>抛弃循环，只用注意力</h2>
      <p>
        2017 年 Vaswani 等人在《Attention Is All You Need》中提出 Transformer，完全摒弃 RNN 的循环结构，仅靠<strong>自注意力</strong>建模序列内任意两位置的关系。由于计算可并行，训练效率远超 RNN，成为 BERT、GPT 等大模型的基础。
      </p>

      <h2>缩放点积注意力</h2>
      <p>
        输入被线性映射为<strong>查询 Q、键 K、值 V</strong>，注意力通过 Q 与 K 的点积衡量相关性，对 V 加权求和：
      </p>
      <div className="math">Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V</div>
      <p>
        除以 <code>√dₖ</code> 是为了防止点积过大导致 softmax 进入饱和区、梯度消失。<strong>自注意力</strong>指 Q、K、V 均来自同一序列。
      </p>

      <h2>多头注意力</h2>
      <p>
        将 Q/K/V 投影到多个子空间分别做注意力，再拼接，使模型能同时关注不同位置、不同语义关系：
      </p>
      <div className="math">MultiHead = Concat(head₁, …, headₕ) · W_O</div>

      <h2>整体结构</h2>
      <ul>
        <li><strong>位置编码</strong>：由于无循环也无卷积，需显式注入顺序信息（常用 sin/cos 编码）。</li>
        <li><strong>编码器</strong>：多层堆叠，每层 = 多头注意力 + 残差连接 + LayerNorm + 前馈网络（FFN）。</li>
        <li><strong>解码器</strong>：额外有带掩码的自注意力（防止看到未来 token）与交叉注意力。</li>
      </ul>

      <pre><code>{`import numpy as np

def attention(Q, K, V):
    d_k = K.shape[-1]
    scores = Q @ K.transpose(0, 2, 1) / np.sqrt(d_k)
    weights = softmax(scores, axis=-1)   # softmax(QKᵀ/√dₖ)
    return weights @ V

# 多头：将 Q/K/V 按头拆分，分别注意力后拼接
# FFN：两层线性 + ReLU/GELU
# 每个子层都接残差连接与 LayerNorm`}
      </code></pre>

      <h2>为什么 Transformer 胜出</h2>
      <ul>
        <li><strong>并行</strong>：所有位置同时计算，充分利用 GPU，训练快。</li>
        <li><strong>长程依赖</strong>：任意两位置路径长度为 O(1)，不像 RNN 需逐步传递。</li>
        <li><strong>可扩展</strong>：参数规模与数据规模可同步放大，催生大模型时代。</li>
      </ul>

      <div className="callout">
        <div className="title">代价</div>
        自注意力对序列长度是 O(n²) 的计算与内存开销，处理超长序列时成本高昂。后续的稀疏注意力、线性注意力（如 FlashAttention、Longformer 等）正是为缓解这一问题而生。
      </div>
    </DocPage>
  )
}
