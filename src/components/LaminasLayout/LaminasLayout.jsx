import "./LaminasLayout.scss";
import { useState } from "react";
import { laminasMock } from "../../data/laminasMock";

function LaminasLayout() {

    const laminasPorSubcategoria = laminasMock;

    const [cantidades, setCantidades] = useState(
        Object.fromEntries(
            laminasMock.map(sub => [
                sub.subcategoria._id,
                sub.laminas.map(() => 0)
            ])
        )
    )

    const handleCantidadChange = (subId, index, value) => {
        setCantidades(prev => ({
            ...prev,
            [subId]: prev[subId].map((cant, i) => i === index ? Number(value) || 0 : cant)
        }))
    }

    const totalPorSub = (subId) =>
        cantidades[subId]?.reduce((acc, curr) => acc + curr, 0) ?? 0

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
                                            value={cantidades[subId]?.[index] || ""}
                                            onChange={(e) => handleCantidadChange(subId, index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="laminas-total">
                                <span>TOTAL</span>
                                <span className="laminas-total-valor">
                                    {totalPorSub(subId) === 0 ? "" : totalPorSub(subId)}
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