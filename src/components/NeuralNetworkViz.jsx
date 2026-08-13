import { useState, useMemo } from 'react'

// 可交互的全连接神经网络结构图：可增减层数与每层神经元数
const LABELS = ['输入层', '隐藏层', '输出层']

// 用固定种子生成可复现的“权重”，仅用于可视化
function seededWeights(layers) {
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  const w = []
  for (let l = 0; l < layers.length - 1; l++) {
    const mat = []
    for (let i = 0; i < layers[l]; i++) {
      const row = []
      for (let j = 0; j < layers[l + 1]; j++) row.push(rand() * 2 - 1)
      mat.push(row)
    }
    w.push(mat)
  }
  return w
}

export default function NeuralNetworkViz({ initial = [3, 4, 4, 2] }) {
  const [layers, setLayers] = useState(initial)

  const weights = useMemo(() => seededWeights(layers), [layers])

  const W = 520
  const H = 300
  const layerGap = (W - 80) / (layers.length - 1 || 1)
  const neuronGap = (H - 60) / 6

  const posX = (l) => 40 + l * layerGap
  const posY = (l, i) => {
    const n = layers[l]
    const total = (n - 1) * neuronGap
    const start = (H - total) / 2
    return start + i * neuronGap
  }

  const addNeuron = (l) =>
    setLayers((ls) => ls.map((n, i) => (i === l && n < 6 ? n + 1 : n)))
  const delNeuron = (l) =>
    setLayers((ls) => ls.map((n, i) => (i === l && n > 1 ? n - 1 : n)))
  const addLayer = () => {
    if (layers.length >= 6) return
    setLayers((ls) => [...ls.slice(0, -1), 4, ls[ls.length - 1]])
  }
  const delLayer = () => {
    if (layers.length <= 2) return
    setLayers((ls) => [...ls.slice(0, -2), ls[ls.length - 1]])
  }

  const layerLabel = (l) => {
    if (l === 0) return LABELS[0]
    if (l === layers.length - 1) return LABELS[2]
    return LABELS[1]
  }

  return (
    <div className="viz">
      <div className="viz-head">
        <span className="viz-title">全连接神经网络结构</span>
        <div className="viz-ctrl">
          <button onClick={addLayer} disabled={layers.length >= 6}>＋ 隐藏层</button>
          <button onClick={delLayer} disabled={layers.length <= 2}>－ 隐藏层</button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        {/* 连接线 */}
        {weights.map((mat, l) =>
          mat.map((row, i) =>
            row.map((w, j) => (
              <line
                key={`w${l}-${i}-${j}`}
                x1={posX(l)} y1={posY(l, i)}
                x2={posX(l + 1)} y2={posY(l + 1, j)}
                stroke={w >= 0 ? 'var(--accent)' : 'var(--warn)'}
                strokeWidth="1"
                opacity={0.18 + Math.abs(w) * 0.5}
              />
            ))
          )
        )}
        {/* 神经元 */}
        {layers.map((n, l) =>
          Array.from({ length: n }).map((_, i) => (
            <g key={`n${l}-${i}`}>
              <circle
                cx={posX(l)} cy={posY(l, i)} r="13"
                fill="var(--surface)"
                stroke="var(--accent)"
                strokeWidth="2"
              />
              <circle cx={posX(l)} cy={posY(l, i)} r="5" fill="var(--accent)" opacity="0.7" />
            </g>
          ))
        )}
        {/* 层标签 */}
        {layers.map((n, l) => (
          <text
            key={`l${l}`}
            x={posX(l)} y={H - 8}
            fontSize="11" fill="var(--text-muted)" textAnchor="middle"
          >
            {layerLabel(l)} · {n}
          </text>
        ))}
        {/* 每层神经元增减按钮（仅隐藏层） */}
        {layers.map((n, l) =>
          l > 0 && l < layers.length - 1 ? (
            <g key={`b${l}`}>
              <circle cx={posX(l) + 22} cy={posY(l, 0) - 26} r="8" fill="var(--surface-2)" stroke="var(--border)" />
              <text x={posX(l) + 22} y={posY(l, 0) - 22} fontSize="12" fill="var(--text-h)" textAnchor="middle" style={{ cursor: 'pointer' }} onClick={() => addNeuron(l)}>+</text>
              <circle cx={posX(l) + 22} cy={posY(l, 0) - 10} r="8" fill="var(--surface-2)" stroke="var(--border)" />
              <text x={posX(l) + 22} y={posY(l, 0) - 6} fontSize="13" fill="var(--text-h)" textAnchor="middle" style={{ cursor: 'pointer' }} onClick={() => delNeuron(l)}>−</text>
            </g>
          ) : null
        )}
      </svg>

      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} /> 正权重</span>
        <span><i style={{ background: 'var(--warn)' }} /> 负权重</span>
        <span>连线深浅 ≈ |权重|</span>
      </div>
      <div className="hint">提示：点击隐藏层旁的 +/− 调整神经元数量，或用顶部按钮增减隐藏层。</div>
    </div>
  )
}
