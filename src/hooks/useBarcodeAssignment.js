import { useState } from 'react'
import { toast } from 'react-toastify'
import { assignBarcode } from '../services/ProductService'

// Pasos del CU19 una vez elegido el producto
export const BARCODE_STEPS = { PRODUCT: 'product', ENTRY: 'entry', CONFIRMATION: 'confirmation' }

export const useBarcodeAssignment = ({ onAssigned }) => {
  const [product, setProduct] = useState(null)
  const [step, setStep] = useState(null)
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)

  const open = (selected) => {
    setProduct(selected)
    setStep(BARCODE_STEPS.PRODUCT)
    setCode('')
  }

  const close = () => {
    setProduct(null)
    setStep(null)
  }

  const startEntry = () => setStep(BARCODE_STEPS.ENTRY)

  const requestConfirmation = (value) => {
    setCode(value)
    setStep(BARCODE_STEPS.CONFIRMATION)
  }

  const cancel = () => {
    setStep(BARCODE_STEPS.PRODUCT)
    setCode('')
    toast.info('Operación cancelada. No se registraron cambios.')
  }

  const confirm = async () => {
    setSaving(true)
    try {
      const updated = await assignBarcode(product._id, code)
      setProduct(updated)
      setStep(BARCODE_STEPS.PRODUCT)
      setCode('')
      onAssigned(updated)
      toast.success('Código de barras asociado correctamente.')
    } catch (err) {
      // E1 o formato inválido: se vuelve a pedir el código
      setStep(BARCODE_STEPS.ENTRY)
      toast.error(err.response?.data?.message ?? 'No fue posible registrar la asociación.')
    } finally {
      setSaving(false)
    }
  }

  return { product, step, code, saving, open, close, startEntry, requestConfirmation, cancel, confirm }
}
