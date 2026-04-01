import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroTab, setFiltroTab] = useState('ACTIVOS');

    // --- Control del Modal React ---
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchClientes = async () => {
        try {
            const res = await axiosInstance.get('/users');
            const usuariosFiltrados = res.data.filter(u => u.role === 'USER');
            setClientes(usuariosFiltrados);
        } catch (error) {
            console.error("Error obteniendo clientes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClientes(); }, []);

    const handleOpenModal = (cliente = null) => {
        setSelectedUser(cliente);
        setModalOpen(true);
    };

    const handleFormSubmit = async (payload) => {
        try {
            if (selectedUser) {
                await axiosInstance.put(`/users/${selectedUser.id}`, payload);
                Swal.fire('Éxito', 'El cliente ha sido actualizado', 'success');
            } else {
                await axiosInstance.post('/users', payload);
                Swal.fire('Éxito', 'El cliente ha sido creado', 'success');
            }
            setModalOpen(false); // Cerramos tu formulario
            fetchClientes();     // Recargamos la tabla
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Desactivar Cliente?',
            text: 'Pasará a la pestaña de Inactivos para mantener el registro de sus transacciones.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, Desactivar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/users/${id}`);
            fetchClientes();
            Swal.fire('Desactivado', 'El cliente ha sido enviado a Inactivos', 'info');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al desactivar', 'error');
        }
    };

    const toggleActivo = async (cliente) => {
        try {
            const nuevoEstado = !cliente.activo;
            await axiosInstance.put(`/users/${cliente.id}`, {
                ...cliente,
                activo: nuevoEstado
            });
            fetchClientes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    const clientesFiltrados = clientes.filter(dist => {
        if (filtroTab === 'ACTIVOS') return dist.activo !== false;
        if (filtroTab === 'INACTIVOS') return dist.activo === false;
        return true;
    });

    const cantActivos = clientes.filter(d => d.activo !== false).length;
    const cantInactivos = clientes.filter(d => d.activo === false).length;

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Clientes<span className="users-count">({clientesFiltrados.length})</span></h1>

                {filtroTab === 'ACTIVOS' && (
                    <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Cliente</button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setFiltroTab('ACTIVOS')}
                    style={{
                        background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                        color: filtroTab === 'ACTIVOS' ? '#8FC93C' : '#999',
                        borderBottom: filtroTab === 'ACTIVOS' ? '3px solid #8FC93C' : 'none',
                        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                    Activos
                    <span className="users-count">({cantActivos})</span>
                </button>

                <button
                    onClick={() => setFiltroTab('INACTIVOS')}
                    style={{
                        background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                        color: filtroTab === 'INACTIVOS' ? '#e74c3c' : '#999',
                        borderBottom: filtroTab === 'INACTIVOS' ? '3px solid #e74c3c' : 'none',
                        padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                    Inactivos
                    <span className="users-count">({cantInactivos})</span>
                </button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th><th>Apellidos</th><th>DNI</th><th>Celular</th><th>Email</th><th>Role</th><th>Estado</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>Cargando clientes...</td></tr>
                        ) : clientesFiltrados.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No hay clientes encontrados.</td></tr>
                        ) : (
                            clientesFiltrados.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.apellidos || '-'}</td>
                                    <td>{cliente.dni}</td>
                                    <td>{cliente.celular}</td>
                                    <td>{cliente.email}</td>
                                    <td><span className="badge-role">{cliente.role}</span></td>
                                    <td>
                                        <button
                                            onClick={() => toggleActivo(cliente)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            <span className={cliente.activo !== false ? "badge-role distribuidor" : "badge-role admin"}>
                                                {cliente.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleOpenModal(cliente)}>Editar</button>

                                        {cliente.activo !== false && (
                                            <button className="btn-eliminar" onClick={() => handleEliminar(cliente.id)}>Desactivar</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AdminUserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedUser}
                tipo="CLIENTE"
            />
        </div>
    );
}

export default AdminClientes;
