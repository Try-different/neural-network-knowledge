import { useState, useMemo } from 'react'

// 固定一批激活值（均值约 2，标准差约 1.5）
const DATA = (() => {
  let s = 12345
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const arr = []
  for (let i = 0; i < 40; i++) {
    let sum = 0
    for (let j = 0; j < 12; j++) sum += rand()
    arr.push(2 + 1.5 * (sum - 6))
  }
  return arr
})()
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length
const std = (a) => {
  const m = mean(a)
  return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length)
}
const MU = mean(DATA), SD = std(DATA)

const W = 180, H = 150, PAD = 20, BINS = 9
const RANGE = [-5, 9]

function Hist({ data, color, title }) {
  const [lo, hi] = RANGE
  const counts = new Array(BINS).fill(0)
  for (const v of data) {
    if (v < lo || v > hi) continue
    const idx = Math.min(BINS - 1, Math.floor(((v - lo) / (hi - lo)) * BINS))
    counts[idx]++
  }
  const maxC = Math.max(...counts, 1)
  const bw = (W - 2 * PAD) / BINS
  return (
    <div>
      <div className="stat" style={{ marginBottom: 4, fontSize: 12 }}>{title}</div>
      <svg width={W} height={H}>
        {counts.map((c, i) => (
          <rect
            key={i}
            x={PAD + i * bw}
            y={H - PAD - (c / maxC) * (H - 2 * PAD)}
            width={bw - 1}
            height={(c / maxC) * (H - 2 * PAD)}
            fill={color}
            opacity={0.8}
          />
        ))}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" />
        <text x={sx0(0)} y={H - PAD + 12} fontSize={9} textAnchor="middle">0</text>
      </svg>
    </div>
  )
}
const sx0 = (v) => PAD + ((v - RANGE[0]) / (RANGE[1] - RANGE[0])) * (W - 2 * PAD)

export default function BatchNormViz() {
  const [gamma, setGamma] = useState(1)
  const [beta, setBeta] = useState(0)
  const norm = useMemo(() => DATA.map((x) => (x - MU) / SD), [])
  const scaled = useMemo(() => norm.map((x) => gamma * x + beta), [norm, gamma, beta])
  const sMean = mean(scaled), sStd = std(scaled)

  return (
    <div className="demo">
      <h4>批归一化过程</h4>
      <p className="desc">
        一批激活值（原始分布偏移，均值 {MU.toFixed(1)}、标准差 {SD.toFixed(1)}）经过三步：
        ① 减均值 ② 除标准差（标准化为均值 0、方差 1）③ 乘 γ 加 β（可学习的缩放与平移）。
        调节 γ 与 β，看最终分布如何被重新塑造——这正是 BN「不损失表达能力」的来源。
      </p>
      <div className="stage">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Hist data={DATA} color="var(--text-muted)" title={`① 原始 μ=${MU.toFixed(1)} σ=${SD.toFixed(1)}`} />
          <Hist data={norm} color="var(--accent)" title="② 标准化 μ=0 σ=1" />
          <Hist data={scaled} color="var(--warn)" title={`③ 缩放平移 μ=${sMean.toFixed(1)} σ=${sStd.toFixed(1)}`} />
        </div>
        <div className="panel">
          <div className="row">
            <span>缩放 γ</span>
            <input type="range" min={0.3} max={2.5} step={0.05} value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))} />
            <b>{gamma.toFixed(2)}</b>
          </div>
          <div className="row">
            <span>平移 β</span>
            <input type="range" min={-3} max={3} step={0.1} value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))} />
            <b>{beta.toFixed(2)}</b>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            γ 改变分布宽度（标准差 = γ），<br />β 改变分布位置（均值 = β）。<br />
            γ=1、β=0 时第三步等于第二步。
          </div>
        </div>
      </div>
    </div>
  )
}
