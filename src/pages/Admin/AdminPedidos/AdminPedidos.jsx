import { useState, useEffect } from "react";
import axiosInstance from "../../../config/axios";
import "../AdminUsersStyles.scss";
import Swal from "sweetalert2";

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [preciosCategorias, setPreciosCategorias] = useState({}); // { 'Categoría A': 0.50, ... }
    const [vistaModal, setVistaModal] = useState('cotizar'); // 'cotizar' o 'detalle'

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

    // Preparar los precios cuando se abre el modal
    useEffect(() => {
        if (pedidoSeleccionado) {
            const initialPrices = {};
            pedidoSeleccionado.productos?.forEach(p => {
                if (p.categoria && !initialPrices[p.categoria]) {
                    initialPrices[p.categoria] = p.precioUnitario || 0;
                }
            });
            setPreciosCategorias(initialPrices);
            setVistaModal('cotizar'); // Siempre abrir en la pestaña de cotizar
        }
    }, [pedidoSeleccionado]);

    const handleActualizarPrecios = (categoria, valor) => {
        setPreciosCategorias({
            ...preciosCategorias,
            [categoria]: parseFloat(valor) || 0
        });
    };

    const guardarCotizacion = async () => {
        try {
            // 1. Aplicamos el precio de la categoría a cada producto individualmente
            const productosActualizados = pedidoSeleccionado.productos.map(p => ({
                ...p,
                precioUnitario: preciosCategorias[p.categoria] || 0,
                subtotal: (preciosCategorias[p.categoria] || 0) * (p.cantidad || 0)
            }));

            // 2. Calculamos el nuevo monto total
            const nuevoMontoTotal = productosActualizados.reduce((acc, p) => acc + (p.subtotal || 0), 0);

            // 3. Enviamos al backend
            const payload = {
                productos: productosActualizados,
                montoTotal: nuevoMontoTotal,
                estado: 'COTIZADO'
            };

            await axiosInstance.put(`/orders/${pedidoSeleccionado._id || pedidoSeleccionado.id}`, payload);

            Swal.fire('¡Cotizado!', 'El pedido ha sido actualizado y marcado como COTIZADO.', 'success');
            setPedidoSeleccionado(null);
            fetchPedidos(); // Recargamos la tabla principal
        } catch (error) {
            console.error("Error al guardar cotización", error);
            Swal.fire('Error', 'Hubo un problema al guardar los precios en el servidor.', 'error');
        }
    };

    // Agrupar productos por categoría para la vista de cotización
    const agruparPorCategoria = (productos) => {
        const grupos = {};
        productos?.forEach(p => {
            const cat = p.categoria || 'Sin Categoría';
            if (!grupos[cat]) {
                grupos[cat] = {
                    nombre: cat,
                    cantidadTotal: 0,
                    ejemplos: [] // Para mostrar algún item de referencia si quieres
                };
            }
            grupos[cat].cantidadTotal += (p.cantidad || 0);
        });
        return Object.values(grupos);
    };

    const eliminarPedido = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar este pedido?',
            text: "Esta acción no se puede deshacer y el pedido desaparecerá de la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/orders/${id}`);
                setPedidos(pedidos.filter(p => (p._id || p.id) !== id));
                Swal.fire('Eliminado', 'El pedido ha sido borrado con éxito.', 'success');
            } catch (error) {
                console.error("Error eliminando pedido", error);
                Swal.fire('Error', 'No se pudo eliminar el pedido del servidor.', 'error');
            }
        }
    };

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const categoriasAgrupadas = agruparPorCategoria(pedidoSeleccionado?.productos);
    const granTotal = categoriasAgrupadas.reduce((acc, cat) => acc + (cat.cantidadTotal * (preciosCategorias[cat.nombre] || 0)), 0);

    return (
        <div className="admin-users-view">
            {/* CSS GLOBAL PARA QUITAR FLECHAS DE INPUT NUMBER */}
            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type=number] {
                        -moz-appearance: textfield;
                    }
                `}
            </style>

            <div className="users-header">
                <h1 className="users-titulo">Gestión de Órdenes <span className="users-count">({pedidos.length})</span></h1>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Ticket / ID</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Distribuidor (Comprador)</th>
                            <th>Total Items</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Vendedor a Cargo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>Cargando órdenes...</td></tr>
                        ) : pedidos.length === 0 ? (
                            <tr><td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>No se han registrado órdenes aún.</td></tr>
                        ) : (
                            pedidos.map(pedido => (
                                <tr key={pedido._id || pedido.id}>
                                    <td><strong>{(pedido._id || pedido.id).slice(-6).toUpperCase()}</strong></td>
                                    <td>{formatoFecha(pedido.fecha || pedido.createdAt)}</td>

                                    <td style={{ fontSize: '11px', fontWeight: 'bold' }}>{pedido.tipoPedido || '—'}</td>

                                    {/* Mapeamos los datos según el NUEVO JSON del backend */}
                                    <td>{pedido.comprador?.nombre || 'Desconocido'}</td>

                                    <td>
                                        {pedido.productos?.reduce((acc, p) => acc + (p.cantidad || 0), 0) || 0} unid.
                                    </td>

                                    <td style={{ fontWeight: 'bold' }}>
                                        S/ {pedido.montoTotal ? pedido.montoTotal.toFixed(2) : '0.00'}
                                    </td>

                                    <td>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            backgroundColor: pedido.estado === 'PENDIENTE_PRECIO' ? '#fff3cd' : pedido.estado === 'COTIZADO' ? '#cfe2ff' : '#d1e7dd',
                                            color: pedido.estado === 'PENDIENTE_PRECIO' ? '#856404' : pedido.estado === 'COTIZADO' ? '#084298' : '#0f5132'
                                        }}>
                                            {pedido.estado || 'PENDIENTE'}
                                        </span>
                                    </td>

                                    <td>
                                        {pedido.vendedor ? (
                                            <span style={{ color: '#7AB433', fontWeight: 'bold' }}>
                                                {pedido.vendedor.nombre}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#999', fontStyle: 'italic' }}>
                                                —
                                            </span>
                                        )}
                                    </td>

                                    <td className="td-acciones" style={{ display: 'flex', gap: '5px' }}>
                                        <button className="btn-editar" style={{ padding: '8px 12px' }} onClick={() => setPedidoSeleccionado(pedido)}>Cotizar</button>
                                        <button
                                            className="btn-eliminar"
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                            onClick={() => eliminarPedido(pedido._id || pedido.id)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL DE COTIZACIÓN POR CATEGORÍA Y DETALLE */}
            {pedidoSeleccionado && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '850px', width: '95%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                        <button onClick={() => setPedidoSeleccionado(null)} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>

                        <h2 style={{ color: '#3a5a0a', marginBottom: '10px', borderBottom: '2px solid #7AB433', paddingBottom: '8px', fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Pedido #{(pedidoSeleccionado._id || pedidoSeleccionado.id).slice(-6).toUpperCase()}</span>
                            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '15px', backgroundColor: pedidoSeleccionado.estado === 'PENDIENTE_PRECIO' ? '#fff3cd' : '#cfe2ff', color: pedidoSeleccionado.estado === 'PENDIENTE_PRECIO' ? '#856404' : '#084298' }}>
                                {pedidoSeleccionado.estado}
                            </span>
                        </h2>

                        {/* FICHA DE IDENTIDAD DEL PEDIDO (CABECERA) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px', backgroundColor: '#fcfcfc', padding: '15px', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }}>
                            <div>
                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.5px' }}>Distribuidor (Comprador)</h4>
                                <p style={{ fontSize: '14px', margin: 0 }}><strong>{pedidoSeleccionado.comprador?.nombre || '—'}</strong></p>
                                <p style={{ color: '#666', margin: 0 }}>{pedidoSeleccionado.comprador?.email}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.5px' }}>Vendedor a Cargo</h4>
                                <p style={{ fontSize: '14px', margin: 0 }}><strong>{pedidoSeleccionado.vendedor?.nombre || '—'}</strong></p>
                                <p style={{ color: '#666', margin: 0 }}>{pedidoSeleccionado.vendedor?.email}</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#888', textTransform: 'uppercase', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.5px' }}>Detalles de Orden</h4>
                                <p style={{ margin: 0 }}>Tipo: <strong>{pedidoSeleccionado.tipoPedido}</strong></p>
                                <p style={{ margin: 0 }}>Fecha: {formatoFecha(pedidoSeleccionado.fecha || pedidoSeleccionado.createdAt)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <button
                                onClick={() => setVistaModal('cotizar')}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                    backgroundColor: vistaModal === 'cotizar' ? '#7AB433' : '#eee',
                                    color: vistaModal === 'cotizar' ? 'white' : '#666'
                                }}
                            >
                                💰 Cotización Grupal
                            </button>
                            <button
                                onClick={() => setVistaModal('detalle')}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                    backgroundColor: vistaModal === 'detalle' ? '#3a5a0a' : '#eee',
                                    color: vistaModal === 'detalle' ? 'white' : '#666'
                                }}
                            >
                                📋 Detalle Inventario
                            </button>
                        </div>

                        {vistaModal === 'cotizar' ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                                <thead style={{ backgroundColor: '#7AB433', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Categoría</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Cant. Total</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Precio Unit. sugerido</th>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal Cat.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriasAgrupadas.map(cat => {
                                        const precio = preciosCategorias[cat.nombre] || 0;
                                        const subtotal = cat.cantidadTotal * precio;
                                        return (
                                            <tr key={cat.nombre} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px' }}><strong>{cat.nombre}</strong></td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>{cat.cantidadTotal} unid.</td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    S/ <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={precio === 0 ? '' : precio} // Mostramos vacío si es cero para que sea fácil escribir
                                                        placeholder="0.00"
                                                        onChange={(e) => handleActualizarPrecios(cat.nombre, e.target.value)}
                                                        onFocus={(e) => e.target.select()} // Al darle clic, selecciona todo para borrar el anterior
                                                        style={{
                                                            width: '80px',
                                                            padding: '6px',
                                                            textAlign: 'center',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            MozAppearance: 'textfield', // Quita flechas en Firefox
                                                            WebkitAppearance: 'none',   // Quita flechas en Chrome/Safari
                                                            margin: 0
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>S/ {subtotal.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                                    <thead style={{ backgroundColor: '#3a5a0a', color: 'white', position: 'sticky', top: 0 }}>
                                        <tr>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Item (Código)</th>
                                            <th style={{ padding: '10px', textAlign: 'center' }}>Cant.</th>
                                            <th style={{ padding: '10px', textAlign: 'center' }}>Precio Unit.</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidoSeleccionado.productos?.map((prod, idx) => {
                                            const pUnit = preciosCategorias[prod.categoria] || 0;
                                            return (
                                                <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                    <td style={{ padding: '10px' }}><strong>{prod.item}</strong></td>
                                                    <td style={{ padding: '10px', textAlign: 'center' }}>{prod.cantidad}</td>
                                                    <td style={{ padding: '10px', textAlign: 'center' }}>S/ {pUnit.toFixed(2)}</td>
                                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>S/ {(prod.cantidad * pUnit).toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#3a5a0a', color: 'white', padding: '15px', borderRadius: '6px' }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>MONTO TOTAL:</p>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>S/ {granTotal.toFixed(2)}</p>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={guardarCotizacion}
                                style={{ flex: 1, padding: '12px', backgroundColor: '#7AB433', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                ✅ Guardar Cotización
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPedidos;
