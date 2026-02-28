import { useState } from 'react'
import './AdminLaminas.scss'
import { laminasMock } from '../../../data/laminasMock'

function AdminLaminas() {
    const [subcatActiva, setSubcatActiva] = useState(laminasMock[0].subcategoria._id)

    const subcatSeleccionada = laminasMock.find(
        grupo => grupo.subcategoria._id === subcatActiva
    )

    const handleEditar = (id) => {
        console.log('Editar lámina:', id)
    }

    const handleEliminar = (id) => {
        console.log('Eliminar lámina:', id)
    }

    return (
        <div className="admin-laminas">

            <div className="laminas-header">
                <h1 className="laminas-titulo">Láminas</h1>
                <button className="btn-agregar">+ Agregar lámina</button>
            </div>

            {/* Tabs de subcategorías */}
            <div className="laminas-tabs">
                {laminasMock.map(grupo => (
                    <button
                        key={grupo.subcategoria._id}
                        className={`tab-btn ${subcatActiva === grupo.subcategoria._id ? 'active' : ''}`}
                        onClick={() => setSubcatActiva(grupo.subcategoria._id)}
                    >
                        {grupo.subcategoria.nombre}
                        <span className="tab-count">({grupo.laminas.length})</span>
                    </button>
                ))}
            </div>

            {/* Tabla de láminas de la subcategoría activa */}
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
                        {subcatSeleccionada?.laminas.map((lamina, index) => (
                            <tr key={lamina.id}>
                                <td className="td-num">{index + 1}</td>
                                <td className="td-item">{lamina.item}</td>
                                <td>{subcatSeleccionada.subcategoria.nombre}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AdminLaminas
