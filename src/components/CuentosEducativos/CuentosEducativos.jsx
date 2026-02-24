import "./CuentosEducativos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosEducativosMock } from "../../data/cuentosEducativosMock";

function CuentosEducativos({ onRetroceder, onContinuar }) {
    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS EDUCATIVOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos items={cuentosEducativosMock} />
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosEducativos;
