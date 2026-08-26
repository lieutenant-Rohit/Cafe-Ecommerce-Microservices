'use client';
import { cn } from '@/lib/utils'

export type ShinyTextProps = {
  text: string
  className?: string
  disabled?: boolean
  speed?: number
  gradientFrom?: string
  gradientTo?: string
  highlight?: string
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4.5,
  className,
  gradientFrom = 'rgba(255,255,255,0.12)',
  gradientTo = 'rgba(255,255,255,0.12)',
  highlight = 'rgba(255,255,255,0.9)',
}: ShinyTextProps) {
  const backgroundImage = `linear-gradient(120deg, ${gradientFrom} 30%, ${highlight} 45%, ${highlight} 55%, ${gradientTo} 70%)`
  const backgroundSize = '200% 100%'

  return (
    <span
      aria-label={text}
      className={cn(
        'bg-clip-text text-transparent animate-shine bg-no-repeat whitespace-pre-wrap',
        className
      )}
      style={{
        backgroundImage,
        backgroundSize,
        animationDuration: disabled ? '0s' : `${speed}s`,
      }}
    >
      {text}
    </span>
  )
}

