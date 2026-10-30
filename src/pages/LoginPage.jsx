import LoginForm from '../components/auth/LoginForm.jsx'
import logo from '../assets/logo-tigre.svg'

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Tigre" />
        </div>
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresá tus credenciales para continuar</p>
        <LoginForm />
      </div>
      <p className="auth-footer">© 2026 Tigre</p>
    </div>
  )
}

export default LoginPage
