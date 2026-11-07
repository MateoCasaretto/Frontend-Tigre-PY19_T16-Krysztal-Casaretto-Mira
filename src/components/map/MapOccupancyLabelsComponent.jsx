import { isRack } from '../../utils/MapUtils'

const SIZE_RATIO = 0.28
const MIN_SIZE = 0.25
const MAX_SIZE = 0.45
const PADDING_RATIO = 0.5

const occupancyText = (element, { occupiedPositions, totalPositions, productCount }) =>
  isRack(element) ? `${occupiedPositions}/${totalPositions}` : `${productCount} prod.`

const occupancyTitle = (element, { occupiedPositions, totalPositions, productCount }) =>
  isRack(element)
    ? `${occupiedPositions} de ${totalPositions} posiciones ocupadas`
    : `${productCount} ${productCount === 1 ? 'producto' : 'productos'}`

// CU03: posiciones ocupadas de cada estantería (o productos de cada zona), discreto en la esquina superior derecha.
// Va encima del plano y no recibe toques: el toque llega al elemento
const MapOccupancyLabelsComponent = ({ elements, occupancy, selectedId }) => (
  <g className="map-occupancy" aria-hidden="true">
    {elements.map((element) => {
      const item = occupancy.get(element._id)
      if (!item) return null
      const { x, y, sizeX, sizeY } = element
      const fontSize = Math.min(Math.max(Math.min(sizeX, sizeY) * SIZE_RATIO, MIN_SIZE), MAX_SIZE)
      const padding = fontSize * PADDING_RATIO
      return (
        <text
          key={element._id}
          className={`map-occupancy-label${element._id === selectedId ? ' map-occupancy-label--selected' : ''}`}
          x={x + sizeX - padding}
          y={y + padding}
          fontSize={fontSize}
        >
          <title>{occupancyTitle(element, item)}</title>
          {occupancyText(element, item)}
        </text>
      )
    })}
  </g>
)

export default MapOccupancyLabelsComponent
