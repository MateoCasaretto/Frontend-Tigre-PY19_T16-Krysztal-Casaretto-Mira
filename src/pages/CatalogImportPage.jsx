import { useId, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoaderPata from '../components/common/LoaderPata'

const IconoVolver = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

const IconoDescarga = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11M7 10l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
)

const IconoArchivo = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M12 17v-6M9 14l3-3 3 3" />
  </svg>
)

const COLUMNAS = ['Código SAP', 'Descripción', 'Categoría', 'Línea de producto']
const COLUMNAS_OPCIONALES = ['Código de barras']
const EXTENSIONES = ['.xlsx', '.csv']

const formatearTamano = (bytes) => (bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`)

const CatalogImportPage = () => {
  const idArchivo = useId()
  const [archivo, setArchivo] = useState(null)
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [claveInput, setClaveInput] = useState(0)
  const token = useSelector((state) => state.usuario.token)
  const navigate = useNavigate()

  const apiDescargarPlantilla = () => {
    axios
      .get('http://localhost:8080/v1/catalog/imports/template', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data)
        const enlace = document.createElement('a')
        enlace.href = url
        enlace.download = 'plantilla-catalogo.xlsx'
        enlace.click()
        URL.revokeObjectURL(url)
        toast.success('Plantilla descargada.')
      })
      .catch(() => {
        toast.error('No se pudo descargar la plantilla.')
      })
  }

  const elegirArchivo = (e) => {
    const elegido = e.target.files[0]
    if (!elegido) return
    const extension = elegido.name.slice(elegido.name.lastIndexOf('.')).toLowerCase()
    if (!EXTENSIONES.includes(extension)) {
      toast.error('Formato no admitido. Usá un Excel (.xlsx) o un CSV (.csv).')
      setClaveInput((clave) => clave + 1)
      return
    }
    setArchivo(elegido)
    setResultado(null)
    setError(null)
  }

  const apiImportarCatalogo = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', archivo)
    setImportando(true)
    setResultado(null)
    setError(null)

    axios
      .post('http://localhost:8080/v1/catalog/imports', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const datos = response.data.data
        setResultado(datos)
        setArchivo(null)
        setClaveInput((clave) => clave + 1)
        toast.success(`Catálogo importado: ${datos.importedRows} nuevos y ${datos.updatedRows} actualizados.`)
      })
      .catch((err) => {
        const mensaje = err.response?.data?.message ?? 'No se pudo importar el catálogo.'
        setError({ mensaje, detalles: err.response?.data?.details ?? [] })
        toast.error(mensaje)
      })
      .finally(() => setImportando(false))
  }

  return (
    <div className="home">
      <header className="home-header">
        <button type="button" className="page-back" onClick={() => navigate('/home')} aria-label="Volver al inicio">
          <IconoVolver />
        </button>
        <h1 className="home-header-title">Importar catálogo</h1>
        <span className="page-back-spacer" aria-hidden="true" />
      </header>

      <main className="home-content">
        <section className="twofa-card catalog-card">
          <h2 className="catalog-step-title">1. Descargá la plantilla</h2>
          <p className="twofa-text">Completala con los productos exportados de SAP. El código de barras del envase es opcional; las demás columnas son obligatorias:</p>
          <ul className="catalog-columns">
            {COLUMNAS.map((columna) => <li key={columna}>{columna}</li>)}
            {COLUMNAS_OPCIONALES.map((columna) => <li key={columna} className="catalog-column--optional">{columna} (opcional)</li>)}
          </ul>
          <button type="button" className="form-secondary" onClick={apiDescargarPlantilla}>
            <IconoDescarga />
            Descargar plantilla
          </button>
        </section>

        <section className="twofa-card catalog-card">
          <h2 className="catalog-step-title">2. Subí el archivo</h2>
          <p className="twofa-text">Los productos nuevos se dan de alta y los existentes se actualizan por su código SAP. El stock y las ubicaciones no cambian.</p>

          <form className="auth-form" onSubmit={apiImportarCatalogo}>
            <label htmlFor={idArchivo} className={`catalog-file${archivo ? ' catalog-file--selected' : ''}`}>
              <IconoArchivo />
              {archivo ? (
                <>
                  <span className="catalog-file-name">{archivo.name}</span>
                  <span className="catalog-file-hint">{formatearTamano(archivo.size)} · Tocá para cambiarlo</span>
                </>
              ) : (
                <>
                  <span className="catalog-file-name">Elegí un archivo</span>
                  <span className="catalog-file-hint">Excel (.xlsx) o CSV, hasta 5 MB</span>
                </>
              )}
              <input key={claveInput} id={idArchivo} type="file" accept={EXTENSIONES.join(',')} onChange={elegirArchivo} disabled={importando} />
            </label>

            {importando ? (
              <LoaderPata texto="Importando catálogo..." />
            ) : (
              <button type="submit" className="form-submit" disabled={!archivo}>Importar</button>
            )}
          </form>
        </section>

        {error && (
          <section className="home-alert catalog-error" role="alert">
            <p>{error.mensaje}</p>
            {error.detalles.length > 0 && (
              <ul>
                {error.detalles.map((detalle) => (
                  <li key={`${detalle.field}-${detalle.message}`}>
                    {detalle.field.startsWith('fila') ? `Fila ${detalle.field.slice(5)}: ${detalle.message}` : detalle.message}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {resultado && (
          <section className="twofa-card catalog-card" aria-live="polite">
            <h2 className="catalog-step-title">Resultado</h2>
            <p className="twofa-text">{resultado.fileName}</p>
            <div className="catalog-summary">
              <div className="catalog-stat catalog-stat--ok">
                <span className="catalog-stat-value">{resultado.importedRows}</span>
                <span className="catalog-stat-label">Nuevos</span>
              </div>
              <div className="catalog-stat">
                <span className="catalog-stat-value">{resultado.updatedRows}</span>
                <span className="catalog-stat-label">Actualizados</span>
              </div>
              <div className={`catalog-stat${resultado.rejectedRows > 0 ? ' catalog-stat--rejected' : ''}`}>
                <span className="catalog-stat-value">{resultado.rejectedRows}</span>
                <span className="catalog-stat-label">Rechazados</span>
              </div>
            </div>
            {resultado.assignedBarcodes > 0 && (
              <p className="catalog-barcodes">
                {resultado.assignedBarcodes === 1
                  ? 'Se asoció 1 código de barras.'
                  : `Se asociaron ${resultado.assignedBarcodes} códigos de barras.`}
              </p>
            )}

            {resultado.rejections.length > 0 && (
              <>
                <h3 className="catalog-rejections-title">Filas rechazadas</h3>
                <p className="twofa-text">Corregilas en el archivo y volvé a importarlo: las filas válidas no se duplican.</p>
                <ul className="catalog-rejections">
                  {resultado.rejections.map((rechazo) => (
                    <li key={rechazo.row}>
                      <span className="catalog-rejection-row">Fila {rechazo.row}</span>
                      <span>{rechazo.reason}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default CatalogImportPage
