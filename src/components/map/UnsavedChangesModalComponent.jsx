import { useEffect, useId, useRef } from 'react'

// Confirmación antes de salir con cambios sin guardar. Esc o tocar afuera equivale a quedarse
const UnsavedChangesModalComponent = ({ onStay, onLeave }) => {
  const titleId = useId()
  const stayRef = useRef(null)

  useEffect(() => {
    stayRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onStay()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStay])

  return (
    <div className="unsaved-backdrop" onClick={onStay}>
      <div
        className="unsaved-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="catalog-step-title">Tenés cambios sin guardar</h2>
        <p className="twofa-text">Si salís ahora, se pierden.</p>
        <div className="editor-actions">
          <button ref={stayRef} type="button" className="form-secondary" onClick={onStay}>Seguir editando</button>
          <button type="button" className="form-secondary editor-danger" onClick={onLeave}>Salir sin guardar</button>
        </div>
      </div>
    </div>
  )
}

export default UnsavedChangesModalComponent
