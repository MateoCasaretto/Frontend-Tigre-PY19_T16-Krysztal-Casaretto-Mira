import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../components/layout/AppLayout'
import LoaderPata from '../components/common/LoaderPata'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import SectionCardComponent from '../components/common/SectionCardComponent'
import WarehouseFormComponent from '../components/warehouses/WarehouseFormComponent'
import WarehouseListComponent from '../components/warehouses/WarehouseListComponent'
import { useWarehouses } from '../hooks/useWarehouses'
import { selectWarehouse } from '../slices/WarehouseSlice'

const WarehousesPage = () => {
  const { warehouses, loading, error, reload } = useWarehouses()
  const [editing, setEditing] = useState(null)
  const selectedId = useSelector((state) => state.warehouse.selected?._id)
  const dispatch = useDispatch()

  const handleSaved = (saved) => {
    // Si se renombró la planta actual, el encabezado también cambia
    if (saved._id === selectedId) dispatch(selectWarehouse(saved))
    setEditing(null)
    reload()
  }

  const handleEdit = (warehouse) => {
    setEditing(warehouse)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AppLayout title="Plantas" back>
      <SectionCardComponent title={editing ? `Editar ${editing.name}` : 'Nueva planta'}>
        <WarehouseFormComponent
          key={editing?._id ?? 'new'}
          warehouse={editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      </SectionCardComponent>

      <SectionCardComponent title="Plantas registradas">
        {loading && <LoaderPata texto="Cargando plantas..." />}
        {!loading && error && (
          <EmptyStateComponent message={error}>
            <button type="button" className="form-secondary" onClick={reload}>Reintentar</button>
          </EmptyStateComponent>
        )}
        {!loading && !error && warehouses.length === 0 && <EmptyStateComponent message="Todavía no hay plantas registradas." />}
        {!loading && !error && warehouses.length > 0 && <WarehouseListComponent warehouses={warehouses} onEdit={handleEdit} />}
      </SectionCardComponent>
    </AppLayout>
  )
}

export default WarehousesPage
