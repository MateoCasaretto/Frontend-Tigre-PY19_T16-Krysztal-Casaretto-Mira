import LoginForm from '../components/auth/LoginForm.jsx'
import AuthBrand from '../components/auth/AuthBrand.jsx'

const LoginPage = () => {
  return (
    <div className="auth-page">
      <AuthBrand />
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresá tus credenciales para continuar</p>
        <LoginForm />
      </div>
      <p className="auth-footer">© 2026 Tigre</p>
    </div>
  )
}

export default LoginPage
