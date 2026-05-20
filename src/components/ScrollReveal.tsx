import { useEffect, useRef, useState } from 'react'
import './ScrollReveal.css'

interface Props {
  children: React.ReactNode
  delay?: number
}

function ScrollReveal({ children, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Elementos próximos ou dentro da viewport no carregamento ficam visíveis sem animação
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 100) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={entered ? 'scroll-reveal-enter' : undefined}
      style={entered && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default ScrollReveal
