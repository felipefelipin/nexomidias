import { useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthLayout from '../layouts/AuthLayout'
import { useNavigate } from 'react-router-dom'

function RedefinirSenha() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError('Erro ao redefinir senha.')
    } else {
      setMessage('Senha redefinida com sucesso.')
      setTimeout(() => navigate('/entrar'), 1500)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page">
        <div className="login-right">
          <div className="login-card">
            <h2>Redefinir senha</h2>

            <form onSubmit={handleReset}>
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p style={{ color: '#e11d2e', fontSize: 13 }}>{error}</p>
              )}

              {message && (
                <p style={{ color: 'green', fontSize: 13 }}>{message}</p>
              )}

              <button type="submit">
                Redefinir senha
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default RedefinirSenha