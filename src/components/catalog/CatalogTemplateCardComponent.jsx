import { toast } from 'react-toastify'
import SectionCardComponent from '../common/SectionCardComponent'
import { downloadCatalogTemplate } from '../../services/CatalogImportService'

const COLUMNS = ['Código SAP', 'Descripción', 'Categoría', 'Línea de producto']
const OPTIONAL_COLUMNS = ['Código de barras']

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11M7 10l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
)

const saveFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

// Paso 1: columnas esperadas y descarga de la plantilla
const CatalogTemplateCardComponent = () => {
  const download = async () => {
    try {
      saveFile(await downloadCatalogTemplate(), 'plantilla-catalogo.xlsx')
      toast.success('Plantilla descargada.')
    } catch {
      toast.error('No se pudo descargar la plantilla.')
    }
  }

  return (
    <SectionCardComponent title="1. Descargá la plantilla">
      <p className="twofa-text">Completala con los productos exportados de SAP. El código de barras del envase es opcional; las demás columnas son obligatorias:</p>
      <ul className="catalog-columns">
        {COLUMNS.map((column) => <li key={column}>{column}</li>)}
        {OPTIONAL_COLUMNS.map((column) => <li key={column} className="catalog-column--optional">{column} (opcional)</li>)}
      </ul>
      <button type="button" className="form-secondary" onClick={download}>
        <DownloadIcon />
        Descargar plantilla
      </button>
    </SectionCardComponent>
  )
}

export default CatalogTemplateCardComponent
