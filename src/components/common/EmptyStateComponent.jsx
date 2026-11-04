// Aviso de lista vacía o error, con una acción opcional debajo
const EmptyStateComponent = ({ message, children }) => (
  <div className="empty-state">
    <p className="home-alert">{message}</p>
    {children}
  </div>
)

export default EmptyStateComponent
