import { cn } from '@/lib/utils'

interface MarqueeProps {
  items?: string[]
  children?: React.ReactNode
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
  separatorClassName?: string
}

export default function Marquee({
  items,
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  className,
  separatorClassName,
}: MarqueeProps) {
  const content = items
    ? items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          {item}
          {i < items.length - 1 && (
            <span className={cn('mx-4 w-1.5 h-1.5 rounded-full bg-coffee-300', separatorClassName)} />
          )}
        </span>
      ))
    : children

  return (
    <div
      className={cn('overflow-hidden flex', pauseOnHover && '[&>*]:hover:[animation-play-state:paused]', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <div
        className="flex shrink-0 animate-marquee gap-0"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {content}
      </div>
      <div
        className="flex shrink-0 animate-marquee gap-0"
        aria-hidden
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {content}
      </div>
    </div>
  )
}

