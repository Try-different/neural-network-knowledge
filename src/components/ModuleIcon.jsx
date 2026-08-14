// 高清 SVG 图标：替代 Unicode 字符，任意缩放清晰
// 每个 module 对应一个主题化图标

const ICONS = {
  // 基础概念：神经元节点
  basics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M3 7h5M3 12h5M3 17h5" />
      <path d="M16 9l4-2M16 12h4M16 15l4 2" />
      <path d="M8 12h1" />
    </svg>
  ),
  // 经典网络架构：分层网络
  architectures: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="4" cy="6" r="1.8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="4" cy="18" r="1.8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="4" cy="6" r="1.8" />
      <circle cx="4" cy="18" r="1.8" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="20" cy="6" r="1.8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="20" cy="18" r="1.8" fill="currentColor" fillOpacity="0.2" />
      <circle cx="20" cy="6" r="1.8" />
      <circle cx="20" cy="18" r="1.8" />
      <path d="M5.5 7l5 4M5.5 17l5-4M13.5 7l-5 4M13.5 17l-5-4" opacity="0.4" />
    </svg>
  ),
  // 训练优化：滑块/调节
  optimization: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h10M18 8h2" />
      <circle cx="16" cy="8" r="2.2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="16" cy="8" r="2.2" />
      <path d="M4 16h2M10 16h10" />
      <circle cx="8" cy="16" r="2.2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="8" cy="16" r="2.2" />
    </svg>
  ),
  // 前沿进展：星火/突破
  frontiers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
}

export default function ModuleIcon({ id, className }) {
  return (
    <span className={`module-svg-icon ${className || ''}`}>
      {ICONS[id] || ICONS.basics}
    </span>
  )
}
