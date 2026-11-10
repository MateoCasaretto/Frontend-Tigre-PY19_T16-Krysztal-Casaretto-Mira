
import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import SectionCardComponent from "../components/common/SectionCardComponent";
import LoaderPata from "../components/common/LoaderPata";
import EmptyStateComponent from "../components/common/EmptyStateComponent";
import {
    getCycleCounts,
    getCycleCountDetail
} from "../services/CycleCountService";
import CreateCycleCountFormComponent from "../components/cycleCounts/CreateCycleCountFormComponent";
import ThirdCountAssignmentComponent from "../components/cycleCounts/ThirdCountAssignmentComponent";
import CycleCountReviewComponent from "../components/cycleCounts/CycleCountReviewComponent";
import CycleCountObservationsComponent from "../components/cycleCounts/CycleCountObservationsComponent";

// Traducir los estados del backend
const statusLabels = {
    pending: "Pendiente",
    in_progress: "En curso",
    third_count: "Tercer conteo",
    review: "En revisión",
    closed: "Cerrado",
    submitted: "Finalizado"
};

const getStatusLabel = (status) => {
    return statusLabels[status] || status;
};

const CycleCountsPage = () => {

    const [cycleCounts, setCycleCounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(0);

    // Inventario seleccionado
    const [selectedId, setSelectedId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Consultar todos los inventarios
    useEffect(() => {
        let active = true;

        const loadCycleCounts = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getCycleCounts();

                if (active) {
                    setCycleCounts(data);
                }
            } catch (error) {
                if (active) {
                    setError("No se pudieron cargar los inventarios.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadCycleCounts();

        return () => {
            active = false;
        };
    }, [refresh]);

    // Consultar el detalle del inventario seleccionado
    useEffect(() => {
        if (!selectedId) return;

        let active = true;

        const loadDetail = async () => {
            setDetailLoading(true);
            setDetailError("");

            try {
                const data = await getCycleCountDetail(selectedId);

                if (active) {
                    setDetail(data);
                }
            } catch (error) {
                if (active) {
                    setDetailError("No se pudo cargar el detalle.");
                }
            } finally {
                if (active) {
                    setDetailLoading(false);
                }
            }
        };

        loadDetail();

        return () => {
            active = false;
        };
    }, [selectedId, refresh]);

    // Abrir o cerrar el detalle
    const toggleDetail = (cycleCountId) => {
        if (selectedId === cycleCountId) {
            setSelectedId(null);
            setDetail(null);
        } else {
            setDetail(null);
            setSelectedId(cycleCountId);
        }
    };

    return (
        <AppLayout title="Inventarios cíclicos" back>

            {/* Crear inventario */}
            {showForm ? (
                <SectionCardComponent title="Crear inventario cíclico">
                    <CreateCycleCountFormComponent
                        onCreated={() => {
                            setShowForm(false);
                            setSelectedId(null);
                            setDetail(null);
                            setRefresh((current) => current + 1);
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </SectionCardComponent>
            ) : (
                <button
                    type="button"
                    className="form-submit"
                    onClick={() => setShowForm(true)}
                >
                    Nuevo inventario cíclico
                </button>
            )}

            {/* Listado */}
            <SectionCardComponent title="Inventarios registrados">

                {loading && (
                    <LoaderPata texto="Cargando inventarios..." />
                )}

                {!loading && error && (
                    <EmptyStateComponent message={error} />
                )}

                {!loading && !error && cycleCounts.length === 0 && (
                    <EmptyStateComponent
                        message="Todavía no hay inventarios registrados."
                    />
                )}

                {!loading && !error && cycleCounts.map((cycleCount) => (

                    <div
                        key={cycleCount._id}
                        className="cycle-count-card"
                    >

                        {/* Tarjeta del inventario */}
                        <button
                            type="button"
                            className="barcode-result"
                            onClick={() => toggleDetail(cycleCount._id)}
                            aria-expanded={selectedId === cycleCount._id}
                        >
                            <span className="cycle-count-heading">
                                <strong>
                                    {cycleCount.warehouse?.name || "Planta"}
                                </strong>

                                <span className="cycle-count-status">
                                    {getStatusLabel(cycleCount.status)}
                                </span>
                            </span>

                            <span className="cycle-count-secondary">
                                {cycleCount.products?.length || 0} productos

                                {cycleCount.createdAt && (
                                    <>
                                        {" · "}
                                        {new Date(
                                            cycleCount.createdAt
                                        ).toLocaleDateString("es-UY")}
                                    </>
                                )}
                            </span>

                            <span className="cycle-count-link">
                                {selectedId === cycleCount._id
                                    ? "Ocultar detalle ▲"
                                    : "Ver detalle ▼"}
                            </span>
                        </button>

                        {/* Detalle desplegable */}
                        {selectedId === cycleCount._id && (
                            <div className="cycle-count-detail">

                                {detailLoading && (
                                    <LoaderPata texto="Cargando detalle..." />
                                )}

                                {!detailLoading && detailError && (
                                    <p>{detailError}</p>
                                )}

                                {!detailLoading && !detailError && detail && (
                                    <>
                                        <h3>Detalle del inventario</h3>

                                        <p>
                                            <strong>Creado por:</strong>{" "}
                                            {detail.cycleCount.createdBy?.nombreUsuario || "Sin dato"}
                                        </p>

                                        {/* Productos */}
                                        <div className="cycle-count-section">
                                            <h4>Productos incluidos</h4>

                                            {detail.cycleCount.products?.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="cycle-count-product"
                                                >
                                                    <strong>
                                                        {product.sapCode}
                                                    </strong>

                                                    <span>
                                                        {product.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Grupos */}
                                        <div className="cycle-count-section">
                                            <h4>Grupos de conteo</h4>

                                            <div className="cycle-count-groups">
                                                {detail.tasks?.map((task) => (
                                                    <div
                                                        key={task._id}
                                                        className="cycle-count-group"
                                                    >
                                                        <strong>
                                                            Grupo {task.groupNumber}
                                                        </strong>

                                                        <span>
                                                            {getStatusLabel(task.status)}
                                                        </span>

                                                        <ul>
                                                            {task.assignedOperators?.map((operator) => (
                                                                <li key={operator._id}>
                                                                    {operator.nombreUsuario}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {task.submittedAt && (
                                                            <small>
                                                                Finalizado:{" "}
                                                                {new Date(
                                                                    task.submittedAt
                                                                ).toLocaleDateString("es-UY")}
                                                            </small>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Asignación del tercer grupo */}
                                        {detail.cycleCount.status === "third_count" && (
                                            <>
                                                {!detail.tasks?.some(
                                                    (task) => task.groupNumber === 3
                                                ) ? (

                                                    <ThirdCountAssignmentComponent
                                                        cycleCountId={detail.cycleCount._id}
                                                        warehouseId={
                                                            detail.cycleCount.warehouse?._id ||
                                                            detail.cycleCount.warehouse
                                                        }
                                                        tasks={detail.tasks || []}
                                                        onCreated={() => {
                                                            setRefresh((current) => current + 1);
                                                        }}
                                                    />

                                                ) : (

                                                    <div className="cycle-count-section">
                                                        <p>
                                                            El tercer grupo ya fue asignado.
                                                            Se está esperando que finalice su conteo.
                                                        </p>
                                                    </div>

                                                )}
                                            </>
                                        )}

                                        {/* Resultados y revisión administrativa */}
                                        {["review", "closed"].includes(
                                            detail.cycleCount.status
                                        ) && (
                                                <CycleCountReviewComponent
                                                    detail={detail}
                                                    onChanged={() => {
                                                        setRefresh((current) => current + 1);
                                                    }}
                                                />
                                            )}

                                    </>
                                )}


                                {/* Observaciones de los operarios */}
                                {!detailLoading &&
                                    !detailError &&
                                    detail?.cycleCount &&
                                    ["review", "closed"].includes(detail.cycleCount.status) && (
                                        <CycleCountObservationsComponent
                                            tasks={detail.tasks || []}
                                        />
                                    )}

                            </div>
                        )}

                    </div>

                ))}

            </SectionCardComponent>

        </AppLayout>
    );
};

export default CycleCountsPage;
