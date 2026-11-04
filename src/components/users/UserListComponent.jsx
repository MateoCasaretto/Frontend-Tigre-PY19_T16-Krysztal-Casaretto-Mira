const OPERATOR = 'Operario'

const UserSummary = ({ user }) => (
  <>
    <span className="barcode-result-code">{user.nombreUsuario}</span>
    <span className="barcode-result-description">{user.email} · {user.rol}</span>
    <span className="user-warehouses">
      {user.rol !== OPERATOR && <span className="barcode-chip">Todas las plantas</span>}
      {user.rol === OPERATOR && user.warehouses.length === 0 && (
        <span className="barcode-chip barcode-chip--empty">Sin plantas asignadas</span>
      )}
      {user.rol === OPERATOR && user.warehouses.map((warehouse) => (
        <span key={warehouse._id} className="barcode-chip">{warehouse.name}</span>
      ))}
    </span>
  </>
)

// Solo los operarios se pueden editar: los administradores ven todas las plantas
const UserListComponent = ({ users, onEdit }) => (
  <ul className="barcode-results user-list">
    {users.map((user) => (
      <li key={user._id}>
        {user.rol === OPERATOR ? (
          <button type="button" className="barcode-result" onClick={() => onEdit(user)} aria-label={`Editar plantas de ${user.nombreUsuario}`}>
            <UserSummary user={user} />
          </button>
        ) : (
          <div className="barcode-result user-readonly">
            <UserSummary user={user} />
          </div>
        )}
      </li>
    ))}
  </ul>
)

export default UserListComponent
