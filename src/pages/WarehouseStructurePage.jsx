import { useState } from 'react'
import { useSelector } from 'react-redux'
import AppLayout from '../components/layout/AppLayout'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import LoaderPata from '../components/common/LoaderPata'
import SectionCardComponent from '../components/common/SectionCardComponent'
import EditorSaveBarComponent from '../components/map/EditorSaveBarComponent'
import ElementPanelComponent from '../components/map/ElementPanelComponent'
import MapCanvasComponent from '../components/map/MapCanvasComponent'
import MapElementHandlesComponent from '../components/map/MapElementHandlesComponent'
import MapViewportComponent from '../components/map/MapViewportComponent'
import NewElementFormComponent from '../components/map/NewElementFormComponent'
import PlanSizePanelComponent from '../components/map/PlanSizePanelComponent'
import UnsavedChangesModalComponent from '../components/map/UnsavedChangesModalComponent'
import { useElementDrag } from '../hooks/useElementDrag'
import { usePlanEditor } from '../hooks/usePlanEditor'
import { useSvgScale } from '../hooks/useSvgScale'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import { EDITABLE_CLASS } from '../utils/MapUtils'
import '../styles/WarehouseMap.css'

const WarehouseStructurePage = () => {
  const warehouseId = useSelector((state) => state.warehouse.selected?._id)
  const editor = usePlanEditor(warehouseId)
  const { svgRef, attachSvg, pixelsPerMeter, measure } = useSvgScale(editor.plan)
  const { dragHandlers } = useElementDrag({
    svgRef,
    plan: editor.plan,
    onChange: editor.placeElement,
    onStart: editor.freezePlan,
    onEnd: editor.releasePlan,
  })
  const guard = useUnsavedChangesGuard(editor.dirty)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const { elements, selected, selectedId, loading, error } = editor

  const selectElement = (element) => {
    editor.setSelectedId(element._id)
    setCatalogOpen(false)
  }

  // En el celular va con la lista, que se abre a pedido; desde 900 px, con los detalles
  const planSizeCard = (
    <SectionCardComponent title="Tamaño del plano">
      <PlanSizePanelComponent plan={editor.plan} minPlan={editor.minPlan} onChange={editor.choosePlanSize} />
    </SectionCardComponent>
  )

  const layoutClass = [
    'editor-layout editor-layout--plan',
    selected && 'editor-layout--selected',
    catalogOpen && 'editor-layout--catalog-open',
  ].filter(Boolean).join(' ')

  // Solo el elemento elegido se arrastra: el resto sigue moviendo el plano
  const getShapeProps = (element) => (element._id === selectedId ? { className: EDITABLE_CLASS, ...dragHandlers(element) } : {})

  return (
    <AppLayout title="Estructura de planta" back confirmLogout={guard.confirmLogout}>
      <div className="map-page editor-page">
        {loading && <LoaderPata texto="Cargando la estructura..." />}
        {!loading && error && (
          <EmptyStateComponent message={error}>
            <button type="button" className="form-secondary" onClick={editor.reload}>Reintentar</button>
          </EmptyStateComponent>
        )}
        {!loading && !error && (
          <div className={layoutClass}>
            <div className="editor-layout-main">
              <MapViewportComponent onTransformed={measure}>
                <MapCanvasComponent
                  svgRef={attachSvg}
                  plan={editor.plan}
                  elements={elements}
                  selectedId={selectedId}
                  showGrid
                  onSelect={selectElement}
                  getShapeProps={getShapeProps}
                >
                  {selected && <MapElementHandlesComponent element={selected} pixelsPerMeter={pixelsPerMeter} dragHandlers={dragHandlers} />}
                </MapCanvasComponent>
              </MapViewportComponent>
              <button type="button" className="editor-catalog-toggle" aria-expanded={catalogOpen} onClick={() => setCatalogOpen((open) => !open)}>
                {catalogOpen ? 'Cerrar lista' : 'Elementos'}
              </button>
              {editor.dirty && <EditorSaveBarComponent saving={editor.saving} onSave={editor.saveLayout} onDiscard={editor.discard} />}
            </div>

            <div className="editor-layout-side editor-layout-details">
              <div className="editor-plan-size editor-plan-size--details">{planSizeCard}</div>
              {selected && (
                <SectionCardComponent title="Elemento elegido">
                  <ElementPanelComponent
                    key={selected._id}
                    element={selected}
                    canOpenRack={!editor.dirty}
                    onPlace={editor.placeElement}
                    onSaveFloorZone={editor.saveFloorZone}
                    onRemove={editor.removeSelected}
                    onClose={() => editor.setSelectedId(null)}
                  />
                </SectionCardComponent>
              )}
            </div>

            <div className="editor-layout-side editor-layout-catalog">
              <div className="editor-plan-size editor-plan-size--catalog">{planSizeCard}</div>
              {elements.length > 0 && (
                <SectionCardComponent title="Elementos">
                  <ul className="editor-list">
                    {elements.map((element) => (
                      <li key={element._id}>
                        <button type="button" aria-pressed={element._id === selectedId} onClick={() => selectElement(element)}>
                          {element.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </SectionCardComponent>
              )}
              <SectionCardComponent title="Nuevo elemento">
                <NewElementFormComponent onCreate={editor.addElement} />
              </SectionCardComponent>
            </div>
          </div>
        )}
      </div>
      {guard.asking && <UnsavedChangesModalComponent onStay={guard.stay} onLeave={guard.leave} />}
    </AppLayout>
  )
}

export default WarehouseStructurePage
