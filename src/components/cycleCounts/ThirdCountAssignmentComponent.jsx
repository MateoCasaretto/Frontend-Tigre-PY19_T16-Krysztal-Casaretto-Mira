
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { listUsers } from '../../services/UserService'
import { getErrorMessage } from '../../services/ApiClient'
import { createThirdCountTask } from '../../services/CycleCountService'

const ThirdCountAssignmentComponent = ({
    cycleCountId,
    warehouseId,
    tasks,
    onCreated
}) => {

    const [users, setUsers] = useState([])
    const [selectedOperators, setSelectedOperators] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Obtener los operarios
    useEffect(() => {
        let active = true

        const loadUsers = async () => {
            try {
                const allUsers = []
                let page = 1
                let total = 0

                do {
                    const response = await listUsers({
                        page,
                        limit: 50
                    })

                    allUsers.push(...response.data)
                    total = response.pagination.total
                    page++

                    if (response.data.length === 0) break

                } while (allUsers.length < total)

                if (active) {
                    setUsers(allUsers)
                }

            } catch (error) {
                if (active) {
                    setError(getErrorMessage(error))
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        loadUsers()

        return () => {
            active = false
        }
    }, [])

    // Operarios que ya participaron en los grupos 1 y 2
    const previousOperators = tasks
        .filter((task) =>
            task.groupNumber === 1 ||
            task.groupNumber === 2
        )
        .flatMap((task) =>
            task.assignedOperators.map((operator) =>
                operator._id || operator
            )
        )

    // Mostrar solamente operarios disponibles de la planta
    const availableOperators = users.filter((user) =>
        user.rol === 'Operario' &&
        user.warehouses?.some((warehouse) =>
            (warehouse._id || warehouse) === warehouseId
        ) &&
        !previousOperators.includes(user._id)
    )

    // Seleccionar o quitar un operario
    const toggleOperator = (operatorId) => {

        if (selectedOperators.includes(operatorId)) {
            setSelectedOperators(
                selectedOperators.filter((id) => id !== operatorId)
            )
        } else {
            setSelectedOperators([
                ...selectedOperators,
                operatorId
            ])
        }
    }

    // Crear la tarea del tercer grupo
    const handleCreateThirdCount = async () => {

        if (selectedOperators.length === 0 || saving) return

        setSaving(true)

        try {
            await createThirdCountTask(
                cycleCountId,
                selectedOperators
            )

            toast.success('Tercer grupo asignado correctamente.')
            onCreated()

        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="cycle-count-section">

            <h4>Asignar tercer grupo</h4>

            <p className="twofa-text">
                Los grupos anteriores registraron cantidades diferentes.
                Seleccioná los operarios que realizarán el tercer conteo.
            </p>

            <p className="twofa-text">
                Solo se muestran operarios de esta planta que no
                participaron en los grupos anteriores.
            </p>

            {loading && (
                <p>Cargando operarios disponibles...</p>
            )}

            {!loading && error && (
                <p>{error}</p>
            )}

            {!loading && !error && availableOperators.length === 0 && (
                <p>
                    No hay operarios disponibles para realizar
                    el tercer conteo.
                </p>
            )}

            {!loading && !error && availableOperators.map((operator) => (
                <label
                    key={operator._id}
                    className="warehouse-option"
                >
                    <input
                        type="checkbox"
                        checked={selectedOperators.includes(operator._id)}
                        onChange={() => toggleOperator(operator._id)}
                        disabled={saving}
                    />

                    <span>{operator.nombreUsuario}</span>
                </label>
            ))}

            {selectedOperators.length > 0 && (
                <p className="twofa-text">
                    Operarios seleccionados: {selectedOperators.length}
                </p>
            )}

            <button
                type="button"
                className="form-submit"
                disabled={
                    selectedOperators.length === 0 ||
                    loading ||
                    saving
                }
                onClick={handleCreateThirdCount}
            >
                {saving
                    ? 'Asignando grupo...'
                    : 'Asignar grupo 3'}
            </button>

        </div>
    )
}

export default ThirdCountAssignmentComponent
