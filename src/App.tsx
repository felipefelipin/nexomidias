import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './utils/ScrollToTop'

import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import PrivateRoute from './components/routes/PrivateRoute'
import AdminRoute from './components/routes/AdminRoute'

import Home from './pages/Home'
import Biblioteca from './pages/Biblioteca'
import SobreNos from './pages/SobreNos'
import EnvieVideo from './pages/EnvieVideo'
import Licenciamento from './pages/Licenciamento'
import Faq from './pages/Faq'
import Entrar from './pages/Login'
import CriarConta from './pages/CriarConta'
import RecuperarSenha from './pages/RecuperarSenha'
import Configuracoes from './pages/Configuracoes'
import AdminDashboard from './pages/AdminDashboard'
import EnvioSucesso from './pages/EnvioSucesso'
import MeusVideos from './pages/MeusVideos'
import Carteira from './pages/Carteira'
import Rendimentos from './pages/Rendimentos'
import PoliticaCookies from './pages/PoliticaCookies'
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'
import TermosUso from './pages/TermosUso'

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/sobre-nos" element={<MainLayout><SobreNos /></MainLayout>} />
        <Route path="/licenciamento" element={<MainLayout><Licenciamento /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><Faq /></MainLayout>} />
        <Route path="/politica-de-cookies" element={<MainLayout><PoliticaCookies /></MainLayout>} />
        <Route path="/politica-de-privacidade" element={<MainLayout><PoliticaPrivacidade /></MainLayout>} />
        <Route path="/termos-de-uso" element={<MainLayout><TermosUso /></MainLayout>} />

        <Route
          path="/biblioteca"
          element={
            <PrivateRoute>
              <MainLayout>
                <Biblioteca />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/meus-videos"
          element={
            <PrivateRoute>
              <MainLayout>
                <MeusVideos />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/envie-seu-video"
          element={
            <MainLayout>
              <EnvieVideo />
            </MainLayout>
          }
        />

        <Route
          path="/envio-sucesso"
          element={
            <MainLayout>
              <EnvioSucesso />
            </MainLayout>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <MainLayout>
                <Configuracoes />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/rendimentos"
          element={
            <PrivateRoute>
              <MainLayout>
                <Rendimentos />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/carteira"
          element={
            <PrivateRoute>
              <MainLayout>
                <Carteira />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </AdminRoute>
          }
        />

        <Route path="/entrar" element={<AuthLayout><Entrar /></AuthLayout>} />
        <Route path="/criar-conta" element={<AuthLayout><CriarConta /></AuthLayout>} />
        <Route path="/recuperar-senha" element={<AuthLayout><RecuperarSenha /></AuthLayout>} />
      </Routes>
    </>
  )
}

export default App