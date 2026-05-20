import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/* ==========================
   TIPOS DA APLICAÇÃO
========================== */

type AuthUser = {
  id: string
  email: string
  name: string
  pix_key: string | null
  role: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

/* ==========================
   PROVIDER
========================== */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  /* ==========================
     MONTA USUÁRIO FINAL
  ========================== */
  async function hydrateUser(userId: string, email: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, pix_key, role')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      setUser(null)
      return
    }

    setUser({
      id: userId,
      email,
      name: profile.name ?? '',
      pix_key: profile.pix_key,
      role: profile.role ?? 'user',
    })
  }

  /* ==========================
     CARREGA SESSÃO + PROFILE
  ========================== */
  useEffect(() => {
    const loadSession = async () => {
      setLoading(true)

      const { data } = await supabase.auth.getSession()

      if (!data.session?.user) {
        setUser(null)
        setLoading(false)
        return
      }

      await hydrateUser(data.session.user.id, data.session.user.email!)
      setLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoading(true)

        if (!session?.user) {
          setUser(null)
          setLoading(false)
          return
        }

        // 🔥 AQUI ESTÁ A ÚNICA ALTERAÇÃO
        // Removemos o await
        hydrateUser(session.user.id, session.user.email!)
        setLoading(false)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  /* ==========================
     LOGIN
  ========================== */
  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  /* ==========================
     CADASTRO
  ========================== */
  async function signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) throw error
  }

  /* ==========================
     LOGOUT
  ========================== */
  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ==========================
   HOOK
========================== */

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}