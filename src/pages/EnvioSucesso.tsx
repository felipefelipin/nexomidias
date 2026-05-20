import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import "./EnvioSucesso.css"

function EnvioSucesso() {
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "auto" })
}, [])
  const navigate = useNavigate()

  return (
    <div className="sucesso-wrapper">

      <section className="sucesso-hero">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="check-circle"
        >
          ✓
        </motion.div>

        <h1>Parabéns! Seu vídeo foi enviado com sucesso para nossa plataforma!</h1>
      </section>

      <section className="sucesso-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sucesso-card"
        >
          <p>
            Gostaríamos de informar que acabamos de enviar um email contendo O CONTRATO DE CESSÃO DE DIREITOS AUTORAIS para o endereço de email fornecido por você. É importante ressaltar que esse email pode ser direcionado para a pasta de promoções ou spam, então, por favor, verifique essas pastas caso não o encontre em sua caixa de entrada.
          </p>

          <p>
            No email enviado, você encontrará o link para acessar o contrato.
          </p>

          <p>
            <strong>
              Lembramos que o Contrato de Cessão de Direitos Autorais é um requisito essencial para que possamos utilizar seu vídeo de acordo com as diretrizes estabelecidas.
            </strong>
            Caso você tenha alguma dúvida ou precise de esclarecimentos sobre o licenciamento do seu vídeo, fique à vontade para enviar um email para licenciamento@dommedia.com.br. Nossa equipe estará pronta para ajudá-lo(a) e fornecer as informações necessárias.
          </p>

          <p>Abraços.</p>

          <div className="sucesso-divider" />

          <p className="sucesso-footer">
            Distribuído por <strong>DOM MEDIA LTDA.</strong> Para consultas de licenciamento, entre em contato conosco em licenciamento@dommedia.com.br
          </p>

          <button
            className="sucesso-btn"
            onClick={() => navigate("/")}
          >
            Voltar para o início
          </button>
        </motion.div>
      </section>

    </div>
  )
}

export default EnvioSucesso