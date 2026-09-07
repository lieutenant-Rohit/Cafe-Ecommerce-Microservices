import { InView } from '../motion-primitives/in-view'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <InView
      once
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      viewOptions={{ once: true, margin: '-80px' }}
    >
      <div className={cn(className)}>{children}</div>
    </InView>
  )
}

