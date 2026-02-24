import "./CuentosEcologicos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosEcologicosMock } from "../../data/cuentosEcologicosMock";

function CuentosEcologicos({ onRetroceder, onContinuar }) {
    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS ECOLÓGICOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos items={cuentosEcologicosMock} />
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosEcologicos;
