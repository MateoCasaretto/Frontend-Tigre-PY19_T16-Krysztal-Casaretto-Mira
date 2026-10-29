import { useId } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const idEmail = useId();
  const idUserName = useId();
  const idContrasena = useId();
  const idRepetirContrasena = useId();
  const idRol = useId();

  const { register, handleSubmit, reset, getValues, formState: { isValid } } = useForm({ mode: 'onChange' });

  const apiRegister = ({ email, nombreUsuario, contrasena, repetirContrasena, rol }) => {
    const token = localStorage.getItem("token");
    console.log(token);
    
    axios.post("http://localhost:8080/v1/auth/registro", { email, nombreUsuario, contrasena, repetirContrasena, rol }, {
      headers: {
        Authorization: `Bearer ${token}`,//no es necesario mandar id porque viaja en el token
      },
    })
    .then((response) => {
      console.log(response.data.usuario)
      toast.success("Usuario registrado exitosamente.");
      reset();
    })
    .catch((error) => {
      console.error('Error al registrar usuario:', error);
      toast.error("No se pudo registrar el usuario.");
    });
  }

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit(apiRegister)}>

        <div className="form-field">
          <label htmlFor={idEmail}>Email</label>
          <input type="email" id={idEmail} {...register('email', { required: true })} />
        </div>

        <div className="form-field">
          <label htmlFor={idUserName}>Nombre de usuario</label>
          <input type="text" id={idUserName} {...register('nombreUsuario', { required: true })} />
        </div>

        <div className="form-field">
          <label htmlFor={idContrasena}>Contraseña</label>
          <input type="password" id={idContrasena} {...register('contrasena', { required: true })} />
        </div>

        <div className="form-field">
          <label htmlFor={idRepetirContrasena}>Repetir contraseña</label>
          <input
            type="password"
            id={idRepetirContrasena}
            {...register('repetirContrasena', {
              required: true,
              validate: (valor) => valor === getValues('contrasena'),
            })}
          />
        </div>

        <div className="form-field">
          <label htmlFor={idRol}>Rol</label>
          <select id={idRol} defaultValue="" {...register('rol', { required: true })}>
            <option value="" disabled>Seleccioná un rol</option>
            <option value="Operario">Operario</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <input className="form-submit" type="submit" value="Registrar usuario" disabled={!isValid} />
      </form>
    </div>
  )
}

export default RegisterForm
