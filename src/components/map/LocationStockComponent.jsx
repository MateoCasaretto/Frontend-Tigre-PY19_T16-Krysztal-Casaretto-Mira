import LocationActionsComponent from './LocationActionsComponent'

// CU08 paso 4: productos de la ubicación con su código SAP, descripción, categoría y cantidad.
// A1: si no hay ninguno, se avisa que está vacía y se ofrece agregar stock
const LocationStockComponent = ({ items }) => (
  <div className="location-stock" aria-live="polite">
    {items.length === 0 ? (
      <p className="location-empty">Esta ubicación está vacía.</p>
    ) : (
      <ul className="location-products">
        {items.map(({ _id, product, quantity }) => (
          <li key={_id} className="location-product">
            <span className="location-product-code">{product?.sapCode ?? 'Producto eliminado'}</span>
            <span className="location-product-quantity">{quantity.toLocaleString('es-UY')} u.</span>
            <span className="location-product-description">{product?.description}</span>
            {product?.category && <span className="location-product-category">Categoría {product.category}</span>}
          </li>
        ))}
      </ul>
    )}
    <LocationActionsComponent hasStock={items.length > 0} />
  </div>
)

export default LocationStockComponent
