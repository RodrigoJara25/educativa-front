import './Header.scss'
import NavBar from '../NavBar/NavBar';
import UserCard from '../UserCard/UserCard';
import AuthModal from '../AuthModal/AuthModal';
import { useState, useEffect } from 'react';

function Header() {
    const [mostrarAuth, setMostrarAuth] = useState(false);
    const [user, setUser] = useState(null);

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
        // o si devuelve el usuario directamente, extraemos correctamente el objeto
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
            // Confirmación básica para logout si ya está logueado
            if (window.confirm(`Hola ${user.nombre}, ¿Deseas cerrar sesión?`)) {
                setUser(null);
                localStorage.removeItem('usuario_educativa');
            }
        }
    };

    return (
        <>
            <header className='header'>
                <div className='header-image'>
                    <div className='user-card-container'>
                        <UserCard
                            nombre={user?.nombre || null}
                            onClickLogin={handleUserClick}
                        />
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