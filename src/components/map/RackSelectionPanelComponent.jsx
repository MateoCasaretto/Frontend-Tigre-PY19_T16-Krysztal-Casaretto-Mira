import { useId } from 'react'
import FixedProductPickerComponent from './FixedProductPickerComponent'
import {
  addBay, addColumn, addLevel, addPosition, findColumn, findPosition, removeBay, removeColumn, removeLevel, removePosition,
  renameColumn, renameLevel, renamePosition, setFixedProduct, togglePosition,
} from '../../utils/RackUtils'

const NameField = ({ label, value, onChange }) => {
  const id = useId()
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" maxLength={20} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

const Action = ({ onClick, danger = false, children }) => (
  <button type="button" className={`form-secondary${danger ? ' editor-danger' : ''}`} onClick={onClick}>{children}</button>
)

const LevelPanel = ({ rack, id, onChange, onClear }) => (
  <>
    <NameField label="Nombre del nivel" value={rack.levels.find(({ _id }) => _id === id).label} onChange={(label) => onChange((current) => renameLevel(current, id, label))} />
    <div className="editor-actions">
      <Action onClick={() => onChange(addLevel)}>Agregar nivel arriba</Action>
      {rack.levels.length > 1 && <Action danger onClick={() => { onChange((current) => removeLevel(current, id)); onClear() }}>Quitar nivel</Action>}
    </div>
  </>
)

const ColumnPanel = ({ rack, id, onChange, onClear }) => {
  const { bay, column } = findColumn(rack, id)
  return (
    <>
      <NameField label="Nombre de la columna" value={column.label} onChange={(label) => onChange((current) => renameColumn(current, id, label))} />
      <div className="editor-actions">
        <Action onClick={() => onChange((current) => addColumn(current, bay._id))}>Agregar columna al tramo</Action>
        {bay.columns.length > 1 && <Action danger onClick={() => { onChange((current) => removeColumn(current, id)); onClear() }}>Quitar columna</Action>}
        <Action onClick={() => onChange(addBay)}>Agregar tramo al final</Action>
        {rack.bays.length > 1 && <Action danger onClick={() => { onChange((current) => removeBay(current, bay._id)); onClear() }}>Quitar este tramo</Action>}
      </div>
    </>
  )
}

const PositionPanel = ({ rack, id, onChange, onClear }) => {
  const { level, position } = findPosition(rack, id)
  const inBay = level.positions.filter(({ bayId }) => bayId === position.bayId).length

  return (
    <>
      <NameField label="Nombre de la posición" value={position.label} onChange={(label) => onChange((current) => renamePosition(current, id, label))} />
      <div className="editor-actions">
        <Action onClick={() => onChange((current) => togglePosition(current, id))}>{position.active ? 'Desactivar' : 'Activar'}</Action>
        <Action onClick={() => onChange((current) => addPosition(current, level._id, position.bayId))}>Agregar posición</Action>
        {inBay > 1 && <Action danger onClick={() => { onChange((current) => removePosition(current, id)); onClear() }}>Quitar posición</Action>}
      </div>
      {position.active && (
        <FixedProductPickerComponent
          key={id}
          product={position.fixedProduct}
          onChange={(product) => onChange((current) => setFixedProduct(current, id, product))}
        />
      )}
    </>
  )
}

const PANELS = { level: LevelPanel, column: ColumnPanel, position: PositionPanel }

// Lo que se puede hacer con el nivel, la columna o la posición elegida en la tabla
const RackSelectionPanelComponent = ({ rack, selection, onChange, onClear }) => {
  if (!selection) return <p className="twofa-text">Elegí un nivel, una columna o una posición.</p>
  const Panel = PANELS[selection.type]

  return (
    <div className="editor-panel">
      <Panel rack={rack} id={selection.id} onChange={onChange} onClear={onClear} />
    </div>
  )
}

export default RackSelectionPanelComponent
