import { useState, useMemo } from 'react'

const CLASSES = ['猫', '狗', '鸟']

function softmax(logits) {
  const mx = Math.max(...logits)
  const exps = logits.map((l) => Math.exp(l - mx))
  const sum = exps.reduce((s, v) => s + v, 0)
  return exps.map((e) => e / sum)
}

function crossEntropy(probs, trueIdx) {
  return -Math.log(probs[trueIdx] + 1e-12)
}

export default function SoftmaxViz() {
  const [logits, setLogits] = useState([2.0, 1.0, 0.1])
  const [trueIdx, setTrueIdx] = useState(0)

  const probs = useMemo(() => softmax(logits), [logits])
  const loss = useMemo(() => crossEntropy(probs, trueIdx), [probs, trueIdx])
  const maxP = Math.max(...probs)
  const predIdx = probs.indexOf(maxP)

  const W = 380
  const H = 230
  const barW = 70
  const gap = 24
  const baseY = 180
  const barH = 130

  return (
    <div className="demo">
      <h4>Softmax 与交叉熵：从分数到概率到损失</h4>
      <p className="desc">
        分类网络输出每个类的原始分数（logits），<strong>Softmax</strong> 将其转为概率分布（和为 1）；
        <strong>交叉熵</strong> 则衡量预测概率与真实标签的差距——真实类概率越高，损失越接近 0。
        拖动滑块调整各类的 logit，切换真实标签，观察概率与损失如何变化。
      </p>
      <div className="stage">
        <svg width={W} height={H}>
          {/* 基线 */}
          <line x1={20} y1={baseY} x2={W - 10} y2={baseY} stroke="var(--border)" />
          {/* 概率柱 */}
          {probs.map((p, i) => {
            const x = 40 + i * (barW + gap)
            const h = (p / 1) * barH
            const isTrue = i === trueIdx
            const isPred = i === predIdx
            return (
              <g key={i}>
                <rect x={x} y={baseY - barH} width={barW} height={barH} fill="var(--surface-2)" stroke="var(--border)" />
                <rect x={x} y={baseY - h} width={barW} height={h}
                  fill={isTrue ? 'var(--accent)' : 'var(--text-muted)'} opacity={0.85} />
                <text x={x + barW / 2} y={baseY + 16} textAnchor="middle" fontSize={13} fill="var(--text-h)">{CLASSES[i]}</text>
                <text x={x + barW / 2} y={baseY - h - 6} textAnchor="middle" fontSize={11} fill="var(--text-h)" fontWeight={600}>
                  {(p * 100).toFixed(1)}%
                </text>
                {isTrue && <text x={x + barW / 2} y={baseY + 30} textAnchor="middle" fontSize={10} fill="var(--accent)">真实标签</text>}
                {isPred && !isTrue && <text x={x + barW / 2} y={baseY + 30} textAnchor="middle" fontSize={10} fill="var(--text-muted)">预测最高</text>}
                {isPred && isTrue && <text x={x + barW / 2} y={baseY + 42} textAnchor="middle" fontSize={10} fill="var(--accent)">✓ 预测正确</text>}
                {isPred && !isTrue && <text x={x + barW / 2} y={baseY + 42} textAnchor="middle" fontSize={10} fill="var(--warn)">✗ 预测错误</text>}
              </g>
            )
          })}
        </svg>
        <div className="panel">
          <div className="stat">交叉熵损失 L = <b>{loss.toFixed(3)}</b></div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            L = −log P({CLASSES[trueIdx]}) = −log({probs[trueIdx].toFixed(3)})
          </div>
          {logits.map((lg, i) => (
            <div className="row" key={i}>
              <span style={{ width: 50 }}>{CLASSES[i]} logit</span>
              <input type="range" min={-3} max={5} step={0.1} value={lg}
                onChange={(e) => { const n = [...logits]; n[i] = parseFloat(e.target.value); setLogits(n) }} />
              <b>{lg.toFixed(1)}</b>
            </div>
          ))}
          <div className="ctrl">
            <span style={{ fontSize: 13, color: 'var(--text)' }}>真实标签：</span>
            {CLASSES.map((c, i) => (
              <button key={i} className={trueIdx === i ? 'primary' : ''} onClick={() => setTrueIdx(i)}>{c}</button>
            ))}
          </div>
          <button onClick={() => setLogits([2.0, 1.0, 0.1])}>重置</button>
        </div>
      </div>
    </div>
  )
}
