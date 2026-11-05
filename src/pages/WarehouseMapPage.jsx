import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import LoaderPata from '../components/common/LoaderPata'
import ElementDetailComponent from '../components/map/ElementDetailComponent'
import MapCanvasComponent from '../components/map/MapCanvasComponent'
import MapViewportComponent from '../components/map/MapViewportComponent'
import { useWarehouseMap } from '../hooks/useWarehouseMap'
import { getPlanSize } from '../utils/MapUtils'
import '../styles/WarehouseMap.css'

const PLAN_MARGIN = 1

const WarehouseMapPage = () => {
  const warehouseId = useSelector((state) => state.warehouse.selected?._id)
  const rol = useSelector((state) => state.usuario.rol)
  const { elements, loading, error, reload } = useWarehouseMap(warehouseId)
  const [selectedId, setSelectedId] = useState(null)
  const plan = useMemo(() => getPlanSize(elements, PLAN_MARGIN), [elements])
  const selected = elements.find(({ _id }) => _id === selectedId)
  const ready = !loading && !error && elements.length > 0

  return (
    <AppLayout title="Mapa" back>
      <div className={`map-page${selected ? ' map-page--detail' : ''}`}>
        {loading && <LoaderPata texto="Cargando el mapa..." />}
        {!loading && error && (
          <EmptyStateComponent message={error}>
            <button type="button" className="form-secondary" onClick={reload}>Reintentar</button>
          </EmptyStateComponent>
        )}
        {!loading && !error && elements.length === 0 && (
          <EmptyStateComponent message="Esta planta todavía no tiene su estructura configurada.">
            {rol === 'Administrador' && <Link className="form-secondary" to="/estructura-planta">Configurar la estructura</Link>}
          </EmptyStateComponent>
        )}
        {ready && (
          <>
            <div className="map-page-plan">
              <p className="map-hint">Tocá una estantería para ver sus posiciones</p>
              <MapViewportComponent>
                <MapCanvasComponent
                  plan={plan}
                  elements={elements}
                  selectedId={selectedId}
                  onSelect={(element) => setSelectedId(element._id)}
                />
              </MapViewportComponent>
            </div>
            {selected && (
              <div className="map-page-detail">
                <ElementDetailComponent key={selected._id} element={selected} onClose={() => setSelectedId(null)} />
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default WarehouseMapPage
