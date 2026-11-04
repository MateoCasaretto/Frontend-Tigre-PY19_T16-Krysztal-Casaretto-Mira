import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../services/ApiClient'
import { createWarehouse, updateWarehouse } from '../../services/WarehouseService'

// Crea una planta o edita la recibida en `warehouse`
const WarehouseFormComponent = ({ warehouse, onSaved, onCancel }) => {
  const idName = useId()
  const idAddress = useId()
  const { register, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm({
    mode: 'onChange',
    defaultValues: { name: warehouse?.name ?? '', address: warehouse?.address ?? '' },
  })

  const save = async ({ name, address }) => {
    try {
      const data = { name, address }
      const saved = warehouse ? await updateWarehouse(warehouse._id, data) : await createWarehouse(data)
      toast.success(warehouse ? 'Planta actualizada.' : 'Planta creada.')
      reset()
      onSaved(saved)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(save)}>
      <div className="form-field">
        <label htmlFor={idName}>Nombre</label>
        <input id={idName} type="text" maxLength={80} autoComplete="off" {...register('name', { required: true, validate: (value) => value.trim().length > 0 })} />
      </div>

      <div className="form-field">
        <label htmlFor={idAddress}>Dirección</label>
        <input id={idAddress} type="text" maxLength={150} autoComplete="off" {...register('address', { required: true, validate: (value) => value.trim().length > 0 })} />
      </div>

      <input className="form-submit" type="submit" value={warehouse ? 'Guardar cambios' : 'Crear planta'} disabled={!isValid || isSubmitting} />
      {warehouse && <button type="button" className="form-secondary" onClick={onCancel}>Cancelar</button>}
    </form>
  )
}

export default WarehouseFormComponent
