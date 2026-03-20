import "./LaminasLayout.scss";
import { useOrder } from "../../context/OrderContext";
import { laminasMock } from "../../data/laminasMock";

function LaminasLayout() {
    const { cantidades, updateCantidad } = useOrder();

    const laminasPorSubcategoria = laminasMock;

    const handleCantidadChange = (laminaId, value) => {
        updateCantidad(laminaId, value);
    }

    const handleKeyDown = (e) => {
        // Obtenemos los atributos que nos dirán en qué categoría y fila estamos
        const numFilas = parseInt(e.target.dataset.filas);
        const totalSub = parseInt(e.target.dataset.total);
        const localIndex = parseInt(e.target.dataset.index);

        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex !== -1 && currentIndex + 1 < inputs.length) {
                inputs[currentIndex + 1].focus();
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex > 0) {
                inputs[currentIndex - 1].focus();
            }
        } else if (e.key === "ArrowRight") {
            const nextIndex = localIndex + numFilas;
            if (nextIndex < totalSub) { // Verificamos que no se salga de la categoría
                e.preventDefault();
                const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
                const globalCurrentIndex = inputs.indexOf(e.target);
                // El salto global es el mismo salto local
                inputs[globalCurrentIndex + numFilas].focus();
            }
        } else if (e.key === "ArrowLeft") {
            const prevIndex = localIndex - numFilas;
            if (prevIndex >= 0) { // Verificamos que no retroceda más allá del inicio de la categoría
                e.preventDefault();
                const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
                const globalCurrentIndex = inputs.indexOf(e.target);
                inputs[globalCurrentIndex - numFilas].focus();
            }
        }
    };

    const calcularTotalSub = (laminasLista) =>
        laminasLista.reduce((acc, lam) => acc + (cantidades[lam.id] || 0), 0);


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
                                {subcategoria.laminas.map((lamina, index) => (
                                    <div key={lamina.id} className="lamina-item">
                                        <span className="lamina-item-code">{lamina.item}</span>
                                        <input
                                            type="number"
                                            className="lamina-item-cantidad"
                                            data-index={index}
                                            data-filas={numFilas}
                                            data-total={subcategoria.laminas.length}
                                            value={cantidades[lamina.id] || ""}
                                            onChange={(e) => handleCantidadChange(lamina.id, e.target.value)}
                                            onKeyDown={handleKeyDown}
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