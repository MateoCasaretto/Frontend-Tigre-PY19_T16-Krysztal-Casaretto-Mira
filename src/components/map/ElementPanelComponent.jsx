import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepperFieldComponent from './StepperFieldComponent'
import { GRID_STEP, isRack } from '../../utils/MapUtils'

const FIELDS = [
  { key: 'x', label: 'Posición X (m)', min: 0 },
  { key: 'y', label: 'Posición Y (m)', min: 0 },
  { key: 'sizeX', label: 'Ancho (m)', min: GRID_STEP },
  { key: 'sizeY', label: 'Largo (m)', min: GRID_STEP },
]

const FloorZoneFields = ({ element, onSave }) => {
  const idName = useId()
  const idDescription = useId()
  const [name, setName] = useState(element.name)
  const [description, setDescription] = useState(element.description ?? '')

  return (
    <>
      <div className="form-field">
        <label htmlFor={idName}>Nombre</label>
        <input id={idName} type="text" maxLength={60} value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor={idDescription}>Descripción</label>
        <input id={idDescription} type="text" maxLength={150} value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      <button type="button" className="form-secondary" disabled={!name.trim()} onClick={() => onSave({ name, description })}>
        Guardar nombre y descripción
      </button>
    </>
  )
}

// Datos del elemento elegido en el plano
const ElementPanelComponent = ({ element, onPlace, onSaveFloorZone, onRemove, onClose, canOpenRack }) => {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="editor-panel">
      <h3 className="editor-title">{element.name}</h3>
      <div className="editor-steppers">
        {FIELDS.map(({ key, label, min }) => (
          <StepperFieldComponent key={key} label={label} min={min} value={element[key]} onChange={(value) => onPlace(element._id, { [key]: value })} />
        ))}
      </div>

      {isRack(element) ? (
        <button
          type="button"
          className="form-secondary"
          disabled={!canOpenRack}
          title={canOpenRack ? undefined : 'Guardá el plano primero'}
          onClick={() => navigate(`/estructura-planta/${element._id}`)}
        >
          Editar niveles y posiciones
        </button>
      ) : (
        <FloorZoneFields key={element._id} element={element} onSave={onSaveFloorZone} />
      )}

      {confirming ? (
        <div className="editor-actions">
          <button type="button" className="form-secondary editor-danger" onClick={onRemove}>Sí, eliminar</button>
          <button type="button" className="form-secondary" onClick={() => setConfirming(false)}>Cancelar</button>
        </div>
      ) : (
        <button type="button" className="form-secondary editor-danger" onClick={() => setConfirming(true)}>Eliminar del plano</button>
      )}
      <button type="button" className="form-secondary" onClick={onClose}>Cerrar</button>
    </div>
  )
}

export default ElementPanelComponent
