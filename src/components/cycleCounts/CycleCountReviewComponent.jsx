
import { useState } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../services/ApiClient'
import {
    justifyStockDifference,
    closeCycleCount
} from '../../services/CycleCountService'

const CycleCountReviewComponent = ({ detail, onChanged }) => {

    const { cycleCount, differences = [] } = detail

    const [justifications, setJustifications] = useState({})
    const [savingIndex, setSavingIndex] = useState(null)
    const [closing, setClosing] = useState(false)

    const isReview = cycleCount.status === 'review'
    const busy = savingIndex !== null || closing

    // Obtener ID de un producto
    const getProductId = (product) => {
        return String(product?._id || product)
    }

    // Buscar información del producto
    const getProduct = (productId) => {
        return cycleCount.products?.find((product) =>
            getProductId(product) === getProductId(productId)
        )
    }

    // Buscar la posición en el stock esperado
    const getExpectedItem = (item) => {
        return cycleCount.expectedStock?.find((stock) =>
            getProductId(stock.product) === getProductId(item.product) &&
            String(stock.elementId) === String(item.elementId) &&
            String(stock.positionId ?? '') === String(item.positionId ?? '')
        )
    }

    // Diferencias pendientes de justificar
    const pendingJustifications = differences.filter((item) => {
        const stock = getExpectedItem(item)

        return item.requiresJustification &&
            !stock?.justification?.trim()
    })

    // Guardar justificación
    const handleSaveJustification = async (item, index) => {

        if (busy || !isReview) return

        const justification = (justifications[index] || '').trim()

        if (!justification) {
            toast.error('Ingresá una justificación.')
            return
        }

        setSavingIndex(index)

        try {
            await justifyStockDifference(cycleCount._id, {
                product: getProductId(item.product),
                elementId: item.elementId,
                positionId: item.positionId ?? null,
                justification
            })

            toast.success('Justificación guardada correctamente.')

            setJustifications((current) => ({
                ...current,
                [index]: ''
            }))

            onChanged()

        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setSavingIndex(null)
        }
    }

    // Cerrar inventario
    const handleClose = async () => {

        if (!isReview || pendingJustifications.length > 0 || busy) {
            return
        }

        const confirmed = window.confirm(
            '¿Querés cerrar definitivamente este inventario cíclico?'
        )

        if (!confirmed) return

        setClosing(true)

        try {
            await closeCycleCount(cycleCount._id)

            toast.success('Inventario cerrado correctamente.')
            onChanged()

        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setClosing(false)
        }
    }

    return (
        <div className="cycle-review">

            <div className="cycle-review-header">
                <div>
                    <h4>Resultados del conteo</h4>
                    <p>
                        Comparación entre las cantidades contadas
                        y el stock esperado.
                    </p>
                </div>

                <span className="cycle-review-count">
                    {differences.length} posiciones
                </span>
            </div>

            {differences.length === 0 && (
                <p>No hay resultados disponibles.</p>
            )}

            {differences.map((item, index) => {

                const product = getProduct(item.product)
                const expectedItem = getExpectedItem(item)
                const savedJustification = expectedItem?.justification

                const hasDifference = item.requiresJustification

                return (
                    <div
                        key={index}
                        className="cycle-review-card"
                    >

                        {/* Encabezado del producto */}
                        <div className="cycle-review-product">

                            <div>
                                <strong className="cycle-review-code">
                                    {product?.sapCode || 'Producto sin identificar'}
                                </strong>

                                {product?.description && (
                                    <p className="cycle-review-description">
                                        {product.description}
                                    </p>
                                )}
                            </div>

                            <span className={
                                hasDifference
                                    ? 'cycle-review-status difference'
                                    : 'cycle-review-status correct'
                            }>
                                {hasDifference
                                    ? 'Con diferencia'
                                    : 'Sin diferencia'}
                            </span>

                        </div>

                        {/* Ubicación */}
                        <div className="cycle-review-location">
                            <span className="cycle-review-label">
                                Ubicación
                            </span>

                            <strong>
                                {item.locationName || 'Sin ubicación'}
                            </strong>
                        </div>

                        {/* Comparación de cantidades */}
                        <div className="cycle-review-metrics">

                            <div className="cycle-review-metric">
                                <span>Stock esperado</span>
                                <strong>{item.expectedQuantity}</strong>
                            </div>

                            <div className="cycle-review-metric">
                                <span>Stock contado</span>
                                <strong>{item.finalQuantity}</strong>
                            </div>

                            <div className={
                                hasDifference
                                    ? 'cycle-review-metric difference'
                                    : 'cycle-review-metric correct'
                            }>
                                <span>Diferencia</span>
                                <strong>
                                    {item.difference > 0
                                        ? `+${item.difference}`
                                        : item.difference}
                                </strong>
                            </div>

                        </div>

                        {/* Justificación */}
                        {hasDifference && (
                            <div className="cycle-review-justification">

                                {savedJustification ? (

                                    <div className="cycle-review-justified">
                                        <strong>
                                            ✓ Diferencia justificada
                                        </strong>
                                        <p>{savedJustification}</p>
                                    </div>

                                ) : isReview ? (

                                    <div className="form-field">

                                        <label htmlFor={`justification-${index}`}>
                                            Justificación de la diferencia
                                        </label>

                                        <textarea
                                            id={`justification-${index}`}
                                            rows="3"
                                            placeholder="Explicá el motivo de la diferencia..."
                                            value={justifications[index] ?? ''}
                                            disabled={busy}
                                            onChange={(event) => {
                                                setJustifications((current) => ({
                                                    ...current,
                                                    [index]: event.target.value
                                                }))
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="form-secondary"
                                            disabled={
                                                busy ||
                                                !(justifications[index] || '').trim()
                                            }
                                            onClick={() =>
                                                handleSaveJustification(item, index)
                                            }
                                        >
                                            {savingIndex === index
                                                ? 'Guardando...'
                                                : 'Guardar justificación'}
                                        </button>

                                    </div>

                                ) : (
                                    <p>Diferencia sin justificación registrada.</p>
                                )}

                            </div>
                        )}

                    </div>
                )
            })}

            {/* Cierre del inventario */}
            {isReview && (
                <div className="cycle-review-footer">

                    <div className="cycle-review-pending">
                        <strong>Revisión administrativa</strong>

                        <span>
                            {pendingJustifications.length === 0
                                ? 'Todas las diferencias están justificadas.'
                                : `${pendingJustifications.length} diferencias pendientes de justificar.`}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="form-submit"
                        disabled={
                            busy ||
                            pendingJustifications.length > 0 ||
                            differences.length === 0
                        }
                        onClick={handleClose}
                    >
                        {closing
                            ? 'Cerrando inventario...'
                            : 'Cerrar inventario'}
                    </button>

                </div>
            )}

            {cycleCount.status === 'closed' && (
                <div className="cycle-review-justified">
                    <strong>✓ Inventario cerrado</strong>
                </div>
            )}

        </div>
    )
}

export default CycleCountReviewComponent
