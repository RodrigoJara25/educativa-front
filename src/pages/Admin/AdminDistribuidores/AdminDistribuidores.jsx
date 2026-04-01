import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';
import Swal from 'sweetalert2';
import '../AdminUsersStyles.scss';
import AdminUserModal from '../../../components/AdminUserModal/AdminUserModal';

function AdminDistribuidores() {
    const [distribuidores, setDistribuidores] = useState([]);
    const [loading, setLoading] = useState(true);

    // NUEVO: Estado para saber en qué pestaña estamos
    const [filtroTab, setFiltroTab] = useState('ACTIVOS'); // Puede ser 'ACTIVOS' o 'INACTIVOS'

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

    // La eliminación ahora la llamaremos "Desactivación"
    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Desactivar Distribuidor?',
            text: 'Pasará a la pestaña de Inactivos para mantener el registro de sus facturas.',
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#e74c3c', confirmButtonText: 'Sí, Desactivar', cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;
        try {
            await axiosInstance.delete(`/distribuidores/${id}`);
            // No lo borramos del state, recargamos la tabla para que el backend nos lo mande con activo: false
            fetchDistribuidores();
            Swal.fire('Desactivado', 'El distribuidor ha sido enviado a Inactivos', 'info');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al desactivar', 'error');
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

    // NUEVO: Filtramos la lista dependiendo de la pestaña seleccionada
    const distribuidoresFiltrados = distribuidores.filter(dist => {
        if (filtroTab === 'ACTIVOS') return dist.activo !== false;
        if (filtroTab === 'INACTIVOS') return dist.activo === false;
        return true;
    });

    // Calculamos la cantidad exacta de activos e inactivos para las burbujitas
    const cantActivos = distribuidores.filter(d => d.activo !== false).length;
    const cantInactivos = distribuidores.filter(d => d.activo === false).length;

    return (
        <div className="admin-users-view">
            <div className="users-header">
                {/* Mostramos el contador del total de la pestaña actual */}
                <h1 className="users-titulo">Distribuidores<span className="users-count">({distribuidoresFiltrados.length})</span></h1>

                {/* Solo dejamos agregar usuarios cuando estamos viendo los Activos (es lo lógico) */}
                {filtroTab === 'ACTIVOS' && (
                    <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Agregar Distribuidor</button>
                )}
            </div>

            {/* NUEVO: BARRA DE PESTAÑAS */}
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
                    {/* Le agregamos la burbujita */}
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
                    {/* Le agregamos la burbujita */}
                    <span className="users-count">({cantInactivos})</span>
                </button>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th><th>RUC / DNI</th><th>Celular</th><th>Email</th><th>Username</th><th>Estado</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Cargando distribuidores...</td></tr>
                        ) : distribuidoresFiltrados.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No hay distribuidores en esta pestaña.</td></tr>
                        ) : (
                            distribuidoresFiltrados.map(distribuidor => (
                                <tr key={distribuidor.id}>
                                    <td>{distribuidor.nombre}</td>
                                    <td>{distribuidor.ruc_dni}</td>
                                    <td>{distribuidor.celular}</td>
                                    <td>{distribuidor.email}</td>
                                    {/* Muestra el username real o un guion si no lo tiene */}
                                    <td><strong>{distribuidor.username || '-'}</strong></td>
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

                                        {/* Solo mostramos el botón rojo de desactivar si realmente está activo en este momento */}
                                        {distribuidor.activo !== false && (
                                            <button className="btn-eliminar" onClick={() => handleEliminar(distribuidor.id)}>Desactivar</button>
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
                tipo="DISTRIBUIDOR"
            />
        </div>
    );
}

export default AdminDistribuidores;
