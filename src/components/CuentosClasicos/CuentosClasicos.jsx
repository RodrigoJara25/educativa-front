import "./CuentosClasicos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosClasicosMock } from "../../data/cuentosClasicosMock";

function CuentosClasicos({ onRetroceder, onContinuar }) {
    const items = cuentosClasicosMock;

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS CLÁSICOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos items={items} />
            </PageSectionDistribuidores>
        </>
    );
}


export default CuentosClasicos;
