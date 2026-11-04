import { useNavigate } from 'react-router-dom'

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const WarehouseIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21V9l9-5 9 5v12" />
    <path d="M7 21v-8h10v8M7 17h10" />
  </svg>
)

const UsersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="4" />
    <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    <path d="M16 4.5a4 4 0 0 1 0 7M18 14.5c2.4.7 4 2.8 4 5.5" />
  </svg>
)

const CARDS = [
  { path: '/plantas', title: 'Plantas', subtitle: 'Crear y editar las plantas', Icon: WarehouseIcon },
  { path: '/usuarios', title: 'Usuarios', subtitle: 'Asignar operarios a cada planta', Icon: UsersIcon },
]

// Tarjetas de la home para el perfil Administrador (CU17)
const AdminNavCardsComponent = () => {
  const navigate = useNavigate()

  return CARDS.map(({ path, title, subtitle, Icon }) => (
    <button key={path} type="button" className="home-card" onClick={() => navigate(path)}>
      <span className="home-card-icon"><Icon /></span>
      <span className="home-card-text">
        <span className="home-card-title">{title}</span>
        <span className="home-card-sub">{subtitle}</span>
      </span>
      <span className="home-card-arrow"><ArrowIcon /></span>
    </button>
  ))
}

export default AdminNavCardsComponent
