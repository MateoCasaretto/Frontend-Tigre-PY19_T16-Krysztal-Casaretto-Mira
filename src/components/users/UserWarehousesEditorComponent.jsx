import { useState } from 'react'
import { toast } from 'react-toastify'
import LoaderPata from '../common/LoaderPata'
import WarehouseChecklistComponent from '../warehouses/WarehouseChecklistComponent'
import { getErrorMessage } from '../../services/ApiClient'
import { updateUserWarehouses } from '../../services/UserService'

const UserWarehousesEditorComponent = ({ user, warehouses, onSaved, onCancel }) => {
  const [selected, setSelected] = useState(() => user.warehouses.map((warehouse) => warehouse._id))
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await updateUserWarehouses(user._id, selected)
      toast.success('Plantas del usuario actualizadas.')
      onSaved()
    } catch (error) {
      toast.error(getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <>
      <p className="twofa-text">{user.email}</p>
      <WarehouseChecklistComponent legend="Plantas asignadas" warehouses={warehouses} value={selected} onChange={setSelected} />
      {saving ? (
        <LoaderPata texto="Guardando..." />
      ) : (
        <div className="barcode-actions">
          <button type="button" className="form-submit" onClick={save} disabled={selected.length === 0}>Guardar</button>
          <button type="button" className="form-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      )}
    </>
  )
}

export default UserWarehousesEditorComponent
