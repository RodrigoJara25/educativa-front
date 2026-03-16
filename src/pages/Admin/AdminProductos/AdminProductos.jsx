import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../config/axios'
import './AdminProductos.scss'

function AdminProductos() {
    const navigate = useNavigate()
    const [filtro, setFiltro] = useState('Todas')

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // traemos la data en esta función
        const fetchProductos = async () => {
            try {
                const res = await axiosInstance.get('/products')
                setProductos(res.data)
            } catch (error) {
                console.error("Error al obtener los productos", error);
            } finally {
                setLoading(false)
            }
        }
        fetchProductos()
    }, [])

    const categoriasUnicas = [
        'Todas',
        ...new Set(productos.map(p => p.categoria?.nombre).filter(Boolean))
    ]

    const productosFiltrados = filtro === 'Todas'
        ? productos
        : productos.filter(p => p.categoria?.nombre === filtro)

    const handleEditar = (id) => {
        console.log('Editar producto:', id)
    }

    const handleEliminar = (id) => {
        console.log('Eliminar producto:', id)
    }

    return (
        <div className="admin-productos">

            <div className="productos-header">
                <h1 className="productos-titulo">
                    Productos
                    <span className="productos-count">({productosFiltrados.length})</span>
                </h1>
                <button
                    className="btn-agregar"
                    onClick={() => navigate('/admin/productos/nuevo')}
                >
                    + Agregar producto
                </button>
            </div>

            <div className="productos-filtros">
                {categoriasUnicas.map(cat => (
                    <button
                        key={cat}
                        className={`filtro-btn ${filtro === cat ? 'active' : ''}`}
                        onClick={() => setFiltro(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="productos-tabla-wrapper">
                <table className="productos-tabla">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Título</th>
                            <th>Categoría</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Cargando productos...</td></tr>
                        ) : productosFiltrados.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No hay productos creados aún.</td></tr>
                        ) : (
                            productosFiltrados.map(producto => (
                                <tr key={producto.id}> {/* Usas .id gracias a tu DTO */}
                                    <td className="td-item">{producto.item}</td>
                                    <td>{producto.titulo || producto.item}</td>
                                    <td>{producto.categoria?.nombre || 'Sin categoría'}</td>
                                    <td>
                                        {/* Revisamos si existe la categoría antes de poner el css del badge */}
                                        {producto.categoria?.tipo && (
                                            <span className={`badge-tipo ${producto.categoria.tipo.toLowerCase()}`}>
                                                {producto.categoria.tipo}
                                            </span>
                                        )}
                                    </td>
                                    <td className="td-acciones">
                                        <button
                                            className="btn-editar"
                                            onClick={() => handleEditar(producto.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-eliminar"
                                            onClick={() => handleEliminar(producto.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminProductos