export const CATALOG_EXTENSIONS = ['.xlsx', '.csv']

export const hasCatalogExtension = (fileName) => {
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  return CATALOG_EXTENSIONS.includes(extension)
}

export const formatFileSize = (bytes) => (
  bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
)
