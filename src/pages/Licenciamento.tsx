import "./Licenciamento.css"

function Licenciamento() {
  return (
    <section className="licenciamento">
      <div className="licenciamento__container">
        <header className="licenciamento__top">
          <h2 className="licenciamento__title">LICENCIAMENTO DE CONTEÚDO</h2>
        </header>

        <div className="licenciamento__grid">
          <div className="licenciamento__art">
            <img
              className="licenciamento__artImage"
              src="/logo-licenciamento.png"
              alt="Nexo Midias"
            />
          </div>

          <div className="licenciamento__text">
            <p>
              Na <strong>NEXO MIDIAS</strong>, entendemos que cada projeto possui necessidades
              específicas. Seja para licenciar um vídeo individual ou acessar uma seleção maior
              de conteúdos da nossa biblioteca, nossa equipe está preparada para oferecer
              soluções alinhadas às suas demandas.
            </p>

            <p>
              Atendemos criadores de conteúdo, empresas de mídia, agências e plataformas
              digitais que buscam conteúdos autênticos para ampliar o alcance de suas
              produções e campanhas. Nossa curadoria reúne vídeos gerados por usuários com
              alto potencial de engajamento, destacando histórias reais, momentos únicos e
              conteúdos que se conectam naturalmente com o público.
            </p>

            <h3 className="licenciamento__subtitle">
              <strong>Licenciamento e Valores</strong>
            </h3>

            <p>
              Caso deseje licenciar um vídeo específico ou encontrar conteúdos alinhados ao
              seu projeto, nossa equipe pode ajudar a identificar as melhores opções
              disponíveis em nossa biblioteca.
              <br />
              <br />
              Para informações sobre valores, pacotes ou qualquer detalhe sobre o processo de
              licenciamento, entre em contato conosco pelo e-mail:
              <br />
              <a className="licenciamento__link" href="mailto:licenciamento@nexomidias.com.br">
                licenciamento@nexomidias.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Licenciamento