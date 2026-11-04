// Plantas registradas: al tocar una se abre su edición
const WarehouseListComponent = ({ warehouses, onEdit }) => (
  <ul className="barcode-results">
    {warehouses.map((warehouse) => (
      <li key={warehouse._id}>
        <button type="button" className="barcode-result" onClick={() => onEdit(warehouse)} aria-label={`Editar ${warehouse.name}`}>
          <span className="barcode-result-code">{warehouse.name}</span>
          <span className="barcode-result-description">{warehouse.address}</span>
        </button>
      </li>
    ))}
  </ul>
)

export default WarehouseListComponent
