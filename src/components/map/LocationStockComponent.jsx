import { useState } from 'react'
import LocationActionsComponent from './LocationActionsComponent'

// CU08 paso 4: productos de la ubicación con su código SAP, descripción, categoría y cantidad.
// A1: si no hay ninguno, se avisa que está vacía y se ofrece agregar stock
const LocationStockComponent = ({ items, elementId, positionId, onChanged }) => {
  // producto elegido: puede venir de la lista de la ubicación o del buscador del formulario
  const [productSelected, setProductSelected] = useState(null)

  return (
    <div className="location-stock" aria-live="polite">
      {items.length === 0 ? (
        <p className="location-empty">Esta ubicación está vacía.</p>
      ) : (
        <ul className="location-products">
          {items.map(({ _id, product, quantity }) => {
            const isSelected = !!product && productSelected?._id === product._id
            return (
              <li key={_id} className={`location-product${isSelected ? ' selected' : ''}`}>
                <button
                  type="button"
                  className="location-product-button"
                  disabled={!product}
                  aria-pressed={isSelected}
                  onClick={() => setProductSelected(isSelected ? null : product)}
                >
                  <span className="location-product-code">{product?.sapCode ?? 'Producto eliminado'}</span>
                  <span className="location-product-quantity">{quantity.toLocaleString('es-UY')} u.</span>
                  <span className="location-product-description">{product?.description}</span>
                  {product?.category && <span className="location-product-category">Categoría {product.category}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <LocationActionsComponent
        hasStock={items.length > 0}
        elementId={elementId}
        positionId={positionId}
        onChanged={onChanged}
        productSelected={productSelected}
        setProductSelected={setProductSelected}
      />
    </div>
  )
}

export default LocationStockComponent
