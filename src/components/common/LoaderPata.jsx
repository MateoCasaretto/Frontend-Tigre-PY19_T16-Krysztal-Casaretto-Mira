import { useEffect, useState } from 'react'
import pata1 from '../../assets/loader/loader-pata-1.svg'
import pata2 from '../../assets/loader/loader-pata-2.svg'
import pata3 from '../../assets/loader/loader-pata-3.svg'
import pata4 from '../../assets/loader/loader-pata-4.svg'

const CUADROS = [pata1, pata2, pata3, pata4]

// Loader de la marca: la pata del tigre se dibuja de a poco
const LoaderPata = ({ texto = 'Cargando...' }) => {
  // Con movimiento reducido queda la pata completa, sin animar
  const [sinMovimiento] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [cuadro, setCuadro] = useState(sinMovimiento ? CUADROS.length - 1 : 0)

  useEffect(() => {
    if (sinMovimiento) return
    const intervalo = setInterval(() => setCuadro((actual) => (actual + 1) % CUADROS.length), 300)
    return () => clearInterval(intervalo)
  }, [sinMovimiento])

  return (
    <div className="loader-pata" role="status" aria-live="polite">
      <img src={CUADROS[cuadro]} alt="" />
      <span>{texto}</span>
    </div>
  )
}

export default LoaderPata
