import { useState, useMemo } from 'react'

// 输入特征图 4x4
const INPUT = [
  [1, 3, 2, 4],
  [5, 6, 1, 2],
  [2, 8, 7, 3],
  [4, 1, 9, 5],
]

function pool(input, mode, k = 2, stride = 2) {
  const n = input.length
  const outN = Math.floor((n - k) / stride) + 1
  const out = []
  const cells = [] // 记录每个输出对应输入的窗口位置与值
  for (let i = 0; i < outN; i++) {
    const row = []
    const cellRow = []
    for (let j = 0; j < outN; j++) {
      const window = []
      const positions = []
      for (let di = 0; di < k; di++) {
        for (let dj = 0; dj < k; dj++) {
          const r = i * stride + di
          const c = j * stride + dj
          window.push(input[r][c])
          positions.push({ r, c, v: input[r][c] })
        }
      }
      let val
      if (mode === 'max') {
        val = Math.max(...window)
      } else {
        val = window.reduce((s, v) => s + v, 0) / window.length
      }
      row.push(val)
      cellRow.push({ positions, val, win: window })
    }
    out.push(row)
    cells.push(cellRow)
  }
  return { out, cells }
}

export default function PoolingDemo() {
  const [mode, setMode] = useState('max')
  const [hoverCell, setHoverCell] = useState(null) // {oi, oj}

  const { out, cells } = useMemo(() => pool(INPUT, mode), [mode])

  const cell = 44
  const inSize = INPUT.length * cell
  const outSize = out.length * cell
  const gap = 40

  // 当前高亮的输入窗口
  const highlight = useMemo(() => {
    if (!hoverCell) return new Set()
    const { positions } = cells[hoverCell.oi][hoverCell.oj]
    return new Set(positions.map((p) => `${p.r},${p.c}`))
  }, [hoverCell, cells])

  const valColor = (v) => {
    const max = 9
    const t = v / max
    return `rgba(13, 148, 136, ${0.08 + t * 0.6})`
  }

  return (
    <div className="demo">
      <h4>池化层：下采样与平移不变性</h4>
      <p className="desc">
        池化用一个小窗口（此处 2×2，步长 2）扫描特征图，输出每个窗口的汇总值：
        <strong>最大池化</strong>取窗口内最大值（保留最强响应），
        <strong>平均池化</strong>取平均值（更平滑）。池化无参数，使特征图尺寸减半并带来一定平移不变性。
        鼠标悬停输出格，查看它对应输入的哪个窗口。
      </p>
      <div className="stage">
        <svg width={inSize + gap + outSize + 60} height={Math.max(inSize, outSize) + 50}>
          {/* 输入特征图 */}
          <text x={0} y={16} fontSize={12} fill="var(--text-h)" fontWeight={600}>输入 (4×4)</text>
          {INPUT.map((row, i) =>
            row.map((v, j) => {
              const key = `${i},${j}`
              const isHi = highlight.has(key)
              const isMax = mode === 'max' && hoverCell && cells[hoverCell.oi][hoverCell.oj].positions.find((p) => p.r === i && p.c === j && p.v === cells[hoverCell.oi][hoverCell.oj].val)
              return (
                <g key={key}>
                  <rect x={j * cell} y={24 + i * cell} width={cell} height={cell}
                    fill={valColor(v)} stroke={isHi ? 'var(--accent)' : 'var(--border)'} strokeWidth={isHi ? 2.5 : 1} />
                  <text x={j * cell + cell / 2} y={24 + i * cell + cell / 2 + 5} textAnchor="middle" fontSize={14}
                    fill="var(--text-h)" fontWeight={isMax ? 700 : 500}>{v}</text>
                </g>
              )
            })
          )}
          {/* 箭头 */}
          <text x={inSize + 8} y={24 + inSize / 2 - 6} fontSize={20} fill="var(--accent)">→</text>
          <text x={inSize + 8} y={24 + inSize / 2 + 14} fontSize={10} fill="var(--text-muted)">2×2 池化</text>
          {/* 输出特征图 */}
          <text x={inSize + gap + 20} y={16} fontSize={12} fill="var(--text-h)" fontWeight={600}>输出 (2×2)</text>
          {out.map((row, i) =>
            row.map((v, j) => {
              const isHi = hoverCell && hoverCell.oi === i && hoverCell.oj === j
              return (
                <g key={`${i},${j}`}>
                  <rect x={inSize + gap + 20 + j * cell} y={24 + i * cell} width={cell} height={cell}
                    fill={valColor(v)} stroke={isHi ? 'var(--accent)' : 'var(--border)'} strokeWidth={isHi ? 2.5 : 1} />
                  <text x={inSize + gap + 20 + j * cell + cell / 2} y={24 + i * cell + cell / 2 + 5} textAnchor="middle" fontSize={14}
                    fill="var(--text-h)" fontWeight={600}>{mode === 'avg' ? v.toFixed(1) : v}</text>
                  <rect x={inSize + gap + 20 + j * cell} y={24 + i * cell} width={cell} height={cell}
                    fill="transparent" stroke="transparent"
                    onMouseEnter={() => setHoverCell({ oi: i, oj: j })}
                    onMouseLeave={() => setHoverCell(null)}
                    style={{ cursor: 'pointer' }} />
                </g>
              )
            })
          )}
        </svg>
        <div className="panel">
          <div className="ctrl">
            <button className={mode === 'max' ? 'primary' : ''} onClick={() => setMode('max')}>最大池化 Max</button>
            <button className={mode === 'avg' ? 'primary' : ''} onClick={() => setMode('avg')}>平均池化 Avg</button>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.7 }}>
            {mode === 'max'
              ? '最大池化：每个 2×2 窗口取最大值。保留最显著的特征响应，对微小平移更鲁棒，是最常用的池化方式。'
              : '平均池化：每个 2×2 窗口取平均值。输出更平滑，保留更多背景信息，但会稀释强响应。'}
          </div>
          <div className="stat">
            尺寸变化：{INPUT.length}×{INPUT.length} → {out.length}×{out.length}<br />
            参数量：<b>0</b>（池化无可学习参数）
          </div>
          {hoverCell && (
            <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              当前窗口值：[{cells[hoverCell.oi][hoverCell.oj].win.join(', ')}] → 输出 <b>{mode === 'avg' ? cells[hoverCell.oi][hoverCell.oj].val.toFixed(1) : cells[hoverCell.oi][hoverCell.oj].val}</b>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
