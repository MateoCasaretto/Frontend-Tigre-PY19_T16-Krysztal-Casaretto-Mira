import { useId, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useSelector } from 'react-redux'

const PENDING_MESSAGE = 'Esta acción estará disponible en una próxima versión.'

// CU08 A2: acciones sobre la ubicación (CU05, CU21 y CU22).
const LocationActionsComponent = ({ hasStock, elementId, positionId, onChanged, productSelected, setProductSelected }) => {
  //el productSelected vienen del padre LocationStockComponente, esto es para poder seleccionar un producto de la lista (esta lista se muestra en LocationStockComponent)
  //el productSelected tambien viene del padre ya que puede venir del buscador de productos (LocationActionsComponent) y se necesita que el padre lo tenga para poder mostrarlo en la lista de productos de la ubicación (LocationStockComponent)

  const warehouseId = useSelector((state) => state.warehouse.selected?._id)
  const productId = useId()
  const quantityId = useId()
  const [product, setProduct] = useState('') // texto del buscador, no el producto elegido
  const [products, setProducts] = useState([])
  const [quantity, setQuantity] = useState('')

  const notifyPending = () => toast.info(PENDING_MESSAGE)

  const searchProduct = () => {
    axios
      .get('http://localhost:8080/v1/products', {
        params: { search: product },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      })
      .then((response) => {
        setProducts(response.data.data)
        toast.success('Productos encontrados exitosamente.')
      })
      .catch((error) => {
        console.error('Error al buscar productos:', error)
        toast.error('No se pudo buscar el producto.')
      })
  }

  const addStock = (event) => {
    event.preventDefault() // evita que el formulario recargue la página
    axios.post(
      `http://localhost:8080/v1/warehouses/${warehouseId}/elements/${elementId}/add`,
      {
        positionId: positionId || null,
        productId: productSelected?._id,
        quantity: parseInt(quantity, 10),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
      .then(() => {
        toast.success('Stock agregado exitosamente.')
        setQuantity('')
        setProductSelected(null)
        onChanged() // recarga el stock de la ubicación (reload del padre)
      })
      .catch((error) => {
        toast.error('No se pudo agregar el stock.')
      })
  }

  const removeStock = (event) => {
    event.preventDefault() // evita que el formulario recargue la página
    axios.post(
      `http://localhost:8080/v1/warehouses/${warehouseId}/elements/${elementId}/remove`,
      {
        positionId: positionId || null,
        productId: productSelected?._id,
        quantity: parseInt(quantity, 10),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
      .then(() => {
        toast.success('Stock removido exitosamente.')
        setQuantity('')
        setProductSelected(null)
        onChanged() // recarga el stock de la ubicación (reload del padre)
      })
      .catch((error) => {
        toast.error('No se pudo remover el stock.')
      })
  }

  return (
    <div className="location-actions">
      <form className="location-form" onSubmit={addStock}>
        <div className="form-field">
          <label htmlFor={productId}>Producto</label>
          <input
            id={productId}
            type="search"
            placeholder="Buscá un producto"
            autoComplete="off"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
          />
          <button type="button" className="form-secondary" disabled={!product.trim()} onClick={searchProduct}>
            Buscar producto
          </button>
        </div>

        <div className="form-field">
          {products.map((prod) => (
            <button key={prod._id} className="form-secondary" type="button" onClick={() => setProductSelected(prod)}>
              {prod.sapCode} · {prod.description}
            </button>
          ))}
          {productSelected && <p>Elegido: {productSelected.sapCode} · {productSelected.description}</p>}
        </div>



        <div className="form-field">
          <label htmlFor={quantityId}>Cantidad</label>
          <input
            id={quantityId}
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>

        <div className="location-form-buttons">
          <button type="submit" className="form-secondary" >Agregar stock</button>

          <button
            type="button"
            className="form-secondary"
            disabled={!hasStock}
            onClick={removeStock}
          >
            Disminuir stock
          </button>
        </div>
      </form>

      {hasStock && (
        <button type="button" className="form-secondary" onClick={notifyPending}>Trasladar</button>
      )}
    </div>
  )
}

export default LocationActionsComponent
