import { useId } from 'react'
import LoaderPata from '../common/LoaderPata'

const BarcodeConfirmComponent = ({ product, code, saving, onConfirm, onCancel }) => {
  const id = useId()

  return (
    <div className="barcode-confirm" role="alertdialog" aria-labelledby={id}>
      <p id={id} className="barcode-confirm-text">
        {product.barcode ? (
          <>¿Reemplazar el código <strong>{product.barcode}</strong> del producto <strong>{product.sapCode}</strong> por <strong>{code}</strong>?</>
        ) : (
          <>¿Asociar el código <strong>{code}</strong> al producto <strong>{product.sapCode}</strong>?</>
        )}
      </p>
      {saving ? (
        <LoaderPata texto="Guardando..." />
      ) : (
        <div className="barcode-actions">
          <button type="button" className="form-submit" onClick={onConfirm}>Confirmar</button>
          <button type="button" className="form-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      )}
    </div>
  )
}

export default BarcodeConfirmComponent
