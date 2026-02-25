import "./CuentosClasicos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosClasicosMock } from "../../data/cuentosClasicosMock";
import { useOrder } from "../../context/OrderContext";

function CuentosClasicos({ onRetroceder, onContinuar }) {
    const { cantidades, updateCantidad } = useOrder();
    const items = cuentosClasicosMock;

    const externalCantidades = items.map(item => cantidades[item.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = items[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS CLÁSICOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos
                    items={items}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}


export default CuentosClasicos;
