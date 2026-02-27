import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    // Estado para los datos del distribuidor
    const [distribuidor, setDistribuidor] = useState({
        nombre: '',
        ruc: '',
        direccion: '',
        email: '',
        telefono: '',
        departamento: '',
        provincia: '',
        distrito: '',
        agencia: '',
        referencia: ''
    });

    // Estado para todas las cantidades de productos
    // Usamos un objeto donde la llave es el ID del producto
    const [cantidades, setCantidades] = useState({});

    // Función para actualizar una cantidad específica
    const updateCantidad = (id, valor) => {
        setCantidades(prev => ({
            ...prev,
            [id]: Number(valor) || 0
        }));
    };

    // Función para limpiar solo las cantidades (mantiene los datos del distribuidor)
    const resetCantidades = () => {
        setCantidades({});
    };

    // Función para limpiar TODO (cantidades + datos del distribuidor)
    const resetOrder = () => {
        setCantidades({});
        setDistribuidor({});
    };

    return (
        <OrderContext.Provider value={{
            distribuidor,
            setDistribuidor,
            cantidades,
            updateCantidad,
            resetCantidades,
            resetOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder debe usarse dentro de un OrderProvider');
    }
    return context;
}
