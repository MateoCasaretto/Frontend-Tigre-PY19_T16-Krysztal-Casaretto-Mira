import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsuario } from '../../features/usuario.slice';

const LoginForm = () => {
  const idEmail = useId();
  const idContrasena = useId();
  const [requiere2FA, setRequiere2FA] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { register, handleSubmit, formState: { isValid } } = useForm({ mode: 'onChange' });

  const apiLogin = ({ email, contrasena, token }) => {
    axios.post('http://localhost:8080/v1/auth/login', { email, contrasena, token })
      .then((response) => {
        if(response.data.requiere2FA) {
          setRequiere2FA(true);
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("nombreUsuario", response.data.nombreUsuario);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("rol", response.data.rol);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("twoFactorEnabled", response.data.twoFactorEnabled);

        dispatch(setUsuario({
          token: response.data.token,
          nombreUsuario: response.data.nombreUsuario,
          email: response.data.email,
          rol: response.data.rol,
          twoFactorEnabled: response.data.twoFactorEnabled,
          userId: response.data.userId
        }));

        console.log(response.data.twoFactorEnabled, response.data.userId);

        navigate('/home', { replace: true });
      }).catch((error) => {
        console.error('Error al iniciar sesión:', error);
      });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(apiLogin)}>

      <div className="form-field">
        <label htmlFor={idEmail}>Email</label>
        <input type="email" id={idEmail} {...register('email', { required: true })} />
      </div>

      <div className="form-field">
        <label htmlFor={idContrasena}>Contraseña</label>
        <input type="password" id={idContrasena} {...register('contrasena', { required: true })} />
      </div>

      {requiere2FA && (
        <div className="form-field">
          <label htmlFor="token">Token 2FA</label>
          <input type="text" id="token" {...register('token', { required: true })} />
        </div>
      )}

      <input className="form-submit" type="submit" value={requiere2FA ? 'Verificar' : 'Ingresar'} disabled={!isValid} />
    </form>
  )
}

export default LoginForm
