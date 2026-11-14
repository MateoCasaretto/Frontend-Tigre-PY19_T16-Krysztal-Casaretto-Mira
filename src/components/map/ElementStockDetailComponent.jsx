import { useMemo, useState } from 'react'
import EmptyStateComponent from '../common/EmptyStateComponent'
import LoaderPata from '../common/LoaderPata'
import SectionCardComponent from '../common/SectionCardComponent'
import LocationStockComponent from './LocationStockComponent'
import RackGridComponent from './RackGridComponent'
import RackLegendComponent from './RackLegendComponent'
import { useElementStock } from '../../hooks/useElementStock'
import { isRack } from '../../utils/MapUtils'
import { findPosition } from '../../utils/RackUtils'

const PositionHeader = ({ rack, positionId }) => {
  const { level, position } = findPosition(rack, positionId)

  return (
    <dl className="map-position-summary">
      <dt>Posición</dt>
      <dd>{position.label}</dd>
      <dt>Nivel</dt>
      <dd>{level.label}</dd>
      {position.fixedProduct && (
        <>
          <dt>Producto fijo</dt>
          <dd>{position.fixedProduct.sapCode} · {position.fixedProduct.description}</dd>
        </>
      )}
    </dl>
  )
}

// CU08: al tocar un elemento del plano se ve su contenido. En una estantería, primero se elige la posición
const ElementStockDetailComponent = ({ warehouseId, element, onClose }) => {
  const [selection, setSelection] = useState(null)
  const { stock, stockAt, loading, error, reload } = useElementStock(warehouseId, element._id)
  // RN37: una posición con al menos un producto con stock se pinta como ocupada
  const occupiedIds = useMemo(() => new Set(stock.map((item) => item.positionId).filter(Boolean)), [stock])
  const rack = isRack(element)
  const positionId = selection?.type === 'position' ? selection.id : null

  const renderStock = () => {
    if (loading) return <LoaderPata texto="Cargando el contenido..." />
    if (error) {
      return (
        <EmptyStateComponent message={error}>
          <button type="button" className="form-secondary" onClick={reload}>Reintentar</button>
        </EmptyStateComponent>
      )
    }
    if (!rack) return <LocationStockComponent items={stockAt(null)} />
    if (!positionId) return <p className="twofa-text map-position-hint">Tocá una posición para ver sus productos.</p>
    return (
      <>
        <PositionHeader rack={element} positionId={positionId} />
        <LocationStockComponent key={positionId} items={stockAt(positionId)}  elementId={element._id} positionId={positionId} onChanged={reload} />
      </>
    )
  }

  return (
    <SectionCardComponent title={element.name}>
      {rack ? (
        <>
          <RackGridComponent rack={element} selection={selection} onSelect={setSelection} occupiedIds={occupiedIds} />
          <RackLegendComponent showOccupied />
        </>
      ) : (
        element.description && <p className="twofa-text">{element.description}</p>
      )}
      {renderStock()}
      <button type="button" className="form-secondary map-back" onClick={onClose}>Volver al plano</button>
    </SectionCardComponent>
  )
}

export default ElementStockDetailComponent
