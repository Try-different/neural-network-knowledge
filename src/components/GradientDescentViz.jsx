import { useState, useRef, useEffect } from 'react'

// 损失函数 f(x,y) = x² + 9y²：狭长椭圆碗，y 方向更陡（病态曲率）
const f = (x, y) => x * x + 9 * y * y
const grad = (x, y) => [2 * x, 18 * y]

const W = 460, H = 340, PAD = 28
const XR = [-3, 3], YR = [-2, 2]
const sx = (x) => PAD + ((x - XR[0]) / (XR[1] - XR[0])) * (W - 2 * PAD)
const sy = (y) => H - PAD - ((y - YR[0]) / (YR[1] - YR[0])) * (H - 2 * PAD)

const STARTS = [
  { name: '起点 A', x: 2.3, y: 1.5 },
  { name: '起点 B', x: -2.6, y: 0.6 },
  { name: '起点 C', x: 0.4, y: 1.8 },
]
const PRESETS = [
  { name: '过小 0.02', lr: 0.02 },
  { name: '合适 0.08', lr: 0.08 },
  { name: '过大 0.16', lr: 0.16 },
]

export default function GradientDescentViz() {
  const [lr, setLr] = useState(0.08)
  const [startIdx, setStartIdx] = useState(0)
  const [pts, setPts] = useState([[STARTS[0].x, STARTS[0].y]])
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState('点击「播放」开始梯度下降')
  const ptsRef = useRef(pts)
  ptsRef.current = pts

  const reset = (idx = startIdx) => {
    const s = STARTS[idx]
    ptsRef.current = [[s.x, s.y]]
    setPts([[s.x, s.y]])
    setPlaying(false)
    setStatus('已重置，点击「播放」开始')
  }

  const chooseStart = (idx) => {
    setStartIdx(idx)
    reset(idx)
  }

  const stepOnce = () => {
    const cur = ptsRef.current
    if (cur.length < 1) return
    const [x, y] = cur[cur.length - 1]
    const [gx, gy] = grad(x, y)
    const nx = x - lr * gx
    const ny = y - lr * gy
    if (!isFinite(nx) || !isFinite(ny) || Math.abs(nx) > 8 || Math.abs(ny) > 8) {
      setStatus('发散：学习率过大，每步越过最小值、越走越远')
      setPlaying(false)
      return
    }
    const arr = [...cur, [nx, ny]]
    ptsRef.current = arr
    setPts(arr)
    if (f(nx, ny) < 1e-3) {
      setStatus('收敛：已到达最小值附近')
      setPlaying(false)
    } else {
      setStatus(`第 ${arr.length - 1} 步，损失 ${f(nx, ny).toFixed(3)}`)
    }
  }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(stepOnce, 130)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, lr])

  const cur = pts[pts.length - 1]
  const curLoss = f(cur[0], cur[1])

  return (
    <div className="demo">
      <h4>梯度下降可视化</h4>
      <p className="desc">
        损失曲面 f(x, y) = x² + 9y² 是一个狭长的椭圆碗（等高线为椭圆），最小值在原点 (0,0)。
        蓝点会沿负梯度方向一步步移动。调节学习率，观察「太小→慢」「合适→稳」「太大→震荡甚至发散」。
      </p>
      <div className="stage">
        <svg width={W} height={H} style={{ background: 'var(--bg-soft)', borderRadius: 10 }}>
          {[0.3, 0.8, 1.6, 3, 5, 8, 12].map((c) => {
            const rx = sx(Math.sqrt(c)) - sx(0)
            const ry = sy(0) - sy(Math.sqrt(c) / 3)
            return (
              <ellipse key={c} cx={sx(0)} cy={sy(0)} rx={rx} ry={ry} fill="none" stroke="var(--border)" strokeWidth={1} />
            )
          })}
          <line x1={sx(XR[0])} y1={sy(0)} x2={sx(XR[1])} y2={sy(0)} stroke="var(--border)" strokeWidth={1} />
          <line x1={sx(0)} y1={sy(YR[0])} x2={sx(0)} y2={sy(YR[1])} stroke="var(--border)" strokeWidth={1} />
          <circle cx={sx(0)} cy={sy(0)} r={4} fill="var(--ok)" />
          <text x={sx(0) + 8} y={sy(0) - 6} fontSize={11}>最小值</text>
          {pts.length > 1 && (
            <polyline
              points={pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          )}
          <circle cx={sx(cur[0])} cy={sy(cur[1])} r={6} fill="var(--accent)" stroke="var(--surface)" strokeWidth={2} />
        </svg>

        <div className="panel">
          <div className="stat">
            步数 <b>{pts.length - 1}</b> · 损失 <b>{curLoss.toFixed(3)}</b>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', minHeight: 20 }}>{status}</div>

          <div className="row">
            <span>学习率</span>
            <input type="range" min={0.005} max={0.2} step={0.005} value={lr} onChange={(e) => setLr(parseFloat(e.target.value))} />
            <b>{lr.toFixed(3)}</b>
          </div>
          <div className="ctrl">
            {PRESETS.map((p) => (
              <button key={p.lr} className={lr === p.lr ? 'active' : ''} onClick={() => setLr(p.lr)}>{p.name}</button>
            ))}
          </div>

          <div className="row" style={{ marginTop: 4 }}>
            <span>起点</span>
          </div>
          <div className="ctrl">
            {STARTS.map((s, i) => (
              <button key={i} className={startIdx === i ? 'active' : ''} onClick={() => chooseStart(i)}>{s.name}</button>
            ))}
          </div>

          <div className="ctrl" style={{ marginTop: 6 }}>
            <button className="primary" onClick={() => setPlaying((p) => !p)}>{playing ? '暂停' : '播放'}</button>
            <button onClick={stepOnce}>单步</button>
            <button onClick={() => reset()}>重置</button>
          </div>
        </div>
      </div>
    </div>
  )
}
