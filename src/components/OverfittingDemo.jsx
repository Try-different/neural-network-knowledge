import { useState, useRef, useEffect } from 'react'

const PI = Math.PI
function genData(seed, n) {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const xs = [], ys = []
  for (let i = 0; i < n; i++) {
    const x = -1 + (2 * (i + 0.5)) / n + (rand() - 0.5) * 0.1
    const y = Math.sin(PI * x) + (rand() - 0.5) * 0.25
    xs.push(x); ys.push(y)
  }
  return { xs, ys }
}
const TRAIN = genData(42, 9)
const VAL = genData(7, 9)

const W = 440, H = 220, PAD = 26
const XR = [-1.1, 1.1], YR = [-1.4, 1.4]
const sx = (x) => PAD + ((x - XR[0]) / (XR[1] - XR[0])) * (W - 2 * PAD)
const sy = (y) => H - PAD - ((y - YR[0]) / (YR[1] - YR[0])) * (H - 2 * PAD)

function polyEval(w, x) {
  let v = 0, xp = 1
  for (let k = 0; k < w.length; k++) { v += w[k] * xp; xp *= x }
  return v
}
function mse(w, data) {
  let s = 0
  for (let i = 0; i < data.xs.length; i++) {
    const e = polyEval(w, data.xs[i]) - data.ys[i]
    s += e * e
  }
  return s / data.xs.length
}

const CW = 440, CH = 150, CPAD = 26
const lossX = (i, total) => CPAD + (i / Math.max(1, total - 1)) * (CW - 2 * CPAD)
const lossY = (v, maxL) => CH - CPAD - Math.min(1, v / maxL) * (CH - 2 * CPAD)

