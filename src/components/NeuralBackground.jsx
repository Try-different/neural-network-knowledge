import { useMemo } from 'react'

// 动态神经网络背景：节点 + 连线 + 脉冲动画
// 纯 SVG + CSS 动画，无依赖，性能友好
export default function NeuralBackground() {
  const { nodes, edges } = useMemo(() => {
    // 生成固定布局的节点（避免每次渲染随机）
    const seed = [
      [0.08, 0.20], [0.15, 0.65], [0.22, 0.35], [0.30, 0.80],
      [0.38, 0.15], [0.45, 0.55], [0.52, 0.25], [0.58, 0.70],
      [0.65, 0.40], [0.72, 0.85], [0.78, 0.20], [0.85, 0.60],
      [0.92, 0.35], [0.05, 0.45], [0.95, 0.75],
    ]
    const nodes = seed.map(([x, y], i) => ({
      id: i,
      x: x * 100,
      y: y * 100,
      r: 2 + (i % 3),
      delay: (i * 0.3) % 3,
    }))

    // 连接距离较近的节点
    const edges = []
    const maxDist = 22
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < maxDist) {
          edges.push({ from: i, to: j, delay: ((i + j) * 0.2) % 4 })
        }
      }
    }
    return { nodes, edges }
  }, [])

  return (
    <div className="neural-bg" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* 连线 */}
        {edges.map((e, i) => (
          <line
            key={`e${i}`}
            x1={nodes[e.from].x}
            y1={nodes[e.from].y}
            x2={nodes[e.to].x}
            y2={nodes[e.to].y}
            stroke="var(--accent)"
            strokeWidth={0.12}
            opacity={0.15}
            className="nb-edge"
            style={{ animationDelay: `${e.delay}s` }}
          />
        ))}
        {/* 节点 */}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r * 0.3}
            fill="var(--accent)"
            opacity={0.4}
            className="nb-node"
            style={{ animationDelay: `${n.delay}s` }}
          />
        ))}
        {/* 节点光晕 */}
        {nodes.map((n) => (
          <circle
            key={`g${n.id}`}
            cx={n.x}
            cy={n.y}
            r={n.r * 0.6}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={0.08}
            opacity={0.2}
            className="nb-glow"
            style={{ animationDelay: `${n.delay}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
