import { useState, useEffect } from 'react'
import axiosInstance from '../../../config/axios'
import Swal from 'sweetalert2'
import '../AdminUsersStyles.scss'

function AdminDistribuidores() {
    const [distribuidores, setDistribuidores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchDistribuidores = async () => {
        try {
            const res = await axiosInstance.get('/distribuidores')
            setDistribuidores(res.data)
        } catch (error) {
            console.error("Error al obtener los distribuidores", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDistribuidores()
    }, [])

    const handleAgregarEditar = async (distribuidor = null) => {
        const title = distribuidor ? 'Editar Distribuidor' : 'Agregar Distribuidor'
        const btnText = distribuidor ? 'Actualizar' : 'Crear'

        const { value: formValues } = await Swal.fire({
            title,
            html: `
                <input id="swal-nombre" class="swal2-input" placeholder="Nombre/Razón Social" value="${distribuidor ? distribuidor.nombre : ''}">
                <input id="swal-rucdni" class="swal2-input" placeholder="RUC o DNI" value="${distribuidor ? distribuidor.ruc_dni : ''}">
                <input id="swal-celular" class="swal2-input" placeholder="Celular" value="${distribuidor ? distribuidor.celular : ''}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${distribuidor ? distribuidor.email : ''}" type="email">
                <input id="swal-password" class="swal2-input" placeholder="Contraseña (opcional)" type="password">
                <div style="margin-top: 15px; text-align: left;">
                    <label>
                        <input id="swal-activo" type="checkbox" ${distribuidor && distribuidor.activo === false ? '' : 'checked'}> 
                        Usuario Activo
                    </label>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: btnText,
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('swal-nombre').value
                const ruc_dni = document.getElementById('swal-rucdni').value
                const celular = document.getElementById('swal-celular').value
                const email = document.getElementById('swal-email').value
                const password = document.getElementById('swal-password').value
                const activo = document.getElementById('swal-activo').checked

                if (!nombre || !ruc_dni || !celular || !email) {
                    Swal.showValidationMessage('Nombre, RUC/DNI, Celular y Email son obligatorios')
                }
                return { nombre, ruc_dni, celular, email, password, activo }
            }
        });

        if (formValues) {
            const payload = { ...formValues }

            if (distribuidor && !payload.password) {
                delete payload.password;
            }

            try {
                if (distribuidor) {
                    await axiosInstance.put(`/distribuidores/${distribuidor.id}`, payload)
                    Swal.fire('Editado', 'El distribuidor ha sido actualizado', 'success')
                } else {
                    await axiosInstance.post('/distribuidores', payload)
                    Swal.fire('Creado', 'El distribuidor ha sido creado', 'success')
                }
                fetchDistribuidores()
            } catch (error) {
                console.error('Error al guardar:', error)
                Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar', 'error')
            }
        }
    }

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este distribuidor se eliminará permanentemente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#999',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (!result.isConfirmed) return
        try {
            await axiosInstance.delete(`/distribuidores/${id}`)
            setDistribuidores(prev => prev.filter(c => c.id !== id))
            Swal.fire('Eliminado', 'El distribuidor ha sido eliminado', 'success')
        } catch (error) {
            console.error('Error al eliminar:', error)
            Swal.fire('Error', 'Hubo un error al eliminar', 'error')
        }
    }

    const toggleActivo = async (distribuidor) => {
        try {
            const nuevoEstado = !distribuidor.activo;
            // Solo actualizamos el estado
            await axiosInstance.put(`/distribuidores/${distribuidor.id}`, {
                ...distribuidor,
                activo: nuevoEstado
            });
            fetchDistribuidores();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    }

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">
                    Distribuidores
                    <span className="users-count">({distribuidores.length})</span>
                </h1>
                <button className="btn-agregar" onClick={() => handleAgregarEditar()}>
                    + Agregar Distribuidor
                </button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>RUC / DNI</th>
                            <th>Celular</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Cargando distribuidores...</td></tr>
                        ) : distribuidores.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No hay distribuidores encontrados.</td></tr>
                        ) : (
                            distribuidores.map(distribuidor => (
                                <tr key={distribuidor.id}>
                                    <td>{distribuidor.nombre}</td>
                                    <td>{distribuidor.ruc_dni}</td>
                                    <td>{distribuidor.celular}</td>
                                    <td>{distribuidor.email}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActivo(distribuidor)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span className={distribuidor.activo !== false ? "badge-role distribuidor" : "badge-role admin"}>
                                                {distribuidor.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleAgregarEditar(distribuidor)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(distribuidor.id)}>Eliminar</button>
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

export default AdminDistribuidores
