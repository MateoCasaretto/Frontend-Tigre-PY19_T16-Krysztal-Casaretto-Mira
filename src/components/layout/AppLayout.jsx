import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/usuario.slice'
import logo from '../../assets/logo-tigre-blanco.svg'

const IconoVolver = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

const IconoSalir = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M15 8l4 4-4 4M19 12H9" />
  </svg>
)

// Estructura común de las pantallas con sesión: header de marca a todo el ancho y contenido centrado
const AppLayout = ({ title, back = false, children }) => {
  const nombreUsuario = useSelector((state) => state.usuario.nombreUsuario)
  const rol = useSelector((state) => state.usuario.rol)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cerrarSesion = () => {
    dispatch(logout())
    navigate('/', { replace: true })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          {back && (
            <button type="button" className="app-header-button" onClick={() => navigate('/home')} aria-label="Volver al inicio">
              <IconoVolver />
            </button>
          )}
          <img className={back ? 'app-header-logo app-header-logo--secondary' : 'app-header-logo'} src={logo} alt="Tigre" />
          <h1 className="app-header-title">{title}</h1>
          <div className="app-user">
            <span className="app-user-name">{nombreUsuario}</span>
            {rol && <span className="app-user-role">{rol}</span>}
          </div>
          <button type="button" className="app-header-button" onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión">
            <IconoSalir />
          </button>
        </div>
      </header>

      <main className="app-content">{children}</main>
    </div>
  )
}

export default AppLayout
