// src/pages/CategoriaDetalle/CategoriaDetalle.jsx
import { useParams } from 'react-router-dom'
import { useCategories } from '../../context/CategoryContext'
import { useProducts } from '../../context/ProductContext'
import Layout from '../../components/Layout/Layout'
import PageSection from '../../components/PageSection/PageSection'
import './CategoriaDetalle.scss'

function CategoriaDetalle() {
    // 1. Agarramos el ID de la categoría que enviamos por la URL
    const { id } = useParams()

    // 2. Traemos nuestra DB global
    const { categorias, loading: catLoading } = useCategories()
    const { productos, loading: prodLoading } = useProducts()

    if (catLoading || prodLoading) return <Layout><h3>Cargando información...</h3></Layout>

    // 3. Buscamos la categoría y filtramos los productos que le pertenecen
    const categoriaActiva = categorias.find(c => c._id === id)
    const productosDeCategoria = productos.filter(p => p.categoria?._id === id)

    // Por seguridad, si alguien escribe mal la URL
    if (!categoriaActiva) return <Layout><h3>Categoría no encontrada</h3></Layout>

    return (
        <Layout>
            <PageSection headerImg={categoriaActiva.foto} headerAlt={categoriaActiva.nombre}>
                <div className="categoria-detalle-container">
                    {/* Descripción */}
                    <div className="categoria-info">
                        <p>{categoriaActiva.descripcion || 'Explora todos los asombrosos productos que tenemos en esta categoría para ti.'}</p>
                    </div>

                    {/* Características */}
                    {categoriaActiva.caracteristicas?.length > 0 && (
                        <div className="categoria-caracteristicas">
                            <p className="caracteristicas-titulo">Características:</p>
                            <ul>
                                {categoriaActiva.caracteristicas.map((caracteristica, index) => (
                                    <li key={index}>{caracteristica}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Lista de productos */}
                    <div className="productos-grid">
                        {productosDeCategoria.length === 0 ? (
                            <p className="no-productos">No existen productos registrados por el momento.</p>
                        ) : (
                            productosDeCategoria.map(prod => (
                                <div key={prod.id} className="producto-card">
                                    {prod.fotoPortada ? <img src={prod.fotoPortada} alt={prod.item} /> : <div className="foto-placeholder">Sin Foto</div>}
                                    <div className="producto-titulo-row">
                                        <span className="producto-nombre">{prod.titulo}</span>
                                        <button className="btn-ver-mas">Ver más</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PageSection>
        </Layout>
    )
}

export default CategoriaDetalle
