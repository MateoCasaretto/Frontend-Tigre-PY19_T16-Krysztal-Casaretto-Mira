import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/LOGO_TIGRE.png'

const IconoEscudo = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-2.9 8.2-7 10-4.1-1.8-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const IconoFlecha = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const HomePage = () => {
  const nombreUsuario = useSelector((state) => state.usuario.nombreUsuario)
  const rol = useSelector((state) => state.usuario.rol)
  const dobleFactor = useSelector((state) => state.usuario.twoFactorEnabled)
  const navigate = useNavigate()

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-header-title">Inicio</h1>
        <div className="home-logo">
          <img src={logo} alt="Tigre" />
        </div>
      </header>

      <main className="home-content">
        <div className="home-welcome">
          <h2 className="home-greeting">Hola, {nombreUsuario ?? 'usuario'}</h2>
          {rol && <span className="home-role">{rol}</span>}
        </div>

        {!dobleFactor && (
          <p className="home-alert" role="alert">
            Debes activar la autenticación en dos factores
          </p>
        )}

        {!dobleFactor ? (
          <button type="button" className="home-card home-card--primary" onClick={() => navigate('/doble-factor')}>
            <span className="home-card-icon"><IconoEscudo /></span>
            <span className="home-card-text">
              <span className="home-card-title">Activar doble factor</span>
              <span className="home-card-sub">Protegé tu cuenta con una app de autenticación</span>
            </span>
            <span className="home-card-arrow"><IconoFlecha /></span>
          </button>
        ) : (
          <div className="home-card home-card--ok">
            <span className="home-card-icon"><IconoEscudo /></span>
            <span className="home-card-text">
              <span className="home-card-title">Cuenta protegida</span>
              <span className="home-card-sub">La autenticación en dos factores está activa</span>
            </span>
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
