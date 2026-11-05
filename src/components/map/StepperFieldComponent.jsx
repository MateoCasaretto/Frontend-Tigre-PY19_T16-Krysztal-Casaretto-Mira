import { useId, useState } from 'react'
import { GRID_STEP } from '../../utils/MapUtils'

// Campo numérico con botones grandes: en el celular es más preciso que arrastrar con el dedo.
// Mientras se escribe se muestra lo tipeado, aunque todavía no llegue al mínimo
const StepperFieldComponent = ({ label, value, min, step = GRID_STEP, onChange }) => {
  const id = useId()
  const [typing, setTyping] = useState(null)

  const change = (next) => {
    if (Number.isFinite(next) && next >= min) onChange(next)
  }

  const handleInput = (event) => {
    setTyping(event.target.value)
    change(event.target.valueAsNumber)
  }

  return (
    <div className="editor-stepper">
      <label className="editor-stepper-label" htmlFor={id}>{label}</label>
      <button type="button" aria-label={`Bajar ${label}`} onClick={() => change(Math.max(min, value - step))}>−</button>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={GRID_STEP}
        value={typing ?? value}
        onChange={handleInput}
        onBlur={() => setTyping(null)}
      />
      <button type="button" aria-label={`Subir ${label}`} onClick={() => change(value + step)}>+</button>
    </div>
  )
}

export default StepperFieldComponent
