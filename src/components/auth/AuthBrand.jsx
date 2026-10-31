import logo from '../../assets/logo-tigre-blanco.svg'

// Panel de marca con el gradiente de Tigre: banda arriba en el celular, columna izquierda en la PC
const AuthBrand = () => {
  return (
    <aside className="auth-brand">
      <img className="auth-brand-logo" src={logo} alt="Tigre" />
      <p className="auth-brand-text">Gestión de depósito</p>
    </aside>
  )
}

export default AuthBrand
