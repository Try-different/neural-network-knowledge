import { useState } from 'react'

const W = 440, H = 300, PAD = 32
const ER = [-3, 3], LR = [0, 9.2]
const sx = (e) => PAD + ((e - ER[0]) / (ER[1] - ER[0])) * (W - 2 * PAD)
const sy = (l) => H - PAD - (l / LR[1]) * (H - 2 * PAD)

const mse = (e) => e * e
const mae = (e) => Math.abs(e)
const huber = (e, d) => (Math.abs(e) <= d ? 0.5 * e * e : d * (Math.abs(e) - 0.5 * d))

export default function LossViz() {
  const [e, setE] = useState(1.5)
  const [d, setD] = useState(1.0)
  const curves = [
    { name: 'MSE', fn: (x) => mse(x), color: '#ef4444' },
    { name: 'MAE', fn: (x) => mae(x), color: 'var(--accent)' },
    { name: 'Huber', fn: (x) => huber(x, d), color: 'var(--warn)' },
  ]
  const xs = []
  for (let i = 0; i <= 120; i++) xs.push(ER[0] + ((ER[1] - ER[0]) * i) / 120)

  return (
    <div className="demo">
      <h4>损失函数对比</h4>
      <p className="desc">
        横轴是预测误差 e = ŷ − y，纵轴是损失。MSE（红）对大误差平方放大、对离群点敏感；MAE（青）线性增长、更鲁棒；
        Huber（橙）在小误差时像 MSE、大误差时像 MAE，兼顾二者。拖动误差滑块，看三种损失如何随误差变化。
      </p>
      <div className="stage">
        <svg width={W} height={H}>
          <line x1={sx(ER[0])} y1={sy(0)} x2={sx(ER[1])} y2={sy(0)} stroke="var(--border)" />
          <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(LR[1])} stroke="var(--border)" />
          {[-2, -1, 1, 2].map((v) => (
            <text key={v} x={sx(v)} y={sy(0) + 14} fontSize={10} textAnchor="middle">{v}</text>
          ))}
          {[2, 4, 6, 8].map((v) => (
            <text key={v} x={sx(0) - 6} y={sy(v) + 3} fontSize={10} textAnchor="end">{v}</text>
          ))}
          {curves.map((c) => (
            <polyline
              key={c.name}
              points={xs.map((x) => `${sx(x)},${sy(Math.min(LR[1], c.fn(x)))}`).join(' ')}
              fill="none"
              stroke={c.color}
              strokeWidth={2.5}
            />
          ))}
          <line x1={sx(e)} y1={sy(0)} x2={sx(e)} y2={sy(LR[1])} stroke="var(--text-muted)" strokeDasharray="3 3" />
          {curves.map((c) => (
            <circle key={c.name} cx={sx(e)} cy={sy(Math.min(LR[1], c.fn(e)))} r={4.5} fill={c.color} stroke="var(--surface)" strokeWidth={1.5} />
          ))}
        </svg>
        <div className="panel">
          <div className="stat">当前误差 e = <b>{e.toFixed(2)}</b></div>
          <div className="legend" style={{ marginTop: 4 }}>
            <div><i style={{ background: '#ef4444' }} />MSE = <b style={{ color: '#ef4444' }}>{mse(e).toFixed(2)}</b></div>
            <div><i style={{ background: 'var(--accent)' }} />MAE = <b style={{ color: 'var(--accent)' }}>{mae(e).toFixed(2)}</b></div>
            <div><i style={{ background: 'var(--warn)' }} />Huber = <b style={{ color: 'var(--warn)' }}>{huber(e, d).toFixed(2)}</b></div>
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            <span>误差 e</span>
            <input type="range" min={-3} max={3} step={0.05} value={e} onChange={(ev) => setE(parseFloat(ev.target.value))} />
            <b>{e.toFixed(2)}</b>
          </div>
          <div className="row">
            <span>Huber δ</span>
            <input type="range" min={0.3} max={2} step={0.05} value={d} onChange={(ev) => setD(parseFloat(ev.target.value))} />
            <b>{d.toFixed(2)}</b>
          </div>
          <div className="stat" style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 12 }}>
            当 e=2 时 MSE=4 远大于 MAE=2——大误差被平方放大，所以 MSE 对离群点更敏感。
          </div>
        </div>
      </div>
    </div>
  )
}
