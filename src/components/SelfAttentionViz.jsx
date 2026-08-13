import { useState, useMemo } from 'react'

// 示例句子：词向量维度 d=4
const TOKENS = ['我', '爱', '深度', '学习']
const D = 4

// 预设的 Q、K、V 向量（手工设定，体现语义关联：'深度'关注'学习'，'爱'关注'我'等）
const Q = [
  [0.8, 0.2, 0.1, 0.0],
  [1.5, 0.3, 0.2, 0.1],
  [0.4, 1.6, 0.3, 0.2],
  [0.3, 0.4, 1.7, 0.5],
]
const K = [
  [0.7, 0.1, 0.1, 0.0],
  [1.3, 0.4, 0.1, 0.0],
  [0.3, 1.5, 0.4, 0.1],
  [0.2, 0.3, 1.6, 0.4],
]
const V = [
  [0.5, 0.1, 0.2, 0.1],
  [0.8, 0.2, 0.3, 0.1],
  [0.3, 0.9, 0.2, 0.2],
  [0.2, 0.3, 1.0, 0.3],
]

function dot(a, b) { return a.reduce((s, v, i) => s + v * b[i], 0) }

function softmax(arr) {
  const mx = Math.max(...arr)
  const exps = arr.map((v) => Math.exp(v - mx))
  const sum = exps.reduce((s, v) => s + v, 0)
  return exps.map((e) => e / sum)
}

// 计算所有注意力权重
function computeScores() {
  const scale = Math.sqrt(D)
  const scores = []
  const weights = []
  for (let i = 0; i < TOKENS.length; i++) {
    const sRow = []
    for (let j = 0; j < TOKENS.length; j++) {
      sRow.push(dot(Q[i], K[j]) / scale)
    }
    scores.push(sRow)
    weights.push(softmax(sRow))
  }
  return { scores, weights }
}

export default function SelfAttentionViz() {
  const [queryIdx, setQueryIdx] = useState(2) // 默认看 '深度'
  const { scores, weights } = useMemo(() => computeScores(), [])
  const wRow = weights[queryIdx]
  const sRow = scores[queryIdx]

  // 输出向量 = Σ wⱼ * Vⱼ
  const output = useMemo(() => {
    const out = new Array(D).fill(0)
    for (let j = 0; j < TOKENS.length; j++) {
      for (let d = 0; d < D; d++) out[d] += wRow[j] * V[j][d]
    }
    return out
  }, [wRow])

  const N = TOKENS.length
  const cell = 42
  const ox = 60
  const oy = 30

  return (
    <div className="demo">
      <h4>自注意力：Q · Kᵀ / √d → softmax → 加权 V</h4>
      <p className="desc">
        自注意力让序列中每个词都去「查询」其他词的相关性：用 <strong>Q·Kᵀ/√d</strong> 算出得分，
        经 softmax 归一化为注意力权重，再对 <strong>V</strong> 加权求和得到该词的新表示。
        点击下方任一词作为「查询」，查看它对其他词的注意力分布与输出向量。
      </p>
      <div className="stage">
        <div>
          {/* 注意力权重热力图 */}
          <div className="stat" style={{ marginBottom: 8 }}>注意力权重矩阵（行=查询词，列=被关注词）</div>
          <svg width={ox + N * cell + 20} height={oy + N * cell + 24}>
            {/* 列标签 */}
            {TOKENS.map((t, j) => (
              <text key={j} x={ox + j * cell + cell / 2} y={oy - 8} textAnchor="middle" fontSize={12} fill="var(--text-h)">{t}</text>
            ))}
            {/* 行标签 + 单元格 */}
            {TOKENS.map((_, i) => (
              <g key={i}>
                <text x={ox - 8} y={oy + i * cell + cell / 2 + 4} textAnchor="end" fontSize={12}
                  fill={i === queryIdx ? 'var(--accent)' : 'var(--text-h)'} fontWeight={i === queryIdx ? 700 : 400}>
                  {TOKENS[i]}
                </text>
                {weights[i].map((w, j) => {
                  const isQuery = i === queryIdx
                  return (
                    <g key={j}>
                      <rect x={ox + j * cell} y={oy + i * cell} width={cell} height={cell}
                        fill={isQuery ? 'var(--accent)' : 'var(--accent)'} opacity={isQuery ? w * 0.9 + 0.05 : w * 0.35}
                        stroke="var(--border)" />
                      <text x={ox + j * cell + cell / 2} y={oy + i * cell + cell / 2 + 4} textAnchor="middle" fontSize={10}
                        fill={isQuery && w > 0.3 ? '#fff' : 'var(--text-muted)'}>{w.toFixed(2)}</text>
                    </g>
                  )
                })}
              </g>
            ))}
          </svg>
        </div>
        <div className="panel">
          <div className="stat">查询词：<b>{TOKENS[queryIdx]}</b></div>
          <div className="ctrl">
            {TOKENS.map((t, i) => (
              <button key={i} className={queryIdx === i ? 'primary' : ''} onClick={() => setQueryIdx(i)}>{t}</button>
            ))}
          </div>
          <div className="stat" style={{ marginTop: 4 }}>注意力分布：</div>
          {wRow.map((w, j) => (
            <div className="row" key={j}>
              <span style={{ width: 40 }}>{TOKENS[j]}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${w * 100}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
              <b style={{ width: 44, textAlign: 'right' }}>{(w * 100).toFixed(1)}%</b>
            </div>
          ))}
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            得分 Q·Kᵀ/√d：[{sRow.map((s) => s.toFixed(2)).join(', ')}]<br />
            输出 = Σ wⱼ·Vⱼ ≈ [{output.map((o) => o.toFixed(2)).join(', ')}]
          </div>
        </div>
      </div>
    </div>
  )
}
