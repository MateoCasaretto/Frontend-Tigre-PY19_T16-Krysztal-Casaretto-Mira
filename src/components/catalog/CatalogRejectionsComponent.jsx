const CatalogRejectionsComponent = ({ rejections }) => (
  <>
    <h3 className="catalog-rejections-title">Filas rechazadas</h3>
    <p className="twofa-text">Corregilas en el archivo y volvé a importarlo: las filas válidas no se duplican.</p>
    <ul className="catalog-rejections">
      {rejections.map((rejection) => (
        <li key={rejection.row}>
          <span className="catalog-rejection-row">Fila {rejection.row}</span>
          <span>{rejection.reason}</span>
        </li>
      ))}
    </ul>
  </>
)

export default CatalogRejectionsComponent
