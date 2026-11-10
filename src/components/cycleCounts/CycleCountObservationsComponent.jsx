

const CycleCountObservationsComponent = ({ tasks = [] }) => {

    const observations = []

    // Buscar las observaciones de los tres grupos
    for (const task of tasks) {

        for (let index = 0; index < (task.countedItems?.length || 0); index++) {

            const item = task.countedItems[index]

            if (item.observation?.trim()) {
                observations.push({
                    key: `${task._id}-${index}`,
                    groupNumber: task.groupNumber,
                    product: item.product,
                    locationName: item.locationName,
                    observation: item.observation,
                    operators: task.assignedOperators || []
                })
            }
        }
    }

    return (
        <section className="cycle-observations">

            <div className="cycle-observations-header">
                <h4>Observaciones de los operarios</h4>

                <span className="cycle-observations-count">
                    {observations.length} observaciones
                </span>
            </div>

            {observations.length === 0 ? (
                <p className="cycle-observations-empty">
                    No se registraron observaciones durante los conteos.
                </p>
            ) : (

                observations.map((item) => (
                    <div
                        key={item.key}
                        className="cycle-observation-card"
                    >

                        <div className="cycle-observation-heading">
                            <strong>
                                {item.product?.sapCode || 'Producto'}
                            </strong>

                            <span className="cycle-observation-group">
                                Grupo {item.groupNumber}
                            </span>
                        </div>

                        <p className="cycle-observation-description">
                            {item.product?.description}
                        </p>

                        <div className="cycle-observation-info">
                            <span>Ubicación</span>
                            <strong>
                                {item.locationName || 'Sin ubicación'}
                            </strong>
                        </div>

                        <div className="cycle-observation-message">
                            <strong>Observación registrada</strong>
                            <p>{item.observation}</p>
                        </div>

                        <p className="cycle-observation-operators">
                            <strong>Operarios del grupo: </strong>
                            {item.operators
                                .map((operator) => operator.nombreUsuario)
                                .filter(Boolean)
                                .join(', ') || 'Sin información'}
                        </p>

                    </div>
                ))
            )}

        </section>
    )
}

export default CycleCountObservationsComponent
