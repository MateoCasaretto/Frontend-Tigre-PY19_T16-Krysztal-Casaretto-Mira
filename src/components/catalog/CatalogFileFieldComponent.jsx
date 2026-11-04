import { useId } from 'react'
import { CATALOG_EXTENSIONS, formatFileSize } from '../../utils/CatalogUtils'

const FileIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M12 17v-6M9 14l3-3 3 3" />
  </svg>
)

const CatalogFileFieldComponent = ({ file, inputKey, disabled, onSelect }) => {
  const id = useId()

  return (
    <label htmlFor={id} className={`catalog-file${file ? ' catalog-file--selected' : ''}`}>
      <FileIcon />
      <span className="catalog-file-name">{file ? file.name : 'Elegí un archivo'}</span>
      <span className="catalog-file-hint">
        {file ? `${formatFileSize(file.size)} · Tocá para cambiarlo` : 'Excel (.xlsx) o CSV, hasta 5 MB'}
      </span>
      <input
        key={inputKey}
        id={id}
        type="file"
        accept={CATALOG_EXTENSIONS.join(',')}
        onChange={(event) => onSelect(event.target.files[0])}
        disabled={disabled}
      />
    </label>
  )
}

export default CatalogFileFieldComponent
