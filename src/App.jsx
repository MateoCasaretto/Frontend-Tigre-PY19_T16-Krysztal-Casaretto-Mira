import './App.css'
import './styles/Warehouses.css'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DobleFactorPage from './pages/DobleFactorPage'
import ProtectedRoute from './guards/ProtectedRoute'
import WarehouseGuard from './guards/WarehouseGuard'
import RegisterPage from './pages/RegisterPage'
import CatalogImportPage from './pages/CatalogImportPage'
import BarcodePage from './pages/BarcodePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import WarehouseSelectionPage from './pages/WarehouseSelectionPage'
import WarehousesPage from './pages/WarehousesPage'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/doble-factor" element={<DobleFactorPage />} />
          <Route path="/seleccionar-planta" element={<WarehouseSelectionPage />} />

          {/* Fuera del guard: el primer administrador tiene que poder crear una planta */}
          <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
            <Route path="/plantas" element={<WarehousesPage />} />
          </Route>

          <Route element={<WarehouseGuard />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/codigos-de-barras" element={<BarcodePage />} />
            <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/importar-catalogo" element={<CatalogImportPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={4000} theme="light" />
    </>
  )
}

export default App