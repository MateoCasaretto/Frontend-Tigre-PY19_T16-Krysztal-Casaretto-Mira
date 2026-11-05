import { EDITABLE_CLASS } from '../../utils/MapUtils'

const HANDLE_RADIUS_PX = 8
const HIT_RADIUS_PX = 22
const STROKE_PX = 2

const cornersOf = ({ x, y, sizeX, sizeY }) => [
  { corner: 'nw', cx: x, cy: y, cursor: 'nwse-resize' },
  { corner: 'ne', cx: x + sizeX, cy: y, cursor: 'nesw-resize' },
  { corner: 'sw', cx: x, cy: y + sizeY, cursor: 'nesw-resize' },
  { corner: 'se', cx: x + sizeX, cy: y + sizeY, cursor: 'nwse-resize' },
]

// Manijas para cambiar el tamaño. Miden lo mismo en pantalla con cualquier zoom
const MapElementHandlesComponent = ({ element, pixelsPerMeter, dragHandlers }) => (
  <g aria-hidden="true">
    {cornersOf(element).map(({ corner, cx, cy, cursor }) => (
      <g key={corner} className={EDITABLE_CLASS} style={{ cursor }} {...dragHandlers(element, corner)}>
        <circle className="map-handle-hit" cx={cx} cy={cy} r={HIT_RADIUS_PX / pixelsPerMeter} />
        <circle className="map-handle" cx={cx} cy={cy} r={HANDLE_RADIUS_PX / pixelsPerMeter} strokeWidth={STROKE_PX / pixelsPerMeter} />
      </g>
    ))}
  </g>
)

export default MapElementHandlesComponent
