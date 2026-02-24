import "./CuentosInfantiles.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosInfantilesMock } from "../../data/cuentosInfantilesMock";

function CuentosInfantiles({ onRetroceder, onContinuar }) {
    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS INFANTILES"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos items={cuentosInfantilesMock} />
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosInfantiles;
