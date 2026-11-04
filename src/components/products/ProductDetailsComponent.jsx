const ProductDetailsComponent = ({ product }) => (
  <>
    <p className="twofa-text barcode-description">{product.description}</p>
    <dl className="barcode-data">
      <div>
        <dt>Categoría</dt>
        <dd>{product.category}</dd>
      </div>
      <div>
        <dt>Línea de producto</dt>
        <dd>{product.productLine}</dd>
      </div>
      <div className="barcode-data-full">
        <dt>Código de barras</dt>
        <dd className={product.barcode ? 'barcode-current' : 'barcode-none'}>{product.barcode ?? 'Sin código de barras asociado'}</dd>
      </div>
    </dl>
  </>
)

export default ProductDetailsComponent
