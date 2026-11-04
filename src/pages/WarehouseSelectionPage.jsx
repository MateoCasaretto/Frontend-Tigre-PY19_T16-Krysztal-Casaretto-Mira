import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import LoaderPata from '../components/common/LoaderPata'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import SectionCardComponent from '../components/common/SectionCardComponent'
import WarehousePickerComponent from '../components/warehouses/WarehousePickerComponent'
import { useWarehouses } from '../hooks/useWarehouses'
import { selectWarehouse } from '../slices/WarehouseSlice'

const WarehouseSelectionPage = () => {
  const { warehouses, loading, error, reload } = useWarehouses()
  const selected = useSelector((state) => state.warehouse.selected)
  const rol = useSelector((state) => state.usuario.rol)
  const [chosenId, setChosenId] = useState(selected?._id ?? null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const enter = (warehouse) => {
    dispatch(selectWarehouse(warehouse))
    navigate('/home', { replace: true })
  }

  // Con una sola planta no hay nada que elegir
  useEffect(() => {
    if (warehouses.length !== 1) return
    dispatch(selectWarehouse(warehouses[0]))
    navigate('/home', { replace: true })
  }, [warehouses, dispatch, navigate])

  const chosen = warehouses.find((warehouse) => warehouse._id === chosenId)

  return (
    <AppLayout title="Elegí la planta" back={Boolean(selected)}>
      {loading && <LoaderPata texto="Cargando plantas..." />}

      {!loading && error && (
        <EmptyStateComponent message={error}>
          <button type="button" className="form-submit" onClick={reload}>Reintentar</button>
        </EmptyStateComponent>
      )}

      {!loading && !error && warehouses.length === 0 && (
        rol === 'Administrador' ? (
          <EmptyStateComponent message="Todavía no hay plantas registradas.">
            <Link className="form-submit warehouse-link" to="/plantas">Crear la primera planta</Link>
          </EmptyStateComponent>
        ) : (
          <EmptyStateComponent message="No tenés plantas asignadas. Pedile a un administrador que te asigne una." />
        )
      )}

      {!loading && !error && warehouses.length > 1 && (
        <SectionCardComponent title="Sobre la que vas a trabajar">
          <WarehousePickerComponent warehouses={warehouses} value={chosenId} onChange={setChosenId} />
          <button type="button" className="form-submit" disabled={!chosen} onClick={() => enter(chosen)}>Continuar</button>
        </SectionCardComponent>
      )}
    </AppLayout>
  )
}

export default WarehouseSelectionPage
