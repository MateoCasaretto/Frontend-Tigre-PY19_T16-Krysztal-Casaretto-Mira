// Guardar o descartar el borrador. Solo aparece si hay cambios
const EditorSaveBarComponent = ({ saving, onSave, onDiscard }) => (
  <div className="editor-savebar">
    <button type="button" className="form-secondary" disabled={saving} onClick={onDiscard}>Descartar</button>
    <button type="button" className="form-submit" disabled={saving} onClick={onSave}>
      {saving ? 'Guardando...' : 'Guardar'}
    </button>
  </div>
)

export default EditorSaveBarComponent
