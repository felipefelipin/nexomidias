import { useState } from 'react'
import './FaqSection.css'

const faqs = [
  {
    question: 'Como a Nexo Mídias monetiza vídeos virais?',
    answer: `A Nexo Mídias é uma plataforma especializada na curadoria, distribuição e licenciamento de vídeos virais e conteúdos gerados por usuários (UGC).
Nosso objetivo é conectar criadores talentosos a oportunidades reais de alcance e monetização, promovendo seus conteúdos de forma ética, segura e totalmente legal, garantindo o reconhecimento e a compensação justa por cada vídeo licenciado.

Representamos uma rede crescente de criadores que confiam na Nexo Mídias para transformar momentos autênticos em oportunidades de renda. Através da nossa biblioteca de conteúdo, licenciamos vídeos para portais de notícias, programas de televisão, páginas de redes sociais, plataformas digitais, canais do YouTube e diversos parceiros de mídia ao redor do mundo.

Além de ampliar o alcance dos conteúdos, também atuamos na proteção dos direitos autorais dos criadores, monitorando o uso indevido de vídeos e garantindo que qualquer utilização por terceiros seja devidamente autorizada e licenciada.`
  },
  {
    question: 'O que significa conceder exclusividade?',
    answer: `Quando você concede direitos exclusivos à Nexo Mídias, está autorizando nossa plataforma a ser a única responsável por gerenciar, distribuir e licenciar o seu vídeo. Isso significa que a Nexo Mídias passa a representar oficialmente o conteúdo, podendo comercializá-lo e licenciá-lo em nome do criador original durante o período de exclusividade estabelecido no contrato.

Durante esse período, nenhuma outra empresa ou plataforma poderá licenciar ou distribuir o vídeo sem autorização, garantindo total controle e proteção sobre o uso do conteúdo.

Essa exclusividade oferece diversas vantagens para o criador:

Proteção de Direitos Autorais
A Nexo Mídias monitora o uso do seu conteúdo e pode agir legalmente em seu nome para remover utilizações não autorizadas e proteger seus direitos autorais.

Monetização Global
Trabalhamos para maximizar o potencial de ganhos do seu vídeo através da nossa rede de parceiros, que inclui programas de televisão, portais de notícias, páginas de redes sociais, anunciantes e plataformas digitais ao redor do mundo.

Gestão Simplificada
Com a Nexo Mídias administrando o licenciamento do seu conteúdo, você não precisa se preocupar com negociações, contratos ou gestão de direitos — podendo focar no que realmente importa: criar novos vídeos.

Em resumo, ao conceder direitos exclusivos à Nexo Mídias, você nos autoriza a representar oficialmente o seu vídeo, garantindo que ele seja utilizado de forma ética, legal e estratégica, enquanto trabalhamos para ampliar seu alcance e maximizar suas oportunidades de monetização.`
  },
  {
    question: 'Como vou ganhar dinheiro com meu vídeo?',
    answer: `Ao transferir os direitos exclusivos do seu vídeo para a Nexo Mídias, passamos a atuar na gestão, distribuição e licenciamento do seu conteúdo para terceiros, como programas de TV, portais de mídia, anunciantes, plataformas digitais e redes sociais. Sempre que uma licença for realizada, você recebe 50% dos lucros gerados.

Nosso modelo de licenciamento oferece duas principais formas de monetização para os criadores:

Divisão de receitas
Sempre que seu vídeo for licenciado diretamente para um parceiro ou cliente, os lucros obtidos são compartilhados com você.

Cobrança retroativa de licenciamento
Se identificarmos que seu vídeo foi utilizado por terceiros sem autorização, podemos atuar para regularizar esse uso e cobrar uma licença retroativa, garantindo a devida compensação ao criador.`
  },
  {
    question: 'Meu vídeo foi usado sem autorização. E agora?',
    answer: `Se você identificar seu vídeo sendo utilizado em alguma página, plataforma ou veículo de mídia sem autorização ou sem os devidos créditos, entre em contato conosco imediatamente através do nosso e-mail de suporte: copyright@nexomidias.com.br

Nossa equipe irá analisar o caso e tomar as medidas necessárias para proteger seus direitos autorais, podendo solicitar a remoção do conteúdo ou regularizar o uso através do processo adequado de licenciamento.`
  },
  {
    question: 'Como funciona a análise do meu vídeo?',
    answer: `Após a concessão dos direitos exclusivos à Nexo Mídias, seu vídeo passará por um processo de análise realizado pela nossa equipe. Durante essa etapa, verificamos a autenticidade do conteúdo, a propriedade do vídeo e outros requisitos necessários para garantir conformidade legal. Esse processo normalmente leva até 5 dias úteis, podendo variar caso seja necessário realizar verificações adicionais.

Após a aprovação, seu vídeo poderá ser licenciado para diferentes parceiros, como programas de televisão, portais de mídia, plataformas digitais, redes sociais e anunciantes. Dependendo das oportunidades de licenciamento, o conteúdo também poderá ser utilizado em páginas e canais administrados pela Nexo Mídias, ampliando o alcance e as possibilidades de monetização.

Sempre que houver utilizações relevantes ou oportunidades de licenciamento para o seu vídeo, nossa equipe poderá informá-lo sobre o uso do conteúdo.`
  },
  {
    question: 'Como entro em contato com a Nexo Mídias?',
    answer: `Se você precisar entrar em contato com a equipe de suporte da Nexo Mídias, pode utilizar os seguintes canais:

E-mail
Envie sua dúvida ou solicitação para licenciamento@nexomidias.com.br Nossa equipe de suporte normalmente responde dentro de até 24 horas úteis.

Redes sociais
Você também pode entrar em contato através de nossas páginas oficiais no TikTok e Instagram. Basta enviar uma mensagem direta e nossa equipe terá prazer em ajudar.`
  },
  {
    question: 'Por que um conteúdo pode ser removido?',
    answer: `Seu conteúdo pode ter sido removido devido a uma possível violação de direitos autorais.
A Nexo Mídias atua na proteção dos direitos dos criadores que representamos, garantindo que seus vídeos sejam utilizados apenas com a devida autorização ou licença.

Caso identifiquemos o uso não autorizado de um conteúdo, podemos solicitar a remoção ou regularização desse material para garantir o respeito aos direitos autorais dos criadores.

Se você tiver dúvidas sobre a remoção do seu conteúdo ou precisar de mais informações, entre em contato com nossa equipe para que possamos analisar o caso e fornecer o suporte necessário.`
  },
  {
    question: 'Que tipos de vídeos estão na biblioteca?',
    answer: `Nossa biblioteca reúne uma grande variedade de vídeos virais e conteúdos autênticos gerados por usuários. Entre eles estão momentos engraçados, situações inesperadas, histórias curiosas, vídeos com animais, conteúdos familiares, acontecimentos do cotidiano e outros registros que costumam gerar forte engajamento nas plataformas digitais.

Atualmente, nossa biblioteca conta com mais de 2.000 vídeos virais, sendo constantemente atualizada com novos conteúdos. Dessa forma, garantimos acesso a materiais recentes, relevantes e capazes de atrair a atenção do público em diferentes plataformas de mídia.`
  },
  {
    question: 'Por que o licenciamento é importante?',
    answer: `Licenciar conteúdo é fundamental para garantir que os vídeos sejam utilizados de forma legal e responsável, respeitando os direitos dos criadores originais.

Ao adquirir uma licença adequada, você obtém autorização oficial para utilizar o conteúdo, além de contar com maior segurança jurídica. Isso ajuda a evitar problemas como reivindicações de direitos autorais, remoções de conteúdo ou outras complicações legais relacionadas ao uso indevido de vídeos.`
  },
  {
    question: 'Vocês trabalham com vídeos avulsos?',
    answer: `Atualmente, não oferecemos licenciamento de vídeos individuais para uso monetizado em redes sociais. Nosso modelo é voltado para parcerias de longo prazo, que permitem aos nossos parceiros acessar uma biblioteca completa de conteúdos e expandir suas estratégias de distribuição de forma consistente.

Por meio de planos de assinatura de conteúdo, conseguimos oferecer maior flexibilidade para empresas, plataformas e veículos de mídia, além de garantir um fluxo contínuo de novos vídeos virais para utilização em diferentes projetos.

Se você quiser saber mais sobre nossas assinaturas de conteúdo ou tiver interesse em licenciar um vídeo específico para uso em televisão, produções audiovisuais ou outros formatos, entre em contato com nossa equipe pelo e-mail: licenciamento@nexomidias.com.br`
  },
  {
    question: 'O que inclui a assinatura da biblioteca?',
    answer: `Uma assinatura da biblioteca da Nexo Mídias oferece acesso a uma ampla coleção de vídeos virais autênticos e de alta qualidade, atualizada constantemente com novos conteúdos.

Ao assinar, você terá acesso a diversos benefícios:

Acesso ilimitado
Explore e utilize uma grande variedade de vídeos, incluindo momentos engraçados, situações inesperadas, conteúdos com animais, histórias curiosas e outros vídeos virais que geram alto engajamento.

Atualizações frequentes
Nossa biblioteca é atualizada regularmente com novos conteúdos, garantindo acesso contínuo aos vídeos mais recentes e relevantes.

Newsletter semanal
Receba uma newsletter com os principais vídeos virais da semana, ajudando você a acompanhar tendências e descobrir novos conteúdos para utilizar em suas plataformas.

Suporte dedicado
Nossa equipe está disponível para oferecer suporte sempre que necessário, auxiliando com dúvidas, licenciamento de conteúdos e qualquer necessidade relacionada à sua assinatura.`
  },
  {
    question: 'Vocês criam planos personalizados?',
    answer: `Sim, oferecemos assinaturas de conteúdo personalizadas.
Entendemos que cada empresa, plataforma ou veículo de mídia possui necessidades específicas. Por isso, trabalhamos em conjunto com nossos parceiros para desenvolver pacotes de conteúdo sob medida, alinhados aos objetivos e ao tipo de audiência de cada cliente.

Nossa equipe pode ajudar a selecionar vídeos, categorias de conteúdo e formatos que melhor atendam às suas estratégias de distribuição e publicação.

Para saber mais sobre assinaturas personalizadas ou discutir uma solução específica para o seu projeto, entre em contato conosco e teremos prazer em ajudar.`
  },
  {
    question: 'Como começo a licenciar vídeos?',
    answer: `Para licenciar vídeos da Nexo Mídias para sua plataforma, basta entrar em contato com nossa equipe através do e-mail: licenciamento@nexomidias.com.br

Nossa equipe de licenciamento irá orientá-lo em todas as etapas do processo, entendendo suas necessidades específicas e apresentando as melhores opções de acesso à nossa biblioteca de vídeos virais.

Também podemos ajudar na configuração de planos de assinatura de conteúdo ou na seleção de vídeos que melhor se encaixem nas suas estratégias de publicação e distribuição.`
  },
]

function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleFaq = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index))
    } else {
      setOpenIndexes([...openIndexes, index])
    }
  }

  return (
    <section className="faq">
      <div className="faq__container">
        <h2 className="faq__title">PERGUNTAS FREQUENTES</h2>

        <ul className="faq__list">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index)

            return (
              <li
                key={index}
                className={`faq__item ${isOpen ? 'active' : ''}`}
              >
                <button
                  className="faq__question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq__icon">+</span>
                </button>

                <div className="faq__answer">
                  <div className="faq__answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default FaqSection