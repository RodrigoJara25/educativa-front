import "./LaminasLayout.scss";
import { laminasMock } from "../../data/laminasMock";
import { useOrder } from "../../context/OrderContext";

function LaminasLayout() {
    const { cantidades, updateCantidad } = useOrder();
    const laminasPorSubcategoria = laminasMock;

    const handleCantidadChange = (laminaId, value) => {
        updateCantidad(laminaId, value);
    }

    const calcularTotalSub = (laminas) =>
        laminas.reduce((acc, lam) => acc + (cantidades[lam.id] || 0), 0);

    return (
        <>
            <div className="laminas-subactegorias-layout">
                {laminasPorSubcategoria.map((subcategoria) => {
                    const numCols = 10
                    const numFilas = Math.ceil(subcategoria.laminas.length / numCols)
                    const subId = subcategoria.subcategoria._id
                    return (
                        <div key={subId} className="laminas-subcategorias">
                            <h2 className="laminas-subactegorias-titulo">{subcategoria.subcategoria.nombre}</h2>
                            <div className="laminas-grid" style={{ gridTemplateRows: `repeat(${numFilas}, auto)` }}>
                                {subcategoria.laminas.map((lamina) => (
                                    <div key={lamina.id} className="lamina-item">
                                        <span className="lamina-item-code">{lamina.item}</span>
                                        <input
                                            type="number"
                                            className="lamina-item-cantidad"
                                            value={cantidades[lamina.id] || ""}
                                            onChange={(e) => handleCantidadChange(lamina.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="laminas-total">
                                <span>TOTAL</span>
                                <span className="laminas-total-valor">
                                    {calcularTotalSub(subcategoria.laminas) === 0 ? "" : calcularTotalSub(subcategoria.laminas)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default LaminasLayout;