import MapElementShapeComponent from './MapElementShapeComponent'
import { GRID_STEP, getHitPadding } from '../../utils/MapUtils'

const GRID_PATTERN_ID = 'map-grid'
const GRID_CELLS_PER_LINE = 2

// Plano en SVG: un metro del depósito es una unidad del viewBox. `children` se dibuja encima de los elementos
const MapCanvasComponent = ({ svgRef, plan, elements, selectedId, showGrid = false, onSelect, getShapeProps, children }) => {
  const gridSize = GRID_STEP * GRID_CELLS_PER_LINE

  return (
    <svg ref={svgRef} className="map-canvas" viewBox={`0 0 ${plan.width} ${plan.height}`} aria-label="Plano de la planta">
      {showGrid && (
        <defs>
          <pattern id={GRID_PATTERN_ID} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path className="map-grid-line" d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} />
          </pattern>
        </defs>
      )}
      <rect className="map-floor" width={plan.width} height={plan.height} />
      {showGrid && <rect width={plan.width} height={plan.height} fill={`url(#${GRID_PATTERN_ID})`} />}
      {elements.map((element) => (
        <MapElementShapeComponent
          key={element._id}
          element={element}
          hitPadding={getHitPadding(element, elements)}
          selected={element._id === selectedId}
          onSelect={onSelect}
          {...getShapeProps?.(element)}
        />
      ))}
      {children}
    </svg>
  )
}

export default MapCanvasComponent
