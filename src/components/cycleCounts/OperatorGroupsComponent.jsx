
import { useState } from 'react'

const OperatorGroupsComponent = ({
    operators,
    group1Operators,
    group2Operators,
    onChange
}) => {

    const [selected, setSelected] = useState([])
    const [search, setSearch] = useState('')

    const available = operators.filter((operator) =>
        !group1Operators.includes(operator._id) &&
        !group2Operators.includes(operator._id)
    )

    const filteredAvailable = available.filter((operator) =>
        operator.nombreUsuario.toLowerCase().includes(search.toLowerCase())
    )

    const group1 = operators.filter((operator) =>
        group1Operators.includes(operator._id)
    )

    const group2 = operators.filter((operator) =>
        group2Operators.includes(operator._id)
    )

    const toggleSelected = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((item) => item !== id))
        } else {
            setSelected([...selected, id])
        }
    }

    const moveOperators = (ids, destination) => {
        const validIds = ids.filter((id) =>
            operators.some((operator) => operator._id === id)
        )

        const newGroup1 = group1Operators.filter(
            (id) => !validIds.includes(id)
        )

        const newGroup2 = group2Operators.filter(
            (id) => !validIds.includes(id)
        )

        if (destination === '1') {
            newGroup1.push(...validIds)
        }

        if (destination === '2') {
            newGroup2.push(...validIds)
        }

        onChange(newGroup1, newGroup2)
        setSelected([])
    }

    const handleDragStart = (event, id) => {
        const ids = selected.includes(id) ? selected : [id]

        event.dataTransfer.setData('text/plain', JSON.stringify(ids))
        event.dataTransfer.effectAllowed = 'move'
    }

    const handleDrop = (event, destination) => {
        event.preventDefault()

        try {
            const ids = JSON.parse(
                event.dataTransfer.getData('text/plain')
            )

            if (Array.isArray(ids)) {
                moveOperators(ids, destination)
            }
        } catch {
            // Ignorar elementos que no sean operarios
        }
    }

    const renderGroup = (title, number, members) => (
        <div
            className="cycle-group"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, number)}
        >
            <h4>{title} ({members.length})</h4>

            {members.length === 0 && (
                <p className="cycle-group-empty">
                    Arrastrá operarios aquí
                </p>
            )}

            {members.map((operator) => (
                <div
                    key={operator._id}
                    className="cycle-operator"
                    draggable
                    onDragStart={(event) =>
                        handleDragStart(event, operator._id)
                    }
                >
                    <span>{operator.nombreUsuario}</span>

                    <button
                        type="button"
                        onClick={() =>
                            moveOperators([operator._id], '')
                        }
                        aria-label={`Quitar a ${operator.nombreUsuario} del grupo`}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )

    return (
        <div className="cycle-operators">

            <h3>Asignación de operarios</h3>

            <p className="twofa-text">
                Seleccioná varios operarios y asignales un grupo,
                o arrastralos directamente.
            </p>

            <div
                className="cycle-group"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, '')}
            >
                <h4>Operarios disponibles ({available.length})</h4>

                <input
                    type="search"
                    placeholder="Buscar operario..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="cycle-operator-search"
                />

                <div className="cycle-operator-list">
                    {filteredAvailable.map((operator) => (
                        <button
                            key={operator._id}
                            type="button"
                            draggable
                            onDragStart={(event) =>
                                handleDragStart(event, operator._id)
                            }
                            className={
                                selected.includes(operator._id)
                                    ? 'cycle-operator-option selected'
                                    : 'cycle-operator-option'
                            }
                            aria-pressed={selected.includes(operator._id)}
                            onClick={() => toggleSelected(operator._id)}
                        >
                            {operator.nombreUsuario}
                        </button>
                    ))}
                </div>

                {filteredAvailable.length === 0 && (
                    <p className="cycle-group-empty">
                        No hay operarios disponibles.
                    </p>
                )}

                <div className="cycle-selection-actions">
                    <button
                        type="button"
                        className="form-secondary"
                        onClick={() =>
                            setSelected(filteredAvailable.map((op) => op._id))
                        }
                        disabled={filteredAvailable.length === 0}
                    >
                        Seleccionar todos
                    </button>

                    <button
                        type="button"
                        className="form-secondary"
                        onClick={() => setSelected([])}
                        disabled={selected.length === 0}
                    >
                        Limpiar selección
                    </button>
                </div>

                <p className="twofa-text">
                    {selected.length} seleccionados
                </p>

                <div className="cycle-selection-actions">
                    <button
                        type="button"
                        className="form-secondary"
                        disabled={selected.length === 0}
                        onClick={() => moveOperators(selected, '1')}
                    >
                        Agregar al grupo 1
                    </button>

                    <button
                        type="button"
                        className="form-secondary"
                        disabled={selected.length === 0}
                        onClick={() => moveOperators(selected, '2')}
                    >
                        Agregar al grupo 2
                    </button>
                </div>
            </div>

            <div className="cycle-groups">
                {renderGroup('Grupo 1', '1', group1)}
                {renderGroup('Grupo 2', '2', group2)}
            </div>

        </div>
    )
}

export default OperatorGroupsComponent
