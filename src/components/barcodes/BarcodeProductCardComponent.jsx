import SectionCardComponent from '../common/SectionCardComponent'
import ProductDetailsComponent from '../products/ProductDetailsComponent'
import BarcodeConfirmComponent from './BarcodeConfirmComponent'
import BarcodeFormComponent from './BarcodeFormComponent'
import { BARCODE_STEPS } from '../../hooks/useBarcodeAssignment'

const BarcodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 5v14M7 5v14M11 5v14M14 5v14M18 5v14M20 5v14" />
  </svg>
)

// Producto elegido y el paso actual del CU19: ver, ingresar el código o confirmar
const BarcodeProductCardComponent = ({ assignment }) => {
  const { product, step, code, saving, close, startEntry, requestConfirmation, cancel, confirm } = assignment

  return (
    <SectionCardComponent title={product.sapCode}>
      <ProductDetailsComponent product={product} />

      {step === BARCODE_STEPS.PRODUCT && (
        <div className="barcode-actions">
          <button type="button" className="form-submit barcode-button" onClick={startEntry}>
            <BarcodeIcon />
            {product.barcode ? 'Reemplazar código de barras' : 'Asociar código de barras'}
          </button>
          <button type="button" className="form-secondary" onClick={close}>Elegir otro producto</button>
        </div>
      )}

      {step === BARCODE_STEPS.ENTRY && (
        <BarcodeFormComponent product={product} initialCode={code} onContinue={requestConfirmation} onCancel={cancel} />
      )}

      {step === BARCODE_STEPS.CONFIRMATION && (
        <BarcodeConfirmComponent product={product} code={code} saving={saving} onConfirm={confirm} onCancel={cancel} />
      )}
    </SectionCardComponent>
  )
}

export default BarcodeProductCardComponent
