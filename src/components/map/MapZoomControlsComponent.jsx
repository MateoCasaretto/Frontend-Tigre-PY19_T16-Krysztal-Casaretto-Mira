const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

// Botones grandes: con guantes, pellizcar es incómodo
const MapZoomControlsComponent = ({ onZoomIn, onZoomOut, onCenter }) => (
  <div className="map-zoom">
    <button type="button" onClick={onZoomIn} aria-label="Acercar">
      <Icon><path d="M12 5v14M5 12h14" /></Icon>
    </button>
    <button type="button" onClick={onZoomOut} aria-label="Alejar">
      <Icon><path d="M5 12h14" /></Icon>
    </button>
    <button type="button" onClick={onCenter} aria-label="Centrar el plano">
      <Icon><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></Icon>
    </button>
  </div>
)

export default MapZoomControlsComponent
