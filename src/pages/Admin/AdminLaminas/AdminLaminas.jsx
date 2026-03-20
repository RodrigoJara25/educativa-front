import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../config/axios'
import Swal from 'sweetalert2'
import { useCategories } from '../../../context/CategoryContext'
import './AdminLaminas.scss'

function AdminLaminas() {
    const navigate = useNavigate()
    const [subcatActiva, setSubcatActiva] = useState('todas')
    // 1. Usamos nuestro contexto para los TABS
    const { categorias, subcategorias } = useCategories()
    const categoriaLamina = categorias.find(cat => cat.tipo === 'LAMINA')

    // Obtenemos qué subcategorías corresponden a Láminas para dibujar los botones
    const tabsSubcategorias = subcategorias.filter(sub => {
        const idCat = sub.categoria?._id || sub.categoria
        return idCat === categoriaLamina?._id
    })
    // 2. Traemos las láminas reales
    const [laminas, setLaminas] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchLaminas = async () => {
            try {
                // Traemos los productos reales
                const res = await axiosInstance.get('/products')
                // Filtramos para guardarnos SOLO los que sean tipo 'LAMINA'
                const soloLaminas = res.data.filter(p => p.categoria?.tipo === 'LAMINA')
                setLaminas(soloLaminas)
            } catch (error) {
                console.error("Error al obtener las láminas", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLaminas()
    }, [])
    // 3. Filtramos las láminas a mostrar en la tabla según el Tab activado
    const laminasMostradas = subcatActiva === 'todas'
        ? laminas
        : laminas.filter(lam => {
            const lamSub = lam.subcategoria?._id || lam.subcategoria
            return lamSub === subcatActiva
        })

    const handleEditar = (id) => {
        navigate(`/admin/laminas/editar/${id}`)
    }

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta lámina se eliminará permanentemente',
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
            setLaminas(prev => prev.filter(lam => lam.id !== id && lam._id !== id))
            Swal.fire('Eliminado', 'La lámina ha sido eliminada', 'success')
        } catch (error) {
            console.error('Error al eliminar la lámina:', error)
            Swal.fire('Error', 'Hubo un error al eliminar la lámina', 'error')
        }
    }

    return (
        <div className="admin-laminas">

            <div className="laminas-header">
                <h1 className="laminas-titulo">
                    Láminas
                    <span className="laminas-count">({laminasMostradas.length})</span>
                </h1>
                <button
                    className="btn-agregar"
                    onClick={() => navigate('/admin/laminas/nuevo')}
                >
                    + Agregar lámina
                </button>
            </div>

            {/* Tabs de subcategorías */}
            <div className="laminas-tabs">
                <button
                    className={`tab-btn ${subcatActiva === 'todas' ? 'active' : ''}`}
                    onClick={() => setSubcatActiva('todas')}
                >
                    Todas
                    <span className="tab-count">({laminas.length})</span>
                </button>
                {/* Un botón por cada subcategoría real */}
                {tabsSubcategorias.map(sub => {
                    const cantidad = laminas.filter(lam => {
                        const lamSub = lam.subcategoria?._id || lam.subcategoria
                        return lamSub === sub._id
                    }).length
                    return (
                        <button
                            key={sub._id} /* Usamos el ._id del backend */
                            className={`tab-btn ${subcatActiva === sub._id ? 'active' : ''}`}
                            onClick={() => setSubcatActiva(sub._id)}
                        >
                            {sub.nombre}
                            <span className="tab-count">({cantidad})</span>
                        </button>
                    )
                })}
            </div>

            {/* Tabla */}
            <div className="laminas-tabla-wrapper">
                <table className="laminas-tabla">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Subcategoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>Cargando láminas...</td></tr>
                        ) : laminasMostradas.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No hay láminas creadas aún.</td></tr>
                        ) : (
                            laminasMostradas.map((lamina, index) => (
                                <tr key={lamina.id}>
                                    <td className="td-num">{index + 1}</td>
                                    <td className="td-item">{lamina.item}</td>
                                    {/* Mostramos el nombre de la subcategoría */}
                                    <td>{lamina.subcategoria?.nombre || 'Sin subcategoría'}</td>
                                    <td className="td-acciones">
                                        <button
                                            className="btn-editar"
                                            onClick={() => handleEditar(lamina.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-eliminar"
                                            onClick={() => handleEliminar(lamina.id)}
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

export default AdminLaminas