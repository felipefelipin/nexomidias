import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useLanguage } from "../../../contexts/LanguageContext"
import { useAuth } from "../../../contexts/AuthContext"
import { texts } from "../../../i18n/texts"
import "./Header.css"

function Header() {
  const { language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()

  const [isVisible, setIsVisible] = useState(true)
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setIsVisible(true)
        return
      }
      setIsVisible(window.scrollY === 0)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenuOpen)

    return () => {
      document.body.classList.remove("menu-open")
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1025) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  function handleFaqClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname === "/") {
      e.preventDefault()
      const el = document.getElementById("faq")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
      closeMobileMenu()
    } else {
      closeMobileMenu()
    }
  }

  function handleLogout() {
    setOpen(false)
    setMobileMenuOpen(false)
    logout()
  }

  return (
    <>
      <header className={`site-header ${isVisible ? "visible" : "hidden"}`}>
        <div className="header-inner">
          <div className="header-logo">
            <Link to="/" className="brand-link" onClick={closeMobileMenu}>
              <img
                src="/logo-nexo.png"
                alt="NEXO MIDIAS"
                className="site-logo"
                width="240"
                height="240"
                decoding="async"
                loading="eager"
              />
            </Link>
          </div>

          <nav className="header-nav" aria-label="Navegação principal">
            <ul>
              <li>
                <Link to="/">{texts.header.home[language]}</Link>
              </li>
              <li>
                <Link to="/biblioteca">{texts.header.library[language]}</Link>
              </li>
              <li>
                <Link to="/sobre-nos">{texts.header.about[language]}</Link>
              </li>
              <li>
                <Link to="/envie-seu-video">{texts.header.sendVideo[language]}</Link>
              </li>
              <li>
                <Link to="/licenciamento">{texts.header.licensing[language]}</Link>
              </li>
              <li>
                <Link to="/#faq" onClick={handleFaqClick}>
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="lang-switch">
              <button
                type="button"
                className={`lang ${language === "pt" ? "active" : ""}`}
                onClick={() => setLanguage("pt")}
              >
                PT
              </button>
              <span className="separator">|</span>
              <button
                type="button"
                className={`lang ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>

            <div className="auth-slot" ref={dropdownRef}>
              {!user ? (
                <div className="guest-actions">
                  <Link to="/entrar" className="btn-outline">
                    {texts.header.login[language]}
                  </Link>

                  <Link to="/criar-conta" className="btn-primary">
                    {texts.header.signup[language]}
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="profile-pill"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    aria-haspopup="menu"
                  >
                    <div className="profile-avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="profile-name">{user.name}</span>
                    <span className="profile-arrow">▾</span>
                  </button>

                  {open && (
                    <div className="profile-dropdown">
                      <Link to="/configuracoes" onClick={() => setOpen(false)}>
                        Configurações
                      </Link>
                      <Link to="/meus-videos" onClick={() => setOpen(false)}>
                        Meus Vídeos
                      </Link>
                      <Link to="/carteira" onClick={() => setOpen(false)}>
                        Carteira
                      </Link>
                      <Link to="/rendimentos" onClick={() => setOpen(false)}>
                        Rendimento
                      </Link>
                      <button onClick={handleLogout} className="logout-item">
                        Sair
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? "is-open" : ""}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`mobile-menu-overlay ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={closeMobileMenu}
        aria-label="Fechar menu"
      />

      <aside
        id="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-menu-topbar">
          <Link to="/" className="brand-link mobile-brand" onClick={closeMobileMenu}>
            <img
              src="/logo-nexo.png"
              alt="NEXO MIDIAS"
              className="site-logo"
              width="240"
              height="240"
              decoding="async"
              loading="eager"
            />
          </Link>

          <button
            type="button"
            className="mobile-menu-close"
            onClick={closeMobileMenu}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className="mobile-menu-scroll">
          <nav className="mobile-nav" aria-label="Menu mobile">
            <ul>
              <li>
                <Link to="/" onClick={closeMobileMenu}>
                  {texts.header.home[language]}
                </Link>
              </li>
              <li>
                <Link to="/biblioteca" onClick={closeMobileMenu}>
                  {texts.header.library[language]}
                </Link>
              </li>
              <li>
                <Link to="/sobre-nos" onClick={closeMobileMenu}>
                  {texts.header.about[language]}
                </Link>
              </li>
              <li>
                <Link to="/envie-seu-video" onClick={closeMobileMenu}>
                  {texts.header.sendVideo[language]}
                </Link>
              </li>
              <li>
                <Link to="/licenciamento" onClick={closeMobileMenu}>
                  {texts.header.licensing[language]}
                </Link>
              </li>
              <li>
                <Link to="/#faq" onClick={handleFaqClick}>
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {!user ? (
            <div className="mobile-menu-bottom">
              <div className="mobile-guest-actions">
                <Link to="/entrar" className="btn-outline" onClick={closeMobileMenu}>
                  {texts.header.login[language]}
                </Link>
                <Link to="/criar-conta" className="btn-primary" onClick={closeMobileMenu}>
                  {texts.header.signup[language]}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mobile-menu-bottom">
              <div className="mobile-user-panel">
                <div className="mobile-user-card">
                  <div className="profile-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="profile-name">{user.name}</span>
                </div>

                <div className="mobile-user-links">
                  <Link to="/configuracoes" onClick={closeMobileMenu}>
                    Configurações
                  </Link>
                  <Link to="/meus-videos" onClick={closeMobileMenu}>
                    Meus Vídeos
                  </Link>
                  <Link to="/carteira" onClick={closeMobileMenu}>
                    Carteira
                  </Link>
                  <Link to="/rendimentos" onClick={closeMobileMenu}>
                    Rendimento
                  </Link>
                  <button onClick={handleLogout} className="logout-item">
                    Sair
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Header