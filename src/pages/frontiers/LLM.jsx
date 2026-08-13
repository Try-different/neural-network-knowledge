import DocPage from '../../components/DocPage'

export default function LLM() {
  return (
    <DocPage
      title="大语言模型 LLM"
      meta="“预训练 + 对齐”范式催生的通用语言智能"
      refs={[
        <>Devlin, J., et al. (2018). <em>BERT: Pre-training of Deep Bidirectional Transformers</em>. NAACL. arXiv:1810.04805.</>,
        <>Brown, T., et al. (2020). <em>Language Models are Few-Shot Learners</em>. NeurIPS.（GPT-3）</>,
        <>Kaplan, J., et al. (2020). <em>Scaling Laws for Neural Language Models</em>. arXiv:2001.08361.</>,
        <>Ouyang, L., et al. (2022). <em>Training language models to follow instructions with human feedback</em>.（InstructGPT）arXiv:2203.02155.</>,
      ]}
    >
      <h2>范式：预训练 + 微调 / 对齐</h2>
      <p>
        大语言模型的崛起得益于一个简洁范式：先在海量无标注文本上<strong>自监督预训练</strong>，学习通用语言表示；再用少量标注数据<strong>微调</strong>或用人类反馈<strong>对齐</strong>，使其遵循人类意图。
      </p>

      <h2>三种 Transformer 架构</h2>
      <table>
        <thead><tr><th>类型</th><th>代表</th><th>预训练目标</th></tr></thead>
        <tbody>
          <tr><td>编码器 Encoder</td><td>BERT</td><td>掩码语言建模（完形填空）</td></tr>
          <tr><td>解码器 Decoder</td><td>GPT 系列</td><td>因果语言建模（预测下一个 token）</td></tr>
          <tr><td>编码-解码</td><td>T5 / BART</td><td>序列到序列（如 Span 损坏）</td></tr>
        </tbody>
      </table>
      <p>
        当代主流对话大模型（GPT、LLaMA 等）多采用<strong>解码器-only</strong>架构，统一为“预测下一个 token”的生成式范式。
      </p>

      <h2>Scaling Laws：越大越好</h2>
      <p>
        Kaplan 等（2020）发现，在算力、数据、参数三者的协调放大下，测试损失随规模呈<strong>幂律</strong>下降。这意味着只要持续投入规模，模型能力可稳步提升。后续研究（Chinchilla, 2022）进一步指出<strong>数据量与参数量应大致同步增长</strong>才能达到最优。
      </p>

      <h2>涌现能力</h2>
      <p>
        某些能力（如少样本学习、链式推理、代码生成）在模型规模较小时几乎不存在，越过某个阈值后<strong>涌现</strong>出来。这正是“大”模型区别于小模型的关键现象。
      </p>

      <h2>对齐：让模型有用且无害</h2>
      <p>
        预训练模型只会“续写文本”，未必遵循指令。对齐技术让模型变得可控：</p>
      <ul>
        <li><strong>监督微调（SFT）</strong>：用指令-回答数据微调。</li>
        <li><strong>人类反馈强化学习（RLHF）</strong>：用人类偏好训练奖励模型，再用 PPO 等优化策略（InstructGPT, 2022）。</li>
        <li><strong>DPO</strong>等直接偏好优化方法：跳过显式奖励模型，更简洁。</li>
      </ul>

      <div className="callout warn">
        <div className="title">未决问题</div>
        大模型仍面临幻觉（生成不实内容）、推理可靠性、安全对齐、高昂的推理与训练成本、数据版权等挑战，是当前研究的热点。
      </div>

      <div className="callout">
        <div className="title">说明</div>
        本节聚焦公开的范式与原理。各商业模型的最新参数、具体训练数据等多为未公开细节，此处不作臆测。
      </div>
    </DocPage>
  )
}
