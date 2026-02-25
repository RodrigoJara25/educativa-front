import "./PedidosResumen.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { useOrder } from "../../context/OrderContext";
import { diccionariosMock } from "../../data/diccionariosMock";
import { laminasMock } from "../../data/laminasMock";
import { cuentosClasicosMock } from "../../data/cuentosClasicosMock";
import { obrasLiterariasMock } from "../../data/obrasLiterariasMock";
import { cuentosSelectosMock } from "../../data/cuentosSelectosMock";
import { cuentosEcologicosMock } from "../../data/cuentosEcologicosMock";
import { cuentosEducativosMock } from "../../data/cuentosEducativosMock";
import { cuentosInfantilesMock } from "../../data/cuentosInfantilesMock";

function PedidosResumen({ onRetroceder, onContinuar }) {
    const { cantidades, distribuidor } = useOrder();

    // Helper para sumar cantidades por categoría
    const sumarCategoria = (mockData, prefix) => {
        // Si el mock es un array simple de items (como libros)
        if (Array.isArray(mockData[0]?.laminas)) {
            // Caso especial para Láminas que tienen subcategoras
            return mockData.reduce((acc, sub) => {
                return acc + sub.laminas.reduce((accSub, lam) => accSub + (cantidades[lam.id] || 0), 0);
            }, 0);
        }

        return mockData.reduce((acc, item) => acc + (cantidades[item.id] || 0), 0);
    };

    // Construimos los datos para la TablaPedidos de resumen
    const itemsResumen = [
        { item: "CIV-01", titulo: "Diccionarios", cantidad: sumarCategoria(diccionariosMock) },
        { item: "CIV-02", titulo: "Láminas", cantidad: sumarCategoria(laminasMock) },
        { item: "CIV-03", titulo: "Cuentos Clásicos", cantidad: sumarCategoria(cuentosClasicosMock) },
        { item: "CIV-04", titulo: "Obras Literarias", cantidad: sumarCategoria(obrasLiterariasMock) },
        { item: "CIV-05", titulo: "Cuentos Selectos", cantidad: sumarCategoria(cuentosSelectosMock) },
        { item: "CIV-06", titulo: "Cuentos Ecológicos", cantidad: sumarCategoria(cuentosEcologicosMock) },
        { item: "CIV-07", titulo: "Cuentos Educativos", cantidad: sumarCategoria(cuentosEducativosMock) },
        { item: "CIV-08", titulo: "Cuentos Infantiles", cantidad: sumarCategoria(cuentosInfantilesMock) },
    ];

    // Calculamos el total general
    const totalGeneral = itemsResumen.reduce((acc, curr) => acc + curr.cantidad, 0);

    // Función para finalizar y ver el JSON
    const handleFinalizar = () => {
        const pedidoFinal = {
            distribuidor: distribuidor,
            items: Object.keys(cantidades)
                .filter(id => cantidades[id] > 0) // Solo los que tienen cantidad
                .map(id => ({
                    id,
                    cantidad: cantidades[id]
                })),
            totalProductos: totalGeneral,
            fecha: new Date().toISOString()
        };

        console.log("📦 PEDIDO FINALIZADO:", pedidoFinal);
        alert("¡Pedido enviado a consola! Revisa el inspector (F12)");
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
                />
            </div>
        </PageSectionDistribuidores>
    );
}

export default PedidosResumen;
