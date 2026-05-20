import './PoliticaCookies.css'

function PoliticaCookies() {
  return (
    <section className="cookiesPolicy">
      <div className="cookiesPolicy__bgGlow" />

      <div className="cookiesPolicy__container">
        <header className="cookiesPolicy__hero">
          <span className="cookiesPolicy__eyebrow">NEXO MÍDIAS</span>
          <h1 className="cookiesPolicy__title">Política de Cookies</h1>
          <p className="cookiesPolicy__intro">
            Esta Política de Cookies explica de forma clara como utilizamos cookies
            e tecnologias semelhantes em nosso site, quais informações podem ser
            coletadas e como você pode gerenciar suas preferências.
          </p>
        </header>

        <div className="cookiesPolicy__content">
          <section className="cookiesPolicy__section">
            <h2>1. O que são cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador
              ou dispositivo quando você acessa um site. Eles ajudam a melhorar a
              navegação, lembrar preferências e entender como os usuários interagem
              com a plataforma.
            </p>
            <p>
              Em geral, os cookies não armazenam informações sensíveis por si só,
              mas podem ser utilizados para oferecer uma experiência mais eficiente,
              personalizada e segura.
            </p>
          </section>

          <section className="cookiesPolicy__section">
            <h2>2. Quais tipos de cookies utilizamos?</h2>
            <div className="cookiesPolicy__grid">
              <article className="cookiesPolicy__card">
                <h3>Cookies essenciais</h3>
                <p>
                  Necessários para o funcionamento básico do site, como navegação,
                  segurança e acesso a áreas protegidas.
                </p>
              </article>

              <article className="cookiesPolicy__card">
                <h3>Cookies de desempenho</h3>
                <p>
                  Ajudam a entender como os visitantes utilizam o site, permitindo
                  melhorias de performance e usabilidade.
                </p>
              </article>

              <article className="cookiesPolicy__card">
                <h3>Cookies de funcionalidade</h3>
                <p>
                  Permitem lembrar preferências e escolhas do usuário para tornar a
                  experiência mais personalizada.
                </p>
              </article>

              <article className="cookiesPolicy__card">
                <h3>Cookies de publicidade</h3>
                <p>
                  Podem ser utilizados para exibir conteúdo promocional mais
                  relevante, limitar repetições e medir campanhas.
                </p>
              </article>
            </div>
          </section>

          <section className="cookiesPolicy__section">
            <h2>3. Por que usamos cookies?</h2>
            <p>Utilizamos cookies para:</p>
            <ul>
              <li>melhorar a experiência de navegação;</li>
              <li>memorizar preferências do usuário;</li>
              <li>entender como o site é utilizado;</li>
              <li>otimizar performance, segurança e conteúdo;</li>
              <li>apoiar ações de comunicação e marketing quando aplicável.</li>
            </ul>
          </section>

          <section className="cookiesPolicy__section">
            <h2>4. Como gerenciar cookies?</h2>
            <p>
              Você pode gerenciar ou desativar cookies diretamente no seu navegador.
              Também é possível apagar cookies já armazenados no dispositivo a
              qualquer momento.
            </p>
            <p>
              Vale lembrar que a desativação de determinados cookies pode afetar o
              funcionamento correto de algumas partes do site.
            </p>
          </section>

          <section className="cookiesPolicy__section">
            <h2>5. Atualizações desta política</h2>
            <p>
              Esta Política de Cookies pode ser atualizada periodicamente para
              refletir mudanças legais, técnicas ou operacionais. Recomendamos a
              consulta regular desta página para acompanhar eventuais alterações.
            </p>
          </section>

          <section className="cookiesPolicy__section cookiesPolicy__section--highlight">
            <h2>6. Fale com a Nexo Mídias</h2>
            <p>
              Se você tiver dúvidas sobre esta Política de Cookies ou sobre o uso de
              dados em nossa plataforma, entre em contato com nossa equipe.
            </p>
            <a
              className="cookiesPolicy__link"
              href="mailto:contato@nexomidias.com"
            >
              contato@nexomidias.com
            </a>
          </section>
        </div>
      </div>
    </section>
  )
}

export default PoliticaCookies