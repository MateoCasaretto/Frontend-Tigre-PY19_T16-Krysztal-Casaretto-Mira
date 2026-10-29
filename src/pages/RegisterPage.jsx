import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

const IconoVolver = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

const RegisterPage = () => {
  const navigate = useNavigate()

  return (
    <div className="home">
      <header className="home-header">
        <button type="button" className="page-back" onClick={() => navigate('/home')} aria-label="Volver al inicio">
          <IconoVolver />
        </button>
        <h1 className="home-header-title">Registrar usuario</h1>
        <span className="page-back-spacer" aria-hidden="true" />
      </header>

      <main className="home-content">
        <section className="twofa-card">
          <p className="twofa-text">
            Completá los datos para dar de alta un nuevo usuario.
          </p>
          <RegisterForm />
        </section>
      </main>
    </div>
  )
}

export default RegisterPage
