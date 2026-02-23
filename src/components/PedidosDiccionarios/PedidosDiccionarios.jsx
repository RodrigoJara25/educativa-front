import "./PedidosDiccionarios.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";

function PedidosDiccionarios({ onContinuar, onRetroceder }) {

    const diccionarios = [
        { item: "D-ESP", titulo: "Diccionario Ilustrado de Espanol" },
        { item: "D-ENG", titulo: "Diccionario Ilustrado de Ingles" },
        { item: "D-SIN", titulo: "Diccionario Ilustrado de Sinonimos, Antonimos y Paronimos" }
    ]

    return (
        <>
            <PageSectionDistribuidores titulo="DICCIONARIOS" onContinuar={onContinuar} onRetroceder={onRetroceder}>
                <TablaPedidos items={diccionarios} />
            </PageSectionDistribuidores>
        </>
    );
}

export default PedidosDiccionarios;