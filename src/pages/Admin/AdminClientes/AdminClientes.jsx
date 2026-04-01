import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NUEVO: Control del Modal React ---
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

    // 1. Al presionar el botón "Editar" o "+ Agregar" solo abrimos la ventana
    const handleOpenModal = (cliente = null) => {
        setSelectedUser(cliente);
        setModalOpen(true);
    };

    // 2. El Modal nuevo nos manda el Payload limpio para guardar
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

    // La eliminación sí se queda igual con una alertita roja (es normal)
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?', text: 'Este cliente se eliminará permanentemente',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/users/${id}`);
            setClientes(prev => prev.filter(c => c.id !== id));
            Swal.fire('Eliminado', 'El cliente ha sido eliminado', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al eliminar', 'error');
        }
    };

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Clientes<span className="users-count">({clientes.length})</span></h1>
                <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Cliente</button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th><th>Apellidos</th><th>DNI</th><th>Celular</th><th>Email</th><th>Role</th><th>Acciones</th>
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
                                    <td><span className="badge-role">{cliente.role}</span></td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleOpenModal(cliente)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(cliente.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* AQUI NACE TU NUEVO MODAL JSX (Inyectado si modalOpen es verdadero) */}
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
