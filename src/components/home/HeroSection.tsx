import "./HeroSection.css"
import { Link } from "react-router-dom"
import { useLanguage } from "../../contexts/LanguageContext"
import { texts } from "../../i18n/texts"

function HeroSection() {
  const { language } = useLanguage()

  const description =
    texts.hero.description?.[language] ??
    "Levamos seu conteúdo além das telas: ampliamos seu alcance, impulsionamos a viralização e criamos novas oportunidades de monetização."

  return (
    <section className="hero">
      <div className="hero__particles" />

      <div className="hero__container">
        <div className="hero__content">

          {/* TÍTULO DESKTOP */}
          <h1 className="hero__title hero__title--desktop hero__title--fixed3">
            <span className="hero__titleLine">LEVE SEU VÍDEO PARA O</span>
            <span className="hero__titleLine">MUNDO E TRANSFORME</span>
            <span className="hero__titleLine">
              ISSO EM <span className="hero__highlight">FONTE DE RENDA</span>
            </span>
          </h1>

          {/* TÍTULO MOBILE */}
          <h1 className="hero__title hero__title--mobile">
            <span className="hero__titleLine">LEVE SEU VÍDEO</span>
            <span className="hero__titleLine">PARA O MUNDO</span>
            <span className="hero__titleLine">E TRANSFORME ISSO</span>
            <span className="hero__titleLine">EM</span>
            <span className="hero__titleLine">
              <span className="hero__highlight">FONTE DE RENDA</span>
            </span>
          </h1>

          <p className="hero__description">{description}</p>

          <div className="hero__actions">
            <Link to="/envie-seu-video" className="btn-primary">
              {texts.hero.sendVideo?.[language] ?? "ENVIAR VÍDEO"}
            </Link>

            <Link to="/biblioteca" className="btn-outline">
              {texts.hero.library?.[language] ?? "CONHECER BIBLIOTECA"}
            </Link>
          </div>
        </div>
        

        <div className="hero__media">
          <div className="hero__mosaic">
            <img
              src="/hero-mosaic.png"
              alt="Nexo Midias Brand Mosaic"
              className="hero__mosaic-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection