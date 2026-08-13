import { useState, useRef, useEffect } from 'react'

// 同一损失曲面 f = x² + 9y²（狭长椭圆，y 方向更陡）
const f = (x, y) => x * x + 9 * y * y
const grad = (x, y) => [2 * x, 18 * y]

const W = 460, H = 340, PAD = 28
const XR = [-3, 3], YR = [-2, 2]
const sx = (x) => PAD + ((x - XR[0]) / (XR[1] - XR[0])) * (W - 2 * PAD)
const sy = (y) => H - PAD - ((y - YR[0]) / (YR[1] - YR[0])) * (H - 2 * PAD)

const START = [2.3, 1.5]
const OPTS = [
  { key: 'SGD', color: '#ef4444' },
  { key: 'Momentum', color: 'var(--accent)' },
  { key: 'RMSprop', color: 'var(--warn)' },
  { key: 'Adam', color: 'var(--ok)' },
]

function freshStates() {
  const base = () => ({ x: START[0], y: START[1], vx: 0, vy: 0, sx: 0, sy: 0, mx: 0, my: 0, v2x: 0, v2y: 0, hist: [[START[0], START[1]]], done: null })
  const o = {}
  OPTS.forEach((op) => (o[op.key] = base()))
  return o
}

function stepOne(states, lr, t) {
  const next = {}
  for (const op of OPTS) {
    const o = { ...states[op.key] }
    o.hist = states[op.key].hist.slice()
    if (o.done) { next[op.key] = o; continue }
    const [gx, gy] = grad(o.x, o.y)
    let dx, dy
    if (op.key === 'SGD') {
      dx = lr * gx; dy = lr * gy
    } else if (op.key === 'Momentum') {
      o.vx = 0.9 * o.vx + gx; o.vy = 0.9 * o.vy + gy
      dx = lr * o.vx; dy = lr * o.vy
    } else if (op.key === 'RMSprop') {
      o.sx = 0.9 * o.sx + 0.1 * gx * gx; o.sy = 0.9 * o.sy + 0.1 * gy * gy
      dx = (lr * gx) / (Math.sqrt(o.sx) + 1e-8); dy = (lr * gy) / (Math.sqrt(o.sy) + 1e-8)
    } else {
      o.mx = 0.9 * o.mx + 0.1 * gx; o.my = 0.9 * o.my + 0.1 * gy
      o.v2x = 0.999 * o.v2x + 0.001 * gx * gx; o.v2y = 0.999 * o.v2y + 0.001 * gy * gy
      const mhx = o.mx / (1 - Math.pow(0.9, t)), mhy = o.my / (1 - Math.pow(0.9, t))
      const vhx = o.v2x / (1 - Math.pow(0.999, t)), vhy = o.v2y / (1 - Math.pow(0.999, t))
      dx = (lr * mhx) / (Math.sqrt(vhx) + 1e-8); dy = (lr * mhy) / (Math.sqrt(vhy) + 1e-8)
    }
    o.x -= dx; o.y -= dy
    o.hist.push([o.x, o.y])
    if (!isFinite(o.x) || !isFinite(o.y) || Math.abs(o.x) > 8 || Math.abs(o.y) > 8) o.done = 'div'
    else if (f(o.x, o.y) < 1e-3) o.done = 'conv'
    next[op.key] = o
  }
  return next
}

export default function OptimizerComparison() {
  const [lr, setLr] = useState(0.09)
  const [states, setStates] = useState(freshStates)
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const stRef = useRef(states)
  stRef.current = states
  const stepRef = useRef(step)
  stepRef.current = step

  const reset = () => {
    setStates(freshStates())
    setStep(0)
    setPlaying(false)
  }

  const tick = () => {
    const t = stepRef.current + 1
    const ns = stepOne(stRef.current, lr, t)
    stRef.current = ns
    setStates(ns)
    setStep(t)
    if (OPTS.every((op) => ns[op.key].done)) setPlaying(false)
  }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(tick, 140)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, lr])

  return (
    <div className="demo">
      <h4>优化器对比</h4>
      <p className="desc">
        四种优化器从同一起点出发，在同一狭长损失曲面（y 方向更陡）上奔跑。
        注意 SGD 在陡峭方向上来回震荡，而带自适应学习率的 RMSprop / Adam 会自动缩短陡峭方向的步长，更稳更快地收敛。
      </p>
      <div className="stage">
        <svg width={W} height={H} style={{ background: 'var(--bg-soft)', borderRadius: 10 }}>
          {[0.3, 0.8, 1.6, 3, 5, 8, 12].map((c) => {
            const rx = sx(Math.sqrt(c)) - sx(0)
            const ry = sy(0) - sy(Math.sqrt(c) / 3)
            return <ellipse key={c} cx={sx(0)} cy={sy(0)} rx={rx} ry={ry} fill="none" stroke="var(--border)" strokeWidth={1} />
          })}
          <circle cx={sx(0)} cy={sy(0)} r={4} fill="var(--ok)" />
          {OPTS.map((op) => {
            const o = states[op.key]
            return (
              <g key={op.key}>
                {o.hist.length > 1 && (
                  <polyline points={o.hist.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} fill="none" stroke={op.color} strokeWidth={2} strokeLinejoin="round" opacity={0.9} />
                )}
                <circle cx={sx(o.x)} cy={sy(o.y)} r={5} fill={op.color} stroke="var(--surface)" strokeWidth={1.5} />
              </g>
            )
          })}
        </svg>
        <div className="panel">
          <div className="stat">步数 <b>{step}</b></div>
          <div className="legend" style={{ marginTop: 2 }}>
            {OPTS.map((op) => {
              const o = states[op.key]
              const tag = o.done === 'conv' ? '✓ 收敛' : o.done === 'div' ? '✗ 发散' : `损失 ${f(o.x, o.y).toFixed(2)}`
              return (
                <div key={op.key}><i style={{ background: op.color }} />{op.key}：<span style={{ color: 'var(--text-muted)' }}>{tag}</span></div>
              )
            })}
          </div>
          <div className="row">
            <span>学习率</span>
            <input type="range" min={0.03} max={0.13} step={0.005} value={lr} onChange={(e) => setLr(parseFloat(e.target.value))} />
            <b>{lr.toFixed(3)}</b>
          </div>
          <div className="ctrl" style={{ marginTop: 4 }}>
            <button className="primary" onClick={() => setPlaying((p) => !p)}>{playing ? '暂停' : '播放'}</button>
            <button onClick={tick}>单步</button>
            <button onClick={reset}>重置</button>
          </div>
        </div>
      </div>
    </div>
  )
}
