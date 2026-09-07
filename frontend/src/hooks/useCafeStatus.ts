import { useEffect, useState } from 'react'

const WEEKDAYS = { open: 6, close: 20 }
const WEEKENDS = { open: 7, close: 21 }

function fmtHour(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:00 ${hour < 12 ? 'a.m.' : 'p.m.'}`
}

export interface CafeStatus {
  isOpen: boolean
  statusText: string
  hoursToday: string
  greeting: string
  tickerLead: string
}

export function useCafeStatus(): CafeStatus {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const day = now.getDay()
  const weekend = day === 0 || day === 6
  const openAt = weekend ? WEEKENDS.open : WEEKDAYS.open
  const closeAt = weekend ? WEEKENDS.close : WEEKDAYS.close
  const hour = now.getHours()
  const isOpen = hour >= openAt && hour < closeAt

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const nextDay = (day + 1) % 7
  const nextWeekend = nextDay === 0 || nextDay === 6
  const nextOpenAt = nextWeekend ? WEEKENDS.open : WEEKDAYS.open

  const statusText = isOpen
    ? `Open now — closes ${fmtHour(closeAt)}`
    : hour < openAt
      ? `Closed — opens today ${fmtHour(openAt)}`
      : `Closed — opens tomorrow ${fmtHour(nextOpenAt)}`

  const hoursToday = weekend
    ? `Open ${fmtHour(openAt)} – ${fmtHour(closeAt)} (weekend)`
    : `Open ${fmtHour(openAt)} – ${fmtHour(closeAt)} (weekday)`

  const tickerLead = isOpen
    ? `${greeting}, we're pouring · ${fmtHour(closeAt)} cutoff`
    : `${greeting} — counter's dark until ${fmtHour(openAt)}`

  return { isOpen, statusText, hoursToday, greeting, tickerLead }
}

