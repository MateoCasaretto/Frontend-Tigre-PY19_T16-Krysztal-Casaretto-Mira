import { useState } from 'react'
import RackGridComponent from './RackGridComponent'
import RackLegendComponent from './RackLegendComponent'
import SectionCardComponent from '../common/SectionCardComponent'
import { isRack } from '../../utils/MapUtils'
import { findPosition } from '../../utils/RackUtils'

const PositionSummary = ({ rack, positionId }) => {
  const { level, position } = findPosition(rack, positionId)
  const { fixedProduct } = position

  return (
    <dl className="map-position-summary" aria-live="polite">
      <dt>Posición</dt>
      <dd>{position.label}</dd>
      <dt>Nivel</dt>
      <dd>{level.label}</dd>
      {fixedProduct && (
        <>
          <dt>Producto fijo</dt>
          <dd>{fixedProduct.sapCode} · {fixedProduct.description}</dd>
        </>
      )}
    </dl>
  )
}

// Lo que se ve al tocar un elemento del plano: la tabla de la estantería o los datos de la zona
const ElementDetailComponent = ({ element, onClose }) => {
  const [selection, setSelection] = useState(null)

  return (
    <SectionCardComponent title={element.name}>
      {isRack(element) ? (
        <>
          <RackGridComponent rack={element} selection={selection} onSelect={setSelection} />
          <RackLegendComponent />
          {selection && <PositionSummary rack={element} positionId={selection.id} />}
        </>
      ) : (
        <p className="twofa-text">{element.description || 'Zona de piso'}</p>
      )}
      <button type="button" className="form-secondary map-back" onClick={onClose}>Volver al plano</button>
    </SectionCardComponent>
  )
}

export default ElementDetailComponent
