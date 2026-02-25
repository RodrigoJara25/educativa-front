import "./CuentosEcologicos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosEcologicosMock } from "../../data/cuentosEcologicosMock";
import { useOrder } from "../../context/OrderContext";

function CuentosEcologicos({ onRetroceder, onContinuar }) {
    const { cantidades, updateCantidad } = useOrder();
    const items = cuentosEcologicosMock;

    const externalCantidades = items.map(item => cantidades[item.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = items[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS ECOLÓGICOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos
                    items={items}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosEcologicos;
