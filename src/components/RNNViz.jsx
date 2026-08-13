import { useState, useEffect } from 'react'

const SEQS = {
  上升: [0.2, 0.4, 0.6, 0.8, 1.0],
  振荡: [0.9, -0.9, 0.9, -0.9, 0.9],
  脉冲: [0, 0, 1, 0, 0],
}
const H = 4
const Wx = [0.8, -0.5, 0.6, 0.3]
const Wh = [
  [0.4, -0.3, 0.2, 0.5],
  [-0.2, 0.6, -0.4, 0.3],
  [0.3, 0.2, -0.5, 0.4],
  [-0.4, 0.3, 0.5, -0.2],
]

function computeHs(seq) {
  const hs = [[0, 0, 0, 0]]
  let h = [0, 0, 0, 0]
  for (const x of seq) {
    const nh = []
    for (let i = 0; i < H; i++) {
      let s = Wx[i] * x
      for (let j = 0; j < H; j++) s += Wh[i][j] * h[j]
      nh.push(Math.tanh(s))
    }
    h = nh
    hs.push(h)
  }
  return hs
}

const CELLW = 110, BARW = 16, MIDY = 120

export default function RNNViz() {
  const [seqName, setSeqName] = useState('上升')
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const seq = SEQS[seqName]
  const hs = computeHs(seq)
  const T = seq.length

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setT((p) => {
        if (p >= T) { setPlaying(false); return T }
        return p + 1
      })
    }, 650)
    return () => clearInterval(id)
  }, [playing, T])

  const reset = () => { setT(0); setPlaying(false) }
  const curH = hs[Math.min(t, T)]

  return (
    <div className="demo">
      <h4>RNN 时序展开</h4>
      <p className="desc">
        RNN 沿时间展开：每个时间步读取输入 xₜ，与上一步隐状态 hₜ₋₁ 共同算出 hₜ = tanh(Wₓ·xₜ + Wₕ·hₜ₋₁)，同一组权重在所有时间步共享。
        下方展示隐状态 4 个分量（青为正、橙为负）如何随输入序列演变——注意 hₜ 会「记住」之前的信息。
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={T * CELLW + 30} height={210}>
          <defs>
            <marker id="rnnarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--text-muted)" />
            </marker>
          </defs>
          {seq.map((x, i) => {
            const h = hs[i + 1]
            const shown = i < t
            const cx = 15 + i * CELLW
            return (
              <g key={i} opacity={shown || t === T ? 1 : 0.35}>
                {i < T - 1 && (
                  <line x1={cx + CELLW - 12} y1={MIDY} x2={cx + CELLW} y2={MIDY} stroke="var(--text-muted)" markerEnd="url(#rnnarr)" />
                )}
                <text x={cx + 48} y={70} textAnchor="middle" fontSize={11} fill="var(--text-muted)">h{i + 1}</text>
                {h.map((v, k) => {
                  const bx = cx + 18 + k * (BARW + 2)
                  const bh = Math.abs(v) * 40
                  return (
                    <g key={k}>
                      <rect x={bx} y={MIDY - 40} width={BARW} height={80} fill="var(--surface-2)" stroke="var(--border)" />
                      <rect x={bx} y={v >= 0 ? MIDY - bh : MIDY} width={BARW} height={bh} fill={v >= 0 ? 'var(--accent)' : 'var(--warn)'} />
                    </g>
                  )
                })}
                <rect x={cx} y={165} width={CELLW - 12} height={32} rx={6} fill={shown ? 'var(--accent-soft)' : 'var(--surface-2)'} stroke="var(--border)" />
                <text x={cx + (CELLW - 12) / 2} y={186} textAnchor="middle" fontSize={13} fill="var(--text-h)">x={x.toFixed(1)}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="ctrl" style={{ marginTop: 10 }}>
        <button className="primary" onClick={() => { if (t >= T) reset(); setPlaying((p) => !p) }}>{playing ? '暂停' : '播放'}</button>
        <button onClick={() => setT((p) => Math.min(T, p + 1))}>下一步</button>
        <button onClick={reset}>重置</button>
      </div>
      <div className="row" style={{ marginTop: 10 }}>输入序列：</div>
      <div className="ctrl">
        {Object.keys(SEQS).map((n) => (
          <button key={n} className={seqName === n ? 'active' : ''} onClick={() => { setSeqName(n); reset() }}>{n}</button>
        ))}
      </div>
      <div className="stat" style={{ marginTop: 8 }}>
        时间步 t = <b>{t}</b> / {T} · hₜ = [{curH.map((v) => v.toFixed(2)).join(', ')}]
      </div>
    </div>
  )
}
