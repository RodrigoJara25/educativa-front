import "./CuentosClasicos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { useOrder } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

function CuentosClasicos({ onRetroceder, onContinuar }) {
    const { cantidades, updateCantidad } = useOrder();
    const { productos, loading } = useProducts();

    if (loading) return <p>Cargando productos...</p>

    // Filtramos SOLO los que pertenezcan a "Cuentos Clásicos"
    // Verifica que en MongoDB tengas la propiedad "categoria" para filtrarlos correctamente
    const items = productos.filter(p => p.categoria?.nombre === 'Cuentos Clásicos');

    const externalCantidades = items.map(item => cantidades[item.id] || 0);

    const handleCantidadChange = (index, valor) => {
        const item = items[index];
        updateCantidad(item.id, valor);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS CLÁSICOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <TablaPedidos
                    items={items}
                    externalCantidades={externalCantidades}
                    onCantidadChange={handleCantidadChange}
                />
            </PageSectionDistribuidores>
        </>
    );
}


export default CuentosClasicos;
