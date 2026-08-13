import { useState, useMemo } from 'react'

const N = 16 // 序列长度
const CELL = 20

function pe(pos, i, d) {
  const k = Math.floor(i / 2)
  const denom = Math.pow(10000, (2 * k) / d)
  return i % 2 === 0 ? Math.sin(pos / denom) : Math.cos(pos / denom)
}
function color(v) {
  return v >= 0 ? `rgba(8,145,178,${v * 0.85})` : `rgba(217,119,6,${-v * 0.85})`
}

export default function PositionalEncodingViz() {
  const [d, setD] = useState(16)
  const mat = useMemo(() => {
    const m = []
    for (let pos = 0; pos < N; pos++) {
      const row = []
      for (let i = 0; i < d; i++) row.push(pe(pos, i, d))
      m.push(row)
    }
    return m
  }, [d])
  const W = d * CELL + 40

  return (
    <div className="demo">
      <h4>位置编码热力图</h4>
      <p className="desc">
        Transformer 没有循环结构，需显式注入位置信息。经典做法用 sin/cos 函数：
        偶数维 sin(pos / 10000^(2i/d))，奇数维 cos(...)。每一行是一个位置（从上到下 0→{N - 1}），
        每一列是一个维度，颜色表示编码值（青为正、橙为负）。注意低维变化快、高维变化慢——这让模型能同时感知局部与全局位置。
      </p>
      <div className="stage">
        <svg width={W} height={N * CELL + 10}>
          {mat.map((row, pos) =>
            row.map((v, i) => (
              <rect key={`${pos}-${i}`} x={30 + i * CELL} y={pos * CELL} width={CELL} height={CELL} fill={color(v)} stroke="var(--border)" strokeWidth={0.5} />
            ))
          )}
          {mat.map((_, pos) => (
            <text key={pos} x={26} y={pos * CELL + 14} fontSize={9} textAnchor="end">{pos}</text>
          ))}
        </svg>
        <div className="panel">
          <div className="stat">维度 d = <b>{d}</b> · 序列长 {N}</div>
          <div className="row">
            <span>维度 d</span>
            <input type="range" min={8} max={32} step={8} value={d} onChange={(e) => setD(parseInt(e.target.value))} />
            <b>{d}</b>
          </div>
          <div className="legend" style={{ marginTop: 6 }}>
            <div><i style={{ background: 'rgba(8,145,178,0.85)' }} />正值 (+1)</div>
            <div><i style={{ background: 'rgba(217,119,6,0.85)' }} />负值 (−1)</div>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            同一位置在不同维度有不同周期的正余弦，形成多尺度位置表示——类似用不同精度的「刻度」同时标记位置。
          </div>
        </div>
      </div>
    </div>
  )
}
