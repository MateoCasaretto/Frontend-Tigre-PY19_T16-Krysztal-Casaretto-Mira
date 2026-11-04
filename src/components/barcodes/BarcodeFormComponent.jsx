import { useId, useState } from 'react'
import { toast } from 'react-toastify'
import { BARCODE_FORMAT_MESSAGE, isValidBarcode } from '../../utils/BarcodeUtils'

// Ingreso del código nuevo. Si el guardado falla, vuelve a abrirse con el código anterior
const BarcodeFormComponent = ({ product, initialCode, onContinue, onCancel }) => {
  const id = useId()
  const [code, setCode] = useState(initialCode)
  const [showError, setShowError] = useState(false)

  const isValid = isValidBarcode(code)
  // El error se muestra al salir del campo o al continuar, no mientras se escribe
  const hasFormatError = showError && code.length > 0 && !isValid

  const handleSubmit = (event) => {
    event.preventDefault()
    // E2: con el lector, el Enter llega igual aunque el código sea inválido
    if (!isValid) {
      setShowError(true)
      return
    }
    if (code === product.barcode) {
      toast.info('El producto ya tiene ese código de barras.')
      return
    }
    onContinue(code)
  }

  return (
    <form className="auth-form barcode-form" onSubmit={handleSubmit} noValidate>
      {product.barcode && (
        <p className="home-alert barcode-warning">El código actual {product.barcode} se va a reemplazar por el nuevo.</p>
      )}
      <div className="form-field">
        <label htmlFor={id}>Nuevo código de barras</label>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.trim())
            setShowError(false)
          }}
          onBlur={() => setShowError(true)}
          autoComplete="off"
          enterKeyHint="next"
          maxLength={14}
          autoFocus
          aria-invalid={hasFormatError}
          aria-describedby={`${id}-hint`}
        />
        <span id={`${id}-hint`} className={hasFormatError ? 'barcode-hint barcode-hint--error' : 'barcode-hint'}>
          {hasFormatError
            ? `El código no es válido. ${BARCODE_FORMAT_MESSAGE}.`
            : 'Leelo con el lector o escribilo tal como está impreso en el envase.'}
        </span>
      </div>
      <button type="submit" className="form-submit" disabled={!code}>Continuar</button>
      <button type="button" className="form-secondary" onClick={onCancel}>Cancelar</button>
    </form>
  )
}

export default BarcodeFormComponent
