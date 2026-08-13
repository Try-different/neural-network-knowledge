import { useState, useRef, useEffect } from 'react'

const T = 30
const SIZE = 160
const BETAS = Array.from({ length: T }, (_, i) => 0.0001 + ((0.02 - 0.0001) * i) / (T - 1))
const ALPHA_BAR = (() => {
  const ab = [1]
  let a = 1
  for (const b of BETAS) { a *= 1 - b; ab.push(a) }
  return ab
})()

function makeOriginal() {
  const data = new Uint8ClampedArray(SIZE * SIZE * 4)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4
      const cx = SIZE / 2, cy = SIZE / 2
      const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      let R, G, B
      if (r < 35) { R = 8; G = 145; B = 178 }
      else if (r < 55) { R = 217; G = 119; B = 6 }
      else { R = 30 + x / 3; G = 40 + y / 3; B = 60 }
      data[i] = R; data[i + 1] = G; data[i + 2] = B; data[i + 3] = 255
    }
  }
  return data
}
const ORIGINAL = makeOriginal()

function makeNoise() {
  let s = 98765
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const data = new Uint8ClampedArray(SIZE * SIZE * 4)
  for (let i = 0; i < SIZE * SIZE; i++) {
    let sum = 0
    for (let j = 0; j < 12; j++) sum += rand()
    const z = (sum - 6) * 50 + 128
    data[i * 4] = z; data[i * 4 + 1] = z; data[i * 4 + 2] = z; data[i * 4 + 3] = 255
  }
  return data
}
const NOISE = makeNoise()

export default function DiffusionViz() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const ab = ALPHA_BAR[t]
    const sqab = Math.sqrt(ab)
    const sq1 = Math.sqrt(1 - ab)
    const out = new Uint8ClampedArray(SIZE * SIZE * 4)
    for (let i = 0; i < ORIGINAL.length; i += 4) {
      out[i] = sqab * ORIGINAL[i] + sq1 * NOISE[i]
      out[i + 1] = sqab * ORIGINAL[i + 1] + sq1 * NOISE[i + 1]
      out[i + 2] = sqab * ORIGINAL[i + 2] + sq1 * NOISE[i + 2]
      out[i + 3] = 255
    }
    ctx.putImageData(new ImageData(out, SIZE, SIZE), 0, 0)
  }, [t])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setT((p) => {
        if (p >= T) { setPlaying(false); return T }
        return p + 1
      })
    }, 130)
    return () => clearInterval(id)
  }, [playing])

  const reset = () => { setT(0); setPlaying(false) }
  const ab = ALPHA_BAR[t]

  return (
    <div className="demo">
      <h4>前向扩散：逐步加噪</h4>
      <p className="desc">
        原始图像 x₀ 按前向过程逐步添加高斯噪声：xₜ = √ᾱₜ·x₀ + √(1−ᾱₜ)·ε。
        拖动时间步滑块，看图像如何从清晰逐渐被噪声淹没、最终变成纯噪声。反向去噪（由神经网络学习）就是从纯噪声恢复图像的过程——这就是扩散模型生成的原理。
      </p>
      <div className="stage">
        <div>
          <div className="stat" style={{ marginBottom: 8 }}>xₜ（加噪结果）</div>
          <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius: 8, border: '1px solid var(--border)' }} />
        </div>
        <div className="panel">
          <div className="stat">时间步 t = <b>{t}</b> / {T}</div>
          <div className="stat">ᾱₜ = <b>{ab.toFixed(3)}</b></div>
          <div className="stat" style={{ color: 'var(--text-muted)', fontSize: 12, minHeight: 36, lineHeight: 1.6 }}>
            {t === 0 && 't=0：原始清晰图像'}
            {t > 0 && t < T && <>信号权重 √ᾱ=<b>{Math.sqrt(ab).toFixed(2)}</b>，噪声权重 √(1−ᾱ)=<b>{Math.sqrt(1 - ab).toFixed(2)}</b></>}
            {t === T && 't=T：几乎纯噪声，原图信息被淹没'}
          </div>
          <div className="row">
            <span>时间步 t</span>
            <input type="range" min={0} max={T} step={1} value={t} onChange={(e) => { setT(parseInt(e.target.value)); setPlaying(false) }} />
            <b>{t}</b>
          </div>
          <div className="ctrl" style={{ marginTop: 4 }}>
            <button className="primary" onClick={() => { if (t >= T) reset(); setPlaying((p) => !p) }}>{playing ? '暂停' : '播放加噪'}</button>
            <button onClick={reset}>重置</button>
          </div>
        </div>
      </div>
    </div>
  )
}
