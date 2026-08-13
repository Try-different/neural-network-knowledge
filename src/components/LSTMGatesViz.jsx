import { useState, useEffect } from 'react'

const SEQ = [1, 0, -1, 0, 1, 0, 1, 0]
const T = SEQ.length
const sig = (x) => 1 / (1 + Math.exp(-x))
const W = {
  f: { x: 2.0, h: 0.5, b: 0.5 },
  i: { x: 1.5, h: -0.3, b: -1 },
  g: { x: 2.0, h: 0.2, b: 0 },
  o: { x: 0.5, h: 1.0, b: -0.5 },
}

function computeSteps() {
  const steps = []
  let h = 0, c = 0
  for (const x of SEQ) {
    const f = sig(W.f.x * x + W.f.h * h + W.f.b)
    const i = sig(W.i.x * x + W.i.h * h + W.i.b)
    const g = Math.tanh(W.g.x * x + W.g.h * h + W.g.b)
    const o = sig(W.o.x * x + W.o.h * h + W.o.b)
    c = f * c + i * g
    h = o * Math.tanh(c)
    steps.push({ x, f, i, g, o, c, h })
  }
  return steps
}
const STEPS = computeSteps()

const CELLW = 95, BARW = 14, BASEY = 150, BARH = 60

export default function LSTMGatesViz() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setT((p) => {
        if (p >= T) { setPlaying(false); return T }
        return p + 1
      })
    }, 700)
    return () => clearInterval(id)
  }, [playing])

  const reset = () => { setT(0); setPlaying(false) }
  const gates = [
    { key: 'f', name: '遗忘门 f', color: '#ef4444' },
    { key: 'i', name: '输入门 i', color: 'var(--accent)' },
    { key: 'o', name: '输出门 o', color: 'var(--warn)' },
  ]

  return (
    <div className="demo">
      <h4>LSTM 门控动画</h4>
      <p className="desc">
        每个时间步，三个门（遗忘/输入/输出，取值 0~1）决定信息的保留、写入与读出，细胞状态 Cₜ = fₜ·Cₜ₋₁ + iₜ·gₜ 像传送带般累积记忆。
        注意输入为 0 时遗忘门仍保持较高值以保留旧记忆，输入非零时输入门打开写入新信息，细胞状态随之变化。
      </p>
      <div style={{ overflowX: 'auto' }}>
        <svg width={T * CELLW + 30} height={210}>
          {STEPS.map((s, i) => {
            const shown = i < t
            const cx = 15 + i * CELLW
            return (
              <g key={i} opacity={shown || t === T ? 1 : 0.35}>
                {gates.map((g, gi) => {
                  const v = s[g.key]
                  const bx = cx + 10 + gi * (BARW + 2)
                  return (
                    <g key={g.key}>
                      <rect x={bx} y={BASEY - BARH} width={BARW} height={BARH} fill="var(--surface-2)" stroke="var(--border)" />
                      <rect x={bx} y={BASEY - v * BARH} width={BARW} height={v * BARH} fill={g.color} />
                      <text x={bx + BARW / 2} y={BASEY + 12} fontSize={8} textAnchor="middle">{v.toFixed(1)}</text>
                    </g>
                  )
                })}
                <text x={cx + 42} y={BASEY - BARH - 8} fontSize={11} textAnchor="middle" fill={s.c >= 0 ? 'var(--accent)' : 'var(--warn)'}>C={s.c.toFixed(2)}</text>
                <text x={cx + 42} y={172} fontSize={9} textAnchor="middle">t{i + 1}</text>
                <rect x={cx} y={180} width={CELLW - 10} height={24} rx={5} fill={shown ? 'var(--accent-soft)' : 'var(--surface-2)'} stroke="var(--border)" />
                <text x={cx + (CELLW - 10) / 2} y={196} textAnchor="middle" fontSize={12} fill="var(--text-h)">x={s.x}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="legend" style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
        {gates.map((g) => (
          <span key={g.key}><i style={{ background: g.color }} />{g.name}</span>
        ))}
      </div>
      <div className="ctrl" style={{ marginTop: 10 }}>
        <button className="primary" onClick={() => { if (t >= T) reset(); setPlaying((p) => !p) }}>{playing ? '暂停' : '播放'}</button>
        <button onClick={() => setT((p) => Math.min(T, p + 1))}>下一步</button>
        <button onClick={reset}>重置</button>
      </div>
      <div className="stat" style={{ marginTop: 8 }}>
        时间步 t = <b>{t}</b> / {T}
        {t > 0 && t <= T && <> · 当前 Cₜ = <b>{STEPS[t - 1].c.toFixed(2)}</b>，hₜ = <b>{STEPS[t - 1].h.toFixed(2)}</b></>}
      </div>
    </div>
  )
}
