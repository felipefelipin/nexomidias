import './TermosUso.css'

function TermosUso() {
  return (
    <section className="terms">

      <div className="terms__bgGlow" />

      <div className="terms__container">

        <header className="terms__hero">
          <span className="terms__eyebrow">NEXO MÍDIAS</span>
          <h1 className="terms__title">Termos de Uso</h1>

          <p className="terms__intro">
            Estes Termos de Uso estabelecem as regras e condições para utilização
            da plataforma Nexo Mídias. Ao acessar ou utilizar nossos serviços,
            você concorda com os termos descritos neste documento.
          </p>
        </header>


        <div className="terms__content">

          <section className="terms__section">
            <h2>1. Sobre a plataforma</h2>

            <p>
              A Nexo Mídias é uma plataforma dedicada à curadoria, distribuição
              e licenciamento de vídeos virais e conteúdos gerados por usuários
              (UGC). Nosso objetivo é conectar criadores de conteúdo a
              oportunidades de monetização e distribuição em diferentes
              plataformas de mídia.
            </p>
          </section>


          <section className="terms__section">
            <h2>2. Aceitação dos termos</h2>

            <p>
              Ao utilizar qualquer funcionalidade da plataforma Nexo Mídias,
              você declara estar de acordo com estes Termos de Uso, bem como com
              nossa Política de Privacidade e Política de Cookies.
            </p>

            <p>
              Caso não concorde com qualquer parte destes termos, recomendamos
              que não utilize nossos serviços.
            </p>
          </section>


          <section className="terms__section">
            <h2>3. Propriedade intelectual</h2>

            <p>
              Todos os conteúdos enviados pelos usuários continuam sendo de
              propriedade de seus respectivos criadores. Ao enviar um vídeo para
              a Nexo Mídias, o criador concede à plataforma autorização para
              gerenciar o licenciamento e distribuição do conteúdo conforme os
              termos estabelecidos no contrato de exclusividade.
            </p>

            <p>
              Nenhum conteúdo poderá ser reproduzido, distribuído ou utilizado
              sem autorização adequada do titular ou da Nexo Mídias quando esta
              for responsável pela gestão do licenciamento.
            </p>
          </section>


          <section className="terms__section">
            <h2>4. Envio de conteúdos</h2>

            <p>
              Ao enviar um vídeo para a plataforma, o usuário declara que possui
              todos os direitos necessários sobre o conteúdo enviado e que o
              material não viola direitos de terceiros, incluindo direitos
              autorais, direitos de imagem ou qualquer outra legislação
              aplicável.
            </p>

            <p>
              Conteúdos que violem políticas da plataforma ou legislação vigente
              poderão ser removidos sem aviso prévio.
            </p>
          </section>


          <section className="terms__section">
            <h2>5. Licenciamento de conteúdo</h2>

            <p>
              A Nexo Mídias atua como intermediadora na negociação e licenciamento
              de conteúdos enviados pelos criadores. Os vídeos podem ser
              licenciados para veículos de mídia, programas de televisão,
              plataformas digitais, anunciantes e outros parceiros comerciais.
            </p>

            <p>
              As condições de remuneração são definidas em contrato específico
              firmado com o criador do conteúdo.
            </p>
          </section>


          <section className="terms__section">
            <h2>6. Responsabilidades do usuário</h2>

            <p>Ao utilizar a plataforma, o usuário concorda em:</p>

            <ul>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Não enviar conteúdos que violem direitos de terceiros</li>
              <li>Não utilizar a plataforma para atividades ilegais</li>
              <li>Respeitar as regras e políticas da plataforma</li>
            </ul>
          </section>


          <section className="terms__section">
            <h2>7. Limitação de responsabilidade</h2>

            <p>
              A Nexo Mídias não garante resultados financeiros específicos com o
              licenciamento de conteúdos. A monetização depende de fatores como
              demanda de mercado, relevância do conteúdo e oportunidades
              comerciais disponíveis.
            </p>
          </section>


          <section className="terms__section">
            <h2>8. Alterações nos termos</h2>

            <p>
              A Nexo Mídias pode atualizar estes Termos de Uso a qualquer
              momento. Recomendamos que os usuários revisem este documento
              periodicamente para se manterem informados sobre possíveis
              alterações.
            </p>
          </section>


          <section className="terms__section terms__section--highlight">
            <h2>9. Contato</h2>

            <p>
              Caso tenha dúvidas sobre estes Termos de Uso ou sobre nossos
              serviços, entre em contato com nossa equipe.
            </p>

            <a
              className="terms__link"
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

export default TermosUso