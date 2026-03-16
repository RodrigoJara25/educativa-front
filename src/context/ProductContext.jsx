import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/products');
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar los productos en el Contexto global:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargamos todos los productos 1 sola vez al montar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <ProductContext.Provider value={{ productos, loading, fetchProductos }}>
            {children}
        </ProductContext.Provider>
    );
}

// Hook personalizado para usarlo rápido donde queramos
export const useProducts = () => {
    return useContext(ProductContext);
};