export default function OverfittingDemo() {
  const [degree, setDegree] = useState(3)
  const [lam, setLam] = useState(0)
  const [w, setW] = useState(() => new Array(4).fill(0))
  const [hist, setHist] = useState([])
  const [epoch, setEpoch] = useState(0)
  const [playing, setPlaying] = useState(false)
  const wRef = useRef(w); wRef.current = w
  const histRef = useRef(hist); histRef.current = hist
  const epochRef = useRef(epoch); epochRef.current = epoch
  const lamRef = useRef(lam); lamRef.current = lam

  const reset = (d = degree) => {
    const nw = new Array(d + 1).fill(0)
    wRef.current = nw; setW(nw)
    histRef.current = []; setHist([])
    epochRef.current = 0; setEpoch(0)
    setPlaying(false)
  }

  const trainStep = () => {
    const ww = wRef.current.slice()
    const lr = 0.02
    const n = TRAIN.xs.length
    const g = new Array(ww.length).fill(0)
    const lm = lamRef.current
    for (let i = 0; i < n; i++) {
      const x = TRAIN.xs[i], y = TRAIN.ys[i]
      const err = polyEval(ww, x) - y
      let xp = 1
      for (let k = 0; k < ww.length; k++) { g[k] += (2 * err * xp) / n; xp *= x }
    }
    for (let k = 0; k < ww.length; k++) {
      g[k] += 2 * lm * ww[k]
      ww[k] -= lr * g[k]
    }
    wRef.current = ww; setW(ww)
    const tr = mse(ww, TRAIN), va = mse(ww, VAL)
    const h = [...histRef.current, { tr, va }]
    if (h.length > 300) h.shift()
    histRef.current = h; setHist(h)
    epochRef.current += 1; setEpoch(epochRef.current)
  }

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      for (let i = 0; i < 4; i++) trainStep()
    }, 60)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const curve = []
  for (let i = 0; i <= 80; i++) {
    const x = XR[0] + ((XR[1] - XR[0]) * i) / 80
    curve.push([x, polyEval(w, x)])
  }
  const truePts = []
  for (let i = 0; i <= 80; i++) {
    const x = XR[0] + ((XR[1] - XR[0]) * i) / 80
    truePts.push(`${sx(x)},${sy(Math.sin(PI * x))}`)
  }
  const maxL = Math.max(0.5, ...hist.map((h) => Math.max(h.tr, h.va)))
  const trNow = hist.length ? hist[hist.length - 1].tr : 0
  const vaNow = hist.length ? hist[hist.length - 1].va : 0
  let status = '点击「训练」开始'
  if (hist.length > 20) {
    if (vaNow > 1.4 * trNow && trNow < 0.1) status = '⚠ 过拟合：训练损失低，验证损失明显偏高'
    else if (trNow > 0.15) status = '欠拟合：容量不足或训练不够'
    else status = '✓ 拟合良好：训练与验证损失都低且接近'
  }

  return (
    <div className="demo">
      <h4>过拟合与正则化</h4>
      <p className="desc">
        真实规律是 sin(πx)（灰虚线）。蓝点是训练集、橙圈是验证集。提高多项式阶数（模型容量）并关掉正则化，
        曲线会剧烈扭曲去「死记」训练点——训练损失很低，验证损失却飙升（过拟合）。加大 L2 正则 λ 可抑制扭曲。
      </p>
      <div className="stage">
        <div className="panel" style={{ minWidth: 300 }}>
          <div className="stat">拟合曲线</div>
          <svg width={W} height={H}>
            <polyline points={truePts.join(' ')} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="4 3" />
            <polyline points={curve.map(([x, y]) => `${sx(x)},${sy(Math.max(-1.4, Math.min(1.4, y)))}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
            {TRAIN.xs.map((x, i) => <circle key={`t${i}`} cx={sx(x)} cy={sy(TRAIN.ys[i])} r={4} fill="var(--accent)" />)}
            {VAL.xs.map((x, i) => <circle key={`v${i}`} cx={sx(x)} cy={sy(VAL.ys[i])} r={4} fill="none" stroke="var(--warn)" strokeWidth={2} />)}
          </svg>
          <div className="legend" style={{ marginTop: 4, flexDirection: 'row', gap: 16 }}>
            <span><i style={{ background: 'var(--text-muted)' }} />真函数</span>
            <span><i style={{ background: 'var(--accent)' }} />训练点 / 拟合</span>
            <span><i style={{ background: 'var(--warn)' }} />验证点</span>
          </div>
        </div>
        <div className="panel" style={{ minWidth: 300 }}>
          <div className="stat">损失曲线（epoch {epoch}）</div>
          <svg width={CW} height={CH}>
            {hist.length > 1 && (
              <>
                <polyline points={hist.map((h, i) => `${lossX(i, hist.length)},${lossY(h.tr, maxL)}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2} />
                <polyline points={hist.map((h, i) => `${lossX(i, hist.length)},${lossY(h.va, maxL)}`).join(' ')} fill="none" stroke="var(--warn)" strokeWidth={2} />
              </>
            )}
          </svg>
          <div className="stat" style={{ marginTop: 4 }}>
            训练 MSE <b>{trNow.toFixed(3)}</b> · 验证 MSE <b style={{ color: 'var(--warn)' }}>{vaNow.toFixed(3)}</b>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{status}</div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <span>多项式阶数（容量）</span>
        <input type="range" min={1} max={12} step={1} value={degree} onChange={(e) => { const d = parseInt(e.target.value); setDegree(d); reset(d) }} />
        <b>{degree}</b>
      </div>
      <div className="row">
        <span>L2 正则 λ</span>
        <input type="range" min={0} max={0.5} step={0.005} value={lam} onChange={(e) => setLam(parseFloat(e.target.value))} />
        <b>{lam.toFixed(3)}</b>
      </div>
      <div className="ctrl" style={{ marginTop: 10 }}>
        <button className="primary" onClick={() => setPlaying((p) => !p)}>{playing ? '暂停' : '训练'}</button>
        <button onClick={trainStep}>单步</button>
        <button onClick={() => reset()}>重置</button>
        <button onClick={() => { setDegree(10); setLam(0); reset(10) }}>过拟合示例</button>
      </div>
    </div>
  )
}
