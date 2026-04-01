import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminVendedores() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Control del Modal React ---
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchVendedores = async () => {
        try {
            const res = await axiosInstance.get('/users');
            const usuariosFiltrados = res.data.filter(u => u.role === 'VENDEDOR');
            setVendedores(usuariosFiltrados);
        } catch (error) {
            console.error("Error obteniendo vendedores", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVendedores(); }, []);

    const handleOpenModal = (vendedor = null) => {
        setSelectedUser(vendedor);
        setModalOpen(true);
    };

    const handleFormSubmit = async (payload) => {
        try {
            if (selectedUser) {
                await axiosInstance.put(`/users/${selectedUser.id}`, payload);
                Swal.fire('Éxito', 'El vendedor ha sido actualizado', 'success');
            } else {
                await axiosInstance.post('/users', payload);
                Swal.fire('Éxito', 'El vendedor ha sido creado', 'success');
            }
            setModalOpen(false);
            fetchVendedores();
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?', text: 'Este vendedor se eliminará permanentemente',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/users/${id}`);
            setVendedores(prev => prev.filter(c => c.id !== id));
            Swal.fire('Eliminado', 'El vendedor ha sido eliminado', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al eliminar', 'error');
        }
    };

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Vendedores<span className="users-count">({vendedores.length})</span></h1>
                <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Vendedor</button>
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
                                    <td><span className="badge-role vendedor">{vendedor.role}</span></td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleOpenModal(vendedor)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(vendedor.id)}>Eliminar</button>
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
                tipo="VENDEDOR"
            />
        </div>
    );
}

export default AdminVendedores;
