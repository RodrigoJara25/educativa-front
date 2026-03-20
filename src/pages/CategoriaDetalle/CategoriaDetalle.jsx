// src/pages/CategoriaDetalle/CategoriaDetalle.jsx
import { useParams } from 'react-router-dom'
import { useCategories } from '../../context/CategoryContext'
import { useProducts } from '../../context/ProductContext'
import Layout from '../../components/Layout/Layout'
import PageSection from '../../components/PageSection/PageSection'
import CategoriesSection from '../../components/CategoriesSection/CategoriesSection'
import LaminasDetalle from '../../components/LaminasDetalle/LaminasDetalle';
import './CategoriaDetalle.scss'

/**
 * Parsea la descripción con formato personalizado:
 * - *texto* → negrita + salto de línea
 * - línea que termina en / → doble salto de línea
 */
function parseDescripcion(texto) {
    if (!texto) return null

    const lineas = texto.split('\n')
    const elementos = []

    lineas.forEach((linea, i) => {
        // Verificar si la línea termina en /
        const doubleBr = linea.trimEnd().endsWith('/')
        // Quitar el / del final si existe
        const lineaLimpia = doubleBr ? linea.trimEnd().slice(0, -1) : linea

        // Separar por *texto* para encontrar negritas
        const partes = lineaLimpia.split(/\*([^*]+)\*/)
        let tieneBold = false

        partes.forEach((parte, j) => {
            if (j % 2 === 1) {
                // Las partes impares son el contenido entre * *
                tieneBold = true
                elementos.push(<strong key={`${i}-${j}`}>{parte}</strong>)
                elementos.push(<br key={`${i}-${j}-br`} />)
            } else if (parte) {
                elementos.push(<span key={`${i}-${j}`}>{parte}</span>)
            }
        })

        // Salto de línea normal entre líneas (solo si no hubo negrita, porque el bold ya agrega su <br>)
        if (i < lineas.length - 1 && !tieneBold) {
            elementos.push(<br key={`br-${i}`} />)
        }

        // Si termina en /, doble salto de línea (uno extra)
        if (doubleBr) {
            elementos.push(<br key={`dbr-${i}`} />)
        }
    })

    return elementos
}

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
        <>
            <Layout>
                <PageSection headerImg={categoriaActiva.foto} headerAlt={categoriaActiva.nombre} variant={categoriaActiva.nombre === 'Cuentos Clásicos' ? 'new' : 'old'}>
                    <div className="categoria-detalle-container">
                        {/* Descripción */}
                        <div className="categoria-info">
                            <p>{parseDescripcion(categoriaActiva.descripcion) || 'Explora todos los asombrosos productos que tenemos en esta categoría para ti.'}</p>
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

                        {/* Lista de productos / laminas condicional */}
                        {categoriaActiva.nombre === "Láminas Educativas" ? (
                            <LaminasDetalle productos={productosDeCategoria} />
                        ) : (
                            // Lista de productos
                            <div className="productos-grid">
                                {productosDeCategoria.length === 0 ? (
                                    <p className="no-productos">No existen productos registrados por el momento.</p>
                                ) : (
                                    productosDeCategoria.map(prod => (
                                        <div key={prod.id} className="producto-card">
                                            {prod.fotoPortada ? <img src={prod.fotoPortada} alt={prod.item} /> : <div className="foto-placeholder">Sin Foto</div>}
                                            <div className="producto-titulo-row">
                                                <div className="producto-nombre">
                                                    {prod.titulo.split('/').map((parte, i) => {
                                                        const trimmed = parte.trim()
                                                        const tieneAsteriscos = /\*([^*]+)\*/.test(trimmed)
                                                        const segmentos = trimmed.split(/\*([^*]+)\*/)
                                                        return (
                                                            <div key={i} className={tieneAsteriscos ? 'titulo-lista' : 'titulo-principal'}>
                                                                {segmentos.map((seg, j) =>
                                                                    j % 2 === 1
                                                                        ? <span key={j} style={{ fontWeight: 'normal' }}>{seg}</span>
                                                                        : <span key={j}>{seg}</span>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <button className="btn-ver-mas">Ver más</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </PageSection>
            </Layout>
            <CategoriesSection />
        </>
    )
}

export default CategoriaDetalle
