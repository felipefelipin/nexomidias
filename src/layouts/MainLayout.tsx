import Header from '../components/home/layout/Header'
import Footer from '../components/home/layout/Footer'

type Props = {
  children: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <>
      {/* Header fixo — nunca anima */}
      <Header />

      {/* Conteúdo estrutural — nunca anima */}
      <main
        style={{
          minHeight: 'calc(100vh - 78px)',
          width: '100%',
        }}
      >
        {children}
      </main>

      {/* Footer fixo — nunca anima */}
      <Footer />
    </>
  )
}

export default MainLayout