import { useState } from 'react'
import { toast } from 'react-toastify'
import { importCatalog } from '../services/CatalogImportService'
import { hasCatalogExtension } from '../utils/CatalogUtils'

// Archivo elegido, importación en curso y su resultado o error (CU06)
export const useCatalogImport = () => {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  // Cambiar la clave vacía el input, para poder volver a elegir el mismo archivo
  const [inputKey, setInputKey] = useState(0)

  const resetInput = () => setInputKey((key) => key + 1)

  const selectFile = (selected) => {
    if (!selected) return
    if (!hasCatalogExtension(selected.name)) {
      toast.error('Formato no admitido. Usá un Excel (.xlsx) o un CSV (.csv).')
      resetInput()
      return
    }
    setFile(selected)
    setResult(null)
    setError(null)
  }

  const submit = async () => {
    setImporting(true)
    setResult(null)
    setError(null)

    try {
      const summary = await importCatalog(file)
      setResult(summary)
      setFile(null)
      resetInput()
      toast.success(`Catálogo importado: ${summary.importedRows} nuevos y ${summary.updatedRows} actualizados.`)
    } catch (err) {
      const message = err.response?.data?.message ?? 'No se pudo importar el catálogo.'
      setError({ message, details: err.response?.data?.details ?? [] })
      toast.error(message)
    } finally {
      setImporting(false)
    }
  }

  return { file, importing, result, error, inputKey, selectFile, submit }
}
