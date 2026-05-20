import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      style={{
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </motion.div>
  )
}

export default AuthLayout