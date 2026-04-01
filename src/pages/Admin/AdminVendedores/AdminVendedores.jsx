import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminVendedores() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroTab, setFiltroTab] = useState('ACTIVOS');

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
            title: '¿Desactivar Vendedor?',
            text: 'Pasará a la pestaña de Inactivos para mantener el registro de sus transacciones.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, Desactivar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/users/${id}`);
            fetchVendedores();
            Swal.fire('Desactivado', 'El vendedor ha sido enviado a Inactivos', 'info');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al desactivar', 'error');
        }
    };

    const toggleActivo = async (vendedor) => {
        try {
            const nuevoEstado = !vendedor.activo;
            await axiosInstance.put(`/users/${vendedor.id}`, {
                ...vendedor,
                activo: nuevoEstado
            });
            fetchVendedores();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    const vendedoresFiltrados = vendedores.filter(dist => {
        if (filtroTab === 'ACTIVOS') return dist.activo !== false;
        if (filtroTab === 'INACTIVOS') return dist.activo === false;
        return true;
    });

    const cantActivos = vendedores.filter(d => d.activo !== false).length;
    const cantInactivos = vendedores.filter(d => d.activo === false).length;

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Vendedores<span className="users-count">({vendedoresFiltrados.length})</span></h1>

                {filtroTab === 'ACTIVOS' && (
                    <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Vendedor</button>
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
                            <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>Cargando vendedores...</td></tr>
                        ) : vendedoresFiltrados.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No hay vendedores encontrados.</td></tr>
                        ) : (
                            vendedoresFiltrados.map(vendedor => (
                                <tr key={vendedor.id}>
                                    <td>{vendedor.nombre}</td>
                                    <td>{vendedor.apellidos || '-'}</td>
                                    <td>{vendedor.dni}</td>
                                    <td>{vendedor.celular}</td>
                                    <td>{vendedor.email}</td>
                                    <td><span className="badge-role vendedor">{vendedor.role}</span></td>
                                    <td>
                                        <button
                                            onClick={() => toggleActivo(vendedor)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            <span className={vendedor.activo !== false ? "badge-role distribuidor" : "badge-role admin"}>
                                                {vendedor.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleOpenModal(vendedor)}>Editar</button>

                                        {vendedor.activo !== false && (
                                            <button className="btn-eliminar" onClick={() => handleEliminar(vendedor.id)}>Desactivar</button>
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
                tipo="VENDEDOR"
            />
        </div>
    );
}

export default AdminVendedores;
