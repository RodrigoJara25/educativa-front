import "./PedidosDiccionarios.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { diccionariosMock } from "../../data/diccionariosMock";

function PedidosDiccionarios({ onContinuar, onRetroceder }) {

    const diccionarios = diccionariosMock;


    return (
        <>
            <PageSectionDistribuidores titulo="DICCIONARIOS" onContinuar={onContinuar} onRetroceder={onRetroceder}>
                <TablaPedidos items={diccionarios} />
            </PageSectionDistribuidores>
        </>
    );
}

export default PedidosDiccionarios;