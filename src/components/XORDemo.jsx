import { useState, useMemo } from 'react'

// XOR 真值表
const POINTS = [
  { x: 0, y: 0, label: 0 },
  { x: 0, y: 1, label: 1 },
  { x: 1, y: 0, label: 1 },
  { x: 1, y: 1, label: 0 },
]

// 单层感知机决策边界（手动设定的几条直线，说明无法线性分割）
const LINES = [
  { w: [1, 1], b: -0.5, desc: 'w=(1,1), b=-0.5' },
  { w: [1, -1], b: -0.5, desc: 'w=(1,-1), b=-0.5' },
  { w: [-1, 1], b: -0.5, desc: 'w=(-1,1), b=-0.5' },
]

// MLP（2-2-1）已训练好的近似 XOR 参数
const MLP = {
  W1: [[20, -20], [-20, 20]],
  b1: [-10, -10],
  W2: [[20], [20]],
  b2: [-10],
}

function sigmoid(z) { return 1 / (1 + Math.exp(-z)) }

function mlpPredict(x, y) {
  const h1 = sigmoid(MLP.W1[0][0] * x + MLP.W1[0][1] * y + MLP.b1[0])
  const h2 = sigmoid(MLP.W1[1][0] * x + MLP.W1[1][1] * y + MLP.b1[1])
  const o = sigmoid(MLP.W2[0][0] * h1 + MLP.W2[1][0] * h2 + MLP.b2[0])
  return o
}

function lineY(w, b, x) {
  // w0*x + w1*y + b = 0  =>  y = -(w0*x + b) / w1
  if (Math.abs(w[1]) < 1e-6) return null
  return -(w[0] * x + b) / w[1]
}

export default function XORDemo() {
  const [mode, setMode] = useState('linear') // 'linear' | 'mlp'
  const [lineIdx, setLineIdx] = useState(0)

  const SIZE = 220
  const PAD = 36
  const scale = (v) => PAD + v * (SIZE - 2 * PAD)

  // 网格预测（MLP 模式下生成决策区域）
  const regions = useMemo(() => {
    if (mode !== 'mlp') return []
    const cells = []
    const N = 24
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const gx = i / (N - 1)
        const gy = j / (N - 1)
        const p = mlpPredict(gx, 1 - gy) // SVG y 向下
        cells.push({ gx, gy, p })
      }
    }
    return cells
  }, [mode])

  const cellSize = (SIZE - 2 * PAD) / 24

  return (
    <div className="demo">
      <h4>感知机的局限：异或（XOR）问题</h4>
      <p className="desc">
        XOR 真值表中，(0,0) 与 (1,1) 输出 0，(0,1) 与 (1,0) 输出 1——在二维平面上，
        这四点无法用<strong>一条直线</strong>分开，这就是单层感知机无法表达 XOR 的原因。
        切换到「多层感知机」，看加入隐藏层后如何用非线性边界解决 XOR。
      </p>
      <div className="stage">
        <svg width={SIZE} height={SIZE}>
          {/* MLP 决策区域 */}
          {mode === 'mlp' && regions.map((c, i) => {
            const op = Math.abs(c.p - 0.5)
            const fill = c.p > 0.5 ? 'var(--accent)' : 'var(--warn)'
            return (
              <rect key={i} x={scale(c.gx)} y={scale(c.gy)} width={cellSize + 1} height={cellSize + 1}
                fill={fill} opacity={op * 0.22} />
            )
          })}
          {/* 坐标轴 */}
          <line x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} stroke="var(--border)" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} stroke="var(--border)" />
          <text x={SIZE - PAD + 2} y={SIZE - PAD + 14} fontSize={10}>x₁</text>
          <text x={PAD - 14} y={PAD - 4} fontSize={10}>x₂</text>
          {/* 线性模式的决策直线 */}
          {mode === 'linear' && LINES.map((ln, i) => {
            if (i !== lineIdx) return null
            const y0 = lineY(ln.w, ln.b, 0)
            const y1 = lineY(ln.w, ln.b, 1)
            if (y0 === null || y1 === null) return null
            return (
              <line key={i} x1={scale(0)} y1={scale(1 - y0)} x2={scale(1)} y2={scale(1 - y1)}
                stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="5 4" />
            )
          })}
          {/* 四个 XOR 数据点 */}
          {POINTS.map((p, i) => (
            <g key={i}>
              <circle cx={scale(p.x)} cy={scale(1 - p.y)} r={11}
                fill={p.label === 1 ? 'var(--accent)' : 'var(--surface)'}
                stroke={p.label === 1 ? 'var(--accent)' : 'var(--warn)'} strokeWidth={2.5} />
              <text x={scale(p.x)} y={scale(1 - p.y) + 4} textAnchor="middle" fontSize={11}
                fill={p.label === 1 ? '#fff' : 'var(--warn)'} fontWeight={700}>{p.label}</text>
            </g>
          ))}
        </svg>
        <div className="panel">
          <div className="ctrl">
            <button className={mode === 'linear' ? 'primary' : ''} onClick={() => setMode('linear')}>单层感知机</button>
            <button className={mode === 'mlp' ? 'primary' : ''} onClick={() => setMode('mlp')}>多层感知机 MLP</button>
          </div>
          {mode === 'linear' ? (
            <>
              <div className="stat">尝试不同直线，都无法将○与●分开</div>
              <div className="ctrl">
                {LINES.map((ln, i) => (
                  <button key={i} className={lineIdx === i ? 'active' : ''} onClick={() => setLineIdx(i)}>
                    直线 {i + 1}
                  </button>
                ))}
              </div>
              <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                当前边界：{LINES[lineIdx].desc}<br />
                无论怎么调，总有同色点落在直线两侧——线性不可分。
              </div>
            </>
          ) : (
            <>
              <div className="stat">MLP 隐藏层学会非线性边界</div>
              <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                网络结构 2→2→1，两个隐藏神经元各学一条直线，
                组合后形成「L 型」非线性决策面，完美分开 XOR。
              </div>
              <div className="legend">
                <span><i style={{ background: 'var(--accent)' }} />预测 = 1 区域</span>
                <span><i style={{ background: 'var(--warn)' }} />预测 = 0 区域</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
