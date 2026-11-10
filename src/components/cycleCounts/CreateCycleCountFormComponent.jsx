
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWarehouses } from '../../hooks/useWarehouses'
import { listUsers } from '../../services/UserService'
import { searchProducts } from '../../services/ProductService'
import { createCycleCount } from '../../services/CycleCountService'
import { getErrorMessage } from '../../services/ApiClient'
import OperatorGroupsComponent from './OperatorGroupsComponent'

const CreateCycleCountFormComponent = ({ onCreated, onCancel }) => {
  const { warehouses } = useWarehouses()

  const [warehouse, setWarehouse] = useState('')
  const [products, setProducts] = useState([])
  const [productResults, setProductResults] = useState([])
  const [search, setSearch] = useState('')
  const [totalProducts, setTotalProducts] = useState(0)
  const [users, setUsers] = useState([])
  const [group1Operators, setGroup1Operators] = useState([])
  const [group2Operators, setGroup2Operators] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)

  // Obtener los usuarios disponibles
  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const allUsers = []
        let page = 1
        let total = 0

        do {
          const response = await listUsers({ page, limit: 50 })
          allUsers.push(...response.data)
          total = response.pagination.total
          page++

          if (response.data.length === 0) break
        } while (allUsers.length < total)

        if (active) setUsers(allUsers)
      } catch (error) {
        if (active) toast.error(getErrorMessage(error))
      } finally {
        if (active) setLoadingUsers(false)
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [])

  // Buscar productos del catálogo
  const handleSearch = async (event) => {
    event.preventDefault()
    setSearching(true)

    try {
      const response = await searchProducts({
        search: search.trim(),
        page: 1,
        limit: 50
      })

      setProductResults(response.data)
      setTotalProducts(response.pagination.total)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSearching(false)
    }
  }

  // Agregar o quitar productos
  const toggleProduct = (product) => {
    const selected = products.some((p) => p._id === product._id)

    if (selected) {
      setProducts(products.filter((p) => p._id !== product._id))
    } else {
      setProducts([...products, product])
    }
  }

  // Obtener operarios de la planta seleccionada
  const operators = users.filter((user) =>
    user.rol === 'Operario' &&
    user.warehouses?.some((w) => w._id === warehouse)
  )

  // Verificar que estén completos los datos obligatorios
  const canSave =
    warehouse &&
    products.length > 0 &&
    group1Operators.length > 0 &&
    group2Operators.length > 0 &&
    !loadingUsers &&
    !saving

  // Crear inventario cíclico
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!canSave) return

    setSaving(true)

    try {
      await createCycleCount({
        warehouse,
        products: products.map((p) => p._id),
        group1Operators,
        group2Operators
      })

      toast.success('Inventario cíclico creado correctamente.')
      onCreated()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      {/* Seleccionar planta */}
      <div className="form-field">
        <label htmlFor="cycle-warehouse">Planta</label>

        <select
          id="cycle-warehouse"
          value={warehouse}
          onChange={(event) => {
            setWarehouse(event.target.value)
            setGroup1Operators([])
            setGroup2Operators([])
          }}
          required
        >
          <option value="">Seleccionar planta</option>

          {warehouses.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buscar productos */}
      <div className="form-field">
        <label htmlFor="cycle-search">Productos</label>

        <div className="barcode-actions">
          <input
            id="cycle-search"
            type="search"
            placeholder="Código SAP o descripción"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button
            type="button"
            className="form-secondary"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Resultados de la búsqueda */}
      {totalProducts > productResults.length && (
        <p className="twofa-text">
          Se muestran {productResults.length} de {totalProducts} productos.
          Afiná la búsqueda para encontrar otros.
        </p>
      )}

      {productResults.map((product) => (
        <label
          key={product._id}
          className="warehouse-option"
        >
          <input
            type="checkbox"
            checked={products.some((p) => p._id === product._id)}
            onChange={() => toggleProduct(product)}
          />

          <span>
            {product.sapCode} - {product.description}
          </span>
        </label>
      ))}

      {/* Cantidad de productos seleccionados */}
      {products.length > 0 && (
        <p className="twofa-text">
          Productos seleccionados: {products.length}
        </p>
      )}

      {/* Asignación de operarios */}
      <div className="form-field">
        {loadingUsers ? (
          <p className="twofa-text">
            Cargando operarios...
          </p>
        ) : (
          <OperatorGroupsComponent
            key={warehouse}
            operators={operators}
            group1Operators={group1Operators}
            group2Operators={group2Operators}
            onChange={(group1, group2) => {
              setGroup1Operators(group1)
              setGroup2Operators(group2)
            }}
          />
        )}
      </div>

      {/* Botón para crear inventario */}
      <button
        type="submit"
        className="form-submit"
        disabled={!canSave}
      >
        {saving ? 'Creando...' : 'Crear inventario'}
      </button>

      {/* Botón cancelar */}
      <button
        type="button"
        className="form-secondary"
        onClick={onCancel}
        disabled={saving}
      >
        Cancelar
      </button>

    </form>
  )
}

export default CreateCycleCountFormComponent
