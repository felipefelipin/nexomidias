import "./Login.css"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

import AuthLayout from "../layouts/AuthLayout"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

function Entrar() {
  const [userType, setUserType] = useState<"creator" | "company">("creator")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(email, password)

      const { data } = await supabase.auth.getSession()
      console.log("SESSION AFTER LOGIN:", data.session)

      if (!data.session) {
        setError("Sessão não criada. Verifique credenciais.")
        setSubmitting(false)
        return
      }

      const from = (location.state as any)?.from?.pathname || "/"
      navigate(from, { replace: true })
    } catch (err: any) {
      console.log("LOGIN ERROR:", err)
      setError(err.message ?? "Erro ao entrar")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page">
        <div className="login-left">
          <div className="login-brand">
            <h1>Entre e continue crescendo com a NEXO MIDIAS.</h1>
            <p>
              Acesse sua conta para enviar vídeos, acompanhar rendimentos,
              gerenciar oportunidades e controlar sua área de forma simples e profissional.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Acesse sua conta</h2>

            <div className="login-tabs">
              <button
                type="button"
                className={userType === "creator" ? "active" : ""}
                onClick={() => setUserType("creator")}
              >
                SOU CRIADOR
              </button>

              <button
                type="button"
                className={userType === "company" ? "active" : ""}
                onClick={() => setUserType("company")}
              >
                SOU EMPRESA
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <p className="login-forgot">
                <Link to="/recuperar-senha">Esqueceu sua senha?</Link>
              </p>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="login-footer">
              Novo por aqui? <Link to="/criar-conta">Criar conta</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Entrar