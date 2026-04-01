import { useNavigate } from 'react-router-dom';
import './UserDropdown.scss';

function UserDropdown({ onLogout, onClose }) {
    const navigate = useNavigate();

    const handlePanelClick = () => {
        onClose(); // Cerrar el modal al hacer click
        navigate('/admin');
    };

    return (
        <>
            {/* ESTA PANTALLA INVISIBLE CUBRE TODO Y DETECTA CLICK AFUERA */}
            <div className="dropdown-overlay" onClick={onClose}></div>

            <div className="user-dropdown-menu">
                <button className="panel-btn" onClick={handlePanelClick}>
                    Ir al Panel
                </button>
                <button className="logout-btn" onClick={onLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </>
    );
}

export default UserDropdown;
