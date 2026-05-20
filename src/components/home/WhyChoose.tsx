import "./WhyChoose.css"
import { useNavigate } from "react-router-dom"

function WhyChoose() {
  const navigate = useNavigate()

  return (
    <section className="why-choose">
      <div className="why-choose__particles"></div>

      <div className="container">
        {/* TÍTULO DESKTOP */}
        <h2 className="why-choose__title why-choose__title--desktop">
          POR QUE OS CRIADORES ESCOLHEM A <span>NEXO MIDIAS</span>?
        </h2>

        {/* TÍTULO MOBILE */}
        <h2 className="why-choose__title why-choose__title--mobile">
          <span className="why-choose__titleLine">POR QUE OS CRIADORES</span>
          <span className="why-choose__titleLine">
            ESCOLHEM A <span>NEXO MIDIAS</span>?
          </span>
        </h2>

        <div className="why-choose__grid">
          {/* CARD 1 */}
          <div className="why-choose__card">
            <img src="/why1.jpg" alt="Experiência e Especialização" />
            <h3>Experiência e expertise</h3>
            <p>
              Com ampla atuação no mercado de conteúdo digital, desenvolvemos uma sólida
              expertise em curadoria, licenciamento e distribuição de vídeos virais,
              garantindo processos eficientes, seguros e oportunidades reais para criadores
              e parceiros.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="why-choose__card">
            <img src="/why2.jpg" alt="Plataformas Próprias de Grande Alcance" />
            <h3>Plataformas próprias de grande alcance</h3>
            <p>
              Contamos com uma rede de páginas e comunidades digitais que reúnem milhões de
              seguidores, ampliando a visibilidade de conteúdos virais e conectando-os a
              públicos globais.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="why-choose__card why-card-1 why-choose__card--light">
            <img src="/why3.jpg" alt="Rede de Parceiros Estratégicos" />
            <h3>Rede de parceiros estratégicos</h3>
            <p>
              Contamos com uma rede sólida de parceiros que inclui portais de mídia,
              veículos de comunicação e grandes marcas, ampliando o alcance do seu conteúdo
              para audiências relevantes.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="why-choose__card why-card-2 why-choose__card--light">
            <img src="/why4.jpg" alt="Licenciamento e Gestão de Direitos" />
            <h3>Licenciamento e Gestão de Direitos</h3>
            <p>
              Atuamos com processos claros e seguros de licenciamento, protegendo os
              interesses de criadores e parceiros, além de oferecer suporte especializado na
              gestão de direitos de cada conteúdo.
            </p>
          </div>
        </div>

        <div className="why-choose__cta">
          <button className="btn-primary" onClick={() => navigate("/sobre-nos")}>
            SAIBA MAIS
          </button>
        </div>
      </div>
    </section>
  )
}

export default WhyChoose