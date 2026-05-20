import "./UgcSection.css"

function UgcSection() {
  return (
    <section className="ugc">
      <div className="ugc__container">
        <div className="ugc__content">
          <h2>
            APROVEITE O PODER DO CONTEÚDO GERADO POR USUÁRIOS{" "}
            <span className="ugc__shine">(UGC)</span>
          </h2>

          <p className="ugc__description">
            O conteúdo gerado por usuários (User-Generated Content – UGC) está
            transformando a forma como marcas e audiências se conectam. Com
            autenticidade e apelo emocional, vídeos criados por pessoas reais se
            tornaram uma das estratégias mais eficazes para engajamento, alcance
            e viralização nas plataformas digitais.
          </p>

          <p className="ugc__subtitle">Por que o UGC é tão poderoso?</p>

          <ul className="ugc__list">
            <li>
              <span className="ugc__icon ugc__icon--pulse">➜</span>

              <div>
                <strong>Autenticidade que Gera Conexão</strong>
                <p>
                  Conteúdos criados por pessoas reais despertam mais confiança
                  e identificação, criando uma relação mais próxima com o
                  público.
                </p>
              </div>
            </li>

            <li>
              <span className="ugc__icon ugc__icon--pulse">➜</span>

              <div>
                <strong>Alcance Orgânico Ampliado</strong>
                <p>
                  Vídeos autênticos têm maior potencial de compartilhamento,
                  aumentando naturalmente o alcance nas redes sociais.
                </p>
              </div>
            </li>

            <li>
              <span className="ugc__icon ugc__icon--pulse">➜</span>

              <div>
                <strong>Eficiência e Escalabilidade</strong>
                <p>
                  O UGC permite produzir conteúdos impactantes de forma mais
                  ágil e eficiente, sem depender de produções complexas ou altos
                  custos.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default UgcSection