import './Header.scss';
import NavBar from '../NavBar/NavBar';
import UserCard from '../UserCard/UserCard';
import AuthModal from '../AuthModal/AuthModal';
import UserDropdown from '../UserDropdown/UserDropdown'; // NUEVO IMPORT
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NUEVO IMPORT

function Header() {
    const [mostrarAuth, setMostrarAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    const navigate = useNavigate();

    // Cargar usuario del localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('usuario_educativa');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error leyendo usuario");
            }
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        // En caso de que el backend devuelva { token: '...', user: { nombre: '...' } } 
        const currentUser = userData.user || userData.usuario || userData.data || userData;

        setUser(currentUser);
        localStorage.setItem('usuario_educativa', JSON.stringify(currentUser));

        // Guardamos el token si el backend lo incluyó
        if (userData.token) {
            localStorage.setItem('token_educativa', userData.token);
        }

        setMostrarAuth(false);
    };

    const handleUserClick = () => {
        if (!user) {
            setMostrarAuth(true); // Abrir modal si no hay sesión
        } else {
            // Abrir o cerrar el menú flotante (Dropdown)
            setMostrarDropdown(!mostrarDropdown);
        }
    };

    // NUEVA FUNCIÓN PARA EL LOGOUT
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('usuario_educativa');
        localStorage.removeItem('token_educativa');
        setMostrarDropdown(false);
        navigate('/'); // Redirige al inicio al salir
    };

    return (
        <>
            <header className='header'>
                <div className='header-image'>
                    {/* Le damos position: relative para anclar el Dropdown */}
                    <div className='user-card-container' style={{ position: 'relative' }}>
                        <UserCard
                            nombre={user?.nombre || null}
                            onClickLogin={handleUserClick}
                        />

                        {/* NUEVO COMPONENTE: MENU FLOTANTE */}
                        {mostrarDropdown && user && (
                            <UserDropdown
                                onClose={() => setMostrarDropdown(false)}
                                onLogout={handleLogout}
                            />
                        )}
                    </div>
                </div>
                <NavBar />
            </header>

            {mostrarAuth && (
                <AuthModal
                    onCerrar={() => setMostrarAuth(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    )
}

export default Header;
