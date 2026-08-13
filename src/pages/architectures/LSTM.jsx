import DocPage from '../../components/DocPage'

export default function LSTM() {
  return (
    <DocPage
      title="长短期记忆 LSTM"
      meta="用门控控制信息流的 RNN 变体 · 缓解长程依赖问题"
      refs={[
        <>Hochreiter, S., & Schmidhuber, J. (1997). <em>Long Short-Term Memory</em>. Neural Computation, 9(8):1735–1780.</>,
        <>Gers, F. A., Schmidhuber, J., & Cummins, F. (2000). <em>Learning to Forget: Continual Prediction with LSTM</em>. Neural Computation.</>,
        <a href="https://zh.d2l.ai/chapter_recurrent-modern/lstm.html" target="_blank" rel="noreferrer">《动手学深度学习》—— 长短期记忆网络（LSTM）</a>,
        <a href="https://colah.github.io/posts/2015-08-Understanding-LSTMs/" target="_blank" rel="noreferrer">Christopher Olah：Understanding LSTM Networks</a>,
      ]}
    >
      <h2>动机：记住该记的，忘掉该忘的</h2>
      <p>
        标准 RNN 难以保留长跨度信息。1997 年 Hochreiter 与 Schmidhuber 提出的 <strong>LSTM</strong>，引入一条贯穿整个序列的<strong>细胞状态</strong> <code>Cₜ</code>，并通过三个<strong>门</strong>（gate）精确控制信息的写入、保留与读出。门由 Sigmoid 输出 0~1，相当于“开关比例”。
      </p>

      <h2>三个门与一次更新</h2>
      <p>在每个时间步，LSTM 执行如下计算（<code>⊙</code> 为按元素乘）：</p>

      <div className="math">fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf) &nbsp;&nbsp;（遗忘门：丢弃多少旧记忆）</div>
      <div className="math">iₜ = σ(Wi·[hₜ₋₁, xₜ] + bi) &nbsp;&nbsp;（输入门：写入多少新信息）</div>
      <div className="math">gₜ = tanh(Wg·[hₜ₋₁, xₜ] + bg) &nbsp;（候选记忆）</div>
      <div className="math">Cₜ = fₜ ⊙ Cₜ₋₁ + iₜ ⊙ gₜ &nbsp;&nbsp;（更新细胞状态）</div>
      <div className="math">oₜ = σ(Wo·[hₜ₋₁, xₜ] + bo) &nbsp;&nbsp;（输出门：输出多少）</div>
      <div className="math">hₜ = oₜ ⊙ tanh(Cₜ) &nbsp;&nbsp;（隐状态）</div>

      <div className="callout">
        <div className="title">直觉理解</div>
        细胞状态 <code>Cₜ</code> 像一条传送带：遗忘门决定倒掉多少旧货，输入门决定装上多少新货，输出门决定取出多少展示。信息可在传送带上长期流动而不被频繁改写。
      </div>

      <h2>为什么能缓解梯度消失</h2>
      <p>
        细胞状态的梯度路径为 <code>Cₜ = fₜ ⊙ Cₜ₋₁ + ...</code>，梯度连乘项变成了<strong>可学习的遗忘门</strong> <code>fₜ</code>。当网络学会把 <code>fₜ</code> 维持在接近 1 时，梯度可以跨越多步几乎不衰减，从而捕捉长程依赖。
      </p>

      <h2>GRU：更精简的门控变体</h2>
      <p>
        <strong>GRU（Gated Recurrent Unit）</strong>（Cho 等，2014）将遗忘门与输入门合并为单一的<strong>更新门</strong>，并省去独立的细胞状态，参数更少、训练更快，在很多任务上效果与 LSTM 相当。
      </p>

      <pre><code>{`def lstm_step(x_t, h_prev, c_prev, params):
    Wf, Wi, Wg, Wo = params['Wf'], params['Wi'], params['Wg'], params['Wo']
    cat = np.concatenate([h_prev, x_t])
    f = sigmoid(Wf @ cat)     # 遗忘门
    i = sigmoid(Wi @ cat)     # 输入门
    g = np.tanh(Wg @ cat)     # 候选记忆
    c = f * c_prev + i * g    # 更新细胞状态
    o = sigmoid(Wo @ cat)     # 输出门
    h = o * np.tanh(c)        # 隐状态
    return h, c`}
      </code></pre>

      <div className="callout warn">
        <div className="title">现状</div>
        尽管门控 RNN 曾统治序列建模十余年，但在大规模并行与长序列场景下，已被基于注意力的 Transformer 大幅取代。LSTM 仍因其轻量、适合小数据或资源受限场景而被使用。
      </div>
    </DocPage>
  )
}
