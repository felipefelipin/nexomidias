import "./SobreNos.css";

export default function SobreNos() {
  return (
    <section className="sobreNexoDom">
      <div className="snd__container">

        {/* ================= HERO ================= */}
        <div className="snd__hero">

          <h1 className="snd__pageTitle">
            SOBRE A <span className="snd__pageTitleAccent">NEXO</span>
          </h1>

          <div className="snd__heroGrid">

            {/* TEXTO */}
            <div className="snd__heroText">

              <p className="snd__p">
                <strong>
                  Tudo começou com um canal no YouTube, criado para compartilhar momentos divertidos e cenas espontâneas do dia a dia.
                </strong>
                Com o tempo, percebemos o potencial desses conteúdos autênticos: vídeos que conquistam audiência,
                despertam emoções e se espalham rapidamente pelas redes sociais.
              </p>

              <p className="snd__p">
                Foi assim que nasceu a <strong>NEXO MIDIAS</strong>, construída por uma equipe apaixonada por
                conteúdo digital e dedicada a transformar vídeos virais em oportunidades reais. Acreditamos no
                poder do conteúdo gerado por usuários (UGC), capaz de criar conexões genuínas entre pessoas,
                marcas e audiências. Nosso objetivo é conectar criadores de conteúdo a empresas e plataformas
                de mídia, possibilitando licenciamento, distribuição e novas oportunidades de monetização.
              </p>

            </div>

            {/* CARD 1 - IMAGEM HERO */}
            <div className="snd__heroMedia">
              <div className="snd__mediaFrame">
                <img
                  src="/sobre-hero.jpg"
                  alt="Criador de conteúdo produzindo vídeos virais"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="snd__divider" />

        {/* ================= BLOCO 2 ================= */}
        <div className="snd__brands">

          <div className="snd__brandsGrid">

            {/* CARD 2 - IMAGEM MARCAS */}
            <div className="snd__phonesWrap">
              <div className="snd__phonesFrame">

                <img
                  src="/sobre-marcas.jpg"
                  alt="Conteúdos virais em smartphones"
                />

                {/* BADGE OPCIONAL - se quiser usar depois */}
                {/*
                <div className="snd__stat">
                  <div className="snd__statValue">290M+</div>
                  <div className="snd__statLabel">
                    Visualizações mensais de vídeos
                  </div>
                </div>
                */}

              </div>
            </div>

            {/* TEXTO */}
            <div className="snd__brandsText">

              <h2 className="snd__sectionTitle">
                CONHEÇA AS MARCAS QUE TRANSFORMAM MOMENTOS EM CONTEÚDOS VIRAIS
              </h2>

              <p className="snd__p snd__pSmall">
                Na <strong>NEXO MIDIAS</strong>, nossas marcas digitais levam conteúdos autênticos,
                divertidos e envolventes para milhões de pessoas. Estamos presentes em diversas
                plataformas digitais, reunindo comunidades com forte engajamento e ampliando o
                alcance de vídeos que conquistam o público.
                <br /><br />
                Cada uma de nossas páginas e projetos representa diferentes formas de entretenimento
                e histórias do cotidiano, criando uma conexão natural com as audiências e
                impulsionando conteúdos com potencial para alcançar públicos cada vez maiores.
              </p>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}