import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* COLUNA 1 */}
        <div className="footer-brand">

          <img
            src="/nexomidias-logo.png"
            alt="Nexo Midias"
            className="footer-logo"
          />

          <p className="footer-address">
            R Dona Luzia Patrocinio, 54, Andar Superior,
            <br />
            Centro, Frei Lagonegro/MG, CEP: 39.708-000.
          </p>

        </div>

        {/* COLUNA 2 */}
        <div className="footer-links">
          <h4>Links</h4>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/sobre-nos">Sobre Nós</Link>
            </li>

            <li>
              <Link to="/envie-seu-video">Envie Seu Vídeo</Link>
            </li>

            <li>
              <Link to="/biblioteca">Biblioteca</Link>
            </li>

            <li>
              <Link to="/licenciamento">Licenciamento</Link>
            </li>
          </ul>

        </div>

        {/* COLUNA 3 */}
        <div className="footer-help">

          <h4>Ajuda</h4>

          <ul>
            <li>
              <Link to="/politica-de-cookies">Política de Cookies</Link>
            </li>

            <li>
              <Link to="/politica-de-privacidade">Política de Privacidade</Link>
            </li>

            <li>
              <Link to="/termos-de-uso">Termos de Uso</Link>
            </li>
          </ul>

        </div>

      </div>

      <div className="footer-bottom">
        <p>©2026 NEXO MIDIAS – Todos os direitos reservados</p>
      </div>

    </footer>
  )
}

export default Footer