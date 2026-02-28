import { useState } from 'react'
import './AdminProductos.scss'

// Mocks reales — misma estructura que devuelve el backend
import { cuentosClasicosMock } from '../../../data/cuentosClasicosMock'
import { obrasLiterariasMock } from '../../../data/obrasLiterariasMock'
import { cuentosInfantilesMock } from '../../../data/cuentosInfantilesMock'
import { diccionariosMock } from '../../../data/diccionariosMock'
import { cuentosSelectosMock } from '../../../data/cuentosSelectosMock'
import { cuentosEcologicosMock } from '../../../data/cuentosEcologicosMock'
import { cuentosEducativosMock } from '../../../data/cuentosEducativosMock'

// Todos los productos combinados en un solo array
const todosLosProductos = [
    ...cuentosClasicosMock,
    ...obrasLiterariasMock,
    ...cuentosInfantilesMock,
    ...diccionariosMock,
    ...cuentosSelectosMock,
    ...cuentosEcologicosMock,
    ...cuentosEducativosMock,
]

// Categorías únicas extraídas de los productos
const categoriasUnicas = [
    'Todas',
    ...new Set(todosLosProductos.map(p => p.categoria.nombre))
]

function AdminProductos() {
    const [filtro, setFiltro] = useState('Todas')

    const productosFiltrados = filtro === 'Todas'
        ? todosLosProductos
        : todosLosProductos.filter(p => p.categoria.nombre === filtro)

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
                <button className="btn-agregar">+ Agregar producto</button>
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
                        {productosFiltrados.map(producto => (
                            <tr key={producto.id}>
                                <td className="td-item">{producto.item}</td>
                                <td>{producto.titulo}</td>
                                <td>{producto.categoria.nombre}</td>
                                <td>
                                    <span className={`badge-tipo ${producto.categoria.tipo.toLowerCase()}`}>
                                        {producto.categoria.tipo}
                                    </span>
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
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AdminProductos