import StepperFieldComponent from './StepperFieldComponent'

const PLAN_STEP = 1

// Tamaño elegido para el plano. Es un mínimo: si los elementos piden más, el plano crece solo
const PlanSizePanelComponent = ({ plan, minPlan, onChange }) => (
  <div className="editor-steppers">
    <StepperFieldComponent
      label="Ancho del plano (m)"
      step={PLAN_STEP}
      min={minPlan.width}
      value={plan.width}
      onChange={(width) => onChange({ width })}
    />
    <StepperFieldComponent
      label="Largo del plano (m)"
      step={PLAN_STEP}
      min={minPlan.height}
      value={plan.height}
      onChange={(height) => onChange({ height })}
    />
  </div>
)

export default PlanSizePanelComponent
