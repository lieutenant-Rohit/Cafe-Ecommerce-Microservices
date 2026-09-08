import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

interface TextScrambleProps {
  text: string
  className?: string
  speed?: number
  stagger?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TextScramble({
  text,
  className = '',
  speed = 30,
  stagger = 0.03,
  tag: Tag = 'span',
}: TextScrambleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(text.split('').map(() => ''))
  const scrambledRef = useRef(false)

  useEffect(() => {
    if (!isInView || scrambledRef.current) return
    scrambledRef.current = true

    const chars = text.split('')
    const resolved: string[] = new Array(chars.length).fill('')
    let frame = 0

    const interval = setInterval(() => {
      const currentFrame = frame
      const newDisplay = chars.map((char, i) => {
        if (resolved[i]) return resolved[i]
        if (char === ' ') {
          resolved[i] = '\u00A0'
          return '\u00A0'
        }
        // How many frames until this char resolves
        const resolveAt = i * 1
        if (currentFrame >= resolveAt) {
          resolved[i] = char
          return char
        }
        // Random scramble
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })

      setDisplay(newDisplay)
      frame++

      if (resolved.every((r) => r !== '') || frame > chars.length + 20) {
        clearInterval(interval)
        setDisplay(chars.map(c => c === ' ' ? '\u00A0' : c))
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isInView, text, speed])

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      <Tag className="inline">
        {display.map((char, i) => (
          <span
            key={i}
            className="inline-block transition-colors duration-200"
            style={{
              opacity: char ? 1 : 0.15,
              color: char && char !== text[i] ? 'var(--primary)' : undefined,
              animationDelay: `${i * stagger}s`,
            }}
          >
            {char || '\u00A0'}
          </span>
        ))}
      </Tag>
    </div>
  )
}
