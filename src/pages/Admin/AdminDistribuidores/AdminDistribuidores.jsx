import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminDistribuidores() {
    const [distribuidores, setDistribuidores] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Control del Modal React ---
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchDistribuidores = async () => {
        try {
            const res = await axiosInstance.get('/distribuidores');
            setDistribuidores(res.data);
        } catch (error) {
            console.error("Error obteniendo distribuidores", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDistribuidores(); }, []);

    const handleOpenModal = (distribuidor = null) => {
        setSelectedUser(distribuidor);
        setModalOpen(true);
    };

    const handleFormSubmit = async (payload) => {
        try {
            if (selectedUser) {
                await axiosInstance.put(`/distribuidores/${selectedUser.id}`, payload);
                Swal.fire('Éxito', 'El distribuidor ha sido actualizado', 'success');
            } else {
                await axiosInstance.post('/distribuidores', payload);
                Swal.fire('Éxito', 'El distribuidor ha sido creado', 'success');
            }
            setModalOpen(false);
            fetchDistribuidores();
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire('Error', error.response?.data?.message || 'Hubo un error al guardar', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?', text: 'Este distribuidor se eliminará permanentemente',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/distribuidores/${id}`);
            setDistribuidores(prev => prev.filter(c => c.id !== id));
            Swal.fire('Eliminado', 'El distribuidor ha sido eliminado', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al eliminar', 'error');
        }
    };

    const toggleActivo = async (distribuidor) => {
        try {
            const nuevoEstado = !distribuidor.activo;
            await axiosInstance.put(`/distribuidores/${distribuidor.id}`, {
                ...distribuidor,
                activo: nuevoEstado
            });
            fetchDistribuidores();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Distribuidores<span className="users-count">({distribuidores.length})</span></h1>
                <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Distribuidor</button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th><th>RUC / DNI</th><th>Celular</th><th>Email</th><th>Estado</th><th>Acciones</th>
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
                                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            <span className={distribuidor.activo !== false ? "badge-role distribuidor" : "badge-role admin"}>
                                                {distribuidor.activo !== false ? 'ACTIVO' : 'INACTIVO'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => handleOpenModal(distribuidor)}>Editar</button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(distribuidor.id)}>Eliminar</button>
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
                tipo="DISTRIBUIDOR"
            />
        </div>
    );
}

export default AdminDistribuidores;
