import DocPage from '../../components/DocPage'
import AttentionHeatmap from '../../components/AttentionHeatmap'

export default function Attention() {
  return (
    <DocPage
      title="注意力机制 Attention"
      meta="让模型动态聚焦于相关信息 · 从 Bahdanau 到自注意力"
      refs={[
        <>Bahdanau, D., Cho, K., & Bengio, Y. (2014). <em>Neural Machine Translation by Jointly Learning to Align and Translate</em>. ICLR 2015. arXiv:1409.0473.</>,
        <>Vaswani, A., et al. (2017). <em>Attention Is All You Need</em>. NeurIPS. arXiv:1706.03762.</>,
        <a href="https://zh.d2l.ai/chapter_attention-mechanisms/index.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 注意力机制</a>,
        <a href="https://lilianweng.github.io/posts/2018-06-24-attention/" target="_blank" rel="noreferrer">Lilian Weng：Attention? Attention!（综述）</a>,
      ]}
    >
      <h2>起源：突破 seq2seq 的瓶颈</h2>
      <p>
        早期的编码器-解码器模型把整个输入序列压缩成一个固定长度的向量，长序列信息严重丢失。2014 年 Bahdanau 等人提出<strong>注意力机制</strong>，让解码器在每一步动态“关注”输入序列的不同位置，大幅提升机器翻译质量。
      </p>

      <h2>一般形式</h2>
      <p>
        给定查询 <code>Q</code> 和一组键值对 <code>(K, V)</code>，注意力先用打分函数衡量 Q 与每个 K 的相关度，归一化为权重后对 V 加权求和：
      </p>
      <div className="math">Attention(Q, K, V) = Σᵢ softmax(score(Q, Kᵢ)) · Vᵢ</div>
      <p>常见打分函数：</p>
      <ul>
        <li><strong>加性注意力</strong>：<code>vᵀ tanh(W₁q + W₂k)</code>（Bahdanau 使用）。</li>
        <li><strong>点积注意力</strong>：<code>q·k</code>，计算高效（Transformer 使用其缩放版本）。</li>
      </ul>

      <AttentionHeatmap />

      <h2>自注意力 Self-Attention</h2>
      <p>
        当 Q、K、V 均来自同一序列时，称为<strong>自注意力</strong>。它让序列中任意两个位置直接交互，路径长度为 O(1)，是 Transformer 的核心。Transformer 采用<strong>缩放点积注意力</strong>：
      </p>
      <div className="math">Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V</div>

      <h2>多头注意力</h2>
      <p>
        将 Q/K/V 投影到 <code>h</code> 个子空间分别做注意力再拼接，使模型能同时建模多种关系（如语法依赖、语义共指等）。每个“头”可以关注不同的子空间结构。
      </p>

      <div className="callout">
        <div className="title">为什么注意力如此重要</div>
        注意力机制解除了序列模型的逐步传递约束，实现了并行计算与长程依赖的直接建模，是当代大模型能力跃升的关键基石。
      </div>
    </DocPage>
  )
}
