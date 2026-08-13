import { useState, useEffect, useRef } from 'react'

// 前向传播动画：逐层点亮神经元，展示数据流经网络的过程
const LAYERS = [3, 5, 4, 2]

// 预生成每个神经元的“激活值”（固定，便于复现）
const ACTS = [
  [0.7, 0.3, 0.9],
  [0.6, 0.2, 0.8, 0.4, 0.5],
  [0.7, 0.3, 0.9, 0.5],
  [0.8, 0.2],
]

export default function ForwardPassDemo() {
  // step: -1 未开始；0..LAYERS.length-1 表示当前激活的层索引
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!playing) return
    if (step >= LAYERS.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = setTimeout(() => setStep((s) => s + 1), 800)
    return () => clearTimeout(timer.current)
  }, [playing, step])

  const play = () => {
    if (step >= LAYERS.length - 1) setStep(-1)
    setPlaying(true)
    setStep((s) => (s >= LAYERS.length - 1 ? 0 : s + 1))
  }
  const reset = () => {
    setPlaying(false)
    setStep(-1)
  }

  const W = 520
  const H = 300
  const layerGap = (W - 80) / (LAYERS.length - 1)
  const neuronGap = (H - 60) / 6
  const posX = (l) => 40 + l * layerGap
  const posY = (l, i) => {
    const n = LAYERS[l]
    const total = (n - 1) * neuronGap
    return (H - total) / 2 + i * neuronGap
  }

  // 连接是否高亮：从已激活层流向下一层
  const lineActive = (l) => step >= l && step <= l + 1 && step < LAYERS.length - 1
  const neuronActive = (l) => step >= l

  return (
    <div className="viz">
      <div className="viz-head">
        <span className="viz-title">前向传播演示</span>
        <div className="viz-ctrl">
          <button className="active" onClick={play} disabled={playing}>
            {playing ? '传播中…' : '▶ 前向传播'}
          </button>
          <button onClick={reset}>↺ 重置</button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        {/* 连接线 */}
        {LAYERS.slice(0, -1).map((_, l) =>
          Array.from({ length: LAYERS[l] }).map((_, i) =>
            Array.from({ length: LAYERS[l + 1] }).map((_, j) => (
              <line
                key={`c${l}-${i}-${j}`}
                x1={posX(l)} y1={posY(l, i)}
                x2={posX(l + 1)} y2={posY(l + 1, j)}
                stroke={lineActive(l) ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={lineActive(l) ? 1.6 : 1}
                opacity={lineActive(l) ? 0.7 : 0.3}
              />
            ))
          )
        )}
        {/* 神经元 */}
        {LAYERS.map((n, l) =>
          Array.from({ length: n }).map((_, i) => {
            const active = neuronActive(l)
            const act = ACTS[l][i]
            return (
              <g key={`n${l}-${i}`}>
                <circle
                  cx={posX(l)} cy={posY(l, i)} r="15"
                  fill={active ? 'var(--accent)' : 'var(--surface)'}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  opacity={active ? 1 : 0.5}
                />
                {active && (
                  <text
                    x={posX(l)} y={posY(l, i) + 4}
                    fontSize="10" fill="#fff" textAnchor="middle"
                    fontWeight="600"
                  >
                    {act.toFixed(1)}
                  </text>
                )}
              </g>
            )
          })
        )}
        {/* 层标签 */}
        {LAYERS.map((n, l) => (
          <text
            key={`l${l}`}
            x={posX(l)} y={H - 8}
            fontSize="11" fill="var(--text-muted)" textAnchor="middle"
          >
            {l === 0 ? '输入层' : l === LAYERS.length - 1 ? '输出层' : `隐藏层 ${l}`} · {n}
          </text>
        ))}
      </svg>

      <div className="hint">
        {step < 0 && '点击「前向传播」，观察输入如何逐层计算激活值并传递到输出层。'}
        {step >= 0 && step < LAYERS.length - 1 && `当前：第 ${step + 1} 层已完成计算，正向第 ${step + 2} 层传播…`}
        {step >= LAYERS.length - 1 && '前向传播完成，得到输出层的预测结果。'}
      </div>
    </div>
  )
}
