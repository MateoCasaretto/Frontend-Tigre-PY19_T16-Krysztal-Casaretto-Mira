import SectionCardComponent from '../common/SectionCardComponent'

const ProductSearchResultsComponent = ({ products, total, onSelect }) => (
  <SectionCardComponent title="Resultados" aria-live="polite">
    {total > products.length && (
      <p className="twofa-text">Se muestran {products.length} de {total}. Afiná la búsqueda para encontrarlo más rápido.</p>
    )}
    <ul className="barcode-results">
      {products.map((product) => (
        <li key={product._id}>
          <button type="button" className="barcode-result" onClick={() => onSelect(product)}>
            <span className="barcode-result-code">{product.sapCode}</span>
            <span className="barcode-result-description">{product.description}</span>
            <span className={`barcode-chip${product.barcode ? '' : ' barcode-chip--empty'}`}>
              {product.barcode ?? 'Sin código de barras'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </SectionCardComponent>
)

export default ProductSearchResultsComponent
