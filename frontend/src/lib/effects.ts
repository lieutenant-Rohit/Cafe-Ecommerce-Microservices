const CONFETTI_COLORS = ['#d92f8d', '#25d3a0', '#ffd84a', '#6fb8ff', '#ff7a3d']

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function flyToCart(source: DOMRect | null | undefined, imageUrl?: string | null) {
  if (!source || prefersReducedMotion()) return

  const target = document.getElementById('cart-target')
  if (!target) return

  const targetRect = target.getBoundingClientRect()
  const size = 58
  const startX = source.left + source.width / 2 - size / 2
  const startY = source.top + source.height / 2 - size / 2
  const endX = targetRect.left + targetRect.width / 2 - size / 2
  const endY = targetRect.top + targetRect.height / 2 - size / 2
  const dx = endX - startX
  const dy = endY - startY

  const flying = document.createElement('span')
  flying.className = 'fly-to-cart'
  flying.style.left = `${startX}px`
  flying.style.top = `${startY}px`
  if (imageUrl) {
    flying.style.backgroundImage = `url("${imageUrl.replace(/"/g, '%22')}")`
  } else {
    flying.textContent = '✦'
  }
  document.body.appendChild(flying)

  const flight = flying.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)', opacity: 1 },
      {
        transform: `translate3d(${dx * 0.48}px, ${dy * 0.48 - 110}px, 0) scale(0.82) rotate(160deg)`,
        opacity: 0.98,
        offset: 0.5,
      },
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.16) rotate(330deg)`,
        opacity: 0.7,
      },
    ],
    { duration: 720, easing: 'cubic-bezier(.45, 0, .25, 1)' },
  )

  flight.onfinish = () => {
    flying.remove()
    target.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.16) rotate(-3deg)' },
        { transform: 'scale(0.96) rotate(1deg)' },
        { transform: 'scale(1)' },
      ],
      { duration: 380, easing: 'ease-out' },
    )
  }
  flight.oncancel = () => flying.remove()
}

export function confettiBurst(x: number, y: number, amount = 36) {
  if (prefersReducedMotion()) return

  const layer = document.createElement('div')
  layer.className = 'confetti-layer'
  document.body.appendChild(layer)

  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement('i')
    piece.className = 'confetti-piece'
    piece.style.left = `${x}px`
    piece.style.top = `${y}px`
    piece.style.background = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
    piece.style.width = `${6 + Math.random() * 6}px`
    piece.style.height = `${10 + Math.random() * 10}px`
    layer.appendChild(piece)

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4
    const velocity = 120 + Math.random() * 250
    const dx = Math.cos(angle) * velocity
    const dy = Math.sin(angle) * velocity

    piece.animate(
      [
        { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
        {
          transform: `translate3d(${dx}px, ${dy - 70}px, 0) rotate(${Math.random() * 420}deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate3d(${dx * 1.25}px, ${dy + 280}px, 0) rotate(${Math.random() * 820}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 500,
        delay: Math.random() * 120,
        easing: 'cubic-bezier(.16, .75, .35, 1)',
        fill: 'forwards',
      },
    ).onfinish = () => piece.remove()
  }

  window.setTimeout(() => layer.remove(), 1900)
}
