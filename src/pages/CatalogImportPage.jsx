import LoaderPata from '../components/common/LoaderPata'
import SectionCardComponent from '../components/common/SectionCardComponent'
import AppLayout from '../components/layout/AppLayout'
import CatalogFileFieldComponent from '../components/catalog/CatalogFileFieldComponent'
import CatalogImportErrorComponent from '../components/catalog/CatalogImportErrorComponent'
import CatalogImportResultComponent from '../components/catalog/CatalogImportResultComponent'
import CatalogTemplateCardComponent from '../components/catalog/CatalogTemplateCardComponent'
import { useCatalogImport } from '../hooks/useCatalogImport'

const CatalogImportPage = () => {
  const { file, importing, result, error, inputKey, selectFile, submit } = useCatalogImport()

  const handleSubmit = (event) => {
    event.preventDefault()
    submit()
  }

  return (
    <AppLayout title="Importar catálogo" back>
      <CatalogTemplateCardComponent />

      <SectionCardComponent title="2. Subí el archivo">
        <p className="twofa-text">Los productos nuevos se dan de alta y los existentes se actualizan por su código SAP. El stock y las ubicaciones no cambian.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <CatalogFileFieldComponent file={file} inputKey={inputKey} disabled={importing} onSelect={selectFile} />
          {importing ? (
            <LoaderPata texto="Importando catálogo..." />
          ) : (
            <button type="submit" className="form-submit" disabled={!file}>Importar</button>
          )}
        </form>
      </SectionCardComponent>

      {error && <CatalogImportErrorComponent error={error} />}
      {result && <CatalogImportResultComponent result={result} />}
    </AppLayout>
  )
}

export default CatalogImportPage
