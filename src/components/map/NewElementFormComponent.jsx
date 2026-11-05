import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ELEMENT_TYPES } from '../../utils/MapUtils'

const RACK_WIDTH = 2
const MIN_RACK_LENGTH = 3
const ZONE_SIZE = { sizeX: 4, sizeY: 3 }

const positiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) >= 1

const DEFAULTS = { type: ELEMENT_TYPES.RACK, name: '', levelCount: 5, columnCount: 12, columnsPerBay: 2 }

// CU15 pasos 3 y 4: la estantería nace con una disposición uniforme que después se ajusta
const NewElementFormComponent = ({ onCreate }) => {
  const idType = useId()
  const idName = useId()
  const idLevels = useId()
  const idColumns = useId()
  const idColumnsPerBay = useId()
  const { register, handleSubmit, reset, control, formState: { isValid, isSubmitting } } = useForm({ mode: 'onChange', defaultValues: DEFAULTS })
  const isRackType = useWatch({ control, name: 'type' }) === ELEMENT_TYPES.RACK

  const submit = async ({ type, name, levelCount, columnCount, columnsPerBay }) => {
    const element = isRackType
      ? {
          type, name,
          sizeX: RACK_WIDTH,
          sizeY: Math.max(MIN_RACK_LENGTH, Number(columnCount)),
          levelCount: Number(levelCount),
          columnCount: Number(columnCount),
          columnsPerBay: Number(columnsPerBay),
        }
      : { type, name, ...ZONE_SIZE }
    if (await onCreate(element)) reset(DEFAULTS)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)}>
      <div className="form-field">
        <label htmlFor={idType}>Tipo</label>
        <select id={idType} {...register('type')}>
          <option value={ELEMENT_TYPES.RACK}>Estantería</option>
          <option value={ELEMENT_TYPES.FLOOR_ZONE}>Zona de piso</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor={idName}>Nombre</label>
        <input id={idName} type="text" maxLength={60} autoComplete="off" {...register('name', { required: true, validate: (value) => value.trim().length > 0 })} />
      </div>

      {isRackType && (
        <>
          <div className="form-field">
            <label htmlFor={idLevels}>Niveles</label>
            <input id={idLevels} type="number" inputMode="numeric" min={1} max={20} {...register('levelCount', { validate: positiveInteger })} />
          </div>
          <div className="form-field">
            <label htmlFor={idColumns}>Columnas</label>
            <input id={idColumns} type="number" inputMode="numeric" min={1} max={100} {...register('columnCount', { validate: positiveInteger })} />
          </div>
          <div className="form-field">
            <label htmlFor={idColumnsPerBay}>Columnas por tramo</label>
            <input id={idColumnsPerBay} type="number" inputMode="numeric" min={1} max={20} {...register('columnsPerBay', { validate: positiveInteger })} />
          </div>
        </>
      )}

      <input className="form-submit" type="submit" value="Agregar al plano" disabled={!isValid || isSubmitting} />
    </form>
  )
}

export default NewElementFormComponent
