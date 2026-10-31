import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo-tigre.svg';

const ResetPasswordPage = () => {
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' });

  const newPassword = watch('newPassword');

  const resetPassword = async (formData) => {
    setIsLoading(true);

    try {
      await axios.post('http://localhost:8080/v1/auth/reset-password', {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setPasswordUpdated(true);
      toast.success('La contraseña se actualizó correctamente.');
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'No se pudo restablecer la contraseña. Intentá nuevamente.';

      toast.error(errorMessage);
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

        {passwordUpdated ? (
          <>
            <h1 className="auth-title">Contraseña actualizada</h1>

            <p className="auth-subtitle">
              Tu contraseña se actualizó correctamente.
              Ya podés iniciar sesión con tu nueva contraseña.
            </p>

            <div className="auth-recovery">
              <Link to="/">Volver al inicio de sesión</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Restablecer contraseña</h1>

            <p className="auth-subtitle">
              Ingresá tu nueva contraseña para recuperar el acceso
              a tu cuenta.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit(resetPassword)}
            >
              <div className="form-field">
                <label htmlFor="newPassword">
                  Nueva contraseña
                </label>

                <input
                  type="password"
                  id="newPassword"
                  autoComplete="new-password"
                  {...register('newPassword', {
                    required: 'La nueva contraseña es obligatoria.',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres.'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/,
                      message:
                        'La contraseña debe tener una mayúscula, una minúscula y un número.'
                    }
                  })}
                />

                {errors.newPassword && (
                  <p>{errors.newPassword.message}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Debés confirmar la contraseña.',
                    validate: (value) =>
                      value === newPassword ||
                      'Las contraseñas no coinciden.'
                  })}
                />

                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
              </div>

              <input
                className="form-submit"
                type="submit"
                value={isLoading ? 'Guardando...' : 'Guardar contraseña'}
                disabled={isLoading}
              />
            </form>

            <div className="auth-recovery">
              <Link to="/">Volver al inicio de sesión</Link>
            </div>
          </>
        )}
      </div>

      <p className="auth-footer">© 2026 Tigre</p>
    </div>
  );
};

export default ResetPasswordPage;