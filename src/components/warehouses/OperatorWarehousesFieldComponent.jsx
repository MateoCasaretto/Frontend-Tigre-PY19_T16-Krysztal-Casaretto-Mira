import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import LoaderPata from '../common/LoaderPata'
import EmptyStateComponent from '../common/EmptyStateComponent'
import WarehouseChecklistComponent from './WarehouseChecklistComponent'
import { useWarehouses } from '../../hooks/useWarehouses'

// Campo de plantas del alta de usuario. Se desregistra al cambiar a Administrador, que no lleva plantas
const OperatorWarehousesFieldComponent = ({ control }) => {
  const { warehouses, loading, error } = useWarehouses()

  if (loading) return <LoaderPata texto="Cargando plantas..." />
  if (error) return <EmptyStateComponent message={error} />
  if (warehouses.length === 0) {
    return (
      <EmptyStateComponent message="Todavía no hay plantas para asignar.">
        <Link className="form-secondary" to="/plantas">Crear una planta</Link>
      </EmptyStateComponent>
    )
  }

  return (
    <Controller
      name="warehouses"
      control={control}
      defaultValue={[]}
      shouldUnregister
      rules={{ validate: (value) => value.length > 0 }}
      render={({ field }) => (
        <WarehouseChecklistComponent
          legend="Plantas del operario"
          warehouses={warehouses}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  )
}

export default OperatorWarehousesFieldComponent
