import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLaminas.scss'
import { laminasMock } from '../../../data/laminasMock'

function AdminLaminas() {
    const navigate = useNavigate()
    const [subcatActiva, setSubcatActiva] = useState('todas')

    // Láminas a mostrar según el tab activo
    const laminasMostradas = subcatActiva === 'todas'
        ? laminasMock.flatMap(grupo => grupo.laminas)
        : laminasMock.find(g => g.subcategoria._id === subcatActiva)?.laminas ?? []

    const handleEditar = (id) => {
        console.log('Editar lámina:', id)
    }

    const handleEliminar = (id) => {
        console.log('Eliminar lámina:', id)
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

                {/* Botón "Todas" manual */}
                <button
                    className={`tab-btn ${subcatActiva === 'todas' ? 'active' : ''}`}
                    onClick={() => setSubcatActiva('todas')}
                >
                    Todas
                    <span className="tab-count">
                        ({laminasMock.reduce((acc, g) => acc + g.laminas.length, 0)})
                    </span>
                </button>

                {/* Un botón por cada subcategoría */}
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
                        {laminasMostradas.map((lamina, index) => {
                            // Encontrar el nombre de la subcategoría de esta lámina
                            const grupo = laminasMock.find(g =>
                                g.subcategoria._id === lamina.subcategoria._id
                            )
                            return (
                                <tr key={lamina.id}>
                                    <td className="td-num">{index + 1}</td>
                                    <td className="td-item">{lamina.item}</td>
                                    <td>{grupo?.subcategoria.nombre}</td>
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
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AdminLaminas