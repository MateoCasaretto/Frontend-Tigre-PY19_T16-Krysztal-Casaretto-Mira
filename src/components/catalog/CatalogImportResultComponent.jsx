import SectionCardComponent from '../common/SectionCardComponent'
import CatalogRejectionsComponent from './CatalogRejectionsComponent'
import CatalogStatComponent from './CatalogStatComponent'

const CatalogImportResultComponent = ({ result }) => (
  <SectionCardComponent title="Resultado" aria-live="polite">
    <p className="twofa-text">{result.fileName}</p>
    <div className="catalog-summary">
      <CatalogStatComponent value={result.importedRows} label="Nuevos" variant="ok" />
      <CatalogStatComponent value={result.updatedRows} label="Actualizados" />
      <CatalogStatComponent value={result.rejectedRows} label="Rechazados" variant={result.rejectedRows > 0 ? 'rejected' : undefined} />
    </div>
    {result.assignedBarcodes > 0 && (
      <p className="catalog-barcodes">
        {result.assignedBarcodes === 1
          ? 'Se asoció 1 código de barras.'
          : `Se asociaron ${result.assignedBarcodes} códigos de barras.`}
      </p>
    )}
    {result.rejections.length > 0 && <CatalogRejectionsComponent rejections={result.rejections} />}
  </SectionCardComponent>
)

export default CatalogImportResultComponent
