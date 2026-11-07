// `showOccupied` (opcional) suma la ocupación, que solo se ve en el mapa (CU03)
const RackLegendComponent = ({ showOccupied = false }) => (
  <ul className="map-legend">
    <li><span className="map-legend-swatch map-legend-swatch--free" />Libre</li>
    {showOccupied && <li><span className="map-legend-swatch map-legend-swatch--occupied" />Ocupada</li>}
    <li><span className="map-legend-swatch map-legend-swatch--fixed" />Producto fijo</li>
    <li><span className="map-legend-swatch map-legend-swatch--inactive" />Desactivada</li>
  </ul>
)

export default RackLegendComponent
