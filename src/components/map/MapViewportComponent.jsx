import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import MapZoomControlsComponent from './MapZoomControlsComponent'
import { EDITABLE_CLASS } from '../../utils/MapUtils'

const NOT_DRAGGABLE = [EDITABLE_CLASS]
const MIN_SCALE = 0.6
const MAX_SCALE = 8
// Con todo el plano a la vista queda un poco de aire contra los bordes
const FIT_SCALE = 0.92
// La librería suma este valor por el delta de la rueda a la escala: un clic de mouse da unos 100, o sea 0,15
const WHEEL_STEP = 0.0015

// Zoom y desplazamiento del plano. Es el único archivo que conoce la librería de gestos
const MapViewportComponent = ({ onTransformed, children }) => (
  <div className="map-viewport">
    <TransformWrapper
      initialScale={FIT_SCALE}
      minScale={MIN_SCALE}
      maxScale={MAX_SCALE}
      centerOnInit
      centerZoomedOut
      wheel={{ step: WHEEL_STEP }}
      doubleClick={{ disabled: true }}
      panning={{ velocityDisabled: true, excluded: NOT_DRAGGABLE }}
      pinch={{ excluded: NOT_DRAGGABLE }}
      onTransformed={onTransformed}
    >
      {({ zoomIn, zoomOut, centerView }) => (
        <>
          <MapZoomControlsComponent onZoomIn={() => zoomIn()} onZoomOut={() => zoomOut()} onCenter={() => centerView(FIT_SCALE)} />
          <TransformComponent wrapperClass="map-viewport-wrapper" contentClass="map-viewport-content">
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  </div>
)

export default MapViewportComponent
