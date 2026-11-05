import { MIN_POSITION_WIDTH, getBayMinWidth, levelsFromTop, positionsInBay } from '../../utils/RackUtils'

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 17v5M9 3h6l-1 7 3 4H7l3-4z" />
  </svg>
)

const positionClass = (position, selected) => {
  const state = position.active ? (position.fixedProduct ? ' rack-position--fixed' : '') : ' rack-position--inactive'
  return `rack-position${state}${selected ? ' rack-selected' : ''}`
}

const positionTitle = ({ label, active, fixedProduct }) => {
  if (!active) return `${label}: desactivada`
  return fixedProduct ? `${label}: ${fixedProduct.description}` : label
}

// Tabla de la estantería: cada tramo es una columna de ancho fijo y dentro de cada uno las posiciones reparten el lugar.
// Con `editable` también se pueden elegir niveles y columnas
const RackGridComponent = ({ rack, selection, onSelect, editable = false }) => {
  const isSelected = (type, id) => selection?.type === type && selection.id === id
  const gridStyle = {
    gridTemplateColumns: `${MIN_POSITION_WIDTH + 8}px repeat(${rack.bays.length}, minmax(${getBayMinWidth(rack)}px, 1fr))`,
  }

  return (
    <div className="rack-grid-scroll">
      <div className="rack-grid" style={gridStyle}>
        <span className="rack-corner" />
        {rack.bays.map((bay) => (
          <div key={bay._id} className="rack-bay rack-bay--columns">
            {bay.columns.map((column) => (
              <button
                key={column._id}
                type="button"
                className={`rack-column${isSelected('column', column._id) ? ' rack-selected' : ''}`}
                title={`Columna ${column.label}`}
                disabled={!editable}
                onClick={() => onSelect({ type: 'column', id: column._id })}
              >
                {column.label}
              </button>
            ))}
          </div>
        ))}

        {levelsFromTop(rack).map((level) => (
          <div key={level._id} className="rack-row">
            <button
              type="button"
              className={`rack-level${isSelected('level', level._id) ? ' rack-selected' : ''}`}
              title={level.label}
              disabled={!editable}
              onClick={() => onSelect({ type: 'level', id: level._id })}
            >
              {level.label}
            </button>
            {rack.bays.map((bay) => (
              <div key={bay._id} className="rack-bay">
                {positionsInBay(level, bay._id).map((position) => (
                  <button
                    key={position._id}
                    type="button"
                    className={positionClass(position, isSelected('position', position._id))}
                    title={positionTitle(position)}
                    aria-label={`Posición ${positionTitle(position)}`}
                    disabled={!editable && !position.active}
                    onClick={() => onSelect({ type: 'position', id: position._id })}
                  >
                    {position.active ? (
                      <>
                        {position.fixedProduct && <PinIcon />}
                        <span className="rack-position-label">{position.label}</span>
                      </>
                    ) : '—'}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RackGridComponent
