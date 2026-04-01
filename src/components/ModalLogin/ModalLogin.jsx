import { useState } from "react"
import "./ModalLogin.scss"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../config/axios"; // NUEVO: Importamos tu instancia oficial de axios

function ModalLogin({ onCerrar }) {
    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        // Validación básica front-end
        if (!usuario.trim() || !password.trim()) {
            setError("Por favor, ingresa tu usuario y contraseña.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // NUEVO: Petición real al backend usando la ruta exclusiva
            const res = await axiosInstance.post('/auth/login-distribuidor', {
                username: usuario.toLowerCase().trim(), // Forzamos minúsculas por seguridad
                password: password
            });

            // Asumiendo que el backend devuelve { token, distribuidor } o { token, user }
            const userData = res.data.distribuidor || res.data.user || res.data.data;

            // Guardamos la sesión en el navegador con la misma llave maestra del Header
            localStorage.setItem('token_educativa', res.data.token);
            localStorage.setItem('usuario_educativa', JSON.stringify(userData));

            onCerrar();
            navigate("/pedidos-distribuidores");

            // Refrescamos la página suavemente para que el Header reconozca la sesión al instante
            window.location.reload();

        } catch (err) {
            console.error(err);
            // Capturamos el error 400/401 que manda tu backend si la clave o el usuario están mal
            setError(err.response?.data?.message || err.response?.data?.msg || "Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin()
        }
    }

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-cerrar" onClick={onCerrar} disabled={loading}>✕</button>
                <h2 className="modal-titulo">Acceso Distribuidores</h2>
                <p className="modal-subtitulo">Ingresa con tus credenciales asignadas</p>

                <div className="modal-campo">
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ej. carlos123"
                        disabled={loading}
                    />
                </div>

                <div className="modal-campo">
                    <label>Contraseña</label>
                    <div className="input-password-wrapper">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ingresa tu contraseña"
                            disabled={loading}
                        />
                        <button
                            className="btn-toggle-password"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            type="button"
                            disabled={loading}
                        >
                            {mostrarPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                {error && <p className="modal-error" style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

                <button
                    className="modal-btn-ingresar"
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'VERIFICANDO...' : 'INGRESAR'}
                </button>
            </div>
        </div>
    );
}

export default ModalLogin;