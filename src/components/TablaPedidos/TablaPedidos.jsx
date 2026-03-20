import "./TablaPedidos.scss";
import { useState } from "react";

function TablaPedidos({ items, externalCantidades, onCantidadChange, showFooter = true, customTotal, precision = 0, readOnly = false }) {

    const [internalCantidades, setInternalCantidades] = useState(items.map(() => 0))

    const cantidades = externalCantidades || internalCantidades;

    const handleCantidadChange = (index, value) => {
        if (onCantidadChange) {
            onCantidadChange(index, value)
        } else {
            const newCantidades = [...internalCantidades]
            newCantidades[index] = Number(value) || 0
            setInternalCantidades(newCantidades)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".tabla-pedidos-input"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex !== -1 && currentIndex + 1 < inputs.length) {
                inputs[currentIndex + 1].focus();
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".tabla-pedidos-input"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex > 0) {
                inputs[currentIndex - 1].focus();
            }
        }
    };

    const localTotalRaw = cantidades.reduce((acc, curr) => acc + curr, 0)
    const localTotal = precision > 0 ? localTotalRaw.toFixed(precision) : localTotalRaw
    const totalMostrado = customTotal !== undefined ? customTotal : localTotal

    return (
        <div className="tabla-pedidos">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Titulo</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.item}</td>
                            <td>{item.titulo}</td>
                            <td>
                                {readOnly ? (
                                    <span style={{ display: "inline-block", textAlign: "center", width: "100%", fontWeight: "bold" }}>
                                        {cantidades[index] === 0 ? "0" : cantidades[index]}
                                    </span>
                                ) : (
                                    <input
                                        type="number"
                                        className="tabla-pedidos-input"
                                        value={cantidades[index] === 0 ? "" : cantidades[index]}
                                        onChange={(e) => handleCantidadChange(index, e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                {showFooter && (
                    <tfoot>
                        <tr className="tfoot-spacer">
                            <td colSpan={3}></td>
                        </tr>
                        <tr>
                            <td className="td-total-empty"></td>
                            <td className="td-total-label">
                                <div className="total-box">TOTAL</div>
                            </td>
                            <td className="td-total-valor">
                                <div className="valor-box">{totalMostrado}</div>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

export default TablaPedidos;
