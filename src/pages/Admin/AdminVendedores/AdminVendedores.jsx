import { useState, useEffect } from 'react'
import axiosInstance from '../../../config/axios'
import Swal from 'sweetalert2'
import '../AdminUsersStyles.scss'

function AdminVendedores() {
    const [vendedores, setVendedores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchVendedores = async () => {
        try {
            const res = await axiosInstance.get('/users')
            // Filtramos solo los que son VENDEDOR
            const usuariosFiltrados = res.data.filter(u => u.role === 'VENDEDOR')
            setVendedores(usuariosFiltrados)
        } catch (error) {
            console.error("Error al obtener los vendedores", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVendedores()
    }, [])

    const handleAgregarEditar = async (vendedor = null) => {
        const title = vendedor ? 'Editar Vendedor' : 'Agregar Vendedor'
        const btnText = vendedor ? 'Actualizar' : 'Crear'

        const { value: formValues } = await Swal.fire({
            title,
            html: `
                <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${vendedor ? vendedor.nombre : ''}">
                <input id="swal-apellidos" class="swal2-input" placeholder="Apellidos" value="${vendedor && vendedor.apellidos ? vendedor.apellidos : ''}">
                <input id="swal-dni" class="swal2-input" placeholder="DNI" value="${vendedor ? vendedor.dni : ''}">
                <input id="swal-celular" class="swal2-input" placeholder="Celular" value="${vendedor ? vendedor.celular : ''}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${vendedor ? vendedor.email : ''}" type="email">
                <input id="swal-password" class="swal2-input" placeholder="Contraseña (opcional)" type="password">
                <select id="swal-role" class="swal2-input" style="width: 100%; max-width: 100%; box-sizing: border-box; font-size: 15px;">
                    <option value="USER" ${vendedor?.role === 'USER' ? 'selected' : ''}>USER (Cliente)</option>
                    <option value="VENDEDOR" ${!vendedor || vendedor?.role === 'VENDEDOR' ? 'selected' : ''}>VENDEDOR</option>
                    <option value="ADMIN" ${vendedor?.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: btnText,
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value
                const apellidos = document.getElementById('swal-apellidos').value
                const dni = document.getElementById('swal-dni').value
                const celular = document.getElementById('swal-celular').value
                const email = document.getElementById('swal-email').value
                const password = document.getElementById('swal-password').value
                const role = document.getElementById('swal-role').value

                if (!nombre || !dni || !celular || !email || !role) {
                    Swal.showValidationMessage('Nombre, DNI, Celular, Email y Rol son obligatorios')
                }
                return { nombre, apellidos, dni, celular, email, password, role }
            }
        });

        if (formValues) {
            const payload = {
                ...formValues
            }

            if (vendedor && !payload.password) {
                delete payload.password;
            }

            try {
                if (vendedor) {
                    await axiosInstance.put(`/users/${vendedor.id}`, payload)
                    Swal.fire('Editado', 'El vendedor ha sido actualizado', 'success')
                } else {
                    await axiosInstance.post('/users', payload)
                    Swal.fire('Creado', 'El vendedor ha sido creado', 'success')
                }
                fetchVendedores()
            } catch (error) {
                console.error('Error al guardar:', error)
                Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar el vendedor', 'error')
            }
        }
    }

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este vendedor se eliminará permanentemente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#999',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (!result.isConfirmed) return
        try {
            await axiosInstance.delete(`/users/${id}`)
            setVendedores(prev => prev.filter(c => c.id !== id))
            Swal.fire('Eliminado', 'El vendedor ha sido eliminado', 'success')
        } catch (error) {
            console.error('Error al eliminar:', error)
            Swal.fire('Error', 'Hubo un error al eliminar el vendedor', 'error')
        }
    }

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">
                    Vendedores
                    <span className="users-count">({vendedores.length})</span>
                </h1>
                <button className="btn-agregar" onClick={() => handleAgregarEditar()}>
                    + Agregar Vendedor
                </button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>DNI</th>
                            <th>Celular</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Cargando vendedores...</td></tr>
                        ) : vendedores.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No hay vendedores encontrados.</td></tr>
                        ) : (
                            vendedores.map(vendedor => (
                                <tr key={vendedor.id}>
                                    <td>{vendedor.nombre}</td>
                                    <td>{vendedor.apellidos || '-'}</td>
                                    <td>{vendedor.dni}</td>
                                    <td>{vendedor.celular}</td>
                                    <td>{vendedor.email}</td>
                                    <td>
                                        <span className="badge-role vendedor">{vendedor.role}</span>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleAgregarEditar(vendedor)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(vendedor.id)}>Eliminar</button>
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

export default AdminVendedores
