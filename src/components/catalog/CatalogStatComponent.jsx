const CatalogStatComponent = ({ value, label, variant }) => (
  <div className={variant ? `catalog-stat catalog-stat--${variant}` : 'catalog-stat'}>
    <span className="catalog-stat-value">{value}</span>
    <span className="catalog-stat-label">{label}</span>
  </div>
)

export default CatalogStatComponent
