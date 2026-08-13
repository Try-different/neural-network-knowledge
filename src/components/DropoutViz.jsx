import { useState, useEffect, useRef } from 'react'

const LAYERS = [4, 6, 6, 4, 2] // 网络结构

function generateDrop(p) {
  // 每层（除输入输出）哪些神经元被丢弃
  const drops = []
  for (let l = 1; l < LAYERS.length - 1; l++) {
    const d = []
    for (let i = 0; i < LAYERS[l]; i++) d.push(Math.random() < p)
    drops.push(d)
  }
  return drops
}

export default function DropoutViz() {
  const [dropout, setDropout] = useState(true)
  const [p, setP] = useState(0.5)
  const [drops, setDrops] = useState(() => generateDrop(0.5))
  const [step, setStep] = useState(0)
  const timerRef = useRef(null)

  const resample = () => {
    setDrops(generateDrop(p))
    setStep((s) => s + 1)
  }

  useEffect(() => {
    if (!dropout) return
    timerRef.current = setInterval(resample, 1400)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropout, p])

  useEffect(() => { if (dropout) resample() }, [p, dropout])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const W = 420
  const H = 250
  const layerX = LAYERS.map((_, i) => 50 + (i * (W - 100)) / (LAYERS.length - 1))
  const nodeY = (count, idx) => {
    const spacing = Math.min(32, (H - 60) / Math.max(count, 2))
    const total = (count - 1) * spacing
    return H / 2 - total / 2 + idx * spacing
  }

  // 判断某层某节点是否被丢弃
  const isDropped = (layer, idx) => {
    if (!dropout) return false
    if (layer === 0 || layer === LAYERS.length - 1) return false
    return drops[layer - 1] && drops[layer - 1][idx]
  }

  return (
    <div className="demo">
      <h4>Dropout：训练时随机失活，迫使网络鲁棒</h4>
      <p className="desc">
        Dropout 在训练时按概率 <code>p</code> 随机将部分神经元置零（不参与前向与反向），
        等价于每次训练一个不同的子网络，最终相当于集成大量子网络。
        这迫使网络不依赖任何单个神经元，从而抑制过拟合。推理时关闭 dropout，使用完整网络。
        开启 Dropout，观察每步训练中哪些神经元被随机丢弃。
      </p>
      <div className="stage">
        <svg width={W} height={H}>
          {/* 连线 */}
          {LAYERS.slice(0, -1).map((cnt, l) =>
            Array.from({ length: cnt }, (_, i) =>
              Array.from({ length: LAYERS[l + 1] }, (_, j) => {
                const dropped = isDropped(l, i) || isDropped(l + 1, j)
                return (
                  <line key={`${l}-${i}-${j}`}
                    x1={layerX[l]} y1={nodeY(cnt, i)}
                    x2={layerX[l + 1]} y2={nodeY(LAYERS[l + 1], j)}
                    stroke={dropped ? 'var(--border)' : 'var(--accent)'}
                    strokeWidth={dropped ? 0.5 : 1}
                    opacity={dropped ? 0.15 : 0.3} />
                )
              })
            )
          )}
          {/* 节点 */}
          {LAYERS.map((cnt, l) =>
            Array.from({ length: cnt }, (_, i) => {
              const dropped = isDropped(l, i)
              return (
                <g key={`${l}-${i}`}>
                  <circle cx={layerX[l]} cy={nodeY(cnt, i)} r={9}
                    fill={dropped ? 'var(--surface-2)' : 'var(--accent)'}
                    stroke={dropped ? 'var(--border)' : 'var(--accent)'}
                    strokeWidth={1.5}
                    opacity={dropped ? 0.35 : 1} />
                  {dropped && (
                    <text x={layerX[l]} y={nodeY(cnt, i) + 4} textAnchor="middle" fontSize={11} fill="var(--warn)">✕</text>
                  )}
                </g>
              )
            })
          )}
          {/* 层标签 */}
          {LAYERS.map((cnt, l) => (
            <text key={l} x={layerX[l]} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
              {l === 0 ? '输入' : l === LAYERS.length - 1 ? '输出' : `隐藏${l}`}
            </text>
          ))}
        </svg>
        <div className="panel">
          <div className="ctrl">
            <button className={!dropout ? 'primary' : ''} onClick={() => setDropout(false)}>推理（关闭）</button>
            <button className={dropout ? 'primary' : ''} onClick={() => setDropout(true)}>训练（开启）</button>
          </div>
          {dropout ? (
            <>
              <div className="row">
                <span>丢弃率 p</span>
                <input type="range" min={0} max={0.8} step={0.05} value={p} onChange={(e) => setP(parseFloat(e.target.value))} />
                <b>{p.toFixed(2)}</b>
              </div>
              <div className="stat">训练步：#{step}</div>
              <button onClick={resample}>手动重新采样</button>
              <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                每步随机丢弃不同神经元（✕ 标记），剩余神经元承担全部信号。
                p 越大，失活越多，正则化越强，但 p 过大会导致信息丢失、训练不稳定。
              </div>
            </>
          ) : (
            <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
              推理时使用完整网络，所有神经元均参与预测。
              训练时若使用了 inverted dropout（已对存活神经元缩放），推理无需额外操作。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
