import { useState, useMemo } from 'react'

// 注意力权重热力图：展示序列内 token 间的注意力分布
const TOKENS = ['我', '爱', '深', '度', '学', '习']

// 用固定种子生成“符合直觉”的注意力分数：局部偏向 + 语义关联
function buildWeights() {
  let seed = 13
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  const n = TOKENS.length
  const scores = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // 距离越近分数越高，叠加随机性
      const dist = Math.abs(i - j)
      scores[i][j] = Math.exp(-dist * 0.6) + rand() * 0.4
    }
  }
  // 每行 softmax
  return scores.map((row) => {
    const m = Math.max(...row)
    const e = row.map((s) => Math.exp(s - m))
    const sum = e.reduce((a, b) => a + b, 0)
    return e.map((x) => x / sum)
  })
}

export default function AttentionHeatmap() {
  const weights = useMemo(buildWeights, [])
  const [sel, setSel] = useState(0)

  const cell = 46
  const labelW = 34
  const topH = 26
  const W = labelW + cell * TOKENS.length + 10
  const H = topH + cell * TOKENS.length + 10

  return (
    <div className="viz">
      <div className="viz-head">
        <span className="viz-title">自注意力权重热力图</span>
        <div className="viz-ctrl">
          {TOKENS.map((t, i) => (
            <button key={i} className={i === sel ? 'active' : ''} onClick={() => setSel(i)}>
              “{t}”
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420, margin: '0 auto' }}>
        {/* 顶部 key 标签 */}
        {TOKENS.map((t, j) => (
          <text
            key={`top${j}`}
            x={labelW + j * cell + cell / 2}
            y={topH - 8}
            fontSize="13"
            fill="var(--text-h)"
            textAnchor="middle"
            fontWeight="600"
          >
            {t}
          </text>
        ))}
        {/* 左侧 query 标签 + 格子 */}
        {weights.map((row, i) =>
          row.map((w, j) => {
            const x = labelW + j * cell
            const y = topH + i * cell
            const highlight = i === sel
            return (
              <g key={`${i}-${j}`} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
                <rect
                  x={x} y={y} width={cell - 2} height={cell - 2}
                  rx="4"
                  fill="var(--accent)"
                  opacity={highlight ? 0.25 + w * 0.75 : 0.08 + w * 0.25}
                  stroke={highlight ? 'var(--accent)' : 'transparent'}
                  strokeWidth="1"
                />
                {highlight && (
                  <text
                    x={x + (cell - 2) / 2}
                    y={y + (cell - 2) / 2 + 4}
                    fontSize="11"
                    fill={w > 0.4 ? '#fff' : 'var(--text-h)'}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {w.toFixed(2)}
                  </text>
                )}
              </g>
            )
          })
        )}
        {/* query 标签 */}
        {TOKENS.map((t, i) => (
          <text
            key={`left${i}`}
            x={labelW - 8}
            y={topH + i * cell + cell / 2 + 4}
            fontSize="13"
            fill={i === sel ? 'var(--accent)' : 'var(--text-h)'}
            textAnchor="end"
            fontWeight={i === sel ? '700' : '600'}
          >
            {t}
          </text>
        ))}
        {/* 轴说明 */}
        <text x={labelW + (cell * TOKENS.length) / 2} y={H - 2} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
          → Key（被关注）
        </text>
      </svg>

      <div className="hint">
        点击上方按钮或某一行，查看该 query token 对所有 key token 的注意力分布。色越深、权重越大。
      </div>
    </div>
  )
}
