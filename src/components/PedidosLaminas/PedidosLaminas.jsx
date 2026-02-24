import "./PedidosLaminas.scss"
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores"
import LaminasLayout from "../LaminasLayout/LaminasLayout"

function PedidosLaminas({ onContinuar, onRetroceder }) {
    return (
        <>
            <PageSectionDistribuidores titulo="LÁMINAS" onContinuar={onContinuar} onRetroceder={onRetroceder}>
                <div className="pedidos-laminas">
                    <LaminasLayout />
                </div>
            </PageSectionDistribuidores>
        </>
    );
}

export default PedidosLaminas;