import { useRef } from 'react'
import { isRack } from '../../utils/MapUtils'

const TAP_TOLERANCE = 8
const CORNER_RADIUS = 0.15
const LABEL_RATIO = 0.55
const MAX_LABEL_SIZE = 1.1
const CHAR_WIDTH_RATIO = 0.62

// Nombre recortado al largo del elemento: completo se ve al seleccionarlo
const fitLabel = (name, length, fontSize) => {
  const maxChars = Math.max(1, Math.floor((length * 0.9) / (fontSize * CHAR_WIDTH_RATIO)))
  return name.length <= maxChars ? name : `${name.slice(0, Math.max(1, maxChars - 1))}…`
}

// Estantería o zona de piso. Un toque selecciona; un arrastre, en cambio, mueve el plano
const MapElementShapeComponent = ({ element, hitPadding, selected, className = '', onSelect, ...rest }) => {
  const pressed = useRef(null)
  const { x, y, sizeX, sizeY, name } = element
  const vertical = sizeY > sizeX
  const fontSize = Math.min(Math.min(sizeX, sizeY) * LABEL_RATIO, MAX_LABEL_SIZE)
  const centerX = x + sizeX / 2
  const centerY = y + sizeY / 2
  const type = isRack(element) ? 'map-element--rack' : 'map-element--zone'

  const handlePointerDown = (event) => {
    pressed.current = { x: event.clientX, y: event.clientY }
    rest.onPointerDown?.(event)
  }

  const handleClick = (event) => {
    const start = pressed.current
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_TOLERANCE) return
    onSelect?.(element)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelect?.(element)
  }

  return (
    <g
      {...rest}
      className={`map-element ${type}${selected ? ' map-element--selected' : ''} ${className}`.trim()}
      role="button"
      tabIndex={0}
      aria-label={name}
      aria-pressed={selected}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <title>{name}</title>
      <rect
        className="map-element-hit"
        x={x - hitPadding}
        y={y - hitPadding}
        width={sizeX + hitPadding * 2}
        height={sizeY + hitPadding * 2}
      />
      <rect className="map-element-body" x={x} y={y} width={sizeX} height={sizeY} rx={CORNER_RADIUS} />
      <text
        className="map-element-label"
        x={centerX}
        y={centerY}
        fontSize={fontSize}
        transform={vertical ? `rotate(-90 ${centerX} ${centerY})` : undefined}
      >
        {fitLabel(name, Math.max(sizeX, sizeY), fontSize)}
      </text>
    </g>
  )
}

export default MapElementShapeComponent
