import { toast } from 'react-toastify'

const PENDING_MESSAGE = 'Esta acción estará disponible en una próxima versión.'

// CU08 A2: acciones sobre la ubicación (CU05, CU21 y CU22). Por ahora solo avisan que todavía no están
const LocationActionsComponent = ({ hasStock }) => {
  const notifyPending = () => toast.info(PENDING_MESSAGE)

  return (
    <div className="location-actions">
      <button type="button" className="form-secondary" onClick={notifyPending}>Agregar stock</button>
      {hasStock && (
        <>
          <button type="button" className="form-secondary" onClick={notifyPending}>Disminuir stock</button>
          <button type="button" className="form-secondary" onClick={notifyPending}>Trasladar</button>
        </>
      )}
    </div>
  )
}

export default LocationActionsComponent
