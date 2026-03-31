import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedRoles }) {
    const userString = localStorage.getItem('usuario_educativa');
    const token = localStorage.getItem('token_educativa');

    // Si no hay usuario ni token, rechazar acceso
    if (!userString || !token) {
        return <Navigate to="/" replace />;
    }

    let user;
    try {
        user = JSON.parse(userString);
    } catch (error) {
        return <Navigate to="/" replace />;
    }

    // Verificar el Rol del usuario con respecto a allowedRoles
    if (allowedRoles && allowedRoles.length > 0) {
        // En tu JSON dice 'role: "USER"' o 'ADMIN'
        if (!allowedRoles.includes(user.role)) {
            // No tiene permisos. Podrías redirigirlo a un 404 o al Inicio público
            return <Navigate to="/" replace />;
        }
    }

    // Si pasó todas las validaciones, renderiza los componentes hijos
    return <Outlet />;
}

export default ProtectedRoute;
