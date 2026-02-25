import "./ObrasLiterarias.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { obrasLiterariasMock } from "../../data/obrasLiterariasMock";
import { useOrder } from "../../context/OrderContext";

function ObrasLiterarias({ onRetroceder, onContinuar }) {
    const { cantidades, updateCantidad } = useOrder();
    const items = obrasLiterariasMock;

    const externalCantidades = items.map(item => cantidades[item.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = items[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"OBRAS LITERARIAS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos
                    items={items}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}

export default ObrasLiterarias;
