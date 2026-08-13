import { useState, useMemo } from 'react'

const N_LAYERS = 6

// 模拟反向传播时各层的梯度幅度
// sigmoid 导数最大 0.25，连乘导致梯度指数衰减
// ReLU 导数在正区间为 1，梯度可较好保持（但可能死亡）
function computeGradients(activation, weightScale) {
  const grads = [1.0] // 输出层梯度归一化为 1
  for (let l = 1; l < N_LAYERS; l++) {
    let factor
    if (activation === 'sigmoid') {
      // sigmoid 导数 σ'(z)=σ(z)(1-σ(z))，最大 0.25，典型约 0.2
      factor = 0.2 * weightScale
    } else if (activation === 'tanh') {
      // tanh 导数最大 1，典型约 0.5
      factor = 0.5 * weightScale
    } else {
      // ReLU 导数正区间为 1，约 60% 神经元激活
      factor = 0.6 * weightScale
    }
    grads.push(grads[l - 1] * factor)
  }
  return grads
}

export default function BackpropFlowViz() {
  const [activation, setActivation] = useState('sigmoid')
  const [weightScale, setWeightScale] = useState(0.8)

  const grads = useMemo(() => computeGradients(activation, weightScale), [activation, weightScale])
  const maxG = Math.max(...grads, 0.001)

  const W = 420
  const H = 230
  const barW = 36
  const gap = 22
  const baseY = 190
  const barH = 150
  const startX = 40

  const actLabel = { sigmoid: 'Sigmoid', tanh: 'Tanh', relu: 'ReLU' }[activation]
  const vanishing = grads[grads.length - 1] < 0.01

  return (
    <div className="demo">
      <h4>反向传播与梯度消失：梯度如何逐层衰减</h4>
      <p className="desc">
        反向传播用链式法则将损失梯度从输出端逐层回传。每一层都要乘上该层<strong>激活函数导数</strong>与权重，
        形成连乘。若每层因子小于 1，梯度会<strong>指数衰减</strong>（梯度消失），靠前的层几乎学不到东西。
        切换激活函数，看 Sigmoid 如何让梯度消失、ReLU 如何缓解这一问题。
      </p>
      <div className="stage">
        <svg width={W} height={H}>
          {/* 基线 */}
          <line x1={20} y1={baseY} x2={W - 10} y2={baseY} stroke="var(--border)" />
          <text x={20} y={baseY + 16} fontSize={10} fill="var(--text-muted)">输出端</text>
          <text x={W - 60} y={baseY + 16} fontSize={10} fill="var(--text-muted)">输入端</text>
          {/* 反向传播方向箭头 */}
          <text x={W / 2 - 30} y={22} fontSize={11} fill="var(--accent)" fontWeight={600}>← 梯度回传方向 ←</text>
          {/* 梯度柱 */}
          {grads.map((g, i) => {
            const x = startX + (N_LAYERS - 1 - i) * (barW + gap)
            const hRatio = Math.max(0.02, Math.min(1, g / maxG))
            const h = hRatio * barH
            const color = g < 0.01 ? 'var(--warn)' : 'var(--accent)'
            return (
              <g key={i}>
                <rect x={x} y={baseY - barH} width={barW} height={barH} fill="var(--surface-2)" stroke="var(--border)" />
                <rect x={x} y={baseY - h} width={barW} height={h} fill={color} opacity={0.8} />
                <text x={x + barW / 2} y={baseY - h - 5} textAnchor="middle" fontSize={10} fill="var(--text-h)" fontWeight={600}>
                  {g < 0.001 ? g.toExponential(1) : g.toFixed(3)}
                </text>
                <text x={x + barW / 2} y={baseY + 32} textAnchor="middle" fontSize={10} fill="var(--text-muted)">层{i + 1}</text>
              </g>
            )
          })}
        </svg>
        <div className="panel">
          <div className="stat">激活函数：<b>{actLabel}</b></div>
          <div className="ctrl">
            <button className={activation === 'sigmoid' ? 'primary' : ''} onClick={() => setActivation('sigmoid')}>Sigmoid</button>
            <button className={activation === 'tanh' ? 'primary' : ''} onClick={() => setActivation('tanh')}>Tanh</button>
            <button className={activation === 'relu' ? 'primary' : ''} onClick={() => setActivation('relu')}>ReLU</button>
          </div>
          <div className="row">
            <span>权重尺度</span>
            <input type="range" min={0.3} max={1.2} step={0.05} value={weightScale} onChange={(e) => setWeightScale(parseFloat(e.target.value))} />
            <b>{weightScale.toFixed(2)}</b>
          </div>
          <div className="stat" style={{ color: vanishing ? 'var(--warn)' : 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
            {activation === 'sigmoid' && 'Sigmoid 导数最大仅 0.25，6 层连乘后梯度衰减至 ~10⁻⁴，前面的层几乎收不到学习信号——这就是梯度消失。'}
            {activation === 'tanh' && 'Tanh 导数最大为 1，但多数区域仍小于 1，深层连乘仍会衰减，但比 Sigmoid 缓和。'}
            {activation === 'relu' && 'ReLU 正区间导数恒为 1，只要神经元不死亡，梯度可较好地传到浅层，是深层网络的默认选择。'}
          </div>
          <div className="stat">
            输出层梯度：<b>1.000</b><br />
            输入层梯度：<b style={{ color: vanishing ? 'var(--warn)' : 'var(--accent)' }}>{grads[grads.length - 1] < 0.001 ? grads[grads.length - 1].toExponential(2) : grads[grads.length - 1].toFixed(4)}</b>
          </div>
        </div>
      </div>
    </div>
  )
}
