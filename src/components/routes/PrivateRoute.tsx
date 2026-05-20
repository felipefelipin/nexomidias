import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function PrivateRoute({ children }: Props) {
  const { user } = useAuth()
  const [checkedSession, setCheckedSession] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckedSession(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // 🔒 Só redireciona se depois do delay não tiver usuário
  if (checkedSession && !user) {
    return <Navigate to="/entrar" replace />
  }

  return <>{children}</>
}

export default PrivateRoute