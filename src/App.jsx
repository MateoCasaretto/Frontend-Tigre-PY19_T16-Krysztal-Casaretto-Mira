import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DobleFactorPage from './pages/DobleFactorPage'
import ProtectedRoute from './guards/ProtectedRoute'
import RegisterPage from './pages/RegisterPage'
import CatalogImportPage from './pages/CatalogImportPage'
import BarcodePage from './pages/BarcodePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  return (
  <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
         <Route path="/home" element={<HomePage />} />
         <Route path="/doble-factor" element={<DobleFactorPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/importar-catalogo" element={<CatalogImportPage />} />
         <Route path="/codigos-de-barras" element={<BarcodePage />} />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={4000} theme="light" />
  </>
  )
}

export default App
