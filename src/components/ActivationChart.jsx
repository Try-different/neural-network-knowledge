import { useState, useMemo } from 'react'

// 激活函数定义：f 为主函数，df 为导数
const FNS = {
  sigmoid: {
    label: 'Sigmoid',
    formula: 'σ(x) = 1 / (1 + e⁻ˣ)',
    f: (x) => 1 / (1 + Math.exp(-x)),
    df: (x) => {
      const s = 1 / (1 + Math.exp(-x))
      return s * (1 - s)
    },
  },
  tanh: {
    label: 'Tanh',
    formula: 'tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)',
    f: (x) => Math.tanh(x),
    df: (x) => 1 - Math.tanh(x) ** 2,
  },
  relu: {
    label: 'ReLU',
    formula: 'ReLU(x) = max(0, x)',
    f: (x) => Math.max(0, x),
    df: (x) => (x > 0 ? 1 : 0),
  },
  leaky: {
    label: 'Leaky ReLU',
    formula: 'LeakyReLU(x) = x > 0 ? x : 0.01x',
    f: (x) => (x > 0 ? x : 0.01 * x),
    df: (x) => (x > 0 ? 1 : 0.01),
  },
  gelu: {
    label: 'GELU',
    formula: 'GELU(x) ≈ 0.5x(1 + tanh[√(2/π)(x + 0.044715x³)])',
    f: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    df: (x) => {
      const c = Math.sqrt(2 / Math.PI)
      const inner = c * (x + 0.044715 * x ** 3)
      const t = Math.tanh(inner)
      const dinner = c * (1 + 3 * 0.044715 * x ** 2)
      return 0.5 * (1 + t) + 0.5 * x * (1 - t ** 2) * dinner
    },
  },
}

const W = 460
const H = 280
const PAD = { l: 40, r: 16, t: 18, b: 28 }
const PLOT_W = W - PAD.l - PAD.r
const PLOT_H = H - PAD.t - PAD.b
const X_MIN = -6
const X_MAX = 6
const Y_MIN = -1.3
const Y_MAX = 1.3

const X = (x) => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W
const Y = (y) => PAD.t + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H

export default function ActivationChart() {
  const [key, setKey] = useState('relu')
  const [showDeriv, setShowDeriv] = useState(false)
  const fn = FNS[key]

  const { line, dline, xTicks } = useMemo(() => {
    const pts = []
    const dpts = []
    for (let x = X_MIN; x <= X_MAX; x += 0.1) {
      pts.push(`${X(x)},${Y(fn.f(x))}`)
      dpts.push(`${X(x)},${Y(fn.df(x))}`)
    }
    const ticks = [-6, -4, -2, 0, 2, 4, 6]
    return { line: pts.join(' '), dline: dpts.join(' '), xTicks: ticks }
  }, [fn])

  return (
    <div className="viz">
      <div className="viz-head">
        <span className="viz-title">激活函数曲线</span>
        <div className="viz-ctrl">
          {Object.entries(FNS).map(([k, v]) => (
            <button
              key={k}
              className={k === key ? 'active' : ''}
              onClick={() => setKey(k)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        <defs>
          <clipPath id="act-clip">
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>

        {/* 网格 */}
        {xTicks.map((t) => (
          <line
            key={`gx${t}`}
            x1={X(t)} y1={PAD.t} x2={X(t)} y2={PAD.t + PLOT_H}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}
        {[-1, -0.5, 0, 0.5, 1].map((t) => (
          <line
            key={`gy${t}`}
            x1={PAD.l} y1={Y(t)} x2={PAD.l + PLOT_W} y2={Y(t)}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}

        {/* 坐标轴 */}
        <line x1={X(0)} y1={PAD.t} x2={X(0)} y2={PAD.t + PLOT_H} stroke="var(--text-muted)" strokeWidth="1.5" />
        <line x1={PAD.l} y1={Y(0)} x2={PAD.l + PLOT_W} y2={Y(0)} stroke="var(--text-muted)" strokeWidth="1.5" />

        {/* 刻度标签 */}
        {xTicks.map((t) => (
          <text key={`tx${t}`} x={X(t)} y={PAD.t + PLOT_H + 18} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
            {t}
          </text>
        ))}
        {[-1, 0, 1].map((t) => (
          <text key={`ty${t}`} x={PAD.l - 8} y={Y(t) + 3} fontSize="10" fill="var(--text-muted)" textAnchor="end">
            {t}
          </text>
        ))}

        {/* 导数曲线 */}
        {showDeriv && (
          <polyline
            points={dline}
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeDasharray="5 4"
            clipPath="url(#act-clip)"
          />
        )}
        {/* 主曲线 */}
        <polyline
          points={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          clipPath="url(#act-clip)"
        />
      </svg>

      <div className="viz-head" style={{ marginTop: 10 }}>
        <code style={{ background: 'transparent', border: 'none', color: 'var(--text-h)' }}>
          {fn.formula}
        </code>
        <div className="viz-ctrl">
          <button
            className={showDeriv ? 'active' : ''}
            onClick={() => setShowDeriv((s) => !s)}
          >
            {showDeriv ? '隐藏导数' : '显示导数 f′(x)'}
          </button>
        </div>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} /> f(x)</span>
        {showDeriv && <span><i style={{ background: 'var(--accent-2)' }} /> f′(x)</span>}
      </div>
    </div>
  )
}
