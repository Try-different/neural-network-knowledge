import { useState, useEffect } from 'react'

const INPUTS = {
  斜线: [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
  方块: [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0]],
  横线: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
}
const KERNELS = {
  边缘检测: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
  模糊: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]],
  锐化: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
  恒等: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
}
const N = 5
const OUT = N - 3 + 1
const CELL = 42

function conv(input, kernel) {
  const out = []
  for (let i = 0; i < OUT; i++) {
    out.push([])
    for (let j = 0; j < OUT; j++) {
      let s = 0
      for (let di = 0; di < 3; di++)
        for (let dj = 0; dj < 3; dj++)
          s += input[i + di][j + dj] * kernel[di][dj]
      out[i].push(s)
    }
  }
  return out
}

export default function ConvolutionDemo() {
  const [inName, setInName] = useState('斜线')
  const [kName, setKName] = useState('边缘检测')
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const input = INPUTS[inName]
  const kernel = KERNELS[kName]
  const out = conv(input, kernel)
  const pi = Math.floor(pos / OUT), pj = pos % OUT

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos((p) => (p + 1) % (OUT * OUT)), 380)
    return () => clearInterval(id)
  }, [playing])

  const outComputed = (i, j) => i * OUT + j <= pos

  return (
    <div className="demo">
      <h4>卷积运算演示</h4>
      <p className="desc">
        选一个卷积核，看它在输入图上从左上到右下滑动。高亮的 3×3 窗口是当前核位置，核与窗口逐元素相乘再求和，结果填入右侧特征图的对应格子。
        试试「边缘检测」核——它在像素变化剧烈处响应强、平坦处接近 0。
      </p>
      <div className="stage">
        <div>
          <div className="stat" style={{ marginBottom: 8 }}>输入 5×5</div>
          <svg width={N * CELL} height={N * CELL}>
            {input.map((row, i) =>
              row.map((v, j) => {
                const inWindow = i >= pi && i <= pi + 2 && j >= pj && j <= pj + 2
                return (
                  <g key={`${i}-${j}`}>
                    <rect x={j * CELL} y={i * CELL} width={CELL} height={CELL} fill={v ? 'var(--accent)' : 'var(--surface-2)'} stroke={inWindow ? 'var(--warn)' : 'var(--border)'} strokeWidth={inWindow ? 2.5 : 1} />
                    <text x={j * CELL + CELL / 2} y={i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={14} fill={v ? '#fff' : 'var(--text-muted)'}>{v}</text>
                  </g>
                )
              })
            )}
          </svg>
        </div>
        <div>
          <div className="stat" style={{ marginBottom: 8 }}>卷积核 3×3</div>
          <svg width={3 * CELL} height={3 * CELL}>
            {kernel.map((row, i) =>
              row.map((v, j) => (
                <g key={`${i}-${j}`}>
                  <rect x={j * CELL} y={i * CELL} width={CELL} height={CELL} fill="var(--bg-soft)" stroke="var(--border)" />
                  <rect x={j * CELL} y={i * CELL} width={CELL} height={CELL} fill={v >= 0 ? `rgba(8,145,178,${Math.min(1, Math.abs(v) / 5) * 0.6})` : `rgba(217,119,6,${Math.min(1, Math.abs(v) / 5) * 0.6})`} />
                  <text x={j * CELL + CELL / 2} y={i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={13} fill="var(--text-h)">{v.toFixed(2)}</text>
                </g>
              ))
            )}
          </svg>
        </div>
        <div>
          <div className="stat" style={{ marginBottom: 8 }}>特征图 3×3</div>
          <svg width={OUT * CELL} height={OUT * CELL}>
            {out.map((row, i) =>
              row.map((v, j) => {
                const computed = outComputed(i, j)
                const isCur = i === pi && j === pj
                const a = Math.min(1, Math.abs(v) / 3)
                return (
                  <g key={`${i}-${j}`}>
                    <rect x={j * CELL} y={i * CELL} width={CELL} height={CELL} fill="var(--surface-2)" stroke={isCur ? 'var(--warn)' : 'var(--border)'} strokeWidth={isCur ? 2.5 : 1} />
                    {computed && (
                      <>
                        <rect x={j * CELL} y={i * CELL} width={CELL} height={CELL} fill={v >= 0 ? `rgba(8,145,178,${a * 0.7})` : `rgba(217,119,6,${a * 0.7})`} />
                        <text x={j * CELL + CELL / 2} y={i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={13} fill={Math.abs(v) > 1.5 ? '#fff' : 'var(--text-h)'}>{v.toFixed(1)}</text>
                      </>
                    )}
                  </g>
                )
              })
            )}
          </svg>
        </div>
      </div>
      <div className="stat" style={{ marginTop: 14 }}>
        当前位置 ({pi},{pj})：窗口与核逐元素相乘求和 = <b>{out[pi][pj].toFixed(2)}</b>
      </div>
      <div className="ctrl" style={{ marginTop: 10 }}>
        <button className="primary" onClick={() => setPlaying((p) => !p)}>{playing ? '暂停' : '自动滑动'}</button>
        <button onClick={() => setPos((p) => (p + 1) % (OUT * OUT))}>下一步</button>
        <button onClick={() => { setPos(0); setPlaying(false) }}>重置</button>
      </div>
      <div className="row" style={{ marginTop: 10 }}>输入图：</div>
      <div className="ctrl">
        {Object.keys(INPUTS).map((n) => (
          <button key={n} className={inName === n ? 'active' : ''} onClick={() => { setInName(n); setPos(0); setPlaying(false) }}>{n}</button>
        ))}
      </div>
      <div className="row" style={{ marginTop: 10 }}>卷积核：</div>
      <div className="ctrl">
        {Object.keys(KERNELS).map((n) => (
          <button key={n} className={kName === n ? 'active' : ''} onClick={() => { setKName(n); setPos(0); setPlaying(false) }}>{n}</button>
        ))}
      </div>
    </div>
  )
}
