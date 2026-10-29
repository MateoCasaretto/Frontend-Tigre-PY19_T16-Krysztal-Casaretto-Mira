import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTwoFactorEnabled } from "../features/usuario.slice";

const IconoVolver = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

const DobleFactorPage = () => {
  const [paso, setPaso] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [codigo, setCodigo] = useState("");
  const token = useSelector((state) => state.usuario.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiGenerarQr = () => {
    axios
      .post(
        "http://localhost:8080/v1/auth/2fa/setup",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,//no es necesario mandar id porque viaja en el token
          },
        },
      )
      .then((response) => {
        setQrCode(response.data.qrCode);
        setPaso("Generado");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const apiVerificarCodigo = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8080/v1/auth/2fa/enable",
        { token: codigo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        dispatch(setTwoFactorEnabled(true));
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        console.error("Error al verificar el código:", error);
      });
  };

  return (
    <div className="home">
      <header className="home-header">
        <button type="button" className="page-back" onClick={() => navigate("/home")} aria-label="Volver al inicio">
          <IconoVolver />
        </button>
        <h1 className="home-header-title">Doble factor</h1>
        <span className="page-back-spacer" aria-hidden="true" />
      </header>

      <main className="home-content">
        <section className="twofa-card">
          {paso !== "Generado" ? (
            <>
              <p className="twofa-text">
                Protegé tu cuenta con una app de autenticación, como Google Authenticator o Authy.
              </p>
              <button type="button" className="form-submit twofa-button" onClick={apiGenerarQr}>
                Generar QR
              </button>
            </>
          ) : (
            <>
              <p className="twofa-text">
                Escaneá el código con tu app e ingresá los 6 dígitos que te muestra.
              </p>

              <div className="twofa-qr">
                <img src={qrCode} alt="Código QR para la app de autenticación" />
              </div>

              <form className="auth-form" onSubmit={apiVerificarCodigo}>
                <div className="form-field">
                  <label htmlFor="codigo-2fa">Código de autenticación</label>
                  <input
                    id="codigo-2fa"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                <button type="submit" className="form-submit">Verificar</button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default DobleFactorPage;
