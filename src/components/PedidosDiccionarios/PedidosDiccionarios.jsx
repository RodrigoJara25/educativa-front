import "./PedidosDiccionarios.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { useOrder } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

function PedidosDiccionarios({ onContinuar, onRetroceder }) {
    const { cantidades, updateCantidad } = useOrder();
    const { productos, loading } = useProducts();

    if (loading) return <p>Cargando productos...</p>

    const diccionarios = productos.filter(p => p.categoria?.nombre === 'Diccionarios');

    const externalCantidades = diccionarios.map(diccionario => cantidades[diccionario.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = diccionarios[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo="DICCIONARIOS" onContinuar={onContinuar} onRetroceder={onRetroceder}>
                <TablaPedidos
                    items={diccionarios}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}

export default PedidosDiccionarios;