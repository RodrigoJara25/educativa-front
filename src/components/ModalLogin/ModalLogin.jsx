import { useState } from "react"
import "./ModalLogin.scss"
import { useNavigate } from "react-router-dom"

function ModalLogin({ onCerrar }) {
    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = () => {
        // Por ahora credenciales hardcodeadas
        // Cuendo llegue el backend: reemplazar con fetch a /api/auth/login
        if (usuario === "distribuidor" && password === "1234") {
            onCerrar()
            navigate("/pedidos-distribuidores")
        } else {
            setError("Usuario o contraseña incorrectos.")
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
                <button className="modal-cerrar" onClick={onCerrar}>✕</button>
                <h2 className="modal-titulo">Acceso Distribuidores</h2>
                <p className="modal-subtitulo">Ingresa con tus credenciales asignadas</p>
                <div className="modal-campo">
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ingresa tu usuario"
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
                        />
                        <button
                            className="btn-toggle-password"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            type="button"
                        >
                            {mostrarPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>
                {error && <p className="modal-error">{error}</p>}
                <button className="modal-btn-ingresar" onClick={handleLogin}>
                    INGRESAR
                </button>
            </div>
        </div>
    );
}

export default ModalLogin