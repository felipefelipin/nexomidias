import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import './Configuracoes.css'

function Configuracoes() {
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPixKey(user.pix_key || '')
    }
  }, [user])

  function isStrongPassword(password: string) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  }

  async function handleSaveProfile(e?: React.FormEvent) {
    e?.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        pix_key: pixKey,
      })
      .eq('id', user.id)

    if (error) {
      setMessage('Erro ao salvar alterações.')
    } else {
      setMessage('Informações atualizadas com sucesso.')
    }

    setLoading(false)
  }

  async function handleChangePassword(e?: React.FormEvent) {
    e?.preventDefault()
    setPasswordMessage(null)

    if (!user?.email) {
      setPasswordMessage('Usuário inválido.')
      return
    }

    if (!currentPassword) {
      setPasswordMessage('Digite sua senha atual.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('As senhas não coincidem.')
      return
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordMessage('A nova senha deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.')
      return
    }

    // 🔐 Reautenticação real
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (reauthError) {
      setPasswordMessage('Senha atual incorreta.')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setPasswordMessage('Erro ao alterar senha.')
    } else {
      setPasswordMessage('Senha alterada com sucesso.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }

  return (
    <section className="nx-settings">
      <div className="nx-settings__wrap">
        <h1 className="nx-settings__title">Configurações do usuário</h1>
        <p className="nx-settings__subtitle">Atualize os detalhes da sua conta aqui</p>

        <div className="nx-settings__card">
          {/* ================== INFORMAÇÕES GERAIS ================== */}
          <div className="nx-settings__section">
            <h2 className="nx-settings__sectionTitle">Informações gerais</h2>

            <form className="nx-settings__form" onSubmit={handleSaveProfile}>
              <div className="nx-field">
                <label className="nx-field__label">Nome</label>
                <div className="nx-field__control">
                  <input
                    className="nx-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="nx-field">
                <label className="nx-field__label">Chave PIX</label>
                <div className="nx-field__control">
                  <input
                    className="nx-input"
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="Sua chave PIX"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="nx-actions">
                <button className="nx-btn" type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>

              {message && <p style={{ marginTop: 10, color: 'rgba(255,255,255,.85)' }}>{message}</p>}
            </form>
          </div>

          <div className="nx-settings__divider" />

          {/* ================== ALTERAR SENHA ================== */}
          <div className="nx-settings__section">
            <h2 className="nx-settings__sectionTitle">Alterar senha</h2>

            <form className="nx-settings__form" onSubmit={handleChangePassword}>
              <div className="nx-field">
                <label className="nx-field__label">Senha atual</label>
                <div className="nx-field__control">
                  <input
                    className="nx-input"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Senha atual"
                    autoComplete="current-password"
                  />
                  <button
                    className="nx-field__iconBtn"
                    type="button"
                    aria-label={showCurrentPassword ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    title={showCurrentPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="nx-field">
                <label className="nx-field__label">Nova senha</label>
                <div className="nx-field__control">
                  <input
                    className="nx-input"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha"
                    autoComplete="new-password"
                  />
                  <button
                    className="nx-field__iconBtn"
                    type="button"
                    aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                    onClick={() => setShowNewPassword((v) => !v)}
                    title={showNewPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="nx-field">
                <label className="nx-field__label">Confirme sua senha</label>
                <div className="nx-field__control">
                  <input
                    className="nx-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    autoComplete="new-password"
                  />
                  <button
                    className="nx-field__iconBtn"
                    type="button"
                    aria-label={showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    title={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="nx-actions">
                <button className="nx-btn" type="submit">
                  Alterar senha
                </button>
              </div>

              {passwordMessage && <p style={{ marginTop: 10, color: 'rgba(255,255,255,.85)' }}>{passwordMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Configuracoes