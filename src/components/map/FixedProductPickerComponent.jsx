import ProductSearchFormComponent from '../products/ProductSearchFormComponent'
import ProductSearchResultsComponent from '../products/ProductSearchResultsComponent'
import { useProductSearch } from '../../hooks/useProductSearch'

// Producto fijo de picking de una posición: se busca como en el resto de la app
const FixedProductPickerComponent = ({ product, onChange }) => {
  const { text, setText, searching, results, search } = useProductSearch()

  return (
    <div className="editor-fixed-product">
      <p className="editor-title">Producto fijo</p>
      {product ? (
        <>
          <p className="twofa-text">{product.sapCode} · {product.description}</p>
          <button type="button" className="form-secondary" onClick={() => onChange(null)}>Quitar producto fijo</button>
        </>
      ) : (
        <p className="twofa-text">Sin producto fijo.</p>
      )}
      <ProductSearchFormComponent value={text} onChange={setText} searching={searching} onSubmit={search} />
      {results && results.products.length === 0 && <p className="twofa-text">No se encontró ningún producto.</p>}
      {results && results.products.length > 0 && (
        <ProductSearchResultsComponent products={results.products} total={results.total} onSelect={onChange} />
      )}
    </div>
  )
}

export default FixedProductPickerComponent
