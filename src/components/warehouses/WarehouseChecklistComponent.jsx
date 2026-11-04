// Elección de varias plantas. La usan el alta de usuario y el editor de plantas de un operario
const WarehouseChecklistComponent = ({ warehouses, value, onChange, legend = 'Plantas' }) => {
  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((current) => current !== id) : [...value, id])
  }

  return (
    <fieldset className="warehouse-options">
      <legend className="warehouse-options-legend">{legend}</legend>
      {warehouses.map((warehouse) => (
        <label key={warehouse._id} className="warehouse-option">
          <input
            type="checkbox"
            checked={value.includes(warehouse._id)}
            onChange={() => toggle(warehouse._id)}
          />
          <span className="warehouse-option-text">
            <span className="warehouse-option-name">{warehouse.name}</span>
            <span className="warehouse-option-address">{warehouse.address}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export default WarehouseChecklistComponent
