import { useState, useEffect } from "react";
import axiosInstance from "../../../config/axios";
import "../AdminUsersStyles.scss";
import Swal from "sweetalert2";

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidos = async () => {
        try {
            const res = await axiosInstance.get('/orders');
            setPedidos(res.data);
        } catch (error) {
            console.error("Error obteniendo los pedidos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const verDetallePDF = (pedido) => {
        // En el futuro, aquí puedes abrir un modal con PedidoPDF pasándole los datos del pedido viejo
        // o descargar la factura guardada si el backend retorna su URL.
        Swal.fire('Función en Desarrollo', 'Aquí se desplegará el comprobante del pedido.', 'info');
    };

    return (
        <div className="admin-users-view">
            <div className="users-header">
                <h1 className="users-titulo">Gestión de Órdenes <span className="users-count">({pedidos.length})</span></h1>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Ticket / ID</th>
                            <th>Fecha</th>
                            <th>Distribuidor (Comprador)</th>
                            <th>Total Items</th>
                            <th>Vendedor a Cargo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Cargandoórdenes...</td></tr>
                        ) : pedidos.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No se han registrado órdenes aún.</td></tr>
                        ) : (
                            pedidos.map(pedido => (
                                <tr key={pedido._id || pedido.id}>
                                    <td><strong>{(pedido._id || pedido.id).slice(-6).toUpperCase()}</strong></td>
                                    <td>{formatoFecha(pedido.fecha || pedido.createdAt)}</td>

                                    {/* Mapeamos los datos dependiendo si vinieron en objetos anidados */}
                                    <td>{pedido.distribuidor?.nombre || pedido.distribuidor || 'Desconocido'}</td>

                                    <td>{pedido.totalProductos} unid.</td>

                                    {/* LA NUEVA REGLA DE BACKEND (Punto 3 de Rendimiento de Comisiones) */}
                                    <td>
                                        {pedido.vendedor ? (
                                            <span style={{ color: '#7AB433', fontWeight: 'bold' }}>
                                                {pedido.vendedor.nombre} {pedido.vendedor.apellidos}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#999', fontStyle: 'italic' }}>
                                                Venta Directa
                                            </span>
                                        )}
                                    </td>

                                    <td className="td-acciones">
                                        <button className="btn-editar" onClick={() => verDetallePDF(pedido)}>Ver PDF</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPedidos;
