import { useState } from "react";
import "./AuthModal.scss";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

function AuthModal({ onCerrar, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        dni: "",
        celular: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSwitchTab = (tabIsLogin) => {
        setIsLogin(tabIsLogin);
        setError("");
        setSuccess("");
        // Opcionalmente reiniciar formulario aquí
    };

    const handleRegister = async () => {
        // Validaciones en frontend
        if (!formData.nombre || !formData.apellidos || !formData.dni || !formData.celular || !formData.email || !formData.password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // Usa el endpoint desde la variable de entorno
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    dni: formData.dni,
                    celular: formData.celular,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Usuario registrado con éxito:", data);
                // Auto-login con los datos devueltos por la API de registro
                if (onLoginSuccess) {
                    onLoginSuccess(data);
                }
                onCerrar();
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Ocurrió un error al registrar. Verifica los datos.");
            }
        } catch (err) {
            setError("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError("El correo y contraseña son obligatorios.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            // Usa el endpoint desde la variable de entorno
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (onLoginSuccess) {
                    onLoginSuccess(data);
                }
                onCerrar();
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Usuario o contraseña incorrectos.");
            }
        } catch (err) {
            setError("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onCerrar}>
            <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-cerrar" onClick={onCerrar}>✕</button>

                <div className="auth-modal-logo">
                    <img src={logo} alt="Logo" />
                </div>

                <div className="auth-modal-tabs">
                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => handleSwitchTab(true)}
                        type="button"
                    >
                        Ingresar
                    </button>
                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => handleSwitchTab(false)}
                        type="button"
                    >
                        Registrarse
                    </button>
                </div>

                <form className="auth-modal-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-row">
                                <div className="auth-modal-campo">
                                    <label>Nombre <span>*</span></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="auth-modal-campo">
                                    <label>Apellidos <span>*</span></label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        placeholder="Tus apellidos"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="auth-modal-campo">
                                    <label>DNI <span>*</span></label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        placeholder="Ej. 12345678"
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="auth-modal-campo">
                                    <label>Celular <span>*</span></label>
                                    <input
                                        type="text"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        placeholder="Ej. 987654321"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="auth-modal-campo">
                        <label>Email {!isLogin && <span>*</span>}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="auth-modal-campo">
                        <label>Contraseña {!isLogin && <span>*</span>}</label>
                        <div className="auth-input-password-wrapper">
                            <input
                                type={mostrarPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Tu contraseña"
                                required
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

                    {error && <p className="auth-modal-error">{error}</p>}
                    {success && <p className="auth-modal-success">{success}</p>}

                    <button
                        className="auth-modal-btn-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : (isLogin ? "INGRESAR" : "CREAR CUENTA")}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
