const describeDetail = ({ field, message }) => (
  field.startsWith('fila') ? `Fila ${field.slice(5)}: ${message}` : message
)

// El archivo no se pudo importar: motivo general y detalle por fila
const CatalogImportErrorComponent = ({ error }) => (
  <section className="home-alert catalog-error" role="alert">
    <p>{error.message}</p>
    {error.details.length > 0 && (
      <ul>
        {error.details.map((detail) => (
          <li key={`${detail.field}-${detail.message}`}>{describeDetail(detail)}</li>
        ))}
      </ul>
    )}
  </section>
)

export default CatalogImportErrorComponent
