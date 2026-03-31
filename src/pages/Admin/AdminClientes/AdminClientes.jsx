import { useState, useEffect } from 'react'
import axiosInstance from '../../../config/axios'
import Swal from 'sweetalert2'
import '../AdminUsersStyles.scss'

function AdminClientes() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchClientes = async () => {
        try {
            const res = await axiosInstance.get('/users')
            // Filtramos solo los que son USER
            const usuariosFiltrados = res.data.filter(u => u.role === 'USER')
            setClientes(usuariosFiltrados)
        } catch (error) {
            console.error("Error al obtener los clientes", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClientes()
    }, [])

    const handleAgregarEditar = async (cliente = null) => {
        const title = cliente ? 'Editar Cliente' : 'Agregar Cliente'
        const btnText = cliente ? 'Actualizar' : 'Crear'

        const { value: formValues } = await Swal.fire({
            title,
            html: `
                <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${cliente ? cliente.nombre : ''}">
                <input id="swal-apellidos" class="swal2-input" placeholder="Apellidos" value="${cliente && cliente.apellidos ? cliente.apellidos : ''}">
                <input id="swal-dni" class="swal2-input" placeholder="DNI" value="${cliente ? cliente.dni : ''}">
                <input id="swal-celular" class="swal2-input" placeholder="Celular" value="${cliente ? cliente.celular : ''}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${cliente ? cliente.email : ''}" type="email">
                <input id="swal-password" class="swal2-input" placeholder="Contraseña (opcional)" type="password">
                <select id="swal-role" class="swal2-input" style="width: 100%; max-width: 100%; box-sizing: border-box; font-size: 15px;">
                    <option value="USER" ${!cliente || cliente?.role === 'USER' ? 'selected' : ''}>USER (Cliente)</option>
                    <option value="VENDEDOR" ${cliente?.role === 'VENDEDOR' ? 'selected' : ''}>VENDEDOR</option>
                    <option value="ADMIN" ${cliente?.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
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

            // Si es edición y no mandaron password, tal vez no queremos enviarla para no sobreescribir
            if (cliente && !payload.password) {
                delete payload.password;
            }

            try {
                if (cliente) {
                    await axiosInstance.put(`/users/${cliente.id}`, payload)
                    Swal.fire('Editado', 'El cliente ha sido actualizado', 'success')
                } else {
                    await axiosInstance.post('/users', payload)
                    Swal.fire('Creado', 'El cliente ha sido creado', 'success')
                }
                fetchClientes()
            } catch (error) {
                console.error('Error al guardar:', error)
                Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar el cliente', 'error')
            }
        }
    }

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este cliente se eliminará permanentemente',
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
            setClientes(prev => prev.filter(c => c.id !== id))
            Swal.fire('Eliminado', 'El cliente ha sido eliminado', 'success')
        } catch (error) {
            console.error('Error al eliminar:', error)
            Swal.fire('Error', 'Hubo un error al eliminar el cliente', 'error')
        }
    }

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">
                    Clientes (Usuarios)
                    <span className="users-count">({clientes.length})</span>
                </h1>
                <button className="btn-agregar" onClick={() => handleAgregarEditar()}>
                    + Agregar Cliente
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
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Cargando clientes...</td></tr>
                        ) : clientes.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No hay clientes encontrados.</td></tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellidos || '-'}</td>
                                    <td>{cliente.dni}</td>
                                    <td>{cliente.celular}</td>
                                    <td>{cliente.email}</td>
                                    <td>
                                        <span className="badge-role">{cliente.role}</span>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleAgregarEditar(cliente)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(cliente.id)}>Eliminar</button>
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

export default AdminClientes
