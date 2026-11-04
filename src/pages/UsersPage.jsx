import { useId, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import LoaderPata from '../components/common/LoaderPata'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import SectionCardComponent from '../components/common/SectionCardComponent'
import UserListComponent from '../components/users/UserListComponent'
import UserWarehousesEditorComponent from '../components/users/UserWarehousesEditorComponent'
import { useUsers } from '../hooks/useUsers'
import { useWarehouses } from '../hooks/useWarehouses'

const UsersPage = () => {
  const idSearch = useId()
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const { users, total, loading, error, reload } = useUsers(search)
  const { warehouses } = useWarehouses()

  const handleSearch = (event) => {
    event.preventDefault()
    setSearch(text.trim())
  }

  const handleSaved = () => {
    setEditing(null)
    reload()
  }

  if (editing) {
    return (
      <AppLayout title="Usuarios" back>
        <SectionCardComponent title={`Plantas de ${editing.nombreUsuario}`}>
          <UserWarehousesEditorComponent
            user={editing}
            warehouses={warehouses}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </SectionCardComponent>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Usuarios" back>
      <SectionCardComponent title="Buscá un usuario">
        <form className="auth-form" onSubmit={handleSearch}>
          <div className="form-field">
            <label htmlFor={idSearch}>Nombre de usuario o email</label>
            <input id={idSearch} type="search" value={text} onChange={(event) => setText(event.target.value)} autoComplete="off" enterKeyHint="search" maxLength={100} />
          </div>
          <input className="form-submit" type="submit" value="Buscar" />
        </form>
      </SectionCardComponent>

      <SectionCardComponent title="Usuarios">
        {loading && <LoaderPata texto="Cargando usuarios..." />}
        {!loading && error && (
          <EmptyStateComponent message={error}>
            <button type="button" className="form-secondary" onClick={reload}>Reintentar</button>
          </EmptyStateComponent>
        )}
        {!loading && !error && users.length === 0 && <EmptyStateComponent message="No hay usuarios que coincidan con la búsqueda." />}
        {!loading && !error && users.length > 0 && (
          <>
            {total > users.length && <p className="twofa-text">Se muestran {users.length} de {total}. Afiná la búsqueda para encontrarlo más rápido.</p>}
            <UserListComponent users={users} onEdit={setEditing} />
          </>
        )}
      </SectionCardComponent>
    </AppLayout>
  )
}

export default UsersPage
