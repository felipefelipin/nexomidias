import './CriarConta.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'

declare global {
  interface Window {
    turnstile: any
  }
}

/* ======================
   VALIDAÇÕES
====================== */

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function isValidCPF(value: string) {
  return /^\d{11}$/.test(value.replace(/\D/g, ''))
}

function isValidCNPJ(value: string) {
  return /^\d{14}$/.test(value.replace(/\D/g, ''))
}

function isValidPhone(value: string) {
  return /^\d{10,11}$/.test(value.replace(/\D/g, ''))
}

function isValidPixKey(pix: string) {
  return (
    isValidEmail(pix) ||
    isValidCPF(pix) ||
    isValidCNPJ(pix) ||
    isValidPhone(pix) ||
    pix.length >= 20
  )
}

function CriarConta() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pixKey, setPixKey] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const turnstileWidgetId = useRef<string | null>(null)
  const tokenResolver = useRef<((token: string) => void) | null>(null)

  /* ======================
     TURNSTILE INVISÍVEL (CORRIGIDO)
  ====================== */

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.turnstile && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(
          '#turnstile-container',
          {
            sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
            size: 'invisible',
            callback: (token: string) => {
              tokenResolver.current?.(token)
              tokenResolver.current = null
            },
          }
        )
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  /* ======================
     SUBMIT
  ====================== */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    setError(null)

    if (!isValidEmail(email)) {
      setError('Digite um email válido.')
      return
    }

    if (!isStrongPassword(password)) {
      setError(
        'A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (!isValidPixKey(pixKey)) {
      setError('Chave PIX inválida.')
      return
    }

    if (!turnstileWidgetId.current) {
      setError('Falha na verificação de segurança.')
      return
    }

    setLoading(true)

    try {
      const turnstileToken = await new Promise<string>((resolve, reject) => {
        tokenResolver.current = resolve
        window.turnstile.execute(turnstileWidgetId.current)
        setTimeout(() => reject(), 8000)
      })

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name, // ✅ ADICIONADO
            email,
            password,
            pixKey,
            turnstileToken,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Erro ao criar conta.')
        return
      }

      navigate('/entrar', { replace: true })
    } catch {
      setError('Falha na verificação de segurança. Tente novamente.')
    } finally {
      setLoading(false)
      window.turnstile.reset(turnstileWidgetId.current)
    }
  }

  return (
    <AuthLayout>
      <div className="signup-page">
        <div className="signup-left">
          <div className="signup-brand">
          </div>
        </div>

        <div className="signup-right">
          <div className="signup-card">
            <h2>Crie sua conta</h2>

            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirme sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <input type="text" placeholder="Chave PIX" value={pixKey} onChange={(e) => setPixKey(e.target.value)} required />

              <div id="turnstile-container" style={{ display: 'none' }} />

              {error && (
                <p style={{ color: '#e11d2e', fontSize: 13 }}>{error}</p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="signup-footer">
              Já possui uma conta? <Link to="/entrar">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default CriarConta