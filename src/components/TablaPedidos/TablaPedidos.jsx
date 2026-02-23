import "./TablaPedidos.scss";
import { useState } from "react";

function TablaPedidos({ items }) {

    const [cantidades, setCantidades] = useState(items.map(() => 0))

    const handleCantidadChange = (index, value) => {
        const newCantidades = [...cantidades]
        newCantidades[index] = Number(value) || 0
        setCantidades(newCantidades)
    }

    const total = cantidades.reduce((acc, curr) => acc + curr, 0)

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
                                <input
                                    type="number"
                                    value={cantidades[index] === 0 ? "" : cantidades[index]}
                                    onChange={(e) => handleCantidadChange(index, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
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
                            <div className="valor-box">{total}</div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default TablaPedidos;
