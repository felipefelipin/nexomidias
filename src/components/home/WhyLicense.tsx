import "./WhyLicense.css"

function WhyLicense() {
  return (
    <section className="why-license">
      {/* TÍTULO DESKTOP */}
      <h2 className="why-license__title why-license__title--desktop">
        POR QUE ESCOLHER A <br />
        <span>NEXO MIDIAS</span> PARA LICENCIAR SEUS VÍDEOS?
      </h2>

      {/* TÍTULO MOBILE */}
      <h2 className="why-license__title why-license__title--mobile">
        <span className="why-license__titleLine">POR QUE ESCOLHER A</span>
        <span className="why-license__titleLine">
          <span>NEXO MIDIAS</span>
        </span>
        <span className="why-license__titleLine">PARA LICENCIAR</span>
        <span className="why-license__titleLine">SEUS VÍDEOS?</span>
      </h2>

      <div className="why-license__grid">
        <div className="why-license__card">
          <img src="/license1.png" alt="Conteúdos Exclusivos" />
          <h3>Conteúdos virais Selecionados</h3>
          <p>
            Nossa curadoria reúne vídeos autênticos com alto potencial de engajamento,
            explorando temas que conectam audiências como humor, família e curiosidades.
          </p>
        </div>

        <div className="why-license__card">
          <img src="/license2.png" alt="Segurança Jurídica" />
          <h3>Segurança Jurídica</h3>
          <p>
            Todos os conteúdos são licenciados diretamente com seus criadores originais,
            garantindo transparência no uso e proteção contra questões relacionadas a
            direitos autorais.
          </p>
        </div>

        <div className="why-license__card">
          <img
            src="/license3.png"
            alt="Biblioteca de conteúdos em constante atualização"
          />
          <h3>Biblioteca de conteúdos em constante atualização</h3>
          <p>
            Atualizamos nossa biblioteca regularmente com vídeos relevantes e de alto
            potencial, mantendo o acesso a conteúdos alinhados às tendências digitais.
          </p>
        </div>

        <div className="why-license__card">
          <img src="/license4.png" alt="Suporte Dedicado" />
          <h3>Suporte Dedicado e Personalizado</h3>
          <p>
            Nossa equipe oferece acompanhamento especializado em todas as etapas, desde o
            licenciamento até o uso estratégico dos conteúdos.
          </p>
        </div>

        <div className="why-license__card">
          <img src="/license5.png" alt="Conteúdo pronto para Publicação" />
          <h3>Conteúdo pronto para Publicação</h3>
          <p>
            Os vídeos contam com materiais de apoio e informações complementares,
            facilitando a produção e acelerando o fluxo de trabalho das equipes de
            conteúdo.
          </p>
        </div>

        <div className="why-license__card">
          <img src="/license6.png" alt="Planos flexíveis de Licenciamento" />
          <h3>Planos flexíveis de Licenciamento</h3>
          <p>
            Criamos opções de assinatura que se adaptam às necessidades de veículos de
            mídia, marcas e plataformas digitais.
          </p>
        </div>
      </div>

      <p className="why-license__note">
        Conheça mais sobre nossos serviços em{" "}
        <a href="mailto:licenciamento@nexomidias.com.br">
          licenciamento@nexomidias.com.br
        </a>
      </p>
    </section>
  )
}

export default WhyLicense
