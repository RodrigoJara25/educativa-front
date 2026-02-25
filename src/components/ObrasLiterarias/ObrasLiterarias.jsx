import "./ObrasLiterarias.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { obrasLiterariasMock } from "../../data/obrasLiterariasMock";

function ObrasLiterarias({ onRetroceder, onContinuar }) {
    return (
        <>
            <PageSectionDistribuidores titulo={"OBRAS LITERARIAS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos items={obrasLiterariasMock} />
            </PageSectionDistribuidores>
        </>
    );
}

export default ObrasLiterarias;
