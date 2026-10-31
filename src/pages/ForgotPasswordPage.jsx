import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo-tigre.svg';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const requestPasswordReset = async ({ email }) => {
    setIsLoading(true);

    try {
      await axios.post('http://localhost:8080/v1/auth/forgot-password', {
        email
      });

      setEmailSent(true);
      toast.success('Solicitud de recuperación enviada correctamente.');
    } catch (error) {
      console.error('Error al solicitar la recuperación:', error);
      toast.error('No se pudo procesar la solicitud. Intentá nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Tigre" />
        </div>

        <h1 className="auth-title">Recuperar contraseña</h1>

        {emailSent ? (
          <p className="auth-subtitle">
            Si el correo está registrado, recibirás un enlace para
            restablecer tu contraseña.
          </p>
        ) : (
          <>
            <p className="auth-subtitle">
              Ingresá tu correo electrónico y te enviaremos un enlace
              para restablecer tu contraseña.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit(requestPasswordReset)}
            >
              <div className="form-field">
                <label htmlFor="email">Correo electrónico</label>

                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'El correo electrónico es obligatorio.'
                  })}
                />

                {errors.email && (
                  <p>{errors.email.message}</p>
                )}
              </div>

              <input
                className="form-submit"
                type="submit"
                value={isLoading ? 'Enviando...' : 'Enviar enlace'}
                disabled={isLoading}
              />
            </form>
          </>
        )}

        <div className="auth-recovery">
          <Link to="/">Volver al inicio de sesión</Link>
        </div>
      </div>

      <p className="auth-footer">© 2026 Tigre</p>
    </div>
  );
};

export default ForgotPasswordPage;