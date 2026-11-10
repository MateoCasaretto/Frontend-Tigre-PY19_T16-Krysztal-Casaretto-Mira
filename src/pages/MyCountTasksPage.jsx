
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AppLayout from '../components/layout/AppLayout'
import SectionCardComponent from '../components/common/SectionCardComponent'
import LoaderPata from '../components/common/LoaderPata'
import EmptyStateComponent from '../components/common/EmptyStateComponent'
import { getErrorMessage } from '../services/ApiClient'
import {
    getMyCountTasks,
    getCountTaskDetail,
    saveCountItem,
    saveCountObservation,
    finishCountTask
} from '../services/CycleCountService'

const MyCountTasksPage = () => {

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Tarea seleccionada
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [taskDetail, setTaskDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [detailError, setDetailError] = useState('')

    // Cantidades y observaciones
    const [quantities, setQuantities] = useState({})
    const [observations, setObservations] = useState({})

    // Estados de guardado
    const [savingIndex, setSavingIndex] = useState(null)
    const [savingObservationIndex, setSavingObservationIndex] = useState(null)
    const [finishing, setFinishing] = useState(false)

    // Obtener tareas asignadas
    useEffect(() => {

        const loadTasks = async () => {
            try {
                const data = await getMyCountTasks()
                setTasks(data)
            } catch (error) {
                setError('No se pudieron cargar las tareas.')
            } finally {
                setLoading(false)
            }
        }

        loadTasks()

    }, [])

    // Saber si hay alguna operación en proceso
    const busy =
        savingIndex !== null ||
        savingObservationIndex !== null ||
        detailLoading ||
        finishing

    // Calcular el avance del conteo
    const items = taskDetail?.countedItems || []

    const totalPositions = items.length

    const completedPositions = items.filter((item) =>
        item.countedQuantity !== null &&
        item.countedQuantity !== undefined
    ).length

    const progress = totalPositions > 0
        ? Math.round((completedPositions / totalPositions) * 100)
        : 0

    // Abrir o cerrar una tarea
    const openTask = async (taskId) => {

        if (busy) return

        if (selectedTaskId === taskId) {
            setSelectedTaskId(null)
            setTaskDetail(null)
            setQuantities({})
            setObservations({})
            return
        }

        setSelectedTaskId(taskId)
        setTaskDetail(null)
        setQuantities({})
        setObservations({})
        setDetailError('')
        setDetailLoading(true)

        try {
            const data = await getCountTaskDetail(taskId)
            setTaskDetail(data.task || data.countTask || data)
        } catch (error) {
            setDetailError('No se pudo cargar el detalle de la tarea.')
        } finally {
            setDetailLoading(false)
        }
    }

    // Actualizar el detalle de la tarea
    const refreshDetail = async (taskId) => {
        const data = await getCountTaskDetail(taskId)
        setTaskDetail(data.task || data.countTask || data)
    }

    // Guardar cantidad
    const handleSaveQuantity = async (item, index) => {

        if (busy || taskDetail?.status !== 'pending') return

        const value = String(quantities[index] ?? '').trim()
        const countedQuantity = Number(value)

        if (!/^\d+$/.test(value) || !Number.isSafeInteger(countedQuantity)) {
            toast.error('Ingresá una cantidad entera mayor o igual a cero.')
            return
        }

        setSavingIndex(index)

        try {
            await saveCountItem(selectedTaskId, {
                product: item.product?._id || item.product,
                elementId: item.elementId,
                positionId: item.positionId ?? null,
                countedQuantity
            })

            await refreshDetail(selectedTaskId)

            setQuantities((current) => ({
                ...current,
                [index]: ''
            }))

            toast.success('Cantidad guardada correctamente.')

        } catch (error) {
            toast.error(getErrorMessage(error))

            if (error.response?.status === 409) {
                try {
                    await refreshDetail(selectedTaskId)
                } catch {
                    // Mantener el mensaje anterior
                }
            }

        } finally {
            setSavingIndex(null)
        }
    }

    // Guardar una observación
    const handleSaveObservation = async (item, index) => {

        if (busy || taskDetail?.status !== 'pending') return

        const observation = (observations[index] || '').trim()

        if (!observation) {
            toast.error('Ingresá una observación.')
            return
        }

        setSavingObservationIndex(index)

        try {
            await saveCountObservation(selectedTaskId, {
                product: item.product?._id || item.product,
                elementId: item.elementId,
                positionId: item.positionId ?? null,
                observation
            })

            await refreshDetail(selectedTaskId)

            setObservations((current) => ({
                ...current,
                [index]: ''
            }))

            toast.success('Observación guardada correctamente.')

        } catch (error) {
            toast.error(getErrorMessage(error))

            if (error.response?.status === 409) {
                try {
                    await refreshDetail(selectedTaskId)
                } catch {
                    // Mantener el mensaje anterior
                }
            }

        } finally {
            setSavingObservationIndex(null)
        }
    }

    // Finalizar el conteo
    const handleFinishTask = async () => {

        if (busy || taskDetail?.status !== 'pending') return

        if (
            totalPositions === 0 ||
            completedPositions !== totalPositions
        ) {
            toast.error('Debés contar todas las posiciones.')
            return
        }

        // Evitar perder observaciones que todavía no se guardaron
        const hasPendingObservations = Object.values(observations)
            .some((text) => text.trim() !== '')

        if (hasPendingObservations) {
            toast.error('Guardá las observaciones antes de finalizar.')
            return
        }

        const confirmed = window.confirm(
            '¿Estás seguro de que querés finalizar el conteo? ' +
            'Una vez finalizado no podrás modificar cantidades ni observaciones.'
        )

        if (!confirmed) return

        setFinishing(true)

        try {
            await finishCountTask(selectedTaskId)

            // Actualizar el estado en la lista
            setTasks((current) =>
                current.map((task) =>
                    task._id === selectedTaskId
                        ? { ...task, status: 'submitted' }
                        : task
                )
            )

            // Actualizar el detalle
            setTaskDetail((current) =>
                current
                    ? { ...current, status: 'submitted' }
                    : current
            )

            toast.success('Conteo finalizado correctamente.')

        } catch (error) {
            toast.error(getErrorMessage(error))

            try {
                await refreshDetail(selectedTaskId)
                const updatedTasks = await getMyCountTasks()
                setTasks(updatedTasks)
            } catch {
                // Mantener el mensaje anterior
            }

        } finally {
            setFinishing(false)
        }
    }

    return (
        <AppLayout title="Mis tareas de conteo" back>

            <SectionCardComponent title="Tareas asignadas">

                {loading && (
                    <LoaderPata texto="Cargando tareas..." />
                )}

                {!loading && error && (
                    <EmptyStateComponent message={error} />
                )}

                {!loading && !error && tasks.length === 0 && (
                    <EmptyStateComponent
                        message="No tenés tareas de conteo asignadas."
                    />
                )}

                {!loading && !error && tasks.map((task) => (
                    <div key={task._id} className="cycle-count-card">

                        {/* Tarjeta de la tarea */}
                        <button
                            type="button"
                            className="barcode-result"
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }}
                            onClick={() => openTask(task._id)}
                            disabled={busy}
                            aria-expanded={selectedTaskId === task._id}
                        >
                            <strong>
                                Conteo cíclico - Grupo {task.groupNumber}
                            </strong>

                            <p>
                                Estado: {task.status === 'submitted'
                                    ? 'Finalizada'
                                    : 'Pendiente'}
                            </p>

                            <span className="cycle-count-link">
                                {selectedTaskId === task._id
                                    ? 'Ocultar detalle ▲'
                                    : 'Ver posiciones ▼'}
                            </span>
                        </button>

                        {/* Detalle */}
                        {selectedTaskId === task._id && (
                            <div className="cycle-count-detail">

                                {detailLoading && (
                                    <LoaderPata texto="Cargando posiciones..." />
                                )}

                                {!detailLoading && detailError && (
                                    <p>{detailError}</p>
                                )}

                                {!detailLoading && !detailError && taskDetail && (
                                    <>
                                        <h3>Posiciones para contar</h3>

                                        {/* Avance */}
                                        <div className="cycle-count-section">
                                            <strong>
                                                Avance: {completedPositions} de {totalPositions}
                                                {' '}posiciones ({progress}%)
                                            </strong>

                                            <progress
                                                value={completedPositions}
                                                max={Math.max(totalPositions, 1)}
                                                style={{ width: '100%', height: '18px' }}
                                            />
                                        </div>

                                        {/* Lista de posiciones */}
                                        {items.length === 0 && (
                                            <p>No hay posiciones asignadas.</p>
                                        )}

                                        {items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="cycle-count-product"
                                            >

                                                <strong>
                                                    {item.product?.sapCode || 'Producto'}
                                                </strong>

                                                <span>
                                                    {item.product?.description}
                                                </span>

                                                <span>
                                                    Ubicación: {item.locationName || 'Sin nombre'}
                                                </span>

                                                {/* Cantidad */}
                                                {item.countedQuantity !== null &&
                                                 item.countedQuantity !== undefined ? (

                                                    <span>
                                                        Cantidad registrada: {item.countedQuantity}
                                                    </span>

                                                ) : taskDetail.status === 'pending' ? (

                                                    <div className="form-field">

                                                        <label htmlFor={`quantity-${index}`}>
                                                            Cantidad encontrada
                                                        </label>

                                                        <input
                                                            id={`quantity-${index}`}
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            placeholder="Ingresar cantidad"
                                                            value={quantities[index] ?? ''}
                                                            disabled={busy}
                                                            onChange={(event) => {
                                                                setQuantities((current) => ({
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
                                                                quantities[index] === undefined ||
                                                                quantities[index] === ''
                                                            }
                                                            onClick={() => handleSaveQuantity(item, index)}
                                                        >
                                                            {savingIndex === index
                                                                ? 'Guardando...'
                                                                : 'Guardar cantidad'}
                                                        </button>

                                                    </div>

                                                ) : (
                                                    <span>Cantidad sin registrar</span>
                                                )}

                                                {/* Observaciones */}
                                                {item.observation ? (

                                                    <div className="cycle-count-section">
                                                        <strong>Observación:</strong>
                                                        <span>{item.observation}</span>
                                                    </div>

                                                ) : taskDetail.status === 'pending' ? (

                                                    <div className="form-field">

                                                        <label htmlFor={`observation-${index}`}>
                                                            Observación (opcional)
                                                        </label>

                                                        <textarea
                                                            id={`observation-${index}`}
                                                            rows="2"
                                                            placeholder="Ej.: Producto dañado o ubicación incorrecta"
                                                            value={observations[index] ?? ''}
                                                            disabled={busy}
                                                            onChange={(event) => {
                                                                setObservations((current) => ({
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
                                                                !(observations[index] || '').trim()
                                                            }
                                                            onClick={() =>
                                                                handleSaveObservation(item, index)
                                                            }
                                                        >
                                                            {savingObservationIndex === index
                                                                ? 'Guardando...'
                                                                : 'Guardar observación'}
                                                        </button>

                                                    </div>

                                                ) : null}

                                            </div>
                                        ))}

                                        {/* Finalización */}
                                        {taskDetail.status === 'pending' && (
                                            <div className="cycle-count-section">

                                                <p className="twofa-text">
                                                    Para finalizar, debés registrar
                                                    la cantidad de todas las posiciones.
                                                </p>

                                                <button
                                                    type="button"
                                                    className="form-submit"
                                                    disabled={
                                                        busy ||
                                                        totalPositions === 0 ||
                                                        completedPositions !== totalPositions
                                                    }
                                                    onClick={handleFinishTask}
                                                >
                                                    {finishing
                                                        ? 'Finalizando...'
                                                        : 'Finalizar conteo'}
                                                </button>

                                            </div>
                                        )}

                                        {/* Tarea finalizada */}
                                        {taskDetail.status === 'submitted' && (
                                            <div className="cycle-count-section">
                                                <strong>
                                                    Conteo finalizado
                                                </strong>
                                                <p>
                                                    Esta tarea ya fue enviada.
                                                    No se pueden realizar modificaciones.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        )}

                    </div>
                ))}

            </SectionCardComponent>

        </AppLayout>
    )
}

export default MyCountTasksPage
