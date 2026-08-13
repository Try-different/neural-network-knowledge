import { useState, useMemo } from 'react'

const TOKENS = [
  { word: '学习', logit: 2.5 },
  { word: '深度', logit: 1.8 },
  { word: '训练', logit: 1.2 },
  { word: '模型', logit: 0.5 },
  { word: '数据', logit: -0.3 },
]

function softmax(logits, temp) {
  const zs = logits.map((l) => l / temp)
  const mx = Math.max(...zs)
  const exps = zs.map((z) => Math.exp(z - mx))
  const sum = exps.reduce((s, v) => s + v, 0)
  return exps.map((e) => e / sum)
}

export default function LLMViz() {
  const [temp, setTemp] = useState(1.0)
  const probs = useMemo(() => softmax(TOKENS.map((t) => t.logit), temp), [temp])
  const maxP = Math.max(...probs)
  const argmax = probs.indexOf(maxP)

  return (
    <div className="demo">
      <h4>温度采样：控制生成的随机性</h4>
      <p className="desc">
        大模型预测下一个 token 时输出每个词的分数（logits），经 softmax 转成概率。除以「温度」T 后再 softmax：
        T 越小，概率越集中（趋向 argmax，输出确定、保守）；T 越大，概率越平均（输出多样、随机，甚至出错）。
        拖动温度，看概率分布如何从「尖锐」变「平坦」。
      </p>
      <div className="stage">
        <svg width={360} height={240}>
          {TOKENS.map((tk, i) => {
            const bh = (probs[i] / maxP) * 160
            const bw = 50
            const x = 30 + i * 64
            const y = 200 - bh
            return (
              <g key={i}>
                <rect x={x} y={40} width={bw} height={160} fill="var(--surface-2)" stroke="var(--border)" />
                <rect x={x} y={y} width={bw} height={bh} fill={i === argmax ? 'var(--accent)' : 'var(--text-muted)'} opacity={0.85} />
                <text x={x + bw / 2} y={210} textAnchor="middle" fontSize={13} fill="var(--text-h)">{tk.word}</text>
                <text x={x + bw / 2} y={225} textAnchor="middle" fontSize={10}>{(probs[i] * 100).toFixed(1)}%</text>
                {i === argmax && <text x={x + bw / 2} y={32} textAnchor="middle" fontSize={10} fill="var(--accent)">↑最可能</text>}
              </g>
            )
          })}
        </svg>
        <div className="panel">
          <div className="stat">温度 T = <b>{temp.toFixed(2)}</b></div>
          <div className="row">
            <span>温度</span>
            <input type="range" min={0.1} max={3} step={0.05} value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} />
            <b>{temp.toFixed(2)}</b>
          </div>
          <div className="ctrl">
            <button onClick={() => setTemp(0.3)}>低温 0.3</button>
            <button className={temp === 1 ? 'active' : ''} onClick={() => setTemp(1)}>标准 1.0</button>
            <button onClick={() => setTemp(2)}>高温 2.0</button>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            {temp < 0.6 && '低温：概率集中，模型几乎总选最高分词，输出确定但保守。'}
            {temp >= 0.6 && temp <= 1.4 && '标准温度：平衡的多样性，是常用默认。'}
            {temp > 1.4 && '高温：概率趋平均，输出多样、有创意，但也更易出错。'}
          </div>
        </div>
      </div>
    </div>
  )
}
