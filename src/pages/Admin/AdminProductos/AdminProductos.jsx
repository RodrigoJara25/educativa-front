import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../config/axios'
import Swal from 'sweetalert2'
import './AdminProductos.scss'

function AdminProductos() {
    const navigate = useNavigate()
    const [filtro, setFiltro] = useState('Todas')

    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await axiosInstance.get('/products')
                // Filtramos para ignorar láminas ya que tienen su propia sección
                const soloCuentos = res.data.filter(p =>
                    p.categoria?.nombre !== 'Láminas Educativas'
                )
                setProductos(soloCuentos)
            } catch (error) {
                console.error("Error al obtener los cuentos", error);
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
        navigate(`/admin/productos/editar/${id}`)
    }

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este cuento se eliminará permanentemente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#999',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (!result.isConfirmed) return
        try {
            await axiosInstance.delete(`/products/${id}`)
            setProductos(prev => prev.filter(p => p.id !== id))
            Swal.fire('Eliminado', 'El cuento ha sido eliminado', 'success')
        } catch (error) {
            console.error('Error al eliminar el cuento:', error)
            Swal.fire('Error', 'Hubo un error al eliminar el cuento', 'error')
        }
    }

    return (
        <div className="admin-productos">

            <div className="productos-header">
                <h1 className="productos-titulo">
                    Cuentos
                    <span className="productos-count">({productosFiltrados.length})</span>
                </h1>
                <button
                    className="btn-agregar"
                    onClick={() => navigate('/admin/productos/nuevo')}
                >
                    + Agregar cuento
                </button>
            </div>

            <div className="productos-filtros">
                {categoriasUnicas.map(cat => {
                    const cantidad = cat === 'Todas' ? productos.length : productos.filter(p => p.categoria?.nombre === cat).length;
                    return (
                        <button
                            key={cat}
                            className={`filtro-btn ${filtro === cat ? 'active' : ''}`}
                            onClick={() => setFiltro(cat)}
                        >
                            {cat} <span className="tab-count">({cantidad})</span>
                        </button>
                    );
                })}
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
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Cargando cuentos...</td></tr>
                        ) : productosFiltrados.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No hay cuentos creados aún.</td></tr>
                        ) : (
                            productosFiltrados.map(producto => (
                                <tr key={producto.id}>
                                    <td className="td-item">{producto.item}</td>
                                    <td>{producto.titulo || producto.item}</td>
                                    <td>{producto.categoria?.nombre || 'Sin categoría'}</td>
                                    <td>
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