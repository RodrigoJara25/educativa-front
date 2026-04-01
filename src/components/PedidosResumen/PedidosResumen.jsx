import Swal from "sweetalert2";
import "./PedidosResumen.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import PedidoPDF from "../PedidoPDF/PedidoPDF";
import { useOrder } from "../../context/OrderContext";
import { laminasMock } from "../../data/laminasMock"; // MANTENEMOS LÁMINAS EN MOCK
import { useProducts } from "../../context/ProductContext"; // Reemplazo Dinámico Backend
import logoHormiga from "../../assets/images/logo.png";
import ubigeo from "ubigeo-peru";
import axiosInstance from "../../config/axios"; // Añadimos el conector del backend

function PedidosResumen({ onRetroceder, onContinuar }) {
    const { cantidades, distribuidor } = useOrder();
    const { productos } = useProducts(); // Obtenemos el catálogo real

    // ── Resolver nombres de ubigeo ──────────────────────────────────────────
    const data = ubigeo.reniec;

    const nombreDepartamento = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === "00"
            && d.distrito === "00"
    )?.nombre || distribuidor.departamento || "—";

    const nombreProvincia = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === distribuidor.provincia
            && d.distrito === "00"
    )?.nombre || distribuidor.provincia || "—";

    const nombreDistrito = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === distribuidor.provincia
            && d.distrito === distribuidor.distrito
    )?.nombre || distribuidor.distrito || "—";

    const distribuidorParaPDF = {
        ...distribuidor,
        departamento: nombreDepartamento,
        provincia: nombreProvincia,
        distrito: nombreDistrito,
    };

    // Helper Dinámico para buscar la categoría y sumar leyendo la BD
    const sumarCategoriaDinamica = (nombreCat) => {
        const catProducts = productos.filter(p => p.categoria?.nombre === nombreCat || p.categoria === nombreCat);
        return catProducts.reduce((acc, item) => acc + (cantidades[item.id || item._id] || 0), 0);
    };

    // Helper Híbrido Estático solo para Láminas
    const sumarLaminas = () => {
        return laminasMock.reduce((acc, sub) => {
            return acc + sub.laminas.reduce((accSub, lam) => accSub + (cantidades[lam.id] || 0), 0);
        }, 0);
    };

    // Construimos datos de TablaPedidos con mezcla Híbrida 
    const itemsResumen = [
        { item: "RES-DICC", titulo: "Diccionarios", cantidad: sumarCategoriaDinamica('Diccionarios') },
        { item: "RES-LAMI", titulo: "Láminas", cantidad: sumarLaminas() },
        { item: "RES-CLAS", titulo: "Cuentos Clásicos", cantidad: sumarCategoriaDinamica('Cuentos Clásicos') },
        { item: "RES-LITE", titulo: "Obras Literarias", cantidad: sumarCategoriaDinamica('Obras Literarias') },
        { item: "RES-SELE", titulo: "Cuentos Selectos", cantidad: sumarCategoriaDinamica('Cuentos Selectos') },
        { item: "RES-ECOL", titulo: "Cuentos Ecológicos", cantidad: sumarCategoriaDinamica('Cuentos Ecológicos') },
        { item: "RES-EDUC", titulo: "Cuentos Educativos", cantidad: sumarCategoriaDinamica('Cuentos Educativos') },
        { item: "RES-INFA", titulo: "Cuentos Infantiles", cantidad: sumarCategoriaDinamica('Cuentos Infantiles') },
    ];

    // Calculamos el total general
    const totalGeneral = itemsResumen.reduce((acc, curr) => acc + curr.cantidad, 0);

    // Helper para armar los arrays de Items leyendo de BackEnd:
    const armarCategoriaPDF = (nombreCat) => {
        const catProducts = productos.filter(p => p.categoria?.nombre === nombreCat || p.categoria === nombreCat);
        return catProducts.map(p => ({
            item: p.item || "-",
            titulo: p.titulo || p.nombre,
            cantidad: cantidades[p.id || p._id] || 0
        }));
    };

    // ── Preparamos los datos para el PDF Híbrido ──────────────────────────────
    const categoriasPDF = [
        {
            nombre: "Láminas",
            soloItem: true,
            items: laminasMock.reduce((acc, sub) => {
                acc.push({ tipo: 'etiqueta', nombre: sub.subcategoria.nombre.toUpperCase() });
                sub.laminas.forEach(lam => {
                    // BUSCAMOS EL ID REAL DE MONGO QUE TIENE ESTE ITEM (CÓDIGO)
                    const productoReal = productos.find(p => p.item === lam.item);
                    const idReal = productoReal?.id || productoReal?._id;

                    acc.push({
                        tipo: 'item',
                        item: lam.item,
                        cantidad: idReal ? (cantidades[idReal] || 0) : 0
                    });
                });
                return acc;
            }, [])
        },
        // Cuarteto: 4 categorías en una sola página, layout 2×2
        {
            tipo: 'cuarteto',
            nombre: 'Libros',
            cuarteto: [
                { nombre: "Cuentos Clásicos", items: armarCategoriaPDF("Cuentos Clásicos") },
                { nombre: "Obras Literarias", items: armarCategoriaPDF("Obras Literarias") },
                { nombre: "Cuentos Infantiles", items: armarCategoriaPDF("Cuentos Infantiles") },
                { nombre: "Diccionarios", items: armarCategoriaPDF("Diccionarios") },
            ]
        },
        {
            nombre: "Cuentos Selectos",
            dobleTabla: true,
            items: armarCategoriaPDF("Cuentos Selectos")
        },
        // Dueto
        {
            tipo: 'cuarteto',
            nombre: 'Cuentos Ecológicos y Educativos',
            cuarteto: [
                { nombre: "Cuentos Ecológicos", items: armarCategoriaPDF("Cuentos Ecológicos") },
                { nombre: "Cuentos Educativos", items: armarCategoriaPDF("Cuentos Educativos") },
            ]
        },
    ];

    // Función para finalizar y enviar el pedido real al Backend
    const handleFinalizar = () => {
        // Sacamos el ID del usuario distribuidor desde la llave correcta 'usuario_educativa'
        const userStored = localStorage.getItem('usuario_educativa');
        const userParsed = userStored ? JSON.parse(userStored) : {};

        // El ID puede venir como .id o ._id dependiendo del transform del backend
        const idComprador = userParsed.id || userParsed._id || distribuidor.id || distribuidor._id;

        // Estructura exacta solicitada por el programador de Backend
        const pedidoFinal = {
            tipo_pedido: "DISTRIBUIDOR",
            comprador_id: idComprador,
            onModel: "distribuidores", // En minúsculas y plural
            productos: Object.keys(cantidades)
                .filter(id => cantidades[id] > 0)
                .map(id => ({
                    producto_id: id, // Llave exacta solicitada
                    cantidad: Number(cantidades[id])
                }))
        };

        Swal.fire({
            title: '¿Seguro que quieres confirmar el pedido?',
            text: "Una vez confirmado, se enviará directamente a la distribuidora.",
            imageUrl: logoHormiga,
            imageWidth: 250,
            imageHeight: 'auto',
            imageAlt: 'Logo Educativa',
            showCancelButton: true,
            confirmButtonColor: '#7A9A37',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, enviar pedido',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => { // Lo volvemos asíncrono
            if (result.isConfirmed) {
                try {
                    // 3. Disparamos la carga al super backend! (Él asignará la comisión solito)
                    const respuesta = await axiosInstance.post('/orders', pedidoFinal);

                    Swal.fire(
                        '¡Pedido Enviado!',
                        'Tu orden ha sido registrada. ID de Ticket: ' + (respuesta.data?._id || respuesta.data?.id || 'Generado'),
                        'success'
                    );

                    // Opcionalmente podemos resetear el carrito aquí o redirigir
                    // window.location.href = "/pedidos-distribuidores";
                } catch (error) {
                    console.error("Error el tratar de enviar el post del pedido:", error);
                    Swal.fire('Ocurrió un Error', 'No se pudo enviar el pedido al servidor.', 'error');
                }
            }
        });
    };

    return (
        <PageSectionDistribuidores
            titulo="RESUMEN DEL PEDIDO"
            onRetroceder={onRetroceder}
            onContinuar={handleFinalizar}
            textoContinuar="FINALIZAR COMPRA"
        >
            <div className="pedidos-resumen-container">
                <TablaPedidos
                    items={itemsResumen}
                    externalCantidades={itemsResumen.map(i => i.cantidad)}
                    showFooter={true}
                    customTotal={totalGeneral}
                    readOnly={true}
                />

                {/* ── Botón para descargar el PDF ──────────────────────────────
                  Pasamos distribuidorParaPDF (con nombres legibles, no códigos)
                  y categorias con todos los items del pedido.
                */}
                <div className="pedidos-resumen-pdf">
                    <PedidoPDF
                        distribuidor={distribuidorParaPDF}
                        categorias={categoriasPDF}
                    />
                </div>
            </div>
        </PageSectionDistribuidores>
    );
}

export default PedidosResumen;
