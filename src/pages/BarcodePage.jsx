import { useId, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import LoaderPata from '../components/common/LoaderPata'
import { BARCODE_FORMAT_MESSAGE, isValidBarcode } from '../utils/BarcodeUtils'
import AppLayout from '../components/layout/AppLayout'

const IconoBuscar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

const IconoCodigoBarras = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 5v14M7 5v14M11 5v14M14 5v14M18 5v14M20 5v14" />
  </svg>
)

const LIMITE = 20

// Pasos de la pantalla: buscar producto, ver producto, ingresar código y confirmar (CU19)
const PASOS = { PRODUCTO: 'producto', INGRESO: 'ingreso', CONFIRMACION: 'confirmacion' }

const BarcodePage = () => {
  const idBusqueda = useId()
  const idCodigo = useId()
  const [busqueda, setBusqueda] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [producto, setProducto] = useState(null)
  const [paso, setPaso] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [verErrorCodigo, setVerErrorCodigo] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const token = useSelector((state) => state.usuario.token)

  const codigoValido = isValidBarcode(codigo)
  // El error se muestra al salir del campo o al continuar, no mientras se escribe
  const mostrarErrorFormato = verErrorCodigo && codigo.length > 0 && !codigoValido

  const apiBuscarProductos = (e) => {
    e.preventDefault()
    const texto = busqueda.trim()
    if (!texto) return
    setBuscando(true)
    setProducto(null)
    setPaso(null)

    axios
      .get('http://localhost:8080/v1/products', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: texto, limit: LIMITE },
      })
      .then((response) => {
        const { data, pagination } = response.data
        setResultados({ texto, productos: data, total: pagination.total })
        // Si se leyó un código de barras y hay un solo producto, se abre directo
        if (data.length === 1 && data[0].barcode === texto) elegirProducto(data[0])
      })
      .catch((err) => {
        toast.error(err.response?.data?.message ?? 'No se pudo buscar el producto.')
      })
      .finally(() => setBuscando(false))
  }

  const elegirProducto = (elegido) => {
    setProducto(elegido)
    setPaso(PASOS.PRODUCTO)
    setCodigo('')
  }

  const volverABuscar = () => {
    setProducto(null)
    setPaso(null)
  }

  const continuarAConfirmacion = (e) => {
    e.preventDefault()
    // E2: con el lector, el Enter llega igual aunque el código sea inválido
    if (!codigoValido) {
      setVerErrorCodigo(true)
      return
    }
    if (codigo === producto.barcode) {
      toast.info('El producto ya tiene ese código de barras.')
      return
    }
    setPaso(PASOS.CONFIRMACION)
  }

  const cancelar = () => {
    setPaso(PASOS.PRODUCTO)
    setCodigo('')
    toast.info('Operación cancelada. No se registraron cambios.')
  }

  const apiAsociarCodigo = () => {
    setGuardando(true)
    axios
      .put(`http://localhost:8080/v1/products/${producto._id}/barcode`, { barcode: codigo }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const actualizado = response.data.data
        setProducto(actualizado)
        setResultados((anteriores) => anteriores && {
          ...anteriores,
          productos: anteriores.productos.map((p) => (p._id === actualizado._id ? actualizado : p)),
        })
        setPaso(PASOS.PRODUCTO)
        setCodigo('')
        toast.success('Código de barras asociado correctamente.')
      })
      .catch((err) => {
        // E1 o formato inválido: se vuelve a pedir el código
        setPaso(PASOS.INGRESO)
        toast.error(err.response?.data?.message ?? 'No fue posible registrar la asociación.')
      })
      .finally(() => setGuardando(false))
  }

  const sinResultados = resultados && resultados.productos.length === 0
  const pareceCodigoBarras = resultados && isValidBarcode(resultados.texto)

  return (
    <AppLayout title="Códigos de barras" back>
      {!producto && (
        <section className="twofa-card catalog-card">
          <h2 className="catalog-step-title">Buscá el producto</h2>
          <p className="twofa-text">Por código SAP o descripción. También podés leer el código de barras de la caja para ver a qué producto corresponde.</p>

          <form className="auth-form" onSubmit={apiBuscarProductos}>
            <div className="form-field">
              <label htmlFor={idBusqueda}>Código SAP, descripción o código de barras</label>
              <input
                id={idBusqueda}
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoComplete="off"
                enterKeyHint="search"
                maxLength={100}
              />
            </div>
            {buscando ? (
              <LoaderPata texto="Buscando..." />
            ) : (
              <button type="submit" className="form-submit barcode-button" disabled={!busqueda.trim()}>
                <IconoBuscar />
                Buscar
              </button>
            )}
          </form>
        </section>
      )}

      {!producto && sinResultados && (
        <p className="home-alert catalog-error" role="alert">
          {pareceCodigoBarras
            ? `El código de barras ${resultados.texto} no tiene correspondencia registrada. Buscá el producto por código SAP o descripción.`
            : `No hay productos que coincidan con "${resultados.texto}".`}
        </p>
      )}

      {!producto && resultados?.productos.length > 0 && (
        <section className="twofa-card catalog-card" aria-live="polite">
          <h2 className="catalog-step-title">Resultados</h2>
          {resultados.total > resultados.productos.length && (
            <p className="twofa-text">Se muestran {resultados.productos.length} de {resultados.total}. Afiná la búsqueda para encontrarlo más rápido.</p>
          )}
          <ul className="barcode-results">
            {resultados.productos.map((p) => (
              <li key={p._id}>
                <button type="button" className="barcode-result" onClick={() => elegirProducto(p)}>
                  <span className="barcode-result-code">{p.sapCode}</span>
                  <span className="barcode-result-description">{p.description}</span>
                  <span className={`barcode-chip${p.barcode ? '' : ' barcode-chip--empty'}`}>
                    {p.barcode ?? 'Sin código de barras'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {producto && (
        <section className="twofa-card catalog-card">
          <h2 className="catalog-step-title">{producto.sapCode}</h2>
          <p className="twofa-text barcode-description">{producto.description}</p>
          <dl className="barcode-data">
            <div>
              <dt>Categoría</dt>
              <dd>{producto.category}</dd>
            </div>
            <div>
              <dt>Línea de producto</dt>
              <dd>{producto.productLine}</dd>
            </div>
            <div className="barcode-data-full">
              <dt>Código de barras</dt>
              <dd className={producto.barcode ? 'barcode-current' : 'barcode-none'}>{producto.barcode ?? 'Sin código de barras asociado'}</dd>
            </div>
          </dl>

          {paso === PASOS.PRODUCTO && (
            <div className="barcode-actions">
              <button type="button" className="form-submit barcode-button" onClick={() => setPaso(PASOS.INGRESO)}>
                <IconoCodigoBarras />
                {producto.barcode ? 'Reemplazar código de barras' : 'Asociar código de barras'}
              </button>
              <button type="button" className="form-secondary" onClick={volverABuscar}>Elegir otro producto</button>
            </div>
          )}

          {paso === PASOS.INGRESO && (
            <form className="auth-form barcode-form" onSubmit={continuarAConfirmacion} noValidate>
              {producto.barcode && (
                <p className="home-alert barcode-warning">El código actual {producto.barcode} se va a reemplazar por el nuevo.</p>
              )}
              <div className="form-field">
                <label htmlFor={idCodigo}>Nuevo código de barras</label>
                <input
                  id={idCodigo}
                  type="text"
                  inputMode="numeric"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value.trim())
                    setVerErrorCodigo(false)
                  }}
                  onBlur={() => setVerErrorCodigo(true)}
                  autoComplete="off"
                  enterKeyHint="next"
                  maxLength={14}
                  autoFocus
                  aria-invalid={mostrarErrorFormato}
                  aria-describedby={`${idCodigo}-ayuda`}
                />
                <span id={`${idCodigo}-ayuda`} className={mostrarErrorFormato ? 'barcode-hint barcode-hint--error' : 'barcode-hint'}>
                  {mostrarErrorFormato
                    ? `El código no es válido. ${BARCODE_FORMAT_MESSAGE}.`
                    : 'Leelo con el lector o escribilo tal como está impreso en el envase.'}
                </span>
              </div>
              <button type="submit" className="form-submit" disabled={!codigo}>Continuar</button>
              <button type="button" className="form-secondary" onClick={cancelar}>Cancelar</button>
            </form>
          )}

          {paso === PASOS.CONFIRMACION && (
            <div className="barcode-confirm" role="alertdialog" aria-labelledby={`${idCodigo}-confirmar`}>
              <p id={`${idCodigo}-confirmar`} className="barcode-confirm-text">
                {producto.barcode ? (
                  <>¿Reemplazar el código <strong>{producto.barcode}</strong> del producto <strong>{producto.sapCode}</strong> por <strong>{codigo}</strong>?</>
                ) : (
                  <>¿Asociar el código <strong>{codigo}</strong> al producto <strong>{producto.sapCode}</strong>?</>
                )}
              </p>
              {guardando ? (
                <LoaderPata texto="Guardando..." />
              ) : (
                <div className="barcode-actions">
                  <button type="button" className="form-submit" onClick={apiAsociarCodigo}>Confirmar</button>
                  <button type="button" className="form-secondary" onClick={cancelar}>Cancelar</button>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </AppLayout>
  )
}

export default BarcodePage
