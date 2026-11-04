import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

// Planta actual en el encabezado (flujo A1 del CU17). Sin planta elegida no se muestra
const WarehouseChipComponent = () => {
  const selected = useSelector((state) => state.warehouse.selected)
  const navigate = useNavigate()

  if (!selected) return null

  return (
    <button
      type="button"
      className="warehouse-chip"
      onClick={() => navigate('/seleccionar-planta')}
      aria-label={`Planta actual: ${selected.name}. Cambiar de planta`}
      title="Cambiar de planta"
    >
      <LocationIcon />
      <span className="warehouse-chip-name">{selected.name}</span>
    </button>
  )
}

export default WarehouseChipComponent
