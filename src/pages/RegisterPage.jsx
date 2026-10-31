import RegisterForm from '../components/auth/RegisterForm'
import AppLayout from '../components/layout/AppLayout'

const RegisterPage = () => {
  return (
    <AppLayout title="Registrar usuario" back>
      <section className="twofa-card">
        <p className="twofa-text">
          Completá los datos para dar de alta un nuevo usuario.
        </p>
        <RegisterForm />
      </section>
    </AppLayout>
  )
}

export default RegisterPage
