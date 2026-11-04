import { useId } from 'react'
import LoaderPata from '../common/LoaderPata'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

const ProductSearchFormComponent = ({ value, onChange, searching, onSubmit }) => {
  const id = useId()

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor={id}>Código SAP, descripción o código de barras</label>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={100}
        />
      </div>
      {searching ? (
        <LoaderPata texto="Buscando..." />
      ) : (
        <button type="submit" className="form-submit barcode-button" disabled={!value.trim()}>
          <SearchIcon />
          Buscar
        </button>
      )}
    </form>
  )
}

export default ProductSearchFormComponent
