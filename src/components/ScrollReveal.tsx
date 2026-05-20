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

    const rect = el.getBoundingClientRect()
    // Buffer generoso para garantir que seções próximas ao fold não animem no load
    if (rect.top < window.innerHeight * 1.5) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
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
