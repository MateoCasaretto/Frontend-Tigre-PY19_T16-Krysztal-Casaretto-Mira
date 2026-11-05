import { useNavigate } from 'react-router-dom'

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const MapIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

// Tarjeta de la home para todos los perfiles (CU03)
const MapNavCardComponent = () => {
  const navigate = useNavigate()

  return (
    <button type="button" className="home-card" onClick={() => navigate('/mapa')}>
      <span className="home-card-icon"><MapIcon /></span>
      <span className="home-card-text">
        <span className="home-card-title">Mapa</span>
        <span className="home-card-sub">Ver el plano de la planta y sus estanterías</span>
      </span>
      <span className="home-card-arrow"><ArrowIcon /></span>
    </button>
  )
}

export default MapNavCardComponent
