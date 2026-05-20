import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './RecuperarSenha.css'

function RecuperarSenha() {
  const navigate = useNavigate()

  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

 useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const hash = window.location.hash

  const typeFromSearch = searchParams.get('type')
  const isRecoveryFromHash = hash.includes('type=recovery')

  if (typeFromSearch === 'recovery' || isRecoveryFromHash) {
    setStep('reset')
  }
}, [])

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-senha`
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    alert('Email de recuperação enviado.')
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep('success')
  }

  return (
    <div className="recovery-page">
      <div className="recovery-card">

        {step === 'email' && (
          <>
            <h2>Recuperar senha</h2>
            <p>Digite seu e-mail abaixo. Enviaremos um link para redefinição.</p>

            <form onSubmit={handleSendEmail}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && <p className="error-text">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <h2>Redefinir senha</h2>

            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <p className="error-text">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Redefinindo...' : 'Redefinir'}
              </button>
            </form>
          </>
        )}

      </div>

      {step === 'success' && (
        <div className="success-overlay">
          <div className="success-modal">
            <h3>Senha alterada!</h3>
            <p>Agora, faça login em nosso site.</p>
            <button onClick={() => navigate('/entrar')}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecuperarSenha