import { useState } from 'react'
import { toast } from 'react-toastify'
import { searchProducts } from '../services/ProductService'

const LIMIT = 20

// Búsqueda por código SAP, descripción o código de barras
export const useProductSearch = () => {
  const [text, setText] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState(null)

  // Devuelve lo encontrado, para que la pantalla pueda reaccionar sin esperar otro render
  const search = async () => {
    const query = text.trim()
    if (!query) return null
    setSearching(true)

    try {
      const { data, pagination } = await searchProducts({ search: query, limit: LIMIT })
      const found = { text: query, products: data, total: pagination.total }
      setResults(found)
      return found
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'No se pudo buscar el producto.')
      return null
    } finally {
      setSearching(false)
    }
  }

  const replaceProduct = (updated) => {
    setResults((current) => current && {
      ...current,
      products: current.products.map((product) => (product._id === updated._id ? updated : product)),
    })
  }

  return { text, setText, searching, results, search, replaceProduct }
}
