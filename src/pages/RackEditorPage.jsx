import { useId } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import LoaderPata from '../components/common/LoaderPata'
import SectionCardComponent from '../components/common/SectionCardComponent'
import EditorSaveBarComponent from '../components/map/EditorSaveBarComponent'
import RackGridComponent from '../components/map/RackGridComponent'
import RackLegendComponent from '../components/map/RackLegendComponent'
import RackSelectionPanelComponent from '../components/map/RackSelectionPanelComponent'
import UnsavedChangesModalComponent from '../components/map/UnsavedChangesModalComponent'
import { useRackEditor } from '../hooks/useRackEditor'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import '../styles/WarehouseMap.css'

const RackEditorPage = () => {
  const { elementId } = useParams()
  const warehouseId = useSelector((state) => state.warehouse.selected?._id)
  const editor = useRackEditor(warehouseId, elementId)
  const guard = useUnsavedChangesGuard(editor.dirty)
  const idName = useId()
  const { rack, selection, setSelection, applyChange, loading, error } = editor

  return (
    <AppLayout title="Editar estantería" back confirmLogout={guard.confirmLogout}>
      <div className="map-page">
        <Link className="form-secondary" to="/estructura-planta">Volver al plano</Link>
        {loading && <LoaderPata texto="Cargando la estantería..." />}
        {!loading && error && (
          <EmptyStateComponent message={error}>
            <button type="button" className="form-secondary" onClick={editor.reload}>Reintentar</button>
          </EmptyStateComponent>
        )}
        {!loading && !error && !rack && <EmptyStateComponent message="Esta estantería ya no existe." />}
        {!loading && !error && rack && (
          <div className="editor-layout">
            <div className="editor-layout-main">
              <SectionCardComponent title={rack.name || 'Estantería'}>
                <div className="form-field">
                  <label htmlFor={idName}>Nombre de la estantería</label>
                  <input id={idName} type="text" maxLength={60} autoComplete="off" value={rack.name} onChange={(event) => applyChange((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <RackGridComponent rack={rack} selection={selection} onSelect={setSelection} editable />
                <RackLegendComponent />
              </SectionCardComponent>
              {editor.dirty && <EditorSaveBarComponent saving={editor.saving} onSave={editor.save} onDiscard={editor.discard} />}
            </div>
            <div className="editor-layout-side">
              <SectionCardComponent title="Elemento elegido">
                <RackSelectionPanelComponent rack={rack} selection={selection} onChange={applyChange} onClear={() => setSelection(null)} />
              </SectionCardComponent>
            </div>
          </div>
        )}
      </div>
      {guard.asking && <UnsavedChangesModalComponent onStay={guard.stay} onLeave={guard.leave} />}
    </AppLayout>
  )
}

export default RackEditorPage
