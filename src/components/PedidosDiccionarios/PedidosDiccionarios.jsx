import "./PedidosDiccionarios.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { diccionariosMock } from "../../data/diccionariosMock";
import { useOrder } from "../../context/OrderContext";

function PedidosDiccionarios({ onContinuar, onRetroceder }) {
    const { cantidades, updateCantidad } = useOrder();
    const diccionarios = diccionariosMock;

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