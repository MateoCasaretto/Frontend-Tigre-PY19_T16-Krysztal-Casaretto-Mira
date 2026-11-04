// Lista para elegir una planta (mockup P09)
const WarehousePickerComponent = ({ warehouses, value, onChange }) => (
  <fieldset className="warehouse-options">
    <legend className="visually-hidden">Plantas disponibles</legend>
    {warehouses.map((warehouse) => (
      <label key={warehouse._id} className="warehouse-option">
        <input
          type="radio"
          name="warehouse"
          checked={value === warehouse._id}
          onChange={() => onChange(warehouse._id)}
        />
        <span className="warehouse-option-text">
          <span className="warehouse-option-name">{warehouse.name}</span>
          <span className="warehouse-option-address">{warehouse.address}</span>
        </span>
      </label>
    ))}
  </fieldset>
)

export default WarehousePickerComponent
