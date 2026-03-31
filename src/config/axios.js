import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Interceptor para agregar el token JWT siempre que exista
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token_educativa');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// (Opcional) Interceptor de respuesta para manejar tokens expirados (401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('No autorizado o token expirado. Cerrando sesión...');
            // localStorage.removeItem('usuario_educativa');
            // localStorage.removeItem('token_educativa');
            // Opcional: window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;