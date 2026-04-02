interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', glow = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-[#111111] border border-[#1f1f1f] rounded-2xl',
        glow ? 'glow-green-sm border-brand-500/20' : '',
        onClick ? 'cursor-pointer hover:border-[#2a2a2a] transition-colors duration-150' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
