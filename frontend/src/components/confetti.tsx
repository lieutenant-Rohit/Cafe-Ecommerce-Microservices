import { useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  shape: 'rect' | 'circle' | 'star'
}

const COLORS = [
  '#A94E2C', '#C2643A', '#D37E58', '#DBEDE2',
  '#F8E3D8', '#3a8a68', '#2b6f53', '#6F4E37',
]

function createParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = 3 + Math.random() * 6
  const shapes: Particle['shape'][] = ['rect', 'circle', 'star']
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 4,
    size: 4 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    life: 0,
    maxLife: 50 + Math.random() * 40,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const alpha = 1 - p.life / p.maxLife
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate((p.rotation * Math.PI) / 180)
  ctx.globalAlpha = alpha
  ctx.fillStyle = p.color

  if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
  } else if (p.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    const s = p.size / 2
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const r = s
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
    }
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

export function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const fire = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < 120; i++) {
      particles.push(createParticle(centerX, centerY))
    }

    let animFrame: number
    const width = canvas.width
    const height = canvas.height

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      let alive = false
      for (const p of particles) {
        if (p.life >= p.maxLife) continue
        alive = true

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.12
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.life++

        drawParticle(ctx, p)
      }

      if (alive) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => cancelAnimationFrame(animFrame)
  }, [canvasRef])

  return { fire }
}

export function ConfettiCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
