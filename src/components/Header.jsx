import { useEffect, useRef, useState } from 'react'
import { Menu, Sparkles, X } from 'lucide-react'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#evento', label: 'Evento' },
  { href: '#confirmar', label: 'Confirmar asistencia' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollPosition = useRef(0)

  useEffect(() => {
    lastScrollPosition.current = window.scrollY
    let animationFrame = null

    const updateHeader = () => {
      const currentPosition = Math.max(window.scrollY, 0)
      const movement = currentPosition - lastScrollPosition.current

      if (currentPosition <= 12) {
        setIsHidden(false)
      } else if (movement > 7) {
        setIsHidden(true)
        setIsOpen(false)
      } else if (movement < -7) {
        setIsHidden(false)
      }

      lastScrollPosition.current = currentPosition
      animationFrame = null
    }

    const handleScroll = () => {
      if (animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(updateHeader)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <header
      className={`site-header${isHidden ? ' site-header--hidden' : ''}`}
      aria-hidden={isHidden}
      inert={isHidden ? true : undefined}
    >
      <a className="site-header__brand" href="#inicio" aria-label="Ir al inicio">
        Brisa <span>20</span> <Sparkles aria-hidden="true" />
      </a>
      <button
        className="menu-button"
        type="button"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="main-navigation" className={`site-nav${isOpen ? ' site-nav--open' : ''}`} aria-label="Navegación principal">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
