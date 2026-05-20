import './PoliticaPrivacidade.css'

function PoliticaPrivacidade() {
  return (
    <section className="privacyPolicy">
      <div className="privacyPolicy__bgGlow" />

      <div className="privacyPolicy__container">
        <header className="privacyPolicy__hero">
          <span className="privacyPolicy__eyebrow">NEXO MÍDIAS</span>
          <h1 className="privacyPolicy__title">Política de Privacidade</h1>
          <p className="privacyPolicy__intro">
            A Nexo Mídias respeita a sua privacidade e está comprometida em
            proteger as informações pessoais coletadas através do nosso site e
            dos nossos serviços. Esta Política de Privacidade explica como
            coletamos, utilizamos, armazenamos e protegemos seus dados.
          </p>
        </header>

        <div className="privacyPolicy__content">
          <section className="privacyPolicy__section">
            <h2>1. Quais dados coletamos</h2>
            <p>
              Podemos coletar algumas informações pessoais necessárias para
              fornecer nossos serviços e melhorar sua experiência na plataforma.
            </p>

            <ul>
              <li>Nome completo</li>
              <li>E-mail</li>
              <li>Informações de pagamento, quando aplicável</li>
              <li>Dados de navegação no site</li>
              <li>Informações relacionadas ao envio de vídeos</li>
            </ul>
          </section>

          <section className="privacyPolicy__section">
            <h2>2. Como utilizamos suas informações</h2>
            <p>Os dados coletados podem ser utilizados para:</p>

            <ul>
              <li>Gerenciar contas de usuários</li>
              <li>Processar envios de vídeos</li>
              <li>Realizar processos de licenciamento de conteúdo</li>
              <li>Comunicar atualizações e informações relevantes</li>
              <li>Melhorar a experiência da plataforma</li>
            </ul>
          </section>

          <section className="privacyPolicy__section">
            <h2>3. Compartilhamento de informações</h2>
            <p>
              A Nexo Mídias não vende dados pessoais. Informações podem ser
              compartilhadas apenas quando necessário para a prestação dos nossos
              serviços ou quando exigido por lei.
            </p>

            <div className="privacyPolicy__grid">
              <article className="privacyPolicy__card">
                <h3>Parceiros de licenciamento</h3>
                <p>
                  Quando necessário para viabilizar oportunidades de distribuição
                  e licenciamento de conteúdo.
                </p>
              </article>

              <article className="privacyPolicy__card">
                <h3>Prestadores técnicos</h3>
                <p>
                  Para suporte de infraestrutura, autenticação, pagamentos ou
                  manutenção da plataforma.
                </p>
              </article>

              <article className="privacyPolicy__card">
                <h3>Exigência legal</h3>
                <p>
                  Quando houver obrigação de compartilhamento com autoridades
                  competentes.
                </p>
              </article>

              <article className="privacyPolicy__card">
                <h3>Segurança operacional</h3>
                <p>
                  Para prevenir fraudes, abusos, usos indevidos e proteger os
                  direitos da plataforma e dos usuários.
                </p>
              </article>
            </div>
          </section>

          <section className="privacyPolicy__section">
            <h2>4. Segurança dos dados</h2>
            <p>
              Utilizamos medidas técnicas e organizacionais adequadas para
              proteger suas informações contra acesso não autorizado, alteração,
              divulgação ou destruição indevida.
            </p>
          </section>

          <section className="privacyPolicy__section">
            <h2>5. Direitos do usuário</h2>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você
              possui o direito de:
            </p>

            <ul>
              <li>Solicitar acesso aos seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão dos dados, quando aplicável</li>
              <li>Revogar consentimentos previamente concedidos</li>
            </ul>
          </section>

          <section className="privacyPolicy__section">
            <h2>6. Cookies e tecnologias similares</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar a
              navegação, entender o comportamento dos usuários e oferecer uma
              experiência mais personalizada.
            </p>

            <p>
              Para mais informações, consulte nossa página de Política de
              Cookies.
            </p>
          </section>

          <section className="privacyPolicy__section">
            <h2>7. Alterações nesta política</h2>
            <p>
              A Nexo Mídias pode atualizar esta Política de Privacidade a
              qualquer momento para refletir melhorias na plataforma ou mudanças
              legais.
            </p>

            <p>Recomendamos que você revise esta página periodicamente.</p>
          </section>

          <section className="privacyPolicy__section privacyPolicy__section--highlight">
            <h2>8. Contato</h2>
            <p>
              Caso tenha dúvidas sobre esta Política de Privacidade ou sobre o
              uso de seus dados, entre em contato com nossa equipe.
            </p>

            <a
              className="privacyPolicy__link"
              href="mailto:contato@nexomidias.com.br"
            >
              contato@nexomidias.com.br
            </a>
          </section>
        </div>
      </div>
    </section>
  )
}

export default PoliticaPrivacidade