import { LEVELS } from '../data/nav'

// 难度徽章：在标题旁、侧边栏、卡片中复用
export default function DifficultyBadge({ level, size = 'sm' }) {
  const info = LEVELS[level]
  if (!info) return null
  return (
    <span
      className={`diff-badge ${size}`}
      style={{ '--bc': info.color }}
      title={info.desc}
    >
      {info.label}
    </span>
  )
}
