import "./CuentosInfantiles.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { useOrder } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

function CuentosInfantiles({ onRetroceder, onContinuar }) {
    const { cantidades, updateCantidad } = useOrder();
    const { productos, loading } = useProducts();

    if (loading) return <p>Cargando productos...</p>

    const items = productos.filter(p => p.categoria?.nombre === 'Cuentos Infantiles');

    const externalCantidades = items.map(item => cantidades[item.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = items[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS INFANTILES"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos
                    items={items}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosInfantiles;
