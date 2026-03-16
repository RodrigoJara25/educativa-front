import { createContext, useState, useContext, useEffect } from "react"
import axiosInstance from "../config/axios"

// Creamos el espacio en memoria
const CategoryContext = createContext();

// Creamos el componente "Proveedor" (Provider)
export function CategoryProvider({ children }) {
    const [categorias, setCategorias] = useState([])
    const [subcategorias, setSubcategorias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const resCategorias = await axiosInstance.get('/categories')
                const resSubcategorias = await axiosInstance.get('/subcategories')
                setCategorias(resCategorias.data)
                setSubcategorias(resSubcategorias.data)
            } catch (error) {
                console.error("Error al cargar categorias", error)
            } finally {
                setLoading(false)
            }
        }
        obtenerCategorias()
    }, [])

    return (
        <CategoryContext.Provider value={{ categorias, subcategorias, loading }}>
            {children}
        </CategoryContext.Provider>
    )
}

// un hook personalizado para usar el contexto de forma facil
export function useCategories() {
    const context = useContext(CategoryContext)
    if (!context) {
        throw new Error('useCategories debe usarse dentro de un CategoryProvider')
    }
    return context
}