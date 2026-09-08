import { useState, useEffect, useRef } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'span'
  trigger?: 'hover' | 'scroll' | 'always'
}

export default function GlitchText({
  text,
  className = '',
  tag: Tag = 'h2',
  trigger = 'hover',
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const startGlitch = () => {
    setIsGlitching(true)
    let count = 0
    intervalRef.current = setInterval(() => {
      count++
      if (count > 8) {
        clearInterval(intervalRef.current)
        setIsGlitching(false)
      }
    }, 50)
  }

  useEffect(() => {
    if (trigger === 'always') {
      startGlitch()
    }
    return () => clearInterval(intervalRef.current)
  }, [trigger])

  useEffect(() => {
    if (trigger !== 'scroll' || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startGlitch()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [trigger])

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
      onMouseEnter={trigger === 'hover' ? startGlitch : undefined}
    >
      <Tag className="relative">{text}</Tag>

      {isGlitching && (
        <>
          <Tag
            className="absolute inset-0 text-red-500/70"
            style={{
              clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
              transform: `translateX(${(Math.random() - 0.5) * 6}px)`,
            }}
            aria-hidden
          >
            {text}
          </Tag>
          <Tag
            className="absolute inset-0 text-cyan-500/70"
            style={{
              clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
              transform: `translateX(${(Math.random() - 0.5) * -6}px)`,
            }}
            aria-hidden
          >
            {text}
          </Tag>
        </>
      )}
    </div>
  )
}

