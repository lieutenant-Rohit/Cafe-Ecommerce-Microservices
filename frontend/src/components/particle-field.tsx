import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  life: number
  maxLife: number
}

export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  const createParticle = useCallback((x: number, y: number, fromMouse = false): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = fromMouse ? 0.5 + Math.random() * 2 : 0.1 + Math.random() * 0.3
    const maxLife = fromMouse ? 40 + Math.random() * 60 : 200 + Math.random() * 300
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (fromMouse ? 1 : 0.2),
      size: fromMouse ? 1 + Math.random() * 2 : 0.5 + Math.random() * 1.5,
      opacity: fromMouse ? 0.8 : 0.15 + Math.random() * 0.25,
      hue: fromMouse ? 15 + Math.random() * 25 : 25 + Math.random() * 15,
      life: 0,
      maxLife,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = canvas.offsetWidth * window.devicePixelRatio
    let h = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Seed particles
    const particleCount = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 12000))
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * canvas.offsetWidth, Math.random() * canvas.offsetHeight)
    )

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouse)

    const animate = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Spawn particles near mouse occasionally
      if (mx > 0 && Math.random() < 0.15) {
        particlesRef.current.push(createParticle(mx + (Math.random() - 0.5) * 40, my + (Math.random() - 0.5) * 40, true))
      }

      particlesRef.current.forEach((p, i) => {
        p.life++
        if (p.life > p.maxLife) return

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.8
          p.vy += (dy / dist) * force * 0.8
        }

        // Drift
        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < -10) p.x = cw + 10
        if (p.x > cw + 10) p.x = -10
        if (p.y < -10) p.y = ch + 10
        if (p.y > ch + 10) p.y = -10

        // Fade based on life
        const lifeRatio = p.life / p.maxLife
        const fadeIn = Math.min(1, p.life / 20)
        const fadeOut = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) / 0.2 : 1
        const alpha = p.opacity * fadeIn * fadeOut

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 50%, 55%, ${alpha})`
        ctx.fill()
      })

      // Draw connections between close particles
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          if (a.life > a.maxLife || b.life > b.maxLife) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.06
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `hsla(30, 40%, 50%, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Clean up dead particles
      particlesRef.current = particles.filter((p) => p.life <= p.maxLife)

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouse)
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'auto' }}
    />
  )
}
