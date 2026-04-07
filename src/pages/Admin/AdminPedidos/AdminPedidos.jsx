import { useState, useEffect } from "react";
import axiosInstance from "../../../config/axios";
import "../AdminUsersStyles.scss";
import Swal from "sweetalert2";
import ubigeo from "ubigeo-peru";

import { useProducts } from "../../../context/ProductContext";
import PedidoPDF from "../../../components/PedidoPDF/PedidoPDF";
import { laminasMock } from "../../../data/laminasMock";

function AdminPedidos() {
    const { productos: catalogoProductos } = useProducts();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [preciosCategorias, setPreciosCategorias] = useState({});
    const [vistaModal, setVistaModal] = useState('cotizar');

    // ESTADO PARA GENERACIÓN "A DEMANDA" DEL PDF
    const [idPedidoParaPDF, setIdPedidoParaPDF] = useState(null);

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

    // --- FUNCIÓN CLAVE: NORMALIZADOR DE IDS (Blindaje contra objetos populados) ---
    const obtenerIdPuro = (item) => {
        if (!item) return null;
        // Si es un objeto (populado), sacamos su _id o id. Si no, devolvemos el valor directo (string)
        if (typeof item === 'object') return (item._id || item.id)?.toString();
        return item.toString();
    };

    // Sincronizar precios cuando se abre el modal
    useEffect(() => {
        if (pedidoSeleccionado && catalogoProductos.length > 0) {
            const initialPrices = {};
            pedidoSeleccionado.productos?.forEach(p => {
                // Usamos el normalizador para buscar en el catálogo
                const pid = obtenerIdPuro(p.producto_id || p.id || p._id);
                const prodReal = catalogoProductos.find(cp => obtenerIdPuro(cp) === pid);
                const nombreCat = prodReal?.categoria?.nombre || prodReal?.categoria;

                if (nombreCat && !initialPrices[nombreCat]) {
                    initialPrices[nombreCat] = p.precioUnitario || 0;
                }
            });
            setPreciosCategorias(initialPrices);
            setVistaModal('cotizar');
        }
    }, [pedidoSeleccionado, catalogoProductos]);

    const handleActualizarPrecios = (categoria, valor) => {
        setPreciosCategorias({
            ...preciosCategorias,
            [categoria]: parseFloat(valor) || 0
        });
    };

    const dataHub = ubigeo.reniec;
    const resolverNombreUbigeo = (id, tipo, depId = null, provId = null) => {
        if (!id) return '—';
        if (isNaN(id)) return id;

        // Aseguramos que el ID tenga 2 dígitos (ej: "1" -> "01")
        const padId = id.toString().padStart(2, '0');
        const padDep = depId?.toString().padStart(2, '0');
        const padProv = provId?.toString().padStart(2, '0');

        if (tipo === 'dep') {
            return dataHub.find(d => d.departamento === padId && d.provincia === "00")?.nombre || id;
        }
        if (tipo === 'prov' && padDep) {
            // Buscamos la provincia DENTRO del departamento correcto
            return dataHub.find(p => p.departamento === padDep && p.provincia === padId && p.distrito === "00")?.nombre || id;
        }
        if (tipo === 'dist' && padDep && padProv) {
            // Buscamos el distrito DENTRO del departamento y provincia correctos
            return dataHub.find(d => d.departamento === padDep && d.provincia === padProv && d.distrito === padId)?.nombre || id;
        }
        return id;
    };

    // --- MAPEO DE DATOS PARA PDF (BAJO DEMANDA) ---
    const mapearDatosParaPDF = (pedido) => {
        if (!pedido || !catalogoProductos.length) return { dist: {}, cats: [] };

        const cantMap = {};
        pedido.productos?.forEach(p => {
            const pid = obtenerIdPuro(p.producto_id || p.id || p._id);
            if (pid) cantMap[pid] = p.cantidad;
        });

        const armar = (n) => catalogoProductos.filter(p => (p.categoria?.nombre || p.categoria) === n).map(p => ({
            item: p.item || "-", titulo: p.titulo || p.nombre, cantidad: cantMap[obtenerIdPuro(p)] || 0
        }));

        const cats = [
            {
                nombre: "Láminas", soloItem: true,
                items: laminasMock.reduce((acc, sub) => {
                    acc.push({ tipo: 'etiqueta', nombre: sub.subcategoria.nombre.toUpperCase() });
                    sub.laminas.forEach(l => {
                        const pR = catalogoProductos.find(p => p.item === l.item);
                        acc.push({ tipo: 'item', item: l.item, cantidad: pR ? (cantMap[obtenerIdPuro(pR)] || 0) : 0 });
                    });
                    return acc;
                }, [])
            },
            {
                tipo: 'cuarteto', nombre: 'Libros',
                cuarteto: [
                    { nombre: "Cuentos Clásicos", items: armar("Cuentos Clásicos") },
                    { nombre: "Obras Literarias", items: armar("Obras Literarias") },
                    { nombre: "Cuentos Infantiles", items: armar("Cuentos Infantiles") },
                    { nombre: "Diccionarios", items: armar("Diccionarios") },
                ]
            },
            { nombre: "Cuentos Selectos", dobleTabla: true, items: armar("Cuentos Selectos") },
            {
                tipo: 'cuarteto', nombre: 'Cuentos Ecológicos y Educativos',
                cuarteto: [
                    { nombre: "Cuentos Ecológicos", items: armar("Cuentos Ecológicos") },
                    { nombre: "Cuentos Educativos", items: armar("Cuentos Educativos") },
                ]
            }
        ];

        const comprador = pedido.comprador || {};
        const ubi = comprador.ubicacion || {};
        const logi = comprador.logistica || {};

        const dId = ubi.departamento || comprador.departamento;
        const pId = ubi.provincia || comprador.provincia;
        const disId = ubi.distrito || comprador.distrito;

        const dist = {
            nombre: comprador.nombre || "—",
            ruc: comprador.ruc_dni || "—",
            telefono: comprador.celular || "—",
            email: comprador.email || "—",
            departamento: resolverNombreUbigeo(dId, 'dep'),
            provincia: resolverNombreUbigeo(pId, 'prov', dId),
            distrito: resolverNombreUbigeo(disId, 'dist', dId, pId),
            direccion: ubi.direccion || comprador.direccion || "—",
            agencia: logi.agencia || comprador.agencia || "—",
            referencia: ubi.referencia || comprador.referencia || "—",
        };

        return { dist, cats };
    };

    const agruparPorCategoria = (productosDePedido) => {
        if (!productosDePedido || !catalogoProductos.length) return [];
        const grupos = {};
        productosDePedido.forEach(p => {
            const pid = obtenerIdPuro(p.producto_id || p.id || p._id);
            const prodReal = catalogoProductos.find(cp => obtenerIdPuro(cp) === pid);
            const cat = (prodReal?.categoria?.nombre || prodReal?.categoria) || 'Sin Categoría';
            if (!grupos[cat]) grupos[cat] = { nombre: cat, cantidadTotal: 0 };
            grupos[cat].cantidadTotal += (p.cantidad || 0);
        });
        return Object.values(grupos);
    };

    const guardarCotizacion = async () => {
        try {
            const pActualizados = pedidoSeleccionado.productos.map(p => {
                const pid = obtenerIdPuro(p.producto_id || p.id || p._id);
                const prodReal = catalogoProductos.find(cp => obtenerIdPuro(cp) === pid);

                // Normalizamos el nombre de la categoría para buscar el precio
                const rawCat = prodReal?.categoria?.nombre || prodReal?.categoria || 'Sin Categoría';
                const nombreCat = rawCat.trim().toLowerCase() === 'láminas educativas'.toLowerCase()
                    ? 'Láminas Educativas'
                    : rawCat;

                const precio = preciosCategorias[nombreCat] || 0;

                return {
                    producto_id: pid,      // ID limpio como texto
                    cantidad: p.cantidad || 0,
                    precio_unitario: precio // Snake case para el Backend
                };
            });

            const nuevoMontoTotal = pActualizados.reduce((acc, p) => acc + (p.precio_unitario * p.cantidad), 0);

            await axiosInstance.put(`/orders/${pedidoSeleccionado._id || pedidoSeleccionado.id}`, {
                productos: pActualizados,
                monto_total: nuevoMontoTotal, // Snake case para el Backend
                estado: 'COTIZADO'
            });

            Swal.fire('¡Okey!', 'Cotización guardada exitosamente.', 'success');
            setPedidoSeleccionado(null);
            fetchPedidos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar.', 'error');
        }
    };

    const eliminarPedido = async (id) => {
        const result = await Swal.fire({ title: '¿Eliminar pedido?', text: "Acción permanente.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Sí, eliminar' });
        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/orders/${id}`);
                setPedidos(pedidos.filter(p => (p._id || p.id) !== id));
                Swal.fire('Borrado', 'El pedido ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    };

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const categoriasAgrupadas = agruparPorCategoria(pedidoSeleccionado?.productos);
    const granTotal = categoriasAgrupadas.reduce((acc, cat) => acc + (cat.cantidadTotal * (preciosCategorias[cat.nombre] || 0)), 0);

    return (
        <div className="admin-users-view">
            <style>
                {`
                    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                `}
            </style>

            <div className="users-header">
                <h1 className="users-titulo">Gestión de Órdenes <span className="users-count">({pedidos.length})</span></h1>
            </div>

            <div className="users-tabla-wrapper">
                <table className="users-tabla">
                    <thead>
                        <tr>
                            <th>Ticket</th>
                            <th>Fecha</th>
                            <th>Comprador</th>
                            <th>Vendedor</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>Cargando datos...</td></tr>
                        ) : pedidos.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>No hay órdenes.</td></tr>
                        ) : (
                            pedidos.map(pedido => {
                                const idPedido = pedido._id || pedido.id;
                                const activoPDF = idPedidoParaPDF === idPedido;

                                return (
                                    <tr key={idPedido}>
                                        <td><strong>{idPedido.slice(-6).toUpperCase()}</strong></td>
                                        <td>{formatoFecha(pedido.fecha || pedido.createdAt)}</td>
                                        <td>{pedido.comprador?.nombre || '—'}</td>
                                        <td>{pedido.vendedor?.nombre || '—'} {pedido.vendedor?.apellidos || ''}</td>
                                        <td style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>S/ {(pedido.monto_total || pedido.montoTotal || 0).toFixed(2)}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold',
                                                backgroundColor: pedido.estado === 'PENDIENTE_PRECIO' ? '#fff3cd' : '#cfe2ff',
                                                color: pedido.estado === 'PENDIENTE_PRECIO' ? '#856404' : '#084298'
                                            }}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td>
                                            {!activoPDF ? (
                                                <button
                                                    style={{ padding: '6px 10px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#eee', border: '1px solid #ccc', cursor: 'pointer' }}
                                                    onClick={() => setIdPedidoParaPDF(idPedido)}
                                                >
                                                    📄 Preparar PDF
                                                </button>
                                            ) : (
                                                (() => {
                                                    const { dist, cats } = mapearDatosParaPDF(pedido);
                                                    return <PedidoPDF distribuidor={dist} categorias={cats} />;
                                                })()
                                            )}
                                        </td>
                                        <td style={{ display: 'flex', gap: '5px' }}>
                                            <button className="btn-editar" onClick={() => setPedidoSeleccionado(pedido)}>Cotizar</button>
                                            <button className="btn-eliminar" style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }} onClick={() => eliminarPedido(idPedido)}>Borrar</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {pedidoSeleccionado && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '95%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setPedidoSeleccionado(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>

                        <div style={{ marginBottom: '20px', borderBottom: '2px solid #7AB433', paddingBottom: '15px' }}>
                            <h2 style={{ margin: '0 0 15px 0', color: '#3a5a0a', fontSize: '20px' }}>
                                Orden de Compra #{(pedidoSeleccionado._id || pedidoSeleccionado.id).slice(-6).toUpperCase()}
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#7AB433', fontSize: '12px', textTransform: 'uppercase' }}>👤 Distribuidor</h4>
                                    <p style={{ margin: 0, fontSize: '13px' }}><strong>{pedidoSeleccionado.comprador?.nombre || '—'}</strong></p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>RUC/DNI: {pedidoSeleccionado.comprador?.ruc_dni || '—'}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Tel: {pedidoSeleccionado.comprador?.celular || '—'}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Email: {pedidoSeleccionado.comprador?.email || '—'}</p>
                                </div>

                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#7AB433', fontSize: '12px', textTransform: 'uppercase' }}>🤝 Vendedor</h4>
                                    <p style={{ margin: 0, fontSize: '13px' }}><strong>{pedidoSeleccionado.vendedor?.nombre || '—'} {pedidoSeleccionado.vendedor?.apellidos || ''}</strong></p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>DNI: {pedidoSeleccionado.vendedor?.dni || '—'}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Email: {pedidoSeleccionado.vendedor?.email || '—'}</p>
                                </div>

                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#7AB433', fontSize: '12px', textTransform: 'uppercase' }}>📍 Ubicación</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#333' }}>
                                        {`${resolverNombreUbigeo(pedidoSeleccionado.comprador?.departamento, 'dep')}, ${resolverNombreUbigeo(pedidoSeleccionado.comprador?.provincia, 'prov', pedidoSeleccionado.comprador?.departamento)}, ${resolverNombreUbigeo(pedidoSeleccionado.comprador?.distrito, 'dist', pedidoSeleccionado.comprador?.departamento, pedidoSeleccionado.comprador?.provincia)}`}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{pedidoSeleccionado.comprador?.direccion || '—'}</p>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#888', fontStyle: 'italic' }}>Ref: {pedidoSeleccionado.comprador?.referencia || '—'}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button onClick={() => setVistaModal('cotizar')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: vistaModal === 'cotizar' ? '#7AB433' : '#eee', color: vistaModal === 'cotizar' ? 'white' : '#666' }}>💰 Cotización Grupal</button>
                            <button onClick={() => setVistaModal('detalle')} style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: vistaModal === 'detalle' ? '#3a5a0a' : '#eee', color: vistaModal === 'detalle' ? 'white' : '#666' }}>📋 Inventario Detalle</button>
                        </div>

                        <div style={{ minHeight: '350px' }}>
                            {vistaModal === 'cotizar' ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead style={{ backgroundColor: '#7AB433', color: 'white' }}>
                                        <tr>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Categoría</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Ejemplares</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>P. Unit Sugerido</th>
                                            <th style={{ padding: '12px', textAlign: 'right' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoriasAgrupadas.map(cat => (
                                            <tr key={cat.nombre} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '12px' }}><strong>{cat.nombre}</strong></td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{cat.cantidadTotal} unid.</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    S/ <input type="number" step="0.01" value={preciosCategorias[cat.nombre] || ''} placeholder="0.00" onChange={(e) => handleActualizarPrecios(cat.nombre, e.target.value)} onFocus={(e) => e.target.select()} style={{ width: '100px', padding: '8px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '5px' }} />
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>S/ {(cat.cantidadTotal * (preciosCategorias[cat.nombre] || 0)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                        <thead style={{ backgroundColor: '#3a5a0a', color: 'white', position: 'sticky', top: 0 }}>
                                            <tr>
                                                <th style={{ padding: '12px', textAlign: 'left' }}>Item (Código)</th>
                                                <th style={{ padding: '12px', textAlign: 'center' }}>Cant.</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>P. Unit</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedidoSeleccionado.productos?.map((p, i) => {
                                                const pid = obtenerIdPuro(p.producto_id || p.id || p._id);
                                                const prodReal = catalogoProductos.find(cp => obtenerIdPuro(cp) === pid);
                                                const nomCat = prodReal?.categoria?.nombre || prodReal?.categoria || 'Sin Categoría';
                                                const pre = preciosCategorias[nomCat] || 0;
                                                return (
                                                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '10px' }}><strong>{prodReal?.item || p.item || '—'}</strong></td>
                                                        <td style={{ padding: '10px', textAlign: 'center' }}>{p.cantidad}</td>
                                                        <td style={{ padding: '10px', textAlign: 'right' }}>S/ {pre.toFixed(2)}</td>
                                                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>S/ {(p.cantidad * pre).toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#3a5a0a', color: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>MONTO TOTAL:</span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>S/ {granTotal.toFixed(2)}</span>
                        </div>

                        <button onClick={guardarCotizacion} style={{ width: '100%', marginTop: '15px', padding: '14px', backgroundColor: '#7AB433', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                            ✅ Guardar y Enviar Cotización
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPedidos;
